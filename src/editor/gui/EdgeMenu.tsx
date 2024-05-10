import React from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
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

  return (
    <CreateMenu
      open={true}
      onClose={onClose}
      anchorPosition={anchorPosition}
      items={items}
      menuStyle={{ width: '150px' }}
    />
  );
}
