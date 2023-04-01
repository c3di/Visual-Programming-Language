import type {
  GraphData,
  Node,
  GraphNodeConfig,
  Graph,
  GraphEdgeConfig,
  Edge,
  HandleData,
  SerializedGraphNode,
} from '../types';
import { MarkerType } from 'reactflow';
import { nodeConfigRegistry } from './NodeConfigRegistry';

export class Builder {
  private static instance: Builder;
  private constructor() {}
  public static getInstance(): Builder {
    if (!Builder.instance) {
      Builder.instance = new Builder();
    }
    return Builder.instance;
  }

  private readonly defaultNodeBuilder = (config: GraphNodeConfig): Node => {
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

  private readonly defaultEdgeBuilder = (config: GraphEdgeConfig): Edge => {
    const { id, input, output, inputHandle, outputHandle, dataType } = config;
    return {
      id,
      source: output,
      target: input,
      sourceHandle: outputHandle,
      targetHandle: inputHandle,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      data: {
        dataType,
      },
    };
  };

  private readonly overrideNodeBuilders: Record<
    string,
    (config: GraphNodeConfig) => Node
  > = {
    setter: (config: GraphNodeConfig): Node => {
      config.outputs = config.inputs;
      return this.defaultNodeBuilder(config);
    },
    literal: (config: GraphNodeConfig): Node => {
      config.outputs = config.inputs;
      return this.defaultNodeBuilder(config);
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

  private readonly serializedToGraphNodeConfigs = (
    serializedNodes: SerializedGraphNode[]
  ): GraphNodeConfig[] => {
    return serializedNodes.map((sNode) => {
      const nodeConfig = nodeConfigRegistry.getNodeConfig(sNode.type);
      const inputs = Object.entries(sNode.inputs ?? {}).reduce<
        Record<string, HandleData>
      >((acc, [title, sHandle]) => {
        if (!nodeConfig.inputs?.[title]) return acc;
        acc[title] = {
          ...nodeConfig.inputs?.[title],
          ...sHandle,
          connection: sHandle.connection ?? 0,
        };
        return acc;
      }, {});
      const outputs = Object.entries(sNode.outputs ?? {}).reduce<
        Record<string, HandleData>
      >((acc, [title, sHandle]) => {
        if (!nodeConfig.outputs?.[title]) return acc;
        acc[title] = {
          ...nodeConfig.outputs?.[title],
          ...sHandle,
          connection: sHandle.connection ?? 0,
        };
        return acc;
      }, {});
      return {
        ...sNode,
        ...nodeConfig,
        id: sNode.id,
        position: sNode.position,
        inputs,
        outputs,
      };
    });
  };

  public build(graphData: GraphData): Graph {
    const graphNodeConfigs = this.serializedToGraphNodeConfigs(
      graphData.serializedNodes
    );
    return {
      nodes: graphNodeConfigs.map((config) => this.buildNode(config)),
      edges: graphData.edgeConfigs.map((config) => this.buildEdge(config)),
    };
  }

  private buildNode(config: GraphNodeConfig): Node {
    const builder =
      this.overrideNodeBuilders[config.category] ?? this.defaultNodeBuilder;
    return builder(config);
  }

  private buildEdge(config: GraphEdgeConfig): Edge {
    return this.defaultEdgeBuilder(config);
  }
}

export const builder = Builder.getInstance();
