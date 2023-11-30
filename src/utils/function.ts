export const emailValidation = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export default function convertOpacityToHexString(percentage: number): string {
  // 確保百分比在 0 到 100 之間
  const validPercentage = Math.max(0, Math.min(100, percentage));

  // 將百分比轉換為 alpha 值（0 到 255）
  const alpha = Math.round((validPercentage / 100) * 255);

  // 將 alpha 轉換為十六進位字串
  const hexAlpha = alpha.toString(16).padStart(2, '0');

  // 回傳十六進位 alpha 字串
  return hexAlpha;
}

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
        if (
          /^".*[^"]$/.test(column) ||
          /^[^"]*"$/.test(column.replace(/""/g, ''))
        ) {
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

export const bigIntToString = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => bigIntToString(item));
  }

  const convertedObj: any = {};

  for (const key in obj) {
    if (typeof obj[key] === 'bigint') {
      convertedObj[key] = obj[key].toString();
    } else if (typeof obj[key] === 'object') {
      convertedObj[key] = bigIntToString(obj[key]);
    } else {
      convertedObj[key] = obj[key];
    }
  }

  return convertedObj;
};
