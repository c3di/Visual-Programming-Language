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

describe('nodeGenerator of setter node', () => {
  const generator = pythonGenerator;
  let node: Node;

  beforeEach(() => {
    node = loadNode(
      path.join(rootDir, 'src/editor/extension/functionAndvar.json'),
      'setter'
    );
  });

  test('nodeGenerator of setter node', () => {
    const newValue = 'newValue';
    const nodeTitle = 'varName';
    const inputs = ['', newValue];
    const outputVar = 'outputVar';
    const outputs = ['otherCodeString', outputVar];
    node.data.inputs = {
      setter: {
        title: nodeTitle,
      },
    };
    const expected = `${nodeTitle} = ${newValue}
${outputVar} = ${nodeTitle}
otherCodeString`;
    const result = generator.nodeSourceGeneration(node, inputs, outputs);
    expect(result).toBe(expected);
  });
});

describe('nodeGenerator of getter node', () => {
  const generator = pythonGenerator;
  let node: Node;

  beforeEach(() => {
    node = loadNode(
      path.join(rootDir, 'src/editor/extension/functionAndvar.json'),
      'getter'
    );
  });

  test('nodeGenerator of getter node', () => {
    const nodeTitle = 'varName';
    const outputVar = 'outputVar';
    const outputs = [outputVar];
    node.data.outputs = { getter: { title: nodeTitle } };
    const expected = `${outputVar} = ${nodeTitle}`;
    const result = generator.nodeSourceGeneration(node, [], outputs);
    expect(result).toBe(expected);
  });
});

describe('codeGenerator function', () => {
  const generator = pythonGenerator;
  let node: Node;

  beforeEach(() => {
    node = loadNode(
      path.join(rootDir, 'src/editor/extension/functionAndvar.json'),
      'new function'
    );
    node.data.title = 'testFunction';
  });

  test('generate code with empty function body and empty arguments', () => {
    const outputs = [''];
    const expectedCode = `def ${node.data.title}():
${generator.indent}pass`;
    const generatedCode = generator.nodeSourceGeneration(node, [], outputs);
    expect(generatedCode).toBe(expectedCode);
  });

  test('generate code with function body', () => {
    const outputs = ['firstLine\nsecondLine', 'arg1', 'arg2'];
    const expectedCode = `def ${node.data.title}(arg1, arg2):
${generator.indent}firstLine
${generator.indent}secondLine`;
    const generatedCode = generator.nodeSourceGeneration(node, [], outputs);
    expect(generatedCode).toBe(expectedCode);
  });
});

describe('codeGenerator function', () => {
  const generator = pythonGenerator;
  let node: Node;
  const functionName = 'testFunction';

  beforeEach(() => {
    node = loadNode(
      path.join(rootDir, 'src/editor/extension/functionAndvar.json'),
      'function call'
    );
    node.data.title = functionName;
  });

  test('generate code with no value inputs or outputs', () => {
    const inputs = [''];
    const outputs = [''];
    const expectedCode = `${functionName}()`;
    const generatedCode = generator.nodeSourceGeneration(node, inputs, outputs);
    expect(generatedCode).toBe(expectedCode);
  });

  test('generate code with multiple inputs and outputs', () => {
    const inputs = ['', 'input1', 'input2'];
    const outputs = ['otherCodeString', 'output1', 'output2'];
    const expectedCode = `output1, output2 = ${functionName}(input1, input2)\notherCodeString`;
    const generatedCode = generator.nodeSourceGeneration(node, inputs, outputs);
    expect(generatedCode).toBe(expectedCode);
  });

  test('generate code with only one input and output', () => {
    const inputs = ['', 'input1'];
    const outputs = ['otherCodeString', 'output1'];
    const expectedCode = `output1 = ${functionName}(input1)\notherCodeString`;
    const generatedCode = generator.nodeSourceGeneration(node, inputs, outputs);
    expect(generatedCode).toBe(expectedCode);
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
    {
      jsonPath: 'src/editor/extension/functionAndvar.json',
      nodeName: 'new variable',
      inputs: ['', 'varName', "'strValue'"],
      outputs: ['otherCodeString'],
      expected: `varName = 'strValue'
otherCodeString`,
    },
    {
      jsonPath: 'src/editor/extension/functionAndvar.json',
      nodeName: 'new variable',
      inputs: ['', 'varName', '[1,2,3]'],
      outputs: ['otherCodeString'],
      expected: `varName = [1,2,3]
otherCodeString`,
    },
    {
      jsonPath: 'src/editor/extension/functionAndvar.json',
      nodeName: 'new variable',
      inputs: ['', 'varName', ''],
      outputs: ['otherCodeString'],
      expected: `varName = None
otherCodeString`,
    },
    {
      jsonPath: 'src/editor/extension/functionAndvar.json',
      nodeName: 'return',
      inputs: ['', 'varName', '"4"'],
      outputs: [],
      expected: `return varName, "4"`,
    },
    {
      jsonPath: 'src/editor/extension/functionAndvar.json',
      nodeName: 'return',
      inputs: ['', 'varName'],
      outputs: [],
      expected: `return varName`,
    },
    {
      jsonPath: 'src/editor/extension/functionAndvar.json',
      nodeName: 'return',
      inputs: [''],
      outputs: [],
      expected: `return`,
    },
    {
      jsonPath: 'src/editor/extension/log.json',
      nodeName: 'print',
      inputs: ['', '"first line"'],
      outputs: ['otherCodeString'],
      expected: 'print("first line")\notherCodeString',
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
