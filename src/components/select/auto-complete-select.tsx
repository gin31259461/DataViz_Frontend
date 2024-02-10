import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { Fragment, SyntheticEvent, useState } from 'react';

interface AutoCompleteSelectProps {
  loading: boolean;
  initialValueIndex: number;
  options: string[];
  label?: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

const AutoCompleteSelect = ({
  initialValueIndex,
  loading,
  options,
  onChange,
  onClear = () => {},
  label = 'Choose data',
}: AutoCompleteSelectProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string | null>(options[initialValueIndex]);

  const handleInputChange = (event: SyntheticEvent<Element>, value: string) => {
    setInputValue(value);
  };

  const handleOptionChange = (event: SyntheticEvent, value: string | null) => {
    console.log(value);
    setSelectedValue(value);
    if (!value) {
      onClear();
    } else {
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
          label={label}
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
