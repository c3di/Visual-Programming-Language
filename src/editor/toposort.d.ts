declare module 'toposort' {
  // eslint-disable-next-line @typescript-eslint/array-type
  export default function toposort(graph: [string, string][]): string[];
}
