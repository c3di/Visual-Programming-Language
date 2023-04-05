import buildin from './buildin.json';
import example from './example.json';
import { nodeConfigRegistry } from './NodeConfigRegistry';
import { addNewType } from '../panel/types';

const libraries = [buildin, example];

interface configLibrary {
  name?: string;
  Nodes?: Record<string, any>;
  Types?: Record<string, any>;
}

export const extensionLoad = (): void => {
  libraries.forEach((library) => {
    const lib = library as configLibrary;
    if (lib.Nodes) {
      const nodes: any = {};
      Object.entries(lib.Nodes).forEach(
        ([name, node]: [name: string, node: any]) => {
          nodes[name] = {
            ...node,
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            type: lib.name ? `${lib.name}.${node.type}` : node.type,
          };
        }
      );
      if (lib.name) nodeConfigRegistry.registerNodeConfig(lib.name, nodes);
      else
        Object.entries(nodes).forEach(([name, node]) => {
          nodeConfigRegistry.registerNodeConfig(name, node);
        });
    }
    if (lib.Types)
      Object.entries(lib.Types).forEach(
        ([name, type]: [name: string, type: any]) => {
          addNewType(name, type);
        }
      );
  });
};
