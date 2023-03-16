import { type NodeType } from './NodeType';
import { type EdgeType } from './EdgeType';

export interface Graph {
  nodes: NodeType[];
  edges: EdgeType[];
}
