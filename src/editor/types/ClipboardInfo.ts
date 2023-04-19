import type Node from './BasicNode';
import { type Edge } from './Edge';
export interface ClipboardInfo {
  hasNodes: boolean;
  nodes: Record<string, Node>;
  edges: Edge[];
  minX: number;
  minY: number;
}
export default ClipboardInfo;
