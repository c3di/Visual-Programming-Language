import { type Edge } from './Edge';
import { type Node } from './BasicNode';
import type { GraphEdgeConfig, SerializedGraphNode } from './ConfigTypes';

export interface GraphData {
  serializedNodes: SerializedGraphNode[];
  edgeConfigs: GraphEdgeConfig[];
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}
