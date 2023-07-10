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

  return <FunctionNode id={id} data={{ ...data }} />;
}

export default memo(FunctionCall);
