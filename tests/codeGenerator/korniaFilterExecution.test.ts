import { nodeExecCheck } from '../execution';
import { loadNode } from '../loader';

interface testNodeData {
  jsonPath: string;
  nodeName: string;
  inputs: string[];
  returnVar: string;
  execTest: (inputs: any[], returnVar: any) => string;
  getExpectedOutput: (
    inputs: any[],
    prepareInput: string,
    returnVar: any,
    execTest: (arg0: any, arg1: any) => any
  ) => string;
}

describe('Code Execution of node kornia filter', () => {
  const testData: testNodeData[] = [
    {
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Bilateral_Blur',
      inputs: ['', 'input_tensor1', '0.5', 'input_tensor2', '0.5', '1.0', '1'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.add_weighted(input_tensor1, ${inputs[2]}, input_tensor2, ${inputs[4]}, ${inputs[5]}, ${inputs[6]})
print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.filters.bilateral_blur(input_tensor1, ${
        inputs[2]
      }, input_tensor2, ${inputs[4]}, ${inputs[5]}, ${inputs[6]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': ${
      inputs[1]
    }.metadata.colorChannel == 'rgb'? 'rgb':'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': ${inputs[1]}.device == 'cpu'? 'cpu'
  }
}
${execTest(inputs, returnVar)}`,
    },
  ];

  test.each(testData)(
    'generate the code from the node $nodeName in $jsonPath',
    async ({
      jsonPath,
      nodeName,
      inputs,
      returnVar,
      execTest,
      getExpectedOutput,
    }) => {
      const node = loadNode(jsonPath, nodeName);
      const executeTest = execTest(inputs, returnVar);
      const prepareInput = `input_tensor1 = {
  'dataType': 'torch.tensor',
  'value': torch.rand(1, 1, 5, 5, device = 'cpu'),
  'metadata': {
    'colorChannel': 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu'
  }
}
input_tensor2 = {
  'dataType': 'torch.tensor',
  'value': torch.rand(1, 1, 5, 5, device = 'cpu'),
  'metadata': {
    'colorChannel': 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu'
  }
};`;
      const expectedOutput = getExpectedOutput(
        inputs,
        prepareInput,
        returnVar,
        execTest
      );
      // check the output console.log(expectedOutput);
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
