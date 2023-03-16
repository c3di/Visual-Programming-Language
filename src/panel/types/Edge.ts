import { type Edge as RfEdge } from 'reactflow';
import { type DataType } from './DataType';

interface EdgeData {
  dataType?: DataType;
}

export type Edge = RfEdge<EdgeData>;
