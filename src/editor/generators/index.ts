import { PythonGenerator } from './python_generator';
export { type CodeGenerator } from './code_generator';
export {
  FunctionGenRes,
  GenResult,
  InputGenRes,
  NodeGenRes,
} from './generation_result';
export { PythonGenerator } from './python_generator';
export { VisualProgram } from './visual_program';

export const pythonGenerator = new PythonGenerator();
