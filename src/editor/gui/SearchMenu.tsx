import React, { memo, useCallback, useEffect, useState } from 'react';
import { Menu } from '@mui/material';
import {
  Comment,
  Route,
  DoNotDisturb,
  FitScreen,
  Notes,
} from '@mui/icons-material';
import {
  SearchedTreeView,
  nodeConfigsToTreeData,
  type TreeItemData,
} from './elements';
import { type OnConnectStartParams, type SourceCodeExec } from '../types';
import { type Command } from '../hooks';
import { nodeConfigRegistry } from '../extension';
import { createSvgIcon } from '@mui/material/utils';
import { type Connection } from 'reactflow';

const StickyNoteIcon = createSvgIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    version="1.1"
    className="MuiTreeItem-iconContainer MuiSvgIcon-root MuiSvgIcon-stickyNoteIcon"
  >
    <g id="surface1" transform="translate(3, 3) scale(0.8)">
      <path
        d="M 17.121094 21.472656 L 21.578125 16.867188 L 17.121094 16.867188 Z M 7.0625 16.859375 C 6.792969 16.871094 6.539062 16.738281 6.402344 16.511719 C 6.265625 16.285156 6.265625 16.003906 6.402344 15.777344 C 6.539062 15.550781 6.792969 15.417969 7.0625 15.433594 L 11.898438 15.433594 C 12.167969 15.417969 12.421875 15.550781 12.558594 15.777344 C 12.699219 16.003906 12.699219 16.285156 12.558594 16.511719 C 12.421875 16.738281 12.167969 16.871094 11.898438 16.859375 Z M 7.0625 12.046875 C 6.660156 12.046875 6.335938 11.726562 6.335938 11.332031 C 6.335938 10.9375 6.660156 10.617188 7.0625 10.617188 L 16.882812 10.617188 C 17.285156 10.617188 17.609375 10.9375 17.609375 11.332031 C 17.609375 11.726562 17.285156 12.046875 16.882812 12.046875 Z M 7.0625 7.234375 C 6.792969 7.246094 6.539062 7.113281 6.402344 6.886719 C 6.265625 6.660156 6.265625 6.378906 6.402344 6.152344 C 6.539062 5.925781 6.792969 5.792969 7.0625 5.808594 L 16.882812 5.808594 C 17.152344 5.792969 17.40625 5.925781 17.542969 6.152344 C 17.683594 6.378906 17.683594 6.660156 17.542969 6.886719 C 17.40625 7.113281 17.152344 7.246094 16.882812 7.234375 Z M 22.480469 15.429688 L 22.480469 1.445312 L 1.457031 1.445312 L 1.457031 22.507812 L 15.667969 22.507812 L 15.667969 16.148438 C 15.664062 15.753906 15.988281 15.429688 16.390625 15.425781 Z M 17.253906 23.425781 C 17.097656 23.753906 16.769531 23.96875 16.398438 23.992188 C 16.3125 23.992188 16.222656 23.976562 16.140625 23.945312 L 1.464844 23.945312 C 1.105469 23.945312 0.761719 23.8125 0.496094 23.578125 L 0.4375 23.527344 C 0.160156 23.261719 0.00390625 22.894531 0 22.515625 L 0 1.4375 C 0 0.652344 0.648438 0.0117188 1.449219 0.0117188 L 22.488281 0.0117188 C 23.289062 0.015625 23.933594 0.652344 23.9375 1.4375 L 23.9375 15.855469 C 24.054688 16.117188 24.003906 16.425781 23.800781 16.636719 Z M 17.253906 23.425781 "
        stroke="currentColor"
        strokeWidth="0.6"
      />
    </g>
  </svg>,
  'StickyNote'
);

