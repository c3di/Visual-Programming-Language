import { ImageTypeConversionGraph } from './TypeConversionGraph';
import { ImageTypeConverter } from './TypeConverter';

export const imageTypeConversionGraph = new ImageTypeConversionGraph();
export const imageTypeConverter = new ImageTypeConverter(
  imageTypeConversionGraph
);
export { Edge, ImageTypeConversionGraph, Node } from './TypeConversionGraph';
export { ImageTypeConverter } from './TypeConverter';
export type {
  IConversion,
  IConvertCodeConfig,
  IImageConfig,
  IImageMetadata,
} from './types';
