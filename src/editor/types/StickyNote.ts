import { type BasicNodeData } from './BasicNode';

export interface StickyNote extends BasicNodeData {
  stickyNote: string;
  width?: number;
  height?: number;
}
