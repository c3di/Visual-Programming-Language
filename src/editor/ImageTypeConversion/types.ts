// Config is used in the Node Specification
export interface IImageConfig {
  dataType: string;
  colorChannel: Array<'rgb' | 'gbr' | 'grayscale'>;
  channelOrder: 'none' | 'channelFirst' | 'channelLast';
  isMiniBatched: boolean;
  intensityRange: Array<'0-255' | '0-1'>;
  device: Array<'cpu' | 'gpu'>;
}

export interface IImageMetadata {
  colorChannel: 'rgb' | 'gbr' | 'grayscale';
  channelOrder: 'none' | 'channelFirst' | 'channelLast';
  isMiniBatched: boolean;
  intensityRange: '0-255' | '0-1';
  device: 'cpu' | 'gpu';
}

export function flattenConfigToMetadata(
  config: IImageConfig | IImageConfig[]
): IImageMetadata[] {
  const metadata: IImageMetadata[] = [];
  if (!Array.isArray(config)) config = [config];
  for (let i = 0; i < config.length; i++) {
    const configItem = config[i];
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
