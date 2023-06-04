import React, { memo, useCallback, useState } from 'react';

import { TargetHandle } from '../handles';
import { useSceneState } from '../../Context';

import { type ConnectableData, DataTypes } from '../../types';

function CreateVariable({
  id,
  data,
}: {
  id: string;
  data: ConnectableData;
}): JSX.Element {
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => {
    updateState({});
  }, []);
  const { setNodes, setExtraCommands, deleteAllEdgesOfNode } =
    useSceneState()?.sceneActions ?? {};

  const updateName = useCallback((newVa: string, oldVa: string) => {
    setExtraCommands?.((cmds) =>
      cmds.map((cmd) => {
        if (cmd.name === oldVa) {
          cmd.name = newVa;
        }
        return cmd;
      })
    );

    setNodes?.((nds) =>
      nds.map((n) => {
        if (n.data.nodeRef === id) {
          if (n.type === 'getter')
            n.data = {
              ...n.data,
              outputs: {
                getter: {
                  ...n.data.outputs.getter,
                  title: newVa,
                },
              },
            };
          else if (n.type === 'setter')
            n.data = {
              ...n.data,
              inputs: {
                setter: {
                  ...n.data.inputs.setter,
                  title: newVa,
                },
              },
              outputs: {
                'setter-out': {
                  ...n.data.outputs['setter-out'],
                  title: newVa,
                },
              },
            };
        }
        return n;
      })
    );
  }, []);

  const changeType = useCallback((newVa: any): void => {
    const toUpdateEdge: string[] = [];
    setNodes?.((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          n.data.inputs.value = {
            ...n.data.inputs.value,
            dataType: newVa,
            defaultValue: DataTypes[newVa].defaultValue,
            value: DataTypes[newVa].defaultValue,
          };
        } else if (n.data.nodeRef === id) {
          toUpdateEdge.push(n.id);
          if (n.type === 'getter')
            n.data = {
              ...n.data,
              outputs: {
                getter: {
                  ...n.data.outputs.getter,
                  dataType: newVa,
                },
              },
            };
          else if (n.type === 'setter')
            n.data = {
              ...n.data,
              inputs: {
                setter: {
                  ...n.data.inputs.setter,
                  dataType: newVa,
                },
              },
              outputs: {
                'setter-out': {
                  ...n.data.outputs['setter-out'],
                  dataType: newVa,
                },
              },
            };
        }
        return n;
      })
    );
    toUpdateEdge.forEach((id) => {
      deleteAllEdgesOfNode?.(id);
    });
    forceUpdate();
  }, []);

  const onValueChanges: Record<string, any> = {
    type: changeType,
    name: updateName,
  };

  const inputhandles = [];
  for (const inputId in data.inputs) {
    if (inputId === 'value' && data.inputs.value.defaultValue === undefined)
      continue;
    inputhandles.push(
      <TargetHandle
        key={inputId}
        id={inputId}
        nodeId={id}
        showWidget={true}
        showTitle={true}
        handleData={data.inputs[inputId]}
        onValueChange={onValueChanges[inputId]}
      />
    );
  }

  return (
    <div title={data.tooltip} className="vp-node-containter">
      <div className="node__header">
        <strong>{data.title}</strong>
      </div>
      <div className="node__body">
        <div className="vp-node-handles-containter">{inputhandles}</div>
      </div>
    </div>
  );
}

export default memo(CreateVariable);
