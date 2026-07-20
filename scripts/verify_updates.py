import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

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

print("Verifying index.html:")
for asset in assets:
    # Check if there is any occurrence of the asset name NOT preceded by 'assets/'
    pattern = rf'(?<!assets/){re.escape(asset)}'
    matches = list(re.finditer(pattern, content))
    if matches:
        print(f"  WARNING: Found {len(matches)} raw occurrences of '{asset}':")
        for match in matches:
            start = max(0, match.start() - 30)
            end = min(len(content), match.end() + 30)
            print(f"    Snippet: ...{content[start:end]}...")
    else:
        print(f"  OK: {asset}")
