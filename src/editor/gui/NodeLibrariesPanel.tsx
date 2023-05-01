import React from 'react';
import { SearchedTreeView, nodeConfigsToTreeData } from './SearchedTreeView';
import { nodeConfigRegistry } from '../extension';

export default function NodeLibrariesPanel({
  onItemDelete,
}: {
  onItemDelete?: (path: string) => void;
}): JSX.Element {
  return (
    <SearchedTreeView
      treeData={nodeConfigsToTreeData(nodeConfigRegistry.getAllNodeConfigs())}
      deletable={true}
      onItemDelete={(path) => {
        nodeConfigRegistry.removeNodeConfig(path);
        onItemDelete?.(path);
      }}
    />
  );
}
