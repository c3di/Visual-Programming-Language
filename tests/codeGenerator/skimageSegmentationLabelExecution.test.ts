import { nodeExecCheck } from '../execution';
import { loadNode } from '../loader';


interface testNodeData {
  jsonPath: string;
  nodeName: string;
  prepareInput: string;
  inputs: string[];
  returnVar1: string;
  returnVar2: string;
  execTest: (inputs: any[], returnVar1: any, returnVar2: any) => string;
  getExpectedCode: (
    inputs: any[],
    prepareInput: string,
    returnVar1: any,
    returnVar2: any,
    execTest: (arg0: any, arg1: any, arg2: any) => any
  ) => string;
}

describe('Code Execution of Segmentation.json Label function', () => {
  const jsonPath = 'src/NodeTypeExtension/sciKitImage/Segmentation.json';
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

  const testData: testNodeData[] = [
    {
      jsonPath,
      nodeName: 'Measure_label',
      prepareInput,
      inputs: ['', 'input_image', 'None', '', 'None'],
      returnVar1: 'measure_label_output_label',
      returnVar2: 'measure_label_output_num',
      execTest: (inputs: any[], returnVar1: any, returnVar2: any) => `from skimage.measure import label
import numpy as np
expected_1, expected_2 = label(input_image['value'], ${inputs[2]}, True, ${inputs[4]})
print(np.array_equal(expected_1, ${returnVar1}) and np.array_equal(expected_2, ${returnVar2}))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar1: any, returnVar2: any, execTest: (arg0: any, arg1: any, arg2: any,) => any) => `from skimage.measure import label
${prepareInput}
${returnVar1}, ${returnVar2} = label(input_image['value'], ${inputs[2]}, True, ${inputs[4]})
${execTest(inputs, returnVar1, returnVar2)}`
    }
  ];

  test.each(testData)(
    'generate the code from the node $nodeName in $jsonPath',
    async ({
      jsonPath,
      nodeName,
      prepareInput,
      inputs,
      returnVar1,
      returnVar2,
      execTest,
      getExpectedCode,
    }) => {
      const node = loadNode(jsonPath, nodeName);
      const executeTest = execTest(inputs, returnVar1, returnVar2);
      const expectedOutput = getExpectedCode(
        inputs,
        prepareInput,
        returnVar1,
        returnVar2,
        execTest
      );
      await nodeExecCheck(
        node,
        inputs,
        [executeTest, returnVar1, returnVar2],
        expectedOutput,
        prepareInput
      );
    },
    100000
  );
});
