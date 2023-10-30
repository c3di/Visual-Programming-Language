import { type Edge, type Node } from './../types';

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

  getNodeById(id: string): Node | undefined {
    return this.nodes.find((n) => n.id === id);
  }

  getStartNode(): Node | undefined {
    return this.nodes.find((n) => n.data.configType.includes('Start'));
  }

  getFuncDefNodes(): Node[] {
    return this.nodes.filter((n) => n.data.configType.includes('Function'));
  }
}
