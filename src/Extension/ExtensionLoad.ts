import example from './example.json';
import { nodeConfigRegistry } from './NodeConfigRegistry';
import { addNewType } from '../panel/types';

const libraries = [example];

export const extensionLoad = (): void => {
  libraries.forEach((lib) => {
    Object.entries(lib.Nodes).forEach(
      ([name, node]: [name: string, node: any]) => {
        nodeConfigRegistry.registerNodeConfig(name, node);
      }
    );
    Object.entries(lib.Types).forEach(
      ([name, type]: [name: string, type: any]) => {
        addNewType(name, type);
      }
    );
  });
};
