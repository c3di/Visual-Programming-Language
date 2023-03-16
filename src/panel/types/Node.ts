import { type Handle } from './Handle';
import { type Node as RfNode } from 'reactflow';

interface NodeData {
  label: string | JSX.Element;
  inputs?: Handle[];
  outputs?: Handle[];
  tooltip?: string;
}

export type Node = RfNode<NodeData>;
