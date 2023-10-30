import { CodeGenerator } from './code_generator';

export class PythonGenerator extends CodeGenerator {
  name: string = 'PythonGenerator';
  indent: string = '  ';

  /**
   * Empty loops or conditionals are not allowed in Python.
   */
  pass: string = this.indent + 'pass';

  nodeToCode(
    nodeGenerator: string | undefined,
    inputs: any[],
    outputs: any[]
  ): string {
    if (!nodeGenerator) {
      // todo: find a title or other unique identifier for the node
      console.warn(`Node has no source code`);
      return '';
    }
    // eslint-disable-next-line no-eval
    const func = eval(`(${nodeGenerator})`);
    return func(inputs, outputs);
  }

  // todo: refactor this function
  widgetValueToLanguageValue = (
    dataType: string | undefined,
    value: any
  ): any => {
    // todo quote for single value and multiple values
    if (value === undefined || value === null) return `None`;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    if (dataType === 'string') return `'${value}'`;
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
  };

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
