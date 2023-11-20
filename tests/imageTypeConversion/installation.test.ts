import { nodeConfigRegistry } from '../../src/editor/extension/NodeConfigRegistry';
import {
  Edge,
  imageTypeConversionGraph,
  Node,
} from '../../src/editor/ImageTypeConversion';
import { readJsonFileSync } from '../loader';

describe('Knowledge Graph Extension', () => {
  test('addKnowledgeGraphExtension should correctly add a new node and edges to the graph', () => {
    const module = readJsonFileSync(
      './src/NodeTypeExtension/image_conversion.json'
    );
    nodeConfigRegistry.addKnowledgeGraphExtension(module.imageTypeConversion);

    expect(imageTypeConversionGraph.getNode('numpy.ndarray')).toStrictEqual(
      new Node('numpy.ndarray', {
        functionName: 'numpyndarray2numpyndarray',
        function:
          "function numpyndarray2numpyndarray() { return 'numpyndarray2numpyndarray'; }",
      })
    );
    expect(imageTypeConversionGraph.getNode('torch.tensor')).toStrictEqual(
      new Node('torch.tensor', {
        functionName: 'torchtensor2torchtensor',
        function:
          "function torchtensor2torchtensor() { return 'torchtensor2torchtensor'; }",
      })
    );

    const numpyNode = imageTypeConversionGraph.getNode('numpy.ndarray')!;
    const tensorNode = imageTypeConversionGraph.getNode('torch.tensor')!;

    const edgesOfNumpy = imageTypeConversionGraph.adjacencyList.get(numpyNode);
    expect(edgesOfNumpy).toStrictEqual([
      new Edge(
        numpyNode,
        tensorNode,
        {
          functionName: 'numpyndarrayToTorchtensor',
          function:
            "function numpyndarrayToTorchtensor() { return 'numpyndarrayToTorchtensor'; }",
        },
        1
      ),
    ]);
    const edgesOfTensor =
      imageTypeConversionGraph.adjacencyList.get(tensorNode);
    expect(edgesOfTensor).toStrictEqual([
      new Edge(
        tensorNode,
        numpyNode,
        {
          functionName: 'torchtensorToNumpyndarray',
          function:
            "function torchtensorToNumpyndarray() { return 'torchtensorToNumpyndarray'; }",
        },
        1
      ),
    ]);
  });
});
