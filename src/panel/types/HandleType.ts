import type DataTypes from './DataTypes';

export interface HandleType {
  type: 'source' | 'target';
  title: string; // keep unique for each node
  connected: boolean;
  tooltip: string;
  dataType: DataTypes;
  defaultValue: any;
}
