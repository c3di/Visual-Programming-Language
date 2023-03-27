import { type ConnectableData } from './Connectable';

export interface VariableNodeData extends ConnectableData {
  isConstant?: boolean;
  type: string;
}
