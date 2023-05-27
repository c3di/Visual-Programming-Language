import React, { memo, useCallback, useEffect, useState } from 'react';
import { Menu } from '@mui/material';
import { Comment, Route, DoNotDisturb } from '@mui/icons-material';
import {
  SearchedTreeView,
  nodeConfigsToTreeData,
  type TreeItemData,
} from './elements';
import { type Command } from '../hooks';
import { nodeConfigRegistry } from '../extension';

const SearchMenu = memo(function SearchMenu({
  open,
  onClose,
  anchorPosition,
  addNode,
  clear,
  moreCommands,
}: {
  open: boolean;
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  addNode?: (configType: string) => void;
  clear?: () => void;
  moreCommands?: Command[];
}): JSX.Element {
  const [commands, setCommand] = useState<Command[]>([
    {
      name: 'Add Comment...',
      action: () => {
        addNode?.('comment');
      },
      tooltip: 'Add a comment node',
      labelIcon: Comment,
    },
    {
      name: 'Add Reroute...',
      action: () => {
        addNode?.('reroute');
      },
      tooltip: 'Add a reroute node',
      labelIcon: Route,
    },
    {
      name: 'Clear',
      action: () => {
        clear?.();
      },
      labelIcon: DoNotDisturb,
    },
    ...(moreCommands ?? []),
  ]);

  useEffect(() => {
    if (!moreCommands || moreCommands.length === 0) return;
    const commandNames = commands.map((command) => command.name);
    const newCommands = [];
    for (const command of moreCommands) {
      if (commandNames.includes(command.name)) continue;
      newCommands.push(command);
    }

    setCommand([...commands, ...newCommands]);
  }, [moreCommands]);

  const [treeData, setTreeData] = useState<TreeItemData[]>(
    nodeConfigsToTreeData(nodeConfigRegistry.getAllNodeConfigs())
  );

  useEffect(() => {
    if (open) {
      setTreeData(
        [
          ...nodeConfigsToTreeData(nodeConfigRegistry.getAllNodeConfigs()),
          ...commandsToTreeData(commands),
        ].sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity))
      );
    }
  }, [open, commands]);

  const onItemClick = useCallback((item: TreeItemData): void => {
    if (!item) return;
    if (Array.isArray(item.children)) return;
    if (item.configType) {
      addNode?.(item.configType);
      onClose();
    }
  }, []);

  const commandsToTreeData = useCallback(
    (commands: Command[]): TreeItemData[] => {
      const treeData: TreeItemData[] = [];
      for (const command of commands) {
        const item: TreeItemData = {
          id: command.name,
          name: command.name,
          tooltip: command.tooltip,
          labelIcon: command.labelIcon,
          onClick: () => {
            command.action();
            onClose();
          },
          rank: command.rank,
        };
        if (!command.category) {
          treeData.push(item);
          continue;
        }

        const category = treeData.find(
          (item) => item.name === command.category
        );
        if (!category) {
          treeData.push({
            id: command.category,
            name: command.category,
            children: [item],
            rank: command.categoryRank,
          });
        } else {
          if (!category.children) category.children = [];
          category.children.push(item);
        }
      }
      return treeData;
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
