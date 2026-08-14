"""Generate Rahma Clip 01 with fal Seedance 2.0.

Set FAL_KEY in the process environment before running. The key is deliberately
never written to this file, the project, or terminal output.
"""

from pathlib import Path
from urllib.request import urlretrieve
import json
import os

import fal_client


ROOT = Path(__file__).resolve().parent
OUT_DIR = ROOT / "generated-video" / "clip-01"
START_FRAME = OUT_DIR / "clip-01-black-start.png"
END_FRAME = OUT_DIR / "clip-01-archive-endframe.png"
VIDEO_FILE = OUT_DIR / "rahma-clip-01-seedance2-10s.mp4"
METADATA_FILE = OUT_DIR / "rahma-clip-01-seedance2-10s.json"

PROMPT = """Create exactly a 10-second, 16:9 cinematic archival opening for the Rahma film.
Seconds 0.0 through 3.0: remain in complete, pure black. No shapes, text, glow, grain, titles, or visible detail.
At exactly 3.0 seconds: make a slow, dignified dissolve from black into a tight 1971 archival-style macro of an older Arab man's right hand in a dark formal suit sleeve signing a heavy cream founding-era document with a black fountain pen on a dark desk.
Seconds 3.0 through 9.0: only subtle, realistic hand and pen motion as the signature is completed. Preserve the exact material continuity of the supplied end frame: monochrome-sepia grade, fine 1971 film grain, cream paper, black pen, dark wood, shallow focus, no face.
Seconds 9.0 through 10.0: the pen completes the final stroke and lifts gently above the paper; resolve exactly to the supplied end frame.
The feeling is intimate, dignified and quiet - not ceremonial. Camera is locked in a close 50mm macro; use natural microscopic hand motion only. No flags, crowds, named figures, faces, skyline, logos, readable document text, colour shift, rush, dramatic effects, modern objects, sound, or music."""


def main() -> None:
    if not os.environ.get("FAL_KEY"):
        raise RuntimeError("FAL_KEY is required in the process environment.")
    if not START_FRAME.exists() or not END_FRAME.exists():
        raise FileNotFoundError("Clip 01 start and end frame assets must exist before generation.")

    start_url = fal_client.upload_file(START_FRAME)
    end_url = fal_client.upload_file(END_FRAME)
    result = fal_client.subscribe(
        "bytedance/seedance-2.0/image-to-video",
        arguments={
            "prompt": PROMPT,
            "image_url": start_url,
            "end_image_url": end_url,
            "resolution": "720p",
            "duration": "10",
            "aspect_ratio": "16:9",
            "generate_audio": False,
            "bitrate_mode": "high",
            "seed": 19710718,
        },
        with_logs=True,
        client_timeout=900,
    )
    video_url = result["video"]["url"]
    urlretrieve(video_url, VIDEO_FILE)
    METADATA_FILE.write_text(
        json.dumps(
            {
                "model": "bytedance/seedance-2.0/image-to-video",
                "duration_seconds": 10,
                "resolution": "720p",
                "aspect_ratio": "16:9",
                "audio_generated": False,
                "seed": result.get("seed", 19710718),
                "video_url": video_url,
                "start_frame": START_FRAME.name,
                "end_frame": END_FRAME.name,
                "prompt": PROMPT,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"Generated: {VIDEO_FILE}")
    print(f"Metadata: {METADATA_FILE}")


if __name__ == "__main__":
    main()
