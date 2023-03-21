import React from 'react';
import { MarkerType, Position } from 'reactflow';

export const graphInstance = {
  nodes: [
    {
      id: '11',
      type: 'function',
      data: {
        label: 'function Node',
        tooltip: 'this is a function node',
        inputs: {
          input1: {
            type: 'source',
            title: 'input1',
            connected: false,
            tooltip: 'input 1',
            dataType: 'float',
            defaultValue: '100',
            value: '10',
          },
          input2: {
            type: 'source',
            title: 'input2',
            connected: false,
            tooltip: 'input 2',
            dataType: 'bool',
            defaultValue: 'true',
            value: 'false',
          },
        },
        outputs: {
          output1: {
            type: 'target',
            title: 'output1',
            tooltip: 'output 1',
            dataType: 'float',
          },
          output2: {
            type: 'target',
            title: 'output2',
            tooltip: 'output 2',
            dataType: 'float',
          },
        },
      },
      position: { x: 200, y: 0 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: '12',
      type: 'getter',
      data: {
        value: {
          title: 'Getter',
          handle: {
            title: 'handle',
            tooltip: 'getter handle',
            dataType: 'float',
            defaultValue: '100',
          },
        },
      },
      position: { x: 200, y: 100 },
    },
    {
      id: '13',
      type: 'setter',
      data: {
        value: {
          title: 'setter',
          handle: {
            title: 'account',
            tooltip: 'setter handle',
            dataType: 'float',
            defaultValue: '100',
          },
        },
      },
      position: { x: 200, y: 100 },
    },
    {
      id: '14',
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
        output: {
          title: 'output',
          handle: {
            title: 'output',
            tooltip: 'output',
            dataType: 'bool',
          },
        },
      },
      position: { x: 200, y: 600 },
    },
    {
      id: '15',
      type: 'literal',
      data: {
        value: {
          handle: {
            title: 'Value',
            tooltip: 'literal handle',
            dataType: 'float',
            defaultValue: '100',
          },
        },
      },
      position: { x: 200, y: 500 },
    },
    {
      id: '1',
      type: 'input',
      data: {
        label: 'Input Node',
      },
      position: { x: 250, y: 0 },
    },
    {
      id: '2',
      data: {
        label: 'Default Node',
      },
      position: { x: 100, y: 100 },
    },
    {
      id: '3',
      type: 'output',
      data: {
        label: 'Output Node',
      },
      position: { x: 400, y: 100 },
    },
    {
      id: '4',
      type: 'input',
      position: { x: 100, y: 200 },
      data: {
        label: 'Custom Node',
        tooltip: 'this is a customed node',
      },
    },
    {
      id: '5',
      type: 'output',
      data: {
        label: 'custom style',
      },
      className: 'circle',
      style: {
        background: '#2B6CB0',
        color: 'white',
      },
      position: { x: 400, y: 200 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: '6',
      type: 'output',
      style: {
        background: '#63B3ED',
        color: 'white',
        width: 100,
      },
      data: {
        label: 'Node',
      },
      position: { x: 400, y: 325 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: '7',
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
      position: { x: 150, y: 400 },
    },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', label: 'this is an edge label' },
    { id: 'e1-3', source: '1', target: '3', animated: true },
    {
      id: 'e4-5',
      source: '4',
      target: '5',
      type: 'smoothstep',
      sourceHandle: 'handle-0',
      data: {},
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
    {
      id: 'e4-6',
      source: '4',
      target: '6',
      type: 'smoothstep',
      sourceHandle: 'handle-1',
      data: {},
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
  ],
};
