# KythraStudio — Google Stitch Tasarım Sistemi ve Hazır Ekran Prompt'ları

> **Nasıl Kullanılır?**
> Google Stitch içinde yeni bir proje açarken önce aşağıdaki **Tasarım Sistemi Özeti**ni bağlam olarak ver, ardından tasarlamak veya yenilemek istediğin ekranın hazır prompt'unu yapıştır. İstersen `docs/references/` klasöründeki önerilen ekran görüntülerini de Stitch'e görsel referans olarak ekle.

---

## 1. Paylaşılan Tasarım Sistemi Özeti (Stitch Bağlam Bloğu)

Her Stitch oturumunun başında veya tasarım kuralı olarak kullanabileceğin özet:

```text
Design System: Pure Google Material 3 (Google Workspace / Gemini / Google Vids aesthetic).
Typography: Google Sans for display/headings/chord symbols, Google Sans Text for UI copy, Roboto Mono for timestamps/BPM/developer telemetry. Icons: Material Symbols Outlined.
Themes: Support both crisp Light Mode and deep Dark Mode.
Light Palette:
- Surface / Background: #F8FAFD
- Card Surface (surface-container-lowest): #FFFFFF
- Tonal Surface (surface-container): #EEF0F4
- Primary (Active chord, primary actions): #0B57D0 | Container: #D3E3FD
- Secondary (Next chord, capo badge): #00639B | Container: #C2E7FF
- Tertiary (Active Loop, Metronome, Favorites): #E65100 | Container: #FFE0B2
- Error (Mute warning, errors): #B3261E | Container: #F9DEDC
- Text Primary: #1F1F1F | Text Muted: #444746 | Outline Variant: #C4C7C5
Dark Palette:
- Surface / Background: #131314
- Card Surface: #0E0E0E | Elevated Containers: #1B1B1B / #1E1F20 / #282A2C
- Primary: #A8C7FA | Container: #0842A0
- Secondary: #7FCFFF | Container: #004A77
- Tertiary: #FFB74D | Container: #8C3100
- Text Primary: #E3E3E3 | Text Muted: #C4C7C5 | Outline Variant: #444746
Shapes & Surfaces: Rounded 20px cards, 16px nested tiles, full-pill (9999px) omnibox search, segmented toggles, badges, and floating bottom playback docker. Clean tonal elevation with subtle borders—no heavy neon glow, no cluttered DAW skeuomorphism.
```

---

## 2. Ekran Bazlı Hazır Stitch Prompt'ları

### Ekran A: Web Studio — Aktif Müzik Pratik Stüdyosu (Desktop 1440×900)
*Önerilen görsel referanslar (`docs/references/`):* `chord-mini-app/beat-chord-map-screen.png`, `moises/1.webp`, `guitar-ultimate/song-screen.png`

```text
Design the main desktop studio screen for "KythraStudio", an AI music practice studio built with pure Google Material 3 (Google Workspace / Gemini aesthetic, Light Mode with #F8FAFD canvas and #FFFFFF 20px rounded cards, Primary #0B57D0, Secondary #00639B, Tertiary #E65100).

Layout top-to-bottom:
1. Sticky Top App Bar (64px): Left has KythraStudio geometric music logo + wordmark, centered Google Drive-style pill omnibox search bar ("Search library or uploads..."), right has a tonal "Upload Song" button, theme/language icon toggles, and user account avatar button.
2. Compact Song Info Strip card: Song title & artist on left with a favorite star button; right side shows tonal pill badges for BPM ("118 BPM"), Key ("Am"), Time Signature ("4/4"), and subtle live analysis status ("6 Stems Ready").
3. Hero Practice Grid (2 columns, 7:5 ratio):
   - Left card ("Live Chord Stage"): 3-column flow showing Previous chord (muted tonal card), Current Active chord (large prominent #D3E3FD primary container card showing "Am7" in bold Google Sans with a beat pulse row 1-2-3-4 below), and Next chord (#C2E7FF secondary container card showing "Fmaj7").
   - Right card ("Instrument Chord Diagrams"): Header toggle for Guitar / Piano / Ukulele + Capo badge ("Capo 2"), showing 2 side-by-side diagram cards (Active chord highlighted with blue border, Next chord beside it) with crisp 6-string guitar fretboard SVG diagrams, finger numbers, and voicing pagination dots.
4. Unified Sections & Measure Grid Card:
   - Top horizontal Material 3 primary tabs for song sections (Intro, Verse 1, Chorus 1, Verse 2, Chorus 2, Bridge, Outro) where a looped section tab uses warm orange #FFE0B2 tertiary container styling.
   - Below tabs: a clean 12-column compact grid of bar/measure cells showing bar number and chord symbol, with the current bar in primary blue container, a thin progress underline, and looped bars highlighted in warm orange container.
5. Compact Word-Synced Karaoke Lyrics Card:
   - Subtle header with "Lyrics" label and "Edit Lyrics" pill button.
   - 3 visible lyric rows: past line dimmed, current active line highlighted in #D3E3FD primary container with an active badge and bottom progress indicator, next line clean and legible.
6. Floating Bottom Pill Control Dock (Google Vids style, 64px height, 9999px radius, subtle elevation shadow):
   - Left: Play/Pause filled primary circle button, skip back/forward, Loop toggle (orange when active), Metronome toggle.
   - Center: Interactive rounded waveform scrubber bar with orange loop region overlay and current/total timestamps.
   - Right: Tonal buttons for "6-Stem Mixer", "Instrument / Capo / Transpose", "Speed 1.0x", and Master Volume/Mute.
```

---

### Ekran B: Web Studio — 6-Kanal Stem Mikser & Pratik Araçları Popover'ları
*Önerilen görsel referanslar (`docs/references/`):* `moises/2.webp`, `moises/3.webp`, `guitar-ultimate/right-tool.png`

