declare module 'toposort' {
  function toposort(edges: Array<[string, string]>): string[];
  namespace toposort {
    function array(nodes: string[], edges: Array<[string, string]>): string[];
  }
  export = toposort;
}
