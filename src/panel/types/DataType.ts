import { type HandleType } from 'reactflow';

export const DataTypes: Record<string, any> = {
  float: {},
  integer: {},
  boolean: {},
  string: {},
  exec: {},
  any: {},
};
export default DataTypes;

export function addNewType(type: string, options: any): void {
  DataTypes[type] = options;
}

export function isDataTypeMatch(type1: string, type2: string): boolean {
  return type1 === type2 || type1 === 'any' || type2 === 'any';
}

export const getMaxConnection = (
  handletype: HandleType,
  type: string
): number => {
  switch (handletype) {
    case 'source':
      return type === 'exec' ? 1 : Number.POSITIVE_INFINITY;
    case 'target':
      return type === 'exec' ? Number.POSITIVE_INFINITY : 1;
    default:
      return 0;
  }
};
