import {
  ImageTypeConversionGraph,
  Node,
} from '../../src/editor/ImageTypeConversion';

export function getConversionGraphTestData(): ImageTypeConversionGraph {
  const graph = new ImageTypeConversionGraph();
  const node1 = new Node('dataType1', {
    functionName: 'convert1_to_1',
    function: `def convert1_to_1(image, metalist):
  # Convert numpy.ndarray to numpy.ndarray
  return image`,
  });

  const node2 = new Node('dataType2', {
    functionName: 'convert2_to_2',
    function: `def convert2_to_2(image, target_metadata_list):
  # Convert torch_tensor to torch_tensor
  return image`,
  });
  const node3 = new Node('dataType3', {
    functionName: 'convert3_to_3',
    function: `def convert3_to_3(image, metalist):
  # Convert dataType3 to dataType3
  return image`,
  });

  const node4 = new Node('dataType4', {
    functionName: 'convert4_to_4',
    function: `def convert4_to_4(image, metalist):
  # Convert dataType4 to dataType4
  return image`,
  });

  const node5 = new Node('dataType5', {
    functionName: 'convert5_to_5',
    function: `def convert5_to_5(image, metalist):
  # Convert dataType5 to dataType5
  return image`,
  });

  const node6 = new Node('dataType6', {
    functionName: 'convert6_to_6',
    function: `def convert6_to_6(image, metalist):
  # Convert dataType6 to dataType6
  return image`,
  });
  const node7 = new Node('dataType7', {
    functionName: 'convert7_to_7',
    function: `def convert7_to_7(image, metalist):
  # Convert dataType7 to dataType7
  return image`,
  });
  const node8 = new Node('dataType8', {
    functionName: 'convert8_to_8',
    function: `def convert8_to_8(image, metalist):
  # Convert dataType8 to dataType8
  return image`,
  });
  graph.addNode(node1);
  graph.addNode(node2);
  graph.addNode(node3);
  graph.addNode(node4);
  graph.addNode(node5);
  graph.addNode(node6);
  graph.addNode(node7);
  graph.addNode(node8);

  graph.addDirectedEdge(
    node1,
    node2,
    {
      functionName: '1_to_2',
      function: `def 1_to_2(image):
  # Convert numpy_ndarray to torch_tensor
  return image`,
    },
    1
  );
  graph.addDirectedEdge(
    node1,
    node3,
    {
      functionName: '1_to_3',
      function: `def 1_to_3(image):
  # Convert numpy.ndarray to dataType3
  return image`,
    },
    1
  );
  graph.addDirectedEdge(
    node3,
    node4,
    {
      functionName: '3_to_4',
      function: `def 3_to_4(image):
  # Convert dataType3 to dataType4
  return image`,
    },
    1
  );
  graph.addDirectedEdge(
    node4,
    node5,
    {
      functionName: '4_to_5',
      function: `def 4_to_5(image):
  # Convert dataType4 to dataType5
  return image`,
    },
    1
  );
  graph.addDirectedEdge(
    node2,
    node6,
    {
      functionName: '2_to_6',
      function: `def 2_to_6(image):
  # Convert torch.tensor to dataType6
  return image`,
    },
    1
  );
  graph.addDirectedEdge(
    node2,
    node5,
    {
      functionName: '2_to_5',
      function: `def 2_to_5(image):
  # Convert torch.tensor to dataType5
  return image`,
    },
    1
  );
  graph.addDirectedEdge(
    node6,
    node7,
    {
      functionName: '6_to_7',
      function: `def 6_to_7(image):
  # Convert 6 to 7
  return image`,
    },
    1
  );
  graph.addDirectedEdge(
    node4,
    node6,
    {
      functionName: '4_to_6',
      function: `def 4_to_6(image):
  # Convert 4 to 6
  return image`,
    },
    1
  );
  graph.addDirectedEdge(
    node7,
    node5,
    {
      functionName: '7_to_5',
      function: `def 7_to_5(image):
  # Convert 7 to 5
  return image`,
    },
    1
  );
  graph.addDirectedEdge(
    node2,
    node1,
    {
      functionName: '2_to_1',
      function: `def 2_to_1(image):
  # Convert torch.tensor to numpy.ndarray
  return image`,
    },
    1
  );
  graph.addDirectedEdge(
    node3,
    node1,
    {
      functionName: '3_to_1',
      function: `def 3_to_1(image):
  # Convert dataType3 to numpy.ndarray
  return image`,
    },
    1
  );
  graph.addDirectedEdge(
    node4,
    node3,
    {
      functionName: '4_to_3',
      function: `def 4_to_3(image):
  # Convert 4 to 3
  return image`,
    },
    1
  );
  graph.addDirectedEdge(
    node5,
    node4,
    {
      functionName: '5_to_4',
      function: `def 5_to_4(image):
  # Convert dataType5 to dataType4
  return image`,
    },
    1
  );
  graph.addDirectedEdge(
    node6,
    node2,
    {
      functionName: '6_to_2',
      function: `def 6_to_2(image):
  # Convert dataType6 to torch.tensor
  return image`,
    },
    1
  );
  graph.addDirectedEdge(
    node5,
    node2,
    {
      functionName: '5_to_2',
      function: `def 5_to_2(image):
  # Convert dataType5 to torch.tensor
  return image`,
    },
    1
  );
  graph.addDirectedEdge(
    node7,
    node6,
    {
      functionName: '7_to_6',
      function: `def 7_to_6(image):
  # Convert 7 to 6
  return image`,
    },
    1
  );

  graph.addDirectedEdge(
    node6,
    node4,
    {
      functionName: '6_to_4',
      function: `def 6_to_4(image):
  # Convert 6 to 4
  return image`,
    },
    1
  );
  graph.addDirectedEdge(
    node8,
    node6,
    {
      functionName: '8_to_6',
      function: `def 8_to_6(image):
  # Convert 8 to 6
  return image`,
    },
    1
  );
  return graph;
}
