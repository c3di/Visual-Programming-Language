import { type Edge as RfEdge } from 'reactflow';
import { type BasicNodeData } from './BasicNode';

export interface EdgeData extends BasicNodeData {
  dataType?: string | string[];
}

export type Edge = RfEdge<EdgeData>;
