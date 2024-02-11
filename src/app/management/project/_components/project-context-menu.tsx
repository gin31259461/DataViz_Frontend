import { EditProjectRequestSchema, ProjectSchema } from '@/server/api/routers/project';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  PopoverPosition,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { MouseEvent, ReactNode, useState } from 'react';
import { ConfirmModal } from '../../../../components/modal/confirm-modal';

interface ContextMenuProps {
  project: ProjectSchema;
  children: ReactNode;
  maxWidth?: number | string;
  onEditConfirm: (input: EditProjectRequestSchema) => Promise<void>;
  onDelete: (input: number) => Promise<void>;
}

export default function ContextMenu({ children, maxWidth, onDelete, onEditConfirm, project }: ContextMenuProps) {
  const router = useRouter();

  const [anchorPosition, setAnchorPosition] = useState<PopoverPosition | undefined>(undefined);
  const [name, setName] = useState(project.title);
  const [des, setDes] = useState(project.des);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  let path: string = '';
  if (project.type === 'racing-chart') {
    path = '/management/project/racing-chart';
  }

  const handleContextMenu = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    setAnchorPosition({
      top: event.pageY - window.scrollY,
      left: event.pageX - 20,
    });
  };

  const handleCloseMenu = () => {
    setAnchorPosition(undefined);
  };

  const onEditDialogClose = () => {
    setEditOpen(false);
    setName(project.title);
    setDes(project.des);
  };

  return (
    <div onContextMenu={handleContextMenu} style={{ maxWidth: maxWidth }}>
      <div>{children}</div>

      <Menu
        anchorReference={'anchorPosition'}
        anchorPosition={anchorPosition}
        open={Boolean(anchorPosition)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => router.push(`${path}/${project.id}`)}>Open</MenuItem>
        <MenuItem onClick={() => setEditOpen(true)}>Edit</MenuItem>
        <MenuItem onClick={() => setDeleteModalOpen(true)}>Delete</MenuItem>
      </Menu>

      <Dialog fullScreen open={editOpen} onClose={onEditDialogClose}>
        <DialogTitle>Edit project</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <TextField
              multiline
              label="Description"
              value={des}
              onChange={(e) => {
                setDes(e.target.value);
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onEditDialogClose}>Cancel</Button>
          <Button
            onClick={async () => {
              await onEditConfirm({ id: project.id, name: name, des: des });
              setEditOpen(false);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmModal
        open={deleteModalOpen}
        title="Delete project"
        onConfirm={async () => {
          await onDelete(project.id);
        }}
        onClose={() => setDeleteModalOpen(false)}
      >
        Are you sure you want to delete this project?
      </ConfirmModal>
    </div>
  );
}
