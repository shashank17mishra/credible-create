import re

# Read index.html
with open("index.html", "r", encoding="utf-8") as f:
    index_content = f.read()

# Read style.css (now in css/style.css)
with open("css/style.css", "r", encoding="utf-8") as f:
    css_content = f.read()

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

print("Matches in index.html:")
for asset in assets:
    matches = list(re.finditer(re.escape(asset), index_content))
    if matches:
        print(f"  {asset}: {len(matches)} matches")

print("\nMatches in css/style.css:")
for asset in assets:
    matches = list(re.finditer(re.escape(asset), css_content))
    if matches:
        print(f"  {asset}: {len(matches)} matches")
