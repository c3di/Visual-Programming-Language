import React from 'react';
import { DeleteIcon } from '@chakra-ui/icons'; // Ensure this is installed
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
  connection?: number;
  onBreakLinks?: () => void;
  onDeleteHandle?: () => void;
  handle?: Handle;
  watchImage?: (watch: boolean) => void;
}): JSX.Element {
  const items: IMenuItem[] = [
    {
      title: 'Delete',
      action: () => {
        onDeleteHandle?.();
        onClose();
      },
      icon: DeleteIcon, // Using Chakra UI icon
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
      title: handle?.beWatched ? 'Stop Watching This Image' : 'Watch This Image',
      action: () => {
        watchImage?.(!handle?.beWatched);
        onClose();
      },
      disabled: handle?.dataType !== 'image',
    },
  ];

  return (
    <CreateMenu
      open={true}
      onClose={onClose}
      anchorPosition={anchorPosition}
      items={items}
      menuStyle={{ width: '200px' }}
    />
  );
}
