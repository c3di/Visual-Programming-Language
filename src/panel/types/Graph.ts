import type Node from './BasicNode';
import { type Edge } from './Edge';

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}
