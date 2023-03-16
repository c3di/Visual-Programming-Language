import type DataType from './DataType';

export interface Handle {
  type: 'source' | 'target';
  title: string; // keep unique for each node
  connected: boolean;
  tooltip?: string;
  dataType?: DataType;
  defaultValue?: any;
  value?: any;
}
