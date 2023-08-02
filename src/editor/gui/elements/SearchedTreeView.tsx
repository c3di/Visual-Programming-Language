import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { TreeView } from '@mui/lab';
import { type SvgIconProps } from '@mui/material';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import {
  type NodeConfig,
  type NodePackage,
  type HandleConfig,
} from '../../types';
import StyledTreeItem from './StyledTreeItem';
import SearchInput from './SearchInput';

let itemId = 0;

export interface TreeItemData {
  id: string;
  name: string;
  configType?: string;
  children?: TreeItemData[];
  tooltip?: string;
  labelIcon?: React.ElementType<SvgIconProps> | undefined;
  inputs?: Record<string, HandleConfig>;
  outputs?: Record<string, HandleConfig>;
  onClick?: (item: TreeItemData, e: React.MouseEvent<HTMLLIElement>) => void;
  rank?: number;
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
  if (!nodeConfig) {
    return undefined;
  }
  if (nodeConfig.notShowInMenu) return;
  const children = [];
  for (const name in nodeConfig.isPackage ? nodeConfig.nodes : {}) {
    const config = nodeConfig.nodes[name];
    if (config.notShowInMenu) continue;
    const itemData = nodeConfigToTreeItemData(name, config);
    if (itemData) children.push(itemData);
  }
  const data: TreeItemData = {
    id: String(itemId++),
    name,
    configType: 'type' in nodeConfig ? nodeConfig.type : undefined,
    children: children.length > 0 ? children : undefined,
    tooltip: nodeConfig.tooltip,
  };
  if ('inputs' in nodeConfig) {
    data.inputs = nodeConfig.inputs;
  }

  if ('outputs' in nodeConfig) {
    data.outputs = nodeConfig.outputs;
  }
  return data;
};

function ControlledTreeView({
  toExpand,
  treeData,
  onItemClick,
  onItemDelete,
  onArrowUpKeyDown,
  onArrowDownKeyDown,
  onEnterKeyDown,
}: {
  toExpand: boolean;
  treeData: TreeItemData[];
  onItemClick?: (item: TreeItemData) => void;
  onItemDelete?: (path: string) => void;
  onArrowUpKeyDown?: () => void;
  onArrowDownKeyDown?: () => void;
  onEnterKeyDown?: (
    event: React.KeyboardEvent<HTMLElement>,
    item: TreeItemData
  ) => void;
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
  }, [toExpand, treeData]);

  const renderTreeItem = useCallback((item: TreeItemData): JSX.Element => {
    return (
      <StyledTreeItem
        key={item.id}
        nodeId={item.id}
        labelText={item.name}
        labelIcon={item.labelIcon}
        onClick={(event: React.MouseEvent<HTMLLIElement>) => {
          if (item.onClick) item.onClick(item, event);
          else onItemClick?.(item);
        }}
        title={item.tooltip}
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
  const ref = useRef<HTMLDivElement>(null);
  const focusOnNew = useRef<boolean>(false);
  const focusOnTop = useRef<boolean>(false);
  const focusOnBottom = useRef<boolean>(false);
  const focusedNodeId = useRef<string | undefined>(undefined);
  const getNodeById = (
    nodes: TreeItemData[],
    id?: string
  ): TreeItemData | undefined => {
    if (id === undefined) return undefined;
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children) {
        const childNode = getNodeById(node.children, id);
        if (childNode) return childNode;
      }
    }
  };
  return (
    <TreeView
      ref={ref}
      onFocus={() => {
        focusOnNew.current = false;
      }}
      onNodeFocus={(e, node) => {
        focusOnNew.current = true;
        focusOnTop.current =
          ref.current?.children[0].id.includes(node) ?? false;
        focusOnBottom.current =
          ref.current?.children[ref.current?.children.length - 1].id.includes(
            node
          ) ?? false;
        focusedNodeId.current = node;
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          e.stopPropagation();

          if (focusOnTop.current && !focusOnNew.current) {
            onArrowUpKeyDown?.();
          }
        }

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          e.stopPropagation();

          if (focusOnBottom.current && !focusOnNew.current)
            onArrowDownKeyDown?.();
        }

        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          if (focusedNodeId.current !== undefined) {
            const focusedNode = getNodeById(treeData, focusedNodeId.current);
            if (focusedNode) {
              onEnterKeyDown?.(e, focusedNode);
            }
          }
        }

        focusOnNew.current = false;
      }}
      aria-label="nodes types"
      defaultCollapseIcon={
        <ExpandMore
          sx={{
            color: 'var(--vp-treeview-icon-color)',
            width: 'var( --vp-treeview-icon-size)',
            height: 'var( --vp-treeview-icon-size)',
          }}
        />
      }
      defaultExpandIcon={
        <ChevronRight
          sx={{
            color: 'var(--vp-treeview-icon-color)',
            width: 'var( --vp-treeview-icon-size)',
            height: 'var( --vp-treeview-icon-size)',
          }}
        />
      }
      expanded={expanded}
      onNodeToggle={handleToggle}
      sx={{
        width: '100%',
        minWidth: '200px',
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
  onItemDelete,
  onEnterKeyDown,
  triggerExpand,
}: {
  treeData: TreeItemData[];
  onItemClick?: (item: TreeItemData) => void;
  onItemDelete?: (type: string) => void;
  onEnterKeyDown?: (
    event: React.KeyboardEvent<HTMLElement>,
    item: TreeItemData
  ) => void;
  triggerExpand?: boolean;
}): JSX.Element {
  const [filteredTreeData, setFilteredTreeData] =
    useState<TreeItemData[]>(treeData);

  useEffect(() => {
    setFilteredTreeData(treeData);
  }, [treeData]);

  const [toExpand, setToExpand] = useState<boolean>(false);

  useEffect(() => {
    if (triggerExpand) {
      setToExpand((prevToExpand) => true);
    }
  }, [triggerExpand, treeData]);

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

  const search = useCallback(
    (searchKeyword: string) => {
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
    },
    [treeData]
  );

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

  const searchTreeViewRef = useRef<HTMLDivElement>(null);
  const focusOnTreeView = useCallback(() => {
    const treeView = searchTreeViewRef.current?.children[1];
    (treeView?.children[0] as HTMLElement)?.focus();
  }, []);
  const focusOnSearchInput = useCallback(() => {
    const searchInput = searchTreeViewRef.current?.children[0];
    (searchInput?.children[0] as HTMLInputElement)?.focus();
    scrollToTop();
  }, []);
  const scrollToBottom = useCallback(() => {
    (
      searchTreeViewRef.current?.children[1].lastChild as HTMLDivElement
    ).scrollIntoView(false);
  }, []);
  const scrollToTop = useCallback(() => {
    (
      searchTreeViewRef.current?.children[1].firstChild as HTMLDivElement
    ).scrollIntoView(true);
  }, []);

  return (
    <div
      className="VP_MenuList"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      ref={searchTreeViewRef}
    >
      <SearchInput onChange={search} onArrowDownKeyDown={focusOnTreeView} />
      <ControlledTreeView
        toExpand={toExpand}
        treeData={filteredTreeData}
        onItemClick={onItemClick}
        onItemDelete={(type) => {
          deleteItemInTreeData(type);
          onItemDelete?.(type);
        }}
        onArrowUpKeyDown={focusOnSearchInput}
        onArrowDownKeyDown={scrollToBottom}
        onEnterKeyDown={onEnterKeyDown}
      />
    </div>
  );
});

export default SearchedTreeView;
