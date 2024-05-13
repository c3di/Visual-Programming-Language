import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
  Icon
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';


type StyledTreeItemProps = {
  bgColor?: string;
  color?: string;
  labelIcon?: any;
  labelInfo?: string;
  labelText: string;
  iconColor?: string;
  onItemDelete?: (id: string) => void;
  nodeId: string;
  children?: React.ReactNode;
};

export default function StyledTreeItem(
  props: StyledTreeItemProps
): JSX.Element {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    iconColor,
    onItemDelete,
    nodeId,
    children,
    ...other
  } = props;
  return (
    <Accordion allowToggle reduceMotion>
      <AccordionItem border="none" bg={bgColor || 'transparent'}>
        {({ isExpanded }) => (
          <>
            <AccordionButton _expanded={{ bg: 'var(--vp-treeview-item-hover-bg-color)', color: 'var(--vp-treeview-font-color)' }}>
              {LabelIcon && <Icon as={LabelIcon} color={iconColor || 'currentColor'} mr={2} boxSize="20px" />}
              <Box flex="1" textAlign="left">
                <Text fontSize="var(--vp-treeview-font-size)" fontWeight="bold" fontFamily="var(--vp-treeview-font-family)">
                  {labelText}
                </Text>
                {labelInfo && (
                  <Text fontSize="sm" color="gray.500" ml={2}>
                    {labelInfo}
                  </Text>
                )}
              </Box>
              <AccordionIcon as={ChevronDownIcon} />
            </AccordionButton>
            <AccordionPanel pb={4}>
              {children}
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
}
