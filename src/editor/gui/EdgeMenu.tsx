import DeleteIcon from '@mui/icons-material/Delete';
import { type IMenuItem, CreateMenu } from './elements';

export default function EdgeMenu({
  onClose,
  anchorPosition,
  onDelete,
}: {
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
  return CreateMenu(
    true,
    onClose,
    anchorPosition,
    items,
    undefined,
    undefined,
    {
      width: '150px',
    }
  );
}
