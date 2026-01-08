# Kiru — Language Flashcard Web App Specification

## Overview

**Kiru** (kiru.app) is a minimalist, dark-mode web application for practicing language character recognition. The initial version focuses on Japanese Hiragana and Katakana — users see a random kana character and type its romanization (romaji). The app runs in endless mode until the user decides to quit.

The name "Kiru" (切る) means "to cut" in Japanese — representing cutting through vocabulary and mastering characters one by one.

---

## Tech Stack Recommendation

- **Frontend:** React (single-page app) or vanilla HTML/CSS/JS
- **Styling:** Tailwind CSS or plain CSS with CSS variables for theming
- **No backend required** — all data is client-side

---

## Features

### 1. Settings Screen (Landing Page)

#### Script Selection
- Checkboxes or toggle buttons for:
  - [ ] Hiragana
  - [ ] Katakana
- User must select at least one to proceed

#### Character Set Selection
Multi-select options (user can pick any combination):
- [ ] Basic (gojūon) — 46 base characters per script
- [ ] Voiced (dakuten/handakuten) — が, ざ, だ, ば, ぱ series
- [ ] Combos (yōon) — きゃ, しゅ, ちょ, etc.
- [ ] Extended Katakana — ファ, ティ, ヴァ, etc. (for foreign loanwords)

User must select at least one character set to proceed.

#### Start Button
- Disabled until valid selections are made
- Clicking starts the game session

---

### 2. Game Screen

#### Layout (Top to Bottom)
1. **Stats Bar** (always visible at top)
   - Score: total cards answered correctly on first try
   - Accuracy: percentage (correct first attempts / total unique cards seen)
   - Streak: consecutive correct first-attempt answers

2. **Card Display** (center, dominant element)
   - Large kana character (e.g., 80-120px font size)
   - Centered vertically and horizontally in the main area

3. **Input Field**
   - Single text input, auto-focused on load and after each answer
   - Placeholder text: "Type romaji..."
   - Submit on Enter key press

4. **Helper Text**
   - Small text below input: "Press Enter to submit"

5. **Quit Button**
   - Bottom of screen or corner
   - Ends session and shows summary

#### Game Behavior

**On Correct Answer:**
- Brief green flash/highlight effect on the card or input
- Increment Score by 1
- Increment Streak by 1
- Update Accuracy
- Load next random card
- Clear and re-focus input

**On Wrong Answer:**
- Brief red flash/shake effect on input
- Reset Streak to 0
- Clear input field
- **Same card stays** — user must retry until correct
- Wrong attempts on the same card don't affect Score, but do affect Accuracy

**Accuracy Calculation:**
```
Accuracy = (Cards answered correctly on first try) / (Total unique cards attempted) × 100
```

**Randomization:**
- Pure random selection from the enabled character pool
- No spaced repetition or weighting

---

### 3. Summary Screen (After Quit)

Display final session stats:
- Total Score (correct first attempts)
- Final Accuracy percentage
- Best Streak achieved during session
- Total cards attempted
- Session duration (optional, nice-to-have)

#### Struggled Cards Section (Optional Enhancement)
- List cards that took more than one attempt
- Show: kana → correct romaji

#### Buttons
- "Play Again" — return to settings with previous selections remembered
- "Reset" — return to settings with defaults

---

## Character Data

### Hiragana Basic (46 characters)
```
あ:a, い:i, う:u, え:e, お:o
か:ka, き:ki, く:ku, け:ke, こ:ko
さ:sa, し:shi/si, す:su, せ:se, そ:so
た:ta, ち:chi/ti, つ:tsu/tu, て:te, と:to
な:na, に:ni, ぬ:nu, ね:ne, の:no
は:ha, ひ:hi, ふ:fu/hu, へ:he, ほ:ho
ま:ma, み:mi, む:mu, め:me, も:mo
や:ya, ゆ:yu, よ:yo
ら:ra, り:ri, る:ru, れ:re, ろ:ro
わ:wa, を:wo/o, ん:n
```

### Hiragana Voiced — Dakuten (20) + Handakuten (5)
```
が:ga, ぎ:gi, ぐ:gu, げ:ge, ご:go
ざ:za, じ:ji/zi, ず:zu, ぜ:ze, ぞ:zo
だ:da, ぢ:ji/di, づ:zu/du, で:de, ど:do
ば:ba, び:bi, ぶ:bu, べ:be, ぼ:bo
ぱ:pa, ぴ:pi, ぷ:pu, ぺ:pe, ぽ:po
```

### Hiragana Combos — Yōon (33)
```
きゃ:kya, きゅ:kyu, きょ:kyo
しゃ:sha/sya, しゅ:shu/syu, しょ:sho/syo
ちゃ:cha/tya, ちゅ:chu/tyu, ちょ:cho/tyo
にゃ:nya, にゅ:nyu, にょ:nyo
ひゃ:hya, ひゅ:hyu, ひょ:hyo
みゃ:mya, みゅ:myu, みょ:myo
りゃ:rya, りゅ:ryu, りょ:ryo
ぎゃ:gya, ぎゅ:gyu, ぎょ:gyo
じゃ:ja/zya, じゅ:ju/zyu, じょ:jo/zyo
びゃ:bya, びゅ:byu, びょ:byo
ぴゃ:pya, ぴゅ:pyu, ぴょ:pyo
```

