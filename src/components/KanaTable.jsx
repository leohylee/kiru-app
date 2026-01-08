import { useState } from 'react';

// Kana reference table organized by consonant rows
const HIRAGANA_TABLE = {
  basic: [
    { row: '', chars: [{ kana: 'あ', romaji: 'a' }, { kana: 'い', romaji: 'i' }, { kana: 'う', romaji: 'u' }, { kana: 'え', romaji: 'e' }, { kana: 'お', romaji: 'o' }] },
    { row: 'k', chars: [{ kana: 'か', romaji: 'ka' }, { kana: 'き', romaji: 'ki' }, { kana: 'く', romaji: 'ku' }, { kana: 'け', romaji: 'ke' }, { kana: 'こ', romaji: 'ko' }] },
    { row: 's', chars: [{ kana: 'さ', romaji: 'sa' }, { kana: 'し', romaji: 'shi' }, { kana: 'す', romaji: 'su' }, { kana: 'せ', romaji: 'se' }, { kana: 'そ', romaji: 'so' }] },
    { row: 't', chars: [{ kana: 'た', romaji: 'ta' }, { kana: 'ち', romaji: 'chi' }, { kana: 'つ', romaji: 'tsu' }, { kana: 'て', romaji: 'te' }, { kana: 'と', romaji: 'to' }] },
    { row: 'n', chars: [{ kana: 'な', romaji: 'na' }, { kana: 'に', romaji: 'ni' }, { kana: 'ぬ', romaji: 'nu' }, { kana: 'ね', romaji: 'ne' }, { kana: 'の', romaji: 'no' }] },
    { row: 'h', chars: [{ kana: 'は', romaji: 'ha' }, { kana: 'ひ', romaji: 'hi' }, { kana: 'ふ', romaji: 'fu' }, { kana: 'へ', romaji: 'he' }, { kana: 'ほ', romaji: 'ho' }] },
    { row: 'm', chars: [{ kana: 'ま', romaji: 'ma' }, { kana: 'み', romaji: 'mi' }, { kana: 'む', romaji: 'mu' }, { kana: 'め', romaji: 'me' }, { kana: 'も', romaji: 'mo' }] },
    { row: 'y', chars: [{ kana: 'や', romaji: 'ya' }, null, { kana: 'ゆ', romaji: 'yu' }, null, { kana: 'よ', romaji: 'yo' }] },
    { row: 'r', chars: [{ kana: 'ら', romaji: 'ra' }, { kana: 'り', romaji: 'ri' }, { kana: 'る', romaji: 'ru' }, { kana: 'れ', romaji: 're' }, { kana: 'ろ', romaji: 'ro' }] },
    { row: 'w', chars: [{ kana: 'わ', romaji: 'wa' }, null, null, null, { kana: 'を', romaji: 'wo' }] },
    { row: '', chars: [{ kana: 'ん', romaji: 'n' }, null, null, null, null] },
  ],
  voiced: [
    { row: 'g', chars: [{ kana: 'が', romaji: 'ga' }, { kana: 'ぎ', romaji: 'gi' }, { kana: 'ぐ', romaji: 'gu' }, { kana: 'げ', romaji: 'ge' }, { kana: 'ご', romaji: 'go' }] },
    { row: 'z', chars: [{ kana: 'ざ', romaji: 'za' }, { kana: 'じ', romaji: 'ji' }, { kana: 'ず', romaji: 'zu' }, { kana: 'ぜ', romaji: 'ze' }, { kana: 'ぞ', romaji: 'zo' }] },
    { row: 'd', chars: [{ kana: 'だ', romaji: 'da' }, { kana: 'ぢ', romaji: 'ji' }, { kana: 'づ', romaji: 'zu' }, { kana: 'で', romaji: 'de' }, { kana: 'ど', romaji: 'do' }] },
    { row: 'b', chars: [{ kana: 'ば', romaji: 'ba' }, { kana: 'び', romaji: 'bi' }, { kana: 'ぶ', romaji: 'bu' }, { kana: 'べ', romaji: 'be' }, { kana: 'ぼ', romaji: 'bo' }] },
    { row: 'p', chars: [{ kana: 'ぱ', romaji: 'pa' }, { kana: 'ぴ', romaji: 'pi' }, { kana: 'ぷ', romaji: 'pu' }, { kana: 'ぺ', romaji: 'pe' }, { kana: 'ぽ', romaji: 'po' }] },
  ],
  combos: [
    { row: 'ky', chars: [{ kana: 'きゃ', romaji: 'kya' }, { kana: 'きゅ', romaji: 'kyu' }, { kana: 'きょ', romaji: 'kyo' }] },
    { row: 'sh', chars: [{ kana: 'しゃ', romaji: 'sha' }, { kana: 'しゅ', romaji: 'shu' }, { kana: 'しょ', romaji: 'sho' }] },
    { row: 'ch', chars: [{ kana: 'ちゃ', romaji: 'cha' }, { kana: 'ちゅ', romaji: 'chu' }, { kana: 'ちょ', romaji: 'cho' }] },
    { row: 'ny', chars: [{ kana: 'にゃ', romaji: 'nya' }, { kana: 'にゅ', romaji: 'nyu' }, { kana: 'にょ', romaji: 'nyo' }] },
    { row: 'hy', chars: [{ kana: 'ひゃ', romaji: 'hya' }, { kana: 'ひゅ', romaji: 'hyu' }, { kana: 'ひょ', romaji: 'hyo' }] },
    { row: 'my', chars: [{ kana: 'みゃ', romaji: 'mya' }, { kana: 'みゅ', romaji: 'myu' }, { kana: 'みょ', romaji: 'myo' }] },
    { row: 'ry', chars: [{ kana: 'りゃ', romaji: 'rya' }, { kana: 'りゅ', romaji: 'ryu' }, { kana: 'りょ', romaji: 'ryo' }] },
    { row: 'gy', chars: [{ kana: 'ぎゃ', romaji: 'gya' }, { kana: 'ぎゅ', romaji: 'gyu' }, { kana: 'ぎょ', romaji: 'gyo' }] },
    { row: 'j', chars: [{ kana: 'じゃ', romaji: 'ja' }, { kana: 'じゅ', romaji: 'ju' }, { kana: 'じょ', romaji: 'jo' }] },
    { row: 'by', chars: [{ kana: 'びゃ', romaji: 'bya' }, { kana: 'びゅ', romaji: 'byu' }, { kana: 'びょ', romaji: 'byo' }] },
    { row: 'py', chars: [{ kana: 'ぴゃ', romaji: 'pya' }, { kana: 'ぴゅ', romaji: 'pyu' }, { kana: 'ぴょ', romaji: 'pyo' }] },
  ],
};

