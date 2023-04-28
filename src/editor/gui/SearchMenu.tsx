import { IconButton, Input, InputAdornment, Menu } from '@mui/material';
import { TreeView } from '@mui/lab';
import TreeItem from '@mui/lab/TreeItem';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { type NodeConfig } from '../types';
import { type Command } from '../hooks';
import StyledTreeItem from './StyledTreeItem';

let itemId = 0;

interface TreeItemData {
  id: string;
  name: string;
  configType?: string;
  children?: readonly TreeItemData[];
  tooltip?: string;
}

const nodeConfigsToTreeData = (
  nodeConfigs: Record<string, NodeConfig>
): TreeItemData[] => {
  const data: TreeItemData[] = [];
  for (const name in nodeConfigs) {
    const config = nodeConfigs[name];
    if (config.notShowInMenu) continue;
    const itemData = nodeConfigToTreeItemData(name, config);
    if (itemData) data.push(itemData);
  }
  return data;
};

const nodeConfigToTreeItemData = (
  name: string,
  nodeConfig: any
): TreeItemData | undefined => {
  if (nodeConfig.notShowInMenu) return;
  const children = [];
  for (const name in nodeConfig.__isPackage__ ? nodeConfig.nodes : {}) {
    const config = nodeConfig.nodes[name];
    if (config.notShowInMenu) continue;
    const itemData = nodeConfigToTreeItemData(name, config);
    if (itemData) children.push(itemData);
  }

  return {
    id: String(itemId++),
    name,
    configType: nodeConfig.type,
    children: children.length > 0 ? children : undefined,
    tooltip: nodeConfig.tooltip,
  };
};

function SearchInput({
  onChange,
}: {
  onChange: (value: string) => void;
}): JSX.Element {
  const [hasInput, setHasInput] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <Input
      inputRef={inputRef}
      placeholder="Search"
      id="input-with-icon-adornment"
      startAdornment={
        <InputAdornment position="start">
          {hasInput ? (
            <IconButton
              sx={{ padding: 0 }}
              onClick={() => {
                if (inputRef.current) inputRef.current.value = '';
                setHasInput(false);
                onChange('');
              }}
            >
              <ClearIcon />
            </IconButton>
          ) : (
            <SearchIcon />
          )}
        </InputAdornment>
      }
      onChange={(e) => {
        setHasInput(e.target.value.length > 0);
        onChange(e.target.value);
      }}
    />
  );
}

function ControlledTreeView({
  treeData,
  toExpand,
  onItemClick,
  onClose,
  commands,
}: {
  treeData: TreeItemData[];
  toExpand: boolean;
  onItemClick: (configType: string | undefined) => void;
  onClose: () => void;
  commands?: Command[];
}): JSX.Element {
  const [expanded, setExpanded] = useState<string[]>([]);
  const handleToggle = (e: React.SyntheticEvent, nodeIds: string[]): void => {
    setExpanded(nodeIds);
  };
  const treeItemIds = useCallback((item: TreeItemData): string[] => {
    const ids: string[] = [item.id];
    for (const child of item.children ?? []) {
      ids.push(...treeItemIds(child));
    }
    return ids;
  }, []);
  const treeDataIds = treeData.map((item) => treeItemIds(item)).flat();

  useEffect(() => {
    if (toExpand) setExpanded(treeDataIds);
    else setExpanded([]);
  }, [toExpand]);

  const renderTreeItem = useCallback(
    (item: TreeItemData): JSX.Element => (
      <TreeItem
        key={item.id}
        nodeId={item.id}
        label={item.name}
        onClick={() => {
          if (!Array.isArray(item.children)) onItemClick(item.configType);
        }}
        title={item.tooltip}
      >
        {Array.isArray(item.children)
          ? item.children.map((node) => renderTreeItem(node))
          : null}
      </TreeItem>
    ),
    []
  );

  return (
    <TreeView
      aria-label="nodes types"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      onNodeToggle={handleToggle}
      sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {treeData.map((root) => renderTreeItem(root))}
      {commands?.map((command) => (
        <StyledTreeItem
          key={command.name}
          nodeId={command.name}
          labelText={command.name}
          labelIcon={command.labelIcon}
          labelInfo={command.labelInfo}
          color="#1a73e8"
          bgColor="#e8f0fe"
          onClick={() => {
            command.action();
            onClose();
          }}
          title={command.tooltip}
        />
      ))}
    </TreeView>
  );
}

const SearchMenu = memo(function SearchMenu({
  open,
  onClose,
  anchorPosition,
  nodeConfigs,
  addNode,
  moreCommands,
}: {
  open: boolean;
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  nodeConfigs: Record<string, any>;
  addNode: (configType: string) => void;
  moreCommands?: Command[];
}): JSX.Element {
  const [treeData] = useState<TreeItemData[]>(
    nodeConfigsToTreeData(nodeConfigs)
  );
  const [filteredTreeData, setFilteredTreeData] =
    useState<TreeItemData[]>(treeData);
  const [toExapand, setToExapand] = useState<boolean>(false);

  const filteredTreeItemData = (
    item: TreeItemData,
    searchKeyword: string
  ): TreeItemData | null => {
    if (
      item.name.toLocaleLowerCase().includes(searchKeyword.toLocaleLowerCase())
    )
      return { ...item };
    const children: TreeItemData[] = [];
    for (const child of item.children ?? []) {
      const fItem = filteredTreeItemData(child, searchKeyword);
      if (fItem) children.push(fItem);
    }
    if (children?.length) return { ...item, children };
    return null;
  };

  const search = useCallback((searchKeyword: string) => {
    if (searchKeyword === '') {
      setFilteredTreeData(treeData);
      setToExapand(false);
    } else {
      const filteredTreeData: TreeItemData[] = [];
      for (const item of treeData) {
        const fItem = filteredTreeItemData(item, searchKeyword);
        if (fItem) filteredTreeData.push(fItem);
      }
      setFilteredTreeData(filteredTreeData);
      setToExapand(true);
    }
  }, []);

  const onItemClick = useCallback((configType: string | undefined): void => {
    if (configType) {
      addNode(configType);
      onClose();
    }
  }, []);

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
      <SearchInput onChange={search} />
      <ControlledTreeView
        treeData={filteredTreeData}
        toExpand={toExapand}
        onItemClick={onItemClick}
        onClose={onClose}
        commands={commands}
      />
    </Menu>
  );
});

export default SearchMenu;
