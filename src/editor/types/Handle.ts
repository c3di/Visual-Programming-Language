export interface Handle {
  title?: string;
  connection?: number;
  tooltip?: string;
  dataType?: string | string[];
  defaultValue?: any;
  value?: any;
  showWidget?: boolean;
  showTitle?: boolean;
  deletable?: boolean;
  beWatched?: boolean;
  imageDomId?: string;
}
