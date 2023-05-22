import React, { memo, useCallback } from 'react';
import {
  Menu,
  MenuList,
  MenuItem,
  ListItemText,
  Typography,
  Divider,
  ListItemIcon,
} from '@mui/material';
import {
  Delete,
  ContentCut,
  ContentCopy,
  Difference,
} from '@mui/icons-material';

interface IMenuItem {
  title: string;
  action?: () => void;
  icon?: any;
  subtitle?: string;
  disabled?: boolean;
  titleStyle?: Record<string, string>;
}

const NodeMenu = memo(function NodeMenu({
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
      action: onCut,
      icon: ContentCut,
      subtitle: 'Ctrl+X',
    },
    {
      title: 'Copy',
      action: onCopy,
      icon: ContentCopy,
      subtitle: 'Ctrl+C',
    },
    {
      title: 'Duplicate',
      action: onDuplicate,
      icon: Difference,
      subtitle: 'Ctrl+D',
    },
    {
      title: 'Delete',
      action: onDelete,
      icon: Delete,
      subtitle: 'Del',
    },
  ];
  const createMenuItemElement = useCallback((item: IMenuItem) => {
    return (
      <MenuItem
        key={item.title}
        className="VP_MenuItem"
        disabled={item.disabled}
        onClick={() => {
          item.action?.();
          onClose();
        }}
      >
        {item.icon && (
          <ListItemIcon sx={{ minWidth: '20px !important' }}>
            {
              <item.icon
                fontSize="small"
                sx={{
                  width: '16px',
                  padding: '0px 3px 0px 4px',
                  mt: '-2px',
                }}
              />
            }
          </ListItemIcon>
        )}
        <ListItemText sx={{ fontSize: '15px!important', ...item.titleStyle }}>
          {item.title}
        </ListItemText>
        {item.subtitle && (
          <Typography
            className="VP_MenuItem_Shortcut"
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '15px!important' }}
          >
            {item.subtitle}
          </Typography>
        )}
      </MenuItem>
    );
  }, []);

  return (
    <Menu
      transitionDuration={0}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
    >
      <MenuList className="VP_MenuList" sx={{ width: '230px' }}>
        {items.map((item) => createMenuItemElement(item))}
        {anyConnectableNodeSelected && onBreakNodeLinks && (
          <>
            <Divider
              sx={{
                marginTop: '4px !important',
                marginBottom: '4px !important',
              }}
            />
            {createMenuItemElement({
              title: 'Break Node Link(s)',
              action: onBreakNodeLinks,
              disabled: !anyConnectionToSelectedNode,
              titleStyle: { paddingLeft: '8px' },
            })}
          </>
        )}
      </MenuList>
    </Menu>
  );
});

export default NodeMenu;
