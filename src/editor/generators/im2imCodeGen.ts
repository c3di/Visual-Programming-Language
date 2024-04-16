export interface IConversion {
  convertCodeStr: string;
  convertFunctions: string[];
}

export function im2imCodeGen(
  sourceImage: string,
  sourceImageDesc: string,
  targetImageDesc: string
): IConversion {
  return {
    convertCodeStr: `im2im(${sourceImage}, ${sourceImageDesc}, ${targetImageDesc})`,
    convertFunctions: ['from im2im import im2im'],
  };
}
