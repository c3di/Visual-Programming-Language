import { VisualProgram } from '../../src/editor/generators';
import { Edge, Node } from '../../src/editor/types';

describe('VisualProgram', () => {
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
        configType: 'new function',
        inputs: { in_a: { dataType: 'exec' }, in_b: { dataType: 'number' } },
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
        inputs: { in_a: { dataType: 'exec' }, in_b: { dataType: 'number' } },
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
        configType: 'setter',
        inputs: { in_a: { dataType: 'exec' }, in_b: { dataType: 'number' } },
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
        inputs: { in_a: { dataType: 'exec' }, in_b: { dataType: 'number' } },
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
        configType: 'setter',
        inputs: { in_a: { dataType: 'exec' }, in_b: { dataType: 'number' } },
        outputs: {
          out_a: { dataType: 'exec' },
          out_b: { dataType: 'number' },
          out_c: { dataType: 'number' },
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
  ];

  let program: VisualProgram;
  beforeEach(() => {
    program = new VisualProgram(nodes, edges);
  });

  describe('getNodeById', () => {
    it('should return the node with the given ID', () => {
      expect(program.getNodeById('1')).toEqual(nodes[0]);
    });

    it('should return undefined for a non-existent ID', () => {
      expect(program.getNodeById('non-existent')).toBeUndefined();
    });
  });

  describe('getStartNode', () => {
    it('should return the main node if present', () => {
      expect(program.getStartNode()).toEqual(nodes[0]);
    });

    it('should return undefined if there is no main node', () => {
      program.nodes[0].data.configType = 'new function';
      expect(program.getStartNode()).toBeUndefined();
    });
  });

  describe('getFuncDefNodes', () => {
    it('should return all Function nodes and the main node', () => {
      const result = program.getFuncDefNodes();
      expect(result).toEqual([nodes[0], nodes[1]]);
    });

    it('should return only New Function nodes if no Main node is present', () => {
      program.nodes[0].data.configType = 'setter';
      const result = program.getFuncDefNodes();
      expect(result).toEqual([nodes[1]]);
    });

    it('should return an empty array if no `new function` or `main` nodes are present', () => {
      program.nodes[0].data.configType = 'setter';
      program.nodes[1].data.configType = 'not function';
      const result = program.getFuncDefNodes();
      expect(result).toEqual([]);
    });
  });

  describe('getOutgoingNodes', () => {
    it('should return one outgoing node from a specified node and handle', () => {
      const result = program.getOutgoingNodes('1', 'out_a');
      expect(result).toEqual([nodes[1]]);
    });

    it('should return all outgoing nodes from a specified node and handle', () => {
      const result = program.getOutgoingNodes('1', 'out_b');
      expect(result).toEqual([nodes[1], nodes[2]]);
    });

    it('should return an empty array if there are no outgoing edges from the specified node and handle', () => {
      const program = new VisualProgram(nodes, edges);

      const result = program.getOutgoingNodes('6', 'out_a');
      expect(result).toEqual([]);
    });
  });

  describe('getOutgoingNodesByHandleType', () => {
    it('should return one outgoing node from a specified node with a given handle type', () => {
      const result = program.getOutgoingNodesByHandleType('1', 'exec');
      expect(result).toEqual([nodes[1]]);
    });

    it('should return all outgoing nodes from a specified node with a given handle type', () => {
      const result = program.getOutgoingNodesByHandleType('1', 'number');
      expect(result).toEqual([nodes[1], nodes[2]]);
    });

    it('should return an empty array if there are no outgoing edges from the specified node with the given handle type', () => {
      const result = program.getOutgoingNodesByHandleType('6', 'exec');
      expect(result).toEqual([]);
    });
  });

  describe('getIncomingNodes', () => {
    it('should return all incoming nodes to a specified node and handle', () => {
      const result = program.getIncomingNodes('2', 'in_a');
      expect(result).toEqual([nodes[0]]);
    });

    it('should return multiple incoming nodes if applicable', () => {
      const result = program.getIncomingNodes('6', 'in_a');
      expect(result).toEqual([nodes[3], nodes[4]]);
    });

    it('should return an empty array if there are no incoming edges to the specified node and handle', () => {
      const result = program.getIncomingNodes('3', 'non_existent_handle');
      expect(result).toEqual([]);
    });
  });

  describe('getSourceHandleConnectedToTargetHandle', () => {
    it('should return the source handle for a given target handle and edge', () => {
      const result = program.getSourceHandleConnectedToTargetHandle(
        '1',
        '2',
        'in_a'
      );
      expect(result).toBe('out_a');
    });

    it('should return undefined if there is no edge between the specified source and target', () => {
      const result = program.getSourceHandleConnectedToTargetHandle(
        '1',
        '3',
        'in_a'
      );
      expect(result).toBeUndefined();
    });

    it('should return undefined if the target handle does not exist on the connecting edge', () => {
      const result = program.getSourceHandleConnectedToTargetHandle(
        '1',
        '2',
        'non_existent_handle'
      );
      expect(result).toBeUndefined();
    });
  });

  describe('isConnected', () => {
    it('should return true if the node has incoming connections at the specified handle', () => {
      const result = program.isConnected('2', 'input', 'in_a');
      expect(result).toBe(true);
    });

    it('should return true if the node has outgoing connections at the specified handle', () => {
      const result = program.isConnected('1', 'output', 'out_a');
      expect(result).toBe(true);
    });

    it('should return false if the node has no connections at the specified handle', () => {
      const result = program.isConnected('3', 'output', 'out_c');
      expect(result).toBe(false);
    });

    it('should return false if the node or handle does not exist', () => {
      const result = program.isConnected('non_existent_node', 'input', 'in_a');
      expect(result).toBe(false);
    });
  });

  describe('isAcyclic', () => {
    it('should return true for an acyclic graph', () => {
      expect(program.isAcyclic('1')).toBe(true);
    });

    it('should return false for a cyclic graph', () => {
      program.edges.push({
        source: '3',
        target: '1',
        sourceHandle: 'out_a',
        targetHandle: 'in_a',
      } as any as Edge);
      expect(program.isAcyclic('1')).toBe(false);
    });

    it('should return false for a cyclic graph', () => {
      program.edges.push({
        source: '6',
        target: '3',
        sourceHandle: 'out_a',
        targetHandle: 'in_a',
      } as any as Edge);
      expect(program.isAcyclic('1')).toBe(false);
    });

    it('should return true for an empty graph', () => {
      const program = new VisualProgram([], []);
      expect(program.isAcyclic('anyNodeId')).toBe(true);
    });

    it('should return true for a single node graph', () => {
      const program = new VisualProgram([nodes[0]], []);
      expect(program.isAcyclic('1')).toBe(true);
    });
  });

  describe('funcCallsInFunc', () => {
    it('should identify function call nodes within a function', () => {
      console.log(JSON.stringify(nodes));
      const funcCalls = JSON.parse(JSON.stringify(nodes));
      funcCalls[1].data.configType = 'function call';
      funcCalls[4].data.configType = 'function call';
      const program = new VisualProgram(funcCalls, edges);
      const result = program.funcCallsInFunc(nodes[0]);
      expect(result).toEqual([funcCalls[1], funcCalls[4]]);
    });

    it('should return an empty array if there are no function call nodes', () => {
      const result = program.funcCallsInFunc(nodes[0]);
      expect(result).toEqual([]);
    });
  });
});
