import { type ConnectableData } from './Connectable';

export interface VariableNodeData extends ConnectableData {
  isConstant?: boolean;
  dataType: string;
  nodeRef?: string;
}
