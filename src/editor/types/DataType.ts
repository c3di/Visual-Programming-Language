import { type HandleType } from 'reactflow';

interface ImageMetadata {
  colorChannel: 'rgb' | 'gbr' | 'grayscale';
  channelOrder: 'none' | 'channelFirst' | 'channelLast';
  isMiniBatched: boolean;
  intensityRange: '0-255' | '0-1';
  device: 'cpu' | 'gpu';
}

export interface ISourceImage {
  dataType: string;
  value: any;
  metadata: ImageMetadata;
}

export interface ITargetImage {
  dataType: string;
  value: any;
  metadata: ImageMetadata[];
}

export type IImage = ISourceImage | ITargetImage;

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
    widget: 'StringInput',
    shownInColor: `${hsl(60)}`,
  },
  text: {
    defaultValue: '',
    widget: 'TextInput',
    shownInColor: `${hsl(60)}`,
  },
  exec: { shownInColor: `${hsl(0, 0, 0)}` },
  any: { shownInColor: `${hsl(0, 0, 50)}` },
  anyDataType: { widget: 'TextInput', shownInColor: `${hsl(0, 0, 50)}` },
  list: {
    defaultValue: '[]',
    widget: 'TextInput',
    shownInColor: `${hsl(300, 100, 25)}`,
  },
  tuple: {
    defaultValue: '()',
    widget: 'TextInput',
    shownInColor: `${hsl(200, 200, 25)}`,
  },
  image: {
    shownInColor: `${hsl(300, 200, 25)}`,
    defaultValue: {
      dataType: 'None',
      value: 'None',
      layout: ['bchw'],
      colorMode: ['rgb'],
      intensityRange: '0-255',
      device: 'cpu',
    },
  },
};

export default DataTypes;

export function addNewType(type: string, options: any): void {
  DataTypes[type] = { ...DataTypes[type], ...options };
  DataTypes[type].shownInColor =
    DataTypes[type].shownInColor ||
    getNewColor(Object.values(DataTypes).map((dt) => dt.shownInColor));
}

export function isDataTypeMatch(
  type1: string | string[],
  type2: string | string[]
): boolean {
  const match = (t1: string, t2: string): boolean => {
    return (
      t1 === t2 ||
      t1 === 'any' ||
      t2 === 'any' ||
      t1 === 'anyDataType' ||
      t2 === 'anyDataType'
    );
  };
  for (const t1 of Array.isArray(type1) ? type1 : [type1]) {
    for (const t2 of Array.isArray(type2) ? type2 : [type2]) {
      if (match(t1, t2)) return true;
    }
  }
  return false;
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
