import React, { memo } from 'react';
import { type ConnectableData } from '../../types';
import FunctionNode from './FunctionNode';
import { registFunctionRef } from '../../util';

function FunctionCall({
  id,
  data,
}: {
  id: string;
  data: ConnectableData;
}): JSX.Element {
  registFunctionRef(data, id);
  Object.values(data.inputs ?? {}).forEach((value) => {
    if (value.dataType === 'exec') {
      value.showWidget = false;
      value.showTitle = false;
    }
  });
  Object.values(data.outputs ?? {}).forEach((value) => {
    if (value.dataType === 'exec') {
      value.showWidget = false;
      value.showTitle = false;
    }
  });
  return (
    <FunctionNode
      id={id}
      data={{ ...data, tooltip: `call function ${data.title}` }}
    />
  );
}

export default memo(FunctionCall);
