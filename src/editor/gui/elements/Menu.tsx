import { ChakraProvider } from '@chakra-ui/react'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuOptionGroup,
  MenuGroup,
  MenuDivider,
  Button,
  Icon,
  Box,
  Text
} from '@chakra-ui/react';

export interface IMenuItem {
  title: string;
  action?: () => void;
  icon?: any;  // This should ideally be a specific type like React.ElementType
  subtitle?: string;
  disabled?: boolean;
  titleStyle?: Record<string, any>;
}

export const createMenuItemElement = (item: IMenuItem): JSX.Element => {
  return (
    <ChakraProvider>
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
    </ChakraProvider>
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
  return (
    <Menu isOpen={open} onClose={onClose} placement="bottom-start">
      <MenuButton as={Button} aria-label="Options" style={{ display: 'none' }}>
        Options
      </MenuButton>
      <MenuList style={{ ...menuStyle, ...menuListStyle }}>
        {items.map((item) => createMenuItemElement(item))}
        {moreItemElements}
      </MenuList>
    </Menu>
  );
}
