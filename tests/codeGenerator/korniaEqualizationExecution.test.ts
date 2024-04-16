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

describe('Code Execution of node kornia equalization', () => {
  const testData: testNodeData[] = [
    {
      jsonPath: 'src/NodeTypeExtension/kornia/equalization.json',
      nodeName: 'Equalize',
      prepareInput: `import torch
input_tensor1 = {
  'dataType': 'torch.tensor',
  'value': torch.rand(1, 1, 5, 5, device = 'cpu'),
  'metadata': {
    'colorChannel': 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu'
  }
}`,
      inputs: ['', 'input_tensor1'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.equalize(input_tensor1['value'])
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.enhance.equalize(input_tensor1['value'])
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/equalization.json',
      nodeName: 'Equalize',
      prepareInput: `import torch
input_tensor1 = {
  'dataType': 'torch.tensor',
  'value': torch.rand(1, 3, 5, 5, device = 'cpu'),
  'metadata': {
    'colorChannel': 'rgb',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu'
  }
}`,
      inputs: ['', 'input_tensor1'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.equalize(input_tensor1['value'])
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.enhance.equalize(input_tensor1['value'])
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/equalization.json',
      nodeName: 'Equalize_Clahe',
      prepareInput: `import torch
input_tensor1 = {
  'dataType': 'torch.tensor',
  'value': torch.rand(1, 1, 5, 5, device = 'cpu'),
  'metadata': {
    'colorChannel': 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu'
  }
}`,
      inputs: ['', 'input_tensor1', '10.0', '(2, 2)', 'False'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.equalize_clahe(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.enhance.equalize_clahe(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/equalization.json',
      nodeName: 'Equalize_Clahe',
      prepareInput: `import torch
input_tensor1 = {
  'dataType': 'torch.tensor',
  'value': torch.rand(1, 3, 5, 5, device = 'cpu'),
  'metadata': {
    'colorChannel': 'rgb',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu'
  }
}`,
      inputs: ['', 'input_tensor1', '20.0', '(3, 3)', 'True'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.equalize_clahe(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.enhance.equalize_clahe(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
${execTest(inputs, returnVar)}`,
    },
  ];

  test.each(testData)(
    'generate the code from the node $nodeName in $jsonPath',
    async ({
      jsonPath,
      nodeName,
      prepareInput: prepareInput,
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
