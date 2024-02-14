import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { Fragment, SyntheticEvent, useState } from 'react';

interface AutoCompleteSelectProps {
  loading?: boolean;
  initialValue?: string;
  children?: string[];
  label?: React.ReactNode;
  onChange?: (value: string) => void;
  onClear?: () => void;
}

const AutoCompleteSelect = ({
  initialValue,
  loading = false,
  children = [],
  onChange = () => {},
  label = 'Options',
  onClear = () => {},
}: AutoCompleteSelectProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string | null>(() => {
    if (initialValue && children.length > 0) {
      const index = children.findIndex((value) => value === initialValue);

      if (index >= 0) {
        return children[index];
      }
    }

    return null;
  });

  const handleInputChange = (event: SyntheticEvent<Element>, value: string) => {
    setInputValue(value);
  };

  const handleOptionChange = (event: SyntheticEvent, value: string | null) => {
    setSelectedValue(value);

    if (value) onChange(value);
    else onClear();
  };

  return (
    <Autocomplete
      value={selectedValue}
      inputValue={inputValue}
      options={children}
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
