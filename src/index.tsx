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
import { NodeLibraryList, Progress } from './editor/gui';
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
  const [nodeExtensions, setNodeExtensions] = useState(
    nodeConfigRegistry.getAllNodeConfigs()
  );
  return (
    <>
      <Progress enable={false} />
      <NodeLibraryList
        title="INSTALLED"
        nodeExtensions={{ ...nodeExtensions }}
        onUninstall={(name: string) => {
          console.log('uninstall');
          nodeConfigRegistry.removeNodeConfig(name);
          console.log(nodeConfigRegistry.getAllNodeConfigs());
          setNodeExtensions({ ...nodeConfigRegistry.getAllNodeConfigs() });
        }}
        onDisable={(name: string) => {
          console.log('disable');
          nodeConfigRegistry.enableNodeConfig(name, false);
          setNodeExtensions(nodeConfigRegistry.getAllNodeConfigs());
        }}
        onEnable={(name: string) => {
          console.log('enable');
          nodeConfigRegistry.enableNodeConfig(name, true);
          setNodeExtensions(nodeConfigRegistry.getAllNodeConfigs());
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
