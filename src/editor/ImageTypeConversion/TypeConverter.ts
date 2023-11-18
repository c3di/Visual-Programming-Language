import { type CodeGenerator } from '../generators';
import { type ImageTypeConversionGraph } from './TypeConversionGraph';
import {
  flattenConfigToMetadata,
  type IConversion,
  type IConvertCodeConfig,
  type IImageConfig,
} from './types';

export class ImageTypeConverter {
  cvtGraph: ImageTypeConversionGraph;
  constructor(cvtGraph: ImageTypeConversionGraph) {
    this.cvtGraph = cvtGraph;
  }

  getConversion(
    startDataType: string,
    goalImage: IImageConfig,
    startImageVar: string,
    codeGenerator: CodeGenerator
  ): IConversion {
    const convertCodeConfigs = this.generateConversionConfigs(
      startDataType,
      goalImage.dataType
    );
    return this.cvtConfigsToConversion(
      goalImage,
      convertCodeConfigs,
      startImageVar,
      codeGenerator
    );
  }

  private generateConversionConfigs(
    startDataType: string,
    goalDataType: string
  ): IConvertCodeConfig[] {
    const convertCodeConfigs: IConvertCodeConfig[] = [];
    const path = this.cvtGraph.shortestPath(startDataType, goalDataType);
    if (path.length === 0) return convertCodeConfigs;

    for (let i = 0; i < path.length - 1; i++) {
      const fromNode = path[i];
      const toNode = path[i + 1];

      // Find the edge that corresponds to this step in the path
      const edge = this.cvtGraph.adjacencyList
        .get(fromNode)
        ?.find((e) => e.to === toNode);
      if (edge) {
        convertCodeConfigs.push(edge.interConvertCode);
      } else {
        throw new Error(
          `No edge found from ${fromNode.dataType} to ${toNode.dataType}`
        );
      }
    }

    const lastNode = path[path.length - 1];
    convertCodeConfigs.push(lastNode.intraConvertCode);
    return convertCodeConfigs;
  }

  private cvtConfigsToConversion(
    goalImage: IImageConfig,
    convertCodeConfigs: IConvertCodeConfig[],
    startImageVar: string,
    codeGenerator: CodeGenerator
  ): IConversion {
    let input = startImageVar;
    if (convertCodeConfigs.length === 0) {
      return {
        convertCodeStr: input,
        convertFunctions: [],
      };
    }

    for (let i = 0; i < convertCodeConfigs.length - 1; i++) {
      input = `${convertCodeConfigs[i].functionName}(${input})`;
    }
    const valueConvert: { dependent: string; code: string } =
      codeGenerator.generateJsonParseCode(
        JSON.stringify(flattenConfigToMetadata(goalImage))
      );
    const codeStr = `${
      convertCodeConfigs[convertCodeConfigs.length - 1].functionName
    }(${input}, ${valueConvert.code})`;
    const dependentFunctions = convertCodeConfigs.map(
      (config) => config.function
    );
    if (valueConvert.dependent !== '')
      dependentFunctions.push(valueConvert.dependent);
    return {
      convertCodeStr: codeStr,
      convertFunctions: dependentFunctions,
    };
  }
}
