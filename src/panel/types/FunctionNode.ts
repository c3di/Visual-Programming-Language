import { type Handle } from './Handle';
import { type BasciNodeData } from './BasicNode';
import type Node from './BasicNode';

interface FunctionNodeData extends BasciNodeData {
  inputs?: Record<string, Handle>;
  outputs?: Record<string, Handle>;
  tooltip?: string;
}

export type FunctionNode = Node<FunctionNodeData>;
