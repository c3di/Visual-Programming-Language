import { nodeExecCheck } from '../execution';
import { loadNode } from '../loader';

type MetadataNotImage = {
  device: string;
};

interface testNodeData {
  jsonPath: string;
  nodeName: string;
  prepareInput: string;
  metadataNotImage: MetadataNotImage;
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

describe('Code Execution of Segmentation.json functions with Input Grayscale only', () => {
  const jsonPath = 'src/NodeTypeExtension/sciKitImage/Segmentation.json';
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
  const metadataNotImage = {
    'device': 'cpu'
  };


  const testData: testNodeData[] = [
    {
      jsonPath,
      nodeName: 'Flood Fill',
      prepareInput,
      metadataNotImage,
      inputs: ['', 'input_image', '(50, 50)', '2', 'None', 'None', 'None', 'False'],
      returnVar: 'flood_fill_output',
      execTest: (inputs, returnVar) => `from skimage.segmentation import flood_fill
import numpy as np
expected = flood_fill(input_image['value'], ${inputs[2]}, ${inputs[3]}, footprint=${inputs[4]}, connectivity=${inputs[5]}, tolerance=${inputs[6]}, in_place=${inputs[7]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs, prepareInput, returnVar, execTest) => `from skimage.segmentation import flood_fill
${prepareInput}
${returnVar} = flood_fill(input_image['value'], ${inputs[2]}, ${inputs[3]}, footprint=${inputs[4]}, connectivity=${inputs[5]}, tolerance=${inputs[6]}, in_place=${inputs[7]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  'metadata': {
    'device': '${ metadataNotImage.device}'
  }
}
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Multi_Otsu_Thresholding',
      prepareInput,
      metadataNotImage,
      inputs: ['', 'input_image', '3', '256', 'None'],
      returnVar: 'multi_otsu_output',
      execTest: (inputs, returnVar) => `from skimage.filters import threshold_multiotsu
import numpy as np
expected = threshold_multiotsu(input_image['value'], ${inputs[2]}, ${inputs[3]}, hist=${inputs[4]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs, prepareInput, returnVar, execTest) => `from skimage.filters import threshold_multiotsu
${prepareInput}
${returnVar} = threshold_multiotsu(input_image['value'], ${inputs[2]}, ${inputs[3]}, hist=${inputs[4]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  'metadata': {
    'device': '${metadataNotImage.device}'
  }
}
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Peak_local_max',
      prepareInput,
      metadataNotImage,
      inputs: ['', 'input_image', '1', 'None', 'None', 'True', 'np.inf', 'None', 'None', 'np.inf', 'np.inf'],
      returnVar: 'peak_local_max_output',
      execTest: (inputs, returnVar) => `from skimage.feature import peak_local_max
import numpy as np
expected = peak_local_max(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, ${inputs[9]}, ${inputs[10]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs, prepareInput, returnVar, execTest) => `from skimage.feature import peak_local_max
${prepareInput}
${returnVar} = peak_local_max(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, ${inputs[9]}, ${inputs[10]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  'metadata': {
    'device': '${metadataNotImage.device}'
  }
}
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Watershed_segmentation',
      prepareInput,
      metadataNotImage,
      inputs: ['', 'input_image', 'None', '1', 'None', 'None', '0.0', 'False'],
      returnVar: 'watershed_output',
      execTest: (inputs, returnVar) => `from skimage.segmentation import watershed
import numpy as np
expected = watershed(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs, prepareInput, returnVar, execTest) => `from skimage.segmentation import watershed
${prepareInput}
${returnVar} = watershed(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  'metadata': {
    'device': '${metadataNotImage.device}'
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
