import { imageTypeConverter } from '../../src/editor/ImageTypeConversion';
import {
  LoadDefaultModule,
  LoadPackageToRegistry,
} from '../../src/editor/extension/LoadPackageToRegistry';
import { GenResult, pythonGenerator } from '../../src/editor/generators';
import { loadVisualProgram } from '../data';
import { getConversionGraphTestData } from '../data/conversionGraphTestData';
import mockNodeExtension from '../data/mockNodeExtension.json';
import { execPythonCode } from '../execution';

interface testProgram {
  path: string;
  expected: any;
}

describe('Code Generation and Execution of Visual Program without image type', () => {
  beforeAll(() => {
    LoadDefaultModule();
  });

  const testData: testProgram[] = [
    {
      path: 'onlyMain.json',
      expected: new GenResult([], ''),
    },
    {
      path: 'nonMain.json',
      expected: new GenResult([
        { type: 'warning', message: 'No "main" entry node found' },
      ]),
    },
    {
      path: 'controlFlow.json',
      expected: new GenResult(
        [],
        `print('s')
print(54)
if True:
  print('s2')
  print(5445)
else:
  if True:
    pass
  else:
    if True:
      for n_7_index, n_7_element in enumerate([]):
        print(n_7_index)
        n_23_output = n_7_element
        print(n_23_output)
      if True:
        print(finish)
        for n_15_index in range(0, 2):
          print(n_15_index)
        print(True)
        for n_18_index, n_18_element in enumerate([]):
          for n_19_index in range(0, 2):
            if True:
              pass`
      ),
    },
    // variable declaration, get and set
    {
      path: 'variable.json',
      expected: new GenResult(
        [],
        `n_3_in_out = 2
if n_3_in_out:
  n_3_in_out = 2
  n_12_in_out = 4
  n_11_in_out = n_12_in_out
  n_10_out = n_3_in_out + 3 + n_11_in_out
  hello = n_10_out
  for n_2_index in range(0, 2):
    n_5_getter = hello
    n_15_out = n_2_index + n_5_getter
    hello = n_15_out
    n_14_setter_out = hello
  n_3_in_out = 2
  n_12_in_out = 4
  n_11_in_out = n_12_in_out
  n_10_out = n_3_in_out + 3 + n_11_in_out
  n_13_out = n_10_out - 6
  n_9_getter = hello
  n_6_out = n_13_out + n_9_getter
  hello = n_6_out
  n_7_setter_out = hello
  print(n_7_setter_out)`
      ),
    },
    // function with && without return, and nested function call
    {
      path: 'functions.json',
      expected: new GenResult(
        [],
        `def newFun_1(n_3_out_0):
  return n_3_out_0
def newFun_0(n_0_out_0):
  hello = n_0_out_0
  n_16_output = n_0_out_0
  n_10_in_1 = newFun_1(n_16_output)
  n_8_getter = hello
  n_1_output = n_10_in_1
  n_9_out = n_8_getter + 3 + n_1_output
  n_14_output = n_9_out
  return n_14_output
n_13_in_0 = newFun_0(3)
n_5_in_1 = newFun_1(n_13_in_0)
n_11_out = 3 + n_5_in_1
n_15_output = n_11_out
print(n_15_output)`
      ),
    },
  ];
  test.each(testData)('Test %s.path', async (data) => {
    const program = loadVisualProgram(data.path);
    const actual = pythonGenerator.programToCode(program);
    expect(actual.messages).toEqual(data.expected.messages);
    expect(actual.code).toEqual(data.expected.code);
    await execPythonCode(actual.code);
  });
});

describe('Code Generation and Execution of Visual Program with image type', () => {
  beforeAll(() => {
    LoadDefaultModule();
    LoadPackageToRegistry('Mock Node Extension', mockNodeExtension);
    imageTypeConverter.cvtGraph = getConversionGraphTestData();
  });

  const testData: testProgram[] = [
    {
      path: 'fixedImageConversion.json',
      expected: new GenResult(
        [],
        `def convert5_to_5(image, metalist):
  # Convert dataType5 to dataType5
  return image
import json
def 4_to_5(image):
  # Convert dataType4 to dataType5
  return image
def 5_to_2(image):
  # Convert dataType5 to torch.tensor
  return image
def 2_to_1(image):
  # Convert torch.tensor to numpy.ndarray
  return image
def convert1_to_1(image, metalist):
  # Convert numpy.ndarray to numpy.ndarray
  return image
def 3_to_4(image):
  # Convert dataType3 to dataType4
  return image
import value_image_out
import duplication
import image_plus_image
import exec_image_in
import exec_image_out
n_1_image = 'output a image'
print(convert5_to_5(n_1_image, json.loads('[{"colorChannel":"rgb","channelOrder":"channelLast","isMiniBatched":true,"intensityRange":"0-255","device":"cpu"}]')))
n_4_image = "mock image"
n_5_image = convert1_to_1(2_to_1(5_to_2(n_1_image)), json.loads('[{"colorChannel":"rgb","channelOrder":"channelLast","isMiniBatched":true,"intensityRange":"0-255","device":"cpu"}]')) + convert5_to_5(4_to_5(3_to_4(n_4_image)), json.loads('[{"colorChannel":"rgb","channelOrder":"channelLast","isMiniBatched":true,"intensityRange":"0-255","device":"cpu"}]'))
print(convert5_to_5(4_to_5(n_5_image), json.loads('[{"colorChannel":"rgb","channelOrder":"channelLast","isMiniBatched":true,"intensityRange":"0-255","device":"cpu"}]')))`
      ),
    },
  ];
  test.each(testData)('Test %s.path', async (data) => {
    const program = loadVisualProgram(data.path);
    const actual = pythonGenerator.programToCode(program);
    expect(actual.messages).toEqual(data.expected.messages);
    expect(actual.code).toEqual(data.expected.code);
  });
});

