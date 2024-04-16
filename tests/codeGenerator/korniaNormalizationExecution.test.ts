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

describe('Code Execution of node kornia normalization', () => {
  const testData: testNodeData[] = [
    {
      jsonPath: 'src/NodeTypeExtension/kornia/normalization.json',
      nodeName: 'Normalize',
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
      inputs: [
        '',
        'input_tensor1',
        'torch.tensor([0.0])',
        'torch.tensor([255.])',
      ],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.normalize(input_tensor1['value'], ${inputs
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
${returnVar} = K.enhance.normalize(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/normalization.json',
      nodeName: 'Normalize',
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
      inputs: ['', 'input_tensor1', 'torch.zeros(3)', '255. * torch.ones(3)'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.normalize(input_tensor1['value'], ${inputs
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
${returnVar} = K.enhance.normalize(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
${execTest(inputs, returnVar)}`,
    },

    {
      jsonPath: 'src/NodeTypeExtension/kornia/normalization.json',
      nodeName: 'Normalize_Min_Max',
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
      inputs: ['', 'input_tensor1', '0.0', '1.0', '1e-6'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.normalize_min_max(input_tensor1['value'], ${inputs
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
${returnVar} = K.enhance.normalize_min_max(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/normalization.json',
      nodeName: 'Normalize_Min_Max',
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
      inputs: ['', 'input_tensor1', '-1.', '2.0', '1e-6'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.normalize_min_max(input_tensor1['value'], ${inputs
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
${returnVar} = K.enhance.normalize_min_max(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
${execTest(inputs, returnVar)}`,
    },

    {
      jsonPath: 'src/NodeTypeExtension/kornia/normalization.json',
      nodeName: 'Denormalize',
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
      inputs: ['', 'input_tensor1', '0.0', '255.'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.denormalize(input_tensor1['value'], ${inputs
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
${returnVar} = K.enhance.denormalize(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/normalization.json',
      nodeName: 'Denormalize',
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
      inputs: [
        '',
        'input_tensor1',
        'torch.zeros(1, 3)',
        '255. * torch.ones(1, 3)',
      ],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.denormalize(input_tensor1['value'], ${inputs
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
${returnVar} = K.enhance.denormalize(input_tensor1['value'], ${inputs
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
