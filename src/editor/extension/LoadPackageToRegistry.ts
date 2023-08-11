import buildin from './buildin.json';
import flowControl from './flowControl.json';
import log from './log.json';
import { nodeConfigRegistry } from './NodeConfigRegistry';
import stringPkg from './string.json';
import floatPkg from './float.json';
import functionAndvar from './functionAndvar.json';
import collections from './collections.json';
import list from './list.json';
import tuple from './tuple.json';

import { addNewType, type NodePackage, type NodeConfig } from '../types';
/*
 * A module is a json file that contains nodes and types.
 * A package is a folder that contains libraries and other packages.
 */

export interface INodeModule {
  nodes?: Record<string, NodeConfig | NodePackage>;
  types?: Record<string, any>;
  notShowInMenu?: boolean;
  href?: string;
  description?: string;
  enable?: boolean;
}

/*
 * LoadModule is a function that loads a module.
 * A module is a json file that contains nodes and types.
 */
export const ParseModule = (m: INodeModule, relativePath: string): any => {
  const returnModule: INodeModule = {};
  const notShowInMenu = m.notShowInMenu === undefined ? false : m.notShowInMenu;
  returnModule.href = m.href;
  returnModule.description = m.description;
  returnModule.enable = m.enable;
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
      [`${name}`]: {
        isPackage: true,
        nodes: m.nodes,
        type: relativePath,
        href: m.href,
        description: m.description,
        enable: m.enable,
      },
    };
  }
};

export interface INodePackageDir {
  isPackage: boolean;
  subpackages?: Record<string, INodeModule | INodePackageDir>;
  enable?: boolean;
}
/*
 * LoadPackage is a function that loads a package.
 * A package is a folder that contains libraries and other packages.
 */
export const ParsePackage = (
  pkg: INodePackageDir | INodeModule,
  name: string,
  relativePath: string = ''
): any => {
  if (!('isPackage' in pkg)) {
    return loadModule(pkg, name, relativePath) ?? {};
  }
  const returnPkg: NodePackage = {
    isPackage: true,
    nodes: {},
    type: relativePath,
  };

  Object.entries(pkg.subpackages ?? {}).forEach(
    ([name, lib]: [name: string, lib: any]) => {
      const n = ParsePackage(
        lib,
        name,
        name !== '__init__' ? `${relativePath}.${name}` : relativePath
      );
      if (n.isPackage) returnPkg.nodes[name] = n;
      else returnPkg.nodes = { ...returnPkg.nodes, ...n };
    }
  );
  if (pkg.subpackages?.__init__) {
    const initModule = pkg.subpackages.__init__ as INodeModule;
    returnPkg.href = initModule.href;
    returnPkg.description = initModule.description;
  }
  return returnPkg;
};

export const LoadPackageToRegistry = (
  name: string,
  pkg: INodeModule | INodePackageDir
): void => {
  const p = ParsePackage(pkg, name, name);
  if (p.isPackage)
    nodeConfigRegistry.registerNodeConfig(name, {
      ...p,
      enable: !!((pkg as INodePackageDir).subpackages?.__init__ as INodeModule)
        ?.enable,
    });
  else
    Object.entries(p).forEach(([name, node]: [string, any]) => {
      nodeConfigRegistry.registerNodeConfig(name, node);
    });
};

export const LoadDefaultModule = (): void => {
  LoadPackageToRegistry('', buildin);
  LoadPackageToRegistry('Float', floatPkg);
  LoadPackageToRegistry('String', stringPkg);
  LoadPackageToRegistry('Flow Control', flowControl);
  LoadPackageToRegistry('Collections', collections);
  LoadPackageToRegistry('List', list);
  LoadPackageToRegistry('Tuple', tuple);
  LoadPackageToRegistry('Function & Variable Creation', functionAndvar);
  LoadPackageToRegistry('Log', log);
};
