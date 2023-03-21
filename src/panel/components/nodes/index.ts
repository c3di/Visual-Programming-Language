import CustomeNode from './CustomNode';
import FunctionNode from './FunctionNode';
import GetterNode from './GetterNode';
import SetterNode from './SetterNode';

const nodeTypes = {
  custom: CustomeNode,
  function: FunctionNode,
  getter: GetterNode,
  setter: SetterNode,
};

export default nodeTypes;
