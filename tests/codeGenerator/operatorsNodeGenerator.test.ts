import { pythonGenerator } from '../../src/editor/generators';
import { loadNode } from '../loader';

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
      jsonPath: 'src/editor/extension/operators.json',
      nodeName: 'make literal',
      inputs: ['1'],
      outputs: ['out'],
      expected: 'out = 1',
    },
    {
      jsonPath: 'src/editor/extension/operators.json',
      nodeName: 'make literal',
      inputs: ['"1"'],
      outputs: ['out'],
      expected: 'out = "1"',
    },
    {
      jsonPath: 'src/editor/extension/operators.json',
      nodeName: '+',
      inputs: ['', '1', '2'],
      outputs: ['out'],
      expected: 'out = 1 + 2',
    },
    {
      jsonPath: 'src/editor/extension/operators.json',
      nodeName: '+',
      inputs: ['', '"1"', '"2"', ''],
      outputs: ['out'],
      expected: 'out = "1" + "2"',
    },
    {
      jsonPath: 'src/editor/extension/operators.json',
      nodeName: '-',
      inputs: ['1', '2'],
      outputs: ['out'],
      expected: 'out = 1 - 2',
    },
    {
      jsonPath: 'src/editor/extension/operators.json',
      nodeName: '*',
      inputs: ['1', '2', '3', ''],
      outputs: ['out'],
      expected: 'out = 1 * 2 * 3',
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
