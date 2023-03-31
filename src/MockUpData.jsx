import { MarkerType, Position } from 'reactflow';

export const graphInstance = {
  nodes: [
    {
      id: '1',
      type: 'function',
      data: {
        title: 'function Node',
        tooltip: 'this is a function node',
        inputs: {
          input1: {
            type: 'source',
            title: 'input1',
            connection: 0,
            tooltip: 'input 1',
            dataType: 'float',
            defaultValue: 100,
            value: 10,
          },
          input2: {
            type: 'source',
            title: 'input2',
            connection: 0,
            tooltip: 'input 2',
            dataType: 'boolean',
            defaultValue: true,
          },
          input3: {
            type: 'source',
            title: 'input3',
            connection: 0,
            tooltip: 'input 3',
            dataType: 'string',
            defaultValue: 'hello',
            value: 'world',
          },
          input4: {
            type: 'source',
            title: 'input4',
            connection: 0,
            tooltip: 'input 4',
            dataType: 'EDataType',
            defaultValue: 'string',
          },
        },
        outputs: {
          output1: {
            type: 'target',
            connection: 1,
            title: 'output1',
            tooltip: 'output 1',
            dataType: 'float',
          },
          output2: {
            type: 'target',
            connection: 0,
            title: 'output2',
            tooltip: 'output 2',
            dataType: 'float',
          },
        },
      },
      position: { x: 0, y: 0 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: '2',
      type: 'getter',
      data: {
        outputs: {
          Getter: {
            title: 'Getter',
            tooltip: 'getter handle',
            dataType: 'float',
            defaultValue: 100,
          },
        },
      },
      position: { x: 300, y: 0 },
    },
    {
      id: '3',
      type: 'setter',
      data: {
        inputs: {
          handle: {
            title: 'account',
            connection: 1,
            tooltip: 'setter handle',
            dataType: 'float',
            defaultValue: 100,
          },
        },
        // the same as the inputs except the title, tooltip, for easy indexing
        outputs: {
          output: {
            title: 'return account',
            tooltip: 'return acclunt',
            dataType: 'float',
          },
        },
      },
      position: { x: 600, y: 0 },
    },
    {
      id: '4',
      type: 'math',
      data: {
        title: '+',
        inputs: {
          input1: {
            title: 'input1',
            connection: 1,
            tooltip: 'input 1',
            dataType: 'float',
          },
          input2: {
            title: 'input2',
            tooltip: 'input 2',
            dataType: 'integer',
            defaultValue: -1,
          },
        },
        outputs: {
          output: {
            title: 'output',
            tooltip: 'output',
            dataType: 'boolean',
          },
        },
      },
      position: { x: 300, y: 300 },
    },
    {
      id: '5',
      type: 'literal',
      data: {
        type: 'float',
        inputs: {
          value: {
            title: 'Value',
            tooltip: 'literal handle',
            dataType: 'float',
            defaultValue: 100,
          },
        },
        // the same as the inputs except the title, tooltip, for easy indexing
        outputs: {
          output: {
            connection: 1,
            title: 'return Value',
            tooltip: 'return Value',
            dataType: 'float',
          },
        },
      },
      position: { x: 0, y: 300 },
    },
    {
      id: '6',
      type: 'comment',
      dragHandle: '.node__header',
      zIndex: -1001,
      data: {
        comment: 'This is a comment node 1',
        tooltip: 'this is a comment node',
        width: 200,
        height: 200,
      },
      position: { x: 600, y: 300 },
    },
    {
      id: '7',
      type: 'comment',
      dragHandle: '.node__header',
      zIndex: -1001,
      data: {
        comment: 'This is a comment node 2',
        tooltip: 'this is a comment node',
      },
      position: { x: 0, y: 600 },
    },
    {
      id: '8',
      type: 'reroute',
      data: {
        tooltip: 'this is a reroute node',
        inputs: {
          input: { title: 'input', tooltip: 'input', dataType: 'any' },
        },
        outputs: {
          output: { title: 'output', tooltip: 'output', dataType: 'any' },
        },
      },
      position: { x: 300, y: 600 },
    },
  ],
  edges: [
    {
      id: 'e1-3',
      source: '1',
      target: '3',
      animated: true,
      sourceHandle: 'output1',
      targetHandle: 'handle',
    },
    {
      id: 'e4-5',
      source: '5',
      target: '4',
      data: {},
      sourceHandle: 'output',
      targetHandle: 'input1',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
  ],
};
