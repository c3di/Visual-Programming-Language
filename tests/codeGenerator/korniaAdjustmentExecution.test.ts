import { nodeExecCheck } from '../execution';
import { loadNode } from '../loader';

describe('Code Execution of node kornia adjustment', () => {
  test('generate the code of kornia.enhance.add_weighted', async () => {
    const node = loadNode(
      'src/NodeTypeExtension/kornia/adjustment.json',
      'Add_Weighted'
    );

    const inputs = [
      '',
      'torch.rand(1, 3, 5, 5)',
      '0.5',
      'torch.rand(1, 3, 5, 5)',
      '0.5',
      '1.0',
    ];

    const returnVar = 'image';
    const execTest = `import torch
expected = k.enhance.add_weighted(${inputs[1]}, ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]})
print(torch.equal(expected, ${returnVar}['value']) and expected.shape == torch.Size([1, 3, 5, 5]) and expected.dtype == torch.float32 and expected.device == 'cpu' if returnVar.device == 'cpu' else expected.device == 'gpu')`;
    const outputs = [`${execTest}`, returnVar];

    const expectedCode = `import kornia as K
${returnVar} = K.enhance.add_weighted(${inputs[1]}, ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb', 
    'channelOrder': 'channelFirst',
    'isMiniBatched': True, 
    'intensityRange': '0-1', 
    'device': 'cpu' 
  }
}
${execTest}`;

    await nodeExecCheck(node, inputs, outputs, expectedCode);
  }, 100000);

  test('generate the code of kornia.enhance.adjust_Brightness', async () => {
    const node = loadNode(
      'src/NodeTypeExtension/kornia/adjustment.json',
      'Adjust_Brightness'
    );

    const inputs = ['', 'torch.ones(1, 1, 2, 2)', '1.'];

    const returnVar = 'image';
    const execTest = `import torch
      from torch import Tensor
expected = k.enhance.adjust_brightness(${inputs[1]}, ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']) and expected == tensor([[[[1., 1.],[1., 1.]]]])`;
    const outputs = [`${execTest}`, returnVar];

    const expectedCode = `import kornia as K
${returnVar} = K.enhance.adjust_brightness(${inputs[1]}, ${inputs[2]})
${returnVar} = {
  'value': image,
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb',
    'channelOrder': 'channelFirst',
    'isMiniBatched': False,
    'intensityRange': '0-1',
    'device': 'cpu'
  }
}
${execTest}`;

    await nodeExecCheck(node, inputs, outputs, expectedCode);
  }, 100000);

  test('generate the code of kornia.enhance.adjust_Contrast', async () => {
    const node = loadNode(
      'src/NodeTypeExtension/kornia/adjustment.json',
      'Adjust_Contrast'
    );

    const inputs = ['', 'torch.ones(1, 1, 2, 2)', '0.5', 'True'];

    const returnVar = 'image';
    const execTest = `import torch
      from torch import Tensor
expected = k.enhance.adjust_contrast(${inputs[1]}, ${inputs[2]}, ${inputs[3]})
print(torch.equal(expected, ${returnVar}['value']) and expected == tensor([[[[0.5000, 0.5000],[0.5000, 0.5000]]]])`;
    const outputs = [`${execTest}`, returnVar];

    const expectedCode = `import kornia as K
${returnVar} = K.enhance.adjust_contrast(${inputs[1]}, ${inputs[2]}, ${inputs[3]})
${returnVar} = {
  'value': image,
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb',
    'channelOrder': 'channelFirst',
    'isMiniBatched': False,
    'intensityRange': '0-1',
    'device': 'cpu'
  }
}
${execTest}`;

    await nodeExecCheck(node, inputs, outputs, expectedCode);
  }, 100000);
});
