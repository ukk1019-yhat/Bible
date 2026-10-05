const fs = require('fs');
const path = require('path');

const SRC = 'C:/Users/ukkuk/AppData/Local/Temp/opencode/te-bible/telugu-bsi.xml';
const OUT_BIBLE = 'C:/Users/ukkuk/Downloads/Aparanjani mam/public/bible';
const OUT_TS = 'C:/Users/ukkuk/Downloads/Aparanjani mam/src/data/bible';

const BOOKS = [
  ['ఆదికాండము', 'Genesis', 'genesis', 'ot'],
  ['నిర్గమకాండము', 'Exodus', 'exodus', 'ot'],
  ['లేవీయకాండము', 'Leviticus', 'leviticus', 'ot'],
  ['సంఖ్యాకాండము', 'Numbers', 'numbers', 'ot'],
  ['ద్వితీయోపదేశకాండము', 'Deuteronomy', 'deuteronomy', 'ot'],
  ['యెహోషువ', 'Joshua', 'joshua', 'ot'],
  ['న్యాయాధిపతులు', 'Judges', 'judges', 'ot'],
  ['రూతు', 'Ruth', 'ruth', 'ot'],
  ['1 సమూయేలు', '1 Samuel', '1-samuel', 'ot'],
  ['2 సమూయేలు', '2 Samuel', '2-samuel', 'ot'],
  ['1 రాజులు', '1 Kings', '1-kings', 'ot'],
  ['2 రాజులు', '2 Kings', '2-kings', 'ot'],
  ['1 దినవృత్తాంతములు', '1 Chronicles', '1-chronicles', 'ot'],
  ['2 దినవృత్తాంతములు', '2 Chronicles', '2-chronicles', 'ot'],
  ['ఎజ్రా', 'Ezra', 'ezra', 'ot'],
  ['నెహెమ్యా', 'Nehemiah', 'nehemiah', 'ot'],
  ['ఎస్తేరు', 'Esther', 'esther', 'ot'],
  ['యోబు', 'Job', 'job', 'ot'],
  ['కీర్తనలు', 'Psalms', 'psalms', 'ot'],
  ['సామెతలు', 'Proverbs', 'proverbs', 'ot'],
  ['ఉపదేశకాండము', 'Ecclesiastes', 'ecclesiastes', 'ot'],
  ['ప్రేమ సంగీతము', 'Song of Solomon', 'song-of-solomon', 'ot'],
  ['యెషయా', 'Isaiah', 'isaiah', 'ot'],
  ['యెరెమియా', 'Jeremiah', 'jeremiah', 'ot'],
  ['విలాపము', 'Lamentations', 'lamentations', 'ot'],
  ['యెజకీయేలు', 'Ezekiel', 'ezekiel', 'ot'],
  ['దానియేలు', 'Daniel', 'daniel', 'ot'],
  ['హోషేయా', 'Hosea', 'hosea', 'ot'],
  ['యోయేలు', 'Joel', 'joel', 'ot'],
  ['ఆమోసు', 'Amos', 'amos', 'ot'],
  ['ఒబదీయా', 'Obadiah', 'obadiah', 'ot'],
  ['యోనా', 'Jonah', 'jonah', 'ot'],
  ['మీకా', 'Micah', 'micah', 'ot'],
  ['నాహూము', 'Nahum', 'nahum', 'ot'],
  ['హబక్కూకు', 'Habakkuk', 'habakkuk', 'ot'],
  ['సెపనీయా', 'Zephaniah', 'zephaniah', 'ot'],
  ['హెగ్యాయు', 'Haggai', 'haggai', 'ot'],
  ['జెకరీయా', 'Zechariah', 'zechariah', 'ot'],
  ['మలాకీ', 'Malachi', 'malachi', 'ot'],
  ['మత్తయి', 'Matthew', 'matthew', 'nt'],
  ['మార్కు', 'Mark', 'mark', 'nt'],
  ['లూకా', 'Luke', 'luke', 'nt'],
  ['యోహాను', 'John', 'john', 'nt'],
  ['అపొస్తలుల కార్యములు', 'Acts', 'acts', 'nt'],
  ['రోమీయులకు', 'Romans', 'romans', 'nt'],
  ['1 కరింథీయులకు', '1 Corinthians', '1-corinthians', 'nt'],
  ['2 కరింథీయులకు', '2 Corinthians', '2-corinthians', 'nt'],
  ['గలాతీయులకు', 'Galatians', 'galatians', 'nt'],
  ['ఎఫీసీయులకు', 'Ephesians', 'ephesians', 'nt'],
  ['ఫిలిప్పీయులకు', 'Philippians', 'philippians', 'nt'],
  ['కాలాస్సీయులకు', 'Colossians', 'colossians', 'nt'],
  ['1 తెస్సలోనీకయులకు', '1 Thessalonians', '1-thessalonians', 'nt'],
  ['2 తెస్సలోనీకయులకు', '2 Thessalonians', '2-thessalonians', 'nt'],
  ['1 తిమోథికి', '1 Timothy', '1-timothy', 'nt'],
  ['2 తిమోథికి', '2 Timothy', '2-timothy', 'nt'],
  ['తితుకు', 'Titus', 'titus', 'nt'],
  ['ఫిలెమోను', 'Philemon', 'philemon', 'nt'],
  ['హెబ్రీయులకు', 'Hebrews', 'hebrews', 'nt'],
  ['యాకోబు', 'James', 'james', 'nt'],
  ['1 పేతురు', '1 Peter', '1-peter', 'nt'],
  ['2 పేతురు', '2 Peter', '2-peter', 'nt'],
  ['1 యోహాను', '1 John', '1-john', 'nt'],
  ['2 యోహాను', '2 John', '2-john', 'nt'],
  ['3 యోహాను', '3 John', '3-john', 'nt'],
  ['యూదా', 'Jude', 'jude', 'nt'],
  ['ప్రకటన', 'Revelation', 'revelation', 'nt'],
];

