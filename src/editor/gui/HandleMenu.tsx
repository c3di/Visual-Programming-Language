import DeleteIcon from '@mui/icons-material/Delete';
import { type Handle } from '../types/Handle';
import { CreateMenu, type IMenuItem } from './elements';
export default function HandleMenu({
  onClose,
  anchorPosition,
  deletable,
  connection,
  onBreakLinks,
  onDeleteHandle,
  handle,
  watchImage,
}: {
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  deletable: boolean;
  connection?: number | undefined;
  onBreakLinks?: () => void;
  onDeleteHandle?: () => void;
  handle?: Handle;
  watchImage?: (sure: boolean) => void;
}): JSX.Element {
  const items: IMenuItem[] = [
    {
      title: 'Delete',
      action: () => {
        onDeleteHandle?.();
        onClose();
      },
      icon: DeleteIcon,
      disabled: !deletable,
    },
    {
      title: 'Break Node Link(s)',
      action: () => {
        onBreakLinks?.();
        onClose();
      },
      disabled: connection === 0 || connection === undefined,
    },
    {
      title: handle?.beWatched ? 'Stop Watch This Image' : 'Watch This Image',
      action: () => {
        watchImage?.(!handle?.beWatched);
        onClose();
      },
      disabled: handle?.dataType !== 'image',
    },
  ];
  return CreateMenu(true, onClose, anchorPosition, items);
}
