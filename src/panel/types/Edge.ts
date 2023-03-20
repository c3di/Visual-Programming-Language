import { type Edge as RfEdge } from 'reactflow';
import { type DataType } from './DataType';
import { type BasciNodeData } from './BasicNode';

export interface EdgeData extends BasciNodeData {
  dataType?: DataType;
}

export type Edge = RfEdge<EdgeData>;
