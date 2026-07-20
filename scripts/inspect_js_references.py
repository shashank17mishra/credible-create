import re

# Read js/script.js
with open("js/script.js", "r", encoding="utf-8") as f:
    js_content = f.read()

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

print("Matches in js/script.js:")
for asset in assets:
    matches = list(re.finditer(re.escape(asset), js_content))
    if matches:
        print(f"  {asset}: {len(matches)} matches")
