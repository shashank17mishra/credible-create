from PIL import Image
import numpy as np

img = Image.open("image.png")
data = np.array(img)
alpha = data[:, :, 3]

# Find bounding box of non-transparent pixels
non_transparent = np.where(alpha > 0)
if len(non_transparent[0]) > 0:
    min_y, max_y = np.min(non_transparent[0]), np.max(non_transparent[0])
    min_x, max_x = np.min(non_transparent[1]), np.max(non_transparent[1])
    width = max_x - min_x + 1
    height = max_y - min_y + 1
    print(f"Foreground Bounding Box: x=[{min_x}, {max_x}], y=[{min_y}, {max_y}]")
    print(f"Foreground Size: {width}x{height} (aspect ratio = {width/height:.3f})")
else:
    print("No foreground found.")
