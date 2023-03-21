import { type BasciNodeData } from './BasicNode';

export interface Comment extends BasciNodeData {
  comment: string;
}

export function isCommentNode(nodeData: BasciNodeData): boolean {
  return 'comment' in nodeData;
}