describe('Code Generation and Execution of Visual Program with dynamic image type', () => {
  beforeAll(() => {
    LoadDefaultModule();
    LoadPackageToRegistry('Mock Node Extension', mockNodeExtension);
  });

  beforeEach(() => {
    imageTypeConverter.cvtGraph = getConversionGraphTestData();
  });

  const testData: testProgram[] = [
    {
      path: 'imageConversionForReroute.json',
      expected: new GenResult(
        [],
        `def convert5_to_5(image, metalist):
  # Convert dataType5 to dataType5
  return image
import json
def 3_to_4(image):
  # Convert dataType3 to dataType4
  return image
def 4_to_5(image):
  # Convert dataType4 to dataType5
  return image
import value_image_out
import duplication
import exec_image_in
import exec_image_out
n_6_image = 'output a image'
print(convert5_to_5(n_6_image, json.loads('[{"colorChannel":"rgb","channelOrder":"channelLast","isMiniBatched":true,"intensityRange":"0-255","device":"cpu"}]')))
n_3_image = "mock image"
n_1_output = n_3_image
n_4_output = n_1_output
print(convert5_to_5(4_to_5(3_to_4(n_4_output)), json.loads('[{"colorChannel":"rgb","channelOrder":"channelLast","isMiniBatched":true,"intensityRange":"0-255","device":"cpu"}]')))`
      ),
    },
    {
      path: 'imageConversionForVariable.json',
      expected: new GenResult(
        [],
        `import value_image_out
import duplication
def 3_to_4(image):
  # Convert dataType3 to dataType4
  return image
def 4_to_5(image):
  # Convert dataType4 to dataType5
  return image
def convert5_to_5(image, metalist):
  # Convert dataType5 to dataType5
  return image
import json
import exec_image_in
import exec_image_out
n_2_image = "mock image"
ad = n_2_image
n_4_getter = ad
print(convert5_to_5(4_to_5(3_to_4(n_4_getter)), json.loads('[{"colorChannel":"rgb","channelOrder":"channelLast","isMiniBatched":true,"intensityRange":"0-255","device":"cpu"}]')))
n_6_image = 'output a image'
ad = n_6_image
n_12_setter_out = ad
n_8_getter = ad
print(convert5_to_5(n_8_getter, json.loads('[{"colorChannel":"rgb","channelOrder":"channelLast","isMiniBatched":true,"intensityRange":"0-255","device":"cpu"}]')))
n_9_image = "mock image"
ad = n_9_image
n_5_setter_out = ad
print(convert5_to_5(4_to_5(3_to_4(n_5_setter_out)), json.loads('[{"colorChannel":"rgb","channelOrder":"channelLast","isMiniBatched":true,"intensityRange":"0-255","device":"cpu"}]')))`
      ),
    },
    // because when the program was load into the scene, the datatype of the image type will be updated, otherwise cannot get the datatype of the image type, we manually check
    // unit test for this case. Will be fixed in the future
    //     {
    //       path: 'imageConversionForFunction.json',
    //       expected: new GenResult(
    //         [],
    //         `def convert5_to_5(image, metalist):
    //   # Convert dataType5 to dataType5
    //   return image
    // import json
    // import exec_image_out
    // import exec_image_in
    // import duplication
    // def 3_to_4(image):
    //   # Convert dataType3 to dataType4
    //   return image
    // def 4_to_5(image):
    //   # Convert dataType4 to dataType5
    //   return image
    // import value_image_out
    // def newFun_0(n_1_out_0):
    //   print(convert5_to_5(n_1_out_0, json.loads('[{"colorChannel":"rgb","channelOrder":"channelLast","isMiniBatched":true,"intensityRange":"0-255","device":"cpu"}]')))
    //   n_4_image = 'output a image'
    //   return n_4_image
    // n_6_image = 'output a image'
    // n_5_in_0 = newFun_0(convert5_to_5(n_6_image, json.loads('[{"colorChannel":"rgb","channelOrder":"channelLast","isMiniBatched":true,"intensityRange":"0-255","device":"cpu"}]')))
    // n_11_output = n_5_in_0
    // print(convert5_to_5(n_11_output, json.loads('[{"colorChannel":"rgb","channelOrder":"channelLast","isMiniBatched":true,"intensityRange":"0-255","device":"cpu"}]')))
    // n_9_image = "mock image"
    // n_10_output = n_9_image
    // n_7_in_0 = newFun_0(convert5_to_5(4_to_5(3_to_4(n_10_output)), json.loads('[{"colorChannel":"rgb","channelOrder":"channelLast","isMiniBatched":true,"intensityRange":"0-255","device":"cpu"}]')))`
    //       ),
    // },
  ];
  test.each(testData)('Test %s', async (data) => {
    const program = loadVisualProgram(data.path);
    console.log(program);
    const actual = pythonGenerator.programToCode(program);
    console.log(actual.code);
    expect(actual.messages).toEqual(data.expected.messages);
    expect(actual.code).toEqual(data.expected.code);
  });
});
export {};
