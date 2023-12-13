// Config is used in the Node Specification
export interface IImageConfigMetadata {
  colorChannel: Array<'rgb' | 'gbr' | 'grayscale'>;
  channelOrder: 'none' | 'channelFirst' | 'channelLast';
  isMiniBatched: boolean;
  intensityRange: Array<'0-255' | '0-1'>;
  device: Array<'cpu' | 'gpu'>;
}

export interface IImageConfig {
  dataType: string;
  metadata: IImageConfigMetadata[];
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
  const configMetaData = config.metadata;
  for (let i = 0; i < configMetaData.length; i++) {
    const configItem = configMetaData[i];
    configItem.colorChannel.forEach((colorChannel) => {
      configItem.intensityRange.forEach((intensityRange) => {
        configItem.device.forEach((device) => {
          metadata.push({
            colorChannel,
            channelOrder: configItem.channelOrder,
            isMiniBatched: configItem.isMiniBatched,
            intensityRange,
            device,
          });
        });
      });
    });
  }
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
