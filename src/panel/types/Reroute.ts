import { type Handle } from './Handle';
import { type BasciNodeData } from './BasicNode';

export interface Reroute extends BasciNodeData {
  input: Handle;
  output: Handle;
}
