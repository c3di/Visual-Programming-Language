import { nodeExecCheck } from '../execution';
import { loadNode } from '../loader';

type MetadataNotImage = {
  device: string;
};

interface testNodeData {
  jsonPath: string;
  nodeName: string;
  prepareInput: string;
  metadataNotImage: MetadataNotImage;
  inputs: string[];
  returnVar: string;
  execTest: (inputs: any[], returnVar: any) => string;
  getExpectedCode: (
    inputs: any[],
    prepareInput: string,
    returnVar: any,
    execTest: (arg0: any, arg1: any) => any
  ) => string;
}

describe('Code Execution of Edge_and_Lines.json functions with Input Grayscale only', () => {
  const jsonPath = 'src/NodeTypeExtension/sciKitImage/Edge_and_Lines.json';
  const metadataNotImage = {
    'device': 'cpu'
  };


  const testData: testNodeData[] = [
    {
      jsonPath,
      nodeName: 'Approximate_polygon',
      prepareInput: `import numpy as np
hand = np.array([[1.64516129, 1.16145833],
                 [1.64516129, 1.59375],
                 [1.35080645, 1.921875],
                 [1.375, 2.18229167],
                 [1.68548387, 1.9375],
                 [1.60887097, 2.55208333],
                 [1.68548387, 2.69791667],
                 [1.76209677, 2.56770833],
                 [1.83064516, 1.97395833],
                 [1.89516129, 2.75],
                 [1.9516129, 2.84895833],
                 [2.01209677, 2.76041667],
                 [1.99193548, 1.99479167],
                 [2.11290323, 2.63020833],
                 [2.2016129, 2.734375],
                 [2.25403226, 2.60416667],
                 [2.14919355, 1.953125],
                 [2.30645161, 2.36979167],
                 [2.39112903, 2.36979167],
                 [2.41532258, 2.1875],
                 [2.1733871, 1.703125],
                 [2.07782258, 1.16666667]])`,
      metadataNotImage,
      inputs: ['', 'hand', '0.02'],
      returnVar: 'approximate_polygon_output',
      execTest: (inputs, returnVar) => `from skimage.measure import approximate_polygon
import numpy as np
expected = approximate_polygon(${inputs[1]}, ${inputs[2]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs, prepareInput, returnVar, execTest) => `from skimage.measure import approximate_polygon
${prepareInput}
${returnVar} = approximate_polygon(${inputs[1]}, ${inputs[2]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  'metadata': {
    'device': '${metadataNotImage.device}'
  }
}
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Subdivide_polygon',
      prepareInput: `import numpy as np
hand = np.array([[1.64516129, 1.16145833],
                 [1.64516129, 1.59375],
                 [1.35080645, 1.921875],
                 [1.375, 2.18229167],
                 [1.68548387, 1.9375],
                 [1.60887097, 2.55208333],
                 [1.68548387, 2.69791667],
                 [1.76209677, 2.56770833],
                 [1.83064516, 1.97395833],
                 [1.89516129, 2.75],
                 [1.9516129, 2.84895833],
                 [2.01209677, 2.76041667],
                 [1.99193548, 1.99479167],
                 [2.11290323, 2.63020833],
                 [2.2016129, 2.734375],
                 [2.25403226, 2.60416667],
                 [2.14919355, 1.953125],
                 [2.30645161, 2.36979167],
                 [2.39112903, 2.36979167],
                 [2.41532258, 2.1875],
                 [2.1733871, 1.703125],
                 [2.07782258, 1.16666667]])`,
      metadataNotImage,
      inputs: ['', 'hand', '2', 'False'],
      returnVar: 'subdivide_polygon_output',
      execTest: (inputs, returnVar) => `from skimage.measure import subdivide_polygon
import numpy as np
expected = subdivide_polygon(${inputs[1]}, ${inputs[2]}, ${inputs[3]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs, prepareInput, returnVar, execTest) => `from skimage.measure import subdivide_polygon
${prepareInput}
${returnVar} = subdivide_polygon(${inputs[1]}, ${inputs[2]}, ${inputs[3]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  'metadata': {
    'device': '${metadataNotImage.device}'
  }
}
${execTest(inputs, returnVar)}`
    }
  ];

  test.each(testData)(
    'generate the code from the node $nodeName in $jsonPath',
    async ({
      jsonPath,
      nodeName,
      prepareInput,
      inputs,
      returnVar,
      execTest,
      getExpectedCode,
    }) => {
      const node = loadNode(jsonPath, nodeName);
      const executeTest = execTest(inputs, returnVar);
      const expectedOutput = getExpectedCode(
        inputs,
        prepareInput,
        returnVar,
        execTest
      );
      await nodeExecCheck(
        node,
        inputs,
        [executeTest, returnVar],
        expectedOutput,
        prepareInput
      );
    },
    100000
  );
});
