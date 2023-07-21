import FunctionNode from './FunctionNode';
import GetterNode from './GetterNode';
import SetterNode from './SetterNode';
import MathNode from './MathNode';
import MakeLiteralNode from './MakeLiteralNode';
import CommentNode from './CommentNode';
import RerouteNode from './RerouteNode';
import StickyNoteNode from './StickyNoteNode';
import CreateVariable from './CreateVariable';
import CreateFunction from './CreateFunction';
import FunctionCall from './FunctionCall';
import Return from './Return';
import Sequence from './Sequence';
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
  createFunction: CreateFunction,
  functionCall: FunctionCall,
  sequence: Sequence,
  return: Return,
};

export default VisualNodeTypes;
