import { type Edge } from './Edge';
import { type Node } from './BasicNode';
import { type GraphNodeConfig } from './ConfigTypes';

export interface GraphData {
  nodeConfigs: GraphNodeConfig[];
  edgeConfigs: Edge[];
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}
