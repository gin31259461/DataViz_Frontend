import AutoCompleteSelect from '@/components/select/auto-complete-select';
import { useProjectStore } from '@/hooks/store/use-project-store';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { ChangeEventHandler, ComponentProps, useState } from 'react';

type ConceptHierarchyMapping = Record<string, string>;

interface AddConceptDialogProps extends Pick<ComponentProps<typeof Dialog>, 'open'> {
  conceptOptions?: string[];
  onCancel?: () => void;
  onClose?: () => void;
  onConfirm?: (selectedConcept: string, tags: string[], mapping: ConceptHierarchyMapping) => void;
}

const AddConceptDialog = (props: AddConceptDialogProps) => {
  const theme = useTheme();

  const [selectedConcept, setSelectedConcept] = useState<string | undefined>(undefined);
  const [conceptHierarchyMapping, setConceptHierarchyMapping] = useState<ConceptHierarchyMapping>({});
  const [tagValueInput, setTagValueInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const dataInfo = useProjectStore((state) => state.dataInfo);

  const handleTagsInput: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    setTagValueInput(event.target.value);
  };

  const handleClear = () => {
    setTags([]);
    setSelectedConcept(undefined);
    setTagValueInput('');
    setConceptHierarchyMapping({});
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth>
      <DialogTitle>Add new concept</DialogTitle>
      <DialogContent>
        <Box sx={{ padding: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <AutoCompleteSelect
            initialValue={selectedConcept}
            onChange={(value) => {
              setConceptHierarchyMapping({});
              setSelectedConcept(value);
            }}
            label="Column"
          >
            {props.conceptOptions}
          </AutoCompleteSelect>

          <Typography>Tags</Typography>
          <TextField
            fullWidth
            placeholder="ex. 高中以下,大專,研究所"
            onChange={handleTagsInput}
            value={tagValueInput}
          ></TextField>
          <Button onClick={() => setTags(tagValueInput.split(','))} color="info">
            Add tag
          </Button>

          <Typography>Order</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {tags.map((tag, i) => (
              <Typography color={theme.palette.info.main} key={i}>
                {tag}
              </Typography>
            ))}
          </Box>

          <Typography>Hierarchy</Typography>
          {selectedConcept &&
            dataInfo &&
            (dataInfo.columns[selectedConcept].values as string[]).map((value, i) => {
              return (
                <Grid container key={`${value}-${i}`}>
                  <Grid item xs={6}>
                    {value}
                  </Grid>
                  <Grid item xs={6}>
                    <AutoCompleteSelect
                      initialValue={conceptHierarchyMapping[value]}
                      onChange={(tag) => {
                        setConceptHierarchyMapping((prev) => ({ ...prev, [value]: tag }));
                      }}
                    >
                      {tags}
                    </AutoCompleteSelect>
                  </Grid>
                </Grid>
              );
            })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            if (props.onCancel) props.onCancel();
            handleClear();
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (props.onConfirm && props.onClose && selectedConcept) {
              props.onConfirm(selectedConcept, tags, conceptHierarchyMapping);
              props.onClose();
              handleClear();
            }
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddConceptDialog;
