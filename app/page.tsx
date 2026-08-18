"use client";

import { useMemo, useState } from "react";

type Clip = {
  id: string;
  title: string;
  range: string;
  section: "Promise" | "Word" | "Product" | "Moments" | "Close";
  source: string;
  beat: string;
  voiceover: string;
  sound: string;
  refs: string[];
  prompt: string;
  first: string;
  last: string;
  bridge: string;
  frames?: StoryFrame[];
  video?: { src: string; poster: string; label: string };
};

type StoryFrame = {
  second: string;
  image: string;
  title: string;
  visual: string;
  voiceover: string;
  prompt: string;
};

const basePrompt =
  "16:9, 10-second cinematic video, 24 fps, 180-degree shutter, subtle 35mm grain, muted indigo shadows, warm amber practicals, cream limestone and restrained teal. The camera stays intimate and human, never surveillance-like. Every character is Arab, from a contemporary UAE/GCC context. Calm, capable performances; no sirens, flashing lights, crowds, panic, spectacle, unapproved visible brands, legible incidental text, watermarks or sci-fi UI. The graphite-black Rahma phone has one large amber-gold hold button with the bold uppercase word RAHMA in deep indigo; the black round wearable shows bold uppercase RAHMA in warm off-white inside its thin amber ring.";

const clip01Frames: StoryFrame[] = [
  {
    second: "00:00",
    image: "/storyboard-frames/clip-01/00.jpg",
    title: "Absolute black",
    visual: "Full black frame. No image, no text, no movement.",
    voiceover: "Silence. No VO yet.",
    prompt: "Pure matte black 16:9 frame. No texture, no text, no logo, no light leak."
  },
  {
    second: "00:01",
    image: "/storyboard-frames/clip-01/01.jpg",
    title: "Hold silence",
    visual: "The black hold continues so the film starts with restraint.",
    voiceover: "Silence. Room tone remains absent.",
    prompt: "Pure matte black 16:9 frame, identical to the previous second."
  },
  {
    second: "00:02",
    image: "/storyboard-frames/clip-01/02.jpg",
    title: "Final black beat",
    visual: "Last second of black before the founding image appears.",
    voiceover: "Silence, then prepare for the first spoken line.",
    prompt: "Pure matte black 16:9 frame, held exactly through the third second."
  },
  {
    second: "00:03",
    image: "/storyboard-frames/clip-01/03.jpg",
    title: "Pen touches paper",
    visual: "Archival macro of mature Arab male hands in a dark formal sleeve. Fountain pen touches an official document without readable text.",
    voiceover: "This country did not begin...",
    prompt: "Historically respectful monochrome-sepia archival macro, mature Arab male hands, dark formal sleeve, fountain pen touching an official founding document, no legible text, no flags, no crowds."
  },
  {
    second: "00:04",
    image: "/storyboard-frames/clip-01/04.jpg",
    title: "Signature begins",
    visual: "Same hand and pen begin the first curve of the signature. The camera stays tight and tactile.",
    voiceover: "...with a border.",
    prompt: "Continue the same archival macro frame. Fountain pen begins the signature curve, soft film grain, intimate 50mm close shot, no ceremony or logos."
  },
  {
    second: "00:05",
    image: "/storyboard-frames/clip-01/05.jpg",
    title: "Promise in motion",
    visual: "The signature develops. Paper, pen nib, sleeve texture and hand wrinkles carry the meaning.",
    voiceover: "Let the line breathe after the VO.",
    prompt: "Monochrome-sepia close shot of the same mature hands signing, fountain pen mid-stroke, official paper detail visible but unreadable, restrained archive texture."
  },
  {
    second: "00:06",
    image: "/storyboard-frames/clip-01/06.jpg",
    title: "Ink line completes",
    visual: "The signature becomes legible as a gesture, not as readable text. No other symbols enter.",
    voiceover: "No new VO. Sustained low note begins.",
    prompt: "Same archival signing macro, the ink line nearly complete, pen still moving, hand steady, no flags, no crowd, no readable document body."
  },
  {
    second: "00:07",
    image: "/storyboard-frames/clip-01/07.jpg",
    title: "Pen slows",
    visual: "Pen reaches the final flourish. The hand and document remain the only story objects.",
    voiceover: "Music holds under the completed thought.",
    prompt: "Close archival frame of the fountain pen slowing at the end of the signature, mature hands, dark sleeve, soft sepia, gentle film weave."
  },
  {
    second: "00:08",
    image: "/storyboard-frames/clip-01/08.jpg",
    title: "Lift begins",
    visual: "The nib starts to lift from the completed signature. This becomes the bridge action.",
    voiceover: "No new VO.",
    prompt: "Same signature macro. Fountain pen nib just lifting from paper after the completed signature, restrained archive grain, no readable official text."
  },
  {
    second: "00:09",
    image: "/storyboard-frames/clip-01/09.jpg",
    title: "Bridge frame",
    visual: "Pen is lifted above the completed signature, ready for the hard cut into Clip 02.",
    voiceover: "Hold the low note into the cut.",
    prompt: "Final frame of the archival signing: pen lifted above completed signature, hands still, monochrome-sepia, intimate and respectful."
  }
];

type FrameSpec = [second: string, title: string, visual: string, voiceover: string, prompt: string];

function buildFrames(clipId: string, ext: "jpg" | "png", specs: FrameSpec[]): StoryFrame[] {
  return specs.map(([second, title, visual, voiceover, prompt], index) => ({
    second,
    image: `/storyboard-frames/clip-${clipId}/${String(index).padStart(2, "0")}.${ext}`,
    title,
    visual,
    voiceover,
    prompt
  }));
}

function buildPartTwoFrames(folder: string, items: Array<[string, string, string]>): StoryFrame[] {
  return items.map(([second, file, title]) => ({
    second,
    image: `/reference-images/part-2-three-moments/per-second/${folder}/${file}`,
    title,
    visual: "Approved per-second storyboard still. Preserve the locked Emirati cast, location, tone and 16:9 framing.",
    voiceover: "See the locked Part 2 voiceover and timing.",
    prompt: "Use the approved Part 2 continuity boards; no video is authorised from this still alone."
  }));
}

