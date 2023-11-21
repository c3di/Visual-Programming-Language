import { imageTypeConverter } from '../../src/editor/ImageTypeConversion';
import { PythonGenerator } from '../../src/editor/generators';
import { getConversionGraphTestData } from '../data/conversionGraphTestData';

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

    expect(result.toGenResult().code).toBe(`import io
import base64
from PIL import Image
from comm import create_comm
comm_${now} = create_comm(target_name='capture_image')}
def capture_image_${now}(comm, image, image_dom_id):
  # Save the image to a BytesIO object
  buf = io.BytesIO()
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
const np_img_${now} = ndarray2ndarray(5_to_ndarray(2_to_5(1_to_2(imageVar))), json.loads('[{"colorChannel":"rgb","channelOrder":"channelLast","isMiniBatched":false,"intensityRange":"0-255","device":"cpu"},{"colorChannel":"grayscale","channelOrder":"none","isMiniBatched":false,"intensityRange":"0-255","device":"cpu"}]'));
pil_img_${now} = Image.fromarray(np_img_${now}.value, np_img_${now}.metadata.colorChannel ==='rgb'? 'RGB', 'L');
capture_image_${now}(comm_${now}, pil_img_${now}, domId)`);
  });
});
