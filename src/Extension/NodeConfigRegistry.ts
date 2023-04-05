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

  public getAllNodeConfigs(): Record<string, NodeConfig> {
    return this.registry;
  }

  public getNodeConfig(name: string): NodeConfig {
    const path = name.split('.');
    let node = this.registry[path[0]];
    for (let i = 1; i < path.length; i++) {
      node = node?.[path[i]];
    }
    return node;
  }
}

export const nodeConfigRegistry = NodeConfigRegistry.getInstance();
