export enum DataTypes {
  float,
  int,
  bool,
  string,
  exec,
  any,
}
export default DataTypes;
export function isDataTypeMatch(type1: DataTypes, type2: DataTypes): boolean {
  return type1 === type2 || type1 === DataTypes.any || type2 === DataTypes.any;
}
