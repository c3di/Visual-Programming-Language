import React from 'react';
import { Box } from '@mui/material';
import { Typography, type SvgIconProps } from '@mui/material';
import { TreeItem, type TreeItemProps } from '@mui/lab';

// from https://mui.com/material-ui/react-tree-view/#GmailTreeView.tsx
declare module 'react' {
  interface CSSProperties {
    '--vp-treeview-font-color'?: string;
    '--vp-treeview-item-hover-bg-color'?: string;
  }
}

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon?: React.ElementType<SvgIconProps> | undefined;
  labelInfo?: string;
  labelText: string;
  iconColor?: 'success' | 'error' | 'warning' | undefined;
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
      style={{
        '--vp-treeview-font-color': '#222',
        '--vp-treeview-item-hover-bg-color': '#f5f5f6f0',
      }}
      sx={{
        '& .MuiTreeItem-content': {
          paddingRight: 0,
          paddingLeft: 0,
        },
        '& .MuiTreeItem-content .MuiTreeItem-label': {
          paddingTop: '0.1rem',
          fontSize: '1rem',
        },
        '& .MuiTreeItem-content.Mui-selected, & .MuiTreeItem-content.Mui-selected.Mui-focused':
          {
            backgroundColor: 'var(--vp-treeview-item-hover-bg-color)',
            color: 'var(--vp-treeview-font-color)',
          },
      }}
      icon={
        LabelIcon &&
        (iconColor ? (
          <LabelIcon color={iconColor} />
        ) : (
          <LabelIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />
        ))
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
              fontSize: '1rem',
              color: 'var(--vp-treeview-font-color)',
            }}
          >
            {labelText}
          </Typography>
          {labelInfo && (
            <Typography variant="caption" color="inherit">
              {labelInfo}
            </Typography>
          )}
        </Box>
      }
      {...other}
    />
  );
}