const allClipFrames: Record<string, StoryFrame[]> = {
  "01": clip01Frames,
  "02": buildFrames("02", "jpg", [
    ["00:10", "Founding faces", "Monochrome-sepia close frame of founding-era Arab faces, no ceremony wide.", "It began with a promise.", "Archival close faces, respectful sepia grain, intimate not ceremonial, no flags or readable text."],
    ["00:11", "Push inward", "The archival portrait feeling tightens; the frame stays human and remembered.", "That no one here...", "Continue archival close composition with gentle push-in energy, faces dignified and calm."],
    ["00:12", "Promise held", "Archive faces remain the emotional bridge from the signature.", "...would be left...", "Same monochrome-sepia archive texture, soft contrast, no spectacle or crowd scale."],
    ["00:13", "Zayed emphasis", "The push reaches a respectful founder portrait feeling without turning into pageantry.", "...to manage alone.", "Respectful archival portrait emphasis, close and still, no flags, logos, or readable captions."],
    ["00:14", "Archive breath", "Final archival beat before the film enters present-day care.", "Everything built since...", "Hold the archival close frame for one more restrained second, soft gate weave."],
    ["00:15", "Present begins", "The archive gives way toward modern UAE life, still quiet and human.", "...has been that promise...", "Warm transition from sepia archive into contemporary UAE care details, no skyline or signage."],
    ["00:16", "Human continuity", "Founding promise is visually connected to ordinary civic care.", "...keeping its word.", "Close contemporary detail with the same calm visual grammar, warm and modest."],
    ["00:17", "Before school", "A quiet present-day detail prepares the school-gate cut.", "VO line resolves.", "Modest UAE morning life, children implied, no branded uniforms or readable signs."],
    ["00:18", "School gate", "Children pass through a modest UAE school gate at 7am.", "Music opens into warm strings.", "Contemporary UAE school gate, intimate 35mm, Arab children, no readable signage."],
    ["00:19", "Hospital corridor", "Quiet cream-and-light-wood hospital corridor, clean and calm.", "No new VO.", "Quiet hospital corridor, warm practicals, no patients in distress, no alarms."]
  ]),
  "03": buildFrames("03", "jpg", [
    ["00:20", "Older hands", "Lined older Arab hands around a clear glass cup of tea in warm morning light.", "For its children...", "Close domestic care detail, glass tea cup, older hands, warm morning, no brands."],
    ["00:21", "Black breath", "Matte black reset before the child-law card.", "...it wrote a law...", "Pure matte black, no texture, no logo, no light leak."],
    ["00:22", "Law title appears", "Bilingual child-law title card appears on matte black.", "...and made it cover...", "Matte black card with exact composited Arabic and English law title, warm off-white type."],
    ["00:23", "Title hold", "The type remains still and centered.", "...every child...", "Hold approved vector title, no animation, no flare, no generated text drift."],
    ["00:24", "Title hold", "The legal promise is held without graphic decoration.", "...in this country.", "Same title card, warm off-white on matte black, calm and still."],
    ["00:25", "Title hold", "No new imagery; the card carries the idea.", "Not only its own.", "Continue title card hold, no texture, no motion, no UI motifs."],
    ["00:26", "Title hold", "The audience has time to read the law statement.", "VO resolves.", "Approved vector title only, exact centered layout."],
    ["00:27", "Title hold", "Last full hold of the child-law card.", "Warm strings continue.", "Continue locked type system, no additional icons or logos."],
    ["00:28", "Fade intent", "The title prepares to clear back to black.", "No whoosh.", "Title card in final still moment before fade out, centered and quiet."],
    ["00:29", "Black bridge", "Matte black after the title clears.", "Music holds.", "Pure matte black, bridge into Clip 04."]
  ]),
  "04": buildFrames("04", "jpg", [
    ["00:30", "People of Determination", "First bilingual naming-care card holds on matte black.", "For people with disabilities...", "Exact composited Arabic and English title card: People of Determination, warm off-white on black."],
    ["00:31", "Card hold", "The first card remains still.", "...it changed the word.", "Hold the exact vector title, no generated text, no movement."],
    ["00:32", "Card hold", "No imagery beyond the title system.", "People of Determination.", "Continue title hold, calm legal-civic tone."],
    ["00:33", "Card hold", "Last clear second of the first title.", "Line resolves.", "Final hold of first card, no flare or texture."],
    ["00:34", "Senior Citizens", "Second bilingual naming-care card replaces the first.", "For the elderly...", "Exact composited Arabic and English title card: Senior Citizens, warm off-white on black."],
    ["00:35", "Card hold", "The second card remains still.", "...it changed the word again.", "Hold the exact vector title, no generated text, no movement."],
    ["00:36", "Card hold", "The naming-care idea is allowed to land.", "Senior Citizens.", "Continue second card hold, no icons or logos."],
    ["00:37", "Card hold", "Last clear second of the second title.", "A nation is measured...", "Final hold of second card, calm and centered."],
    ["00:38", "Black breath", "Full black after the cards.", "...by what it calls...", "Pure matte black, no texture, no logo."],
    ["00:39", "Black bridge", "Black continues into the Rahma word section.", "...the people it protects.", "Pure matte black, bridge into Clip 05."]
  ]),
  "05": buildFrames("05", "jpg", [
    ["00:40", "Black", "Full black before the word appears.", "There is one more word.", "Pure matte black, no light leak, no logo."],
    ["00:41", "Black", "The silence around the word is preserved.", "Rahma.", "Pure matte black, quiet breath before Arabic wordmark."],
    ["00:42", "Arabic Rahma", "The Arabic Rahma wordmark appears alone, centered.", "It is not a word...", "Exact Arabic Rahma vector wordmark, warm off-white on matte black."],
    ["00:43", "Word hold", "Arabic wordmark holds absolutely still.", "...this country borrowed.", "Hold Arabic wordmark only, no glow, no particles, no generated text."],
    ["00:44", "Word hold", "The word remains the only object.", "It is the one...", "Continue centered Arabic wordmark, approved vector art."],
    ["00:45", "Word hold", "Stillness gives the word weight.", "...it was built on.", "Continue exact wordmark, matte black, warm off-white."],
    ["00:46", "Word hold", "Final Arabic-only beat before English appears.", "VO resolves.", "Hold Arabic Rahma wordmark, no motion."],
    ["00:47", "Bilingual Rahma", "Small English Rahma appears beneath the Arabic word.", "Quiet musical space.", "Exact Arabic wordmark with small English Rahma below, centered and still."],
    ["00:48", "Bilingual hold", "The bilingual mark remains still.", "No new VO.", "Hold bilingual wordmark, no reveal effects."],
    ["00:49", "Bridge mark", "The wordmark prepares to become the app mark.", "Music thins.", "Final bilingual wordmark frame before app-mark morph."]
  ]),
  "06": buildFrames("06", "jpg", [
    ["00:50", "Word to mark", "Bilingual Rahma wordmark carries into the morph.", "And now...", "Bilingual wordmark on black, composited cleanly, no generator text."],
    ["00:51", "App mark", "The app-mark silhouette is centered on black.", "...it is something...", "Clean app-mark silhouette, warm off-white/amber restraint, no 3D logo reveal."],
    ["00:52", "Mark hold", "The app mark holds before the bedroom cut.", "...you can hold...", "Hold clean app mark on matte black, no flares."],
    ["00:53", "Bedroom cut", "Pre-dawn bedroom establishes Mariam's bedside table and warm lamp.", "...in your hand.", "Mariam bedroom, warm lamp, blue dawn, walnut bedside table, no extra people."],
    ["00:54", "Bedroom move", "The phone is about to become the object of focus.", "VO resolves.", "Same bedroom palette, gentle close framing, calm domestic context."],
    ["00:55", "Device bible", "Locked phone and wearable design frame confirms the UI grammar.", "Tactile wake chime.", "Graphite phone, deep-indigo UI, amber RAHMA button, wearable with RAHMA ring."],
    ["00:56", "Phone wakes", "Mariam holds the graphite phone; the RAHMA button is centered.", "Music softens.", "Older Arab woman from behind, phone upright, bold RAHMA amber button, teal halo."],
    ["00:57", "Phone hold", "Same phone orientation, screen readable and uncluttered.", "No new VO.", "Continue Mariam phone frame, one button only, no menus or notifications."],
    ["00:58", "Phone hold", "The phone is now the bridge object into Clip 07.", "Room tone.", "Hold phone near camera, deep-indigo screen, amber button unpressed."],
    ["00:59", "Button ready", "Mariam's thumbs rest near the button but do not press.", "Bridge chime fades.", "Final unpressed button frame, same hands and bedroom context."]
  ]),
  "07": buildFrames("07", "png", [
    ["01:00", "Continuation", "Exact continuation: Mariam holds the awake phone in the pre-dawn bedroom.", "Rahma was built...", "Use locked Mariam phone anchor, button unpressed, bold RAHMA, no UI clutter."],
    ["01:01", "One button", "The single amber button remains the only action target.", "...for the people...", "Same phone frame, no menus, thumb poised, calm hands."],
    ["01:02", "Press begins", "Mariam's thumb presses the RAHMA button.", "...who find technology hardest.", "Thumb deliberately presses amber RAHMA button; maintain older Arab hands and bedroom."],
    ["01:03", "Hold count one", "The hold is clear and still; no menu appears.", "No typing.", "Continue pressed button frame, tactile stillness, no extra UI."],
    ["01:04", "Hold count two", "The second beat of the hold completes.", "No menus.", "Pressed button with restrained teal confirmation ring beginning."],
    ["01:05", "Confirmation pulse", "A soft teal ring confirms the action.", "One button...", "Teal confirmation pulse around amber RAHMA button, calm not sci-fi."],
    ["01:06", "Pulse settles", "Her hand relaxes but stays in frame.", "...held for two seconds.", "Pulse settles, phone still centered, no alerts."],
    ["01:07", "Calm result", "The confirmed state stays quiet and readable.", "VO resolves.", "Continue settled confirmation, no new UI."],
    ["01:08", "Bridge circle", "The circular pulse becomes the bridge shape.", "Soft tactile tone.", "Frame emphasizes circular teal/amber form for map-marker match cut."],
    ["01:09", "Map bridge", "Final phone frame before the pulse becomes location.", "Room tone.", "Hold confirmed button, prepare match to abstract map marker."]
  ]),
  "08": buildFrames("08", "png", [
    ["01:10", "Location appears", "The pulse becomes an amber location dot on Lina's abstract map.", "Rahma knows where...", "Lina in parked graphite car, abstract deep-indigo map, amber dot, no readable address."],
    ["01:11", "Lina receives", "Lina remains seated calmly in the parked car.", "...that citizen is...", "Over-shoulder car frame, Arab caregiver, map secondary, no driving."],
    ["01:12", "Map confidence", "The map stays abstract and non-surveillance-like.", "...even when...", "Phone map with floor/building shapes only, no personal data."],
    ["01:13", "Quiet street", "Blue-hour UAE residential street gives context.", "...the signal doesn't.", "Parked car, warm apartments, calm street, no emergency vehicle movement."],
    ["01:14", "First notice complete", "Lina's acknowledgement is composed.", "And it tells...", "Caregiver remains calm, phone/map glow restrained."],
    ["01:15", "Sami notices", "Cut to Sami noticing his phone in a warm apartment.", "...the people...", "Sami in brown overshirt, phone on table, calm apartment, no panic."],
    ["01:16", "Pause", "Sami processes before reacting.", "...who love them...", "Medium frame, Sami looking down toward graphite phone, composed."],
    ["01:17", "Rise begins", "Sami starts to stand with quiet purpose.", "...first.", "Sami rising from sofa, phone glow secondary, no running."],
    ["01:18", "Purpose", "He is upright enough for the next chain to begin.", "VO resolves.", "Sami nearly standing, warm practical light, calm attention."],
    ["01:19", "Bridge to chain", "Sami is ready to move; frame expands to everyone else.", "Natural room tone.", "Final Sami frame, phone in hand or on table, composed and attentive."]
  ]),
  "09": buildFrames("09", "png", [
    ["01:20", "Sami moves", "Sami is already moving with quiet purpose.", "Then it reaches...", "Continue Sami reaction frame, composed movement, no urgency spectacle."],
    ["01:21", "Doctor notice", "Dr. Noor glances at her phone in the quiet hospital corridor.", "...everyone else...", "Arab doctor in teal scrubs and white coat, phone secondary, quiet corridor."],
    ["01:22", "Doctor turns", "Dr. Noor turns into the corridor.", "...who needs to know.", "Doctor response frame, no patients in distress, no alarms."],
    ["01:23", "Operator looks up", "The navy-uniform operator lifts her head at abstract screens.", "Doctors.", "Arab woman operator in navy hijab, dark screens abstract, no readable data."],
    ["01:24", "Control ready", "The control room reads as professional attention, not surveillance.", "Police.", "Operator frame, restrained amber/teal dots, no red flashing."],
    ["01:25", "Paramedic door", "A paramedic calmly closes a rear vehicle door.", "Ambulance.", "Arab paramedic, parked unbranded vehicle, no sirens, no flashing lights."],
    ["01:26", "Quiet readiness", "The door gesture completes without spectacle.", "The people who care...", "Paramedic frame, vehicle stationary, no patient, no crowd."],
    ["01:27", "Family relief", "A woman at home reads her phone and exhales into relief.", "...for them at home.", "Arab woman in warm apartment, phone secondary, relief not panic."],
    ["01:28", "All at once", "Her relief holds as the chain feels complete.", "All at once.", "Warm domestic relief frame, no tears, no emergency imagery."],
    ["01:29", "Before arrival", "The phone lowers slightly; calm information has arrived.", "It carries what a doctor would need to know before they arrive.", "Final relief frame, phone lowering, quiet safety."]
  ]),
  "10": buildFrames("10", "png", [
    ["01:30", "Wearable macro", "Round black wearable rests on Mariam's older wrist over white bedding.", "It speaks Arabic.", "Wearable macro, bold RAHMA, deep-indigo face, amber ring, no dashboard."],
    ["01:31", "Quiet device", "The wearable remains still; no alert state.", "English. And more.", "Same wearable, soft morning light, no notifications."],
    ["01:32", "Background care", "The device reads as background safety.", "It remembers the medicine, when the day gets long.", "Hold wearable frame, quiet bedding texture, no medical drama."],
    ["01:33", "Mariam reading", "Pull back idea: Mariam reads a folded newspaper at home.", "And when the network fails...", "Mariam in cream-and-walnut home, dove-grey headscarf, cream cardigan, no readable headlines."],
    ["01:34", "Nothing happens", "She remains peaceful in ordinary morning light.", "...it keeps going anyway.", "Mariam reading calmly, tea/home details, no alerts."],
    ["01:35", "Editorial out", "Final approved frame before the 01:36 cut to black.", "Quietly. In the background. Before anything goes wrong.", "Mariam reading in peaceful morning light, final frame, cut to black after this."]
  ])
};

