import { type Handle as HandleData } from './Handle';

export interface HandleConfig {
  title: string;
  dataType: string;
  defaultValue?: any;
  tooltip?: string;
}

export interface NodeConfig {
  category: string;
  title: string;
  inputs?: Record<string, HandleConfig>;
  outputs?: Record<string, HandleConfig>;
  tooltip?: string;
}

export interface GraphNodeConfig extends NodeConfig {
  id: string;
  position: { x: number; y: number };
  inputs?: Record<string, HandleData>;
  outputs?: Record<string, HandleData>;
}

export interface serializedNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
}
