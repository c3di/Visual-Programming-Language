import FunctionNode from './FunctionNode';
import GetterNode from './GetterNode';
import SetterNode from './SetterNode';
import MathNode from './MathNode';
import MakeLiteralNode from './MakeLiteralNode';
import CommentNode from './CommentNode';
import RerouteNode from './RerouteNode';
import StickyNoteNode from './StickyNoteNode';
import CreateVariable from './CreateVariable';
import './index.css';

const VisualNodeTypes = {
  function: FunctionNode,
  getter: GetterNode,
  setter: SetterNode,
  math: MathNode,
  literal: MakeLiteralNode,
  comment: CommentNode,
  reroute: RerouteNode,
  stickyNote: StickyNoteNode,
  createVariable: CreateVariable,
};

export default VisualNodeTypes;
