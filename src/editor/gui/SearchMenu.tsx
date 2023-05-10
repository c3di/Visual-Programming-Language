import React, { memo, useCallback, useEffect, useState } from 'react';
import { Menu } from '@mui/material';
import { type Command } from '../hooks';
import {
  SearchedTreeView,
  nodeConfigsToTreeData,
  type TreeItemData,
} from './SearchedTreeView';
import { nodeConfigRegistry } from '../extension';
const SearchMenu = memo(function SearchMenu({
  open,
  onClose,
  anchorPosition,
  addNode,
  moreCommands,
}: {
  open: boolean;
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  addNode: (configType: string) => void;
  moreCommands?: Command[];
}): JSX.Element {
  const [commands, setCommand] = useState<Command[]>([
    {
      name: 'Add Comment...',
      action: () => {
        addNode('comment');
      },
      tooltip: 'Add a comment node',
    },
    {
      name: 'Add Reroute...',
      action: () => {
        addNode('reroute');
      },
      tooltip: 'Add a reroute node',
    },
    ...(moreCommands ?? []),
  ]);

  useEffect(() => {
    if (!moreCommands || moreCommands.length === 0) return;
    const commandNames = commands.map((command) => command.name);
    const newCommands = [];
    for (const command of moreCommands) {
      if (command.name in commandNames) continue;
      newCommands.push(command);
    }

    setCommand([...commands, ...newCommands]);
  }, [moreCommands]);

  const [treeData, setTreeData] = useState<TreeItemData[]>(
    nodeConfigsToTreeData(nodeConfigRegistry.getAllNodeConfigs())
  );

  useEffect(() => {
    if (open) {
      console.log('open', nodeConfigRegistry.getAllNodeConfigs());
      setTreeData([
        ...nodeConfigsToTreeData(nodeConfigRegistry.getAllNodeConfigs()),
        ...commandsToTreeData(commands),
      ]);
    }
  }, [open, commands]);

  const onItemClick = useCallback((item: TreeItemData): void => {
    if (!item) return;
    if (Array.isArray(item.children)) return;
    if (item.configType) {
      addNode(item.configType);
      onClose();
    }
  }, []);

  const commandsToTreeData = useCallback(
    (commands: Command[]): TreeItemData[] => {
      return commands.map((command) => ({
        id: command.name,
        name: command.name,
        tooltip: command.tooltip,
        onClick: () => {
          command.action();
          onClose();
        },
      }));
    },
    []
  );

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
    >
      <SearchedTreeView treeData={treeData} onItemClick={onItemClick} />
    </Menu>
  );
});

export default SearchMenu;
