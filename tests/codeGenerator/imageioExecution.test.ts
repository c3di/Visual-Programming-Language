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
    const execTest = `import torch
expected = io.read_image(${inputs[1]}, ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']) and list(${returnVar}[\'value\'].size())[0]==3)`;
    const outputs = [`${execTest}`, returnVar];

    const expectedCode = `from torchvision import io
from torchvision.io import ImageReadMode
${returnVar} = io.read_image(${inputs[1]}, ${inputs[2]})
image = {'value': image, 'dataType': 'torch.tensor', 'metadata': {'colorChannel': 'rgb', 'channelOrder': 'channelFirst', 'isMiniBatched': False, 'intensityRange': '0-255', 'device': 'cpu'}}
${execTest}`;

    await nodeExecCheck(node, inputs, outputs, expectedCode);
  }, 100000);
});

//todo grayscale
