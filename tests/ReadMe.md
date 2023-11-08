# Exec Node Unit Testing

This README provides an overview of unit testing for the exec node. Unit tests are critical to ensuring that the exec node behaves as expected. We focus on two key aspects:

1. **Code Generation Verification**: 
   - We verify the TypeScript function's generated code string against the expected output derived from a JSON configuration file.

2. **Code Execution Validation**: 
   - We check if the output value adheres to the predefined metadata constraints.
   - We ensure that the actual execution result matches the expected outcome.

Detailed implementation is encapsulated within the `nodeExecCheck` function. We employ the [Jest](https://jestjs.io/) framework to orchestrate our test suites, which involves executing the generated Python code within an Anaconda environment and capturing the results.

## Environment Setup

### Setting up the Node.js Environment for Jest:
- Install [Node.js](https://nodejs.org/en) on your local machine.
- In the root directory of the project, execute `npm install` to install all necessary dependencies, including Jest.

### Setting up the Python Environment:
- Install [Anaconda](https://www.anaconda.com/), a comprehensive package and environment management system.

- Utilize the `environment.yml` file located in the tests directory to create a Python environment.

  Notice: if there is a package issue, please reinstall the packages.

**ToDo**: Implement GitHub Actions to automate the setup of these environments.

## Unit Test Example

Below is an example of a node definition in JSON format:

```json
{
    "read_image": {
        "type": "read_image",
        "category": "function",
        "title": "read_image",
        "tooltip": "Reads a JPEG or PNG image into a 3 dimensional RGB or grayscale Tensor. Optionally converts the image to the desired format. The values of the output tensor are uint8 in [0, 255].",
        "externalImports": "from torchvision import io\nfrom torchvision.io import ImageReadMode",
        "codeGenerator": "function code(inputs, outputs, node, generator) {\n    if (inputs[2] === 'ImageReadMode.RGB')\n        return `${outputs[1]} = io.read_image(${inputs[1]}, ${inputs[2]})\\n${outputs[1]} = {'value': ${outputs[1]}, 'dataType': 'torch.tensor', 'metadata': {'colorChannel': 'rgb', 'channelOrder': 'channelFirst', 'isMiniBatched': False, 'intensityRange': '0-255', 'device': 'cpu'}}\\n${outputs[0]}`;\n    if (inputs[2] === 'ImageReadMode.GRAY')\n        return `${outputs[1]} = io.read_image(${inputs[1]}, ${inputs[2]})\\n${outputs[1]} = {'value': ${outputs[1]}, 'dataType': 'torch.tensor', 'metadata': {'colorChannel': 'rgb', 'channelOrder': 'channelFirst', 'isMiniBatched': False, 'intensityRange': '0-255', 'device': 'cpu'}}\\n${outputs[0]}`;\n}",
        "inputs": {
            "execIn": {
                "title": "execIn",
                "tooltip": "execIn",
                "dataType": "exec",
                "showWidget": false,
                "showTitle": false
            },
            "path": {
                "title": "path",
                "dataType": "string",
                "tooltip": "path(str) - path of the JPEG or PNG image."
            },
            "mode": {
                "title": "mode",
                "dataType": "imageio.ImageReadMode",
                "default": "ImageReadMode.UNCHANGED",
                "tooltip": "mode(ImageReadMode) - The read mode used for optionally converting the image. Default: ImageReadMode.UNCHANGED."
            }
        },
        "outputs": {
            "execOut": {
                "title": "execOut",
                "tooltip": "execOut",
                "dataType": "exec",
                "showWidget": false,
                "showTitle": false
            },
            "image": {
                "title": "image",
                "dataType": "image",
                "defaultValue": {
                    "dataType": "torch.tensor"
                },
                "tooltip": "{dataType: torch.tensor, value, layout: [chw], colorMode: [rgb, grayscale], intensityRange: 0-255' device: cpu}"
            }
        }
    }
}
```

Especially see the inputs, outputs, and code generator. Here is a corresponding unit test for the given example:

```typescript
describe('Code Execution of node', () => {
  test('generate the code of torchvision.io.read_image', async () => {
    // Load the node definition for 'read_image' from a JSON configuration file.
    const node = loadNode('src/NodeTypeExtension/imageio.json', 'read_image');
    // Create values for each input of the node. 
    const inputs = [
      '',
      '"./tests/codeGenerator/data/lena.png"',
      'ImageReadMode.RGB',
    ];
    const returnVar = 'image';
    // Create the Python unit test for execution. At the end, the result of the test should be printed out as a boolean value to be captured.
    const execTest = `import torch
expected = io.read_image(${inputs[1]}, ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']) and list(${returnVar}[\'value\'].size())[0]==3)`;
    // Create values for each output of the node. The Python unit test string will be the value for exec type output, which indicates the code to execute.
    const outputs = [`${execTest}`, returnVar];
	// Create the multiple line expected python code
    const expectedCode = `from torchvision import io
from torchvision.io import ImageReadMode
${returnVar} = io.read_image(${inputs[1]}, ${inputs[2]})
image = {'value': image, 'dataType': 'torch.tensor', 'metadata': {'colorChannel': 'rgb', 'channelOrder': 'channelFirst', 'isMiniBatched': False, 'intensityRange': '0-255', 'device': 'cpu'}}
${execTest}`;
    // run the check function
    await nodeExecCheck(node, inputs, outputs, expectedCode);
  });
});
```

## Running Unit Tests

To execute the unit tests, follow these simple steps:

0. Set the new path of `anacondaPath` at line 13 in `execution.ts` in the tests folder. **ToDo** will be replaced by auto search.

1. Open your command line interface (CLI) or terminal.
2. Navigate to the root directory of your project where your `package.json` file is located.
3. Run the following command:

   ```sh
   npm run jest
   ```

This will trigger Jest to run all the unit tests defined in your project. You'll be able to see the output directly in your CLI, where each test will be reported as passed or failed along with any relevant error messages to help diagnose failed cases.

### What to Expect:

- **Test Summary**: After all tests have been completed, a summary will display the total number of tests, along with the number of tests that passed, failed, or were skipped.
- **Error Reporting**: For any failed tests, detailed error reports will be provided to help you identify and fix issues.
