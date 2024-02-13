import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

// interface Option {
//   value: string;
//   label: string;
// }

interface MultiSelectProps {
  options: string[];
  children?: React.ReactNode;
  onChange: (selectedValues: string[]) => void;
}

const MultiSelect = ({ options, onChange, children }: MultiSelectProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(options);

  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    const selected = event.target.value as string[];
    setSelectedValues(selected);
    onChange(selected);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{children ?? 'options'}</InputLabel>
      <Select
        multiple
        value={selectedValues}
        onChange={handleSelectChange}
        renderValue={(selected) => (selected as string[]).join(', ')}
        label={children ?? 'options'}
      >
        {options
          .sort((a, b) => Number(a) - Number(b))
          .map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox color="info" checked={selectedValues.includes(option)} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelect;