```text
Design an upward-opening Material 3 popover card anchored above the floating bottom control dock of KythraStudio for the "6-Stem Audio Mixer" (Light and Dark mode variants, 360px wide, 24px border radius, clean elevated surface).

Contents:
1. Header: "6-Stem Mixer (BS-RoFormer)" with a quick reset button.
2. Horizontal scrollable mix preset pills: "Full Mix", "Guitar Backing (Mute Guitar)", "Vocal Karaoke", "Guitar Focus", "Rhythm Section".
3. Six clean stem rows with Material Symbols icons: Vocals, Guitar, Bass, Drums, Piano, Other.
   - Each row has: stem icon + label, compact Solo ("S") and Mute ("M") circular tonal toggles, a Material 3 slider bar with active track fill, and a subtle active-signal indicator dot (dimmed if stem has no energy).
4. Footer inside popover: Master volume slider and a quick "Sync Metronome Volume" toggle.
```

---

### Ekran C: Web Studio — Karşılama & Şarkı Yükleme Ekranı (Empty State)
*Önerilen görsel referanslar (`docs/references/`):* `songsterr/library-search-screen.png`, `songsterr/add-song-screen.png`

```text
Design the Welcome / Library landing screen for KythraStudio in Google Material 3 (clean Workspace aesthetic, Light Mode #F8FAFD surface).

Layout:
1. Top App Bar with logo, prominent omnibox search pill, Upload button, and Account menu.
2. Clean Hero Split Card (20px radius, white surface):
   - Left: Concise headline "Turn any song into a live practice studio", short subtitle explaining 4-stage progressive analysis (Tempo & Bars -> Chords & Sections -> 6-Stem Separation -> Synced Karaoke Lyrics), and 4 compact numbered step pills.
   - Right: Tactile dashed Material 3 drag-and-drop upload zone supporting WAV, MP3, FLAC, OGG, M4A (max 100MB / 10 min) with a primary "Choose Audio File" button.
3. Library Section below: Filter tabs ("All Library", "Favorites", "My Uploads", "Playlists") and a responsive 3-column grid of song cards showing title, artist, BPM, Key badge, "Instant Cache" ready pill, and quick play/favorite actions.
```

---

### Ekran D: Developer Workbench — Canlı Oturum & Gözlemleme Konsolu (Observability Center)
*Önerilen görsel referanslar:* Google Cloud Console + Material 3 Dark/Light technical dashboard.

```text
Design the "KythraStudio Developer Workbench" — a real-time observability, multi-session debugging, and 4-stage AI pipeline inspector built in pure Google Material 3 (shared token system with Web Studio, using Roboto Mono for metrics, logs, and HTTP traces).

Layout (full-viewport 100dvh split layout):
1. Top App Bar (64px):
   - Left: "KythraStudio Developer" lockup + active Session Switcher dropdown pill showing user name, purple/blue "Developer" or "Web User" role badge, client badge ("web"), and current song name.
   - Center: Segmented view switcher ("Pipeline Inspector", "Live Console", "HTTP Requests").
   - Right: Primary "Run Production Flow" button, "Load Track" button, and Dark/Light theme toggle.
2. Left Sidebar — Pipeline Rail (300px):
   - Lists the 4 stages vertically with status dots (Success green #146C2E, Running blue spinner, Pending neutral, Error red), execution time in seconds, and engine name:
     01 Beat & Bar Tracking (madmom)
     02 Chords & Sections (BTC + allin1)
     03 6-Stem Separation (BS-RoFormer)
     04 Word-Synced Lyrics (Whisper + MMS_FA)
3. Right Main Workspace (show two key tabs clearly):
   - Tab 1 (Stage Inspector): Top horizontal Global Pipeline Tracker card, stage I/O pills, 4 KPI metric cards (BPM, Key, VRAM/Batch, Elapsed Time), and visual inspection grid (chord bar cards or 6-stem RMS cards) with a toggle to Raw JSON.
   - Tab 2 (HTTP Requests & Live Console): Filter toolbar ("Only Active Session", "Only Errors", search pill, Clear button) above a crisp high-contrast dark terminal panel (#0D1117) showing live structured logs and HTTP request trace rows (timestamp, method, /api/workbench/... path, status pill 200/500, duration ms, session ID, user role).
4. Bottom Pinned Master Audio Player Bar: Compact waveform scrubber + 6-stem mixer popover button synced with the inspected session.
```

---

### Ekran E: Mobil Uygulama — Aktif Stüdyo Ekranı (390×844)
*Önerilen görsel referanslar (`docs/references/`):* `moises/4.webp`, `moises/5.webp`, `chordsai/1.webp`

```text
Design the mobile active practice screen (390x844) for KythraStudio in Google Material 3 (Dark Mode #131314 surface, #A8C7FA primary, #FFB74D tertiary).

Top-to-bottom:
1. Compact mobile header: Back/Library icon, truncated song title + "118 BPM · Am" subtitle, Favorite star, and Settings icon.
2. Horizontal scrollable section pills (Intro, Verse, Chorus [highlighted orange for active loop], Bridge, Outro).
3. Hero Live Chord Card: Large active chord ("Am7") with beat dots (1-2-3-4) and compact swipeable Guitar/Piano chord diagram + Next chord preview pill.
4. 4-column scrollable Measure/Chord grid (2-3 rows visible) with current measure highlighted in #0842A0 primary container.
5. Compact 2-line synced karaoke lyrics strip.
6. Bottom docked mobile mini-player: Play/Pause, Loop, Metronome, compact waveform seek bar, and quick bottom-sheet triggers for "6-Stem Mixer" and "Capo / Speed".
```
