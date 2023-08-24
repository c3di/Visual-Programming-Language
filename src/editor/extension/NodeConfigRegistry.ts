import { type NodePackage, type NodeConfig } from '../types';

export type config = NodeConfig | NodePackage;
export interface TypeConversionRule {
  function_definition: string;
  function_name: string;
}

export class NodeConfigRegistry {
  private static instance: NodeConfigRegistry;
  private readonly registry: Record<string, config> = {};
  private readonly _imageTypeConversion: Record<
    string,
    Record<string, TypeConversionRule>
  > = {};

  private constructor() {}

  get imageTypeConversion(): Record<
    string,
    Record<string, TypeConversionRule>
  > {
    return this._imageTypeConversion;
  }

  public registerImageTypeConversion(
    name: string,
    conversion: Record<string, TypeConversionRule>
  ): void {
    if (!this._imageTypeConversion[name])
      this._imageTypeConversion[name] = conversion;
    else {
      for (const key in conversion) {
        this._imageTypeConversion[name][key] = conversion[key];
      }
    }
  }

  public getConversionRule(
    source: string,
    target: string
  ): TypeConversionRule | null {
    return this._imageTypeConversion[source]?.[target];
  }

  public bfsShortestPath(
    graph: Record<string, Record<string, TypeConversionRule>>,
    start: string,
    goal: string
  ): string[] | null {
    const explored = new Set<string>();
    const queue: string[][] = [[start]];

    if (start === goal) {
      return [start];
    }

    while (queue.length > 0) {
      const path = queue.shift()!;
      const node = path[path.length - 1];

      if (!explored.has(node)) {
        const neighbors = Object.keys(graph[node]);

        for (const neighbor of neighbors) {
          const newPath = [...path, neighbor];
          queue.push(newPath);

          if (neighbor === goal) {
            return newPath;
          }
        }

        explored.add(node);
      }
    }

    return null;
  }

  public findConversionPath(from: string, to: string): string[] | null {
    return this.bfsShortestPath(this._imageTypeConversion, from, to);
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
