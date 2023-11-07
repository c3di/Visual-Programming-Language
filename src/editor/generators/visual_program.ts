import { type Edge, type Node } from './../types';

/**
 * A visual program is made up of several functions. Each functions either
 * start from the `Main Node` or `Function Node` and each function is an directional acyclic graph of nodes and edges.
 * The function defined can be called by other functions via `Function Call` node.
 *
 */
export class VisualProgram {
  private readonly _nodes: Node[];
  private readonly _edges: Edge[];

  constructor(nodes: Node[], edges: Edge[]) {
    this._nodes = nodes;
    this._edges = edges;
  }

  get nodes(): Node[] {
    return this._nodes;
  }

  get edges(): Edge[] {
    return this._edges;
  }

  getNodeById(id: string): Node | undefined {
    return this.nodes.find((n) => n.id === id);
  }

  getStartNode(): Node | undefined {
    return this.nodes.find((n) => n.data.configType.includes('Main'));
  }

  getFuncDefNodes(): Node[] {
    const nodes = this.nodes.filter((n) =>
      n.data.configType.includes('Function')
    );
    const main = this.getStartNode();
    if (main) {
      nodes.push(main);
    }
    return nodes;
  }

  getFuncDefNodeIdByFuncCallNode(node: Node): string {
    return node.data.nodeRef;
  }

  funcCallsInFunc(funcDef: Node): Node[] {
    const funcCalls: Node[] = [];
    this._funcCallsInFunc(funcDef, funcCalls);
    return funcCalls;
  }

  getOutgoingNodes(nodeId: string, handleId: string): Node[] {
    const outgoingEdges = this.edges.filter(
      (e) => e.source === nodeId && e.sourceHandle === handleId
    );
    return outgoingEdges.map((e) => this.getNodeById(e.target)!);
  }

  getOutgoingNodesByHandleType(nodeId: string, handleType: string): Node[] {
    const outputs = this.getNodeById(nodeId)?.data.output ?? {};
    const handldIdsByType = Object.keys(outputs).filter(
      (key) => outputs[key].dataType === handleType
    );
    const outgoingEdges = this.edges.filter(
      (e) => e.source === nodeId && handldIdsByType.includes(e.sourceHandle!)
    );
    return outgoingEdges.map((e) => this.getNodeById(e.target)!);
  }

  getIncomingNodes(nodeId: string, handleId: string): Node[] {
    const incomingEdges = this.edges.filter(
      (e) => e.target === nodeId && e.targetHandle === handleId
    );
    return incomingEdges.map((e) => this.getNodeById(e.source)!);
  }

  getSourceHandleConnectedToTargetHandle(
    source: string,
    target: string,
    targetHandle: string
  ): string | undefined | null {
    const edges = this.edges.filter(
      (e) => e.source === source && e.target === target
    );
    for (const edge of edges) {
      if (edge.targetHandle === targetHandle) return edge.sourceHandle;
    }
    return undefined;
  }

  isConnected(nodeId: string, type: string, handleId: string): boolean {
    if (type === 'input') {
      return this.getIncomingNodes(nodeId, handleId).length > 0;
    } else if (type === 'output') {
      return this.getOutgoingNodes(nodeId, handleId).length > 0;
    } else {
      return (
        this.getIncomingNodes(nodeId, handleId).length > 0 ||
        this.getOutgoingNodes(nodeId, handleId).length > 0
      );
    }
  }

  isAcyclic(startNodeId: string): boolean {
    const visited = new Map<string, boolean>();
    const recStack = new Map<string, boolean>();
    return !this._isCyclicUtil(startNodeId, visited, recStack);
  }

  private _isCyclicUtil(
    nodeId: string,
    visited: Map<string, boolean>,
    recStack: Map<string, boolean>
  ): boolean {
    if (!visited.get(nodeId)) {
      visited.set(nodeId, true);
      recStack.set(nodeId, true);

      const outgoingExecNodes = this.getOutgoingNodesByHandleType(
        nodeId,
        'exec'
      );
      for (const node of outgoingExecNodes) {
        if (this._isCyclicUtil(node.id, visited, recStack)) {
          return true;
        } else if (recStack.get(node.id)) {
          return true;
        }
      }
    }
    recStack.set(nodeId, false);
    return false;
  }

  private readonly _funcCallsInFunc = (
    startNode: Node,
    functionCallNodes: Node[],
    visitedNodeIds: string[] = []
  ): void => {
    if (visitedNodeIds.includes(startNode.id)) return;
    visitedNodeIds.push(startNode.id);
    Object.entries(startNode.data.outputs ?? {}).forEach(([name, output]) => {
      if ((output as any).dataType === 'exec') {
        this.getOutgoingNodes(startNode.id, name).forEach((node) => {
          if (node.type === 'functionCall') {
            functionCallNodes.push(node);
          }
          this._funcCallsInFunc(node, functionCallNodes, visitedNodeIds);
        });
      }
    });
  };
}
