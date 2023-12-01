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

describe('Code Execution of node White_Tophat', () => {
  const testData: testNodeData[] = [
    {
      jsonPath: 'src/NodeTypeExtension/sciKitImage/WhiteTopHat_ver1.json',
      nodeName: 'White_Tophat',
      prepareInput: `from skimage import data
input_image = {
  'dataType': 'numpy.ndarray',
  'value': data.astronaut(),
  'metadata': {
    'colorChannel': 'rgb',
    'channelOrder': 'channelLast',
    'isMiniBatched': False,
    'intensityRange': '0-255',
    'device': 'cpu'
  }
}`,
      inputs: ['', 'input_image', 'None', 'None'],
      returnVar: 'result_image',

      execTest: (inputs: any[], returnVar: any) => `from skimage.morphology import white_tophat
import numpy as np
expected = white_tophat(input_image['value'], ${inputs[2]}, ${inputs[3]})
print(np.array_equal(expected, ${returnVar}['value']))`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `from skimage.morphology import white_tophat
${prepareInput}
${returnVar} = white_tophat(input_image['value'], ${inputs[2]}, ${inputs[3]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  'metadata': {
    'colorChannel': 'rgb',
    'channelOrder': 'channelLast',
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