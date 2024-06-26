import React, { memo } from 'react';
import { Menu, MenuList } from '@mui/material';
import { Check, Clear } from '@mui/icons-material';
import { StyledTreeItem } from './elements';
import { type ConnectionStatus, ConnectionAction } from '../types';

const ConnectionTip = memo(function ConnectionTip({
  onClose,
  anchorPosition,
  connectionStatus,
}: {
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  connectionStatus?: ConnectionStatus;
}): JSX.Element {
  return (
    <Menu
      transitionDuration={0}
      sx={{ padding: 0, pointerEvents: 'none' }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      open={connectionStatus !== undefined}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
    >
      <MenuList className="VP_MenuList">
        <StyledTreeItem
          sx={{ pointerEvents: 'none' }}
          nodeId="1"
          labelText={connectionStatus?.message ?? ''}
          labelIcon={
            connectionStatus?.action === ConnectionAction.Reject ? Clear : Check
          }
          iconColor={
            connectionStatus?.action === ConnectionAction.Reject
              ? 'red'
              : 'green'
          }
        ></StyledTreeItem>
      </MenuList>
    </Menu>
  );
});

export default ConnectionTip;
