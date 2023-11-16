import { nodeExecCheck } from '../execution';
import { loadNode } from '../loader';

interface testNodeData {
  jsonPath: string;
  nodeName: string;
  inputs: string[];
  outputs: string[];
  expected: string;
}

describe('Code Execution of node kornia adjustment', () => {
  const testData: testNodeData[] = [
    {
      jsonPath: 'src/NodeTypeExtension/kornia/adjustment.json',
      nodeName: 'Add_Weighted',
      inputs: [''],
      outputs: ['image'],
      expected: `import kornia as K',
    }
  ];
  test('generate the code of kornia.enhance.add_weighted', async () => {
    const node = loadNode(
      'src/NodeTypeExtension/kornia/adjustment.json',
      'Add_Weighted'
    );

    const inputs = [
      '',
      'torch.tensor([[[[0.5, 0.5], [0.5, 0.5]], [[0.4, 0.4], [0.4, 0.4]], [[0.3, 0.3], [0.3, 0.3]]]])',
      '0.5',
      'torch.tensor([[[[0.25, 0.25],[0.25, 0.25]], [[0.20, 0.20], [0.20, 0.20]], [[0.15, 0.15], [0.15, 0.15]]]])',
      '0.5',
      '1.0',
    ];

    const returnVar = 'image';
    const execTest = `import torch
expected = k.enhance.add_weighted(${inputs[1]}, ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]})
print(torch.equal(expected, ${returnVar}['value']) and 
  expected == tensor([[[[1.3750, 1.3750],
          [1.3750, 1.3750]],
          [[1.3000, 1.3000],
          [1.3000, 1.3000]],
          [[1.2250, 1.2250],
          [1.2250, 1.2250]]]]) and
    expected.dtype == torch.float32 and
      expected.device == 'cpu' if returnVar.device == 'cpu' else 'gpu')`;
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

  test('generate the code of kornia.enhance.adjust_brightness', async () => {
    const node = loadNode(
      'src/NodeTypeExtension/kornia/adjustment.json',
      'Adjust_Brightness'
    );

    const inputs = [
      '',
      'torch.tensor([[[[0.5, 0.5], [0.5, 0.5]], [[0.4, 0.4], [0.4, 0.4]], [[0.3, 0.3], [0.3, 0.3]]]])',
      '0.5',
    ];

    const returnVar = 'image';
    const execTest = `import torch
      from torch import Tensor
expected = k.enhance.adjust_brightness(${inputs[1]}, ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']) and 
  expected == tensor([[[[1.0000, 1.0000], 
    [1.0000, 1.0000]], 
    [[0.9000, 0.9000], 
    [0.9000, 0.9000]], 
    [[0.8000, 0.8000], 
    [0.8000, 0.8000]]]]) and
    expected.dtype == torch.float32 and
      expected.device == 'cpu' if returnVar.device == 'cpu' else 'gpu')`;
    const outputs = [`${execTest}`, returnVar];

    const expectedCode = `import kornia as K
${returnVar} = K.enhance.adjust_brightness(${inputs[1]}, ${inputs[2]})
${returnVar} = {
  'value': ${returnVar},
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

  test('generate the code of kornia.enhance.adjust_contrast', async () => {
    const node = loadNode(
      'src/NodeTypeExtension/kornia/adjustment.json',
      'Adjust_Contrast'
    );

    const inputs = [
      '',
      'torch.tensor([[[[0.5, 0.5], [0.5, 0.5]], [[0.4, 0.4], [0.4, 0.4]], [[0.3, 0.3], [0.3, 0.3]]]])',
      '0.5',
      'True',
    ];

    const returnVar = 'image';
    const execTest = `import torch
      from torch import Tensor
expected = k.enhance.adjust_contrast(${inputs[1]}, ${inputs[2]}, ${inputs[3]})
print(torch.equal(expected, ${returnVar}['value']) and 
  expected == tensor([[[[0.2500, 0.2500],
          [0.2500, 0.2500]],
          [[0.2000, 0.2000],
          [0.2000, 0.2000]],
          [[0.1500, 0.1500],
          [0.1500, 0.1500]]]]) and
    expected.dtype == torch.float32 and
      expected.device == 'cpu' if returnVar.device == 'cpu' else 'gpu')`;
    const outputs = [`${execTest}`, returnVar];

    const expectedCode = `import kornia as K
${returnVar} = K.enhance.adjust_contrast(${inputs[1]}, ${inputs[2]}, ${inputs[3]})
${returnVar} = {
  'value': ${returnVar},
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

  test('generate the code of kornia.enhance.adjust_contrast_with_mean_subtraction', async () => {
    const node = loadNode(
      'src/NodeTypeExtension/kornia/adjustment.json',
      'Adjust_Contrast_With_Mean_subtraction'
    );

    const inputs = [
      '',
      'torch.tensor([[[[0.5, 0.5], [0.5, 0.5]], [[0.4, 0.4], [0.4, 0.4]], [[0.3, 0.3], [0.3, 0.3]]]])',
      '0.5',
    ];

    const returnVar = 'image';
    const execTest = `import torch
      from torch import Tensor
expected = k.enhance.adjust_contrast_with_mean_subtraction(${inputs[1]}, ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']) and 
  expected == tensor([[[[0.4593, 0.4593],
          [0.4593, 0.4593]],
          [[0.4093, 0.4093],
          [0.4093, 0.4093]],
          [[0.3593, 0.3593],
          [0.3593, 0.3593]]]]) and
    expected.dtype == torch.float32 and
      expected.device == 'cpu' if returnVar.device == 'cpu' else 'gpu')`;
    const outputs = [`${execTest}`, returnVar];

    const expectedCode = `import kornia as K
${returnVar} = K.enhance.adjust_contrast_with_mean_subtraction(${inputs[1]}, ${inputs[2]})
${returnVar} = {
  'value': ${returnVar},
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

  test('generate the code of kornia.enhance.adjust_gamma', async () => {
    const node = loadNode(
      'src/NodeTypeExtension/kornia/adjustment.json',
      'Adjust_Gamma'
    );

    const inputs = [
      '',
      'torch.tensor([[[[0.5, 0.5], [0.5, 0.5]], [[0.4, 0.4], [0.4, 0.4]], [[0.3, 0.3], [0.3, 0.3]]]])',
      '2.0',
      '2.0',
    ];

    const returnVar = 'image';
    const execTest = `import torch
      from torch import Tensor
expected = k.enhance.adjust_gamma(${inputs[1]}, ${inputs[2]}, ${inputs[3]})
print(torch.equal(expected, ${returnVar}['value']) and 
  expected == tensor([[[[0.5000, 0.5000],
          [0.5000, 0.5000]],
          [[0.3200, 0.3200],
          [0.3200, 0.3200]],
          [[0.1800, 0.1800],
          [0.1800, 0.1800]]]]) and
    expected.dtype == torch.float32 and
      expected.device == 'cpu' if returnVar.device == 'cpu' else 'gpu')`;
    const outputs = [`${execTest}`, returnVar];

    const expectedCode = `import kornia as K
${returnVar} = K.enhance.adjust_gamma(${inputs[1]}, ${inputs[2]}, ${inputs[3]})
${returnVar} = {
  'value': ${returnVar},
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

  test('generate the code of kornia.enhance.adjust_hue', async () => {
    const node = loadNode(
      'src/NodeTypeExtension/kornia/adjustment.json',
      'Adjust_Hue'
    );

    const inputs = [
      '',
      'torch.tensor([[[[0.5, 0.5], [0.5, 0.5]], [[0.4, 0.4], [0.4, 0.4]], [[0.3, 0.3], [0.3, 0.3]]]])',
      '3.141516',
    ];

    const returnVar = 'image';
    const execTest = `import torch
      from torch import Tensor
expected = k.enhance.adjust_hue(${inputs[1]}, ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']) and 
  expected == tensor([[[[0.3000, 0.3000],
        [0.3000, 0.3000]],
        [[0.4000, 0.4000],
        [0.4000, 0.4000]],
        [[0.5000, 0.5000],
        [0.5000, 0.5000]]]]) and
    expected.dtype == torch.float32 and
      expected.device == 'cpu' if returnVar.device == 'cpu' else 'gpu')`;
    const outputs = [`${execTest}`, returnVar];

    const expectedCode = `import kornia as K
${returnVar} = K.enhance.adjust_hue(${inputs[1]}, ${inputs[2]})
${returnVar} = {
  'value': ${returnVar},
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

  test('generate the code of kornia.enhance.adjust_saturation', async () => {
    const node = loadNode(
      'src/NodeTypeExtension/kornia/adjustment.json',
      'Adjust_Saturation'
    );

    const inputs = [
      '',
      'torch.tensor([[[[0.5, 0.5], [0.5, 0.5]], [[0.4, 0.4], [0.4, 0.4]], [[0.3, 0.3], [0.3, 0.3]]]])',
      '2.',
    ];

    const returnVar = 'image';
    const execTest = `import torch
      from torch import Tensor
expected = k.enhance.adjust_hue(${inputs[1]}, ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']) and 
  expected == tensor([[[[0.5000, 0.5000],
          [0.5000, 0.5000]],
          [[0.3000, 0.3000],
          [0.3000, 0.3000]],
          [[0.1000, 0.1000],
          [0.1000, 0.1000]]]]) and
    expected.dtype == torch.float32 and
      expected.device == 'cpu' if returnVar.device == 'cpu' else 'gpu')`;
    const outputs = [`${execTest}`, returnVar];

    const expectedCode = `import kornia as K
${returnVar} = K.enhance.adjust_saturation(${inputs[1]}, ${inputs[2]}, ${inputs[3]})
${returnVar} = {
  'value': ${returnVar},
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

  test('generate the code of kornia.enhance.adjust_sigmoid', async () => {
    const node = loadNode(
      'src/NodeTypeExtension/kornia/adjustment.json',
      'Adjust_Sigmoid'
    );

    const inputs = [
      '',
      'torch.tensor([[[[0.5, 0.5], [0.5, 0.5]], [[0.4, 0.4], [0.4, 0.4]], [[0.3, 0.3], [0.3, 0.3]]]])',
      '0.7',
      '10',
      'True',
    ];

    const returnVar = 'image';
    const execTest = `import torch
      from torch import Tensor
expected = k.enhance.adjust_sigmoid(${inputs[1]}, ${inputs[2]}, ${inputs[3]}, ${inputs[4]})
print(torch.equal(expected, ${returnVar}['value']) and 
  expected == tensor([[[[0.8808, 0.8808],
          [0.8808, 0.8808]],
          [[0.9526, 0.9526],
          [0.9526, 0.9526]],
          [[0.9820, 0.9820],
          [0.9820, 0.9820]]]]) and
    expected.dtype == torch.float32 and
      expected.device == 'cpu' if returnVar.device == 'cpu' else 'gpu')`;
    const outputs = [`${execTest}`, returnVar];

    const expectedCode = `import kornia as K
${returnVar} = K.enhance.adjust_sigmoid(${inputs[1]}, ${inputs[2]}, ${inputs[3]}, ${inputs[4]})
${returnVar} = {
  'value': ${returnVar},
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

  test('generate the code of kornia.enhance.adjust_log', async () => {
    const node = loadNode(
      'src/NodeTypeExtension/kornia/adjustment.json',
      'Adjust_Log'
    );

    const inputs = [
      '',
      'torch.tensor([[[[0.5, 0.5], [0.5, 0.5]], [[0.4, 0.4], [0.4, 0.4]], [[0.3, 0.3], [0.3, 0.3]]]])',
      '0.7',
      'True',
      'True',
    ];

    const returnVar = 'image';
    const execTest = `import torch
      from torch import Tensor
expected = k.enhance.adjust_log(${inputs[1]}, ${inputs[2]}, ${inputs[3]}, ${inputs[4]})
print(torch.equal(expected, ${returnVar}['value']) and 
  expected == tensor([[[[0.2899, 0.2899],
          [0.2899, 0.2899]],
          [[0.2237, 0.2237],
          [0.2237, 0.2237]],
          [[0.1618, 0.1618],
          [0.1618, 0.1618]]]]) and
    expected.dtype == torch.float32 and
      expected.device == 'cpu' if returnVar.device == 'cpu' else 'gpu')`;
    const outputs = [`${execTest}`, returnVar];

    const expectedCode = `import kornia as K
${returnVar} = K.enhance.adjust_log(${inputs[1]}, ${inputs[2]}, ${inputs[3]}, ${inputs[4]})
${returnVar} = {
  'value': ${returnVar},
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

  test('generate the code of kornia.enhance.invert', async () => {
    const node = loadNode(
      'src/NodeTypeExtension/kornia/adjustment.json',
      'Invert'
    );

    const inputs = [
      '',
      'torch.tensor([[[[0.5, 0.5], [0.5, 0.5]], [[0.4, 0.4], [0.4, 0.4]], [[0.3, 0.3], [0.3, 0.3]]]])',
    ];

    const returnVar = 'image';
    const execTest = `import torch
      from torch import Tensor
expected = k.enhance.invert(${inputs[1]}, ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']) and 
  expected == tensor([[[[0.5000, 0.5000],
          [0.5000, 0.5000]],
          [[0.6000, 0.6000],
          [0.6000, 0.6000]],
          [[0.7000, 0.7000],
          [0.7000, 0.7000]]]]) and
    expected.dtype == torch.float32 and
      expected.device == 'cpu' if returnVar.device == 'cpu' else 'gpu')`;
    const outputs = [`${execTest}`, returnVar];

    const expectedCode = `import kornia as K
${returnVar} = K.enhance.invert(${inputs[1]}, ${inputs[2]})
${returnVar} = {
  'value': ${returnVar},
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

  test('generate the code of kornia.enhance.posterize', async () => {
    const node = loadNode(
      'src/NodeTypeExtension/kornia/adjustment.json',
      'Posterize'
    );

    const inputs = [
      '',
      'torch.tensor([[[[0.5, 0.5], [0.5, 0.5]], [[0.4, 0.4], [0.4, 0.4]], [[0.3, 0.3], [0.3, 0.3]]]])',
      '2',
    ];

    const returnVar = 'image';
    const execTest = `import torch
      from torch import Tensor
expected = k.enhance.posterize(${inputs[1]}, ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']) and 
  expected == tensor([[[[0.2510, 0.2510],
          [0.2510, 0.2510]],
          [[0.2510, 0.2510],
          [0.2510, 0.2510]],
          [[0.2510, 0.2510],
          [0.2510, 0.2510]]]]) and
    expected.dtype == torch.float32 and
      expected.device == 'cpu' if returnVar.device == 'cpu' else 'gpu')`;
    const outputs = [`${execTest}`, returnVar];

    const expectedCode = `import kornia as K
${returnVar} = K.enhance.posterize(${inputs[1]}, ${inputs[2]})
${returnVar} = {
  'value': ${returnVar},
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

  test('generate the code of kornia.enhance.sharpness', async () => {
    const node = loadNode(
      'src/NodeTypeExtension/kornia/adjustment.json',
      'Sharpness'
    );

    const inputs = [
      '',
      'torch.tensor([[[[0.0, 0.5, 1.0], [0.0, 0.5, 1.0], [0.0, 0.5, 1.0]],[[1.0, 0.5, 0.0], [1.0, 0.5, 0.0], [1.0, 0.5, 0.0]], [[0.5, 1.0, 0.5], [0.5, 1.0, 0.5], [0.5, 1.0, 0.5]]]]))',
      '0.1',
    ];

    const returnVar = 'image';
    const execTest = `import torch
      from torch import Tensor
expected = k.enhance.sharpness(${inputs[1]}, ${inputs[2]})
print(torch.equal(expected, ${returnVar}['value']) and 
  expected == tensor([[[[0.0000, 0.5000, 1.0000],
          [0.0000, 0.5000, 1.0000],
          [0.0000, 0.5000, 1.0000]],
          [[1.0000, 0.5000, 0.0000],
          [1.0000, 0.5000, 0.0000],
          [1.0000, 0.5000, 0.0000]],
          [[0.5000, 1.0000, 0.5000],
          [0.5000, 0.7923, 0.5000],
          [0.5000, 1.0000, 0.5000]]]]) and
    expected.dtype == torch.float32 and
      expected.device == 'cpu' if returnVar.device == 'cpu' else 'gpu')`;
    const outputs = [`${execTest}`, returnVar];

    const expectedCode = `import kornia as K
${returnVar} = K.enhance.sharpness(${inputs[1]}, ${inputs[2]})
${returnVar} = {
  'value': ${returnVar},
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

  test('generate the code of kornia.enhance.solarize', async () => {
    const node = loadNode(
      'src/NodeTypeExtension/kornia/adjustment.json',
      'Solarize'
    );

    const inputs = [
      '',
      'torch.tensor([[[[0.0, 0.5, 1.0], [0.0, 0.5, 1.0], [0.0, 0.5, 1.0]],[[1.0, 0.5, 0.0], [1.0, 0.5, 0.0], [1.0, 0.5, 0.0]], [[0.5, 1.0, 0.5], [0.5, 1.0, 0.5], [0.5, 1.0, 0.5]]]]))',
      '0.5',
      '0.2',
    ];

    const returnVar = 'image';
    const execTest = `import torch
      from torch import Tensor
expected = k.enhance.solarize(${inputs[1]}, ${inputs[2]}, ${inputs[3]})
print(torch.equal(expected, ${returnVar}['value']) and 
  expected == tensor([[[[0.2000, 0.3000, 0.0000],
          [0.2000, 0.3000, 0.0000],
          [0.2000, 0.3000, 0.0000]],
          [[0.0000, 0.3000, 0.2000],
          [0.0000, 0.3000, 0.2000],
          [0.0000, 0.3000, 0.2000]],
          [[0.3000, 0.0000, 0.3000],
          [0.3000, 0.0000, 0.3000],
          [0.3000, 0.0000, 0.3000]]]]) and
    expected.dtype == torch.float32 and
      expected.device == 'cpu' if returnVar.device == 'cpu' else 'gpu')`;
    const outputs = [`${execTest}`, returnVar];

    const expectedCode = `import kornia as K
${returnVar} = K.enhance.solarize(${inputs[1]}, ${inputs[2]}, ${inputs[3]})
${returnVar} = {
  'value': ${returnVar},
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

    test.each(testData)(
      'generate the code from the node $nodeName in $jsonPath',
      ({ jsonPath, nodeName, inputs, outputs, expected }) => {
        const node = loadNode(jsonPath, nodeName);
        const result = generator.nodeSourceGeneration(node, inputs, outputs);
        expect(result).toBe(expected);
      }
    );
});
