import imagevisualization from './NodeTypeExtension/image visualization.json';
import imageio from './NodeTypeExtension/imageio.json';
import init from './NodeTypeExtension/Kornia/__init__.json';
import filters from './NodeTypeExtension/Kornia/filters.json';
import Path from './NodeTypeExtension/Path.json';
import torch from './NodeTypeExtension/torch.json';

import init2 from './NodeTypeExtension/sciKitImage/__init__.json';
import exposure from './NodeTypeExtension/sciKitImage/exposure.json';
import Filter_and_restoration from './NodeTypeExtension/sciKitImage/Filter_and_restoration.json';
import Segmentation from './NodeTypeExtension/sciKitImage/Segmentation.json';

import init3 from './NodeTypeExtension/NumPy/__init__.json';
import Data_Binning from './NodeTypeExtension/NumPy/Data_Binning.json';

import init4 from './NodeTypeExtension/SciPy/__init__.json';
import ndimage from './NodeTypeExtension/SciPy/ndimage.json';

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
    Filter_and_restoration,
    exposure,
  },
};

export const NumPy = {
  isPackage: true,
  subpackages: {
    __init__: init3,
    Data_Binning,
  },
};

export const SciPy = {
  isPackage: true,
  subpackages: {
    __init__: init4,
    ndimage,
  },
};

export const extensions = {
  imageio,
  'image visualization': imagevisualization,
  torch,
  Path,
  Kornia,
  sciKitImage,
  NumPy,
  SciPy,
};
