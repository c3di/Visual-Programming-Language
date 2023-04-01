import { type Handle as HandleData } from './Handle';

export interface HandleConfig {
  title: string;
  dataType: string;
  defaultValue?: any;
  tooltip?: string;
}

export interface NodeConfig {
  category: string;
  title?: string;
  inputs?: Record<string, HandleConfig>;
  outputs?: Record<string, HandleConfig>;
  tooltip?: string;
}

export interface GraphNodeConfig extends NodeConfig {
  id: string;
  position: { x: number; y: number };
  dataType?: string; // the data type for all the handles
  inputs?: Record<string, HandleData>;
  outputs?: Record<string, HandleData>;
  [key: string]: any;
}

export interface GraphEdgeConfig {
  id: string;
  input: string;
  output: string;
  inputHandle: string;
  outputHandle: string;
  dataType?: string;
}

export interface serializedNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
}
