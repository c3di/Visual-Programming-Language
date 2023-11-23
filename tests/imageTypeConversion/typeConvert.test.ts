import {
  IImageConfig,
  ImageTypeConversionGraph,
  ImageTypeConverter,
  Node,
} from '../../src/editor/ImageTypeConversion';
import { flattenConfigToMetadata } from '../../src/editor/ImageTypeConversion/types';
import { pythonGenerator } from '../../src/editor/generators';
import { getConversionGraphTestData } from '../data/conversionGraphTestData';

describe('ImageTypeConverter', () => {
  let cvtGraph: ImageTypeConversionGraph;
  let imageTypeConverter: ImageTypeConverter;
  let codeGenerator = pythonGenerator;

  beforeEach(() => {
    cvtGraph = getConversionGraphTestData();
    imageTypeConverter = new ImageTypeConverter(cvtGraph);
  });

  test('getConversion should correctly generate conversion code', () => {
    const startDataType = 'dataType1';
    const goalImage: IImageConfig = {
      dataType: 'dataType5',
      metadata: [
        {
          colorChannel: ['rgb', 'gbr'],
          channelOrder: 'channelLast',
          isMiniBatched: true,
          intensityRange: ['0-255', '0-1'],
          device: ['cpu'],
        },
      ],
    };
    const startImageVar = 'imageVar5';

    const conversion = imageTypeConverter.getConversion(
      startDataType,
      goalImage,
      startImageVar,
      codeGenerator
    );

    expect(conversion).toBeDefined();
    const convertValue = codeGenerator.generateJsonParseCode(
      JSON.stringify(flattenConfigToMetadata(goalImage))
    );
    expect(conversion.convertCodeStr).toBe(
      `convert5_to_5(2_to_5(1_to_2(${startImageVar})), ${convertValue.code})`
    );
    expect(conversion.convertFunctions.length).toBe(4);

    const getEdge = (graph: ImageTypeConversionGraph, from: Node, to: Node) => {
      return graph.adjacencyList!.get(from)!.find((e) => e.to === to)!;
    };

    expect(conversion.convertFunctions[0]).toBe(
      getEdge(
        cvtGraph,
        cvtGraph.getNode('dataType1')!,
        cvtGraph.getNode('dataType2')!
      ).interConvertCode.function
    );
    expect(conversion.convertFunctions[1]).toBe(
      getEdge(
        cvtGraph,
        cvtGraph.getNode('dataType2')!,
        cvtGraph.getNode('dataType5')!
      ).interConvertCode.function
    );
    expect(conversion.convertFunctions[2]).toBe(
      cvtGraph.getNode('dataType5')!.intraConvertCode.function
    );
    expect(conversion.convertFunctions[3]).toBe(convertValue.dependent);
  });

  test('getConversion should handle conversion from the same dataType to itself', () => {
    const startDataType = 'dataType6';
    const goalImage: IImageConfig = {
      dataType: 'dataType6',
      metadata: [
        {
          colorChannel: ['rgb', 'gbr'],
          channelOrder: 'channelLast',
          isMiniBatched: true,
          intensityRange: ['0-255', '0-1'],
          device: ['cpu'],
        },
      ],
    };
    const startImageVar = 'imageVar6';

    const conversion = imageTypeConverter.getConversion(
      startDataType,
      goalImage,
      startImageVar,
      codeGenerator
    );

    const convertValue = codeGenerator.generateJsonParseCode(
      JSON.stringify(flattenConfigToMetadata(goalImage))
    );
    expect(conversion.convertCodeStr).toBe(
      `convert6_to_6(${startImageVar}, ${convertValue.code})`
    );
    expect(conversion.convertFunctions.length).toBe(2);
    expect(conversion.convertFunctions[0]).toBe(
      cvtGraph.getNode('dataType6')!.intraConvertCode.function
    );
    expect(conversion.convertFunctions[1]).toBe(convertValue.dependent);
  });

  test('getConversion should handle non-existent dataType conversion', () => {
    const startDataType = 'dataType5';
    const goalImage: IImageConfig = {
      dataType: 'dataType8',
      metadata: [
        {
          colorChannel: ['rgb', 'gbr'],
          channelOrder: 'channelLast',
          isMiniBatched: true,
          intensityRange: ['0-255', '0-1'],
          device: ['cpu'],
        },
      ],
    };
    const startImageVar = 'imageVar5';

    const conversion = imageTypeConverter.getConversion(
      startDataType,
      goalImage,
      startImageVar,
      codeGenerator
    );

    expect(conversion.convertFunctions.length).toBe(0);
    expect(conversion.convertCodeStr).toBe(startImageVar);
  });
});
