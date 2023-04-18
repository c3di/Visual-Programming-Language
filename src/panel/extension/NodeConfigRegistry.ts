import { type NodeDirConfig, type NodeConfig } from '../types';

export class NodeConfigRegistry {
  private static instance: NodeConfigRegistry;
  private readonly registry: Record<string, NodeConfig | NodeDirConfig> = {};

  private constructor() {}

  public static getInstance(): NodeConfigRegistry {
    if (!NodeConfigRegistry.instance) {
      NodeConfigRegistry.instance = new NodeConfigRegistry();
    }
    return NodeConfigRegistry.instance;
  }

  public registerNodeConfig(
    name: string,
    node: NodeConfig | NodeDirConfig
  ): void {
    this.registry[name] = node;
  }

  public getAllNodeConfigs(): Record<string, NodeConfig | NodeDirConfig> {
    return this.registry;
  }

  public getNodeConfig(name: string): NodeConfig {
    const path = name.split('.');
    if (path.length === 1) return this.registry[name] as NodeConfig;
    let node = this.registry[path[0]].nodes;
    for (let i = 1; i < path.length; i++) {
      node = node?.[path[i]];
      if (i !== path.length - 1) node = node?.nodes;
    }
    return node;
  }
}

export const nodeConfigRegistry = NodeConfigRegistry.getInstance();
