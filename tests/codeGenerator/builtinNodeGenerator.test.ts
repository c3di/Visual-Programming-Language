import path from 'path';
import { Node } from '../../src/editor';
import { pythonGenerator } from '../../src/editor/generators';
import { loadNode } from '../loader';

const rootDir = process.cwd();

describe('nodeGenerator of reroute node', () => {
  const generator = pythonGenerator;
  let node: Node;

  beforeEach(() => {
    node = loadNode(
      path.join(rootDir, 'src/editor/extension/builtin.json'),
      'reroute'
    );
  });

  test('generate the code when used as the exec node', () => {
    const inputs = [''];
    const expected = 'outputValue';
    const outputs = [expected];
    for (const id in node.data.inputs ?? {}) {
      node.data.inputs[id].dataType = 'exec';
    }
    for (const id in node.data.outputs ?? {}) {
      node.data.outputs[id].dataType = 'exec';
    }
    const result = generator.nodeSourceGeneration(node, inputs, outputs);
    expect(result).toBe(expected);
  });

  test('generate the code when used as the value node', () => {
    const inputs = ['otherInput'];
    const outputs = ['outputVar'];
    const expected = 'outputVar = otherInput';
    const result = generator.nodeSourceGeneration(node, inputs, outputs);
    expect(result).toBe(expected);
  });
});

interface testNodeData {
  jsonPath: string;
  nodeName: string;
  inputs: string[];
  outputs: string[];
  expected: string;
}

describe('nodeGenerator', () => {
  const generator = pythonGenerator;

  const testData: testNodeData[] = [
    {
      jsonPath: 'src/editor/extension/flowControl.json',
      nodeName: 'main',
      inputs: [''],
      outputs: ['otherCodeString'],
      expected: 'otherCodeString',
    },
    {
      jsonPath: 'src/editor/extension/flowControl.json',
      nodeName: 'sequence',
      inputs: [''],
      outputs: ['codeString1', 'codeString2', 'codeString3'],
      expected: 'codeString1\ncodeString2\ncodeString3',
    },
    {
      jsonPath: 'src/editor/extension/flowControl.json',
      nodeName: 'if else',
      inputs: ['', 'True'],
      outputs: ['codeStringWhenTrue', 'codeStringWhenFalse\nSecondLine'],
      expected: `if True:\n${generator.indent + 'codeStringWhenTrue'}\nelse:\n${
        generator.indent +
        'codeStringWhenFalse' +
        '\n' +
        generator.indent +
        'SecondLine'
      }`,
    },
    {
      jsonPath: 'src/editor/extension/flowControl.json',
      nodeName: 'if else',
      inputs: ['', 'var'],
      outputs: ['', ''],
      expected: `if var:\n${generator.indent + 'pass'}`,
    },
    {
      jsonPath: 'src/editor/extension/flowControl.json',
      nodeName: 'for each loop',
      inputs: ['', '["1","2","3"]'],
      outputs: [
        'firstLine\nsecondLine',
        'idx',
        'element',
        'completeFirst\ncompleteSecond',
      ],
      expected: `for idx, element in enumerate(["1","2","3"]):\n${
        generator.indent + 'firstLine' + '\n' + generator.indent + 'secondLine'
      }\ncompleteFirst\ncompleteSecond`,
    },
    {
      jsonPath: 'src/editor/extension/flowControl.json',
      nodeName: 'for each loop',
      inputs: ['', ''],
      outputs: ['', 'idx', 'element', ''],
      expected: `for idx, element in enumerate([]):\n${
        generator.indent + 'pass'
      }`,
    },
    {
      jsonPath: 'src/editor/extension/flowControl.json',
      nodeName: 'for loop',
      inputs: ['', '2', '5'],
      outputs: [
        'firstLine\nsecondLine',
        'idx',
        'completeFirst\ncompleteSecond',
      ],
      expected: `for idx in range(2, 5):\n${
        generator.indent + 'firstLine' + '\n' + generator.indent + 'secondLine'
      }\ncompleteFirst\ncompleteSecond`,
    },
    {
      jsonPath: 'src/editor/extension/flowControl.json',
      nodeName: 'for loop',
      inputs: ['', '2', '5'],
      outputs: ['', 'element', ''],
      expected: `for element in range(2, 5):\n${generator.indent + 'pass'}`,
    },
  ];

  test.each(testData)(
    'generate the code from the node $nodeName in $jsonPath',
    ({ jsonPath, nodeName, inputs, outputs, expected }) => {
      const node = loadNode(jsonPath, nodeName);
      const result = generator.nodeSourceGeneration(node, inputs, outputs);
      expect(result).toBe(expected);
    }
  );
});
