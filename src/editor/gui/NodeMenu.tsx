import {
  MenuDivider,
  Icon,
  useDisclosure
} from '@chakra-ui/react';
import {
  EditIcon,
  CopyIcon,
  RepeatIcon,
  DeleteIcon,
} from '@chakra-ui/icons';
import { type IMenuItem, CreateMenu, createMenuItemElement } from './elements';

export default function NodeMenu({
  onClose,
  anchorPosition,
  onDelete,
  onCut,
  onCopy,
  onDuplicate,
  anyConnectableNodeSelected,
  anyConnectionToSelectedNode,
  onBreakNodeLinks,
}: {
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  onDelete?: () => void;
  onCut?: () => void;
  onCopy?: () => void;
  onDuplicate?: () => void;
  anyConnectableNodeSelected?: boolean;
  anyConnectionToSelectedNode?: boolean;
  onBreakNodeLinks?: () => void;
}): JSX.Element {
  const { isOpen, onOpen, onClose: chakraOnClose } = useDisclosure({ defaultIsOpen: true });

  const items: IMenuItem[] = [
    {
      title: 'Cut',
      action: () => {
        onCut?.();
        onClose();
      },
      icon: EditIcon,
      subtitle: 'Ctrl+X',
    },
    {
      title: 'Copy',
      action: () => {
        onCopy?.();
        onClose();
      },
      icon: CopyIcon,
      subtitle: 'Ctrl+C',
    },
    {
      title: 'Duplicate',
      action: () => {
        onDuplicate?.();
        onClose();
      },
      icon: RepeatIcon,
      subtitle: 'Ctrl+D',
    },
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

  const breakNodeLink = (): JSX.Element | undefined => {
    if (anyConnectableNodeSelected && onBreakNodeLinks) {
      return (
        <div key="breakNodeLink">
          <MenuDivider />
          {createMenuItemElement({
            title: 'Break Node Link(s)',
            action: () => {
              onBreakNodeLinks();
              onClose();
            },
            disabled: !anyConnectionToSelectedNode,
            titleStyle: { paddingLeft: '8px' },
          })}
        </div>
      );
    }
    return undefined;
  };

  return CreateMenu({
    open: isOpen,
    onClose: () => { chakraOnClose(); onClose(); },
    anchorPosition: anchorPosition,
    items: items,
    moreItemElements: [breakNodeLink()],
    menuStyle: { width: '230px' }
  });
}
