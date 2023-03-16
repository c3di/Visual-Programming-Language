import { type HandleType } from './HandleType';
import { type Node as RfNode } from 'reactflow';

interface NodeData {
  label: string | JSX.Element;
  inputs?: HandleType[];
  outputs?: HandleType[];
  tooltip?: string;
}

export type NodeType = RfNode<NodeData>;
