import DeleteIcon from '@mui/icons-material/Delete';
import { type IMenuItem, CreateMenu } from './CreateMenuItem';

export default function EdgeMenu({
  open,
  onClose,
  anchorPosition,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  onDelete?: () => void;
}): JSX.Element {
  const items: IMenuItem[] = [
    {
      title: 'Delete',
      action: () => {
        onDelete?.();
        onClose();
      },
      icon: DeleteIcon,
      subtitle: 'Del',
    },
  ];
  return CreateMenu(open, onClose, anchorPosition, items);
}
