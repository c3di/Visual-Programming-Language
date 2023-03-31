import FunctionNode from './FunctionNode';
import GetterNode from './GetterNode';
import SetterNode from './SetterNode';
import MathNode from './MathNode';
import MakeLiteralNode from './MakeLiteralNode';
import CommentNode from './CommentNode';
import RerouteNode from './RerouteNode';

const nodeTypes = {
  function: FunctionNode,
  getter: GetterNode,
  setter: SetterNode,
  math: MathNode,
  literal: MakeLiteralNode,
  comment: CommentNode,
  reroute: RerouteNode,
};

export default nodeTypes;
