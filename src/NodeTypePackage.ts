import level1 from './NodeTypePackage/__init__.json';
import module1 from './NodeTypePackage/module1.json';
import level2 from './NodeTypePackage/Level2/__init__.json';
import module2 from './NodeTypePackage/Level2/module2.json';
import module3 from './NodeTypePackage/Level2/Level3/module3.json';

export const packageExample = {
  __isPackage__: true,
  __init__: level1,
  module1,
  Level2: {
    __isPackage__: true,
    __init__: level2,
    module2,
    Level3: {
      __isPackage__: true,
      module3,
    },
  },
};
