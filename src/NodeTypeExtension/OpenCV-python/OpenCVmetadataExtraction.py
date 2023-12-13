import cv2

# Load an image
image = cv2.imread(
    "/Users/alo/Visual-Programming-React-Component-Suite/src/editor/Fujifilm_FinePix6900ZOOM.jpg"
)

shape = image.shape
print("Shape of the image: ", shape)

grayscale_image = cv2.imread(
    "/Users/alo/Visual-Programming-React-Component-Suite/src/editor/Grayscale_8bits_palette_sample_image.png",
    cv2.IMREAD_GRAYSCALE,
)
grayscale_shape = grayscale_image.shape
print("Shape of the grayscale image:", grayscale_shape)
