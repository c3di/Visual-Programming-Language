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

  private readonly defaultBuilder = (config: GraphNodeConfig): Node => {
    const { id, title, inputs, outputs, tooltip, position, dataType } = config;
    const type = config.category;
    return {
      id,
      type,
      position: position || { x: 0, y: 0 },
      data: {
        title,
        dataType,
        tooltip,
        inputs,
        outputs,
      },
    };
  };

  private readonly overrideBuilders: Record<
    string,
    (config: GraphNodeConfig) => Node
  > = {
    setter: (config: GraphNodeConfig): Node => {
      config.outputs = config.inputs;
      return this.defaultBuilder(config);
    },
    literal: (config: GraphNodeConfig): Node => {
      config.outputs = config.inputs;
      return this.defaultBuilder(config);
    },
    comment: (config: GraphNodeConfig): Node => {
      const { id, category, comment, tooltip, position, width, height } =
        config;
      return {
        id,
        type: category,
        dragHandle: '.node__header',
        zIndex: -1001,
        data: {
          comment,
          tooltip,
          width,
          height,
        },
        position,
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
    const builder =
      this.overrideBuilders[config.category] ?? this.defaultBuilder;
    return builder(config);
  }
}

export const nodeBuilder = NodeBuilder.getInstance();
