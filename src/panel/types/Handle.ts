import type DataType from './DataType';

export interface Handle {
  title: string;
  connection: number;
  tooltip?: string;
  dataType: DataType;
  defaultValue?: any;
  value?: any;
}
