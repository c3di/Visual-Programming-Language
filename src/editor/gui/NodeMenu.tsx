import React from 'react';
import { Divider } from '@mui/material';
import {
  Delete,
  ContentCut,
  ContentCopy,
  Difference,
} from '@mui/icons-material';
import { type IMenuItem, CreateMenu, createMenuItemElement } from './elements';

export default function NodeMenu({
  open,
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
  open: boolean;
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  onDelete?: () => void;
  onCut?: () => void;
  onCopy?: () => void;
  onDuplicate?: () => void;
  anyConnectableNodeSelected: boolean;
  anyConnectionToSelectedNode: boolean;
  onBreakNodeLinks?: () => void;
}): JSX.Element {
  const items: IMenuItem[] = [
    {
      title: 'Cut',
      action: () => {
        onCut?.();
        onClose();
      },
      icon: ContentCut,
      subtitle: 'Ctrl+X',
    },
    {
      title: 'Copy',
      action: () => {
        onCopy?.();
        onClose();
      },
      icon: ContentCopy,
      subtitle: 'Ctrl+C',
    },
    {
      title: 'Duplicate',
      action: () => {
        onDuplicate?.();
        onClose();
      },
      icon: Difference,
      subtitle: 'Ctrl+D',
    },
    {
      title: 'Delete',
      action: () => {
        onDelete?.();
        onClose();
      },
      icon: Delete,
      subtitle: 'Del',
    },
  ];
  const breakNodeLink = (): JSX.Element | undefined => {
    if (anyConnectableNodeSelected && onBreakNodeLinks) {
      return (
        <div key="breakNodeLink">
          <Divider
            sx={{
              marginTop: '4px !important',
              marginBottom: '4px !important',
              borderBottomWidth: 'var(--vp-menu-panel-divider-border-width)',
            }}
          />
          {createMenuItemElement({
            title: 'Break Node Link(s)',
            action: onBreakNodeLinks,
            disabled: !anyConnectionToSelectedNode,
            titleStyle: { paddingLeft: '8px' },
          })}
        </div>
      );
    }
    return undefined;
  };
  return CreateMenu(
    open,
    onClose,
    anchorPosition,
    items,
    [breakNodeLink()],
    undefined,
    { width: '230px' }
  );
}