const partTwoFrames: Record<string, StoryFrame[]> = {
  "11": buildPartTwoFrames("moment-01-child", [["01:36", "01-36-title-card-black.png", "A building warning"], ["01:37", "01-37-title-card-black.png", "Title hold"], ["01:38", "01-38-yousef-park-edge.png", "Teenager alone"], ["01:39", "01-39-yousef-bottle-cap-macro.png", "He is worried"], ["01:40", "01-40-yousef-side-profile.png", "He takes the phone"], ["01:41", "01-41-mother-bench.png", "Rahma hold"], ["01:42", "01-42-mother-looks-up.png", "Confirmation"], ["01:43", "01-43-mother-scanning.png", "Fire-rescue arrives"], ["01:44", "01-44-mother-phone-placeholder.png", "Safe outside"], ["01:45", "01-45-abstract-map-placeholder.png", "Parents arrive"]]),
  "12": buildPartTwoFrames("moment-01-child", [["01:46", "01-46-mother-rises.png", "She begins to walk"], ["01:47", "01-47-mother-walks.png", "Following calmly"], ["01:48", "01-48-mother-rounds-hedge.png", "Around the hedge"], ["01:49", "01-49-yousef-revealed-safe.png", "Yousef is safe"], ["01:50", "01-50-yousef-safe-cap.png", "Cap turning"], ["01:51", "01-51-mother-sits-beside.png", "Space and patience"], ["01:52", "01-52-open-palm.png", "Open palm"], ["01:53", "01-53-cap-handover.png", "Shared gesture"]]),
  "13": buildPartTwoFrames("moment-02-lina-medicine", [["01:54", "01-54-title-card-black.png", "An ordinary morning"], ["01:55", "01-55-title-card-black.png", "Title hold"], ["01:56", "02-56-lina-makes-tea.png", "Amina makes tea"], ["01:57", "02-57-lina-waters-plant.png", "Watering the plant"], ["01:58", "02-58-lina-breakfast.png", "Breakfast"], ["01:59", "02-59-refill-reminder-composited.svg", "Rahma refill reminder"], ["02:00", "02-00-pharmacist-prepares-bag.png", "Pharmacist prepares"], ["02:01", "02-01-rider-packs-tote.png", "Rider packs"], ["02:02", "02-02-bag-at-door.png", "Bag at the accessible door"], ["02:03", "02-03-lina-receives-bag.png", "Amina receives it"]]),
  "14": buildPartTwoFrames("moment-02-lina-medicine", [["02:04", "02-04-lina-closes-door.png", "Bag beside her chair"], ["02:05", "02-05-lina-shelves-bag.png", "Bag stored accessibly"], ["02:06", "02-06-lina-tea-newspaper.png", "Tea and newspaper"], ["02:07", "02-07-tea-glass-detail.png", "Tea-glass detail"], ["02:08", "02-08-lina-reads.png", "Reading in stillness"], ["02:09", "02-09-kitchen-window-plant.png", "Kitchen stillness"], ["02:10", "02-10-lina-profile.png", "Morning profile"], ["02:11", "02-11-tea-stillness.png", "Nothing interrupts"]]),
  "15": buildPartTwoFrames("moment-03-ahmed-night", [["02:12", "02-12-title-card-black.png", "A Tuesday night"], ["02:13", "02-13-ahmed-asleep.png", "Ahmed asleep"], ["02:14", "02-14-ahmed-home-detail.png", "His own home"], ["02:15", "02-15-ahmed-wakes.png", "Subtle change"], ["02:16", "02-16-ahmed-looks-phone.png", "Looks to the phone"], ["02:17", "02-17-ahmed-reaches-phone.png", "Careful reach"], ["02:18", "02-18-thumb-hold.png", "Thumb settles"], ["02:19", "02-19-thumb-hold-one.png", "Hold: one"], ["02:20", "02-20-thumb-hold-two.png", "Hold: two"], ["02:21", "02-21-ahmed-composed.png", "Composed response"]]),
  "16": buildPartTwoFrames("moment-03-ahmed-night", [["02:22", "02-22-daughter-table.png", "Daughter at dinner table"], ["02:23", "02-23-daughter-phone.png", "Soft notice"], ["02:24", "02-24-daughter-understands.png", "She understands"], ["02:25", "02-25-daughter-keys.png", "Keys"], ["02:26", "02-26-daughter-leaves.png", "Leaving calmly"], ["02:27", "02-27-daughter-car.png", "Focused journey"], ["02:28", "02-28-building-corridor.png", "Building corridor"], ["02:29", "02-29-paramedics-with-ahmed.png", "Care already there"]]),
  "17": buildPartTwoFrames("moment-04-close", [["02:30", "02-30-teenager-with-parents.png", "Family, together"], ["02:31", "02-31-teenager-with-parents.png", "Family, held"], ["02:32", "02-32-amina-newspaper.png", "Amina, in stillness"], ["02:33", "02-33-amina-newspaper.png", "Amina, in stillness"], ["02:34", "02-34-ahmed-daughter-hands.png", "Ahmed and his daughter"], ["02:35", "02-35-ahmed-daughter-hands.png", "Hands, together"], ["02:36", "02-36-amina-face.png", "Amina's face"], ["02:37", "02-37-ahmed-face.png", "Ahmed's face"], ["02:38", "02-38-black.png", "Quiet black"], ["02:39", "02-39-black.png", "Quiet black"], ["02:40", "02-40-black.png", "Quiet black"], ["02:41", "02-41-black.png", "There is a word for that"], ["02:42", "02-42-rahma-arabic.svg", "Rahma"], ["02:43", "02-43-rahma-arabic.svg", "Rahma hold"], ["02:44", "02-44-rahma-arabic.svg", "Rahma hold"], ["02:45", "02-45-rahma-logo.svg", "Rahma"], ["02:46", "02-46-rahma-logo.svg", "Rahma logo hold"], ["02:47", "02-47-black.png", "Black"], ["02:48", "02-48-black.png", "Black hold"], ["02:49", "02-49-black.png", "End"]])
};

