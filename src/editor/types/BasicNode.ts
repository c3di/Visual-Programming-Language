import { type Node as RcNode } from 'reactflow';
export interface BasicNodeData {
  tooltip?: string;
  configType?: string;
}
export type Node = RcNode<any, string | undefined>;
export default Node;
