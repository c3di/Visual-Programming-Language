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

describe('Code Execution of Edge_and_Lines.json functions with Input Grayscale only', () => {
  const jsonPath = 'src/NodeTypeExtension/sciKitImage/Edge_and_Lines.json';
  const prepareInput = `from skimage import data
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
  const metadataBinary = `'metadata': {
    'colorChannel': 'grayscale',
    'channelOrder': 'none',
    'isMiniBatched': False,
    'intensityRange': '0-1',
    'device': 'cpu'
  }`;
  const metadataGrayscale = `'metadata': {
    'colorChannel': 'grayscale',
    'channelOrder': 'none',
    'isMiniBatched': False,
    'intensityRange': '0-255',
    'device': 'cpu'
  }`;

  const testData: testNodeData[] = [
    {
      jsonPath,
      nodeName: 'Ridge_operators',
      prepareInput,
      inputs: ['', 'input_image', 'np.arange(1, 10, 2)', 'None', 'True', "'reflect'", '0'],
      returnVar: 'ridge_operators_output_grayscale',
      execTest: (inputs: any[], returnVar: any) => `from skimage.filters import meijering
import numpy as np
expected = meijering(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.filters import meijering
${prepareInput}
${returnVar} = meijering(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  ${metadataGrayscale}
}
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Canny_edge_detector',
      prepareInput,
      inputs: ['', 'input_image', '1.0', 'None', 'None', 'None', 'False', "'constant'", '0.0'],
      returnVar: 'canny_edge_detector_output_binary',
      execTest: (inputs: any[], returnVar: any) => `from skimage.feature import canny
import numpy as np
expected = canny(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, mode=${inputs[7]}, cval=${inputs[8]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.feature import canny
${prepareInput}
${returnVar} = canny(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, mode=${inputs[7]}, cval=${inputs[8]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  ${metadataBinary}
}
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Edge_Operator_Sobel',
      prepareInput,
      inputs: ['', 'input_image', 'None', 'None', "'reflect'", '0.0'],
      returnVar: 'edge_operator_sobel_output_grayscale',
      execTest: (inputs: any[], returnVar: any) => `from skimage.filters import sobel
import numpy as np
expected = sobel(input_image['value'], ${inputs[2]}, axis=${inputs[3]}, mode=${inputs[4]}, cval=${inputs[5]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.filters import sobel
${prepareInput}
${returnVar} = sobel(input_image['value'], ${inputs[2]}, axis=${inputs[3]}, mode=${inputs[4]}, cval=${inputs[5]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  ${metadataGrayscale}
}
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Edge_Operator_Roberts',
      prepareInput,
      inputs: ['', 'input_image', 'None'],
      returnVar: 'edge_operator_roberts_output_grayscale',
      execTest: (inputs: any[], returnVar: any) => `from skimage.filters import roberts
import numpy as np
expected = roberts(input_image['value'], ${inputs[2]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.filters import roberts
${prepareInput}
${returnVar} = roberts(input_image['value'], ${inputs[2]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  ${metadataGrayscale}
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
