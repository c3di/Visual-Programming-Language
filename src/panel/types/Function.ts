import { type Handle } from './Handle';
import { type BasciNodeData } from './BasicNode';

export interface FunctionNodeData extends BasciNodeData {
  title: string | JSX.Element;
  inputs?: Record<string, Handle>;
  outputs?: Record<string, Handle>;
}
