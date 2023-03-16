import { type HandleType } from './HandleType';
import { type Node as RfNode } from 'reactflow';

interface NodeData {
  title: string;
  inputs: HandleType[];
  outputs: HandleType[];
  tooltip?: 'this is a customed node';
}

export type NodeType = RfNode<NodeData>;
