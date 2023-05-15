import React, { memo, useCallback, useEffect, useState } from 'react';
import { TreeView } from '@mui/lab';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import { type NodeConfig, type NodePackage } from '../types';
import StyledTreeItem from './StyledTreeItem';
import SearchInput from './SearchInput';
import { type SvgIconProps } from '@mui/material';

let itemId = 0;

export interface TreeItemData {
  id: string;
  name: string;
  configType?: string;
  children?: readonly TreeItemData[];
  tooltip?: string;
  labelIcon?: React.ElementType<SvgIconProps> | undefined;
  onClick?: (item: any) => void;
}

export const nodeConfigsToTreeData = (
  nodeConfigs: Record<string, NodePackage | NodeConfig>
): TreeItemData[] => {
  const data: TreeItemData[] = [];
  for (const name in nodeConfigs) {
    const config = nodeConfigs[name];
    if (config.notShowInMenu || !config.enable) continue;
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
  for (const name in nodeConfig.isPackage ? nodeConfig.nodes : {}) {
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

  const renderTreeItem = useCallback((item: TreeItemData): JSX.Element => {
    return (
      <StyledTreeItem
        key={item.id}
        nodeId={item.id}
        labelText={item.name}
        labelIcon={item.labelIcon}
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
    );
  }, []);

  return (
    <TreeView
      aria-label="nodes types"
      defaultCollapseIcon={<ExpandMore sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />}
      defaultExpandIcon={<ChevronRight sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />}
      expanded={expanded}
      onNodeToggle={handleToggle}
      sx={{
        width: '100%',
        height: 'auto',
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'auto',
        maxHeight: '230px',
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
  onItemDelete?: (type: string) => void;
}): JSX.Element {
  const [filteredTreeData, setFilteredTreeData] =
    useState<TreeItemData[]>(treeData);

  useEffect(() => {
    setFilteredTreeData(treeData);
  }, [treeData]);

  const [toExpand, setToExpand] = useState<boolean>(false);

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
      setToExpand(false);
    } else {
      const filteredTreeData: TreeItemData[] = [];
      for (const item of treeData) {
        const fItem = filteredTreeItemData(item, searchKeyword);
        if (fItem) filteredTreeData.push(fItem);
      }
      setFilteredTreeData(filteredTreeData);
      setToExpand(true);
    }
  }, []);

  const deleteItemInItemData = useCallback(
    (item: TreeItemData, type: string): null | TreeItemData => {
      if (item.configType === type) return null;
      if (item.children) {
        const children: TreeItemData[] = [];
        for (const child of item.children) {
          const fItem = deleteItemInItemData(child, type);
          if (fItem) children.push(fItem);
        }
        if (item.children) return { ...item, children };
      }
      return { ...item };
    },
    []
  );

  const deleteItemInTreeData = useCallback((type: string) => {
    setFilteredTreeData((treeData) => {
      const newTreeData: TreeItemData[] = [];
      for (const item of treeData) {
        const newItem = deleteItemInItemData(item, type);
        if (newItem) newTreeData.push(newItem);
      }
      return newTreeData;
    });
  }, []);

  return (
    <div
      className="VP_MenuList"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <SearchInput onChange={search} />
      <ControlledTreeView
        toExpand={toExpand}
        treeData={filteredTreeData}
        onItemClick={onItemClick}
        deletable={deletable}
        onItemDelete={(type) => {
          deleteItemInTreeData(type);
          onItemDelete?.(type);
        }}
      />
    </div>
  );
});
