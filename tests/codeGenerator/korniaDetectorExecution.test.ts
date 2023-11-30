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

describe('Code Execution of node kornia detector', () => {
  const testData: testNodeData[] = [
    {
      jsonPath: 'src/NodeTypeExtension/kornia/detector.json',
      nodeName: 'Gftt_Response',
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
      inputs: ['', 'input_tensor1', '"sobel"', 'None'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.feature.gftt_response(input_tensor1['value'], ${inputs
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
${returnVar} = K.feature.gftt_response(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/detector.json',
      nodeName: 'Gftt_Response',
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
      inputs: ['', 'input_tensor1', '"diff"', 'None'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.feature.gftt_response(input_tensor1['value'], ${inputs
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
${returnVar} = K.feature.gftt_response(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },

    {
      jsonPath: 'src/NodeTypeExtension/kornia/detector.json',
      nodeName: 'Harris_Response',
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
      inputs: ['', 'input_tensor1', '0.04', '"sobel"', 'None'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.feature.harris_response(input_tensor1['value'], ${inputs
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
${returnVar} = K.feature.harris_response(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/detector.json',
      nodeName: 'Harris_Response',
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
      inputs: ['', 'input_tensor1', '0.08', '"diff"', 'None'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.feature.harris_response(input_tensor1['value'], ${inputs
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
${returnVar} = K.feature.harris_response(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },

    {
      jsonPath: 'src/NodeTypeExtension/kornia/detector.json',
      nodeName: 'Hessian_Response',
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
      inputs: ['', 'input_tensor1', '"sobel"', 'None'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.feature.hessian_response(input_tensor1['value'], ${inputs
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
${returnVar} = K.feature.hessian_response(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/detector.json',
      nodeName: 'Hessian_Response',
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
      inputs: ['', 'input_tensor1', '"diff"', 'None'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.feature.hessian_response(input_tensor1['value'], ${inputs
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
${returnVar} = K.feature.hessian_response(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },

    {
      jsonPath: 'src/NodeTypeExtension/kornia/detector.json',
      nodeName: 'Dog_Response_Single',
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
      inputs: ['', 'input_tensor1', '1.0', '1.6'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.feature.dog_response_single(input_tensor1['value'], ${inputs
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
${returnVar} = K.feature.dog_response_single(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/detector.json',
      nodeName: 'Dog_Response_Single',
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
      inputs: ['', 'input_tensor1', '1.0', '1.6'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.feature.dog_response_single(input_tensor1['value'], ${inputs
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
${returnVar} = K.feature.dog_response_single(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/detector.json',
      nodeName: 'Dog_Response_Single',
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
      inputs: ['', 'input_tensor1', '0.5', '2.0'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.feature.dog_response_single(input_tensor1['value'], ${inputs
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
${returnVar} = K.feature.dog_response_single(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    }
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
