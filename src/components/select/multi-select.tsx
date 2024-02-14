import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

interface MultiSelectProps {
  label?: string;
  children?: string[];
  onChange?: (selectedValues: string[]) => void;
}

const MultiSelect = ({ label = 'Options', onChange = () => {}, children = [] }: MultiSelectProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    const selected = event.target.value as string[];
    setSelectedValues(selected);
    onChange(selected);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={selectedValues}
        onChange={handleSelectChange}
        renderValue={(selected) => (selected as string[]).join(', ')}
        label={label}
      >
        {children
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
