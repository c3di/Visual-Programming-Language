import { type IConvertCodeConfig } from './types';

type HeuristicFunction = (node: Node, goal: Node) => number;

export class Node {
  dataType: string;
  intraConvertCode: IConvertCodeConfig;

  constructor(dataType: string, intraConvertCode: IConvertCodeConfig) {
    this.dataType = dataType;
    this.intraConvertCode = intraConvertCode;
  }
}

export class Edge {
  from: Node;
  to: Node;
  interConvertCode: IConvertCodeConfig;
  weight: number;

  constructor(
    from: Node,
    to: Node,
    interConvertCode: IConvertCodeConfig,
    weight: number
  ) {
    this.from = from;
    this.to = to;
    this.interConvertCode = interConvertCode;
    this.weight = weight;
  }
}

export class ImageTypeConversionGraph {
  adjacencyList: Map<Node, Edge[]>;

  constructor() {
    this.adjacencyList = new Map();
  }

  addNode(node: Node): void {
    const existingNode = this.getNode(node.dataType);
    if (existingNode) {
      console.warn(
        `Node ${node.dataType} already exists in graph, will be replaced.`
      );
      this.adjacencyList.delete(existingNode);
    }
    this.adjacencyList.set(node, []);
  }

  addDirectedEdge(
    from: Node,
    to: Node,
    interConvertCode: IConvertCodeConfig,
    weight: number
  ): void {
    const edge = new Edge(from, to, interConvertCode, weight);
    if (this.adjacencyList.has(from)) {
      this.adjacencyList.get(from)!.push(edge);
    } else {
      this.adjacencyList.set(from, [edge]);
    }
  }

  getNode(dataType: string): Node | undefined {
    return Array.from(this.adjacencyList.keys()).find(
      (node) => node.dataType === dataType
    );
  }

  shortestPath(startDataType: string, goalDataType: string): Node[] {
    const startNode = this.getNode(startDataType);
    if (!startNode) {
      throw new Error(`${startDataType} data type not found in graph`);
    }
    const goalNode = this.getNode(goalDataType);
    if (!goalNode) {
      throw new Error(`${goalDataType} data type not found in graph`);
    }
    return this.aStar(startNode, goalNode, () => 0);
  }

  aStar(start: Node, goal: Node, heuristicFunc: HeuristicFunction): Node[] {
    const openSet = new Set<Node>();
    openSet.add(start);

    const cameFrom = new Map<Node, Node>();

    const gScore = new Map<Node, number>();
    this.adjacencyList.forEach((_, node) => gScore.set(node, Infinity));
    gScore.set(start, 0);

    const fScore = new Map<Node, number>();
    this.adjacencyList.forEach((_, node) => fScore.set(node, Infinity));
    fScore.set(start, heuristicFunc(start, goal));

    while (openSet.size > 0) {
      const current = Array.from(openSet).reduce((a, b) => {
        const aScore = fScore.get(a) ?? Infinity;
        const bScore = fScore.get(b) ?? Infinity;
        return aScore < bScore ? a : b;
      });

      if (!current) {
        break;
      }

      if (current === goal) {
        return this.reconstructPath(cameFrom, current);
      }

      openSet.delete(current);
      for (const edge of this.adjacencyList.get(current) ?? []) {
        const neighbor = edge.to;
        const tentativeGScore = (gScore.get(current) ?? 0) + edge.weight; // Corrected this line

        if (tentativeGScore < (gScore.get(neighbor) ?? Infinity)) {
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentativeGScore);
          fScore.set(neighbor, tentativeGScore + heuristicFunc(neighbor, goal));
          if (!openSet.has(neighbor)) {
            openSet.add(neighbor);
          }
        }
      }
    }

    return [];
  }

  private reconstructPath(cameFrom: Map<Node, Node>, current: Node): Node[] {
    const totalPath = [current];
    while (true) {
      const next = cameFrom.get(current);
      if (!next) {
        break;
      }
      totalPath.unshift(next);
      current = next;
    }
    return totalPath;
  }
}
