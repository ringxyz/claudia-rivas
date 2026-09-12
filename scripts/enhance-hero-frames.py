from pathlib import Path
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SETS = (
    (ROOT / "public/media/frames-hd", 92, 1.35, 125),
    (ROOT / "public/media/frames-mobile", 90, 1.15, 110),
)


for folder, quality, radius, percent in SETS:
    files = sorted(folder.glob("frame-*.webp"))
    for number, source in enumerate(files, 1):
        target = source.with_suffix(".enhanced.webp")
        with Image.open(source) as image:
            enhanced = image.convert("RGB").filter(
                ImageFilter.UnsharpMask(radius=radius, percent=percent, threshold=3)
            )
            enhanced.save(target, "WEBP", quality=quality, method=6)
        target.replace(source)
        if number % 40 == 0 or number == len(files):
            print(f"{folder.name}: {number}/{len(files)}")

poster_source = ROOT / "public/media/frames-hd/frame-0000.webp"
poster_target = ROOT / "public/media/hero.webp"
with Image.open(poster_source) as image:
    image.convert("RGB").save(poster_target, "WEBP", quality=92, method=6)
print("hero poster enhanced")
