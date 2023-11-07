/**
 * Unit Tests for the exec node
 *
 * There are two main aspects we are testing for the exec node:
 *
 * 1. Code Generation Verification in Node.js Environment
 *    Verify that the code string generated for typescript function from the json file in the node.js environment is as expected.
 *
 * 2. Code Execution Validation in Python Environment
 *    - The generated code string is executed in a Python environment, and the tests here perform two checks:
 *      a. Validate that the output value is compatible with the specified metadata.
 *      b. Confirm that the execution result matches the expected outcome.
 *
 * Jest Integration:
 * - Jest is used to define and run the test suites, capturing the printed results from the Python tests for validation.
 *
 * Test Example:
 * ```javascript
 * test('generate the code of torchvision.io.read_image', async () => {
 *   // Load the node definition for 'read_image' from a JSON configuration file.
 *   const node = loadNode('src/NodeTypeExtension/imageio.json', 'read_image');
 *
 *   // Set up the inputs and the expected variable to be returned by the node and the working directory is the root directory.
 *   const inputs = ['', '"./tests/codeGenerator/data/lena.png"', 'ImageReadMode.RGB'];
 *   const returnVar = 'image';
 *
 *   // Create the Python code string that will be used to test the execution. At the end of the code, the result of the test is printed out as a boolean value to be captured.
 *   const execTest = `expected = io.read_image(${inputs[1]}, ${inputs[2]})\\nprint(expected == ${returnVar}['value'] and list(${returnVar}['value'].size())[0]==3)`;
 *
 *   // Setup the outputs array for the node. The Python unit test string should be the first element in the outputs array.
 *   const outputs = [`${execTest}`, returnVar];
 *
 *   // Define what the expected output code should be.
 *   const expectedCode = `from torchvision import io\\nfrom torchvision.io import ImageReadMode\\n${returnVar} = io.read_image(${inputs[1]}, ${inputs[2]})\\nimage = {'value': image, 'dataType': 'torch.tensor', 'metadata': {'colorChannel': 'rgb', 'channelOrder': 'channelFirst', 'isMiniBatched': False, 'intensityRange': '0-255', 'device': 'cpu'}}\\n${execTest}`;
 *
 *   await nodeExecCheck(node, inputs, outputs, expectedCode);
 *
 * });
 * ```
 */

import { nodeExecCheck } from '../execution';
import { loadNode } from '../loader';

describe('Code Execution of node', () => {
  test('generate the code of torchvision.io.read_image', async () => {
    const node = loadNode('src/NodeTypeExtension/imageio.json', 'read_image');
    const inputs = [
      '',
      '"./tests/codeGenerator/data/lena.png"',
      'ImageReadMode.RGB',
    ];
    const returnVar = 'image';
    const execTest = `import torch\nexpected = io.read_image(${inputs[1]}, ${inputs[2]})\nprint(torch.equal(expected, ${returnVar}['value']) and list(${returnVar}['value'].size())[0]==3)`;
    const outputs = [`${execTest}`, returnVar];
    const expectedCode = `from torchvision import io\nfrom torchvision.io import ImageReadMode\n${returnVar} = io.read_image(${inputs[1]}, ${inputs[2]})\nimage = {'value': image, 'dataType': 'torch.tensor', 'metadata': {'colorChannel': 'rgb', 'channelOrder': 'channelFirst', 'isMiniBatched': False, 'intensityRange': '0-255', 'device': 'cpu'}}\n${execTest}`;
    await nodeExecCheck(node, inputs, outputs, expectedCode);
  }, 100000);
});

//todo grayscale
