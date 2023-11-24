import { imageTypeConverter } from '../../src/editor/ImageTypeConversion';
import {
  LoadDefaultModule,
  LoadPackageToRegistry,
} from '../../src/editor/extension/LoadPackageToRegistry';
import { PythonGenerator } from '../../src/editor/generators';
import { Node } from '../../src/editor/types';
import { loadVisualProgram } from '../data';
import { getConversionGraphTestData } from '../data/conversionGraphTestData';
import mockNodeExtension from '../data/mockNodeExtension.json';

describe('captureImageCode', () => {
  let pythonGenerator: PythonGenerator;
  beforeEach(() => {
    imageTypeConverter.cvtGraph = getConversionGraphTestData();
    imageTypeConverter.cvtGraph.addNode({
      dataType: 'numpy.ndarray',
      intraConvertCode: {
        functionName: 'ndarray2ndarray',
        function: 'def ndarray2ndarray(image):\n  return image',
      },
    });
    imageTypeConverter.cvtGraph.addDirectedEdge(
      imageTypeConverter.cvtGraph.getNode('dataType5')!,
      imageTypeConverter.cvtGraph.getNode('numpy.ndarray')!,
      {
        functionName: '5_to_ndarray',
        function: 'def 5_to_ndarray(image):\n  return image',
      },
      1
    );

    pythonGenerator = new PythonGenerator(imageTypeConverter);
  });

  it('should correctly generate the image capture code', () => {
    const now = 1560000000000;
    const dateNowSpy = jest.spyOn(Date, 'now');
    dateNowSpy.mockReturnValue(now);
    const startDataType = 'dataType1';
    const imageVar = 'imageVar';
    const imageDomId = 'domId';
    const result = pythonGenerator.captureImageCode(
      startDataType,
      imageVar,
      imageDomId
    );

    expect(result.toGenResult().code).toBe(`import io as PythonIO
import base64
from PIL import Image
from comm import create_comm
comm_${now} = create_comm(target_name='capture_image')
def capture_image_${now}(comm, image, image_dom_id):
  # Save the image to a BytesIO object
  buf = PythonIO.BytesIO()
  image.save(buf, format="PNG")
  buf.seek(0)
  # Encode the buffer contents as base64
  image_base64 = base64.b64encode(buf.read()).decode("utf-8")
  buf.close()
  # image_base64 now contains the base64-encoded grayscale image
  comm.send({"image_data": image_base64, "image_dom_id": image_dom_id})
def 1_to_2(image):
  # Convert numpy_ndarray to torch_tensor
  return image
def 2_to_5(image):
  # Convert torch.tensor to dataType5
  return image
def 5_to_ndarray(image):
  return image
def ndarray2ndarray(image):
  return image
import json
np_img_${now} = ndarray2ndarray(5_to_ndarray(2_to_5(1_to_2(imageVar))), json.loads('[{"colorChannel":"rgb","channelOrder":"channelLast","isMiniBatched":false,"intensityRange":"0-255","device":"cpu"},{"colorChannel":"grayscale","channelOrder":"none","isMiniBatched":false,"intensityRange":"0-255","device":"cpu"}]'));
pil_img_${now} = Image.fromarray(np_img_${now}['value'], 'RGB' if np_img_${now}['metadata']['colorChannel'] == 'rgb' else 'L');
capture_image_${now}(comm_${now}, pil_img_${now}, "${imageDomId}")`);
  });

  it('should correctly generate the image capture code in the program', () => {
    LoadDefaultModule();
    LoadPackageToRegistry('Mock Node Extension', mockNodeExtension);
    const program = loadVisualProgram('watchImageInProgram.json');
    const node: Node = program.nodes[1];
    node.data.outputs['image'].beWatched = true;
    node.data.outputs['image'].imageDomId = 'imageDomId';

    const node2: Node = program.nodes[3];
    node2.data.outputs['image'].beWatched = true;
    node2.data.outputs['image'].imageDomId = 'imageDomId2';

    const actual = pythonGenerator.programToCode(program);
    expect(actual.code).toBe(`def 3_to_4(image):
  # Convert dataType3 to dataType4
  return image
def 4_to_5(image):
  # Convert dataType4 to dataType5
  return image
def convert5_to_5(image, metalist):
  # Convert dataType5 to dataType5
  return image
import json
import value_image_out
import duplication
import io as PythonIO
import base64
from PIL import Image
from comm import create_comm
comm_1560000000000 = create_comm(target_name='capture_image')
def capture_image_1560000000000(comm, image, image_dom_id):
  # Save the image to a BytesIO object
  buf = PythonIO.BytesIO()
  image.save(buf, format="PNG")
  buf.seek(0)
  # Encode the buffer contents as base64
  image_base64 = base64.b64encode(buf.read()).decode("utf-8")
  buf.close()
  # image_base64 now contains the base64-encoded grayscale image
  comm.send({"image_data": image_base64, "image_dom_id": image_dom_id})
def 5_to_ndarray(image):
  return image
def ndarray2ndarray(image):
  return image
import exec_image_in
import exec_image_out
n_1_image = 'output a image'
n_3_image = "mock image"
np_img_1560000000000 = ndarray2ndarray(5_to_ndarray(4_to_5(3_to_4(n_3_image))), json.loads('[{"colorChannel":"rgb","channelOrder":"channelLast","isMiniBatched":false,"intensityRange":"0-255","device":"cpu"},{"colorChannel":"grayscale","channelOrder":"none","isMiniBatched":false,"intensityRange":"0-255","device":"cpu"}]'));
pil_img_1560000000000 = Image.fromarray(np_img_1560000000000['value'], 'RGB' if np_img_1560000000000['metadata']['colorChannel'] == 'rgb' else 'L');
capture_image_1560000000000(comm_1560000000000, pil_img_1560000000000, "imageDomId2")
print(convert5_to_5(4_to_5(3_to_4(n_3_image)), json.loads('[{"colorChannel":"rgb","channelOrder":"channelLast","isMiniBatched":true,"intensityRange":"0-255","device":"cpu"}]')))
np_img_1560000000000 = ndarray2ndarray(5_to_ndarray(n_1_image), json.loads('[{"colorChannel":"rgb","channelOrder":"channelLast","isMiniBatched":false,"intensityRange":"0-255","device":"cpu"},{"colorChannel":"grayscale","channelOrder":"none","isMiniBatched":false,"intensityRange":"0-255","device":"cpu"}]'));
pil_img_1560000000000 = Image.fromarray(np_img_1560000000000['value'], 'RGB' if np_img_1560000000000['metadata']['colorChannel'] == 'rgb' else 'L');
capture_image_1560000000000(comm_1560000000000, pil_img_1560000000000, "imageDomId")`);
  });
});
