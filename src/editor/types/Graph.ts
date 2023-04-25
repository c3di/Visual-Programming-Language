import { type Edge } from './Edge';
import { type Node } from './BasicNode';
import type { SerializedGraphEdge, SerializedGraphNode } from './ConfigTypes';

export interface SerializedGraph {
  nodes: SerializedGraphNode[];
  edges: SerializedGraphEdge[];
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}
