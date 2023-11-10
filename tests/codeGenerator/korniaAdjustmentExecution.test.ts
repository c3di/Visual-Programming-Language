import { nodeExecCheck } from '../execution';
import { loadNode } from '../loader';

describe('Code Execution of node kornia adjustment add_weighted', () => {
  test('generate the code of kornia.enhance.add_weighted', async () => {
    const node = loadNode(
      'src/NodeTypeExtension/kornia/adjustment.json',
      'Add_Weighted'
    );

    const inputs = [
      '',
      'torch.rand(1, 1, 5, 5)',
      '0.5',
      'torch.rand(1, 1, 5, 5)',
      '0.5',
      '1.0',
    ];

    const returnVar = 'image';
    const execTest = `import torch
expected = k.enhance.add_weighted(${inputs[1]}, ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]})
print(torch.equal(expected, ${returnVar}['value']) and expected.shape == torch.Size([1, 1, 5, 5]))`;
    const outputs = [`${execTest}`, returnVar];

    const expectedCode = `import kornia as K
${returnVar} = K.enhance.add_weighted(${inputs[1]}, ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]})
${returnVar} = {
  'value': image,
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
});
