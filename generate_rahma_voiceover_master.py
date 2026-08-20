import asyncio
import subprocess
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "generated-video" / "rahma-voiceover-master"
VOICE = "ar-AE-HamdanNeural"
RATE = "+25%"

# A single locked, UAE male narrator for every generated scene. Timings leave each
# sentence room to finish rather than forcing it to cut off at a visual-card boundary.
SEGMENTS = [
    ("01-opening", 3.0, "This country did not begin with a border."),
    ("02-promise", 9.3, "It began with a promise. That no one here would be left to manage alone. Everything built since has been that promise, keeping its word."),
    ("03-children", 20.0, "For its children, it wrote a law - and made it cover every child in this country. Not only its own."),
    ("04-determination", 30.0, "For people with disabilities, it changed the word. People of Determination. For the elderly, it changed the word again. Senior Citizens. A nation is measured by what it calls the people it protects."),
    ("05-rahma", 45.5, "There is one more word. Rahma. It is not a word this country borrowed. It is the one it was built on."),
    ("06-hand", 55.0, "And now it is something you can hold in your hand."),
]


async def synthesize() -> list[Path]:
    OUT.mkdir(parents=True, exist_ok=True)
    paths = []
    for name, _, text in SEGMENTS:
        path = OUT / f"{name}.mp3"
        await edge_tts.Communicate(text, VOICE, rate=RATE).save(str(path))
        paths.append(path)
    return paths


def create_master(paths: list[Path]) -> None:
    inputs = []
    filters = []
    for index, ((_, start, _), path) in enumerate(zip(SEGMENTS, paths)):
        inputs.extend(["-i", str(path)])
        delay = round(start * 1000)
        filters.append(f"[{index}:a]adelay={delay}|{delay},aresample=48000[a{index}]")
    inputs.extend(["-f", "lavfi", "-t", "60", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000"])
    silence_index = len(paths)
    mix_inputs = "".join(f"[a{i}]" for i in range(len(paths))) + f"[{silence_index}:a]"
    filters.append(f"{mix_inputs}amix=inputs={len(paths) + 1}:normalize=0,atrim=duration=60,aresample=48000[a]")
    output = OUT / "rahma-voiceover-master-00-60.wav"
    subprocess.run([
        "ffmpeg", "-hide_banner", "-y", *inputs,
        "-filter_complex", ";".join(filters),
        "-map", "[a]", "-c:a", "pcm_s16le", str(output),
    ], check=True)


if __name__ == "__main__":
    files = asyncio.run(synthesize())
    create_master(files)
    print(f"Created {OUT / 'rahma-voiceover-master-00-60.wav'} with voice {VOICE}.")
