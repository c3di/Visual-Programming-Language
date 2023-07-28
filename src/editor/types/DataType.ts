import { type HandleType } from 'reactflow';

const getNewColor = (noIncludes: string[]): string => {
  let color = '';
  do {
    color = hsl(Math.random() * 360, Math.random() * 100, Math.random() * 100);
  } while (noIncludes.includes(color));
  return color;
};

const hsl = (
  hue: number,
  saturation: number = 80,
  lightness: number = 40
): string => {
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
export interface DataType {
  defaultValue?: any;
  shownInColor: string;
  widget?: string;
  options?: any;
}

export const DataTypes: Record<string, DataType> = {
  DataType: {
    shownInColor: `${hsl(154, 26, 44)}`,
  },
  float: {
    defaultValue: 0.0,
    widget: 'NumberInput',
    shownInColor: `${hsl(240)}`,
  },
  integer: {
    defaultValue: 0,
    widget: 'IntegerInput',
    shownInColor: `${hsl(120)}`,
  },
  boolean: {
    defaultValue: false,
    widget: 'BooleanInput',
    shownInColor: `${hsl(0)}`,
  },
  string: {
    defaultValue: '',
    widget: 'TextInput',
    shownInColor: `${hsl(60)}`,
  },
  exec: { shownInColor: `${hsl(0, 0, 0)}` },
  any: { shownInColor: `${hsl(0, 0, 50)}` },
  anyDataType: { widget: 'TextInput', shownInColor: `${hsl(0, 0, 20)}` },
  ndarray: {
    defaultValue: '[]',
    widget: 'TextInput',
    shownInColor: `${hsl(300, 100, 25)}`,
  },
};

export default DataTypes;

export function addNewType(type: string, options: any): void {
  DataTypes[type] = { ...DataTypes[type], ...options };
  DataTypes[type].shownInColor =
    DataTypes[type].shownInColor ||
    getNewColor(Object.values(DataTypes).map((dt) => dt.shownInColor));
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
