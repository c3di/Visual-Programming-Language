interface Message {
  type: string;
  message: string;
}
export interface GenerationResult {
  messages: Message[];
  code: string;
  imports: Set<string>;
}

export interface GenerationResultOfInput extends GenerationResult {
  preComputeCode?: string;
}

export interface SortedFunDefs {
  hasError: boolean;
  errorMessage?: string;
  nodeIds: string[];
}

export const pushGenerationResultTo = (
  from: GenerationResult,
  to: GenerationResult
): void => {
  to.messages.push(...from.messages);
  to.imports = new Set([...to.imports, ...from.imports]);
  to.code = to.code + from.code;
};
