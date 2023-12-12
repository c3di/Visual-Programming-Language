number_of_inputs = 8
function = "denoise_tv_chambolle"
values = True

codeGenerator = """function code(inputs, outputs, node, generator) {
  // Begin Python code generation
  const code = `from enum import Enum

# Variable for specifying the output device
output_device = 'cpu'

# Enums for different image metadata configurations
class ImageMetadata(Enum):
    BINARY = {
        'colorChannel': 'grayscale',
        'channelOrder': 'none',
        'isMiniBatched': False,
        'intensityRange': '0-1'
    }
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
def convert_metadata():
    # Replace these placeholders with the actual values from your other script
    color_channel = ${inputs[1]}['metadata']['colorChannel']
    channel_order = ${inputs[1]}['metadata']['channelOrder']
    is_mini_batched = ${inputs[1]}['metadata']['isMiniBatched']
    intensity_range = ${inputs[1]}['metadata']['intensityRange']
    device = ${inputs[1]}['metadata']['device']

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
    if metadata_type == ImageMetadata.BINARY:
        output_meta = ImageMetadata.BINARY.value
    elif metadata_type == ImageMetadata.GRAYSCALE:
        output_meta = ImageMetadata.GRAYSCALE.value
    elif metadata_type == ImageMetadata.RGB:
        output_meta = ImageMetadata.RGB.value
    elif metadata_type == ImageMetadata.GBR:
        output_meta = ImageMetadata.GBR.value
    else:
        raise ValueError('Error: Unhandled image metadata type')

    # Ensure the output metadata uses the output device
    output_meta['device'] = output_device
    return output_meta
${outputs[1]} = TODO${outputs[1]} = {
  'value': ${outputs[1]},
  'dataType': 'numpy.ndarray',
  'metadata': {
    'colorChannel': convert_metadata().get('colorChannel'),
    'channelOrder': convert_metadata().get('channelOrder'),
    'isMiniBatched': convert_metadata().get('isMiniBatched'),
    'intensityRange': convert_metadata().get('intensityRange'),
    'device': convert_metadata().get('device')
  }
}
${outputs[0]}`;
  return code;
}"""


def value():
    if values:
        return "['value']"
    else:
        return ""


def get_other_inputs(number_of_inputs):
    inputs_list = [f"${{inputs[{i}]}}" for i in range(2, number_of_inputs + 1)]
    return ", " + ", ".join(inputs_list) + ")\n"


function_call = function + "(${inputs[1]}" + value() + get_other_inputs(number_of_inputs)
complete_function = codeGenerator.replace('TODO', function_call)


# Function to print the code as it is
def print_code_as_is(code):
    print(code)


# Function to print the code as a single long string with \r\n line breaks
def print_code_single_line(code):
    single_line_function = code.replace('\n', '\\r\\n')
    print(single_line_function)


# print("Printing code as is:")
# print_code_as_is(complete_function)

# print("\n\n\nPrinting code as a single long string with \\r\\n line breaks:")
print_code_single_line(complete_function)
#test_compare_string = "function code(inputs, outputs, node, generator) {\r\n  // Begin Python code generation\r\n  const code = `from enum import Enum\r\n\r\n# Variable for specifying the output device\r\noutput_device = 'cpu'\r\n\r\n# Enums for different image metadata configurations\r\nclass ImageMetadata(Enum):\r\n    BINARY = {\r\n        'colorChannel': 'grayscale',\r\n        'channelOrder': 'none',\r\n        'isMiniBatched': False,\r\n        'intensityRange': '0-1'\r\n    }\r\n    GRAYSCALE = {\r\n        'colorChannel': 'grayscale',\r\n        'channelOrder': 'none',\r\n        'isMiniBatched': False,\r\n        'intensityRange': '0-255'\r\n    }\r\n    RGB = {\r\n        'colorChannel': 'rgb',\r\n        'channelOrder': 'channelLast',\r\n        'isMiniBatched': False,\r\n        'intensityRange': '0-255'\r\n    }\r\n    GBR = {\r\n        'colorChannel': 'gbr',\r\n        'channelOrder': 'channelLast',\r\n        'isMiniBatched': False,\r\n        'intensityRange': '0-255'\r\n    }\r\n\r\n# Function to determine the type of image metadata\r\ndef determine_metadata(meta):\r\n    for metadata in ImageMetadata:\r\n        if all(meta.get(key) == metadata.value.get(key) for key in metadata.value if key != 'device'):\r\n            return metadata\r\n    raise ValueError('Error: Unsupported or invalid image metadata configuration')\r\n\r\n# Function to extract and convert metadata\r\ndef convert_metadata():\r\n    # Replace these placeholders with the actual values from your other script\r\n    color_channel = ${inputs[1]}['metadata']['colorChannel']\r\n    channel_order = ${inputs[1]}['metadata']['channelOrder']\r\n    is_mini_batched = ${inputs[1]}['metadata']['isMiniBatched']\r\n    intensity_range = ${inputs[1]}['metadata']['intensityRange']\r\n    device = ${inputs[1]}['metadata']['device']\r\n\r\n    meta = {\r\n        'colorChannel': color_channel,\r\n        'channelOrder': channel_order,\r\n        'isMiniBatched': is_mini_batched,\r\n        'intensityRange': intensity_range,\r\n        'device': device\r\n    }\r\n\r\n    # Overwrite the device with the output device\r\n    meta['device'] = output_device\r\n\r\n    metadata_type = determine_metadata(meta)\r\n    if metadata_type is None:\r\n        raise ValueError('Error: None value encountered for metadata type')\r\n\r\n    output_meta = None\r\n    if metadata_type == ImageMetadata.BINARY:\r\n        output_meta = ImageMetadata.BINARY.value\r\n    elif metadata_type == ImageMetadata.GRAYSCALE:\r\n        output_meta = ImageMetadata.GRAYSCALE.value\r\n    elif metadata_type == ImageMetadata.RGB:\r\n        output_meta = ImageMetadata.RGB.value\r\n    elif metadata_type == ImageMetadata.GBR:\r\n        output_meta = ImageMetadata.GBR.value\r\n    else:\r\n        raise ValueError('Error: Unhandled image metadata type')\r\n\r\n    # Ensure the output metadata uses the output device\r\n    output_meta['device'] = output_device\r\n    return output_meta\r\n${outputs[1]} = white_tophat(${inputs[1]}['value'], ${inputs[2]}, ${inputs[3]})\r\n${outputs[1]} = {\r\n  'value': ${outputs[1]},\r\n  'dataType': 'numpy.ndarray',\r\n  'metadata': {\r\n    'colorChannel': convert_metadata().get('colorChannel'),\r\n    'channelOrder': convert_metadata().get('channelOrder'),\r\n    'isMiniBatched': convert_metadata().get('isMiniBatched'),\r\n    'intensityRange': convert_metadata().get('intensityRange'),\r\n    'device': convert_metadata().get('device')\r\n  }\r\n}\r\n${outputs[0]}`;\r\n  return code;\r\n}"
#print(repr(test_compare_string)[1:-1])
#print(repr(test_compare_string)[1:-1] == complete_function.replace('\n', '\\r\\n'))

