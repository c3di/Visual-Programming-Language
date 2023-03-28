import React from 'react';
import { MarkerType, Position } from 'reactflow';

export const graphInstance = {
  nodes: [
    {
      id: '1',
      type: 'function',
      data: {
        label: 'function Node',
        tooltip: 'this is a function node',
        inputs: {
          input1: {
            type: 'source',
            title: 'input1',
            connection: 0,
            tooltip: 'input 1',
            dataType: 'float',
            defaultValue: '100',
            value: '10',
          },
          input2: {
            type: 'source',
            title: 'input2',
            connection: 0,
            tooltip: 'input 2',
            dataType: 'bool',
            defaultValue: 'true',
            value: 'false',
          },
        },
        outputs: {
          output1: {
            type: 'target',
            connection: 0,
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
            defaultValue: '100',
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
            connected: false,
            tooltip: 'setter handle',
            dataType: 'float',
            defaultValue: '100',
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
            connected: false,
            tooltip: 'input 1',
            dataType: 'float',
          },
          input2: {
            title: 'input2',
            connected: false,
            tooltip: 'input 2',
            dataType: 'bool',
          },
        },
        outputs: {
          output: {
            title: 'output',
            tooltip: 'output',
            dataType: 'bool',
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
            defaultValue: '100',
          },
        },
        // the same as the inputs except the title, tooltip, for easy indexing
        outputs: {
          output: {
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
          input: { title: 'input', tooltip: 'input', dataType: 'float' },
        },
        outputs: {
          output: { title: 'output', tooltip: 'output', dataType: 'float' },
        },
      },
      position: { x: 300, y: 600 },
    },
    {
      id: '9',
      type: 'default',
      className: 'annotation',
      data: {
        label: (
          <>
            On the bottom left you see the <strong>Controls</strong> and the
            bottom right the <strong>MiniMap</strong>. This is also just a node
            🥳
          </>
        ),
      },
      draggable: false,
      selectable: false,
      position: { x: 600, y: 600 },
    },
  ],
  edges: [
    { id: 'e1-3', source: '1', target: '3', animated: true },
    {
      id: 'e4-5',
      source: '5',
      target: '4',
      data: {},
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
  ],
};