const clips: Clip[] = [
  {
    id: "01", title: "The signature", range: "00:00 — 00:10", section: "Promise", source: "Use full 10 seconds.",
    beat: "00:00–00:03 holds in absolute black. From 00:03, a tight, grainy archival view of a fountain pen signing a founding document. End on the pen lifting.",
    voiceover: "This country did not begin with a border.",
    sound: "True silence for three seconds. Then one sustained, low cello or oud note. No other effects.",
    refs: [],
    prompt: "Begin on full black for exactly three seconds. Reveal a historically respectful, monochrome-sepia macro of mature hands in a formal dark sleeve signing an official founding document with a fountain pen. Soft archive grain, slight film weave, modest slow motion. No wide ceremony, flags, crowds, logos or readable document text. End on the pen lifting after the signature.",
    first: "Pure black.", last: "Pen lifted above the completed signature.", bridge: "Hard cut on the pen lift to the archival faces in Clip 02.",
    frames: allClipFrames["01"],
    video: { src: "/generated-video/first-30s/rahma-first-30s-seedance25.mp4", poster: "/generated-video/first-30s/poster.jpg", label: "Seedance 2.5 · Clips 01–03 · 30 sec · 720p · native audio" }
  },
  {
    id: "02", title: "A promise, kept", range: "00:10 — 00:20", section: "Promise", source: "Use full 10 seconds.",
    beat: "Archival faces, then a gentle push toward Sheikh Zayed. The final seconds become three contemporary human details: school gate, hospital corridor, older hands around tea.",
    voiceover: "It began with a promise. That no one here would be left to manage alone. Everything built since has been that promise, keeping its word.",
    sound: "The held note opens into restrained warm strings only when the present-day images arrive.",
    refs: ["REF-02"],
    prompt: "Open in monochrome-sepia on intimate founding-era faces, never a ceremonial wide. Make a gentle push toward a respectful archival portrait of Sheikh Zayed. Then make three clean contemporary human cuts: children passing through a modest UAE school gate at 7am; a quiet cream-and-light-wood hospital corridor; lined older hands around a clear glass cup of tea. Warm 35mm realism. No skyline, flags, legible signs, brands or theatrical emotion.",
    first: "Close archival face frame.", last: "Lined hands around tea in warm morning light.", bridge: "Hard cut to matte-black type in Clip 03; retain the tea warmth as the type accent.",
    frames: allClipFrames["02"],
    video: { src: "/generated-video/first-30s/rahma-first-30s-seedance25.mp4", poster: "/generated-video/first-30s/poster.jpg", label: "Seedance 2.5 · Clips 01–03 · 30 sec · 720p · native audio" }
  },
  {
    id: "03", title: "A law for its children", range: "00:20 — 00:30", section: "Promise", source: "Use full 10 seconds.",
    beat: "Black breath, then the child-law bilingual title card. It clears into black for the next card.",
    voiceover: "For its children, it wrote a law — and made it cover every child in this country. Not only its own.",
    sound: "Warm strings continue without a whoosh.",
    refs: [],
    prompt: "Create a calm graphic clip on matte black. Hold black for two seconds, then fade in approved Arabic lettering above a smaller English line, centered in warm off-white. Hold still; gently fade out during the last second. Composite exact supplied vectors in post: Arabic قانون حقوق الطفل, English A law for its children. Do not ask a generation model to produce text.",
    first: "Matte black.", last: "Matte black after the title clears.", bridge: "Clip 04 starts from identical black; type scale, leading and color stay locked.",
    frames: allClipFrames["03"],
    video: { src: "/generated-video/first-30s/rahma-first-30s-seedance25.mp4", poster: "/generated-video/first-30s/poster.jpg", label: "Seedance 2.5 · Clips 01–03 · 30 sec · 720p · native audio" }
  },
  {
    id: "04", title: "How a nation names care", range: "00:30 — 00:40", section: "Promise", source: "Use full 10 seconds.",
    beat: "Two sequential title cards: People of Determination, then Senior Citizens. End with two full seconds of black.",
    voiceover: "For people with disabilities, it changed the word. People of Determination. For the elderly, it changed the word again. Senior Citizens. A nation is measured by what it calls the people it protects.",
    sound: "Strings thin down to one held note by the end.",
    refs: [],
    prompt: "On matte black, present two sequential calm bilingual title cards in the exact system of Clip 03. First card holds four seconds; brief black breath; second holds four seconds; then full black. Composite vectors in post: أصحاب الهمم / People of Determination; كبار المواطنين / Senior Citizens. No movement, flares, texture, logo or sound-design whoosh.",
    first: "Identical black to Clip 03.", last: "Full black held for two seconds.", bridge: "Carry full black into Clip 05.",
    frames: allClipFrames["04"],
    video: { src: "/generated-video/30-60s/rahma-30-60s-seedance25.mp4", poster: "/generated-video/30-60s/poster.jpg", label: "Seedance 2.5 · Clips 04–06 · 30 sec · 720p · native audio" }
  },
  {
    id: "05", title: "The word", range: "00:40 — 00:50", section: "Word", source: "Use full 10 seconds.",
    beat: "Black. The Arabic word رحمة appears alone. Two seconds of silence. Then small English Rahma appears beneath it.",
    voiceover: "There is one more word. Rahma. It is not a word this country borrowed. It is the one it was built on.",
    sound: "The held note falls away as the Arabic word appears; maintain two seconds of silence.",
    refs: [],
    prompt: "Minimal graphic clip on pure matte black. Stay black for two seconds. Fade in only the supplied Arabic Rahma wordmark, centered and large in warm off-white; keep it perfectly still for two seconds in silence. Fade in small English Rahma beneath it. No reveal effect, flare, texture or glow. Composite approved vector artwork in post; never generate text.",
    first: "Full black.", last: "Arabic wordmark with small English name, motionless on black.", bridge: "Match the wordmark silhouette into the app mark in Clip 06.",
    frames: allClipFrames["05"],
    video: { src: "/generated-video/30-60s/rahma-30-60s-seedance25.mp4", poster: "/generated-video/30-60s/poster.jpg", label: "Seedance 2.5 · Clips 04–06 · 30 sec · 720p · native audio" }
  },
  {
    id: "06", title: "Something you can hold", range: "00:50 — 01:00", section: "Word", source: "Use full 10 seconds.",
    beat: "A slow vector morph turns the word into the app mark. Match cut to Mariam lifting the phone in her pre-dawn bedroom; its single hold button wakes.",
    voiceover: "And now it is something you can hold in your hand.",
    sound: "Strings return softly. One tactile wake chime; no digital whoosh.",
    refs: ["REF-02", "REF-04"],
    prompt: "Start on the app-mark silhouette from Clip 05; composite a slow three-second vector morph. Match cut to Mariam in the pre-dawn bedroom from REF-02. Her lined hands lift the graphite-black phone from a walnut bedside table. The deep-indigo display calmly resolves to one large amber-gold hold button with a faint teal halo; the button reads bold uppercase RAHMA in deep indigo. Gentle 50mm push, blue dawn through sheer curtains and one warm lamp. Use REF-04 exactly for the phone and UI. No menus, notification barrage or extra people.",
    first: "Centered app-mark silhouette on black.", last: "Mariam holds the awake phone near camera; button unpressed.", bridge: "Clip 07 begins on the same hands, phone orientation, button placement and dawn color.",
    frames: allClipFrames["06"],
    video: { src: "/generated-video/30-60s/rahma-30-60s-seedance25.mp4", poster: "/generated-video/30-60s/poster.jpg", label: "Seedance 2.5 · Clips 04–06 · 30 sec · 720p · native audio" }
  },
  {
    id: "07", title: "One button", range: "01:00 — 01:10", section: "Product", source: "Use full 10 seconds.",
    beat: "Mariam’s thumb presses the only button and holds. Count one, two. A single soft teal confirmation pulse resolves; she remains calm.",
    voiceover: "Rahma was built for the people who find technology hardest. No typing. No menus. One button, held for two seconds.",
    sound: "Close room tone, with an almost inaudible tactile confirmation at second two.",
    refs: ["REF-01", "REF-02", "REF-04"],
    prompt: "Continue exactly from Clip 06: Mariam, dove-grey headscarf, cream cardigan, gold wedding band, graphite phone and deep-indigo UI. Macro 85mm in the same pre-dawn bedroom. Her thumb deliberately presses the single amber circle marked bold uppercase RAHMA and holds exactly two seconds; the stillness makes the count legible. At the end, one soft teal confirmation pulse appears. Her hand relaxes but stays in frame. She is capable and calm; no typing, menus, alarms, urgency or extra fingers.",
    first: "Same upright phone in Mariam’s hands; button unpressed.", last: "Confirmation pulse has settled into a quiet amber circle.", bridge: "Match the circular pulse to the map marker glow in Clip 08.",
    frames: allClipFrames["07"]
  },
  {
    id: "08", title: "The people who love them, first", range: "01:10 — 01:20", section: "Product", source: "Use full 10 seconds.",
    beat: "The pulse becomes a location marker over Lina’s shoulder in her parked car. Then Sami sees his phone mid-conversation and rises with quiet certainty.",
    voiceover: "Rahma knows where that citizen is — even when the signal doesn’t. And it tells the people who love them, first.",
    sound: "Soft map-resolution tone. Natural room tone stops as Sami stands; never an alert siren.",
    refs: ["REF-01", "REF-03", "REF-04"],
    prompt: "Begin with Clip 07’s teal pulse becoming an amber location dot on a non-readable deep-indigo map over Lina’s shoulder. Lina is an Arab woman from the UAE/GCC and sits calmly in the graphite compact car on a quiet UAE street at blue hour. Abstract building and floor shapes only. After five seconds, cut to Sami, an Arab man, in a warm apartment conversation. His graphite phone softly lights on a nearby table; he looks, pauses and stands before anyone else reacts. Keep the camera near him, not on the screen. No driving, running or panic.",
    first: "Teal pulse becomes an amber map marker.", last: "Sami upright, phone in hand, composed and attentive.", bridge: "Clip 09 opens on Sami’s look and expands the quiet notice chain.",
    frames: allClipFrames["08"]
  },
  {
    id: "09", title: "Everyone who needs to know", range: "01:20 — 01:30", section: "Product", source: "Use full 10 seconds.",
    beat: "Sami moves. Doctor turns into corridor. Operator looks up. Paramedic calmly closes a rear door. A woman reads a phone with relief, not panic.",
    voiceover: "Then it reaches everyone else who needs to know. Doctors. Police. Ambulance. The people who care for them at home. All at once. Without anyone having to explain. It carries what a doctor would need to know before they arrive.",
    sound: "Music gains gentle momentum; each acknowledgement has a soft related tactile tone. No siren.",
    refs: ["REF-01", "REF-03", "REF-04"],
    prompt: "Open on Sami already moving with quiet purpose. Four humane 1.5-second match-cut vignettes, all Arab people from a contemporary UAE/GCC context: Dr. Noor glances at a non-readable phone and turns into the quiet hospital corridor; the navy-uniform control operator lifts her head at her desk with abstract dark screens; a non-speaking paramedic calmly closes an already-open rear vehicle door with no flashing lights; a mid-40s Arab woman in a warm apartment reads her graphite phone and her face releases into relief. Screens remain secondary; no vehicle movement, branding or spectacle.",
    first: "Sami turning out of his conversation.", last: "Relieved woman, phone lowered slightly, breathing easy.", bridge: "Cut from her relaxed face to the quiet wearable macro in Clip 10.",
    frames: allClipFrames["09"]
  },
  {
    id: "10", title: "Quietly, in the background", range: "01:30 — 01:36", section: "Product", source: "Generate 10 seconds; use only the first 6 seconds, then cut to black.",
    beat: "Wearable on Mariam’s wrist over white bedding. Pull back to Mariam reading a newspaper in a peaceful morning. Nothing happens. Cut to black at 01:36.",
    voiceover: "It speaks Arabic. English. And more. It remembers the medicine, when the day gets long. And when the network fails, it keeps going anyway. Quietly. In the background. Before anything goes wrong.",
    sound: "Music thins to a soft single line; natural paper rustle only.",
    refs: ["REF-01", "REF-02", "REF-04"],
    prompt: "Begin on the exact round black wearable from REF-04 resting on Mariam’s thin wrist over white cotton bedding in soft morning light. Its deep-indigo face has a thin amber ring with bold uppercase RAHMA centered in warm off-white; no data dashboard. Over six calm seconds, pull back to Mariam in the cream-and-walnut home, dove-grey headscarf, muted teal blouse and cream cardigan, comfortably reading a folded newspaper. Nothing has happened: that is the point. Hold four extra seconds of the same peace for editorial safety, then discard them. No alerts, illness, drama, nurses, logos or busy UI.",
    first: "Wearable macro: quiet amber ring on white bedding.", last: "EDITORIAL OUT at 01:36: Mariam reading in peaceful morning light.", bridge: "Hard cut to black. This board intentionally stops before Three Moments.",
    frames: allClipFrames["10"]
  },
  { id: "11", title: "The child — Rahma response", range: "01:36 — 01:46", section: "Moments", source: "Use 01:36–01:46.", beat: "A worried Emirati teenager triggers Rahma from a safe corridor during a building fire response.", voiceover: "A building emergency. One boy, safe enough to ask for help.", sound: "Building alert ambience and a restrained confirmation tone. No siren foreground.", refs: ["PART 2 / TEEN + FAMILY + FIRE-RESCUE"], prompt: "Use the approved Emirati teenager, family and fire-rescue continuity board. Keep the teenager physically safe.", first: "Black title card.", last: "Parents arrive outside.", bridge: "Continue with the safe handover.", frames: partTwoFrames["11"] },
  { id: "12", title: "The child — family handover", range: "01:46 — 01:54", section: "Moments", source: "Editorially trimmed to 8 seconds.", beat: "The parents, fire-rescue team and teenager complete a calm, safe handover outside the building.", voiceover: "Help is already on its way. His family reaches him safe.", sound: "Quiet response ambience and family relief; no siren foreground.", refs: ["PART 2 / TEEN + FAMILY + FIRE-RESCUE"], prompt: "Keep the family and rescue response composed; no injury, crowd or spectacle.", first: "Parents check in.", last: "Relieved family connection.", bridge: "Cut to black for Lina's morning.", frames: partTwoFrames["12"] },
  { id: "13", title: "The medicine — setup", range: "01:54 — 02:04", section: "Moments", source: "Use full 10 seconds.", beat: "Amina's routine refill arrives before it becomes a problem, without asking her to leave home.", voiceover: "Amina has insulin for nine more days. Nobody has fallen. Nothing has gone wrong. Rahma noticed nine days ago.", sound: "Tea, plant water and a soft doorbell.", refs: ["PART 2 / AMINA WHEELCHAIR CONTINUITY", "EMIRATI SUPPORT CAST"], prompt: "Amina is an authentic Emirati permanent wheelchair user: she remains visibly seated in the locked manual wheelchair, never standing or walking. Routine prevention only; no medical drama.", first: "Black title card.", last: "Amina receives the bag at seated height.", bridge: "Continue into the proof of stillness.", frames: partTwoFrames["13"] },
  { id: "14", title: "The medicine — proof", range: "02:04 — 02:12", section: "Moments", source: "Editorially trimmed to 8 seconds.", beat: "Nothing happens today. That is the proof.", voiceover: "Nothing happens today. That is the point.", sound: "Tea, paper and morning room tone.", refs: ["PART 2 / AMINA WHEELCHAIR CONTINUITY"], prompt: "Hold ordinary, capable domestic calm. Amina remains seated in the locked wheelchair wherever she appears; no interruption.", first: "Bag beside her chair.", last: "Tea stays still.", bridge: "Cut to black for Ahmed's night.", frames: partTwoFrames["14"] },
  { id: "15", title: "The night — recognition", range: "02:12 — 02:22", section: "Moments", source: "Use full 10 seconds.", beat: "Ahmed notices a subtle wrongness and calmly uses Rahma.", voiceover: "Ahmed is eighty-one. He lives alone, and he prefers it that way.", sound: "One lamp, television murmur and a restrained confirmation tone.", refs: ["PART 2 / AHMED"], prompt: "No fall, gasp or medical spectacle. The hold is quiet.", first: "Black title card.", last: "Ahmed rests composed.", bridge: "Cut to the daughter before anyone needs to explain.", frames: partTwoFrames["15"] },
  { id: "16", title: "The night — connection", range: "02:22 — 02:30", section: "Moments", source: "Editorial 8-second use.", beat: "Ahmed's daughter knows and arrives while calm care is already present.", voiceover: "He was never on his own. Not for one minute.", sound: "Keys, room tone and quiet relief. No siren.", refs: ["PART 2 / AHMED + DAUGHTER", "EMIRATI PARAMEDICS"], prompt: "Connection, not a rescue spectacle; end just before the close montage.", first: "Daughter at home.", last: "Care already there.", bridge: "The close montage begins at 02:30.", frames: partTwoFrames["16"] },
  { id: "17", title: "Close — Rahma", range: "02:30 — 02:50", section: "Close", source: "Use full 20 seconds.", beat: "A slow human montage resolves into silence, the Arabic word, Rahma, logo, then black.", voiceover: "This country was built on a promise — that no one here would be left to manage alone. In this country, someone is always thinking about the people who cannot always ask. There is a word for that.", sound: "Music thins to a single line, then silence. No effects.", refs: ["PART 2 / CHILD FAMILY", "PART 2 / AMINA", "PART 2 / AHMED + DAUGHTER"], prompt: "Hold the quiet montage longer than comfortable. Use only established Emirati characters; exact Arabic and logo cards are compositor-supplied. End on true black.", first: "Teenager safe with his parents.", last: "Black.", bridge: "End.", frames: partTwoFrames["17"] }
];

