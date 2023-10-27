import { type NodeConfig } from '../types';

export abstract class CodeGenerator {
  abstract name: string;
  indent: string = '  ';

  /**
   * transform the value from the widget to the language specific value
   * @param dataType
   * @param value
   */
  abstract widgetValueToLanguageValue(
    dataType: string | undefined,
    value: any
  ): any;

  abstract programToCode(visualProgram: any): string;

  abstract nodeToCode(node: NodeConfig, inputs: any[], outputs: any[]): string;

  /**
   * Intended onto each line of code.
   * Intended for indenting code
   *
   * @param text The lines of code.
   */
  indentLines(text: string): string {
    return this.indent + text.replace(/(?!\n$)\n/g, '\n' + this.indent);
  }
}
