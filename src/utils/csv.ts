export const isValidCsvString = (str: string) => {
  const rows = str.trim().split('\n');

  for (let i = 0; i < rows.length; i++) {
    const columns = rows[i].split(',');

    for (let j = 0; j < columns.length; j++) {
      const column = columns[j].trim();

      if (column.length === 0) {
        return false;
      }

      if (/^".*"$/.test(column)) {
        // check if ' ' pair
        if (/^".*[^"]$/.test(column) || /^[^"]*"$/.test(column.replace(/""/g, ''))) {
          return false;
        }
      } else {
        // if , or \n exist : use "" wrap the string
        if (column.includes(',') || column.includes('\n')) {
          return false;
        }
      }
    }
  }

  return true;
};

export const convertCsvToFile = (csvString: string) => {
  const csvBlob = new Blob([csvString], {
    type: 'text/csv',
  });
  const csvFile = new File([csvBlob], 'data.csv', {
    type: 'text/csv',
  });
  return csvFile;
};
