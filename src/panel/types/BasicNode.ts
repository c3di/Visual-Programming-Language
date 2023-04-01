import { type Node as RcNode } from 'reactflow';
export interface BasciNodeData {
  tooltip?: string;
}
export type Node = RcNode<any, string | undefined>;
export default Node;
