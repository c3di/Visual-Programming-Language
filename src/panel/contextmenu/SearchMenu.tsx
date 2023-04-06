import { IconButton, Input, InputAdornment, Menu } from '@mui/material';
import { TreeView } from '@mui/lab';
import TreeItem from '@mui/lab/TreeItem';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { type NodeConfig } from '../types';

let itemId = 0;

interface TreeItemData {
  id: string;
  name: string;
  configType?: string;
  children?: readonly TreeItemData[];
}

const nodeConfigsToTreeData = (
  nodeConfigs: Record<string, NodeConfig>
): TreeItemData[] => {
  return Object.entries(nodeConfigs).map(([name, config]) =>
    nodeConfigToTreeItemData(name, config)
  );
};

const nodeConfigToTreeItemData = (
  name: string,
  nodeConfig: any
): TreeItemData => {
  return {
    id: String(itemId++),
    name,
    configType: nodeConfig.type,
    children: Object.entries(nodeConfig.isDir ? nodeConfig.nodes : {}).map(
      ([name, config]) => nodeConfigToTreeItemData(name, config)
    ),
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
}: {
  treeData: TreeItemData[];
  toExpand: boolean;
  onItemClick: (configType: string | undefined) => void;
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
          console.log(item.configType);
          if (Array.isArray(item.children)) onItemClick(item.configType);
        }}
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
    </TreeView>
  );
}

const SearchMenu = memo(function SearchMenu({
  open,
  onClose,
  anchorPosition,
  nodeConfigs,
  addNode,
}: {
  open: boolean;
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  nodeConfigs: Record<string, any>;
  addNode: (configType: string) => void;
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

  return (
    <Menu
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
      />
    </Menu>
  );
});

export default SearchMenu;
