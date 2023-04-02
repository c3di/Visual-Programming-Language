import { type NodeConfig } from '../panel/types';

export class NodeConfigRegistry {
  private static instance: NodeConfigRegistry;
  private readonly registry: Record<string, NodeConfig> = {};

  private constructor() {}

  public static getInstance(): NodeConfigRegistry {
    if (!NodeConfigRegistry.instance) {
      NodeConfigRegistry.instance = new NodeConfigRegistry();
    }
    return NodeConfigRegistry.instance;
  }

  public registerNodeConfig(name: string, node: any): void {
    this.registry[name] = node;
  }

  public getNodeConfig(name: string): NodeConfig {
    return this.registry[name];
  }
}

export const nodeConfigRegistry = NodeConfigRegistry.getInstance();
