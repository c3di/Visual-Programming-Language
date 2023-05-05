import level1 from './NodeTypeExtension/extension1/__init__.json';
import module1 from './NodeTypeExtension/extension1/module1.json';
import level2 from './NodeTypeExtension/extension1/Level2/__init__.json';
import module2 from './NodeTypeExtension/extension1/Level2/module2.json';
import module3 from './NodeTypeExtension/extension1/Level2/Level3/module3.json';
import module from './NodeTypeExtension/extension2.json';

export const packageExample = {
  isPackage: true,
  subpackages: {
    __init__: level1,
    module1,
    Level2: {
      isPackage: true,
      subpackages: {
        __init__: level2,
        module2,
        Level3: {
          isPackage: true,
          subpackages: {
            module3,
          },
        },
      },
    },
  },
};

export const packageExample2 = module;

export const extensions = {
  package1: packageExample,
  package2: packageExample2,
};
