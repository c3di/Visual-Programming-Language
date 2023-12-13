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

describe('Code Execution of Filter_and_restoration functions with not-a-image Input only', () => {
  const jsonPath = 'src/NodeTypeExtension/sciKitImage/Filter_and_restoration.json';


  const testData: testNodeData[] = [
    {
      jsonPath,
      nodeName: 'Morphology_disk',
      prepareInput: `import numpy as np`,
      inputs: ['', '3', 'np.uint8', 'True', 'None'],
      returnVar: 'morphology_disk_output',
      execTest: (inputs, returnVar) => `from skimage.morphology import disk
import numpy as np
expected = disk(${inputs[1]}, ${inputs[2]}, strict_radius=${inputs[3]}, decomposition=${inputs[4]})
print(np.array_equal(expected, ${returnVar}))`,
      getExpectedCode: (inputs, prepareInput, returnVar, execTest) => `from skimage.morphology import disk
${prepareInput}
${returnVar} = disk(${inputs[1]}, ${inputs[2]}, strict_radius=${inputs[3]}, decomposition=${inputs[4]})
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
