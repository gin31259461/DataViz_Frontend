import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { Fragment, SyntheticEvent, useState } from 'react';

interface AutoCompleteSelectProps {
  loading: boolean;
  initialValueIndex?: number;
  options: string[];
  children?: React.ReactNode;
  onChange: (value: string) => void;
  onClear?: () => void;
}

const AutoCompleteSelect = ({
  initialValueIndex = 0,
  loading,
  options,
  onChange,
  children = 'Choose data',
  onClear = () => {},
}: AutoCompleteSelectProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string | null>(
    options.length > 0 ? options[initialValueIndex] : ''
  );

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
          label={children}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading && <CircularProgress color="info" size={20} />}
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
