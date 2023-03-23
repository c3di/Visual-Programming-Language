import type Node from './BasicNode';
import { type Edge } from './Edge';

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const Graph = (data: GraphData) => {
  return {
    data,
  };
};
