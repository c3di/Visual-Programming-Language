import { nodeExecCheck } from '../execution';
import { loadNode } from '../loader';

type Metadata = {
  colorChannel: string;
  channelOrder: string;
  isMiniBatched: string;
  intensityRange: string;
  device: string;
};

interface testNodeData {
  jsonPath: string;
  nodeName: string;
  prepareInput: string;
  metadataRGB: Metadata;
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

describe('Code Execution of Segmentation.json Label2RGB function', () => {
  const jsonPath = 'src/NodeTypeExtension/sciKitImage/Segmentation.json';
  const metadataRGB = {
    'colorChannel': 'rgb',
    'channelOrder': 'channelLast',
    'isMiniBatched': 'False',
    'intensityRange': '0-255',
    'device': 'cpu'
  };

  const testData: testNodeData[] = [
    {
      jsonPath,
      nodeName: 'Label2rgb',
      prepareInput: `from skimage import data
from skimage.measure import label
import numpy as np
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
}
input_label = label(data.binary_blobs(length=512, blob_size_fraction=0.1, n_dim=2, volume_fraction=0.5, rng=42))`,
      metadataRGB,
      inputs: ['', 'input_label', 'input_image', 'None', '0.3', '0', '(0, 0, 0)', '1.0', '"overlay"', '0.0', '-1'],
      returnVar: 'label2rgb_output_rgb',
      execTest: (inputs: any[], returnVar: any) => `from skimage.color import label2rgb
import numpy as np
expected = label2rgb(${inputs[1]}, ${inputs[2]}['value'], ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, saturation=${inputs[9]}, channel_axis=${inputs[10]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.color import label2rgb
${prepareInput}
${returnVar} = label2rgb(${inputs[1]}, ${inputs[2]}['value'], ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, saturation=${inputs[9]}, channel_axis=${inputs[10]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  'metadata': {
    'colorChannel': '${metadataRGB.colorChannel}',
    'channelOrder': '${metadataRGB.channelOrder}',
    'isMiniBatched': ${metadataRGB.isMiniBatched},
    'intensityRange': '${metadataRGB.intensityRange}',
    'device': '${metadataRGB.device}'
  }
}
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Label2rgb',
      prepareInput: `from skimage import data
from skimage.measure import label
import numpy as np
input_image = {
  'dataType': 'numpy.ndarray',
  'value': data.brick()[0:127, 0:131],
  'metadata': {
    'colorChannel': 'grayscale',
    'channelOrder': 'none',
    'isMiniBatched': False,
    'intensityRange': '0-255',
    'device': 'cpu'
  }
}
input_label = label(data.brick()[0:127, 0:131])`,
      metadataRGB,
      inputs: ['', 'input_label', 'input_image', 'None', '0.3', '0', '(0, 0, 0)', '1.0', '"overlay"', '0.0', '-1'],
      returnVar: 'label2rgb_output_rgb',
      execTest: (inputs: any[], returnVar: any) => `from skimage.color import label2rgb
import numpy as np
expected = label2rgb(${inputs[1]}, ${inputs[2]}['value'], ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, saturation=${inputs[9]}, channel_axis=${inputs[10]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.color import label2rgb
${prepareInput}
${returnVar} = label2rgb(${inputs[1]}, ${inputs[2]}['value'], ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, saturation=${inputs[9]}, channel_axis=${inputs[10]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  'metadata': {
    'colorChannel': '${metadataRGB.colorChannel}',
    'channelOrder': '${metadataRGB.channelOrder}',
    'isMiniBatched': ${metadataRGB.isMiniBatched},
    'intensityRange': '${metadataRGB.intensityRange}',
    'device': '${metadataRGB.device}'
  }
}
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Label2rgb',
      prepareInput: `from skimage import data
from skimage.measure import label
import numpy as np
input_image = {
  'dataType': 'numpy.ndarray',
  'value': data.rocket()[296:427, 275:402],
  'metadata': {
    'colorChannel': 'rgb',
    'channelOrder': 'channelLast',
    'isMiniBatched': 'False',
    'intensityRange': '0-255',
    'device': 'cpu'
  }
}
input_label = label(data.rocket()[296:427, 275:402])`,
      metadataRGB,
      inputs: ['', 'input_label', 'input_image', 'None', '0.3', '0', '(0, 0, 0)', '1.0', '"overlay"', '0.0', '-1'],
      returnVar: 'label2rgb_output_rgb',
      execTest: (inputs: any[], returnVar: any) => `from skimage.color import label2rgb
import numpy as np
expected = label2rgb(${inputs[1]}, ${inputs[2]}['value'], ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, saturation=${inputs[9]}, channel_axis=${inputs[10]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.color import label2rgb
${prepareInput}
${returnVar} = label2rgb(${inputs[1]}, ${inputs[2]}['value'], ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, saturation=${inputs[9]}, channel_axis=${inputs[10]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  'metadata': {
    'colorChannel': '${metadataRGB.colorChannel}',
    'channelOrder': '${metadataRGB.channelOrder}',
    'isMiniBatched': ${metadataRGB.isMiniBatched},
    'intensityRange': '${metadataRGB.intensityRange}',
    'device': '${metadataRGB.device}'
  }
}
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Label2rgb',
      prepareInput: `from skimage import data
from skimage.measure import label
import numpy as np
input_image = {
  'dataType': 'numpy.ndarray',
  'value': data.rocket()[296:427, 275:402, [1, 2, 0]],
  'metadata': {
    'colorChannel': 'gbr',
    'channelOrder': 'channelLast',
    'isMiniBatched': 'False',
    'intensityRange': '0-255',
    'device': 'cpu'
  }
}
input_label = label(data.rocket()[296:427, 275:402, [1, 2, 0]])`,
      metadataRGB,
      inputs: ['', 'input_label', 'input_image', 'None', '0.3', '0', '(0, 0, 0)', '1.0', '"overlay"', '0.0', '-1'],
      returnVar: 'label2rgb_output_rgb',
      execTest: (inputs: any[], returnVar: any) => `from skimage.color import label2rgb
import numpy as np
expected = label2rgb(${inputs[1]}, ${inputs[2]}['value'], ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, saturation=${inputs[9]}, channel_axis=${inputs[10]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.color import label2rgb
${prepareInput}
${returnVar} = label2rgb(${inputs[1]}, ${inputs[2]}['value'], ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, saturation=${inputs[9]}, channel_axis=${inputs[10]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  'metadata': {
    'colorChannel': '${metadataRGB.colorChannel}',
    'channelOrder': '${metadataRGB.channelOrder}',
    'isMiniBatched': ${metadataRGB.isMiniBatched},
    'intensityRange': '${metadataRGB.intensityRange}',
    'device': '${metadataRGB.device}'
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
      getExpectedCode,
    }) => {
      const node = loadNode(jsonPath, nodeName);
      const executeTest = execTest(inputs, returnVar);
      const expectedOutput = getExpectedCode(
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
