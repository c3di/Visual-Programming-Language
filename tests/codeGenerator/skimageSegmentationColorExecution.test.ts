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

describe('Code Execution of Segmentation.json functions with Input Color only', () => {
  const jsonPath = 'src/NodeTypeExtension/sciKitImage/Segmentation.json';
  const prepareInputRGB = `from skimage import data
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
}`;
const prepareInputGBR = `from skimage import data
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
}`;

  const testData: testNodeData[] = [
    {
      jsonPath,
      nodeName: 'Quickshift_Segmentation',
      prepareInput:  prepareInputRGB,
      inputs: ['', 'input_image', '1.0', '5.0', '10.0', 'False', '0.0', 'True', '42', '-1'],
      returnVar: 'quickshift_segmentation_output',
      execTest: (inputs: any[], returnVar: any) => `from skimage.segmentation import quickshift
import numpy as np
expected = quickshift(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, channel_axis=${inputs[9]})
print(np.array_equal(expected, ${returnVar}))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.segmentation import quickshift
${prepareInput}
${returnVar} = quickshift(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, channel_axis=${inputs[9]})
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Quickshift_Segmentation',
      prepareInput:  prepareInputGBR,
      inputs: ['', 'input_image', '1.0', '5.0', '10.0', 'False', '0.0', 'True', '42', '-1'],
      returnVar: 'quickshift_segmentation_output',
      execTest: (inputs: any[], returnVar: any) => `from skimage.segmentation import quickshift
import numpy as np
expected = quickshift(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, channel_axis=${inputs[9]})
print(np.array_equal(expected, ${returnVar}))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.segmentation import quickshift
${prepareInput}
${returnVar} = quickshift(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, channel_axis=${inputs[9]})
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
