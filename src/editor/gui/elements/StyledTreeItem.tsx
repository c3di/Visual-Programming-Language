import React from 'react';
import { Box, styled } from '@mui/material';
import { Typography, type SvgIconProps } from '@mui/material';
import { TreeItem, type TreeItemProps } from '@mui/lab';
import './StyledTreeItem.css';

// from https://mui.com/material-ui/react-tree-view/#GmailTreeView.tsx
declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
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

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({}));

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
    <StyledTreeItemRoot
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
            sx={{ fontWeight: 'inherit', flexGrow: 0.8 }}
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
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      {...other}
    />
  );
}
