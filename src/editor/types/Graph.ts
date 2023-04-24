import { type Edge } from './Edge';
import { type Node } from './BasicNode';
import type { SerializedGraphEdge, SerializedGraphNode } from './ConfigTypes';
import { type Viewport } from 'reactflow';

export interface SerializedGraph {
  nodes: SerializedGraphNode[];
  edges: SerializedGraphEdge[];
  viewport?: Viewport;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}
