import { type IConversion } from '../ImageTypeConversion';
import { type Handle } from '../types/Handle';
import { type Node } from './../types';
import { CodeGenerator } from './code_generator';
import { FunctionGenRes, InputGenRes, NodeGenRes } from './generation_result';
import { type VisualProgram } from './visual_program';

export class PythonGenerator extends CodeGenerator {
  name: string = 'PythonGenerator';
  indent: string = '  ';
  captureImageFunction: { functionName: string; function: string } | undefined;
  commInJupyterLab: { functionName: string; function: string } | undefined;

  functionToCode(funcDefNode: Node, program: VisualProgram): FunctionGenRes {
    return this.nodeToCode(funcDefNode, program);
  }

  nodeToCode(node: Node | undefined, program: VisualProgram): NodeGenRes {
    const result = new NodeGenRes();
    if (node === undefined) return result;
    const prerequisiteCodeOfInputs: string[] = [];

    const inputs = [];
    for (const id in node.data.inputs ?? {}) {
      const inputGenResult = this.getInputValueOfNode(node, id, program);
      result.addImports(inputGenResult.imports);
      inputs.push(inputGenResult.code);
      if (
        inputGenResult.prerequisiteCode &&
        !prerequisiteCodeOfInputs.includes(inputGenResult.prerequisiteCode)
      ) {
        prerequisiteCodeOfInputs.push(inputGenResult.prerequisiteCode);
      }
    }

    const outputs = [];
    for (const id in node.data.outputs ?? {}) {
      const outputGenResult = this.getOutputValueOfNode(node, id, program);
      result.addImports(outputGenResult.imports);
      outputs.push(outputGenResult.code);
    }

    if (node.data.externalImports) {
      for (const requiredImport of node.data.externalImports.split('\n')) {
        result.imports.add(requiredImport);
      }
    }

    result.code += [
      ...prerequisiteCodeOfInputs,
      this.nodeSourceGeneration(node, inputs, outputs),
    ].join('\n');

    const outputValues: Handle[] = Object.values(node.data.outputs ?? {});
    for (let index = 0; index < outputValues.length; index++) {
      const output: Handle = outputValues[index];
      if (!output.beWatched) continue;
      result.add(
        this.captureImageCode(
          output.defaultValue.dataType,
          outputs[index],
          output.imageDomId ?? ''
        )
      );
    }
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
    if (!program.isConnected(node.id, 'input', inputId)) {
      const value = input.value ?? input.defaultValue ?? '';
      result.code = this.widgetValueToLanguageValue(input.dataType, value);
      return result;
    }
    const incomingNode: Node = program.getIncomingNodes(node.id, inputId)[0]; // only one input is allowed
    const outputHandle = program.getSourceHandleConnectedToTargetHandle(
      incomingNode.id,
      node.id,
      inputId
    );
    result.code = this._getUniqueNameOfHandle(incomingNode, outputHandle!);
    if (input.dataType === 'image') {
      const output = incomingNode.data.outputs[outputHandle!];
      const conversion = this.imageTypeConvert!.getConversion_v2(
        result.code,
        this.imageTypeDesc(output),
        this.imageTypeDesc(input)
      );

      result.code = conversion.convertCodeStr;
      result.addImports(new Set(conversion.convertFunctions));
    }
    if (this.isExecNode(incomingNode)) {
      // if the input is connected to a exec node, then reference the output of the exec node
      return result;
    }
    // if the input is connected to a value node, then reference the output of the node
    // and add the code of the connected node as the prerequisite code
    const incomingNodeResult = this.nodeToCode(incomingNode, program);
    result.prerequisiteCode = incomingNodeResult.code;
    result.addImports(new Set(incomingNodeResult.imports ?? []));
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

  generateJsonParseCode(jsonStr: string): { dependent: string; code: string } {
    return {
      dependent: 'import json',
      code: `json.loads('${jsonStr.replace(/'/g, "\\'")}')`,
    };
  }

  captureImageCode(
    startDataType: string,
    imageVar: string,
    imageDomId: string
  ): FunctionGenRes {
    if (!this.captureImageFunction) {
      const functionName = `capture_image_${Date.now()}`;
      this.captureImageFunction = {
        functionName: `capture_image_${Date.now()}`,
        function: `def ${functionName}(comm, image, image_dom_id):
  # Save the image to a BytesIO object
  buf = PythonIO.BytesIO()
  image.save(buf, format="PNG")
  buf.seek(0)
  # Encode the buffer contents as base64
  image_base64 = base64.b64encode(buf.read()).decode("utf-8")
  buf.close()
  # image_base64 now contains the base64-encoded grayscale image
  comm.send({"image_data": image_base64, "image_dom_id": image_dom_id})`,
      };
    }
    if (!this.commInJupyterLab) {
      const functionName = `comm_${Date.now()}`;
      this.commInJupyterLab = {
        functionName,
        function: `${functionName} = create_comm(target_name='capture_image')`,
      };
    }
    const conversion: IConversion = this.imageTypeConvert!.getConversion(
      startDataType,
      {
        dataType: 'numpy.ndarray',
        metadata: [
          {
            colorChannel: ['rgb'],
            channelOrder: 'channelLast',
            isMiniBatched: false,
            intensityRange: ['0-255'],
            device: ['cpu'],
          },
          {
            colorChannel: ['grayscale'],
            channelOrder: 'none',
            isMiniBatched: false,
            intensityRange: ['0-255'],
            device: ['cpu'],
          },
        ],
      },
      imageVar,
      this
    );
    const suffix = `${Date.now()}`;
    return new FunctionGenRes(
      undefined,
      `np_img_${suffix} = ${conversion.convertCodeStr};
pil_img_${suffix} = Image.fromarray(np_img_${suffix}['value'], 'RGB' if np_img_${suffix}['metadata']['colorChannel'] == 'rgb' else 'L');
${this.captureImageFunction.functionName}(${this.commInJupyterLab.functionName}, pil_img_${suffix}, "${imageDomId}")`,
      new Set([
        'import io as PythonIO',
        'import base64',
        'from PIL import Image',
        'from comm import create_comm',
        this.commInJupyterLab.function,
        this.captureImageFunction.function,
        ...conversion.convertFunctions,
      ])
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

  widgetValueToLanguageValue(dataType: string | undefined, value: any): any {
    if (dataType === 'string') {
      if (value.includes('\n')) return this.multiline_quote(value);
      else return this.quote(value);
    }
    if (dataType === 'boolean') return value ? 'True' : 'False';
    return value;
  }

  imageTypeDesc(handle: Handle, inputs?: string[], outputs?: string[]): string {
    const imageType: string = (handle as any).image_type!;

    // eslint-disable-next-line no-eval
    const func = eval(`(${imageType})`);
    // remove the trailing new line
    return func(inputs, outputs).replace(/\n+$/, '');
  }
}