### Katakana Basic (46 characters)
```
ア:a, イ:i, ウ:u, エ:e, オ:o
カ:ka, キ:ki, ク:ku, ケ:ke, コ:ko
サ:sa, シ:shi/si, ス:su, セ:se, ソ:so
タ:ta, チ:chi/ti, ツ:tsu/tu, テ:te, ト:to
ナ:na, ニ:ni, ヌ:nu, ネ:ne, ノ:no
ハ:ha, ヒ:hi, フ:fu/hu, ヘ:he, ホ:ho
マ:ma, ミ:mi, ム:mu, メ:me, モ:mo
ヤ:ya, ユ:yu, ヨ:yo
ラ:ra, リ:ri, ル:ru, レ:re, ロ:ro
ワ:wa, ヲ:wo/o, ン:n
```

### Katakana Voiced — Dakuten (20) + Handakuten (5)
```
ガ:ga, ギ:gi, グ:gu, ゲ:ge, ゴ:go
ザ:za, ジ:ji/zi, ズ:zu, ゼ:ze, ゾ:zo
ダ:da, ヂ:ji/di, ヅ:zu/du, デ:de, ド:do
バ:ba, ビ:bi, ブ:bu, ベ:be, ボ:bo
パ:pa, ピ:pi, プ:pu, ペ:pe, ポ:po
```

### Katakana Combos — Yōon (33)
```
キャ:kya, キュ:kyu, キョ:kyo
シャ:sha/sya, シュ:shu/syu, ショ:sho/syo
チャ:cha/tya, チュ:chu/tyu, チョ:cho/tyo
ニャ:nya, ニュ:nyu, ニョ:nyo
ヒャ:hya, ヒュ:hyu, ヒョ:hyo
ミャ:mya, ミュ:myu, ミョ:myo
リャ:rya, リュ:ryu, リョ:ryo
ギャ:gya, ギュ:gyu, ギョ:gyo
ジャ:ja/zya, ジュ:ju/zyu, ジョ:jo/zyo
ビャ:bya, ビュ:byu, ビョ:byo
ピャ:pya, ピュ:pyu, ピョ:pyo
```

### Extended Katakana (for foreign words)
```
ファ:fa, フィ:fi, フェ:fe, フォ:fo
ティ:ti, ディ:di, トゥ:tu, ドゥ:du
ウィ:wi, ウェ:we, ウォ:wo
ヴァ:va, ヴィ:vi, ヴ:vu, ヴェ:ve, ヴォ:vo
シェ:she, ジェ:je, チェ:che
ツァ:tsa, ツィ:tsi, ツェ:tse, ツォ:tso
```

---

## Input Validation

### Accepted Romaji Formats
Multiple romanization systems should be accepted. Store answers as arrays:

```javascript
// Example data structure
{
  kana: "し",
  answers: ["shi", "si"]
},
{
  kana: "ふ",
  answers: ["fu", "hu"]
},
{
  kana: "ち",
  answers: ["chi", "ti"]
}
```

### Input Handling
- Case-insensitive comparison (accept "SHI", "Shi", "shi")
- Trim whitespace before comparing
- No partial matching — must be exact match to one of the accepted answers

---

## UI/UX Requirements

### Theme
- **Dark mode only**
- Background: dark gray/black (#1a1a1a or similar)
- Text: white/light gray
- Accent colors: 
  - Green for correct (#4ade80 or similar)
  - Red for incorrect (#f87171 or similar)

### Typography
- Kana display: Large, clear Japanese font (Noto Sans JP, or system default)
- Size: 80-120px for the main character
- Stats and UI: Clean sans-serif, 14-16px

### Responsive Design
- Mobile-friendly (works on phone screens)
- Input should not cause zoom on mobile (use font-size: 16px minimum)

### Keyboard Navigation
- Auto-focus input field on game start and after each answer
- Enter to submit answer
- Escape to quit (optional)
- Tab navigation for settings screen

### Animations (Subtle)
- Correct: brief green glow or background flash (200-300ms)
- Wrong: brief red flash + subtle shake on input (200-300ms)
- Card transition: subtle fade or scale (optional)

---

## State Management

### Session State
```javascript
{
  // Settings
  scripts: ['hiragana', 'katakana'], // selected scripts
  charSets: ['basic', 'voiced', 'combos', 'extended'], // selected sets
  
  // Active game
  currentCard: { kana: 'き', answers: ['ki'] },
  characterPool: [...], // filtered based on settings
  
  // Stats
  score: 0, // correct first attempts
  totalAttempted: 0, // unique cards seen
  currentStreak: 0,
  bestStreak: 0,
  attemptedThisCard: false, // tracks if current card had wrong attempt
  
  // For summary
  struggledCards: [], // cards that took multiple tries
  startTime: Date.now()
}
```

---

## File Structure Suggestion

```
/kiru
├── index.html
├── styles.css
├── app.js
├── data/
│   └── kana.js          # All character data
└── README.md
```

Or if using React:
```
/kiru
├── public/
│   └── index.html
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── Settings.jsx
│   │   ├── Game.jsx
│   │   └── Summary.jsx
│   ├── data/
│   │   └── kana.js
│   └── styles/
│       └── app.css
└── package.json
```

---

## Optional Enhancements (Nice-to-Have)

1. **Sound effects** — ding for correct, buzz for wrong (with mute toggle)
2. **Session timer** — show elapsed time on summary
3. **Local storage** — remember last used settings
4. **High score tracking** — persist best scores in localStorage
5. **Hint system** — after 3 wrong attempts, show first letter of answer
6. **Progress indicator** — show which character sets user has mastered

---

## Acceptance Criteria

1. User can select Hiragana, Katakana, or both
2. User can select which character sets to include
3. App displays random kana from selected pool
4. User types romaji and submits with Enter
5. Correct answers advance to next card; wrong answers require retry
6. Stats (score, accuracy, streak) update in real-time
7. Multiple valid romanizations are accepted
8. Quit button shows session summary
9. Dark mode UI with clean, minimal design
10. Works on desktop and mobile browsers
