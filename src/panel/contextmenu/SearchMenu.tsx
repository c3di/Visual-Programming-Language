import { IconButton, Input, InputAdornment } from '@mui/material';
import { TreeView } from '@mui/lab';
import TreeItem from '@mui/lab/TreeItem';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React, { memo, useCallback, useEffect, useState } from 'react';

interface TreeItemData {
  id: string;
  name: string;
  children?: readonly TreeItemData[];
}

const root: TreeItemData = {
  id: 'root',
  name: 'Parent',
  children: [
    {
      id: '1',
      name: 'Child - 1',
    },
    {
      id: '3',
      name: 'Child - 3',
      children: [
        {
          id: '4',
          name: 'Child - 4',
        },
      ],
    },
  ],
};
const root2: TreeItemData = {
  id: 'root2',
  name: 'Parent2',
  children: [
    {
      id: '5',
      name: 'Child - 1',
    },
    {
      id: '6',
      name: 'Child - 3',
      children: [
        {
          id: '7',
          name: 'Child - 4',
        },
      ],
    },
  ],
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
      sx={{ border: 1 }}
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
}: {
  treeData: TreeItemData[];
  toExpand: boolean;
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
      <TreeItem key={item.id} nodeId={item.id} label={item.name}>
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
}: {
  open?: boolean;
  onClose?: () => void;
  anchorPosition?: { top: number; left: number };
}): JSX.Element {
  const [treeData] = useState<TreeItemData[]>([root, root2]);
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
    <div>
      <SearchInput onChange={search} />
      <ControlledTreeView treeData={filteredTreeData} toExpand={toExapand} />
    </div>
  );
});

export default SearchMenu;
