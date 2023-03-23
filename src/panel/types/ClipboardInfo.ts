import type Node from './BasicNode';
import { type Edge } from './Edge';
export interface ClipboardInfo {
  isEmpty: boolean;
  nodes: Node[];
  edges: Edge[];
  minX: number;
  minY: number;
}
export default ClipboardInfo;
