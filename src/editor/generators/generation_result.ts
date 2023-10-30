interface Message {
  type: string;
  message: string;
}
export interface GenerationResult {
  messages: Message[];
  code: string;
}

export interface FunctionGenerationResult extends GenerationResult {
  imports: Set<string>;
}

export interface SortedFunDefs {
  hasError: boolean;
  errorMessage: string;
  nodeIds: string[];
}
