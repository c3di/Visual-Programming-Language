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


grayscale_image = Image.open(
    "/Users/alo/Visual-Programming-React-Component-Suite/src/editor/Grayscale_8bits_palette_sample_image.png"
)

image_mode = grayscale_image.mode
print(f"Image Mode: {image_mode}")
exif_data = grayscale_image._getexif()

sample_pixel = grayscale_image.getpixel((100, 75))
print(f"Sample Pixel Value: {sample_pixel}")

# convert to numpy array
data = asarray(grayscale_image)
print(f"As array: {data.shape}")