const decode = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, '&');

const normalise = (t) =>
  decode(t)
    .replace(/\s+/g, ' ')
    .trim();

fs.mkdirSync(OUT_BIBLE, { recursive: true });
fs.mkdirSync(OUT_TS, { recursive: true });

const xml = fs.readFileSync(SRC, 'utf8');
const bookRe = new RegExp(
  '<BIBLEBOOK bnumber="(\\d+)" bname="([^"]*)">([\\s\\S]*?)</BIBLEBOOK>',
  'g'
);
const chapRe = new RegExp('<CHAPTER cnumber="(\\d+)">([\\s\\S]*?)</CHAPTER>', 'g');
const versRe = new RegExp('<VERS vnumber="(\\d+)">([\\s\\S]*?)</VERS>', 'g');

const parsed = new Map();
let m;
while ((m = bookRe.exec(xml)) !== null) {
  const num = Number(m[1]);
  const chapters = [];
  let c;
  const body = m[3];
  chapRe.lastIndex = 0;
  while ((c = chapRe.exec(body)) !== null) {
    const verses = [];
    versRe.lastIndex = 0;
    let vMatch;
    while ((vMatch = versRe.exec(c[2])) !== null) {
      verses.push(normalise(vMatch[2]));
    }
    chapters.push([Number(c[1]), verses]);
  }
  parsed.set(num, { name: m[2], chapters });
}

const meta = [];
let totalChapters = 0;
let totalVerses = 0;

for (let i = 0; i < BOOKS.length; i += 1) {
  const [telugu, english, slug, testament] = BOOKS[i];
  const num = i + 1;
  const book = parsed.get(num);
  if (!book) throw new Error(`Missing book ${num} (${english})`);

  const chapters = book.chapters
    .sort((a, b) => a[0] - b[0])
    .map(([c, verses]) => [c, verses]);

  const payload = { b: num, e: english, t: telugu, c: chapters };
  const file = path.join(OUT_BIBLE, `${slug}.json`);
  fs.writeFileSync(file, JSON.stringify(payload), 'utf8');

  const verseCount = chapters.reduce((sum, [, verses]) => sum + verses.length, 0);
  totalChapters += chapters.length;
  totalVerses += verseCount;

  meta.push({
    number: num,
    slug,
    telugu,
    english,
    shortTelugu: telugu.replace(/ (కాండము|ఎబ్బరికి వచ్చిన.*)$/u, ''),
    testament,
    chapters: chapters.length,
    verses: verseCount,
  });

  console.log(
    `${String(num).padStart(2)} ${slug.padEnd(18)} ch=${String(chapters.length).padStart(3)} v=${String(verseCount).padStart(4)} ${(fs.statSync(file).size / 1024).toFixed(0)}KB`
  );
}

const ts = `// AUTO-GENERATED — do not edit by hand.
// Telugu Bible (BSI) book catalogue, chapter/verse counts derived from the
// source text. Regenerate with: node scripts/generate-bible-data.mjs

export type Testament = 'ot' | 'nt';

export interface BibleBookMeta {
  /** 1-based canonical position. */
  number: number;
  slug: string;
  telugu: string;
  english: string;
  /** Condensed Telugu name used in tight UI (chapter lists, chips). */
  shortTelugu: string;
  testament: Testament;
  chapters: number;
  verses: number;
}

export const BIBLE_BOOKS: readonly BibleBookMeta[] = ${JSON.stringify(meta, null, 2)} as const;

export const OT_BOOK_COUNT = ${meta.filter((b) => b.testament === 'ot').length};
export const NT_BOOK_COUNT = ${meta.filter((b) => b.testament === 'nt').length};
export const BIBLE_CHAPTER_COUNT = ${totalChapters};
export const BIBLE_VERSE_COUNT = ${totalVerses};
`;

fs.writeFileSync(path.join(OUT_TS, 'books.generated.ts'), ts, 'utf8');

console.log(
  `\n${meta.length} books · ${totalChapters} chapters · ${totalVerses} verses · total ${(
    meta.reduce((s, b) => s + fs.statSync(path.join(OUT_BIBLE, `${b.slug}.json`)).size, 0) /
    1024 /
    1024
  ).toFixed(2)} MB`
);