const references = [
  { id: "REF-01", name: "Cast continuity", file: "/reference-images/REF-01-cast-continuity-v2.png", caption: "Mariam, Lina, Sami, Dr. Noor and the control-room operator — all Arab people from a contemporary UAE/GCC context." },
  { id: "REF-02", name: "Home environments", file: "/reference-images/REF-02-home-environments.png", caption: "Pre-dawn bedroom and Mariam’s warm morning home." },
  { id: "REF-03", name: "Service locations", file: "/reference-images/REF-03-service-locations.png", caption: "Lina’s car, hospital corridor and control room." },
  { id: "REF-04", name: "Device & wearable", file: "/reference-images/REF-04-device-and-wearable-v2.png", caption: "Locked graphite phone and wearable: bold RAHMA mark, indigo UI, amber circle and ring." }
];

function Icon({ name }: { name: "copy" | "arrow" | "sound" | "close" }) {
  if (name === "copy") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8.5V5.8c0-1 .8-1.8 1.8-1.8h8.4c1 0 1.8.8 1.8 1.8v8.4c0 1-.8 1.8-1.8 1.8H16M5.8 8h8.4c1 0 1.8.8 1.8 1.8v8.4c0 1-.8 1.8-1.8 1.8H5.8c-1 0-1.8-.8-1.8-1.8V9.8C4 8.8 4.8 8 5.8 8Z" /></svg>;
  if (name === "sound") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h3l4 4V6l-4 4H4Zm11.5-2.5a6 6 0 0 1 0 9m2.8-11.3a9.2 9.2 0 0 1 0 13.6" /></svg>;
  if (name === "close") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>;
}

