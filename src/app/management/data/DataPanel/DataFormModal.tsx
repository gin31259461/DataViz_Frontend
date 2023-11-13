import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';
import CsvInputFiled from './CsvInputField';

interface DataFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function DataFormModal({ open, onClose, onSubmit }: DataFormDialogProps) {
  const [file, setFile] = useState<File | string | null>(null);
  const [name, setName] = useState('');
  const [des, setDes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const formData = new FormData();
    if (file instanceof File) formData.append('file', file as File);
    else if (typeof file === 'string') formData.append('url', file as string);
    formData.append('name', name);
    formData.append('des', des);
    setLoading(true);
    await onSubmit(formData);
    onClose();
    setName('');
    setDes('');
    setFile(null);
    setLoading(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          if (!loading) {
            onClose();
            setFile(null);
          }
        }}
      >
        <DialogTitle>Add new data</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ marginTop: 5 }}
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            sx={{ marginTop: 5 }}
            label="Description"
            fullWidth
            multiline
            value={des}
            onChange={(e) => setDes(e.target.value)}
          />
          <CsvInputFiled
            onInputChange={(file: File | string | null) => {
              setFile(file);
              if (name === '') {
                if (file instanceof File) {
                  setName(file.name.split('.').slice(0, -1)[0]);
                }
              }
            }}
          ></CsvInputFiled>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ color: 'inherit' }}
            disabled={loading}
            onClick={() => {
              onClose();
              setName('');
              setDes('');
              setFile(null);
            }}
          >
            Cancel
          </Button>
          <Button sx={{ color: 'inherit' }} onClick={handleSubmit} disabled={file === null || loading}>
            {loading ? <CircularProgress color="info" size={20} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