const SearchMenu = memo(function SearchMenu({
  onClose,
  anchorPosition,
  getSourceCode,
  addNodeWithSceneCoord,
  clear,
  autoLayout,
  moreCommands,
  startHandleInfo,
  addEdge,
}: {
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  getSourceCode?: () => SourceCodeExec;
  addNodeWithSceneCoord?: (
    configType: string,
    anchorPosition: { top: number; left: number }
  ) => void;
  autoLayout?: () => void;
  clear?: () => void;
  moreCommands?: Command[];
  startHandleInfo?: OnConnectStartParams;
  addEdge?: (params: Connection) => void;
}): JSX.Element {
  const [commands, setCommand] = useState<Command[]>([
    {
      name: 'Add Comment...',
      action: () => {
        addNodeWithSceneCoord?.('comment', anchorPosition);
      },
      tooltip: 'Add a comment node',
      labelIcon: Comment,
    },
    {
      name: 'Add Sticky Note...',
      action: () => {
        addNodeWithSceneCoord?.('stickyNote', anchorPosition);
      },
      tooltip: 'Add a sticky note',
      labelIcon: StickyNoteIcon,
    },
    {
      name: 'Add Reroute...',
      action: () => {
        addNodeWithSceneCoord?.('reroute', anchorPosition);
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
    {
      name: 'Auto Arrange',
      action: () => {
        autoLayout?.();
      },
      labelIcon: FitScreen,
    },
    {
      name: 'Copy Textual Code',
      action: () => {
        const code = getSourceCode?.();
        const clipboardStr = code?.result ?? '';
        navigator.clipboard.writeText(clipboardStr).catch((err) => {
          console.error('Could not copy text: ', err);
        });
      },
      labelIcon: Notes,
      tooltip:
        'Copy executable (linked to "Execution Start") text code to clipboard',
    },
  ]);

  const toFilter = useCallback((): boolean => {
    return !!(startHandleInfo?.handleType && startHandleInfo?.handleDataType);
  }, [startHandleInfo]);

  useEffect(() => {
    if (!moreCommands || moreCommands.length === 0) return;
    const newNames = moreCommands.map((item) => item.name);

    const updatedCommands: Command[] = commands.map((item) => {
      if (newNames.includes(item.name)) {
        return (
          moreCommands.find((newItem) => newItem.name === item.name) ?? item
        );
      }
      return item;
    });

    moreCommands.forEach((newItem) => {
      if (!commands.find((item) => item.name === newItem.name)) {
        updatedCommands.push(newItem);
      }
    });

    setCommand(updatedCommands);
  }, [moreCommands]);

  const [treeData, setTreeData] = useState<TreeItemData[]>(
    nodeConfigsToTreeData(nodeConfigRegistry.getAllNodeConfigs())
  );

  useEffect(() => {
    let treeData = nodeConfigsToTreeData(
      nodeConfigRegistry.getAllNodeConfigs()
    );
    if (startHandleInfo?.handleType && startHandleInfo?.handleDataType) {
      treeData = searchTreeDataWithHandleDataType(
        startHandleInfo.handleType,
        startHandleInfo?.handleDataType,
        treeData
      );
    }
    setTreeData(
      [...treeData, ...commandsToTreeData(commands)].sort(
        (a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity)
      )
    );
  }, [commands]);

  const hasMatchingDataType = (
    handleType: string,
    dataType: string,
    item: TreeItemData
  ): boolean => {
    if (
      handleType === 'source' &&
      Object.prototype.hasOwnProperty.call(item, 'inputs')
    ) {
      if (
        Object.values(item.inputs ?? {}).find(
          (child) =>
            child.dataType === dataType || child.dataType === 'anyDataType'
        )
      ) {
        return true;
      }
    } else if (
      handleType === 'target' &&
      Object.prototype.hasOwnProperty.call(item, 'outputs')
    ) {
      if (
        Object.values(item.outputs ?? {}).find(
          (child) =>
            child.dataType === dataType || child.dataType === 'anyDataType'
        )
      ) {
        return true;
      }
    }
    return false;
  };

  const filteredTreeDataWithHandleDataType = (
    item: TreeItemData,
    handleType: string,
    dataType: string
  ): TreeItemData | null => {
    if (hasMatchingDataType(handleType, dataType, item)) {
      return { ...item };
    }
    const children: TreeItemData[] = [];
    for (const child of item.children ?? []) {
      const fItem = filteredTreeDataWithHandleDataType(
        child,
        handleType,
        dataType
      );
      if (fItem) children.push(fItem);
    }
    if (children?.length) return { ...item, children };
    return null;
  };

  const searchTreeDataWithHandleDataType = useCallback(
    (
      handleType: string,
      dataType: string,
      treeData: TreeItemData[]
    ): TreeItemData[] => {
      const filteredTreeData: TreeItemData[] = [];
      for (const item of treeData) {
        const fItem = filteredTreeDataWithHandleDataType(
          item,
          handleType,
          dataType
        );
        if (fItem) filteredTreeData.push(fItem);
      }
      return filteredTreeData;
    },
    []
  );

  const executeCommandByName = (
    commands: Command[],
    commandName: string
  ): void => {
    const command = commands.find((c) => c.name === commandName);
    if (command) {
      command.action();
    }
  };
  const findHandleWithMatchingDataType = (
    node: Node,
    handleType: string | null,
    dataType: string | null
  ): string | undefined => {
    const handles =
      handleType === 'source'
        ? Object(node).data.inputs
        : Object(node).data.outputs;
    const matchingHandle = Object.keys(handles).find(
      (key) =>
        handles[key].dataType === dataType ||
        handles[key].dataType === 'anyDataType'
    );
    return matchingHandle;
  };

  const connectWithNewNode = (
    node: Node,
    matchingHandle: string | undefined
  ): void => {
    if (startHandleInfo) {
      setTimeout(() => {
        let newConnection: Connection;
        if (startHandleInfo.handleType === 'source' && matchingHandle) {
          newConnection = {
            source: startHandleInfo.nodeId,
            target: Object(node).id,
            sourceHandle: startHandleInfo.handleId,
            targetHandle: matchingHandle,
          };
          addEdge?.(newConnection);
        } else if (startHandleInfo.handleType === 'target' && matchingHandle) {
          newConnection = {
            source: Object(node).id,
            target: startHandleInfo.nodeId,
            sourceHandle: matchingHandle,
            targetHandle: startHandleInfo.handleId,
          };
          addEdge?.(newConnection);
        }
      }, 0);
    }
  };

  const onItemClick = useCallback((item: TreeItemData): void => {
    if (!item) return;
    if (Array.isArray(item.children)) return;
    if (item.configType) {
      const node = addNodeWithSceneCoord?.(item.configType, anchorPosition);
      if (toFilter() && node) {
        const matchingHandle = findHandleWithMatchingDataType(
          node,
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          startHandleInfo!.handleType,
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          startHandleInfo!.handleDataType
        );
        connectWithNewNode(node, matchingHandle);
      }

      onClose();
    }
  }, []);

  const onEnterKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>, item: TreeItemData) => {
      if (!item) return;
      if (Array.isArray(item.children)) return;
      if (event.key === 'Enter' && item.configType) {
        const node = addNodeWithSceneCoord?.(item.configType, anchorPosition);
        if (toFilter() && node) {
          const matchingHandle = findHandleWithMatchingDataType(
            node,
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            startHandleInfo!.handleType,
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            startHandleInfo!.handleDataType
          );
          connectWithNewNode(node, matchingHandle);
        }
        onClose();
      } else {
        executeCommandByName(commands, item.name);
        onClose();
      }
    },
    []
  );

  const commandsToTreeData = useCallback(
    (commands: Command[]): TreeItemData[] => {
      const treeData: TreeItemData[] = [];
      for (const command of commands) {
        const item: TreeItemData = {
          id: command.name,
          name: command.name,
          tooltip: command.tooltip,
          labelIcon: command.labelIcon,
          onClick: (item: TreeItemData, e: React.MouseEvent<HTMLLIElement>) => {
            onClose();
            command.action(item, e);
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
      open={true}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={{
        top: anchorPosition.top - 20,
        left: anchorPosition.left - 20,
      }}
    >
      <SearchedTreeView
        treeData={treeData}
        onItemClick={onItemClick}
        onEnterKeyDown={onEnterKeyDown}
        triggerExpand={startHandleInfo !== undefined}
      />
    </Menu>
  );
});

export default SearchMenu;
