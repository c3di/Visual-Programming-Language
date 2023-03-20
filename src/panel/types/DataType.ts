export enum DataType {
  float = 'float',
  int = 'int',
  bool = 'bool',
  string = 'string',
  exec = 'exec',
  any = 'any',
}
export default DataType;
export function isDataTypeMatch(type1: DataType, type2: DataType): boolean {
  return type1 === type2 || type1 === DataType.any || type2 === DataType.any;
}
