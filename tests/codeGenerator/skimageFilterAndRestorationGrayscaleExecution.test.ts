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

describe('Code Execution of Filter_and_restoration functions with Input Grayscale only', () => {
  const jsonPath = 'src/NodeTypeExtension/sciKitImage/Filter_and_restoration.json';
  const prepareInput = `from skimage import data
from skimage.morphology import disk
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
      nodeName: 'Hysteresis_Threshold',
      prepareInput,
      inputs: ['', 'input_image', '1.5', '2.5'],
      returnVar: 'hysteresis_threshold_output_binary',
      execTest: (inputs: any[], returnVar: any) => `from skimage.filters import apply_hysteresis_threshold
import numpy as np
expected = apply_hysteresis_threshold(input_image['value'], ${inputs[2]}, ${inputs[3]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.filters import apply_hysteresis_threshold
${prepareInput}
${returnVar} = apply_hysteresis_threshold(input_image['value'], ${inputs[2]}, ${inputs[3]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  ${metadataBinary}
}
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Mean_Percentile',
      prepareInput,
      inputs: ['', 'input_image', 'disk(3)', 'None', 'None', '0', '0', '0.0', '1.0'],
      returnVar: 'mean_percentile_output_grayscale',
      execTest: (inputs: any[], returnVar: any) => `from skimage.filters.rank import mean_percentile
import numpy as np
expected = mean_percentile(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.filters.rank import mean_percentile
${prepareInput}
${returnVar} = mean_percentile(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  ${metadataGrayscale}
}
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Mean_Bilateral',
      prepareInput,
      inputs: ['', 'input_image', 'disk(3)', 'None', 'None', '0', '0', '10', '10'],
      returnVar: 'mean_bilateral_output_grayscale',
      execTest: (inputs: any[], returnVar: any) => `from skimage.filters.rank import mean_bilateral
import numpy as np
expected = mean_bilateral(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.filters.rank import mean_bilateral
${prepareInput}
${returnVar} = mean_bilateral(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  ${metadataGrayscale}
}
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Mean',
      prepareInput,
      inputs: ['', 'input_image', 'disk(3)', 'None', 'None', '0', '0', '0'],
      returnVar: 'mean_output_grayscale',
      execTest: (inputs: any[], returnVar: any) => `from skimage.filters.rank import mean
import numpy as np
expected = mean(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.filters.rank import mean
${prepareInput}
${returnVar} = mean(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]})
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
