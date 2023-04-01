import { type GraphData } from './panel/types';

export const graphInstance: GraphData = {
  serializedNodes: [
    {
      id: '1',
      type: 'function1',
      inputs: {
        input1: {
          connection: 0,
          value: 10,
        },
        input2: {
          connection: 0,
        },
        input3: {
          connection: 0,
          value: 'world',
        },
        input4: {
          connection: 0,
        },
      },
      outputs: {
        output1: {
          connection: 1,
        },
        output2: {
          connection: 0,
        },
      },
      position: { x: 0, y: 0 },
    },
    {
      id: '2',
      type: 'getter',
      outputs: {
        getter: {
          title: 'variable',
          connection: 1,
          dataType: 'float',
          defaultValue: 100,
        },
      },
      position: { x: 300, y: 0 },
    },
    {
      id: '3',
      type: 'setter',
      inputs: {
        setter: {
          title: 'account',
          connection: 1,
          dataType: 'float',
          defaultValue: 100,
        },
      },
      position: { x: 600, y: 0 },
    },
    {
      id: '4',
      type: 'PlusMath',
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
      type: 'literal',
      dataType: 'float',
      inputs: {
        input: {
          title: 'Value',
          connection: 0,
          dataType: 'float',
          defaultValue: 100,
        },
      },
      position: { x: 0, y: 300 },
    },
    // {
    //   id: '6',
    //   category: 'comment',
    //   dragHandle: '.node__header',
    //   zIndex: -1001,
    //   comment: 'This is a comment node',
    //   tooltip: 'this is a comment node',
    //   position: { x: 600, y: 300 },
    //   width: 250,
    //   height: 150,
    // },
    // {
    //   id: '8',
    //   category: 'reroute',
    //   tooltip: 'this is a reroute node',
    //   inputs: {
    //     input: {
    //       connection: 0,
    //       title: 'input',
    //       tooltip: 'input',
    //       dataType: 'any',
    //     },
    //   },
    //   outputs: {
    //     output: {
    //       connection: 0,
    //       title: 'output',
    //       tooltip: 'output',
    //       dataType: 'any',
    //     },
    //   },

    //   position: { x: 300, y: 600 },
    // },
  ],
  edgeConfigs: [
    // {
    //   id: 'e1-3',
    //   output: '1',
    //   input: '3',
    //   outputHandle: 'output1',
    //   inputHandle: 'handle',
    // },
    // {
    //   id: 'e4-5',
    //   output: '5',
    //   input: '4',
    //   dataType: 'float',
    //   outputHandle: 'output',
    //   inputHandle: 'input1',
    // },
  ],
};
