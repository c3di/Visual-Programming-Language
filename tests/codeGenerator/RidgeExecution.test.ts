import { nodeExecCheck } from '../execution';
import { loadNode } from '../loader';

interface testNodeData {
  jsonPath: string;
  nodeName: string;
  prepareInput: string;
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

describe('Code Execution of node skimage.filters.meijering', () => {
  const testData: testNodeData[] = [
    {
      jsonPath: 'src/NodeTypeExtension/sciKitImage/Edge_and_Lines.json',
      nodeName: 'Ridge_operators',
      prepareInput: `from skimage import data
input_image = {
  'dataType': 'numpy.ndarray',
  'value': data.camera(),
  'metadata': {
    'colorChannel': 'grayscale',
    'channelOrder': 'none',
    'isMiniBatched': False,
    'intensityRange': '0-255',
    'device': 'cpu'
  }
}`,
      inputs: ['', 'input_image', 'range(1, 10, 2)', 'None', 'True', "'reflect'", '0'],
      returnVar: 'filtered_image',

      execTest: (inputs: any[], returnVar: any) => `from skimage.filters import meijering
import numpy as np
expected = meijering(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]})
print(np.array_equal(expected, ${returnVar}['value']))`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `from skimage.filters import meijering
${prepareInput}
${returnVar} = meijering(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  'metadata': {
    'colorChannel': 'grayscale',
    'channelOrder': 'none',
    'isMiniBatched': False,
    'intensityRange': '0-255',
    'device': 'cpu'
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
      getExpectedCode: getExpectedOutput,
    }) => {
      const node = loadNode(jsonPath, nodeName);
      const executeTest = execTest(inputs, returnVar);
      const expectedOutput = getExpectedOutput(
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
