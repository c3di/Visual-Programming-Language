import { type GraphData } from './panel/types';

export const graphInstance: GraphData = {
  nodeConfigs: [
    {
      id: '1',
      category: 'function',
      title: 'function Node',
      tooltip: 'this is a function node',
      inputs: {
        input1: {
          title: 'input1',
          connection: 0,
          tooltip: 'input 1',
          dataType: 'float',
          defaultValue: 100,
          value: 10,
        },
        input2: {
          title: 'input2',
          connection: 0,
          tooltip: 'input 2',
          dataType: 'boolean',
          defaultValue: true,
        },
        input3: {
          title: 'input3',
          connection: 0,
          tooltip: 'input 3',
          dataType: 'string',
          defaultValue: 'hello',
          value: 'world',
        },
        input4: {
          title: 'input4',
          connection: 0,
          tooltip: 'input 4',
          dataType: 'EDataType',
          defaultValue: 'string',
        },
      },
      outputs: {
        output1: {
          connection: 1,
          title: 'output1',
          tooltip: 'output 1',
          dataType: 'float',
        },
        output2: {
          connection: 0,
          title: 'output2',
          tooltip: 'output 2',
          dataType: 'float',
        },
      },
      position: { x: 0, y: 0 },
    },
    {
      id: '2',
      category: 'getter',
      tooltip: 'this is a constant node',
      outputs: {
        gettter: {
          connection: 1,
          title: 'Getter',
          tooltip: 'getter handle',
          dataType: 'float',
          defaultValue: 100,
        },
      },
      position: { x: 300, y: 0 },
    },
    {
      id: '3',
      category: 'setter',
      inputs: {
        account: {
          title: 'account',
          connection: 1,
          tooltip: 'setter handle',
          dataType: 'float',
          defaultValue: 100,
        },
      },
      position: { x: 600, y: 0 },
    },
    {
      id: '4',
      category: 'math',
      title: '+',
      tooltip: 'this is a math node',
      inputs: {
        input1: {
          title: 'input1',
          connection: 1,
          tooltip: 'input 1',
          dataType: 'float',
        },
        input2: {
          title: 'input2',
          connection: 0,
          tooltip: 'input 2',
          dataType: 'integer',
          defaultValue: -1,
        },
      },
      outputs: {
        output: {
          title: 'output',
          connection: 0,
          tooltip: 'output',
          dataType: 'boolean',
        },
      },
      position: { x: 300, y: 300 },
    },
    {
      id: '5',
      category: 'literal',
      dataType: 'float',
      inputs: {
        value: {
          title: 'Value',
          connection: 0,
          tooltip: 'literal handle',
          dataType: 'float',
          defaultValue: 100,
        },
      },
      position: { x: 0, y: 300 },
    },
    {
      id: '6',
      category: 'comment',
      dragHandle: '.node__header',
      zIndex: -1001,
      comment: 'This is a comment node',
      tooltip: 'this is a comment node',
      position: { x: 600, y: 300 },
      width: 250,
      height: 150,
    },
    {
      id: '8',
      category: 'reroute',
      tooltip: 'this is a reroute node',
      inputs: {
        input: {
          connection: 0,
          title: 'input',
          tooltip: 'input',
          dataType: 'any',
        },
      },
      outputs: {
        output: {
          connection: 0,
          title: 'output',
          tooltip: 'output',
          dataType: 'any',
        },
      },

      position: { x: 300, y: 600 },
    },
  ],
  edgeConfigs: [
    // {
    //   id: 'e1-3',
    //   source: '1',
    //   target: '3',
    //   animated: true,
    //   sourceHandle: 'output1',
    //   targetHandle: 'handle',
    // },
    // {
    //   id: 'e4-5',
    //   source: '5',
    //   target: '4',
    //   data: {},
    //   sourceHandle: 'output',
    //   targetHandle: 'input1',
    //   markerEnd: {
    //     type: MarkerType.ArrowClosed,
    //   },
    // },
  ],
};
