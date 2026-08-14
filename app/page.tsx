"use client";

import { useMemo, useState } from "react";

type Clip = {
  id: string;
  title: string;
  range: string;
  section: "Promise" | "Word" | "Product";
  source: string;
  beat: string;
  voiceover: string;
  sound: string;
  refs: string[];
  prompt: string;
  first: string;
  last: string;
  bridge: string;
  video?: { src: string; poster: string; label: string };
};

const basePrompt =
  "16:9, 10-second cinematic video, 24 fps, 180-degree shutter, subtle 35mm grain, muted indigo shadows, warm amber practicals, cream limestone and restrained teal. The camera stays intimate and human, never surveillance-like. Every character is Arab, from a contemporary UAE/GCC context. Calm, capable performances; no sirens, flashing lights, crowds, panic, spectacle, unapproved visible brands, legible incidental text, watermarks or sci-fi UI. The graphite-black Rahma phone has one large amber-gold hold button with the bold uppercase word RAHMA in deep indigo; the black round wearable shows bold uppercase RAHMA in warm off-white inside its thin amber ring.";

const clips: Clip[] = [
  {
    id: "01", title: "The signature", range: "00:00 — 00:10", section: "Promise", source: "Use full 10 seconds.",
    beat: "00:00–00:03 holds in absolute black. From 00:03, a tight, grainy archival view of a fountain pen signing a founding document. End on the pen lifting.",
    voiceover: "This country did not begin with a border.",
    sound: "True silence for three seconds. Then one sustained, low cello or oud note. No other effects.",
    refs: [],
    prompt: "Begin on full black for exactly three seconds. Reveal a historically respectful, monochrome-sepia macro of mature hands in a formal dark sleeve signing an official founding document with a fountain pen. Soft archive grain, slight film weave, modest slow motion. No wide ceremony, flags, crowds, logos or readable document text. End on the pen lifting after the signature.",
    first: "Pure black.", last: "Pen lifted above the completed signature.", bridge: "Hard cut on the pen lift to the archival faces in Clip 02.",
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
    video: { src: "/generated-video/first-30s/rahma-first-30s-seedance25.mp4", poster: "/generated-video/first-30s/poster.jpg", label: "Seedance 2.5 · Clips 01–03 · 30 sec · 720p · native audio" }
  },
  {
    id: "04", title: "How a nation names care", range: "00:30 — 00:40", section: "Promise", source: "Use full 10 seconds.",
    beat: "Two sequential title cards: People of Determination, then Senior Citizens. End with two full seconds of black.",
    voiceover: "For people with disabilities, it changed the word. People of Determination. For the elderly, it changed the word again. Senior Citizens. A nation is measured by what it calls the people it protects.",
    sound: "Strings thin down to one held note by the end.",
    refs: [],
    prompt: "On matte black, present two sequential calm bilingual title cards in the exact system of Clip 03. First card holds four seconds; brief black breath; second holds four seconds; then full black. Composite vectors in post: أصحاب الهمم / People of Determination; كبار المواطنين / Senior Citizens. No movement, flares, texture, logo or sound-design whoosh.",
    first: "Identical black to Clip 03.", last: "Full black held for two seconds.", bridge: "Carry full black into Clip 05."
  },
  {
    id: "05", title: "The word", range: "00:40 — 00:50", section: "Word", source: "Use full 10 seconds.",
    beat: "Black. The Arabic word رحمة appears alone. Two seconds of silence. Then small English Rahma appears beneath it.",
    voiceover: "There is one more word. Rahma. It is not a word this country borrowed. It is the one it was built on.",
    sound: "The held note falls away as the Arabic word appears; maintain two seconds of silence.",
    refs: [],
    prompt: "Minimal graphic clip on pure matte black. Stay black for two seconds. Fade in only the supplied Arabic Rahma wordmark, centered and large in warm off-white; keep it perfectly still for two seconds in silence. Fade in small English Rahma beneath it. No reveal effect, flare, texture or glow. Composite approved vector artwork in post; never generate text.",
    first: "Full black.", last: "Arabic wordmark with small English name, motionless on black.", bridge: "Match the wordmark silhouette into the app mark in Clip 06."
  },
  {
    id: "06", title: "Something you can hold", range: "00:50 — 01:00", section: "Word", source: "Use full 10 seconds.",
    beat: "A slow vector morph turns the word into the app mark. Match cut to Mariam lifting the phone in her pre-dawn bedroom; its single hold button wakes.",
    voiceover: "And now it is something you can hold in your hand.",
    sound: "Strings return softly. One tactile wake chime; no digital whoosh.",
    refs: ["REF-02", "REF-04"],
    prompt: "Start on the app-mark silhouette from Clip 05; composite a slow three-second vector morph. Match cut to Mariam in the pre-dawn bedroom from REF-02. Her lined hands lift the graphite-black phone from a walnut bedside table. The deep-indigo display calmly resolves to one large amber-gold hold button with a faint teal halo; the button reads bold uppercase RAHMA in deep indigo. Gentle 50mm push, blue dawn through sheer curtains and one warm lamp. Use REF-04 exactly for the phone and UI. No menus, notification barrage or extra people.",
    first: "Centered app-mark silhouette on black.", last: "Mariam holds the awake phone near camera; button unpressed.", bridge: "Clip 07 begins on the same hands, phone orientation, button placement and dawn color."
  },
  {
    id: "07", title: "One button", range: "01:00 — 01:10", section: "Product", source: "Use full 10 seconds.",
    beat: "Mariam’s thumb presses the only button and holds. Count one, two. A single soft teal confirmation pulse resolves; she remains calm.",
    voiceover: "Rahma was built for the people who find technology hardest. No typing. No menus. One button, held for two seconds.",
    sound: "Close room tone, with an almost inaudible tactile confirmation at second two.",
    refs: ["REF-01", "REF-02", "REF-04"],
    prompt: "Continue exactly from Clip 06: Mariam, dove-grey headscarf, cream cardigan, gold wedding band, graphite phone and deep-indigo UI. Macro 85mm in the same pre-dawn bedroom. Her thumb deliberately presses the single amber circle marked bold uppercase RAHMA and holds exactly two seconds; the stillness makes the count legible. At the end, one soft teal confirmation pulse appears. Her hand relaxes but stays in frame. She is capable and calm; no typing, menus, alarms, urgency or extra fingers.",
    first: "Same upright phone in Mariam’s hands; button unpressed.", last: "Confirmation pulse has settled into a quiet amber circle.", bridge: "Match the circular pulse to the map marker glow in Clip 08."
  },
  {
    id: "08", title: "The people who love them, first", range: "01:10 — 01:20", section: "Product", source: "Use full 10 seconds.",
    beat: "The pulse becomes a location marker over Lina’s shoulder in her parked car. Then Sami sees his phone mid-conversation and rises with quiet certainty.",
    voiceover: "Rahma knows where that citizen is — even when the signal doesn’t. And it tells the people who love them, first.",
    sound: "Soft map-resolution tone. Natural room tone stops as Sami stands; never an alert siren.",
    refs: ["REF-01", "REF-03", "REF-04"],
    prompt: "Begin with Clip 07’s teal pulse becoming an amber location dot on a non-readable deep-indigo map over Lina’s shoulder. Lina is an Arab woman from the UAE/GCC and sits calmly in the graphite compact car on a quiet UAE street at blue hour. Abstract building and floor shapes only. After five seconds, cut to Sami, an Arab man, in a warm apartment conversation. His graphite phone softly lights on a nearby table; he looks, pauses and stands before anyone else reacts. Keep the camera near him, not on the screen. No driving, running or panic.",
    first: "Teal pulse becomes an amber map marker.", last: "Sami upright, phone in hand, composed and attentive.", bridge: "Clip 09 opens on Sami’s look and expands the quiet notice chain."
  },
  {
    id: "09", title: "Everyone who needs to know", range: "01:20 — 01:30", section: "Product", source: "Use full 10 seconds.",
    beat: "Sami moves. Doctor turns into corridor. Operator looks up. Paramedic calmly closes a rear door. A woman reads a phone with relief, not panic.",
    voiceover: "Then it reaches everyone else who needs to know. Doctors. Police. Ambulance. The people who care for them at home. All at once. Without anyone having to explain. It carries what a doctor would need to know before they arrive.",
    sound: "Music gains gentle momentum; each acknowledgement has a soft related tactile tone. No siren.",
    refs: ["REF-01", "REF-03", "REF-04"],
    prompt: "Open on Sami already moving with quiet purpose. Four humane 1.5-second match-cut vignettes, all Arab people from a contemporary UAE/GCC context: Dr. Noor glances at a non-readable phone and turns into the quiet hospital corridor; the navy-uniform control operator lifts her head at her desk with abstract dark screens; a non-speaking paramedic calmly closes an already-open rear vehicle door with no flashing lights; a mid-40s Arab woman in a warm apartment reads her graphite phone and her face releases into relief. Screens remain secondary; no vehicle movement, branding or spectacle.",
    first: "Sami turning out of his conversation.", last: "Relieved woman, phone lowered slightly, breathing easy.", bridge: "Cut from her relaxed face to the quiet wearable macro in Clip 10."
  },
  {
    id: "10", title: "Quietly, in the background", range: "01:30 — 01:36", section: "Product", source: "Generate 10 seconds; use only the first 6 seconds, then cut to black.",
    beat: "Wearable on Mariam’s wrist over white bedding. Pull back to Mariam reading a newspaper in a peaceful morning. Nothing happens. Cut to black at 01:36.",
    voiceover: "It speaks Arabic. English. And more. It remembers the medicine, when the day gets long. And when the network fails, it keeps going anyway. Quietly. In the background. Before anything goes wrong.",
    sound: "Music thins to a soft single line; natural paper rustle only.",
    refs: ["REF-01", "REF-02", "REF-04"],
    prompt: "Begin on the exact round black wearable from REF-04 resting on Mariam’s thin wrist over white cotton bedding in soft morning light. Its deep-indigo face has a thin amber ring with bold uppercase RAHMA centered in warm off-white; no data dashboard. Over six calm seconds, pull back to Mariam in the cream-and-walnut home, dove-grey headscarf, muted teal blouse and cream cardigan, comfortably reading a folded newspaper. Nothing has happened: that is the point. Hold four extra seconds of the same peace for editorial safety, then discard them. No alerts, illness, drama, nurses, logos or busy UI.",
    first: "Wearable macro: quiet amber ring on white bedding.", last: "EDITORIAL OUT at 01:36: Mariam reading in peaceful morning light.", bridge: "Hard cut to black. This board intentionally stops before Three Moments."
  }
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
        <div className="section-heading"><div><p className="eyebrow">GENERATION TIMELINE</p><h2>Ten clips. One uninterrupted thought.</h2></div><p>Generate each source clip at 10 seconds. Clip 10 has a four-second safety tail but is editorially cut at 01:36.</p></div>
        <div className="filters" role="group" aria-label="Filter clips">
          {(["All", "Promise", "Word", "Product"] as const).map((item) => <button className={section === item ? "active" : ""} onClick={() => setSection(item)} key={item}>{item}</button>)}
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
