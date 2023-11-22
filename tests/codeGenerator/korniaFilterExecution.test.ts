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

describe('Code Execution of node kornia filter', () => {
  const testData: testNodeData[] = [
    {
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Canny',
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
        '0.1',
        '0.2',
        '(5, 5)',
        '(1, 1)',
        '"True"',
        '1e-6',
      ],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.canny(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
print(torch.equal(expected[0], ${returnVar}['value'][0]) and torch.equal(expected[1], ${returnVar}['value'][1]));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.filters.canny(input_tensor1['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Bilateral_Blur',
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
        '(3, 3)',
        '0.1',
        '(1.5, 1.5)',
        '"reflect"',
        '"l1"',
      ],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.bilateral_blur(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.bilateral_blur(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Bilateral_Blur',
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
        '(3, 3)',
        '0.1',
        '(1.5, 1.5)',
        '"reflect"',
        '"l1"',
      ],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.bilateral_blur(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.bilateral_blur(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Blur_Pool2d',
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
      inputs: ['', 'input_tensor1', '(3, 3)', '3'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.blur_pool2d(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.blur_pool2d(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Blur_Pool2d',
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
      inputs: ['', 'input_tensor1', '(3, 3)', '3'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.blur_pool2d(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.blur_pool2d(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Box_Blur',
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
      inputs: ['', 'input_tensor1', '(3, 3)', '"reflect"', 'False'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.box_blur(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.box_blur(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Box_Blur',
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
      inputs: ['', 'input_tensor1', '(3, 3)', '"constant"', 'False'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.box_blur(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.box_blur(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Gaussian_Blur2d',
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
      inputs: ['', 'input_tensor1', '(3, 3)', '(1.5, 1.5)', '"reflect"', 'True'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.gaussian_blur2d(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.gaussian_blur2d(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Gaussian_Blur2d',
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
        '(3, 3)',
        '(1.5, 1.5)',
        '"replicate"',
        'False',
      ],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.gaussian_blur2d(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.gaussian_blur2d(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Guided_Blur',
      prepareInput: `import torch
guidance_tensor = {
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
        'guidance_tensor',
        'input_tensor1',
        '(3, 3)',
        '0.1',
        '"reflect"',
        '1',
      ],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.guided_blur(guidance_tensor['value'], input_tensor1['value'], ${inputs
          .slice(3)
          .join(', ')})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.filters.guided_blur(guidance_tensor['value'], input_tensor1['value'], ${inputs
          .slice(3)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[2]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[2]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Guided_Blur',
      prepareInput: `import torch
guidance_tensor = {
  'dataType': 'torch.tensor',
  'value': torch.rand(1, 4, 5, 5, device = 'cpu'),
  'metadata': {
    'colorChannel': 'rgb',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu'
  }
}  
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
        'guidance_tensor',
        'input_tensor1',
        '(3, 3)',
        '0.3',
        '"reflect"',
        '1',
      ],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.guided_blur(guidance_tensor['value'], input_tensor1['value'], ${inputs
          .slice(3)
          .join(', ')})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.filters.guided_blur(guidance_tensor['value'], input_tensor1['value'], ${inputs
          .slice(3)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[2]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[2]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Joint_Bilateral_Blur',
      prepareInput: `import torch
guidance_tensor = {
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
        'guidance_tensor',
        '(3, 3)',
        '0.1',
        '(1.5, 1.5)',
        '"reflect"',
        '"l1"',
      ],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.joint_bilateral_blur(input_tensor1['value'], guidance_tensor['value'], ${inputs
          .slice(3)
          .join(', ')})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.filters.joint_bilateral_blur(input_tensor1['value'], guidance_tensor['value'], ${inputs
          .slice(3)
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Joint_Bilateral_Blur',
      prepareInput: `import torch
guidance_tensor = {
  'dataType': 'torch.tensor',
  'value': torch.rand(1, 3, 5, 5, device = 'cpu'),
  'metadata': {
    'colorChannel': 'rgb',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu'
  }
}  
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
        'guidance_tensor',
        '(3, 3)',
        '0.1',
        '(1.5, 1.5)',
        '"replicate"',
        '"l2"',
      ],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.joint_bilateral_blur(input_tensor1['value'], guidance_tensor['value'], ${inputs
          .slice(3)
          .join(', ')})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.filters.joint_bilateral_blur(input_tensor1['value'], guidance_tensor['value'], ${inputs
          .slice(3)
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Max_Blur_Pool2d',
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
      inputs: ['', 'input_tensor1', '(3, 3)', '2', '2', 'False'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.max_blur_pool2d(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.max_blur_pool2d(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Max_Blur_Pool2d',
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
      inputs: ['', 'input_tensor1', '(3, 3)', '3', '4', 'True'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.max_blur_pool2d(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.max_blur_pool2d(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Median_Blur',
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
      inputs: ['', 'input_tensor1', '(3, 3)'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.median_blur(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.median_blur(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Median_Blur',
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
      inputs: ['', 'input_tensor1', '(5, 5)'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.median_blur(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.median_blur(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Motion_Blur',
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
      inputs: ['', 'input_tensor1', '3', '90.', '1', '"constant"', '"nearest"'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.motion_blur(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.motion_blur(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Motion_Blur',
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
      inputs: ['', 'input_tensor1', '5', '45.', '-1', '"reflect"', '"bilinear"'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.motion_blur(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.motion_blur(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Unsharp_Mask',
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
      inputs: ['', 'input_tensor1', '(3, 3)', '(1.5, 1.5)', '"constant"'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.unsharp_mask(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.unsharp_mask(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Unsharp_Mask',
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
      inputs: ['', 'input_tensor1', '(5, 5)', '(1.5, 1.5)', '"reflect"'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.unsharp_mask(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.unsharp_mask(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Laplacian',
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
      inputs: ['', 'input_tensor1', '3', '"constant"', 'True'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.laplacian(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.laplacian(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Laplacian',
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
      inputs: ['', 'input_tensor1', '5', '"reflect"', 'False'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.laplacian(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.laplacian(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Sobel',
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
      inputs: ['', 'input_tensor1', 'True', '1e-6'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.sobel(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.sobel(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Sobel',
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
      inputs: ['', 'input_tensor1', 'False', '1e-6'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.sobel(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.sobel(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Spatial_Gradient',
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
      inputs: ['', 'input_tensor1', '"sobel"', '1', 'True'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.spatial_gradient(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.spatial_gradient(input_tensor1['value'], ${inputs
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
      jsonPath: 'src/NodeTypeExtension/kornia/filters.json',
      nodeName: 'Spatial_Gradient',
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
      inputs: ['', 'input_tensor1', '"diff"', '1', 'False'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.filters.spatial_gradient(input_tensor1['value'], ${inputs
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
${returnVar} = K.filters.spatial_gradient(input_tensor1['value'], ${inputs
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
