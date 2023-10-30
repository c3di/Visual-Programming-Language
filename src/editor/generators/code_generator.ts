import toposort from 'toposort';
import { type Node } from './../types';
import { type GenerationResult, type SortedFunDefs } from './generation_result';
import { type VisualProgram } from './visual_program';

export abstract class CodeGenerator {
  abstract name: string;
  indent: string = '  ';

  checkEntryPoint(program: VisualProgram): GenerationResult {
    if (!program.getStartNode())
      return {
        messages: [
          {
            type: 'warning',
            message: 'No entry named "Exec Start"node found',
          },
        ],
        code: '',
      };
    return { messages: [], code: '' };
  }

  programToCode(program: VisualProgram): GenerationResult {
    const results: GenerationResult = { messages: [], code: '' };

    const entryCheck = this.checkEntryPoint(program);
    results.messages.push(...entryCheck.messages);

    const sortedFunDefs = this.topoSortFunDef(program);
    if (sortedFunDefs.hasError) {
      results.messages.push({
        type: 'error',
        message: sortedFunDefs.result,
      });
      return results;
    }

    const generation = this.functionsToCode(sortedFunDefs.sortedNodes, program);
    results.messages.push(...generation.messages);
    results.code = generation.code;
    return results;
  }

  functionsToCode(funDefs: Node[], program: VisualProgram): GenerationResult {
    const results: GenerationResult = { messages: [], code: '' };
    const funcCodeList = [];
    const importsSet = new Set<string>();
    for (const def of funDefs) {
      const generation = this.functionToCode(def, program);
      results.messages.push(...generation.messages);
      funcCodeList.push(generation.code);
      generation.imports.forEach((i: string) => importsSet.add(i));
    }
    results.code = [...importsSet, ...funcCodeList].join('\n');
    return results;
  }

  functionToCode(
    funcDefNode: Node,
    program: VisualProgram
  ): FunctionGenerationResult {
    // todo: indentLines(code)
    retrun;
  }

  abstract nodeToCode(
    nodeGenerator: string | undefined,
    inputs: any[],
    outputs: any[]
  ): string;

  /**
   * transform the value from the widget to the language specific value
   * @param dataType
   * @param value
   */
  abstract widgetValueToLanguageValue(
    dataType: string | undefined,
    value: any
  ): any;

  /**
   * Intended onto each line of code.
   * Intended for indenting code
   *
   * @param text The lines of code.
   */
  indentLines(text: string): string {
    return this.indent + text.replace(/(?!\n$)\n/g, '\n' + this.indent);
  }

  topoSortFunDef = (program: VisualProgram): SortedFunDefs => {
    /**
     * find the function definition nodes include the main function
     * and for each of them find the function call nodes and create a dependency graph,
     * then sort the graph and know the order of the function definitions
     *
     */
    const sortedFunDefs = {
      hasError: false,
      errorMessage: [],
      nodeIds: [],
    };
    const nodeAndDdependency: Array<[string, string]> = [];
    const funDefs = program.getFuncDefNodes();

    while (queue.length) {
      const nodeId = queue.shift();
      if (nodeId === undefined) continue;
      visited.push(nodeId);
      const functionCallNodes: Node[] = [];
      graphState.findFunctionCallNodes(
        graphState.getNodeById(nodeId)!,
        functionCallNodes,
        []
      );
      functionCallNodes.forEach((n) => {
        const createFunctionNodeId = n.data.nodeRef as string;
        dependencies.push([createFunctionNodeId, nodeId]);
        if (
          !visited.includes(createFunctionNodeId) &&
          !queue.includes(createFunctionNodeId)
        )
          queue.push(createFunctionNodeId);
      });
    }
    let sorted: string[] = [];
    try {
      sorted = toposort(dependencies);
    } catch (e: any) {
      if (e.message.includes('node was:')) {
        const nodeId = e.message.match(/\d+/);
        return e.message.replace(
          `node was:"${nodeId[0] as string}"`,
          `node was:"${program.getNodeById(nodeId[0])!.data.title as string}"`
        );
      }
      return e.message;
    }

    return sorted.map((id) => program.getNodeById(id)!);

    return sortedFunDefs;
  };
}