export default function StoryboardPage() {
  const [selected, setSelected] = useState<Clip | null>(clips[0]);
  const [section, setSection] = useState<"All" | Clip["section"]>("All");
  const [copied, setCopied] = useState(false);
  const visibleClips = useMemo(() => section === "All" ? clips : clips.filter((clip) => clip.section === section), [section]);

  async function copyPrompt() {
    if (!selected) return;
    await navigator.clipboard.writeText(`${basePrompt}\n\n${selected.prompt}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main>
      <div className="grain" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Rahma storyboard home"><span className="brand-mark">R</span><span>RAHMA</span></a>
        <div className="topbar-meta"><span>PRODUCTION BOARD</span><span className="meta-dot" /><span>PART 01 / 01:36</span></div>
        <a className="download" href="/RAHMA_10s_Generation_Storyboard_Part_1.docx" download>Download brief <Icon name="arrow" /></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">A CONTINUITY-FIRST FILM SYSTEM</p>
          <h1>Someone is<br /><em>already</em> thinking.</h1>
          <p className="intro">A generation-ready storyboard for the film before its three human moments begin. Every 10-second clip is designed to carry context into the next one.</p>
          <div className="hero-rules"><span>10 source clips</span><span>24 FPS</span><span>16:9</span><span>No sirens. Ever.</span></div>
        </div>
        <div className="hero-panel">
          <div className="time-stamp">00:00 <i /> 01:36</div>
          <div className="promise-word" aria-label="Rahma">رحمة</div>
          <p>Not a rescue story.<br />A story of attention.</p>
          <div className="pulse-orbit"><span /><span /><b /></div>
        </div>
      </section>

      <section className="principles section-pad">
        <p className="eyebrow">THE NON-NEGOTIABLES</p>
        <div className="principle-grid">
          <div><span>01</span><h2>Stay with someone.</h2><p>Never observe distress from a distance. A face, a hand, or the person who loves them is always in the frame.</p></div>
          <div><span>02</span><h2>Make care quiet.</h2><p>Every response is composed. No flashing lights, no panic, no rescue imagery. Attention was there already.</p></div>
          <div><span>03</span><h2>Lock the world.</h2><p>Characters, homes, props, device UI and colour are defined once, then carried through every generation.</p></div>
        </div>
      </section>

      <section className="atlas section-pad" id="atlas">
        <div className="section-heading"><div><p className="eyebrow">VISUAL BIBLE</p><h2>The things that must not drift.</h2></div><p>Load the named reference image with each applicable generation. The atlas is a continuity control, not final film artwork.</p></div>
        <div className="atlas-grid">
          {references.map((ref, index) => <figure className={`ref-card ref-${index + 1}`} key={ref.id}><img src={ref.file} alt={ref.caption} /><figcaption><span>{ref.id}</span><strong>{ref.name}</strong><p>{ref.caption}</p></figcaption></figure>)}
        </div>
        <div className="continuity-strip"><b>LOCKED PALETTE</b><span className="swatch cream" /><span className="swatch walnut" /><span className="swatch indigo" /><span className="swatch teal" /><span className="swatch amber" /><em>Cream / walnut / indigo / teal / amber. Never emergency red.</em></div>
      </section>

      <section className="timeline section-pad" id="clips">
        <div className="section-heading"><div><p className="eyebrow">1 FPS REVIEW TIMELINE</p><h2>Seventeen clips. One uninterrupted thought.</h2></div><p>Review every storyboard beat as second-by-second still frames, through the final black at 02:50.</p></div>
        <div className="filters" role="group" aria-label="Filter clips">
          {(["All", "Promise", "Word", "Product", "Moments", "Close"] as const).map((item) => <button className={section === item ? "active" : ""} onClick={() => setSection(item)} key={item}>{item}</button>)}
        </div>
        <div className="clip-list">
          {visibleClips.map((clip) => <button className={`clip-row ${selected?.id === clip.id ? "selected" : ""}`} onClick={() => setSelected(clip)} key={clip.id}>
            <span className="clip-no">{clip.id}</span><span className="clip-range">{clip.range}</span><span className="clip-title">{clip.title}</span><span className={`clip-section ${clip.section.toLowerCase()}`}>{clip.section}</span><span className="clip-arrow"><Icon name="arrow" /></span>
          </button>)}
        </div>
      </section>

      <section className="rules section-pad">
        <div className="rules-word">رحمة</div>
        <div><p className="eyebrow">GENERATION GUARDRAILS</p><h2>Attention, not escalation.</h2><p>The Rahma phone is always graphite black, with a deep-indigo display and one amber-gold button marked <b>RAHMA</b>. The wearable repeats <b>RAHMA</b> inside its amber ring. Every on-screen character is Arab. No screens become the hero.</p><div className="rule-tags"><span>No sirens</span><span>No panic</span><span>No dense UI</span><span>No surveillance framing</span><span>No unreadable AI text</span></div></div>
      </section>

      {selected && <aside className="drawer" aria-label={`Details for clip ${selected.id}`}>
        <button className="drawer-close" onClick={() => setSelected(null)} aria-label="Close clip details"><Icon name="close" /></button>
        <div className="drawer-kicker"><span>CLIP {selected.id}</span><i /> <span>{selected.range}</span></div>
        <h2>{selected.title}</h2>
        <p className="drawer-source">{selected.source}</p>
        {selected.frames && <div className="frame-board">
          <div className="frame-board-head">
            <div><span>SECOND-BY-SECOND FRAMES</span><p>Review these stills before approving any future video connection pass.</p></div>
            <b>{selected.frames.length} frames</b>
          </div>
          <div className="frame-grid">
            {selected.frames.map((frame) => <article className="frame-card" key={frame.second}>
              <img src={frame.image} alt={`${selected.title} storyboard frame at ${frame.second}`} />
              <div className="frame-card-body">
                <div className="frame-time"><span>{frame.second}</span><strong>{frame.title}</strong></div>
                <p>{frame.visual}</p>
                <em>{frame.voiceover}</em>
                <details>
                  <summary>Frame prompt</summary>
                  <p>{frame.prompt}</p>
                </details>
              </div>
            </article>)}
          </div>
        </div>}
        {selected.video && <div className="scene-video">
          <div className="scene-video-meta"><span>GENERATED SCENE</span><em>{selected.video.label}</em></div>
          <video controls playsInline preload="metadata" poster={selected.video.poster}>
            <source src={selected.video.src} type="video/mp4" />
            Your browser does not support HTML video.
          </video>
          <a className="scene-download" href={selected.video.src} download>Download this scene <Icon name="arrow" /></a>
        </div>}
        <div className="drawer-block"><span>EDITORIAL BEAT</span><p>{selected.beat}</p></div>
        <div className="drawer-block"><span>VOICEOVER</span><p className="quote">“{selected.voiceover}”</p></div>
        <div className="drawer-block sound-block"><span><Icon name="sound" /> SOUND / MUSIC</span><p>{selected.sound}</p></div>
        <div className="drawer-block"><span>REFERENCE INPUTS</span><div className="ref-pills">{selected.refs.length ? selected.refs.map((ref) => <b key={ref}>{ref}</b>) : <b>LICENSED ARCHIVE / VECTOR ART</b>}</div></div>
        <div className="prompt-card"><div><span>VIDEO-GENERATION PROMPT</span><button onClick={copyPrompt}>{copied ? "Copied" : "Copy prompt"} <Icon name="copy" /></button></div><p>{basePrompt} {selected.prompt}</p></div>
        <div className="handoff"><div><span>FIRST FRAME</span><p>{selected.first}</p></div><div><span>LAST FRAME</span><p>{selected.last}</p></div><div className="bridge"><span>NEXT-CLIP BRIDGE</span><p>{selected.bridge}</p></div></div>
      </aside>}
      {selected && <button className="scrim" onClick={() => setSelected(null)} aria-label="Close clip details" />}
    </main>
  );
}
