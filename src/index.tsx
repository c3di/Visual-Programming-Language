import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import example from './VPFileExample.json';
import { extensions } from './NodeTypePackage';
import {
  VPEditor,
  InPlaceTextArea,
  type ISceneActions,
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

let sceneActions: ISceneActions | undefined;

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
      <div style={{ height: '300px' }}>
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
      </div>
      <div style={{ margin: '20px', width: '200px' }}>
        <InPlaceTextArea text="hello world" />
      </div>
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
      <textarea value={JSON.stringify(changedCount)} onChange={() => {}} />
      <VPEditor
        id={id}
        content={content}
        onContentChange={(content) => {
          // console.log('content changed', content);
          setChangedCount((count) => count + 1);
        }}
        activated={activated}
        onSceneActionsInit={(actions) => {
          sceneActions = actions;
        }}
        onSelectionChange={(selection) => {
          // console.log('selection changed', selection);
        }}
        option={{ controller: { hidden: false } }}
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
