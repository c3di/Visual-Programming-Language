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

describe('Code Execution of Filter_and_restoration functions with Input not-a-image only', () => {
  const jsonPath = 'src/NodeTypeExtension/sciKitImage/Filter_and_restoration.json';
  const metadataNotImage = {
    'device': 'cpu'
  };


  const testData: testNodeData[] = [
    {
      jsonPath,
      nodeName: 'Morphology_disk',
      prepareInput: `import numpy as np
input = {
  'dataType': 'integer',
  'value': 3,
  'metadata': {
  'device': 'cpu'
  }
}`,
      metadataNotImage,
      inputs: ['', 'input', 'np.uint8', 'True', 'None'],
      returnVar: 'morphology_disk_output',
      execTest: (inputs, returnVar) => `from skimage.morphology import disk
import numpy as np
expected = disk(input['value'], ${inputs[2]}, strict_radius=${inputs[3]}, decomposition=${inputs[4]})
print(np.array_equal(expected, ${returnVar}['value']))`,
      getExpectedCode: (inputs, prepareInput, returnVar, execTest) => `from skimage.morphology import disk
${prepareInput}
${returnVar} = disk(input['value'], ${inputs[2]}, strict_radius=${inputs[3]}, decomposition=${inputs[4]})
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
