# Image Data Conversion in Visual Programming via a Knowledge Graph

[TOC]

![Code Generation of Image Data Conversion in Visual Programming](.\screenshots\Automatic_Image_Data_Transitions_via_a_Configurable_Knowledge_Graph.jpg)



Integrating various libraries such as PyTorch, Scipy-image, and OpenCV in image processing programs presents a challenge due to differing image data representations. Image processing kernels generally accept an abstract "image" type, but actual data formats can vary widely, including numpy arrays, PIL images, torch tensors, or raw pointers on different platforms. This variability extends to color channels (RGB, BGR, or Grayscale),  channel order conventions ("channel first" or "channel last"), color depth, and value ranges (0.0-1.0 or 0-255). Individual images might be concatenated into mini batches. Our solution aims to automate the conversion code generation of image data using a preconfigured knowledge graph, reducing the manual, error-prone effort typically involved in such processes.

## `Image` Data Definition

To simplify adapting to different library data structures and enable automatic interoperability, we propose a common image data format in Python, `Image`. Its structure is as follows:

``` python
from typing import Literal
metadata = {
    'colorChannel': Literal['rgb', 'gbr', 'grayscale'],
    'channelOrder': Literal['none', 'channelFirst', 'channelLast'],
    'isMiniBatched': bool,
    'intensityRange': Literal['0-255', '0-1'],
    'device': Literal['cpu', 'gpu']
}

image = {
    'dataType': 'string',  # Replace 'string' with the actual data type
    'value': None,         # Replace None with the actual value
    'metadata': metadata
}
```

**Attributes**:

- **dataType** (`str`): A string denoting the format of the image data. Examples include "numpy.ndarray" for scientific computing, and "torch.tensor" for machine learning tasks.

- **value** (`Any`): Holds the raw image data, compatible with the structure indicated by `dataType`.

- **metadata** (`Dict`): Captures critical descriptors about the image. 
  - **colorChannel** (`str`): Specifies the color representation schema. Options include `rgb` (Red-Green-Blue), `gbr` (Green-Blue-Red), and `grayscale`.

  - **channelOrder** (`str`): Denotes the layout of color channels. Permissible values are `none` (no specific channel order), `channelFirst` (channels precede spatial dimensions), and `channelLast` (channels follow spatial dimensions).

  - **isMiniBatched** (`str`): A flag indicating whether the image data is part of a batch.

  - **intensityRange** (`str`): Defines the pixel intensity spectrum. Common values are `0-255` (8-bit depth) and `0-1` (normalized).

  - **device** (`str`): Highlights the computational platform (e.g., `cpu` or `gpu`) where the image data resides and is primed for operations.
  

## Knowledge Graph

![image-20231115170553000](screenshots/knowledge_graph.png)



### Node and Edge

**Node Structure**: Represents an `Image` with a specific `dataType`, including intraconversion functions for various specifications within the same `dataType`. For instance, a node could represent an image as a `numpy.ndarray`, another as a `torch.tensor`, and so on. Within each node, include the intraconversion functions. These functions convert different specifications (like color channels or intensity ranges) within the same `dataType`.

```python
def ndarray2ndarray(src_image, target_metadata_list):
    ...
    return target_image
```

**Edge Structure**: Edges between nodes represent interconversion functions. These are functions that convert an image from one `dataType` to another. For example, an edge would connect a `numpy.ndarray` node to a `torch.tensor` node, with the edge itself representing the function that performs this conversion.

```python
def ndarray2torch(src_image):
    ...
    return target_image
```

### Pathfinding

We utilize a Metadata Matching Priority system and A* pathfinding to navigate through possible metadata matches, ensuring efficient data conversion paths.

## Conversion Code Generation in Visual Programming

### Configuration

1. Our system replaces varying image representations with our standardized `Image` data format in the code generator for Python. For details on creating a node type, refer to our 'Node Type Specification' document.

**Output Replacement**

**Before**

```typescript
function code(inputs, outputs, node, generator) {
  const code = `${outputs[1]} = torchvision.io.read_image(${inputs[1]}, ${inputs[2]})
