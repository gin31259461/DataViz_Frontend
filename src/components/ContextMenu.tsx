import { Menu, MenuItem, PopoverPosition } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ConfirmModal } from './Modal/ConfirmModal';

interface ContextMenuProps {
  id: number;
  children: React.ReactNode;
  onDelete: () => Promise<void>;
  maxWidth?: number | string;
}

export default function ContextMenu({
  children,
  maxWidth,
  id,
  onDelete,
}: ContextMenuProps) {
  const [anchorPosition, setAnchorPosition] = useState<
    PopoverPosition | undefined
  >(undefined);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const router = useRouter();

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    setAnchorPosition({
      top: event.pageY - window.scrollY,
      left: event.pageX - 20,
    });
  };

  const handleCloseMenu = () => {
    setAnchorPosition(undefined);
  };

  const handleMenuItemClick = () => {
    // Handle menu item click
    handleCloseMenu();
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
        <MenuItem onClick={() => router.push(`/management/project/${id}`)}>
          Open
        </MenuItem>
        <MenuItem onClick={handleMenuItemClick}>Rename</MenuItem>
        <MenuItem onClick={() => setDeleteModalOpen(true)}>Delete</MenuItem>
        <ConfirmModal
          open={deleteModalOpen}
          title="Delete project"
          onConfirm={onDelete}
          onClose={() => setDeleteModalOpen(false)}
        >
          Are you sure you want to delete this project?
        </ConfirmModal>
      </Menu>
    </div>
  );
}
