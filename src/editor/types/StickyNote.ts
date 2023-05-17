import { type BasicNodeData } from './BasicNode';

export default interface StickyNote extends BasicNodeData {
  stickyNote: string;
  width?: number;
  height?: number;
}

export function isStickyNote(nodeData: BasicNodeData): boolean {
  return 'stickyNote' in nodeData;
}
