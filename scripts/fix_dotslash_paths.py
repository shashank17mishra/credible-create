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
    "shashank.png",
    "suhani.png"
]

# Handle ./asset.png pattern (with leading ./)
for asset in assets:
    content = content.replace(f"'./{asset}'", f"'./assets/{asset}'")
    content = content.replace(f'"./{asset}"', f'"./assets/{asset}"')

# Save
with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed ./ prefixed paths in index.html")

# Verify again
print("\nVerification:")
for asset in assets:
    pattern = rf'(?<!assets/){re.escape(asset)}'
    matches = list(re.finditer(pattern, content))
    if matches:
        print(f"  STILL BROKEN: {asset} — {len(matches)} matches")
        for match in matches:
            start = max(0, match.start() - 40)
            end = min(len(content), match.end() + 40)
            print(f"    ...{content[start:end]}...")
    else:
        print(f"  OK: {asset}")
