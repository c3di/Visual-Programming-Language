import { nodeExecCheck } from '../execution';
import { loadNode } from '../loader';

type Metadata = {
  colorChannel: string;
  channelOrder: string;
  isMiniBatched: string;
  intensityRange: string;
  device: string;
};

interface testNodeData {
  jsonPath: string;
  nodeName: string;
  prepareInput: string;
  metadataBinary: Metadata;
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

describe('Code Execution of Edge_and_Lines.json functions with Input Binary only', () => {
  const jsonPath = 'src/NodeTypeExtension/sciKitImage/Edge_and_Lines.json';
  const prepareInput = `from skimage import data
input_image = {
  'dataType': 'numpy.ndarray',
  'value': data.binary_blobs(length=512, blob_size_fraction=0.1, n_dim=2, volume_fraction=0.5, rng=42),
  'metadata': {
    'colorChannel': 'grayscale',
    'channelOrder': 'none',
    'isMiniBatched': False,
    'intensityRange': '0-1',
    'device': 'cpu'
  }
}`;
  const metadataBinary = {
    'colorChannel': 'grayscale',
    'channelOrder': 'none',
    'isMiniBatched': 'False',
    'intensityRange': '0-1',
    'device': 'cpu'
  };

  const testData: testNodeData[] = [
    {
      jsonPath,
      nodeName: 'Convex_Hull',
      prepareInput,
      metadataBinary,
      inputs: ['', 'input_image', 'True', '1e-10', 'True'],
      returnVar: 'convex_hull_output_binary',
      execTest: (inputs: any[], returnVar: any) => `from skimage.morphology import convex_hull_image
import numpy as np
expected = convex_hull_image(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.morphology import convex_hull_image
${prepareInput}
${returnVar} = convex_hull_image(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  'metadata': {
    'colorChannel': '${metadataBinary.colorChannel}',
    'channelOrder': '${metadataBinary.channelOrder}',
    'isMiniBatched': ${metadataBinary.isMiniBatched},
    'intensityRange': '${metadataBinary.intensityRange}',
    'device': '${metadataBinary.device}'
  }
}
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Skeletonize',
      prepareInput,
      metadataBinary,
      inputs: ['', 'input_image', 'method=None'],
      returnVar: 'skeletonize_output_binary',
      execTest: (inputs: any[], returnVar: any) => `from skimage.morphology import skeletonize
import numpy as np
expected = skeletonize(input_image['value'], ${inputs[2]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.morphology import skeletonize
${prepareInput}
${returnVar} = skeletonize(input_image['value'], ${inputs[2]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  'metadata': {
    'colorChannel': '${metadataBinary.colorChannel}',
    'channelOrder': '${metadataBinary.channelOrder}',
    'isMiniBatched': ${metadataBinary.isMiniBatched},
    'intensityRange': '${metadataBinary.intensityRange}',
    'device': '${metadataBinary.device}'
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
