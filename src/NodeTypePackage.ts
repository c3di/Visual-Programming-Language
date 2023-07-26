import level1 from './NodeTypeExtension/extension1/__init__.json';
import level2 from './NodeTypeExtension/extension1/Level2/__init__.json';
import module2 from './NodeTypeExtension/extension1/Level2/module2.json';
import module3 from './NodeTypeExtension/extension1/Level2/Level3/module3.json';
import module from './NodeTypeExtension/extension2.json';
import filters from './NodeTypeExtension/filters.json';
import os from './NodeTypeExtension/os.json';
import imageio from './NodeTypeExtension/imageio.json';
import matplotlib from './NodeTypeExtension/matplotlib.json';

export const extension1 = {
  isPackage: true,
  subpackages: {
    __init__: level1,
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

export const extension2 = module;

export const extensions = {
  extension1,
  extension2,
  filters,
  os,
  imageio,
  matplotlib,
};
