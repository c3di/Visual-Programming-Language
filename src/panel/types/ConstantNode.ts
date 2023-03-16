import { type Handle } from './Handle';
import { type BasciNodeData } from './BasicNode';
import type Node from './BasicNode';

interface ConstantNodeData extends BasciNodeData {
  value: { title: string; handle: Handle };
  tooltip?: string;
}

export type ConstantNode = Node<ConstantNodeData>;
