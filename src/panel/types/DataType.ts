import { type HandleType } from 'reactflow';

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

export const getMaxConnection = (
  handletype: HandleType,
  type: DataType
): number => {
  switch (handletype) {
    case 'source':
      return type === DataType.exec ? 1 : Number.POSITIVE_INFINITY;
    case 'target':
      return type === DataType.exec ? Number.POSITIVE_INFINITY : 1;
    default:
      return 0;
  }
};
