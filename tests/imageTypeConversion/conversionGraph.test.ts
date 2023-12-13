import {
  ImageTypeConversionGraph,
  Node,
} from '../../src/editor/ImageTypeConversion';
import { getConversionGraphTestData } from '../data/conversionGraphTestData';

describe('TypeConversionGraph', () => {
  let graph: ImageTypeConversionGraph;

  beforeEach(() => {
    graph = getConversionGraphTestData();
  });

  test('addNode should correctly add a new node to the graph', () => {
    const newNode = new Node('newDataType', {
      functionName: 'newFunctionName',
      function: 'function body here',
    });
    graph.addNode(newNode);
    const retrievedNode = graph.getNode('newDataType');

    expect(retrievedNode).toBeDefined();
    expect(retrievedNode!).toBe(newNode);
  });

  test('addNode should replace an existing node', () => {
    const node = graph.adjacencyList.keys().next().value;
    const existingNode = new Node(node.dataType, {
      functionName: 'existingFunctionName',
      function: 'existing function body',
    });
    graph.addNode(existingNode);
    expect(graph.getNode(node.dataType)).toBeDefined();
    expect(graph.getNode(node.dataType)!).toBe(existingNode);
    expect(graph.adjacencyList.get(existingNode)).toStrictEqual([]);
  });

  test('addDirectedEdge should correctly add a new edge to the graph', () => {
    const fromNode = new Node('fromDataType', {
      functionName: 'numpy_to_numpy',
      function: `def numpy_to_numpy(image, metalist):
# Convert numpy.ndarray to numpy.ndarray
return image`,
    });
    const toNode = new Node('toDataType', {
      functionName: 'torch_to_torch',
      function: `def torch_to_torch(image, target_metadata_list):
# Convert torch_tensor to torch_tensor
return image`,
    });

    graph.addNode(fromNode);
    graph.addNode(toNode);

    const expectedInterConvertCode = {
      functionName: 'from_to_to',
      function: `def from_to_to(image):
# Convert from to to
return image`,
    };

    graph.addDirectedEdge(fromNode, toNode, expectedInterConvertCode, 5);
    const edgesFromNode = graph.adjacencyList.get(fromNode);

    expect(edgesFromNode).toBeDefined();
    expect(edgesFromNode).toHaveLength(1);
    expect(edgesFromNode![0].to).toBe(toNode);
    expect(edgesFromNode![0].interConvertCode).toBe(expectedInterConvertCode);
    expect(edgesFromNode![0].interConvertCode.function).toBe(
      `def from_to_to(image):
# Convert from to to
return image`
    );
    expect(edgesFromNode![0].weight).toBe(5);
  });

  test('addDirectedEdge should correctly add a new edge to the graph', () => {
    const toNode = new Node('toDataType', {
      functionName: 'torch_to_torch',
      function: `def torch_to_torch(image, target_metadata_list):
# Convert torch_tensor to torch_tensor
return image`,
    });

    graph.addNode(toNode);

    const expectedInterConvertCode = {
      functionName: 'from_to_to',
      function: `def from_to_to(image):
# Convert from to to
return image`,
    };
    const node = graph.adjacencyList.keys().next().value;
    const edgeCount = graph.adjacencyList.get(node)?.length;
    graph.addDirectedEdge(node, toNode, expectedInterConvertCode, 1);
    const edgesFromNode = graph.adjacencyList.get(node);

    expect(edgesFromNode).toBeDefined();
    expect(edgesFromNode).toHaveLength(edgeCount! + 1);
    expect(edgesFromNode![edgeCount!].to).toBe(toNode);
    expect(edgesFromNode![edgeCount!].interConvertCode).toBe(
      expectedInterConvertCode
    );
    expect(edgesFromNode![edgeCount!].interConvertCode.function).toBe(
      `def from_to_to(image):
# Convert from to to
return image`
    );
    expect(edgesFromNode![1].weight).toBe(1);
  });

  test('shortestPath should return the correct path', () => {
    const path = graph.shortestPath('dataType1', 'dataType5');
    expect(path.map((p) => p.dataType)).toStrictEqual([
      'dataType1',
      'dataType2',
      'dataType5',
    ]);
  });

  test('shortestPath should return the correct path', () => {
    const path = graph.shortestPath('dataType5', 'dataType7');
    expect(path.map((p) => p.dataType)).toStrictEqual([
      'dataType5',
      'dataType2',
      'dataType6',
      'dataType7',
    ]);
  });

  test('shortestPath should return the path only include this node for convert same data type', () => {
    const path = graph.shortestPath('dataType6', 'dataType6');
    expect(path.map((p) => p.dataType)).toStrictEqual(['dataType6']);
  });

  test('shortestPath should return the empty path if no path found', () => {
    const path = graph.shortestPath('dataType5', 'dataType8');
    expect(path.length).toBe(0);
  });
});
