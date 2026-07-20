from PIL import Image
import numpy as np

img = Image.open("image.png")
data = np.array(img)
alpha = data[:, :, 3]

# Count transparent vs opaque pixels
total_pixels = alpha.size
transparent_pixels = np.sum(alpha == 0)
opaque_pixels = np.sum(alpha == 255)
semi_transparent = np.sum((alpha > 0) & (alpha < 255))

print(f"Total Pixels: {total_pixels}")
print(f"Fully Transparent Pixels (Alpha=0): {transparent_pixels} ({transparent_pixels/total_pixels*100:.2f}%)")
print(f"Fully Opaque Pixels (Alpha=255): {opaque_pixels} ({opaque_pixels/total_pixels*100:.2f}%)")
print(f"Semi-Transparent Pixels (0<Alpha<255): {semi_transparent} ({semi_transparent/total_pixels*100:.2f}%)")

# Check if corners are transparent
corners = [alpha[0, 0], alpha[0, -1], alpha[-1, 0], alpha[-1, -1]]
print(f"Corners Alpha values: {corners}")
