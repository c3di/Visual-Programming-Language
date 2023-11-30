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
  metadataGrayscale: Metadata;
  metadataBinary: Metadata;
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
input_image = {
  'dataType': 'numpy.ndarray',
  'value': data.camera(),
  'metadata': {
    'colorChannel': 'grayscale',
    'channelOrder': 'none',
    'isMiniBatched': False,
    'intensityRange': '0-255',
    'device': 'cpu'
  }
}`;
  const metadataGrayscale = {
    'colorChannel': 'grayscale',
    'channelOrder': 'none',
    'isMiniBatched': 'False',
    'intensityRange': '0-255',
    'device': 'cpu'
  };
  const metadataBinary = {
    'colorChannel': 'grayscale',
    'channelOrder': 'none',
    'isMiniBatched': 'False',
    'intensityRange': '0-1',
    'device': 'cpu'
  };

  const testData: testNodeData[] = [
    {
      jsonPath,
      nodeName: 'Edge_Operator_Roberts',
      prepareInput,
      metadataGrayscale,
      metadataBinary,
      inputs: ['', 'input_image', 'None'],
      returnVar: 'edge_operator_roberts_output_grayscale',
      execTest: (inputs: any[], returnVar: any) => `from skimage.filters import roberts
import numpy as np
expected = roberts(input_image['value'], ${inputs[2]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs: any[], prepareInput: string, returnVar: any, execTest: (arg0: any, arg1: any) => any) => `from skimage.filters import roberts
import numpy as np
${prepareInput}
${returnVar} = roberts(input_image['value'], ${inputs[2]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  'metadata': {
    'colorChannel': '${metadataGrayscale.colorChannel}',
    'channelOrder': '${metadataGrayscale.channelOrder}',
    'isMiniBatched': ${metadataGrayscale.isMiniBatched},
    'intensityRange': '${metadataGrayscale.intensityRange}',
    'device': '${metadataGrayscale.device}'
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
