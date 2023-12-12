import { nodeExecCheck } from '../execution';
import { loadNode } from '../loader';

type Metadata = {
  colorChannel: string;
  channelOrder: string;
  isMiniBatched: string;
  intensityRange: string;
  device: string;
};

interface testNodeData {
  jsonPath: string;
  nodeName: string;
  prepareInput: string;
  inputs: string[];
  returnVar: string;
  execTest: (inputs: any[], returnVar: any) => string;
  getExpectedCode: (
    inputs: any[],
    prepareInput: string,
    returnVar: any,
    execTest: (arg0: any, arg1: any) => any
  ) => string;
}

describe('Code Execution of Filter_and_restoration.json functions with Input Grayscale & Color', () => {
  const jsonPath = 'src/NodeTypeExtension/sciKitImage/Filter_and_restoration.json';
    const prepareInputGrayscale = `from skimage import data
import numpy as np
input_image = {
  'dataType': 'numpy.ndarray',
  'value': data.brick()[0:127, 0:131],
  'metadata': {
    'colorChannel': 'grayscale',
    'channelOrder': 'none',
    'isMiniBatched': False,
    'intensityRange': '0-255',
    'device': 'cpu'
  }
}`;
    const prepareInputRGB = `from skimage import data
import numpy as np
input_image = {
  'dataType': 'numpy.ndarray',
  'value': data.rocket()[296:427, 275:402],
  'metadata': {
    'colorChannel': 'rgb',
    'channelOrder': 'channelLast',
    'isMiniBatched': False,
    'intensityRange': '0-255',
    'device': 'cpu'
  }
}`;
    const prepareInputGBR = `from skimage import data
import numpy as np
input_image = {
  'dataType': 'numpy.ndarray',
  'value': data.rocket()[296:427, 275:402, [1, 2, 0]],
  'metadata': {
    'colorChannel': 'gbr',
    'channelOrder': 'channelLast',
    'isMiniBatched': False,
    'intensityRange': '0-255',
    'device': 'cpu'
  }
}`;
    const checkSkimageGrayscale = `(convert_metadata().get('colorChannel') == 'grayscale') and (convert_metadata().get('channelOrder') == 'none') and (convert_metadata().get('isMiniBatched') == False) and (convert_metadata().get('intensityRange') == '0-255'))`
    const checkSkimageRGB = `(convert_metadata().get('colorChannel') == 'rgb') and (convert_metadata().get('channelOrder') == 'channelLast') and (convert_metadata().get('isMiniBatched') == False) and (convert_metadata().get('intensityRange') == '0-255'))`
    const checkSkimageGBR = `(convert_metadata().get('colorChannel') == 'gbr') and (convert_metadata().get('channelOrder') == 'channelLast') and (convert_metadata().get('isMiniBatched') == False) and (convert_metadata().get('intensityRange') == '0-255'))`

    const prepareCodePart1 = `from enum import Enum

# Variable for specifying the output device
output_device = 'cpu'

# Enums for different image metadata configurations
class ImageMetadata(Enum):
    GRAYSCALE = {
        'colorChannel': 'grayscale',
        'channelOrder': 'none',
        'isMiniBatched': False,
        'intensityRange': '0-255'
    }
    RGB = {
        'colorChannel': 'rgb',
        'channelOrder': 'channelLast',
        'isMiniBatched': False,
        'intensityRange': '0-255'
    }
    GBR = {
        'colorChannel': 'gbr',
        'channelOrder': 'channelLast',
        'isMiniBatched': False,
        'intensityRange': '0-255'
    }

# Function to determine the type of image metadata
def determine_metadata(meta):
    for metadata in ImageMetadata:
        if all(meta.get(key) == metadata.value.get(key) for key in metadata.value if key != 'device'):
            return metadata
    raise ValueError('Error: Unsupported or invalid image metadata configuration')

# Function to extract and convert metadata
def convert_metadata():`

      const prepareCodePart2 = `
    meta = {
        'colorChannel': color_channel,
        'channelOrder': channel_order,
        'isMiniBatched': is_mini_batched,
        'intensityRange': intensity_range,
        'device': device
    }

    # Overwrite the device with the output device
    meta['device'] = output_device

    metadata_type = determine_metadata(meta)
    if metadata_type is None:
        raise ValueError('Error: None value encountered for metadata type')

    output_meta = None
    if metadata_type == ImageMetadata.GRAYSCALE:
        output_meta = ImageMetadata.GRAYSCALE.value
    elif metadata_type == ImageMetadata.RGB:
        output_meta = ImageMetadata.RGB.value
    elif metadata_type == ImageMetadata.GBR:
        output_meta = ImageMetadata.GBR.value
    else:
        raise ValueError('Error: Unhandled image metadata type')

    # Ensure the output metadata uses the output device
    output_meta['device'] = output_device
    return output_meta`

      const metadata = `'metadata': {
    'colorChannel': convert_metadata().get('colorChannel'),
    'channelOrder': convert_metadata().get('channelOrder'),
    'isMiniBatched': convert_metadata().get('isMiniBatched'),
    'intensityRange': convert_metadata().get('intensityRange'),
    'device': convert_metadata().get('device')
  }`;

    
  const testData: testNodeData[] = [
    {
      jsonPath,
      nodeName: 'Denoise_wavelet',
      prepareInput: prepareInputGrayscale,
      inputs: ['', 'input_image', 'None', '"db1"', '"soft"', 'None', 'False', '"BayesShrink"', 'True', 'None'],
      returnVar: 'denoise_wavelet_output_grayscale',

      execTest: (inputs: any[], returnVar: any) => `from skimage.restoration import denoise_wavelet
import numpy as np
expected = denoise_wavelet(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, channel_axis=${inputs[9]})
print(np.array_equal(expected, ${returnVar}['value']) and ${checkSkimageGrayscale}`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `from skimage.restoration import denoise_wavelet
${prepareInput}
${prepareCodePart1}
    # Replace these placeholders with the actual values from your other script
    color_channel = ${inputs[1]}['metadata']['colorChannel']
    channel_order = ${inputs[1]}['metadata']['channelOrder']
    is_mini_batched = ${inputs[1]}['metadata']['isMiniBatched']
    intensity_range = ${inputs[1]}['metadata']['intensityRange']
    device = ${inputs[1]}['metadata']['device']
${prepareCodePart2}
${returnVar} = denoise_wavelet(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, channel_axis=${inputs[9]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  ${metadata}
}
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Denoise_wavelet',
      prepareInput: prepareInputRGB,
      inputs: ['', 'input_image', 'None', '"db1"', '"soft"', 'None', 'False', '"BayesShrink"', 'True', '-1'],
      returnVar: 'denoise_wavelet_output_rgb',

      execTest: (inputs: any[], returnVar: any) => `from skimage.restoration import denoise_wavelet
import numpy as np
expected = denoise_wavelet(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, channel_axis=${inputs[9]})
print(np.array_equal(expected, ${returnVar}['value']) and ${checkSkimageRGB}`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `from skimage.restoration import denoise_wavelet
${prepareInput}
${prepareCodePart1}
    # Replace these placeholders with the actual values from your other script
    color_channel = ${inputs[1]}['metadata']['colorChannel']
    channel_order = ${inputs[1]}['metadata']['channelOrder']
    is_mini_batched = ${inputs[1]}['metadata']['isMiniBatched']
    intensity_range = ${inputs[1]}['metadata']['intensityRange']
    device = ${inputs[1]}['metadata']['device']
${prepareCodePart2}
${returnVar} = denoise_wavelet(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, channel_axis=${inputs[9]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  ${metadata}
}
${execTest(inputs, returnVar)}`
    },
    {
      jsonPath,
      nodeName: 'Denoise_wavelet',
      prepareInput: prepareInputGBR,
      inputs: ['', 'input_image', 'None', '"db1"', '"soft"', 'None', 'False', '"BayesShrink"', 'True', '-1'],
      returnVar: 'denoise_wavelet_output_gbr',

      execTest: (inputs: any[], returnVar: any) => `from skimage.restoration import denoise_wavelet
import numpy as np
expected = denoise_wavelet(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, channel_axis=${inputs[9]})
print(np.array_equal(expected, ${returnVar}['value']) and ${checkSkimageGBR}`,

      getExpectedCode: (
        inputs: any[],
        prepareInput: string,
        returnVar: any,
        execTest: (arg0: any, arg1: any) => any
      ) => `from skimage.restoration import denoise_wavelet
${prepareInput}
${prepareCodePart1}
    # Replace these placeholders with the actual values from your other script
    color_channel = ${inputs[1]}['metadata']['colorChannel']
    channel_order = ${inputs[1]}['metadata']['channelOrder']
    is_mini_batched = ${inputs[1]}['metadata']['isMiniBatched']
    intensity_range = ${inputs[1]}['metadata']['intensityRange']
    device = ${inputs[1]}['metadata']['device']
${prepareCodePart2}
${returnVar} = denoise_wavelet(input_image['value'], ${inputs[2]}, ${inputs[3]}, ${inputs[4]}, ${inputs[5]}, ${inputs[6]}, ${inputs[7]}, ${inputs[8]}, channel_axis=${inputs[9]})
${returnVar} = {
  'value': ${returnVar},
  'dataType': 'numpy.ndarray',
  ${metadata}
}
${execTest(inputs, returnVar)}`
    }
  ];

  test.each(testData)(
    'generate the code from the node $nodeName in $jsonPath',
    async ({
      jsonPath,
      nodeName,
      prepareInput,
      inputs,
      returnVar,
      execTest,
      getExpectedCode: getExpectedOutput,
    }) => {
      const node = loadNode(jsonPath, nodeName);
      const executeTest = execTest(inputs, returnVar);
      const expectedOutput = getExpectedOutput(
        inputs,
        prepareInput,
        returnVar,
        execTest
      );
      await nodeExecCheck(
        node,
        inputs,
        [executeTest, returnVar],
        expectedOutput,
        prepareInput
      );
    },
    100000
  );
});