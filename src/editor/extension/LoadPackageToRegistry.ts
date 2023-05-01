import buildin from './buildin.json';
import { nodeConfigRegistry } from './NodeConfigRegistry';
import { addNewType, type NodePackage, type NodeConfig } from '../types';
/*
 * A module is a json file that contains nodes and types.
 * A package is a folder that contains libraries and other packages.
 */

export interface module {
  nodes?: Record<string, NodeConfig | NodePackage>;
  types?: Record<string, any>;
  notShowInMenu?: boolean;
}

/*
 * LoadModule is a function that loads a module.
 * A module is a json file that contains nodes and types.
 */
export const ParseModule = (m: module, relativePath: string): any => {
  const returnModule: module = {};
  const notShowInMenu = m.notShowInMenu === undefined ? false : m.notShowInMenu;
  if (m.nodes) {
    returnModule.nodes = {};
    Object.entries(m.nodes).forEach(
      ([name, node]: [name: string, node: any]) => {
        returnModule.nodes![name] = {
          notShowInMenu,
          ...node,
          type:
            name !== '' && name !== '__init__'
              ? // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                `${relativePath}.${node.type}`
              : node.type,
        };
      }
    );
  }

  if (m.types) {
    Object.entries(m.types).forEach(
      ([name, type]: [name: string, type: any]) => {
        const path =
          name !== '' && name !== '__init__' ? `${relativePath}.${name}` : name;
        addNewType(path, type);
      }
    );
  }
  return returnModule;
};

const loadModule = (
  obj: object,
  name: string,
  relativePath: string
): any | undefined => {
  const m = ParseModule(obj, relativePath);
  if (name === '__init__' || name === '') return { ...m.nodes };
  else if (m.nodes) {
    return {
      [`${name}`]: { __isPackage__: true, nodes: m.nodes, type: relativePath },
    };
  }
};

/*
 * LoadPackage is a function that loads a package.
 * A package is a folder that contains libraries and other packages.
 */
export const ParsePackage = (
  pkg: object,
  name: string,
  relativePath: string = ''
): any => {
  if (!('__isPackage__' in pkg)) {
    return loadModule(pkg, name, relativePath) ?? {};
  }
  const returnPkg: NodePackage = {
    __isPackage__: true,
    nodes: {},
    type: relativePath,
  };
  Object.entries(pkg).forEach(([name, lib]: [name: string, lib: any]) => {
    if (name !== '__isPackage__') {
      const n = ParsePackage(
        lib,
        name,
        name !== '__init__' ? `${relativePath}.${name}` : relativePath
      );
      if (n.__isPackage__) returnPkg.nodes[name] = n;
      else returnPkg.nodes = { ...returnPkg.nodes, ...n };
    }
  });
  return returnPkg;
};

export const LoadPackageToRegistry = (name: string, pkg: object): void => {
  const p = ParsePackage(pkg, name, name);
  if (p.__isPackage__) nodeConfigRegistry.registerNodeConfig(name, p);
  else
    Object.entries(p).forEach(([name, node]: [string, any]) => {
      nodeConfigRegistry.registerNodeConfig(name, node);
    });
};

export const LoadDefaultModule = (): void => {
  LoadPackageToRegistry('', buildin);
};
