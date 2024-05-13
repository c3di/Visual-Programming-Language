import { useRef, useState } from 'react';
import {
  ChakraProvider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon,
  Box,
  Text,
  Portal
} from '@chakra-ui/react';

export interface IMenuItem {
  title: string;
  action?: () => void;
  icon?: any;
  subtitle?: string;
  disabled?: boolean;
  titleStyle?: Record<string, any>;
}

export const createMenuItemElement = (item: IMenuItem): JSX.Element => {
  return (
    <MenuItem
      key={item.title}
      isDisabled={item.disabled}
      onClick={item.action}
    >
      {item.icon && (
        <Icon as={item.icon} color="var(--vp-menuitem-icon-color)" w="var(--vp-menuitem-icon-size)" h="var(--vp-menuitem-icon-size)" padding="0.15rem" />
      )}
      <Box as="span" style={item.titleStyle}>
        <Text color="var(--vp-menuitem-font-color)" fontSize="var(--vp-menuitem-font-size)" fontFamily="var(--vp-menuitem-font-family)">
          {item.title}
        </Text>
      </Box>
      {item.subtitle && (
        <Text color="var(--vp-menuitem-shortcut-color)" fontSize="var(--vp-menuitem-font-size)" fontFamily="var(--vp-menuitem-font-family)">
          {item.subtitle}
        </Text>
      )}
    </MenuItem>
  );
};

export function CreateMenu({
  open,
  onClose,
  anchorPosition,
  items,
  moreItemElements = [],
  menuStyle,
  menuListStyle
}: {
  open: boolean;
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  items: IMenuItem[];
  moreItemElements?: Array<JSX.Element | undefined>;
  menuStyle?: Record<string, any>;
  menuListStyle?: Record<string, any>;
}): JSX.Element {

  const portalContainerRef = useRef(null);

  return (
    <ChakraProvider>
      <div
        ref={portalContainerRef}
      />
      <Portal containerRef={portalContainerRef}>
        <Menu isOpen={open} onClose={onClose} placement="bottom-start">
          <MenuButton as={Button} aria-label="Options" style={{ display: 'none' }}>
            Options
          </MenuButton>
          <MenuList style={{ ...menuStyle, ...menuListStyle }}>
            {items.map((item) => createMenuItemElement(item))}
            {moreItemElements}
          </MenuList>
        </Menu>
      </Portal>
    </ChakraProvider>
  );
}
