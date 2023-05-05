import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import example from './VPFileExample.json';
import { extensions } from './NodeTypePackage';
import {
  VPEditor,
  type SerializedGraph,
  LoadPackageToRegistry,
} from './editor';
import './index.css';
import { deepCopy } from './editor/util';
import { NodeLibraryList } from './editor/gui';
import { nodeConfigRegistry } from './editor/extension';

Object.entries(extensions).forEach(([name, extension]) => {
  LoadPackageToRegistry(name, extension);
});

function MainArea({ id }: { id: string }): JSX.Element {
  const [content, setContent] = useState<SerializedGraph | undefined>(
    undefined
  );
  const [changedCount, setChangedCount] = useState<number>(0);
  const [activated, setActivated] = useState<boolean>(false);
  const [, setRerender] = useState<boolean>(false);
  return (
    <>
      <NodeLibraryList
        title="INSTALLED"
        nodeExtensions={nodeConfigRegistry.getAllNodeConfigs()}
        onUninstall={() => {
          console.log('uninstall');
          nodeConfigRegistry.removeNodeConfig('package1');
          setRerender(true);
        }}
        onDisable={() => {
          console.log('disable');
          nodeConfigRegistry.disableNodeConfig('package1');
          setRerender(true);
        }}
        onEnable={() => {
          console.log('enable');
          nodeConfigRegistry.enableNodeConfig('package1');
          setRerender(true);
        }}
      />

      <button
        onClick={() => {
          setActivated(true);
          setContent(deepCopy(example) as SerializedGraph);
        }}
      >
        load default
      </button>
      <button
        onClick={() => {
          setActivated(false);
          setContent(undefined);
        }}
      >
        clear
      </button>

      <textarea value={JSON.stringify(changedCount)} onChange={() => {}} />
      <VPEditor
        id={id}
        content={content}
        onContentChange={(content) => {
          setChangedCount((count) => count + 1);
        }}
        activated={activated}
      />
    </>
  );
}

function App(): JSX.Element {
  return (
    <>
      <MainArea id={'b1'} />
      {/* <MainArea id={'b2'} /> */}
    </>
  );
}
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);
