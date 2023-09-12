import level1 from './NodeTypeExtension/extension1/__init__.json';
import level2 from './NodeTypeExtension/extension1/Level2/__init__.json';
import module2 from './NodeTypeExtension/extension1/Level2/module2.json';
import module3 from './NodeTypeExtension/extension1/Level2/Level3/module3.json';
import module from './NodeTypeExtension/extension2.json';
import imageio from './NodeTypeExtension/imageio.json';
import imagevisualization from './NodeTypeExtension/image visualization.json';
import torch from './NodeTypeExtension/torch.json';
import Path from './NodeTypeExtension/Path.json';
import init from './NodeTypeExtension/Kornia/__init__.json';
import init2 from './NodeTypeExtension/sciKitImage/__init__.json';
import filters from './NodeTypeExtension/Kornia/filters.json';
import Segmentation from './NodeTypeExtension/sciKitImage/Segmentation.json';

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

export const Kornia = {
  isPackage: true,
  subpackages: {
    __init__: init,
    filters,
  },
};

export const sciKitImage = {
  isPackage: true,
  subpackages: {
    __init__: init2,
    Segmentation,
  },
};

export const extension2 = module;

export const extensions = {
  extension1,
  extension2,
  imageio,
  'image visualization': imagevisualization,
  torch,
  Path,
  Kornia,
  sciKitImage,
};
