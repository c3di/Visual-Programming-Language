import type DataType from './DataType';

export interface HandleType {
  type: 'source' | 'target';
  title: string; // keep unique for each node
  connected: boolean;
  tooltip: string;
  dataType: DataType;
  defaultValue: any;
}
