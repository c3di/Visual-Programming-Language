import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import TreeItem, {
  type TreeItemProps,
  treeItemClasses,
} from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import { type SvgIconProps } from '@mui/material/SvgIcon';

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

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.primary,
    paddingRight: theme.spacing(0),
    paddingLeft: theme.spacing(0),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      // fontWeight: 'inherit',
      paddingTop: theme.spacing(0.1),
      fontSize: '16px',
      color: '#000000DE',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(0),
    },
  },
}));

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
      icon={LabelIcon && <LabelIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />}
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
