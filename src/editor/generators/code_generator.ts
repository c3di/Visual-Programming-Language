import toposort from 'toposort';
import { type Node } from './../types';
import {
  FunctionGenRes,
  GenResult,
  type NodeGenRes,
  type SortedFunDefs,
} from './generation_result';
import { type VisualProgram } from './visual_program';

export abstract class CodeGenerator {
  abstract name: string;
  indent: string = '  ';

  isExecNode(node: Node): boolean {
    for (const output of Object.values(node.data.outputs ?? {})) {
      if ((output as any).dataType === 'exec') return true;
    }
    for (const input of Object.values(node.data.inputs ?? {})) {
      if ((input as any).dataType === 'exec') return true;
    }
    return false;
  }

  programToCode(program: VisualProgram): GenResult {
    const result = new GenResult();
    const entryCheck = this.checkEntryPoint(program);
    result.add(entryCheck);
    const sortedFunDefs = this.topoSortFuncsInProgram(program);
    if (sortedFunDefs.hasError) {
      result.addErrorMessage(sortedFunDefs.errorMessage!);
      return result;
    }
    const funcsGen = this.functionsToCode(sortedFunDefs.nodes, program);
    result.add(funcsGen.toGenResult());
    return result;
  }

  functionsToCode(funDefs: Node[], program: VisualProgram): FunctionGenRes {
    const result = new FunctionGenRes();
    for (const def of funDefs) {
      if (!program.isAcyclic(def.id)) {
        result.addErrorMessage('Cycle Dependency Detected in Acyclic Graph');
        return result;
      }
      const genResult = this.functionToCode(def, program);
      result.add(genResult);
    }
    return result;
  }

  abstract functionToCode(
    funcDefNode: Node,
    program: VisualProgram
  ): FunctionGenRes;

  abstract nodeToCode(
    node: Node | undefined,
    program: VisualProgram
  ): NodeGenRes;

  nodeSourceGeneration(
    node: Node,
    inputs: string[],
    outputs: string[]
  ): string {
    const nodeGenerator: string = node.data.codeGenerator;
    if (!nodeGenerator) {
      console.warn(
        `Node type:${node.data.configType as string} has no source code`
      );
      return '';
    }
    // eslint-disable-next-line no-eval
    const func = eval(`(${nodeGenerator})`);
    return func(inputs, outputs, node, this);
  }

  /**
   * transform the value from the widget to the language specific value
   * @param dataType
   * @param value
   */
  abstract widgetValueToLanguageValue(
    dataType: string | undefined,
    value: any
  ): any;

  abstract _getUniqueNameOfHandle(node: Node, handleId: string): string;

  /**
   * Encode a string as a properly escaped Python string, complete with quotes.
   * @param {string} string Text to encode.
   * @return {string} Python string.
   */
  abstract quote(str: string): string;

  /**
   * Encode a string as a properly escaped multiline Python string, complete
   * with quotes.
   * @param {string} string Text to encode.
   * @return {string} Python string.
   */
  abstract multiline_quote(str: string): string;

  /**
   * Intended onto each line of code.
   * Intended for indenting code
   *
   * @param text The lines of code.
   */
  indentLines(text: string): string {
    return this.indent + text.replace(/(?!\n$)\n/g, '\n' + this.indent);
  }

  checkEntryPoint(program: VisualProgram): GenResult {
    const result = new GenResult();
    if (!program.getStartNode())
      result.messages.push({
        type: 'warning',
        message: 'No "main" entry node found',
      });
    return result;
  }

  topoSortFuncsInProgram = (program: VisualProgram): SortedFunDefs => {
    const nodeAndDependency: Array<[string, string]> = [];
    const funcs = program.getFuncDefNodes();
    for (const func of funcs) {
      const funcCalls: Node[] = program.funcCallsInFunc(func);
      for (const call of funcCalls) {
        const dependent = program.getFuncDefNodeIdByFuncCallNode(call);
        nodeAndDependency.push([dependent, func.id]);
      }
    }

    let sorted: string[] = [];
    try {
      sorted = toposort.array(
        funcs.map((n) => n.id),
        nodeAndDependency
      );
    } catch (e: any) {
      if (e.message.includes('node was:')) {
        const nodeId = e.message.match(/\d+/);
        e.message.replace(
          `node was:"${nodeId[0] as string}"`,
          `node was:"${program.getNodeById(nodeId[0])!.data.title as string}"`
        );
      }
      return {
        hasError: true,
        errorMessage: e.message,
        nodes: [],
      };
    }
    return {
      hasError: false,
      nodes: sorted.map((id) => program.getNodeById(id)!),
    };
  };
}
