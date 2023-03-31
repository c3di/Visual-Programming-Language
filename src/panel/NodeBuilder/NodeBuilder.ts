import {
  type GraphData,
  type Node,
  type GraphNodeConfig,
  type Graph,
} from '../types';

export class NodeBuilder {
  private static instance: NodeBuilder;
  private constructor() {}
  public static getInstance(): NodeBuilder {
    if (!NodeBuilder.instance) {
      NodeBuilder.instance = new NodeBuilder();
    }
    return NodeBuilder.instance;
  }

  private readonly nodeBuilders: Record<
    string,
    (options: GraphNodeConfig) => Node
  > = {
    function: (options: GraphNodeConfig): Node => {
      const { id, title, inputs, outputs, tooltip, position } = options;
      if (!id) throw new Error('No id provided for function node');
      return {
        id,
        type: 'function',
        position: position || { x: 0, y: 0 },
        data: {
          title,
          tooltip,
          inputs,
          outputs,
        },
      };
    },
    constant: (options: GraphNodeConfig): Node => {
      const { id, title, outputs, tooltip, position } = options;
      if (!id) throw new Error('No id provided for constant node');
      return {
        id,
        type: 'getter',
        position: position || { x: 0, y: 0 },
        data: {
          title,
          tooltip,
          outputs,
        },
      };
    },
    setter: (options: GraphNodeConfig): Node => {
      const { id, title, inputs, tooltip, position } = options;
      if (!id) throw new Error('No id provided for getter node');
      return {
        id,
        type: 'setter',
        position: position || { x: 0, y: 0 },
        data: {
          title,
          tooltip,
          inputs,
          outputs: inputs,
        },
      };
    },
  };

  public build(graphData: GraphData): Graph {
    const nodesConfig = graphData.nodeConfigs;
    const nodes = nodesConfig.map((config) => this.buildNode(config));
    return {
      nodes: nodes.filter((node) => node !== undefined) as Node[],
      edges: graphData.edgeConfigs,
    };
  }

  private buildNode(config: GraphNodeConfig): Node | undefined {
    const builder = this.nodeBuilders[config.category];
    if (builder) return builder(config);
    else {
      console.warn(`No build rules for category ${config.category}`);
    }
  }
}

export const nodeBuilder = NodeBuilder.getInstance();
