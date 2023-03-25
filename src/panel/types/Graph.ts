import type Node from './BasicNode';
import { type Edge } from './Edge';

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}