const KATAKANA_TABLE = {
  basic: [
    { row: '', chars: [{ kana: 'ア', romaji: 'a' }, { kana: 'イ', romaji: 'i' }, { kana: 'ウ', romaji: 'u' }, { kana: 'エ', romaji: 'e' }, { kana: 'オ', romaji: 'o' }] },
    { row: 'k', chars: [{ kana: 'カ', romaji: 'ka' }, { kana: 'キ', romaji: 'ki' }, { kana: 'ク', romaji: 'ku' }, { kana: 'ケ', romaji: 'ke' }, { kana: 'コ', romaji: 'ko' }] },
    { row: 's', chars: [{ kana: 'サ', romaji: 'sa' }, { kana: 'シ', romaji: 'shi' }, { kana: 'ス', romaji: 'su' }, { kana: 'セ', romaji: 'se' }, { kana: 'ソ', romaji: 'so' }] },
    { row: 't', chars: [{ kana: 'タ', romaji: 'ta' }, { kana: 'チ', romaji: 'chi' }, { kana: 'ツ', romaji: 'tsu' }, { kana: 'テ', romaji: 'te' }, { kana: 'ト', romaji: 'to' }] },
    { row: 'n', chars: [{ kana: 'ナ', romaji: 'na' }, { kana: 'ニ', romaji: 'ni' }, { kana: 'ヌ', romaji: 'nu' }, { kana: 'ネ', romaji: 'ne' }, { kana: 'ノ', romaji: 'no' }] },
    { row: 'h', chars: [{ kana: 'ハ', romaji: 'ha' }, { kana: 'ヒ', romaji: 'hi' }, { kana: 'フ', romaji: 'fu' }, { kana: 'ヘ', romaji: 'he' }, { kana: 'ホ', romaji: 'ho' }] },
    { row: 'm', chars: [{ kana: 'マ', romaji: 'ma' }, { kana: 'ミ', romaji: 'mi' }, { kana: 'ム', romaji: 'mu' }, { kana: 'メ', romaji: 'me' }, { kana: 'モ', romaji: 'mo' }] },
    { row: 'y', chars: [{ kana: 'ヤ', romaji: 'ya' }, null, { kana: 'ユ', romaji: 'yu' }, null, { kana: 'ヨ', romaji: 'yo' }] },
    { row: 'r', chars: [{ kana: 'ラ', romaji: 'ra' }, { kana: 'リ', romaji: 'ri' }, { kana: 'ル', romaji: 'ru' }, { kana: 'レ', romaji: 're' }, { kana: 'ロ', romaji: 'ro' }] },
    { row: 'w', chars: [{ kana: 'ワ', romaji: 'wa' }, null, null, null, { kana: 'ヲ', romaji: 'wo' }] },
    { row: '', chars: [{ kana: 'ン', romaji: 'n' }, null, null, null, null] },
  ],
  voiced: [
    { row: 'g', chars: [{ kana: 'ガ', romaji: 'ga' }, { kana: 'ギ', romaji: 'gi' }, { kana: 'グ', romaji: 'gu' }, { kana: 'ゲ', romaji: 'ge' }, { kana: 'ゴ', romaji: 'go' }] },
    { row: 'z', chars: [{ kana: 'ザ', romaji: 'za' }, { kana: 'ジ', romaji: 'ji' }, { kana: 'ズ', romaji: 'zu' }, { kana: 'ゼ', romaji: 'ze' }, { kana: 'ゾ', romaji: 'zo' }] },
    { row: 'd', chars: [{ kana: 'ダ', romaji: 'da' }, { kana: 'ヂ', romaji: 'ji' }, { kana: 'ヅ', romaji: 'zu' }, { kana: 'デ', romaji: 'de' }, { kana: 'ド', romaji: 'do' }] },
    { row: 'b', chars: [{ kana: 'バ', romaji: 'ba' }, { kana: 'ビ', romaji: 'bi' }, { kana: 'ブ', romaji: 'bu' }, { kana: 'ベ', romaji: 'be' }, { kana: 'ボ', romaji: 'bo' }] },
    { row: 'p', chars: [{ kana: 'パ', romaji: 'pa' }, { kana: 'ピ', romaji: 'pi' }, { kana: 'プ', romaji: 'pu' }, { kana: 'ペ', romaji: 'pe' }, { kana: 'ポ', romaji: 'po' }] },
  ],
  combos: [
    { row: 'ky', chars: [{ kana: 'キャ', romaji: 'kya' }, { kana: 'キュ', romaji: 'kyu' }, { kana: 'キョ', romaji: 'kyo' }] },
    { row: 'sh', chars: [{ kana: 'シャ', romaji: 'sha' }, { kana: 'シュ', romaji: 'shu' }, { kana: 'ショ', romaji: 'sho' }] },
    { row: 'ch', chars: [{ kana: 'チャ', romaji: 'cha' }, { kana: 'チュ', romaji: 'chu' }, { kana: 'チョ', romaji: 'cho' }] },
    { row: 'ny', chars: [{ kana: 'ニャ', romaji: 'nya' }, { kana: 'ニュ', romaji: 'nyu' }, { kana: 'ニョ', romaji: 'nyo' }] },
    { row: 'hy', chars: [{ kana: 'ヒャ', romaji: 'hya' }, { kana: 'ヒュ', romaji: 'hyu' }, { kana: 'ヒョ', romaji: 'hyo' }] },
    { row: 'my', chars: [{ kana: 'ミャ', romaji: 'mya' }, { kana: 'ミュ', romaji: 'myu' }, { kana: 'ミョ', romaji: 'myo' }] },
    { row: 'ry', chars: [{ kana: 'リャ', romaji: 'rya' }, { kana: 'リュ', romaji: 'ryu' }, { kana: 'リョ', romaji: 'ryo' }] },
    { row: 'gy', chars: [{ kana: 'ギャ', romaji: 'gya' }, { kana: 'ギュ', romaji: 'gyu' }, { kana: 'ギョ', romaji: 'gyo' }] },
    { row: 'j', chars: [{ kana: 'ジャ', romaji: 'ja' }, { kana: 'ジュ', romaji: 'ju' }, { kana: 'ジョ', romaji: 'jo' }] },
    { row: 'by', chars: [{ kana: 'ビャ', romaji: 'bya' }, { kana: 'ビュ', romaji: 'byu' }, { kana: 'ビョ', romaji: 'byo' }] },
    { row: 'py', chars: [{ kana: 'ピャ', romaji: 'pya' }, { kana: 'ピュ', romaji: 'pyu' }, { kana: 'ピョ', romaji: 'pyo' }] },
  ],
  extended: [
    { row: 'f', chars: [{ kana: 'ファ', romaji: 'fa' }, { kana: 'フィ', romaji: 'fi' }, null, { kana: 'フェ', romaji: 'fe' }, { kana: 'フォ', romaji: 'fo' }] },
    { row: 't/d', chars: [null, { kana: 'ティ', romaji: 'ti' }, { kana: 'トゥ', romaji: 'tu' }, null, null] },
    { row: 'd', chars: [null, { kana: 'ディ', romaji: 'di' }, { kana: 'ドゥ', romaji: 'du' }, null, null] },
    { row: 'w', chars: [null, { kana: 'ウィ', romaji: 'wi' }, null, { kana: 'ウェ', romaji: 'we' }, { kana: 'ウォ', romaji: 'wo' }] },
    { row: 'v', chars: [{ kana: 'ヴァ', romaji: 'va' }, { kana: 'ヴィ', romaji: 'vi' }, { kana: 'ヴ', romaji: 'vu' }, { kana: 'ヴェ', romaji: 've' }, { kana: 'ヴォ', romaji: 'vo' }] },
    { row: 'sh/j/ch', chars: [null, null, null, { kana: 'シェ', romaji: 'she' }, null] },
    { row: '', chars: [null, null, null, { kana: 'ジェ', romaji: 'je' }, null] },
    { row: '', chars: [null, null, null, { kana: 'チェ', romaji: 'che' }, null] },
    { row: 'ts', chars: [{ kana: 'ツァ', romaji: 'tsa' }, { kana: 'ツィ', romaji: 'tsi' }, null, { kana: 'ツェ', romaji: 'tse' }, { kana: 'ツォ', romaji: 'tso' }] },
  ],
};

