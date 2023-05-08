import React from 'react';
import { styled } from '@mui/material/styles';
import { IconButton, Box } from '@mui/material';
import TreeItem, {
  type TreeItemProps,
  treeItemClasses,
} from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import { type SvgIconProps } from '@mui/material/SvgIcon';
import { DeleteOutlined } from '@mui/icons-material';

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
  deletable?: boolean;
  onItemDelete?: (id: string) => void;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.primary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
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
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
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
    deletable,
    onItemDelete,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      icon={LabelIcon && <LabelIcon color={iconColor ?? 'inherit'} />}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
          {deletable && (
            <IconButton
              aria-label="delete"
              onClick={(e) => {
                onItemDelete?.(props.nodeId);
                e.stopPropagation();
              }}
            >
              <DeleteOutlined />
            </IconButton>
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
