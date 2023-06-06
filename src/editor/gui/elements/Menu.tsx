import React from 'react';
import {
  MenuItem,
  Menu,
  MenuList,
  ListItemText,
  Typography,
  ListItemIcon,
} from '@mui/material';

export interface IMenuItem {
  title: string;
  action?: () => void;
  icon?: any;
  subtitle?: string;
  disabled?: boolean;
  titleStyle?: Record<string, string>;
}

export const createMenuItemElement = (item: IMenuItem): JSX.Element => {
  return (
    <MenuItem
      key={item.title}
      className="VP_MenuItem"
      disabled={item.disabled}
      onClick={item.action}
    >
      {item.icon && (
        <ListItemIcon sx={{ minWidth: '20px !important' }}>
          {
            <item.icon
              sx={{
                color: 'var( --vp-menuitem-icon-color)',
                width: 'var(--vp-menuitem-icon-size)',
                height: 'var(--vp-menuitem-icon-size)',
                padding: '0.15rem',
              }}
            />
          }
        </ListItemIcon>
      )}
      <ListItemText sx={{ fontSize: '15px!important', ...item.titleStyle }}>
        {item.title && (
          <Typography
            color="var(--vp-menuitem-font-color)"
            sx={{ fontSize: 'var(--vp-menuitem-font-size)!important' }}
          >
            {item.title}
          </Typography>
        )}
      </ListItemText>
      {item.subtitle && (
        <Typography
          className="VP_MenuItem_Shortcut"
          variant="body2"
          color="var(--vp-menuitem-shortcut-color)"
          sx={{ fontSize: 'var(--vp-menuitem-font-size)!important' }}
        >
          {item.subtitle}
        </Typography>
      )}
    </MenuItem>
  );
};

export function CreateMenu(
  open: boolean,
  onClose: () => void,
  anchorPosition: { top: number; left: number },
  items: IMenuItem[],
  moreItemElements?: Array<JSX.Element | undefined>,
  menuStyle?: Record<string, string>,
  menuListStyle?: Record<string, string>
): JSX.Element {
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
      sx={menuStyle}
    >
      <MenuList className="VP_MenuList" sx={menuListStyle}>
        {items.map((item) => createMenuItemElement(item))}
        {moreItemElements}
      </MenuList>
    </Menu>
  );
}
