import { type IMenuItem, CreateMenu } from './elements';

export default function HandleMenu({
  open,
  onClose,
  anchorPosition,
  connection,
  onBreakLinks,
}: {
  open: boolean;
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  connection: number | undefined;
  onBreakLinks: () => void;
}): JSX.Element {
  const items: IMenuItem[] = [
    {
      title: 'Break Node Link(s)',
      action: () => {
        onBreakLinks();
        onClose();
      },
      disabled: connection === 0 || connection === undefined,
    },
  ];
  return CreateMenu(open, onClose, anchorPosition, items);
}
