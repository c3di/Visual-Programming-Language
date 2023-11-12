import {
  FunctionGenRes,
  GenResult,
  InputGenRes,
  NodeGenRes,
  PythonGenerator,
  VisualProgram,
} from '../../src/editor/generators';
import { Edge, Node } from '../../src/editor/types';

describe('PythonGenerator', () => {
  let generator: PythonGenerator;

  const nodes: Node[] = [
    {
      id: '1',
      data: {
        configType: 'main',
        inputs: { in_a: { dataType: 'exec' } },
        outputs: {
          out_a: { dataType: 'exec' },
          out_b: { dataType: 'number' },
        },
      },
    } as any as Node,
    {
      id: '2',
      data: {
        nodeRef: '7',
        configType: 'function call',
        inputs: {
          in_a: { dataType: 'exec' },
          in_b: { dataType: 'number' },
        },
        outputs: {
          out_a: { dataType: 'exec' },
          out_b: { dataType: 'number' },
        },
      },
    } as any as Node,
    {
      id: '3',
      data: {
        configType: 'if else',
        inputs: {
          in_a: { dataType: 'exec' },
          in_b: { dataType: 'number' },
        },
        outputs: {
          out_a: { dataType: 'exec' },
          out_b: { dataType: 'exec' },
          out_c: { dataType: 'number' },
        },
      },
    } as any as Node,
    {
      id: '4',
      data: {
        nodeRef: '9',
        configType: 'function call',
        inputs: {
          in_a: { dataType: 'exec' },
          in_b: { dataType: 'number' },
        },
        outputs: {
          out_a: { dataType: 'exec' },
          out_b: { dataType: 'number' },
          out_c: { dataType: 'number' },
        },
      },
    } as any as Node,
    {
      id: '5',
      data: {
        configType: 'new variable',
        inputs: {
          in_a: { dataType: 'exec' },
          in_b: { dataType: 'number', value: 5 },
        },
        outputs: {
          out_a: { dataType: 'exec' },
          out_b: { dataType: 'number' },
          out_c: { dataType: 'number' },
        },
      },
    } as any as Node,
    {
      id: '6',
      data: {
        nodeRef: '7',
        configType: 'function call',
        externalImports: 'import numpy as np\nimport pandas as pd',
        codeGenerator:
          "function code(inputs, outputs, node, generator) {\n  return `print(${(inputs.splice(1)).join(', ')})\\n${outputs[0]}`\n}",
        inputs: {
          in_a: { dataType: 'exec' },
          in_b: { dataType: 'number' },
          in_c: { dataType: 'number' },
          in_d: { dataType: 'number', value: 5 },
        },
        outputs: {
          out_a: { dataType: 'exec' },
        },
      },
    } as any as Node,
    {
      id: '7',
      data: {
        configType: 'new function',
        inputs: {
          in_a: { dataType: 'exec' },
        },
        outputs: {
          out_a: { dataType: 'exec' },
        },
      },
    } as any as Node,
    {
      id: '8',
      data: {
        nodeRef: '9',
        configType: 'function call',
        inputs: {
          in_a: { dataType: 'exec' },
        },
        outputs: {
          out_a: { dataType: 'exec' },
        },
      },
    } as any as Node,
    {
      id: '9',
      data: {
        configType: 'new function',
        inputs: {
          in_a: { dataType: 'exec' },
        },
        outputs: {
          out_a: { dataType: 'exec' },
        },
      },
    } as any as Node,
    {
      id: '10',
      data: {
        configType: 'setter',
        inputs: {
          in_a: { dataType: 'exec' },
        },
        outputs: {
          out_a: { dataType: 'exec' },
        },
      },
    } as any as Node,
    {
      id: '11',
      data: {
        externalImports: 'import numpy as np\nimport pandas as pd2',
        configType: 'plus 1',
        codeGenerator:
          "function code(inputs, outputs, node, generator) {\n  return `${outputs[0]} = ${inputs.join(', ')}`\n}",
        inputs: {
          in_b: { dataType: 'number', value: 3 },
        },
        outputs: {
          out_b: { dataType: 'number' },
        },
      },
    } as any as Node,
    {
      id: '12',
      data: {
        externalImports: 'import numpy as np\nimport pandas as pd2',
        configType: 'plus 1',
        inputs: {
          in_b: { dataType: 'number' },
        },
        outputs: {
          out_b: { dataType: 'number' },
        },
      },
    } as any as Node,
  ];

  const edges: Edge[] = [
    {
      source: '1',
      target: '2',
      sourceHandle: 'out_a',
      targetHandle: 'in_a',
    } as any as Edge,
    {
      source: '2',
      target: '3',
      sourceHandle: 'out_a',
      targetHandle: 'in_a',
    } as any as Edge,
    {
      source: '1',
      target: '2',
      sourceHandle: 'out_b',
      targetHandle: 'in_b',
    } as any as Edge,
    {
      source: '1',
      target: '3',
      sourceHandle: 'out_b',
      targetHandle: 'in_b',
    } as any as Edge,
    {
      source: '3',
      target: '4',
      sourceHandle: 'out_a',
      targetHandle: 'in_a',
    } as any as Edge,

    {
      source: '3',
      target: '5',
      sourceHandle: 'out_b',
      targetHandle: 'in_a',
    } as any as Edge,
    {
      source: '4',
      target: '6',
      sourceHandle: 'out_a',
      targetHandle: 'in_a',
    } as any as Edge,
    {
      source: '5',
      target: '6',
      sourceHandle: 'out_a',
      targetHandle: 'in_a',
    } as any as Edge,
    {
      source: '7',
      target: '8',
      sourceHandle: 'out_a',
      targetHandle: 'in_a',
    } as any as Edge,
    {
      source: '9',
      target: '10',
      sourceHandle: 'out_a',
      targetHandle: 'in_a',
    } as any as Edge,
    {
      source: '11',
      target: '6',
      sourceHandle: 'out_b',
      targetHandle: 'in_b',
    } as any as Edge,
    {
      source: '1',
      target: '6',
      sourceHandle: 'out_b',
      targetHandle: 'in_c',
    } as any as Edge,
  ];
  let program: VisualProgram;

  beforeEach(() => {
    generator = new PythonGenerator();
    program = new VisualProgram(nodes, edges);
  });

  describe('isExecNode', () => {
    const createMockNode = (outputs?: any, inputs?: any): Node => ({
      id: 'testNode',
      position: { x: 0, y: 0 },
      data: { outputs, inputs },
    });

    it('should return true for nodes with exec dataType in outputs', () => {
      const mockNode = createMockNode({ out1: { dataType: 'exec' } });
      expect(generator.isExecNode(mockNode)).toBeTruthy();
    });

    it('should return true for nodes with exec dataType in inputs', () => {
      const mockNode = createMockNode(undefined, { in1: { dataType: 'exec' } });
      expect(generator.isExecNode(mockNode)).toBeTruthy();
    });

    it('should return false for nodes without exec dataType', () => {
      const mockNode = createMockNode(
        { out1: { dataType: 'number' } },
        { in1: { dataType: 'string' } }
      );
      expect(generator.isExecNode(mockNode)).toBeFalsy();
    });

    it('should return false for nodes with empty inputs and outputs', () => {
      const mockNode = createMockNode();
      expect(generator.isExecNode(mockNode)).toBeFalsy();
    });
  });

  describe('indentLines', () => {
    it('should correctly indent a single line', () => {
      const text = 'line1';
      const expected = '  line1';
      expect(generator.indentLines(text)).toBe(expected);
    });

    it('should correctly indent multiple lines', () => {
      const text = 'line1\nline2\nline3';
      const expected = '  line1\n  line2\n  line3';
      expect(generator.indentLines(text)).toBe(expected);
    });

    it('should handle an empty string', () => {
      const text = '';
      const expected = '  ';
      expect(generator.indentLines(text)).toBe(expected);
    });

    it('should correctly handle nested indentation', () => {
      const text = 'line1\nline2\nline3';
      const onceIndented = generator.indentLines(text);
      const actual = generator.indentLines(onceIndented);
      const expected = '    line1\n    line2\n    line3';
      expect(actual).toBe(expected);
    });
  });

  describe('checkEntryPoint', () => {
    const mockProgramWithMainNode = {
      getStartNode: () => true,
    } as unknown as VisualProgram;

    const mockProgramWithoutMainNode = {
      getStartNode: () => null,
    } as unknown as VisualProgram;

    it('should not generate warning message when main entry node is present', () => {
      const actual = generator.checkEntryPoint(mockProgramWithMainNode);
      expect(actual.messages.length).toBe(0);
    });

    it('should generate warning message when no main entry node is found', () => {
      const actual = generator.checkEntryPoint(mockProgramWithoutMainNode);
      expect(actual.messages).toEqual([
        { type: 'warning', message: 'No "main" entry node found' },
      ]);
    });
  });

  describe('quote', () => {
    it('should enclose a simple string in single quotes', () => {
      const text = 'simple';
      const expected = "'simple'";
      expect(generator.quote(text)).toBe(expected);
    });

    it('should use double quotes if the string contains a single quote', () => {
      const text = "it's simple";
      const expected = '"it\'s simple"';
      expect(generator.quote(text)).toBe(expected);
    });

    it('should escape single quotes if the string contains both single and double quotes', () => {
      const text = 'She said, "it\'s simple"';
      const expected = "'She said, \"it\\'s simple\"'";
      expect(generator.quote(text)).toBe(expected);
    });

    it('should escape backslashes', () => {
      const text = 'C:\\path\\to\\file';
      const expected = "'C:\\\\path\\\\to\\\\file'";
      expect(generator.quote(text)).toBe(expected);
    });

    it('should escape newlines', () => {
      const text = 'first line\nsecond line';
      const expected = "'first line\\\nsecond line'";
      expect(generator.quote(text)).toBe(expected);
    });
  });

  describe('multiline_quote', () => {
    it('should correctly format a multiline string', () => {
      const text = 'line1\nline2\nline3';
      const expected = "'line1' + '\\n' + \n'line2' + '\\n' + \n'line3'";
      expect(generator.multiline_quote(text)).toBe(expected);
    });

    it('should handle a string with a single line', () => {
      const text = 'single line';
      const expected = "'single line'";
      expect(generator.multiline_quote(text)).toBe(expected);
    });

    it('should handle a string with special characters', () => {
      const text = 'line1\n"It\'s okay," she said.';
      const expected = "'line1' + '\\n' + \n'\"It\\'s okay,\" she said.'";
      expect(generator.multiline_quote(text)).toBe(expected);
    });

    it('should handle an empty string', () => {
      const text = '';
      const expected = "''";
      expect(generator.multiline_quote(text)).toBe(expected);
    });
  });

  describe('nodeSourceGeneration', () => {
    it('should generate source code for a node with a code generator function', () => {
      const mockNodeGenerator =
        'function(inputs, outputs, node, codeGen) { return "Code for " + node.id + `${inputs[0]}` + `${outputs[0]}`; }';
      const node = {
        id: '1',
        data: {
          configType: 'someType',
          codeGenerator: mockNodeGenerator,
        },
      };

      const inputs = ['input1', 'input2'];
      const outputs = ['output1'];

      const actual = generator.nodeSourceGeneration(
        node as any as Node,
        inputs,
        outputs
      );
      expect(actual).toBe('Code for 1input1output1');
    });

    it('should return an empty string for a node without a code generator function', () => {
      const node = {
        id: '2',
        data: {
          configType: 'someType',
          // No codeGenerator
        },
      };

      const actual = generator.nodeSourceGeneration(
        node as any as Node,
        [],
        []
      );
      expect(actual).toBe('');
    });
  });

  describe('getOutputValueOfNode', () => {
    it('should handle exec data type by generating code for the connected node', () => {
      program.getOutgoingNodes = jest.fn(() => [{}] as any as Node[]);
      const mockResult = new NodeGenRes(
        [],
        'generated code',
        new Set(['imports test'])
      );
      generator.nodeToCode = jest.fn(() => mockResult);
      const actual = generator.getOutputValueOfNode(nodes[0], 'out_a', program);
      expect(actual.equals(mockResult)).toBeTruthy();
    });

    it('should return a unique handle name for non-exec data type', () => {
      generator._getUniqueNameOfHandle = jest.fn(() => 'unique handle name');
      const actual = generator.getOutputValueOfNode(nodes[0], 'out_b', program);
      expect(
        actual.equals(new NodeGenRes([], 'unique handle name', new Set()))
      ).toBeTruthy();
    });
  });

  describe('topoSortFuncsInProgram', () => {
    it('should handle a graph with no main, no function definition, no function call', () => {
      const testNodes = JSON.parse(JSON.stringify(nodes));
      testNodes[0].data.configType = 'setter';
      testNodes[1].data.configType = 'setter';
      testNodes[3].data.configType = 'setter';
      testNodes[5].data.configType = 'setter';
      testNodes[6].data.configType = 'setter';
      testNodes[7].data.configType = 'setter';
      testNodes[8].data.configType = 'setter';
      const program = new VisualProgram(testNodes, edges);
      const sortedFuncs = generator.topoSortFuncsInProgram(program);
      expect(sortedFuncs.hasError).toBe(false);
      expect(sortedFuncs.nodes).toEqual([]);
    });

    it('hould handle a graph with main, no function definition, no function call', () => {
      const testNodes = JSON.parse(JSON.stringify(nodes));
      testNodes[1].data.configType = 'setter';
      testNodes[3].data.configType = 'setter';
      testNodes[5].data.configType = 'setter';
      testNodes[6].data.configType = 'setter';
      testNodes[8].data.configType = 'setter';
      const program = new VisualProgram(testNodes, edges);
      const sortedFuncs = generator.topoSortFuncsInProgram(program);
      expect(sortedFuncs.hasError).toBe(false);
      expect(sortedFuncs.nodes.map((n) => n.id)).toEqual(['1']);
    });

    it('should handle a graph with main, function definition, but no function call', () => {
      const testNodes = JSON.parse(JSON.stringify(nodes));
      testNodes[1].data.configType = 'setter';
      testNodes[3].data.configType = 'setter';
      testNodes[5].data.configType = 'setter';
      testNodes[7].data.configType = 'setter';
      const program = new VisualProgram(testNodes, edges);
      const sortedFuncs = generator.topoSortFuncsInProgram(program);
      expect(sortedFuncs.hasError).toBe(false);
      expect(sortedFuncs.nodes.map((n) => n.id)).toEqual(['7', '9', '1']);
    });

    it('should handle a graph with main, function definition, nested function call', () => {
      const sortedFuncs = generator.topoSortFuncsInProgram(program);
      expect(sortedFuncs.hasError).toBe(false);
      expect(sortedFuncs.nodes.map((n) => n.id)).toEqual(['9', '7', '1']);
    });

    it('should report an error for a cyclic graph', () => {
      const testNodes = JSON.parse(JSON.stringify(nodes));
      testNodes.push({
        id: '999',
        data: {
          configType: 'function call',
          nodeRef: '7',
          inputs: {
            in_a: { dataType: 'exec' },
          },
          outputs: {
            out_a: { dataType: 'exec' },
          },
        },
      } as any as Node);
      const testEdges = JSON.parse(JSON.stringify(edges));
      testEdges.push({
        source: '10',
        target: '999',
        sourceHandle: 'out_a',
        targetHandle: 'in_a',
      });
      const program = new VisualProgram(testNodes, testEdges);
      const sortedFuncs = generator.topoSortFuncsInProgram(program);
      expect(sortedFuncs.hasError).toBe(true);
    });
  });

  describe('getInputValueOfNode', () => {
    it('should handle exec data type inputs', () => {
      const actual = generator.getInputValueOfNode(nodes[0], 'in_a', program);
      expect(
        actual.equals(new InputGenRes([], '', new Set(), ''))
      ).toBeTruthy();
    });

    it('should handle unconnected non-exec inputs', () => {
      const actual = generator.getInputValueOfNode(nodes[4], 'in_b', program);
      generator.widgetValueToLanguageValue = jest.fn(() => '5');
      expect(actual.equals(new InputGenRes([], '5')));
    });

    it('should handle connected non-exec inputs in exec node', () => {
      generator._getUniqueNameOfHandle = jest.fn((node, handle) => handle);
      const actual = generator.getInputValueOfNode(nodes[2], 'in_b', program);
      expect(actual.equals(new InputGenRes([], 'out_b'))).toBeTruthy();
    });

    it('should handle connected non-exec inputs in non-exec node', () => {
      generator._getUniqueNameOfHandle = jest.fn((node, handle) => handle);
      generator.nodeToCode = jest.fn(
        () =>
          new NodeGenRes(
            [],
            'generated pre computation code',
            new Set(['imports test'])
          )
      );
      const actual = generator.getInputValueOfNode(nodes[5], 'in_b', program);
      expect(
        actual.equals(
          new InputGenRes(
            [],
            'out_b',
            new Set(['imports test']),
            'generated pre computation code'
          )
        )
      ).toBeTruthy();
    });

    describe('nodeToCode', () => {
      it('should handle undefined node', () => {
        const actual = generator.nodeToCode(undefined, program);
        expect(actual.equals(new NodeGenRes())).toBeTruthy();
      });

      it('should handle nodes without inputs or outputs', () => {
        generator.nodeSourceGeneration = jest.fn(() => 'generated code');
        const actual = generator.nodeToCode(
          { data: {} } as any as Node,
          program
        );
        expect(
          actual.equals(new NodeGenRes([], 'generated code'))
        ).toBeTruthy();
      });

      it('should generate code for a node with inputs and outputs', () => {
        // simulate the different cases of inputs: unconnected, connected to exec node, connected to non-exec node
        // simulate the case of outputs: unconnected
        const actual = generator.nodeToCode(nodes[5] as any as Node, program);
        const preComputeCode =
          generator._getUniqueNameOfHandle(nodes[10], 'out_b') +
          ' = ' +
          `${nodes[10].data.inputs['in_b'].value}`;
        const code = `print(${generator._getUniqueNameOfHandle(
          nodes[10],
          'out_b'
        )}, ${generator._getUniqueNameOfHandle(nodes[0], 'out_b')}, ${
          nodes[5].data.inputs['in_d'].value
        })`;
        const expected = new NodeGenRes(
          [],
          preComputeCode + '\n' + code,
          new Set([
            'import numpy as np',
            'import pandas as pd2',
            'import pandas as pd',
          ])
        );
        expect(actual.equals(expected)).toBeTruthy();
      });

      it('should not duplicate the computation code when there are handles connected to same output', () => {
        const testEdges = JSON.parse(JSON.stringify(edges));
        testEdges.push({
          source: '11',
          target: '6',
          sourceHandle: 'out_b',
          targetHandle: 'in_d',
        });
        const program = new VisualProgram(nodes, testEdges);
        const actual = generator.nodeToCode(nodes[5], program);

        const preComputeCode =
          generator._getUniqueNameOfHandle(nodes[10], 'out_b') +
          ' = ' +
          `${nodes[10].data.inputs['in_b'].value}`;
        const code = `print(${generator._getUniqueNameOfHandle(
          nodes[10],
          'out_b'
        )}, ${generator._getUniqueNameOfHandle(
          nodes[0],
          'out_b'
        )}, ${generator._getUniqueNameOfHandle(nodes[10], 'out_b')})`;

        const expected = new NodeGenRes(
          [],
          preComputeCode + '\n' + code,
          new Set([
            'import numpy as np',
            'import pandas as pd2',
            'import pandas as pd',
          ])
        );
        expect(actual.equals(expected)).toBeTruthy();
      });
    });

    describe('functionsToCode', () => {
      it('should generate code for multiple function definitions', () => {
        generator.functionToCode = jest.fn(
          (def) =>
            new FunctionGenRes(
              [],
              'generated code',
              new Set([`import ${def.id}`])
            )
        );
        program.isAcyclic = jest.fn(() => true);
        const testFunDefs = [nodes[5], nodes[7]];
        const actual = generator.functionsToCode(testFunDefs, program);
        const expected = new FunctionGenRes(
          [],
          'generated code\ngenerated code',
          new Set([`import ${nodes[5].id}`, `import ${nodes[7].id}`])
        );
        expect(actual.equals(expected)).toBeTruthy();
      });

      it('should report an error for function definitions with cyclic dependencies', () => {
        program.isAcyclic = jest.fn(() => false);
        const testFunDefs = [nodes[5], nodes[7]];
        const actual = generator.functionsToCode(testFunDefs, program);
        expect(actual.messages[0].message).toBe(
          'Cycle Dependency Detected in Acyclic Graph'
        );
      });
    });

    describe('programToCode', () => {
      it('should generate code for a valid program', () => {
        generator.checkEntryPoint = jest.fn(() => new GenResult());
        generator.topoSortFuncsInProgram = jest.fn(() => ({
          hasError: false,
          nodes: [nodes[5], nodes[7], nodes[9]],
        }));
        generator.functionsToCode = jest.fn(
          () =>
            new FunctionGenRes(
              [],
              "print('hello')",
              new Set(['import numpy as np'])
            )
        );

        const actual = generator.programToCode(program);
        expect(
          actual.equals(new GenResult([], "import numpy as np\nprint('hello')"))
        ).toBeTruthy();
      });

      it('should report an error if no entry point is found', () => {
        const expected = new GenResult([
          { type: 'warning', message: 'No "main" entry node found' },
        ]);

        generator.checkEntryPoint = jest.fn(() => expected);
        generator.topoSortFuncsInProgram = jest.fn(() => ({
          hasError: false,
          nodes: [nodes[5], nodes[7], nodes[9]],
        }));
        generator.functionsToCode = jest.fn(
          () =>
            new FunctionGenRes(
              [],
              "print('hello')",
              new Set(['import numpy as np'])
            )
        );

        const actual = generator.programToCode(program);
        expect(
          actual.equals(
            new GenResult(
              expected.messages,
              "import numpy as np\nprint('hello')"
            )
          )
        ).toBeTruthy();
      });

      it('should report an error if cyclic dependencies are found', () => {
        const expected = new GenResult([
          { type: 'warning', message: 'No "main" entry node found' },
        ]);

        generator.checkEntryPoint = jest.fn(() => expected);
        const expectedMsg = 'Cycle Dependency Detected in Acyclic Graph';
        generator.topoSortFuncsInProgram = jest.fn(() => ({
          hasError: true,
          errorMessage: expectedMsg,
          nodes: [],
        }));

        const actual = generator.programToCode(program);
        expect(
          actual.equals(
            new GenResult([
              ...expected.messages,
              { type: 'error', message: expectedMsg },
            ])
          )
        ).toBeTruthy();
      });
    });
  });
});
