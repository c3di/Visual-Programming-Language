import { type Handle } from './Handle';
import { type BasicNodeData } from './BasicNode';

export interface ConnectableData extends BasicNodeData {
  title: string;
  inputs?: Record<string, Handle>;
  outputs?: Record<string, Handle>;
  dataType?: string;
  nodeRef?: string;
}
