import { type IMenuItem, CreateMenu } from './elements';
import DeleteIcon from '@mui/icons-material/Delete';
export default function HandleMenu({
  onClose,
  anchorPosition,
  connection,
  onBreakLinks,
  onDeleteHandle,
}: {
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  connection?: number | undefined;
  onBreakLinks?: () => void;
  onDeleteHandle?: () => void;
}): JSX.Element {
  const items: IMenuItem[] = [
    {
      title: 'Delete',
      action: () => {
        onDeleteHandle?.();
        onClose();
      },
      icon: DeleteIcon,
    },
    {
      title: 'Break Node Link(s)',
      action: () => {
        onBreakLinks?.();
        onClose();
      },
      disabled: connection === 0 || connection === undefined,
    },
  ];
  return CreateMenu(true, onClose, anchorPosition, items);
}
