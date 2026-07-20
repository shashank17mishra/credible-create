import os

# Read index.html
with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Replace CSS and JS links
content = content.replace('href="style.css"', 'href="css/style.css"')
content = content.replace("href='style.css'", "href='css/style.css'")
content = content.replace('src="script.js"', 'src="js/script.js"')
content = content.replace("src='script.js'", "src='js/script.js'")

# List of assets
assets = [
    "anshuman.png",
    "class_aerospace.png",
    "class_ai.png",
    "class_drone.png",
    "class_robotics.png",
    "harshit.png",
    "image-Photoroom.png",
    "image.png",
    "shashank.png",
    "suhani.png"
]

# Replace asset references
for asset in assets:
    # Standard replacement of file name with assets/folder name
    content = content.replace(f'"{asset}"', f'"assets/{asset}"')
    content = content.replace(f"'{asset}'", f"'assets/{asset}'")
    # Also capture raw values inside SVG image elements e.g. href="./image.png" -> href="./assets/image.png"
    content = content.replace(f'href="./{asset}"', f'href="./assets/{asset}"')
    content = content.replace(f"href='./{asset}'", f"href='./assets/{asset}'")

# Save updated index.html
with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated paths in index.html successfully!")
