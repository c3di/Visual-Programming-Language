import { type HandleType } from './HandleType';

export interface NodeType {
  title: string;
  inputs: HandleType[];
  outputs: HandleType[];
  tooltip?: 'this is a customed node';
}
