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
    returnVar: any,
    execTest: (arg0: any, arg1: any) => any
  ) => string;
}

describe('Code Execution of node kornia adjustment', () => {
  const testData: testNodeData[] = [
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Add_Weighted',
      inputs: ['', 'input_tensor1', '0.5', 'input_tensor2', '0.5', '1.0'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.add_weighted(input_tensor1, ${inputs[2]}, input_tensor2, ${inputs[4]}, ${inputs[5]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor1 = torch.rand(1, 1, 5, 5, device = 'cpu')
      input_tensor2 = torch.rand(1, 1, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.add_weighted(input_tensor1, ${inputs[2]
        }, input_tensor2, ${inputs[4]}, ${inputs[5]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'grayscale',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Add_Weighted',
      inputs: ['', 'input_tensor1', '0.5', 'input_tensor2', '0.5', '1.0'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.add_weighted(input_tensor1, ${inputs[2]}, input_tensor2, ${inputs[4]}, ${inputs[5]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor1 = torch.rand(1, 3, 5, 5, device = 'cpu')
      input_tensor2 = torch.rand(1, 3, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.add_weighted(input_tensor1, ${inputs[2]
        }, input_tensor2, ${inputs[4]}, ${inputs[5]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'rgb',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Brightness',
      inputs: ['', 'input_tensor', '1.0'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.adjust_brightness(input_tensor, ${inputs[2]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 1, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.adjust_brightness(input_tensor, ${inputs[2]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'grayscale',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Brightness',
      inputs: ['', 'input_tensor', '1.0'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.adjust_brightness(input_tensor, ${inputs[2]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 3, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.adjust_brightness(input_tensor, ${inputs[2]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'rgb',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },

    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Contrast',
      inputs: ['', 'input_tensor', '0.5', 'True'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.adjust_contrast(input_tensor, ${inputs[2]}, ${inputs[3]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 1, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.adjust_contrast(input_tensor, ${inputs[2]}, ${inputs[3]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'grayscale',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Contrast',
      inputs: ['', 'input_tensor', '0.5', 'False'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.adjust_contrast(input_tensor, ${inputs[2]}, ${inputs[3]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 3, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.adjust_contrast(input_tensor, ${inputs[2]}, ${inputs[3]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'rgb',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Contrast_With_Mean_subtraction',
      inputs: ['', 'input_tensor', '0.5'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.adjust_contrast_with_mean_subtraction(input_tensor, ${inputs[2]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 1, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.adjust_contrast_with_mean_subtraction(input_tensor, ${inputs[2]
        })
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'grayscale',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Contrast_With_Mean_subtraction',
      inputs: ['', 'input_tensor', '0.5'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.adjust_contrast_with_mean_subtraction(input_tensor, ${inputs[2]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 3, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.adjust_contrast_with_mean_subtraction(input_tensor, ${inputs[2]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'rgb',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Gamma',
      inputs: ['', 'input_tensor', '0.5', '1.0'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.adjust_gamma(input_tensor, ${inputs[2]}, ${inputs[3]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 1, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.adjust_gamma(input_tensor, ${inputs[2]}, ${inputs[3]
        })
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'grayscale',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
   ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Gamma',
      inputs: ['', 'input_tensor', '1.5', '2.0'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.adjust_gamma(input_tensor, ${inputs[2]}, ${inputs[3]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 3, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.adjust_gamma(input_tensor, ${inputs[2]}, ${inputs[3]
        })
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'rgb',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Hue',
      inputs: ['', 'input_tensor', '3.141516'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.adjust_hue(input_tensor, ${inputs[2]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 3, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.adjust_hue(input_tensor, ${inputs[2]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'rgb',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Saturation',
      inputs: ['', 'input_tensor', '2.0'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.adjust_saturation(input_tensor, ${inputs[2]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 3, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.adjust_saturation(input_tensor, ${inputs[2]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'rgb',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Sigmoid',
      inputs: ['', 'input_tensor', '0.5', '10', 'False'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.adjust_sigmoid(input_tensor, ${inputs[2]}, ${inputs[3]}, ${inputs[4]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 1, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.adjust_sigmoid(input_tensor, ${inputs[2]}, ${inputs[3]}, ${inputs[4]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'grayscale',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Sigmoid',
      inputs: ['', 'input_tensor', '0.8', '0', 'True'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.adjust_sigmoid(input_tensor, ${inputs[2]}, ${inputs[3]}, ${inputs[4]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 3, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.adjust_sigmoid(input_tensor, ${inputs[2]}, ${inputs[3]}, ${inputs[4]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'rgb',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Log',
      inputs: ['', 'input_tensor', '1', 'False', 'True'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.adjust_log(input_tensor, ${inputs[2]}, ${inputs[3]}, ${inputs[4]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 1, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.adjust_log(input_tensor, ${inputs[2]}, ${inputs[3]}, ${inputs[4]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'grayscale',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Log',
      inputs: ['', 'input_tensor', '3', 'True', 'False'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.adjust_log(input_tensor, ${inputs[2]}, ${inputs[3]}, ${inputs[4]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 3, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.adjust_log(input_tensor, ${inputs[2]}, ${inputs[3]}, ${inputs[4]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'rgb',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Invert',
      inputs: ['', 'input_tensor', 'Tensor([1.0])'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.invert(input_tensor, ${inputs[2]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 1, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.invert(input_tensor, ${inputs[2]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'grayscale',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Invert',
      inputs: ['', 'input_tensor', 'torch.as_tensor(255.)'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.invert(input_tensor, ${inputs[2]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 3, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.invert(input_tensor, ${inputs[2]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'rgb',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Posterize',
      inputs: ['', 'input_tensor', '8'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.posterize(input_tensor, ${inputs[2]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 1, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.posterize(input_tensor, ${inputs[2]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'grayscale',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Posterize',
      inputs: ['', 'input_tensor', 'torch.tensor([4, 2])'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.posterize(input_tensor, ${inputs[2]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 3, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.posterize(input_tensor, ${inputs[2]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'rgb',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Sharpness',
      inputs: ['', 'input_tensor', '0.5'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.sharpness(input_tensor, ${inputs[2]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 1, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.sharpness(input_tensor, ${inputs[2]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'grayscale',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Sharpness',
      inputs: ['', 'input_tensor', '1.5'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.sharpness(input_tensor, ${inputs[2]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 3, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.sharpness(input_tensor, ${inputs[2]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'rgb',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Solarize',
      inputs: ['', 'input_tensor', '0.5', 'None'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.solarize(input_tensor, ${inputs[2]}, ${inputs[3]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 1, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.solarize(input_tensor, ${inputs[2]}, ${inputs[3]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'grayscale',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
      }
    }
    ${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Solarize',
      inputs: ['', 'input_tensor', '1.0', '0.5'],
      returnVar: 'image',
      execTest: (inputs: any[], returnVar: any) => `import torch
    from torch import Tensor
    expected = K.enhance.solarize(input_tensor, ${inputs[2]}, ${inputs[3]})
    print(torch.equal(expected, ${returnVar}['value']));`,
      getExpectedOutput: (
        inputs: any[],
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
      input_tensor = torch.rand(1, 3, 5, 5, device = 'cpu')
      ${returnVar} = K.enhance.solarize(input_tensor, ${inputs[2]}, ${inputs[3]})
      ${returnVar} = {
      'value': ${returnVar},
      'dataType': 'torch.tensor',
      'metadata': {
        'colorChannel': 'rgb',
        'channelOrder': 'channelFirst',
        'isMiniBatched': True,
        'intensityRange': '0-1',
        'device': 'cpu'
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
      const expectedOutput = getExpectedOutput(inputs, returnVar, execTest);
      await nodeExecCheck(
        node,
        inputs,
        [executeTest, returnVar],
        expectedOutput
      );
    },
    100000
  );
});
