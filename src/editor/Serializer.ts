/**
 * Graph (nodes: Node[] + edges: Edge[])
 * ---> SerializedGraph(nodes: SerializedGraphNode[] + edges: SerializedGraphEdge[])
 */
import type {
  SerializedHandle,
  SerializedGraphNode,
  SerializedGraph,
  GraphEdgeConfig,
  HandleData,
  Edge,
  Node,
  Graph,
} from './types';

export class Serializer {
  private static instance: Serializer;
  private constructor() {}
  public static getInstance(): Serializer {
    if (!Serializer.instance) {
      Serializer.instance = new Serializer();
    }
    return Serializer.instance;
  }

  private readonly overrideNodeSerialize: Record<
    string,
    (node: Node) => SerializedGraphNode
  > = {
    math: (node: Node): SerializedGraphNode => {
      return this.defaultNodeSerialize(node, true);
    },
    getter: (node: Node): SerializedGraphNode => {
      return this.defaultNodeSerialize(node, false);
    },
    setter: (node: Node): SerializedGraphNode => {
      node.data.outputs = undefined;
      return this.defaultNodeSerialize(node, false);
    },
    literal: (node: Node): SerializedGraphNode => {
      node.data.outputs = undefined;
      return this.defaultNodeSerialize(node, false);
    },
    comment: (node: Node): SerializedGraphNode => {
      const { id, position, type, data } = node;
      const { configType, comment, height, width } = data;
      if (!type) throw new Error('Invalid node config');
      return {
        id,
        type: configType,
        comment,
        position,
        width,
        height,
      };
    },
    createFunction: (node: Node): SerializedGraphNode => {
      return {
        ...this.defaultNodeSerialize(node),
        title: node.data.title,
      };
    },
    stickyNote: (node: Node): SerializedGraphNode => {
      const { id, position, type, data } = node;
      const { configType, stickyNote, height, width } = data;
      if (!type) throw new Error('Invalid node config');
      return {
        id,
        type: configType,
        stickyNote,
        position,
        width,
        height,
      };
    },
  };

  private readonly defaultNodeSerialize = (
    node: Node,
    isNotGeneraticHandle: boolean = true
  ): SerializedGraphNode => {
    const { id, type, position, data } = node;
    const { dataType, configType, nodeRef } = data;
    if (!id || !type || !position || !data)
      throw new Error('Invalid node config');
    const inputs: Record<string, SerializedHandle> = {};
    if (data.inputs) {
      Object.entries(data.inputs).forEach(([title, handle]) => {
        const data = handle as HandleData;
        inputs[title] = isNotGeneraticHandle
          ? {
              title: data.title,
              value: data.value,
              dataType: data.dataType,
            }
          : { value: data.value };
      });
    }
    const outputs: Record<string, SerializedHandle> = {};
    if (data.outputs) {
      Object.entries(data.outputs).forEach(([title, handle]) => {
        const data = handle as HandleData;
        outputs[title] = isNotGeneraticHandle
          ? {
              title: data.title,
              value: data.value,
              dataType: data.dataType,
            }
          : { value: data.value };
      });
    }

    return {
      id,
      type: configType,
      position,
      inputs: Object.keys(inputs).length > 0 ? inputs : undefined,
      outputs: Object.keys(outputs).length > 0 ? outputs : undefined,
      dataType,
      nodeRef,
    };
  };

  private readonly defaultEdgeToConfig = (edge: Edge): GraphEdgeConfig => {
    const { id, source, target, sourceHandle, targetHandle, data } = edge;
    if (!id || !source || !target || !sourceHandle || !targetHandle)
      throw new Error('Invalid edge config');
    return {
      id,
      output: source,
      input: target,
      outputHandle: sourceHandle,
      inputHandle: targetHandle,
      dataType: data?.dataType,
    };
  };

  public serialize(graph: Graph): SerializedGraph {
    if (!graph) return { nodes: [], edges: [] };
    return {
      nodes: graph.nodes.map((node) => this.serializeNode(node)),
      edges: graph.edges.map((config) => this.serializeEdge(config)),
    };
  }

  private serializeNode(node: Node): SerializedGraphNode {
    const mapper =
      node.type === undefined
        ? this.defaultNodeSerialize
        : this.overrideNodeSerialize[node.type] ?? this.defaultNodeSerialize;
    return mapper(node);
  }

  private serializeEdge(edge: Edge): GraphEdgeConfig {
    return this.defaultEdgeToConfig(edge);
  }
}

export const serializer = Serializer.getInstance();
