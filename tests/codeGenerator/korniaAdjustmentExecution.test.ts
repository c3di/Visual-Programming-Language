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

describe('Code Execution of node kornia adjustment', () => {
  const testData: testNodeData[] = [
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Add_Weighted',
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
}`,
      inputs: ['', 'input_tensor1', '0.5', 'input_tensor2', '0.5', '1.0'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.add_weighted(input_tensor1['value'], ${inputs[2]}, input_tensor2['value'], ${inputs[4]}, ${inputs[5]})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.enhance.add_weighted(input_tensor1['value'], ${inputs[2]
        }, input_tensor2['value'], ${inputs[4]}, ${inputs[5]})
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
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Add_Weighted',
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
}
input_tensor2 = {
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
      inputs: ['', 'input_tensor1', '0.5', 'input_tensor2', '0.5', '1.0'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.add_weighted(input_tensor1['value'], ${inputs[2]}, input_tensor2['value'], ${inputs[4]}, ${inputs[5]})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.enhance.add_weighted(input_tensor1['value'], ${inputs[2]
        }, input_tensor2['value'], ${inputs[4]}, ${inputs[5]})
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
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Brightness',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', '1.0'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.adjust_brightness(input_tensor['value'], ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.enhance.adjust_brightness(input_tensor['value'], ${inputs[2]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Brightness',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', 'torch.tensor([0.25, 0.50])'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.adjust_brightness(input_tensor['value'], ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.enhance.adjust_brightness(input_tensor['value'], ${inputs[2]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },

    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Contrast',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', '0.5', 'True'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.adjust_contrast(input_tensor['value'], ${inputs
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
${returnVar} = K.enhance.adjust_contrast(input_tensor['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Contrast',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', 'torch.tensor([0.65, 0.50])', 'False'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.adjust_contrast(input_tensor['value'], ${inputs
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
${returnVar} = K.enhance.adjust_contrast(input_tensor['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },

    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Contrast_With_Mean_subtraction',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', '0.5'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.adjust_contrast_with_mean_subtraction(input_tensor['value'], ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.enhance.adjust_contrast_with_mean_subtraction(input_tensor['value'], ${inputs[2]
        })
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Contrast_With_Mean_subtraction',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', 'torch.tensor([0.65, 0.50])'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.adjust_contrast_with_mean_subtraction(input_tensor['value'], ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.enhance.adjust_contrast_with_mean_subtraction(input_tensor['value'], ${inputs[2]
        })
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },

    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Gamma',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', '1.0', '2.0'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.adjust_gamma(input_tensor['value'], ${inputs
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
${returnVar} = K.enhance.adjust_gamma(input_tensor['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Gamma',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', '0.5', '1.0'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.adjust_gamma(input_tensor['value'], ${inputs
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
${returnVar} = K.enhance.adjust_gamma(input_tensor['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },

    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Hue',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', '3.141516'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.adjust_hue(input_tensor['value'], ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.enhance.adjust_hue(input_tensor['value'], ${inputs[2]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },

    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Saturation',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', '2.0'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.adjust_saturation(input_tensor['value'], ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.enhance.adjust_saturation(input_tensor['value'], ${inputs[2]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },

    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Sigmoid',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', '0.5', '10', 'False'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.adjust_sigmoid(input_tensor['value'], ${inputs
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
${returnVar} = K.enhance.adjust_sigmoid(input_tensor['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Sigmoid',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', '0.8', '0', 'True'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.adjust_sigmoid(input_tensor['value'], ${inputs
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
${returnVar} = K.enhance.adjust_sigmoid(input_tensor['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },

    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Log',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', '1', 'False', 'False'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.adjust_log(input_tensor['value'], ${inputs
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
${returnVar} = K.enhance.adjust_log(input_tensor['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Adjust_Log',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', '3', 'True', 'False'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.adjust_log(input_tensor['value'], ${inputs
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
${returnVar} = K.enhance.adjust_log(input_tensor['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },

    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Invert',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', 'torch.as_tensor([[[[1.]]]])'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.invert(input_tensor['value'], ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.enhance.invert(input_tensor['value'], ${inputs[2]})
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
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Invert',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', 'torch.as_tensor(255.)'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.invert(input_tensor['value'], ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.enhance.invert(input_tensor['value'], ${inputs[2]})
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
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Posterize',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', '8'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.posterize(input_tensor['value'], ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.enhance.posterize(input_tensor['value'], ${inputs[2]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Posterize',
      prepareInput: `import torch
input_tensor = {
  'dataType': 'torch.tensor',
  'value': torch.rand(2, 3, 5, 5, device = 'cpu'),
  'metadata': {
    'colorChannel': 'rgb',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu'
  }
}`,
      inputs: ['', 'input_tensor', 'torch.tensor([4, 2])'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.posterize(input_tensor['value'], ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.enhance.posterize(input_tensor['value'], ${inputs[2]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },

    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Sharpness',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', '0.5'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.sharpness(input_tensor['value'], ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.enhance.sharpness(input_tensor['value'], ${inputs[2]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Sharpness',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', '1.5'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.sharpness(input_tensor['value'], ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']));`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `import kornia as K
${prepareInput}
${returnVar} = K.enhance.sharpness(input_tensor['value'], ${inputs[2]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },

    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Solarize',
      prepareInput: `import torch
input_tensor = {
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
      inputs: ['', 'input_tensor', '0.5', 'None'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.solarize(input_tensor['value'], ${inputs
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
${returnVar} = K.enhance.solarize(input_tensor['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
  }
}
${execTest(inputs, returnVar)}`,
    },

    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Solarize',
      prepareInput: `import torch
input_tensor = {
  'dataType': 'torch.tensor',
  'value': torch.rand(2, 3, 5, 5, device = 'cpu'),
  'metadata': {
    'colorChannel': 'rgb',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True,
    'intensityRange': '0-1',
    'device': 'cpu'
  }
}`,
      inputs: ['', 'input_tensor', 'torch.tensor([0.8, 0.5])', 'torch.tensor([-0.25, 0.25])'],
      returnVar: 'image',

      execTest: (inputs: any[], returnVar: any) => `import torch
from torch import Tensor
expected = K.enhance.solarize(input_tensor['value'], ${inputs
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
${returnVar} = K.enhance.solarize(input_tensor['value'], ${inputs
          .slice(2)
          .join(', ')})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb' if ${inputs[1]
        }['metadata']['colorChannel'] == 'rgb' else 'grayscale',
    'channelOrder': 'channelFirst',
    'isMiniBatched': True if ${inputs[1]}['metadata']['isMiniBatched'] == True else False,
    'intensityRange': '0-1',
    'device': 'cpu' if ${inputs[1]}['value'].get_device() == -1 else 'gpu'
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
