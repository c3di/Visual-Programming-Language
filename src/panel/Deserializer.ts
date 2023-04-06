/**
 * SerializedGraph(nodes: SerializedGraphNode[] + edges: SerializedGraphEdge[])
 * ---> GraphConfig (GraphNodeConfig + GraphEdgeConfig)
 * ---> Graph (nodes: Node[] + edges: Edge[])
 */
import type {
  SerializedGraphNode,
  SerializedGraph,
  GraphEdgeConfig,
  GraphNodeConfig,
  Edge,
  Node,
  Graph,
  HandleData,
} from './types';
import { MarkerType } from 'reactflow';
import { nodeConfigRegistry } from '../Extension';

export class Deserializer {
  private static instance: Deserializer;
  private constructor() {}
  public static getInstance(): Deserializer {
    if (!Deserializer.instance) {
      Deserializer.instance = new Deserializer();
    }
    return Deserializer.instance;
  }

  public readonly serializedToGraphNodeConfig = (
    sNode: SerializedGraphNode
  ): GraphNodeConfig => {
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
      inputs,
      outputs,
    };
  };

  private readonly serializedToGraphNodeConfigs = (
    serializedNodes: SerializedGraphNode[]
  ): GraphNodeConfig[] => {
    return serializedNodes.map((sNode) => {
      return this.serializedToGraphNodeConfig(sNode);
    });
  };

  private readonly overrideConfigToNode: Record<
    string,
    (config: GraphNodeConfig) => Node
  > = {
    setter: (config: GraphNodeConfig): Node => {
      config.outputs = config.inputs;
      return this.defaultConfigToNode(config);
    },
    literal: (config: GraphNodeConfig): Node => {
      config.outputs = config.inputs;
      return this.defaultConfigToNode(config);
    },
    comment: (config: GraphNodeConfig): Node => {
      const { id, category, comment, tooltip, position, width, height, type } =
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
          configType: type,
        },
        position,
      };
    },
  };

  private readonly defaultConfigToNode = (config: GraphNodeConfig): Node => {
    const { id, title, inputs, outputs, tooltip, position, dataType, type } =
      config;
    return {
      id,
      type: config.category,
      position: position || { x: 0, y: 0 },
      data: {
        title,
        dataType,
        tooltip,
        inputs,
        outputs,
        configType: type,
      },
    };
  };

  private readonly defaultConfigToEdge = (config: GraphEdgeConfig): Edge => {
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

  public deserialize(sGraph: SerializedGraph | undefined): Graph {
    if (!sGraph) return { nodes: [], edges: [] };
    const graphNodeConfigs = this.serializedToGraphNodeConfigs(sGraph.nodes);
    return {
      nodes: graphNodeConfigs.map((config) => this.configToNode(config)),
      edges: sGraph.edges.map((config) => this.configToEdge(config)),
    };
  }

  public configToNode(config: GraphNodeConfig): Node {
    const mapper =
      this.overrideConfigToNode[config.category] ?? this.defaultConfigToNode;
    return mapper(config);
  }

  private configToEdge(config: GraphEdgeConfig): Edge {
    return this.defaultConfigToEdge(config);
  }
}

export const deserializer = Deserializer.getInstance();
