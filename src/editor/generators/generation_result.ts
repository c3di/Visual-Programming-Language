import { isEqual } from 'lodash';
import { type Node } from '../types';

interface Message {
  type: string;
  message: string;
}

export class GenResult {
  messages: Message[];
  code: string;
  constructor(messages?: Message[], code?: string) {
    this.messages = messages ?? [];
    this.code = code ?? '';
  }

  add(result: GenResult): void {
    this.messages.push(...(result.messages ?? []));
    this.code = this.code === '' ? result.code : this.code + '\n' + result.code;
  }

  addMessage(message?: Message): void {
    if (message) this.messages.push(message);
  }

  addErrorMessage(msg: string): void {
    this.messages.push({ type: 'error', message: msg });
  }

  addWarningMessage(msg: string): void {
    this.messages.push({ type: 'warning', message: msg });
  }

  equals(other: GenResult): boolean {
    return this.code === other.code && isEqual(this.messages, other.messages);
  }
}

export class FunctionGenRes extends GenResult {
  imports: Set<string>;
  constructor(messages?: Message[], code?: string, imports?: Set<string>) {
    super(messages, code);
    this.imports = imports ?? new Set<string>();
  }

  add(result: NodeGenRes): void {
    super.add(result);
    this.imports = new Set([...this.imports, ...result.imports]);
  }

  equals(other: FunctionGenRes): boolean {
    return super.equals(other) && isEqual(this.imports, other.imports);
  }

  toGenResult(): GenResult {
    return new GenResult(
      this.messages,
      `${[...this.imports].join(', ')}${'\n'.repeat(this.imports.size)}${
        this.code
      }`
    );
  }
}
export class NodeGenRes extends FunctionGenRes {}

export class InputGenRes extends NodeGenRes {
  preComputeCode: string;
  constructor(
    messages?: Message[],
    code?: string,
    imports?: Set<string>,
    preComputeCode?: string
  ) {
    super(messages, code, imports);
    this.preComputeCode = preComputeCode ?? '';
  }

  add(result: InputGenRes): void {
    super.add(result);
    this.preComputeCode = this.preComputeCode + '\n' + result.preComputeCode;
  }

  equals(other: InputGenRes): boolean {
    return (
      super.equals(other) && isEqual(this.preComputeCode, other.preComputeCode)
    );
  }
}

export interface SortedFunDefs {
  hasError: boolean;
  errorMessage?: string;
  nodes: Node[];
}
