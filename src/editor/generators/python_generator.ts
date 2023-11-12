import { type Node } from './../types';
import { CodeGenerator } from './code_generator';
import {
  InputGenRes,
  NodeGenRes,
  type FunctionGenRes,
} from './generation_result';
import { type VisualProgram } from './visual_program';

export class PythonGenerator extends CodeGenerator {
  name: string = 'PythonGenerator';
  indent: string = '  ';

  functionToCode(funcDefNode: Node, program: VisualProgram): FunctionGenRes {
    return this.nodeToCode(funcDefNode, program);
  }

  nodeToCode(node: Node | undefined, program: VisualProgram): NodeGenRes {
    const result = new NodeGenRes();
    if (node === undefined) return result;
    const preComputeOfInputs: string[] = [];

    const inputs = [];
    for (const id in node.data.inputs ?? {}) {
      const inputGenResult = this.getInputValueOfNode(node, id, program);
      result.add(inputGenResult);
      inputs.push(inputGenResult.code);
      if (
        inputGenResult.preComputeCode &&
        !preComputeOfInputs.includes(inputGenResult.preComputeCode)
      ) {
        preComputeOfInputs.push(inputGenResult.preComputeCode);
      }
    }

    const outputs = [];
    for (const id in node.data.outputs ?? {}) {
      const outputGenResult = this.getOutputValueOfNode(node, id, program);
      result.add(outputGenResult);
      outputs.push(outputGenResult.code);
    }

    if (node.data.externalImports) {
      for (const requiredImport of node.data.externalImports.split('\n')) {
        result.imports.add(requiredImport);
      }
    }

    result.code = [
      ...preComputeOfInputs,
      this.nodeSourceGeneration(node, inputs, outputs),
    ].join('\n');
    return result;
  }

  getInputValueOfNode(
    node: Node,
    inputId: string,
    program: VisualProgram
  ): InputGenRes {
    const result = new InputGenRes();
    const input = node.data.inputs[inputId];
    if (input.dataType === 'exec') return result;
    // if the input is not connected, then use the value from the widget
    if (!program.isConnected(node.id, 'input', inputId)) {
      const value = input.value ?? input.defaultValue ?? '';
      result.code = this.widgetValueToLanguageValue(input.dataType, value);
      return result;
    }
    const incomingNode = program.getIncomingNodes(node.id, inputId)[0]; // only one input is allowed
    const outputHandle = program.getSourceHandleConnectedToTargetHandle(
      incomingNode.id,
      node.id,
      inputId
    );
    result.code = this._getUniqueNameOfHandle(incomingNode, outputHandle!);
    // if the input is connected to a exec node, then reference the output of the exec node
    if (this.isExecNode(incomingNode)) {
      return result;
    }
    // if the input is connected to a value operation node, then reference the output of the node
    // and add the code of the connected node as the preComputeCode
    const incomingNodeResult = this.nodeToCode(incomingNode, program);
    result.preComputeCode = incomingNodeResult.code;
    result.imports = new Set(incomingNodeResult.imports ?? []);
    return result;
  }

  getOutputValueOfNode(
    node: Node,
    outputId: string,
    program: VisualProgram
  ): NodeGenRes {
    const output = node.data.outputs[outputId];
    if (output.dataType === 'exec') {
      const outgoingExecNode = program.getOutgoingNodes(node.id, outputId)[0];
      return this.nodeToCode(outgoingExecNode, program);
    }
    return new NodeGenRes(
      [],
      this._getUniqueNameOfHandle(node, outputId),
      new Set()
    );
  }

  _getUniqueNameOfHandle(node: Node, handleId: string): string {
    if (node.data.configType === 'setter' || node.data.configType === 'getter')
      return `${
        (node.data.outputs.setter_out?.title ??
          node.data.outputs.getter?.title) as string
      }`;
    return `n_${node.id}_${handleId}`;
  }

  /**
   * Encode a string as a properly escaped Python string, complete with quotes.
   * @param {string} string Text to encode.
   * @return {string} Python string.
   */
  quote(str: string): string {
    str = str.replace(/\\/g, '\\\\').replace(/\n/g, '\\\n');

    // Follow the CPython behaviour of repr() for a non-byte string.
    let quote = "'";
    if (str.includes("'")) {
      if (!str.includes('"')) {
        quote = '"';
      } else {
        str = str.replace(/'/g, "\\'");
      }
    }
    return quote + str + quote;
  }

  /**
   * Encode a string as a properly escaped multiline Python string, complete
   * with quotes.
   * @param {string} string Text to encode.
   * @return {string} Python string.
   */
  multiline_quote(str: string): string {
    const lines = str.split(/\n/g).map(this.quote);
    // Join with the following, plus a newline:
    // + '\n' +
    return lines.join(" + '\\n' + \n");
  }

  // todo: refactor this function
  widgetValueToLanguageValue(dataType: string | undefined, value: any): any {
    // quote for single value and multiple values
    if (value === undefined || value === null) return `None`;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    if (dataType === 'string') {
      if (value.includes('\n')) return this.multiline_quote(value);
      else return this.quote(value);
    }
    // todo: quote string or escape string
    if (dataType === 'boolean') return value ? 'True' : 'False';
    if (dataType === 'image') return this.object2PythonDict(value);
    if (Array.isArray(value))
      return `[${value
        .map((v: any) => this.widgetValueToLanguageValue(typeof v, v))
        .join(', ')}]`;
    if (dataType === 'object' && !Array.isArray(value))
      return this.object2PythonDict(value);
    return value;
  }

  object2PythonDict = (source: object): string => {
    return `{
      ${Object.entries(source)
        .map(([key, value]) => {
          return `'${key}': ${
            // use variable name directly for value property
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/restrict-template-expressions
            key !== 'value'
              ? this.widgetValueToLanguageValue(typeof value, value)
              : value === ''
              ? 'None'
              : value
          }`;
        })
        .join(', ')}
    }`;
  };
}
