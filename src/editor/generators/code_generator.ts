import toposort from 'toposort';
import { type Node } from './../types';
import { type GenerationResult, type SortedFunDefs } from './generation_result';
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

  programToCode(program: VisualProgram): GenerationResult {
    const results: GenerationResult = {
      messages: [],
      code: '',
      imports: new Set<string>(),
    };

    const entryCheck = this.checkEntryPoint(program);
    results.messages.push(...(entryCheck.messages ?? []));

    const sortedFunDefs = this.topoSortFuncsInProgram(program);
    if (sortedFunDefs.hasError) {
      results.messages.push({
        type: 'error',
        message: sortedFunDefs.errorMessage as string,
      });
      return results;
    }

    const generation = this.functionsToCode(
      sortedFunDefs.nodeIds.map((id) => program.getNodeById(id)!),
      program
    );
    results.messages.push(...(generation.messages ?? []));
    results.code = generation.code;
    return results;
  }

  functionsToCode(funDefs: Node[], program: VisualProgram): GenerationResult {
    const results: GenerationResult = {
      messages: [],
      code: '',
      imports: new Set<string>(),
    };
    const funcCodeList = [];
    const importsSet = new Set<string>();
    for (const def of funDefs) {
      if (program.isAcyclic(def.id)) {
        results.messages.push({
          type: 'error',
          message: `Acyclic dependency found`,
        });
      }
      const generation = this.functionToCode(def, program);
      results.messages.push(...(generation.messages ?? []));
      funcCodeList.push(generation.code);
      generation.imports.forEach((i: string) => importsSet.add(i));
    }
    results.code = [...importsSet, ...funcCodeList].join('\n');
    return results;
  }

  abstract functionToCode(
    funcDefNode: Node,
    program: VisualProgram
  ): GenerationResult;

  abstract nodeToCode(node: Node, program: VisualProgram): GenerationResult;

  nodeSourceGeneration(
    node: Node,
    inputs: string[],
    outputs: string[]
  ): string {
    const nodeGenerator: string = node.data.codeGenerator;
    if (!nodeGenerator) {
      console.warn(
        `Node type:${node.data.configType as string} has no bound source code`
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

  checkEntryPoint(program: VisualProgram): GenerationResult {
    const result: GenerationResult = {
      messages: [],
      code: '',
      imports: new Set<string>(),
    };
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
      sorted = toposort(nodeAndDependency);
    } catch (e: any) {
      if (e.message.includes('node was:')) {
        const nodeId = e.message.match(/\d+/);
        return e.message.replace(
          `node was:"${nodeId[0] as string}"`,
          `node was:"${program.getNodeById(nodeId[0])!.data.title as string}"`
        );
      }
      return {
        hasError: true,
        errorMessage: e.message,
        nodeIds: [],
      };
    }
    return {
      hasError: false,
      nodeIds: sorted.map((id) => program.getNodeById(id)!.id),
    };
  };
}
