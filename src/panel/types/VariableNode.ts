import { type Handle } from './Handle';
import { type BasciNodeData } from './BasicNode';
import type Node from './BasicNode';

interface VariableNodeData extends BasciNodeData {
  value: { title: string; handle: Handle };
  isConstant?: boolean;
  tooltip?: string;
}

export type VariableNode = Node<VariableNodeData>;
