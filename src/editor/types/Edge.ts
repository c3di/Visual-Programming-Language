import { type Edge as RfEdge } from 'reactflow';
import { type BasicNodeData } from './BasicNode';

export interface EdgeData extends BasicNodeData {
  dataType?: string;
}

export type Edge = RfEdge<EdgeData>;
