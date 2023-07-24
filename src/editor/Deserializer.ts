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
  SerializedGraphEdge,
} from './types';
// import { MarkerType } from 'reactflow';
import { nodeConfigRegistry } from './extension';
import { MarkerType } from 'reactflow';

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
    const inputs = Object.entries({
      ...sNode.inputs,
      ...nodeConfig.inputs,
    }).reduce<Record<string, HandleData>>((acc, [title, handle]) => {
      acc[title] = {
        ...handle,
        ...sNode.inputs?.[title],
      };
      return acc;
    }, {});
    const outputs = Object.entries({
      ...sNode.outputs,
      ...nodeConfig.outputs,
    }).reduce<Record<string, HandleData>>((acc, [title, handle]) => {
      acc[title] = {
        ...handle,
        ...sNode.outputs?.[title],
      };
      return acc;
    }, {});
    return {
      ...nodeConfig,
      ...sNode,
      title: sNode.title ?? nodeConfig.title,
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

  private readonly copyInputsToOutputs = (
    inputs: Record<string, HandleData> | undefined
  ): Record<string, HandleData> | undefined => {
    if (!inputs) return undefined;
    const outputs: Record<string, HandleData> = {};
    for (const key in inputs) {
      outputs[`${key}-out`] = { ...inputs[key] };
    }
    return outputs;
  };

  private readonly overrideConfigToNode: Record<
    string,
    (config: GraphNodeConfig) => Node
  > = {
    setter: (config: GraphNodeConfig): Node => {
      config.outputs = this.copyInputsToOutputs(config.inputs);
      return this.defaultConfigToNode(config);
    },
    literal: (config: GraphNodeConfig): Node => {
      config.outputs = this.copyInputsToOutputs(config.inputs);
      return this.defaultConfigToNode(config);
    },
    createFunction: (config: GraphNodeConfig): Node => {
      const node = this.defaultConfigToNode(config);
      node.data = { ...node.data, title: config.title };
      return node;
    },

    comment: (config: GraphNodeConfig): Node => {
      const {
        id,
        category,
        comment,
        tooltip,
        position,
        width,
        height,
        type,
        zIndex,
        defaultEditable,
      } = config;
      const w = width ?? 250;
      const h = height ?? 200;
      return {
        id,
        type: category,
        dragHandle: '.node__header--enabled',
        zIndex: zIndex ?? -1001,
        width: w,
        height: h,
        data: {
          comment,
          tooltip,
          width: w,
          height: h,
          configType: type,
          defaultEditable,
        },
        position,
      };
    },
    stickyNote: (config: GraphNodeConfig): Node => {
      const {
        id,
        category,
        stickyNote,
        tooltip,
        position,
        width,
        height,
        type,
        defaultEditable,
      } = config;
      return {
        id,
        type: category,
        dragHandle: '.stickyNote__node__body--enabled',
        zIndex: -1001,
        width,
        height,
        data: {
          stickyNote,
          tooltip,
          width,
          height,
          configType: type,
          defaultEditable,
        },
        position,
      };
    },
  };

  private readonly defaultConfigToNode = (config: GraphNodeConfig): Node => {
    const {
      id,
      title,
      inputs,
      outputs,
      tooltip,
      position,
      dataType,
      type,
      nodeRef,
    } = config;
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
        nodeRef,
        sourceCode: config.sourceCode,
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
      markerEnd:
        dataType === 'exec'
          ? {
              type: MarkerType.Arrow,
              width: 15,
              height: 15,
              color: getComputedStyle(document.body).getPropertyValue(
                '--vp-exec-color'
              ),
            }
          : undefined,
      data: {
        dataType,
      },
      className: dataType,
      style: {
        strokeWidth: 2,
      },
    };
  };

  private readonly updateConnectionProps = (
    nodes: Node[],
    edges: SerializedGraphEdge[]
  ): void => {
    edges.forEach((edge) => {
      const sourceNode = nodes.find((node) => node.id === edge.output)!;
      sourceNode.data.outputs![edge.outputHandle].connection =
        Number(sourceNode.data.outputs![edge.outputHandle].connection ?? 0) + 1;
      const targetNode = nodes.find((node) => node.id === edge.input)!;
      targetNode.data.inputs![edge.inputHandle].connection =
        Number(targetNode.data.inputs![edge.inputHandle].connection ?? 0) + 1;
    });
  };

  public deserialize(sGraph: SerializedGraph | undefined | null): Graph {
    if (!sGraph) return { nodes: [], edges: [] };
    const graphNodeConfigs = this.serializedToGraphNodeConfigs(sGraph.nodes);
    const nodes = graphNodeConfigs.map((config) => this.configToNode(config));
    this.updateConnectionProps(nodes, sGraph.edges);
    return {
      nodes,
      edges: sGraph.edges.map((config) => this.configToEdge(config)),
    };
  }

  public configToNode(config: GraphNodeConfig): Node {
    const mapper =
      this.overrideConfigToNode[config.category] ?? this.defaultConfigToNode;
    return mapper(config);
  }

  public configToEdge(config: GraphEdgeConfig): Edge {
    return this.defaultConfigToEdge(config);
  }
}

export const deserializer = Deserializer.getInstance();
