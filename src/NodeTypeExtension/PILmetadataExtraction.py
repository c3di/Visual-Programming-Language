from PIL import Image
from PIL import ExifTags
from numpy import asarray

image = Image.open(
    "/Users/alo/Visual-Programming-React-Component-Suite/src/editor/Fujifilm_FinePix6900ZOOM.jpg"
)

image_mode = image.mode
print(f"Image Mode: {image_mode}")
exif_data = image._getexif()

sample_pixel = image.getpixel((0, 0))
print(f"Sample Pixel Value: {sample_pixel}")

# convert to numpy array
data = asarray(image)
print(f"As array: {data.shape}")

for tag_id in exif_data:
    # get the tag name, instead of human unreadable tag id
    tag = ExifTags.TAGS.get(tag_id, tag_id)
    data = exif_data.get(tag_id)
    # print out readable info
    print(f"{tag}: {data}")
