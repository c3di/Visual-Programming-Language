import React, { memo, useCallback, useEffect, useState } from 'react';
import { IconButton, Input, InputAdornment } from '@mui/material';
import { TreeView } from '@mui/lab';
import { Search, Clear, ExpandMore, ChevronRight } from '@mui/icons-material';
import { type NodeConfig, type NodePackage } from '../types';
import StyledTreeItem from './StyledTreeItem';
let itemId = 0;

export interface TreeItemData {
  id: string;
  name: string;
  configType?: string;
  children?: readonly TreeItemData[];
  tooltip?: string;
  onClick?: (item: any) => void;
}

export const nodeConfigsToTreeData = (
  nodeConfigs: Record<string, NodePackage | NodeConfig>
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
  nodeConfig: NodePackage | NodeConfig
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
    configType: 'type' in nodeConfig ? nodeConfig.type : undefined,
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
              <Clear />
            </IconButton>
          ) : (
            <Search />
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
  toExpand,
  treeData,
  onItemClick,
  deletable,
  onItemDelete,
}: {
  toExpand: boolean;
  treeData: TreeItemData[];
  onItemClick?: (item: TreeItemData) => void;
  deletable?: boolean;
  onItemDelete?: (path: string) => void;
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
      <StyledTreeItem
        key={item.id}
        nodeId={item.id}
        labelText={item.name}
        onClick={() => {
          if (item.onClick) item.onClick(item);
          else onItemClick?.(item);
        }}
        title={item.tooltip}
        deletable={deletable}
        onItemDelete={() => {
          onItemDelete?.(item.configType ?? item.name);
        }}
      >
        {Array.isArray(item.children)
          ? item.children.map((node) => renderTreeItem(node))
          : null}
      </StyledTreeItem>
    ),
    []
  );

  return (
    <TreeView
      aria-label="nodes types"
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
      expanded={expanded}
      onNodeToggle={handleToggle}
      sx={{
        height: 250,
        flexGrow: 1,
        width: 230,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {treeData.map((root) => renderTreeItem(root))}
    </TreeView>
  );
}

export const SearchedTreeView = memo(function SearchedTreeView({
  treeData,
  onItemClick,
  deletable,
  onItemDelete,
}: {
  treeData: TreeItemData[];
  onItemClick?: (item: TreeItemData) => void;
  deletable?: boolean;
  onItemDelete?: (path: string) => void;
}): JSX.Element {
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

  return (
    <>
      <SearchInput onChange={search} />
      <ControlledTreeView
        toExpand={toExapand}
        treeData={filteredTreeData}
        onItemClick={onItemClick}
        deletable={deletable}
        onItemDelete={onItemDelete}
      />
    </>
  );
});
