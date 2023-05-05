import { type NodePackage, type NodeConfig } from '../types';

export type config = NodeConfig | NodePackage;

export class NodeConfigRegistry {
  private static instance: NodeConfigRegistry;
  private readonly registry: Record<string, config> = {};

  private constructor() {}

  public static getInstance(): NodeConfigRegistry {
    if (!NodeConfigRegistry.instance) {
      NodeConfigRegistry.instance = new NodeConfigRegistry();
    }
    return NodeConfigRegistry.instance;
  }

  public registerNodeConfig(name: string, node: config): void {
    this.registry[name] = node;
  }

  public getAllNodeConfigs(): Record<string, config> {
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

  public removeNodeConfig(name: string): void {
    const path = name.split('.');
    let config = this.registry[path[0]];
    if (!config) return;
    if (path.length === 1) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.registry[name];
      return;
    }
    for (const p of path.slice(1, -1)) {
      config = config.nodes[p];
    }
    const key = path[path.length - 1];
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete config.nodes[key];
  }

  public enableNodeConfig(name: string): void {
    if (!this.registry[name]) return;
    this.registry[name].enable = true;
    console.log(this.registry);
  }

  public disableNodeConfig(name: string): void {
    if (!this.registry[name]) return;
    this.registry[name].enable = false;
    console.log(this.registry);
  }
}

export const nodeConfigRegistry = NodeConfigRegistry.getInstance();
