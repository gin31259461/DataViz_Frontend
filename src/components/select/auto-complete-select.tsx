import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { Fragment, SyntheticEvent, useState } from 'react';

interface AutoCompleteSelectProps {
  loading: boolean;
  initialValueIndex: number;
  options: string[];
  onChange: (value: string) => void;
}

const AutoCompleteSelect = ({ initialValueIndex, loading, options, onChange }: AutoCompleteSelectProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string | null>(options[initialValueIndex]);

  const handleInputChange = (event: SyntheticEvent<Element>, value: string) => {
    setInputValue(value);
  };

  const handleOptionChange = (event: SyntheticEvent, value: string | null) => {
    setSelectedValue(value);
    if (value) {
      onChange(value);
    }
  };

  return (
    <Autocomplete
      value={selectedValue || null}
      inputValue={inputValue}
      options={options}
      onChange={handleOptionChange}
      onInputChange={handleInputChange}
      loading={loading}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option}>
            {option}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="選擇資料"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default AutoCompleteSelect;
