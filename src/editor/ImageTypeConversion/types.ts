// Config is used in the Node Specification
export interface IImageConfig {
  dataType: string;
  colorChannel: Array<'rgb' | 'gbr' | 'grayscale'>;
  channelOrder: 'none' | 'channelFirst' | 'channelLast';
  isMiniBatched: boolean;
  intensityRange: Array<'0-255' | '0-1'>;
  device: 'cpu' | 'gpu';
}

export interface IImageMetadata {
  colorChannel: 'rgb' | 'gbr' | 'grayscale';
  channelOrder: 'none' | 'channelFirst' | 'channelLast';
  isMiniBatched: boolean;
  intensityRange: '0-255' | '0-1';
  device: 'cpu' | 'gpu';
}

export function flattenConfigToMetadata(
  config: IImageConfig
): IImageMetadata[] {
  const metadata: IImageMetadata[] = [];
  config.colorChannel.forEach((colorChannel) => {
    config.intensityRange.forEach((intensityRange) => {
      metadata.push({
        colorChannel,
        channelOrder: config.channelOrder,
        isMiniBatched: config.isMiniBatched,
        intensityRange,
        device: config.device,
      });
    });
  });
  return metadata;
}

export interface IConvertCodeConfig {
  functionName: string;
  function: string;
}

export interface IConversion {
  convertCodeStr: string;
  convertFunctions: string[];
}
