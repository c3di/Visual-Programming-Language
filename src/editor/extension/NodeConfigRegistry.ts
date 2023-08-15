import { type NodePackage, type NodeConfig } from '../types';

export type config = NodeConfig | NodePackage;

export class NodeConfigRegistry {
  private static instance: NodeConfigRegistry;
  private readonly registry: Record<string, config> = {};
  private readonly _imageTypeConversion: Record<
    string,
    Record<string, string>
  > = {};

  private constructor() {}

  get imageTypeConversion(): Record<string, Record<string, string>> {
    return this._imageTypeConversion;
  }

  public registerImageTypeConversion(
    name: string,
    conversion: Record<string, string>
  ): void {
    if (!this._imageTypeConversion[name])
      this._imageTypeConversion[name] = conversion;
    else {
      for (const key in conversion) {
        this._imageTypeConversion[name][key] = conversion[key];
      }
    }
  }

  public findConversionPath(from: string, to: string): string[] {
    if (!this._imageTypeConversion[from]) return [];
    const path: string[] = [];
    const visited: Record<string, boolean> = {};
    const queue: string[] = [from];
    while (queue.length > 0) {
      const node = queue.shift();
      if (!node) continue;
      if (node === to) return path;
      if (visited[node]) continue;
      visited[node] = true;
      path.push(node);
      const next = this._imageTypeConversion[node];
      if (!next) continue;
      for (const key in next) {
        if (key in visited) continue;
        queue.push(key);
      }
    }
    return path;
  }

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

  public enableNodeConfig(name: string, enable: boolean): void {
    if (!this.registry[name]) return;
    this.registry[name].enable = enable;
  }
}

export const nodeConfigRegistry = NodeConfigRegistry.getInstance();
