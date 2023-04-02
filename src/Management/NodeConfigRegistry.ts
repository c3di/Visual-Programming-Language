import { type NodeConfig } from '../panel/types';

export class NodeConfigRegistry {
  private static instance: NodeConfigRegistry;
  private readonly registry: Record<string, NodeConfig> = {
    function1: {
      category: 'function',
      title: 'function Node',
      tooltip: 'this is a function node',
      inputs: {
        input1: {
          title: 'input1',
          tooltip: 'input 1',
          dataType: 'float',
          defaultValue: 100,
        },
        input2: {
          title: 'input2',
          tooltip: 'input 2',
          dataType: 'boolean',
          defaultValue: true,
        },
        input3: {
          title: 'input3',
          tooltip: 'input 3',
          dataType: 'string',
          defaultValue: 'hello',
        },
        input4: {
          title: 'input4',
          tooltip: 'input 4',
          dataType: 'EDataType',
          defaultValue: 'string',
        },
      },
      outputs: {
        output1: {
          title: 'output1',
          tooltip: 'output 1',
          dataType: 'float',
        },
        output2: {
          title: 'output2',
          tooltip: 'output 2',
          dataType: 'float',
        },
      },
    },
    getter: {
      category: 'getter',
      tooltip: 'Return the value',
      outputs: {
        getter: {
          tooltip: 'getter handle',
        },
      },
    },
    setter: {
      category: 'setter',
      inputs: {
        setter: {
          tooltip: 'setter handle',
        },
      },
    },
    PlusMath: {
      category: 'math',
      title: '+',
      tooltip: 'Addition',
      inputs: {
        input1: {
          tooltip: 'input 1',
        },
        input2: {
          tooltip: 'input 2',
        },
      },
      outputs: {
        output: {
          tooltip: 'output',
        },
      },
    },
    literal: {
      category: 'literal',
      inputs: {
        input: {
          tooltip: 'literal handle',
        },
      },
    },
    comment: {
      category: 'comment',
      dragHandle: '.node__header',
      zIndex: -1001,
      tooltip: 'this is a comment',
    },
    reroute: {
      category: 'reroute',
      tooltip: 'this is a reroute',
      inputs: {
        input: {
          title: 'input',
          tooltip: 'input',
          dataType: 'any',
        },
      },
      outputs: {
        output: {
          title: 'output',
          tooltip: 'output',
          dataType: 'any',
        },
      },
    },
  };

  private constructor() {}

  public static getInstance(): NodeConfigRegistry {
    if (!NodeConfigRegistry.instance) {
      NodeConfigRegistry.instance = new NodeConfigRegistry();
    }
    return NodeConfigRegistry.instance;
  }

  public registerNodeConfig(name: string, node: any): void {
    this.registry[name] = node;
  }

  public getNodeConfig(name: string): NodeConfig {
    return this.registry[name];
  }
}

export const nodeConfigRegistry = NodeConfigRegistry.getInstance();