...`;
  return code;
}
```

**After**

```typescript
function codeGenerator(inputs, outputs, node, generator) {
  const code = `${outputs[1]} = torchvision.io.read_image(${inputs[1]}, ${inputs[2]})`;
  if(inputs[2] === "ImageReadMode.RGB")
    // use Image data type
  	code = code + `
${outputs[1]} = {
  'value': ${outputs[1]},
  'dataType': 'torch.tensor',
  'metadata': {
    'colorChannel': 'rgb',
    'channelOrder': 'channelFirst',
    'isMiniBatched': False,
    'intensityRange': '0-255',
    'device': 'cpu'
  }
}`;
  else if("...")
    code = code + "...";
  else if("...")
    code = code + "...";
  code = code + "...";
  return code;
}
```

return different images for different cases.

**Input Replacement**

**Before**

```typescript
function codeGenerator(inputs, outputs, node, generator) {
  const code = `${outputs[1]} = matplotlib.pyplot.imshow(${inputs[1]}, ${inputs[2]})
...`;
  return code;
}
```

**After**

```typescript
function codeGenerator(inputs, outputs, node, generator) {
  const code = `${outputs[1]} = matplotlib.pyplot.imshow(${inputs[1]}['value'], ${inputs[2]})
...`;
  return code;
}
```

2. Node Type Specification

**When `Image` is as the output**, add `"dataType"` in the `defaultValue`. 

For example,  the `torchvision.io.read_image` node anticipates an output image that is `torch.tensor` type.

```json
{
  "torchvision.io.read_image": {
    "...": "...",
    "codeGenerator": "",
    "outputs": {
      "...": "...",
      "image": {
        "title": "image",
        "dataType": "image",
        "defaultValue": {
          "dataType": "torch.tensor"
        }
      }
    }
  }
}
```



**When `Image` is the input**, specify accepted metadata. 

**Node**: There could be several possible values for `colorChannel`, `intensityRange`, so we use list here.

For example, the `matplotlib.imshow` node anticipates an input image that is either RGB (with shape H x W x C) or grayscale (with shape H x W). Both images are based on the numpy array format and are expected to be non-batched, 8-bit images processed on the CPU.

```json
{
  "matplotlib.pyplot.imshow": {
    "...": "...",
    "codeGenerator": "",
    "inputs": {
      "image": {
        "title": "image",
        "dataType": "image",
        "defaultValue": {
          "dataType": "numpy.ndarray",
          "metadata": [
            {
              "colorChannel": [
                "rgb",
                "grayscale"
              ],
              "channelOrder": "channelLast",
              "isMiniBatched": false,
              "intensityRange": [
                "0-255",
                "0-1"
              ],
              "device": ["cpu", "gpu"]
            }
          ]
        }
      }
    }
  }
}
```



### Conversion Code Generation Algorithm

please check the 'src/editor/ImageTypeConversion/TypeConverter'

## Knowledge Graph Extension in Visual Programming

Following is the example for how to add new image type including the image type name

```json
{
  "description": "image conversion",
  "imageTypeConversion": {
    "imageTypes": [
      {
        "name": "numpy.ndarray",
        "functionName": "numpyndarray2numpyndarray",
        "function": "function numpyndarray2numpyndarray() { #... return 'numpyndarray2numpyndarray'; }"
      },
      {
        "name": "torch.tensor",
        "functionName": "torchtensor2torchtensor",
        "function": "function torchtensor2torchtensor() { #... return 'torchtensor2torchtensor'; }"
      }
    ],
    "ImageTypeConversions": [
      {
        "from": "numpy.ndarray",
        "to": "torch.tensor",
        "functionName": "numpyndarrayToTorchtensor",
        "function": "function numpyndarrayToTorchtensor() { #... return 'numpyndarrayToTorchtensor'; }"
      },
      {
        "from": "torch.tensor",
        "to": "numpy.ndarray",
        "functionName": "torchtensorToNumpyndarray",
        "function": "function torchtensorToNumpyndarray() { #... return 'torchtensorToNumpyndarray'; }"
      }
    ]
  }
}

```



