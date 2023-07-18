import { type BasicNodeData } from './BasicNode';

export interface Comment extends BasicNodeData {
  comment: string;
  width?: number;
  height?: number;
  defaultEditable?: boolean;
}

export function isCommentNode(nodeData: BasicNodeData): boolean {
  return 'comment' in nodeData || nodeData.configType === 'comment';
}
