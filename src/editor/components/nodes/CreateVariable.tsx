import React, { memo, useCallback, useState } from 'react';

import { TargetHandle } from '../handles';
import { useSceneActions } from '../../Context';

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
  const { setNodes, setExtraCommands } = useSceneActions() ?? {};

  const updateCommandName = useCallback((newVa: string, oldVa: string) => {
    setExtraCommands?.((cmds) =>
      cmds.map((cmd) => {
        if (cmd.name === oldVa) {
          cmd.name = newVa;
        }
        return cmd;
      })
    );
  }, []);

  const changeValue = useCallback((newVa: any): void => {
    setNodes?.((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          n.data.inputs.value = {
            ...n.data.inputs.value,
            dataType: newVa,
            defaultValue: DataTypes[newVa].defaultValue,
            value: DataTypes[newVa].defaultValue,
          };
        }
        return n;
      })
    );
    forceUpdate();
  }, []);

  const onValueChanges: Record<string, any> = {
    type: changeValue,
    name: updateCommandName,
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
    <div title={data.tooltip}>
      <div className="node__header">
        <strong>{data.title}</strong>
      </div>
      <div className="node__body">
        <div className="node__input-handles">{inputhandles}</div>
        <div className="node__clear"></div>
      </div>
    </div>
  );
}

export default memo(CreateVariable);
