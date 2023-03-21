import CustomeNode from './CustomNode';
import FunctionNode from './FunctionNode';
import GetterNode from './GetterNode';
import SetterNode from './SetterNode';
import MathNode from './MathNode';
import MakeLiteralNode from './MakeLiteralNode';

const nodeTypes = {
  custom: CustomeNode,
  function: FunctionNode,
  getter: GetterNode,
  setter: SetterNode,
  math: MathNode,
  literal: MakeLiteralNode,
};

export default nodeTypes;
