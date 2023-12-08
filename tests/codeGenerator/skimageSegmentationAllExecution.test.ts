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

describe('Code Execution of Segmentation.json functions with Input Binary, Grayscale & Color', () => {
    const jsonPath = 'src/NodeTypeExtension/sciKitImage/Segmentation.json';
    const prepareInputBinary = `from skimage import data
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
}`;
    const prepareInputGrayscale = `from skimage import data
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
}`;
    const prepareInputRGB = `from skimage import data
import numpy as np
input_image = {
  'dataType': 'numpy.ndarray',
  'value': data.rocket()[296:427, 275:402],
  'metadata': {
    'colorChannel': 'rgb',
    'channelOrder': 'channelLast',
    'isMiniBatched': False,
    'intensityRange': '0-255',
    'device': 'cpu'
  }
}`;
    const prepareInputGBR = `from skimage import data
import numpy as np
input_image = {
  'dataType': 'numpy.ndarray',
  'value': data.rocket()[296:427, 275:402, [1, 2, 0]],
  'metadata': {
    'colorChannel': 'gbr',
    'channelOrder': 'channelLast',
    'isMiniBatched': False,
    'intensityRange': '0-255',
    'device': 'cpu'
  }
}`;


  const testData: testNodeData[] = [
    {
      jsonPath,
      nodeName: 'Felzenszwalb_Segmentation',
      prepareInput:  prepareInputBinary,
      inputs: ['', 'input_image', '1.0', '0.8', '20', 'None'],
      returnVar: 'felzenszwalb_segmentation_output',
      execTest: (inputs: any[], returnVar: any) => `from skimage.segmentation import felzenszwalb
import numpy as np
expected = felzenszwalb(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, channel_axis=${inputs[5]})
print(np.array_equal(expected, ${returnVar}))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.segmentation import felzenszwalb
${prepareInput}
${returnVar} = felzenszwalb(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, channel_axis=${inputs[5]})
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Felzenszwalb_Segmentation',
      prepareInput:  prepareInputGrayscale,
      inputs: ['', 'input_image', '1.0', '0.8', '20', 'None'],
      returnVar: 'felzenszwalb_segmentation_output',
      execTest: (inputs: any[], returnVar: any) => `from skimage.segmentation import felzenszwalb
import numpy as np
expected = felzenszwalb(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, channel_axis=${inputs[5]})
print(np.array_equal(expected, ${returnVar}))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.segmentation import felzenszwalb
${prepareInput}
${returnVar} = felzenszwalb(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, channel_axis=${inputs[5]})
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Felzenszwalb_Segmentation',
      prepareInput:  prepareInputRGB,
      inputs: ['', 'input_image', '1.0', '0.8', '20', '-1'],
      returnVar: 'felzenszwalb_segmentation_output',
      execTest: (inputs: any[], returnVar: any) => `from skimage.segmentation import felzenszwalb
import numpy as np
expected = felzenszwalb(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, channel_axis=${inputs[5]})
print(np.array_equal(expected, ${returnVar}))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.segmentation import felzenszwalb
${prepareInput}
${returnVar} = felzenszwalb(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, channel_axis=${inputs[5]})
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Felzenszwalb_Segmentation',
      prepareInput:  prepareInputGBR,
      inputs: ['', 'input_image', '1.0', '0.8', '20', '-1'],
      returnVar: 'felzenszwalb_segmentation_output',
      execTest: (inputs: any[], returnVar: any) => `from skimage.segmentation import felzenszwalb
import numpy as np
expected = felzenszwalb(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, channel_axis=${inputs[5]})
print(np.array_equal(expected, ${returnVar}))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.segmentation import felzenszwalb
${prepareInput}
${returnVar} = felzenszwalb(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, channel_axis=${inputs[5]})
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Slic_Segmentation',
      prepareInput:  prepareInputBinary,
      inputs: ['', 'input_image', '100', '10.0', '10', '0.0', 'None', 'None', 'True', '0.5', '3.0', 'False', '1', 'None', 'None'],
      returnVar: 'slic_segmentation_output',
      execTest: (inputs: any[], returnVar: any) => `from skimage.segmentation import slic
import numpy as np
expected = slic(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, ${inputs[9]}, ${inputs[10]}, ${inputs[11]}, ${inputs[12]}, ${inputs[13]}, channel_axis=${inputs[14]})
print(np.array_equal(expected, ${returnVar}))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.segmentation import slic
${prepareInput}
${returnVar} = slic(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, ${inputs[9]}, ${inputs[10]}, ${inputs[11]}, ${inputs[12]}, ${inputs[13]}, channel_axis=${inputs[14]})
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Slic_Segmentation',
      prepareInput:  prepareInputGrayscale,
      inputs: ['', 'input_image', '100', '10.0', '10', '0.0', 'None', 'None', 'True', '0.5', '3.0', 'False', '1', 'None', 'None'],
      returnVar: 'slic_segmentation_output',
      execTest: (inputs: any[], returnVar: any) => `from skimage.segmentation import slic
import numpy as np
expected = slic(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, ${inputs[9]}, ${inputs[10]}, ${inputs[11]}, ${inputs[12]}, ${inputs[13]}, channel_axis=${inputs[14]})
print(np.array_equal(expected, ${returnVar}))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.segmentation import slic
${prepareInput}
${returnVar} = slic(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, ${inputs[9]}, ${inputs[10]}, ${inputs[11]}, ${inputs[12]}, ${inputs[13]}, channel_axis=${inputs[14]})
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Slic_Segmentation',
      prepareInput:  prepareInputRGB,
      inputs: ['', 'input_image', '100', '10.0', '10', '0.0', 'None', 'None', 'True', '0.5', '3.0', 'False', '1', 'None', '-1'],
      returnVar: 'slic_segmentation_output',
      execTest: (inputs: any[], returnVar: any) => `from skimage.segmentation import slic
import numpy as np
expected = slic(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, ${inputs[9]}, ${inputs[10]}, ${inputs[11]}, ${inputs[12]}, ${inputs[13]}, channel_axis=${inputs[14]})
print(np.array_equal(expected, ${returnVar}))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.segmentation import slic
${prepareInput}
${returnVar} = slic(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, ${inputs[9]}, ${inputs[10]}, ${inputs[11]}, ${inputs[12]}, ${inputs[13]}, channel_axis=${inputs[14]})
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Slic_Segmentation',
      prepareInput:  prepareInputGBR,
      inputs: ['', 'input_image', '100', '10.0', '10', '0.0', 'None', 'None', 'True', '0.5', '3.0', 'False', '1', 'None', '-1'],
      returnVar: 'slic_segmentation_output',
      execTest: (inputs: any[], returnVar: any) => `from skimage.segmentation import slic
import numpy as np
expected = slic(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, ${inputs[9]}, ${inputs[10]}, ${inputs[11]}, ${inputs[12]}, ${inputs[13]}, channel_axis=${inputs[14]})
print(np.array_equal(expected, ${returnVar}))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.segmentation import slic
${prepareInput}
${returnVar} = slic(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, ${inputs[9]}, ${inputs[10]}, ${inputs[11]}, ${inputs[12]}, ${inputs[13]}, channel_axis=${inputs[14]})
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
