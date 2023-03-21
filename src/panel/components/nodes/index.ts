import CustomeNode from './CustomNode';
import FunctionNode from './FunctionNode';
import GetterNode from './GetterNode';
import SetterNode from './SetterNode';
import MathNode from './MathNode';

const nodeTypes = {
  custom: CustomeNode,
  function: FunctionNode,
  getter: GetterNode,
  setter: SetterNode,
  math: MathNode,
};

export default nodeTypes;