function KanaCell({ char }) {
  if (!char) {
    return <div className="w-12 h-14 md:w-14 md:h-16" />;
  }

  return (
    <div className="w-12 h-14 md:w-14 md:h-16 flex flex-col items-center justify-center bg-gray-800/50 rounded-lg">
      <span
        className="text-xl md:text-2xl"
        style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
      >
        {char.kana}
      </span>
      <span className="text-[10px] md:text-xs text-gray-400">{char.romaji}</span>
    </div>
  );
}

function TableSection({ title, rows, columns = 5 }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-400 mb-2 text-center">{title}</h3>
      <div className="flex flex-col gap-1 items-center">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.chars.slice(0, columns).map((char, charIndex) => (
              <KanaCell key={charIndex} char={char} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const HIRAGANA_SUBTABS = [
  { id: 'basic', label: 'Basic', columns: 5 },
  { id: 'voiced', label: 'Voiced', columns: 5 },
  { id: 'combos', label: 'Combos', columns: 3 },
];

const KATAKANA_SUBTABS = [
  { id: 'basic', label: 'Basic', columns: 5 },
  { id: 'voiced', label: 'Voiced', columns: 5 },
  { id: 'combos', label: 'Combos', columns: 3 },
  { id: 'extended', label: 'Extended', columns: 5 },
];

export default function KanaTable({ type }) {
  const table = type === 'hiragana' ? HIRAGANA_TABLE : KATAKANA_TABLE;
  const subtabs = type === 'hiragana' ? HIRAGANA_SUBTABS : KATAKANA_SUBTABS;
  const title = type === 'hiragana' ? 'Hiragana' : 'Katakana';
  const subtitle = type === 'hiragana' ? 'ひらがな' : 'カタカナ';
  const [activeSubtab, setActiveSubtab] = useState('basic');

  const currentSubtab = subtabs.find((t) => t.id === activeSubtab) || subtabs[0];

  return (
    <div className="bg-[#2a2e30] text-white p-4 md:p-6">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-center mb-1">{title}</h2>
        <p
          className="text-gray-400 text-center mb-4"
          style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
        >
          {subtitle}
        </p>

        <div className="flex justify-center gap-1 mb-6">
          {subtabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubtab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeSubtab === tab.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <TableSection
          title=""
          rows={table[currentSubtab.id]}
          columns={currentSubtab.columns}
        />
      </div>
    </div>
  );
}
