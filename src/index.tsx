import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import example from './VPFileExample.json';
import { extensions } from './NodeTypePackage';
import {
  VPEditor,
  type ISceneActions,
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

let sceneActions: ISceneActions | undefined;

function MainArea({ id }: { id: string }): JSX.Element {
  const [content, setContent] = useState<SerializedGraph | undefined>(
    undefined
  );
  const [activated, setActivated] = useState<boolean>(false);
  const [nodeExtensions, setNodeExtensions] = useState(
    nodeConfigRegistry.getAllNodeConfigs()
  );

  return (
    <>
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
      <button
        onClick={() => {
          sceneActions?.clear();
        }}
      >
        clear
      </button>
      <button
        onClick={() => {
          sceneActions?.autoLayout();
        }}
      >
        auto layout
      </button>
      <button
        onClick={() => {
          const sourceCode = sceneActions?.sourceCode();
          console.log(sourceCode);
        }}
      >
        source code
      </button>
      <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
        <div style={{ width: '100px', height: '824px' }}>
          <NodeLibraryList
            title="INSTALLED"
            nodeExtensions={{ ...nodeExtensions }}
            onUninstall={(name: string) => {
              nodeConfigRegistry.removeNodeConfig(name);
              setNodeExtensions({ ...nodeConfigRegistry.getAllNodeConfigs() });
            }}
            onDisable={(name: string) => {
              nodeConfigRegistry.enableNodeConfig(name, false);
              setNodeExtensions(nodeConfigRegistry.getAllNodeConfigs());
            }}
            onEnable={(name: string) => {
              nodeConfigRegistry.enableNodeConfig(name, true);
              setNodeExtensions(nodeConfigRegistry.getAllNodeConfigs());
            }}
          />
        </div>
        <div style={{ flexGrow: 1 }}>
          <VPEditor
            id={id}
            content={content}
            onContentChange={(content) => {
              // ...
            }}
            activated={activated}
            onSceneActionsInit={(actions) => {
              // ...
            }}
            onSelectionChange={(selection) => {
              // ...
            }}
            option={{
              controller: { hidden: false },
              minimap: {
                collapsed: true,
              },
            }}
          />
        </div>
      </div>
    </>
  );
}

function App(): JSX.Element {
  return (
    <>
      <MainArea id={'b1'} />
    </>
  );
}
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);
