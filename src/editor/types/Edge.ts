import { type Edge as RfEdge } from 'reactflow';
import { type BasciNodeData } from './BasicNode';

export interface EdgeData extends BasciNodeData {
  dataType?: string;
}

export type Edge = RfEdge<EdgeData>;
