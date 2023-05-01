import React from 'react';
import { SearchedTreeView, nodeConfigsToTreeData } from './SearchedTreeView';
import { nodeConfigRegistry } from '../extension';

export default function NodeLibrariesPanel(): JSX.Element {
  return (
    <SearchedTreeView
      treeData={nodeConfigsToTreeData(nodeConfigRegistry.getAllNodeConfigs())}
      deletable={true}
      onItemDelete={(path) => {
        // nodeConfigRegistry.removeNodeConfig(path);
        console.log('delete', path);
      }}
    />
  );
}
