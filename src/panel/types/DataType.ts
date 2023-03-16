export enum DataType {
  float,
  int,
  bool,
  string,
  exec,
  any,
}
export default DataType;
export function isDataTypeMatch(type1: DataType, type2: DataType): boolean {
  return type1 === type2 || type1 === DataType.any || type2 === DataType.any;
}
