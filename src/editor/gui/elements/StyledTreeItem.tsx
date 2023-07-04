import React from 'react';
import { Box } from '@mui/material';
import { Typography, type SvgIconProps } from '@mui/material';
import { TreeItem, type TreeItemProps } from '@mui/lab';

// from https://mui.com/material-ui/react-tree-view/#GmailTreeView.tsx

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon?: React.ElementType<SvgIconProps> | undefined;
  labelInfo?: string;
  labelText: string;
  iconColor?: string;
  onItemDelete?: (id: string) => void;
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
    ...other
  } = props;
  return (
    <TreeItem
      sx={{
        '& .MuiTreeItem-content': {
          paddingRight: 0,
          paddingLeft: 0,
        },
        '& .MuiTreeItem-content.Mui-selected, & .MuiTreeItem-content.Mui-selected.Mui-focused':
          {
            backgroundColor: 'var(--vp-treeview-item-hover-bg-color)',
            color: 'var(--vp-treeview-font-color)',
          },
      }}
      icon={
        LabelIcon && (
          <LabelIcon
            sx={{
              color: iconColor ?? 'var(--vp-treeview-icon-color)',
              width: 'var(--vp-treeview-icon-size)',
            }}
          />
        )
      }
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'inherit',
              flexGrow: 0.8,
              fontSize: 'var( --vp-treeview-font-size)',
              color: 'var(--vp-treeview-font-color)',
              fontFamily: 'var(--vp-treeview-font-family)',
            }}
          >
            {labelText}
          </Typography>
          {labelInfo && (
            <Typography
              variant="caption"
              sx={{
                fontSize: 'var( --vp-treeview-font-size)',
                color: 'var(--vp-treeview-font-color)',
                fontFamily: 'var(--vp-treeview-font-family)',
              }}
            >
              {labelInfo}
            </Typography>
          )}
        </Box>
      }
      {...other}
    />
  );
}
