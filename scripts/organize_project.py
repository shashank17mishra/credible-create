import os
import shutil

# Directories to create
dirs = ["assets", "css", "js", "docs", "scripts"]
for d in dirs:
    os.makedirs(d, exist_ok=True)
    print(f"Created directory: {d}")

# Files to move
files_to_move = {
    "assets": [
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
    ],
    "css": [
        "style.css"
    ],
    "js": [
        "script.js"
    ],
    "docs": [
        "idt.md",
        "robotics.md",
        "structure.md"
    ],
    "scripts": [
        "inspect_user_robot_alpha.py",
        "inspect_user_robot_bbox.py"
    ]
}

for target_dir, files in files_to_move.items():
    for f in files:
        if os.path.exists(f):
            shutil.move(f, os.path.join(target_dir, f))
            print(f"Moved {f} to {target_dir}/")
        else:
            print(f"File not found: {f}")
