import { type Handle as HandleData } from './Handle';

export interface HandleConfig {
  title?: string;
  dataType?: string;
  defaultValue?: any;
  tooltip?: string;
}

export interface NodeConfig {
  category: string;
  title?: string;
  inputs?: Record<string, HandleConfig>;
  outputs?: Record<string, HandleConfig>;
  tooltip?: string;
  [key: string]: any;
  dataType?: string; // the data type for all the handles
  enable?: boolean;
  codeGenerator?: string;
  externalImports?: string;
}

export interface NodePackage {
  isPackage: true;
  nodes: Record<string, NodeConfig | NodePackage>;
  notShowInMenu?: boolean;
  tooltip?: string;
  href?: string;
  description?: string;
  type: string;
  enable?: boolean;
}

export interface GraphNodeConfig extends NodeConfig {
  id: string;
  type: string;
  position: { x: number; y: number };
  inputs?: Record<string, HandleData>;
  outputs?: Record<string, HandleData>;
}

export interface GraphEdgeConfig {
  id: string;
  input: string;
  output: string;
  inputHandle: string;
  outputHandle: string;
  dataType?: string;
}

export interface SerializedHandle {
  value?: any;
  [key: string]: any;
}

export interface SerializedGraphNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  inputs?: Record<string, SerializedHandle>;
  outputs?: Record<string, SerializedHandle>;
  [key: string]: any;
}

export type SerializedGraphEdge = GraphEdgeConfig;
