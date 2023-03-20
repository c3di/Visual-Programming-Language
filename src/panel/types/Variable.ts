import { type Handle } from './Handle';
import { type BasciNodeData } from './BasicNode';

export interface VariableNodeData extends BasciNodeData {
  value: { title: string; handle: Handle };
  isConstant?: boolean;
}
