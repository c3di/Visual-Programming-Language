import example from './example.json';
import { nodeConfigRegistry } from './NodeConfigRegistry';
const libraries = [example];

export const extensionLoad = (): void => {
  libraries.forEach((lib) => {
    Object.entries(lib.Nodes).forEach(
      ([name, node]: [name: string, node: any]) => {
        nodeConfigRegistry.registerNodeConfig(name, node);
      }
    );
  });
};
