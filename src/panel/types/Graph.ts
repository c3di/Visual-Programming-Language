import { type Edge } from './Edge';
import { type Node } from './BasicNode';
import type { GraphEdgeConfig, GraphNodeConfig } from './ConfigTypes';

export interface GraphData {
  nodeConfigs: GraphNodeConfig[];
  edgeConfigs: GraphEdgeConfig[];
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}
