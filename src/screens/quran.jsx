// quran.jsx — مُلوِّن التجويد الكامل + فهرس + قارئ السورة (١١٤ سورة) + ضغط الكلمة للمعنى

// ── نظام ألوان التجويد (رواية حفص) ──────────────────────────────────────
// أربع عائلات تظهر في المفتاح المبسّط، وتدرّجات دقيقة تظهر على الحروف
// (يشرحها مفصَّلاً «ورقة ألوان التجويد» + صفحة التعليمات في الإعدادات)
const TJ = {
  base:      '#1A2E25',
  // المدود (أحمر بتدرّجاته)
  maddLazim: '#8E1B16',   // مدّ لازم (٦ حركات) — أحمر غامق
  maddWajib: '#D9531E',   // واجب متّصل (٤–٥) — برتقالي
  maddJaiz:  '#7E3F98',   // جائز منفصل / عارض للسكون — بنفسجي (موفي)
  maddSila:  '#C43E78',   // صلة صغرى — وردي
  // الغُنّة (أخضر)
  ghunnah:   '#1E8A4C',
  // القلقلة والتفخيم (أزرق)
  qalqalah:  '#15599E',   // قلقلة — أزرق غامق
  tafkheem:  '#3E8FCB',   // راء مفخّمة / لفظ الجلالة — أزرق سماوي
  // حروف لا تُنطق (رمادي)
  silent:    '#9AA39E',
  // القراءات: المخالف لرواية حفص
  diff:      '#0E7C73',
  // أحكام ورش الخاصّة
  wBadal:    '#C0392B',   // مدّ البدل
  wLeen:     '#D98324',   // مدّ اللين
  wTaqlil:   '#B8860B',   // التقليل
  wLamG:     '#7A5230',   // اللام المغلّظة
  wRaMur:    '#2E9E9E',   // الراء المرقّقة
  // أحكام بقيّة الروايات
  nIdgham:   '#6D28D9',   // الإدغام (الكبير) — بنفسجي
  nImala:    '#8A5A00',   // الإمالة — بنّيّ ذهبيّ غامق
  nHaa:      '#C2185B',   // هاء الضمير المخالفة — قرمزيّ
};
// المفتاح المبسّط في صفحة السورة وفي المقدّمة — أربع عائلات فقط
const TAJWEED_LEGEND = [
  { c: '#C0392B',  label: 'المدود' },
  { c: TJ.ghunnah, label: 'الغُنّة' },
  { c: TJ.qalqalah, label: 'القلقلة' },
  { c: TJ.silent,  label: 'حروف لا تُنطق' },
];

// رموز التشكيل
const FAT='\u064E', DAM='\u064F', KAS='\u0650', SUK='\u0652', SHAD='\u0651',
  MADDA='\u0653', DAGGER='\u0670';
const TANWEEN = '\u064B\u064C\u064D';
const isMark = (c) => !c ? false : ((c >= '\u064B' && c <= '\u0655') || c === DAGGER ||
  (c >= '\u06D6' && c <= '\u06ED') || c === '\u0640'); // marks + pause signs + tatweel
const HAMZA = 'ءأؤإئآ';
const QALQ = 'قطبجد';
const IKHFA = 'تثجدذزسشصضطظفقك';
const IDGHAM_GH = 'ينمو';   // إدغام بغُنّة
const IDGHAM_NO = 'لر';     // إدغام بلا غُنّة
const SUN = 'تثدذرزسشصضطظلن';          // الحروف الشمسية
const ALEF_WASLA = '\u0671';            // ٱ همزة وصل
const SILA_W = '\u06E5', SILA_Y = '\u06E6';  // علامتا الصلة (واو/ياء صغيرة)

function nextLetterIdx(ch, i) {
  let j = i + 1;
  while (j < ch.length && (isMark(ch[j]) || ch[j] === ' ')) j++;
  return j < ch.length ? j : -1;
}
// أقرب حرفٍ تالٍ مع الإشارة إلى تجاوز مسافة (لتمييز المتّصل عن المنفصل)
function nextLetterInfo(ch, i) {
  let j = i + 1, crossed = false;
  while (j < ch.length && (isMark(ch[j]) || ch[j] === ' ')) { if (ch[j] === ' ') crossed = true; j++; }
  return { idx: j < ch.length ? j : -1, crossed };
}

// يلوّن آية كاملة (مصفوفة كلمات) ويعيد مصفوفة مقاطع ملوّنة لكل كلمة
function colorizeAyah(words) {
  const text = words.map(w => w.t).join(' ');
  const ch = [...text];
  const n = ch.length;
  const col = new Array(n).fill(TJ.base);
  const set = (i, c) => { if (i >= 0 && i < n) col[i] = c; };
  const paint = (i, c) => { if (i >= 0 && i < n && col[i] === TJ.base) col[i] = c; };
  const isLetter = (c) => !!c && !isMark(c) && c !== ' ';
  const atWordStart = (i) => i === 0 || ch[i - 1] === ' ';
  const prevLetter = (i) => { let j = i - 1; while (j >= 0 && (isMark(ch[j]) || ch[j] === ' ')) j--; return j >= 0 ? j : -1; };
  const marksAfter = (i) => { const m = []; let j = i + 1; while (j < n && isMark(ch[j])) { m.push(ch[j]); j++; } return m; };
  const hasShadda = (i) => marksAfter(i).includes(SHAD);
  const hasSukoon = (i) => marksAfter(i).includes(SUK);
  const harakaOf = (i) => { for (const m of marksAfter(i)) { if (m === FAT || m === DAM || m === KAS) return m; } return ''; };
  const lastLetter = (() => { for (let k = n - 1; k >= 0; k--) if (isLetter(ch[k])) return k; return -1; })();
  const paintMadd = (i, t) => set(i, t === 'lazim' ? TJ.maddLazim : t === 'wajib' ? TJ.maddWajib : t === 'sila' ? TJ.maddSila : TJ.maddJaiz);

  for (let i = 0; i < n; i++) {
    const c = ch[i];
    if (!isLetter(c)) {
      // علامتا الصلة (واو/ياء صغيرة) = مدّ صلة (كبرى قبل الهمزة كالمنفصل)
      if (c === SILA_W || c === SILA_Y) {
        const info = nextLetterInfo(ch, i);
        const big = info.idx >= 0 && HAMZA.includes(ch[info.idx]);
        set(i, big ? TJ.maddJaiz : TJ.maddSila);
        const p = prevLetter(i); if (p >= 0 && ch[p] === 'ه') paint(p, big ? TJ.maddJaiz : TJ.maddSila);
      } else if (c === MADDA) {   // علامة المدّة المركّبة فوق حرف المدّ
        const info = nextLetterInfo(ch, i);
        const lc = info.idx >= 0 ? ch[info.idx] : '';
        const t = HAMZA.includes(lc) ? (info.crossed ? 'jaiz' : 'wajib') : (info.idx >= 0 && hasShadda(info.idx) ? 'lazim' : 'jaiz');
        paintMadd(i, t); const p = prevLetter(i); if (p >= 0) paintMadd(p, t);
      }
      continue;
    }

    // همزة وصل (ٱ) أو ألف «الـ» التعريف → رمادي + لام شمسية
    if (c === ALEF_WASLA || (c === 'ا' && atWordStart(i) && harakaOf(i) === '' && !marksAfter(i).length)) {
      const info = nextLetterInfo(ch, i);
      if (info.idx >= 0 && ch[info.idx] === 'ل') {
        set(i, TJ.silent);
        const info2 = nextLetterInfo(ch, info.idx);
        if (info2.idx >= 0 && SUN.includes(ch[info2.idx]) && hasShadda(info2.idx)) set(info.idx, TJ.silent); // لام شمسية
        continue;
      }
      if (c === ALEF_WASLA) { set(i, TJ.silent); continue; }
    }

    // آ (ألف مدّة مركّبة) → لازم إن تبِعتها شدّة
    if (c === 'آ') { const info = nextLetterInfo(ch, i); if (info.idx >= 0 && hasShadda(info.idx)) paintMadd(i, 'lazim'); continue; }

    // نون/ميم مشدّدة → غُنّة
    if ((c === 'ن' || c === 'م') && hasShadda(i)) { set(i, TJ.ghunnah); continue; }

    // نون ساكنة + الحرف التالي
    if (c === 'ن' && hasSukoon(i)) {
      const lc = (() => { const info = nextLetterInfo(ch, i); return info.idx >= 0 ? ch[info.idx] : ''; })();
      if (lc === 'ب') paint(i, TJ.ghunnah);                 // إقلاب (غُنّة)
      else if (IDGHAM_GH.includes(lc)) paint(i, TJ.ghunnah); // إدغام بغُنّة
      else if (IDGHAM_NO.includes(lc)) paint(i, TJ.silent);  // إدغام بلا غُنّة → تسقط النون
      else if (IKHFA.includes(lc)) paint(i, TJ.ghunnah);     // إخفاء
      continue;
    }
    // ميم ساكنة → إخفاء/إدغام شفوي (قبل ب/م)
    if (c === 'م' && hasSukoon(i)) {
      const info = nextLetterInfo(ch, i); const lc = info.idx >= 0 ? ch[info.idx] : '';
      if (lc === 'ب' || lc === 'م') paint(i, TJ.ghunnah);
      continue;
    }
    // تنوين على هذا الحرف
    if (marksAfter(i).some(m => TANWEEN.includes(m))) {
      const info = nextLetterInfo(ch, i); const lc = info.idx >= 0 ? ch[info.idx] : '';
      if (lc === 'ب' || IDGHAM_GH.includes(lc) || IKHFA.includes(lc)) paint(i, TJ.ghunnah);
      else if (IDGHAM_NO.includes(lc)) paint(i, TJ.silent);
    }

    // قلقلة: حرف قلقلة ساكن أو في آخر الآية (وقفاً)
    if (QALQ.includes(c) && (hasSukoon(i) || i === lastLetter)) { paint(i, TJ.qalqalah); continue; }

    // راء مفخّمة → أزرق سماوي (المكسورة مرقّقة تُترك)
    if (c === 'ر') {
      const h = harakaOf(i);
      if (h === FAT || h === DAM) paint(i, TJ.tafkheem);
      else if (hasSukoon(i)) { const p = prevLetter(i); const ph = p >= 0 ? harakaOf(p) : ''; if (ph === FAT || ph === DAM) paint(i, TJ.tafkheem); }
      continue;
    }

    // مدّ حرفي: ا بعد فتح، و بعد ضمّ، ي/ى بعد كسر
    const ph = prevLetter(i) >= 0 ? harakaOf(prevLetter(i)) : '';
    const isMaddLetter = (c === 'ا' && ph === FAT) || (c === 'و' && ph === DAM) || ((c === 'ي' || c === 'ى') && ph === KAS);
    if (isMaddLetter) {
      const info = nextLetterInfo(ch, i); const lc = info.idx >= 0 ? ch[info.idx] : '';
      if (HAMZA.includes(lc)) paintMadd(i, info.crossed ? 'jaiz' : 'wajib');           // منفصل / متّصل
      else if (info.idx >= 0 && (hasShadda(info.idx) || hasSukoon(info.idx))) paintMadd(i, 'lazim'); // لازم
      else if (info.idx === lastLetter || info.idx < 0) paintMadd(i, 'jaiz');          // عارض للسكون (وقفاً)
      continue;
    }
  }

  // لفظ الجلالة (الله/لله): تفخيم اللامين بعد فتح أو ضمّ
  for (let i = 0; i < n - 1; i++) {
    if (ch[i] === 'ل' && ch[i + 1] === 'ل') {
      const info = nextLetterInfo(ch, i + 1);
      if (info.idx >= 0 && ch[info.idx] === 'ه') {
        const p = prevLetter(i); const ph2 = p >= 0 ? harakaOf(p) : '';
        if (ph2 !== KAS) { paint(i, TJ.tafkheem); paint(i + 1, TJ.tafkheem); }
      }
    }
  }

  return sliceByWords(words, col);
}

// قطْع مصفوفة الألوان حسب الكلمات → مقاطع لكل كلمة
function sliceByWords(words, col) {
  const out = [];
  let off = 0;
  for (const wd of words) {
    const chars = [...wd.t];
    const slice = col.slice(off, off + chars.length);
    const segs = [];
    for (let i = 0; i < chars.length; i++) {
      if (segs.length && segs[segs.length - 1].c === slice[i]) segs[segs.length - 1].t += chars[i];
      else segs.push({ t: chars[i], c: (slice[i] || TJ.base) });
    }
    out.push(segs);
    off += chars.length + 1; // +1 للمسافة
  }
  return out;
}

// تلوين القراءات: إبراز الكلمات المخالفة لرواية حفص (مقارنةً موضعيّة آمنة)
function stripMarks(t) { return [...t].filter(c => !isMark(c)).join(''); }
// تطبيع للمقارنة فقط (لا للعرض): يوحّد صور الألف (الوصل/الخنجرية) كي لا يُحسَب اختلاف الرسم خلافاً،
// لكن يُبقي الألف الخنجرية حرفاً لأنّ وجودها أو غيابها فرقٌ حقيقيّ بين القراءات (مَٰلِك ↔ مَلِك)
function normForDiff(t) {
  return [...t]
    .filter(c => !isMark(c) || c === '\u0670')               // أزِل الحركات وعلامات الوقف، وأبقِ الألف الخنجرية
    .join('')
    .replace(/[\u0671\u0623\u0625\u0622\u0627\u0670]/g, '\u0627')  // ٱ أ إ آ ا والخنجرية → ا
    .replace(/\u0649/g, '\u064A')                              // ى → ي
    .replace(/\u0629/g, '\u0647')                              // ة → ه
    .replace(/\u0640/g, '');                                   // ـ تطويل
}
function wordsDiffer(a, b) { return normForDiff(a) !== normForDiff(b); }

// مقارنة على مستوى الكلمة عبر السورة كاملةً (لا آيةً آيةً) — يعالج اختلاف عدّ الآيات
// بين الرواية وحفص بإعادة المزامنة ضمن نافذةٍ صغيرة. يعيد: flags (مخالفة) + hmap (كلمة حفص المحاذية)
function buildDiffFlags(narrAyahs, hafsAyahs) {
  const flags = narrAyahs.map(a => a.map(() => false));
  const hmap  = narrAyahs.map(a => a.map(() => null));   // كلمة حفص الموازية لكلّ كلمة رواية
  if (!hafsAyahs) return { flags, hmap };
  const A = [], ref = [], B = [], Bw = [];      // A: كلمات الرواية مطبّعة؛ B: حفص مطبّعة؛ Bw: حفص الخام
  narrAyahs.forEach((a, ai) => a.forEach((w, wi) => { A.push(normForDiff(w.t)); ref.push([ai, wi]); }));
  hafsAyahs.forEach(a => a.forEach(w => { B.push(normForDiff(w.t)); Bw.push(w.t); }));
  const W = 5;                                   // نافذة إعادة المزامنة
  let i = 0, j = 0;
  const mark = (k) => { const [ai, wi] = ref[k]; flags[ai][wi] = true; };
  const link = (k, jj) => { const [ai, wi] = ref[k]; hmap[ai][wi] = Bw[jj] || null; };
  while (i < A.length) {
    if (j < B.length && A[i] === B[j]) { link(i, j); i++; j++; continue; }
    let done = false;
    for (let k = 1; k <= W && !done; k++) {
      if (i + k < A.length && j < B.length && A[i + k] === B[j]) { for (let x = 0; x < k; x++) mark(i + x); i += k; done = true; break; }      // حذفٌ من حفص
      if (j + k < B.length && i < A.length && A[i] === B[j + k]) { j += k; done = true; break; }                                              // زيادةٌ في حفص
      if (i + k < A.length && j + k < B.length && A[i + k] === B[j + k]) { for (let x = 0; x < k; x++) mark(i + x); i += k; j += k; done = true; break; } // استبدال
    }
    if (!done) { mark(i); link(i, j); i++; j++; }
  }
  return { flags, hmap };
}
function colorizeDiff(words, diffRow) {
  return words.map((wd, i) => [{ t: wd.t, c: (diffRow && diffRow[i]) ? TJ.diff : TJ.base }]);
}

// ── تلوين بقيّة الروايات وفق العلامات المثبتة في النصّ الرسمي ───────────
// 06E5 واو صغيرة (صلة)، 06E6 ياء صغيرة (صلة هاء)، 06ED إمالة، 06EA تقليل
const SMALL_WAW = '\u06E5', SMALL_YA = '\u06E6', M_IMALA = '\u06ED', M_TAQLIL = '\u06EA';
const NARRATION_RULES = {
  bazzi:  { silatMeem: true, haaDameer: true },
  qumbul: { silatMeem: true, haaDameer: true },
  qaloon: { idgham: true },
  doori:  { idgham: true, imala: true, taqlil: true },
  soosi:  { idgham: true, imala: true, taqlil: true },
};
const NARRATION_LEGENDS = {
  bazzi:  [{ c: TJ.diff, label: 'المخالف لحفص' }, { c: TJ.nHaa, label: 'هاء الضمير' }, { c: TJ.ghunnah, label: 'صلة ميم الجمع' }],
  qumbul: [{ c: TJ.diff, label: 'المخالف لحفص' }, { c: TJ.nHaa, label: 'هاء الضمير' }, { c: TJ.ghunnah, label: 'صلة ميم الجمع' }],
  qaloon: [{ c: TJ.diff, label: 'المخالف لحفص' }, { c: TJ.nIdgham, label: 'الإدغام' }],
  doori:  [{ c: TJ.diff, label: 'المخالف لحفص' }, { c: TJ.nIdgham, label: 'الإدغام' }, { c: TJ.nImala, label: 'الإمالة' }, { c: TJ.wTaqlil, label: 'التقليل' }],
  soosi:  [{ c: TJ.diff, label: 'المخالف لحفص' }, { c: TJ.nIdgham, label: 'الإدغام' }, { c: TJ.nImala, label: 'الإمالة' }, { c: TJ.wTaqlil, label: 'التقليل' }],
};
const NARRATION_DETAILS = {
  bazzi:  { title: 'أحكام البزّي عن ابن كثير', items: [
    { c: TJ.diff,    t: 'الحرف المخالف لحفص' },
    { c: TJ.nHaa,    t: 'هاء الضمير المخالفة لحفص', d: 'حيث تُوصَل بخلاف حفص' },
    { c: TJ.ghunnah, t: 'صلة ميم الجمع', d: 'ميم الجمع توصل بواوٍ' },
  ]},
  qumbul: { title: 'أحكام قُنبُل عن ابن كثير', items: [
    { c: TJ.diff,    t: 'الحرف المخالف لحفص' },
    { c: TJ.nHaa,    t: 'هاء الضمير المخالفة لحفص', d: 'حيث تُوصَل بخلاف حفص' },
    { c: TJ.ghunnah, t: 'صلة ميم الجمع', d: 'ميم الجمع توصل بواوٍ' },
  ]},
  qaloon: { title: 'أحكام قالون عن نافع', items: [
    { c: TJ.diff,    t: 'الحرف المخالف لحفص' },
    { c: TJ.nIdgham, t: 'الإدغام' },
  ]},
  doori:  { title: 'أحكام الدوري عن أبي عمرو', items: [
    { c: TJ.diff,    t: 'الكلمة المخالفة لحفص' },
    { c: TJ.nIdgham, t: 'الإدغام' },
    { c: TJ.nImala,  t: 'الإمالة' },
    { c: TJ.wTaqlil, t: 'التقليل' },
  ]},
  soosi:  { title: 'أحكام السوسي عن أبي عمرو', items: [
    { c: TJ.diff,    t: 'الحرف المخالف لحفص' },
    { c: TJ.nIdgham, t: 'الإدغام' },
    { c: TJ.wTaqlil, t: 'التقليل' },
    { c: TJ.nImala,  t: 'الإمالة' },
  ]},
};
function colorizeNarration(key, words, diffRow, hmapRow) {
  const rules = NARRATION_RULES[key] || {};
  const text = words.map(w => w.t).join(' ');
  const ch = [...text];
  const n = ch.length;
  const col = new Array(n).fill(TJ.base);
  // خريطة الحرف → فهرس الكلمة (لمطابقة كلمة حفص الموازية)
  const wordOf = new Array(n).fill(-1);
  { let off = 0; for (let wi = 0; wi < words.length; wi++) { const L = [...words[wi].t].length; for (let k = 0; k < L; k++) wordOf[off + k] = wi; off += L + 1; } }
  const set = (i, c) => { if (i >= 0 && i < n && col[i] === TJ.base) col[i] = c; };
  const isLetter = (c) => !!c && !isMark(c) && c !== ' ';
  const marksAfter = (i) => { let m = '', j = i + 1; while (j < n && isMark(ch[j])) { m += ch[j]; j++; } return m; };
  const hasShadda = (i) => marksAfter(i).indexOf('\u0651') >= 0;
  const hasVowel  = (i) => /[\u064B-\u0650]/.test(marksAfter(i));   // فتحة/ضمّة/كسرة/تنوين
  const prevLetter = (i) => { let j = i - 1; while (j >= 0 && (isMark(ch[j]) || ch[j] === ' ')) j--; return j; };

  // إمالة (06ED) وتقليل (06EA) — عند أبي عمرو تخصّان «ذوات الياء» (الألف المرسومة ياءً ى)
  // لذا لا نلوّن إلا إذا تبع الحرفَ الّذي عليه العلامةُ ألفٌ مقصورة (ى)
  // حتّى لا تُلوّنَ كلماتٌ كـ«اهدنا» خطأً.
  const maqsuraNext = (i) => { let j = i + 1; while (j < n && isMark(ch[j])) j++; return j < n && ch[j] === 'ى'; };
  for (let i = 0; i < n; i++) {
    const mk = marksAfter(i);
    if (rules.imala && mk.indexOf(M_IMALA) >= 0 && isLetter(ch[i]) && maqsuraNext(i)) {
      set(i, TJ.nImala);
      let j = i + 1; while (j < n && (isMark(ch[j]) || 'ىي'.includes(ch[j]))) { if ('ىي'.includes(ch[j])) col[j] = (col[j] === TJ.base ? TJ.nImala : col[j]); j++; }
    }
    if (rules.taqlil && mk.indexOf(M_TAQLIL) >= 0 && isLetter(ch[i]) && maqsuraNext(i)) {
      set(i, TJ.wTaqlil);
      let j = i + 1; while (j < n && (isMark(ch[j]) || 'ىي'.includes(ch[j]))) { if ('ىي'.includes(ch[j])) col[j] = (col[j] === TJ.base ? TJ.wTaqlil : col[j]); j++; }
    }
    // صلة ميم الجمع (ابن كثير): ميم متبوعة بواو صغيرة
    if (rules.silatMeem && ch[i] === 'م' && mk.indexOf(SMALL_WAW) >= 0) set(i, TJ.ghunnah);
    // هاء الضمير المخالفة لحفص: هاء موصولة (واو/ياء صغيرة) لا توجد صلتُها في كلمة حفص الموازية
    if (rules.haaDameer && ch[i] === 'ه' && (mk.indexOf(SMALL_WAW) >= 0 || mk.indexOf(SMALL_YA) >= 0)) {
      const hafsW = (hmapRow && wordOf[i] >= 0) ? hmapRow[wordOf[i]] : null;
      const hafsHasSila = hafsW && (hafsW.indexOf(SMALL_WAW) >= 0 || hafsW.indexOf(SMALL_YA) >= 0);
      if (!hafsHasSila) set(i, TJ.nHaa);
    }
  }

  // الإدغام (المتماثلان عبر الكلمتين): آخر حرف كلمةٍ يساوي أوّل حرف التالية وعليه شدّة، والأوّل مجرّد
  if (rules.idgham) {
    let off = 0;
    for (let wi = 0; wi < words.length - 1; wi++) {
      const wlen = [...words[wi].t].length;
      let last = off + wlen - 1; while (last >= off && !isLetter(ch[last])) last--;
      let first = off + wlen + 1;  // بعد المسافة
      while (first < n && !isLetter(ch[first])) first++;
      if (last >= off && first < n && isLetter(ch[last]) && isLetter(ch[first])
          && ch[last] === ch[first] && hasShadda(first) && !hasVowel(last) && !hasShadda(last)) {
        set(last, TJ.nIdgham); set(first, TJ.nIdgham);
      }
      off += wlen + 1;
    }
  }

  // المخالف لحفص — يُطبَّق أخيراً على الحروف المتبقّية في الكلمات المختلفة
  if (diffRow) {
    let off = 0;
    for (let wi = 0; wi < words.length; wi++) {
      const chars = [...words[wi].t];
      if (diffRow[wi]) for (let k = 0; k < chars.length; k++) if (col[off + k] === TJ.base && isLetter(chars[k])) col[off + k] = TJ.diff;
      off += chars.length + 1;
    }
  }
  return sliceByWords(words, col);
}

// مفتاح ألوان رواية ورش
const WARSH_LEGEND = [
  { c: TJ.diff,    label: 'المخالف لحفص' },
  { c: TJ.ghunnah, label: 'الإدغام وصلة ميم الجمع' },
  { c: TJ.wTaqlil, label: 'التقليل' },
  { c: TJ.wBadal,  label: 'مدّ البدل' },
  { c: TJ.wLeen,   label: 'مدّ اللين' },
  { c: TJ.wRaMur,  label: 'الراءات المرقّقة' },
  { c: TJ.wLamG,   label: 'اللامات المغلّظة' },
];

// تلوين رواية ورش عن نافع — أحكامها الخاصّة معتمدةً على النصّ الرسمي (KFGQPC)
const ISTILA = 'خصضغطقظ';
function colorizeWarsh(words, diffRow) {
  const text = words.map(w => w.t).join(' ');
  const ch = [...text];
  const n = ch.length;
  const col = new Array(n).fill(TJ.base);
  const set = (i, c) => { if (i >= 0 && i < n) col[i] = c; };
  const paint = (i, c) => { if (i >= 0 && i < n && col[i] === TJ.base) col[i] = c; };
  const isLetter = (c) => !!c && !isMark(c) && c !== ' ';
  const prevLetter = (i) => { let j = i - 1; while (j >= 0 && (isMark(ch[j]) || ch[j] === ' ')) j--; return j >= 0 ? j : -1; };
  const marksAfter = (i) => { const m = []; let j = i + 1; while (j < n && isMark(ch[j])) { m.push(ch[j]); j++; } return m; };
  const hasSukoon = (i) => marksAfter(i).includes(SUK);
  const hasShadda = (i) => marksAfter(i).includes(SHAD);
  const harakaOf = (i) => { for (const m of marksAfter(i)) { if (m === FAT || m === DAM || m === KAS) return m; } return ''; };
  const lastLetter = (() => { for (let k = n - 1; k >= 0; k--) if (isLetter(ch[k])) return k; return -1; })();

  for (let i = 0; i < n; i++) {
    const c = ch[i];
    if (!isLetter(c)) continue;

    // التقليل — ذوات الياء تُكتب في مصحف ورش ياءً تعلوها ألف خنجرية (ي + ٰ)
    if (c === 'ي' && ch[i + 1] === DAGGER) { set(i, TJ.wTaqlil); set(i + 1, TJ.wTaqlil); continue; }

    // مدّ البدل — همزة يتبعها حرف مدّ حقيقيّ: ءَا (دائماً)، أُو ساكنة، إِي ساكنة
    if (c === 'آ') { set(i, TJ.wBadal); continue; }
    if (HAMZA.includes(c)) {
      const hz = harakaOf(i);
      let j = i + 1; while (j < n && isMark(ch[j])) j++;
      const nl = j < n ? ch[j] : '';
      const nlMarks = marksAfter(j);
      const nlBare = !nlMarks.some(m => m === FAT || m === DAM || m === KAS || m === SHAD); // ساكنٌ مدّيّ لا حركة عليه ولا شدّة
      const isMaddLetter =
        nl === 'ا' ||
        (nl === 'و' && hz === DAM && nlBare) ||
        (nl === 'ي' && hz === KAS && nlBare);
      if (isMaddLetter) { set(i, TJ.wBadal); set(j, TJ.wBadal); }
      continue;
    }

    // مدّ اللين — واو/ياء ساكنة بعد فتح
    if ((c === 'و' || c === 'ي') && hasSukoon(i)) {
      const p = prevLetter(i); if (p >= 0 && harakaOf(p) === FAT) { set(i, TJ.wLeen); continue; }
    }

    // اللام المغلّظة — لام مفتوحة بعد ص/ط/ظ (مفتوحة أو ساكنة)
    if (c === 'ل' && harakaOf(i) === FAT) {
      const p = prevLetter(i);
      if (p >= 0 && 'صطظ'.includes(ch[p]) && (harakaOf(p) === FAT || hasSukoon(p))) { paint(i, TJ.wLamG); continue; }
    }

    // الراء المرقّقة — مكسورة، أو ساكنة بعد كسرٍ وليس بعدها حرف استعلاء
    if (c === 'ر') {
      const h = harakaOf(i);
      if (h === KAS) { paint(i, TJ.wRaMur); continue; }
      if (hasSukoon(i)) {
        const p = prevLetter(i); let j = i + 1; while (j < n && (isMark(ch[j]) || ch[j] === ' ')) j++;
        const nextL = j < n ? ch[j] : '';
        if (p >= 0 && harakaOf(p) === KAS && !ISTILA.includes(nextL)) { paint(i, TJ.wRaMur); continue; }
      }
      continue;
    }

    // الغُنّة والإدغام (مشترك مع حفص)
    if ((c === 'ن' || c === 'م') && hasShadda(i)) { set(i, TJ.ghunnah); continue; }
    if (c === 'ن' && hasSukoon(i)) {
      let j = i + 1; while (j < n && (isMark(ch[j]) || ch[j] === ' ')) j++; const lc = j < n ? ch[j] : '';
      if (lc === 'ب' || IDGHAM_GH.includes(lc) || IKHFA.includes(lc)) paint(i, TJ.ghunnah);
      else if (IDGHAM_NO.includes(lc)) paint(i, TJ.silent);
      continue;
    }
    if (marksAfter(i).some(m => TANWEEN.includes(m))) {
      let j = i + 1; while (j < n && (isMark(ch[j]) || ch[j] === ' ')) j++; const lc = j < n ? ch[j] : '';
      if (lc === 'ب' || IDGHAM_GH.includes(lc) || IKHFA.includes(lc)) paint(i, TJ.ghunnah);
      else if (IDGHAM_NO.includes(lc)) paint(i, TJ.silent);
    }
    if (c === 'م' && hasSukoon(i)) {
      let j = i + 1; while (j < n && (isMark(ch[j]) || ch[j] === ' ')) j++; const lc = j < n ? ch[j] : '';
      if (lc === 'ب' || lc === 'م') paint(i, TJ.ghunnah);
      continue;
    }
  }

  // صلة ميم الجمع — ميمٌ مضمومةٌ في آخر ضمير جمع (ـهم/ـكم/ـتم) يليها همزة قطع
  {
    let off = 0;
    for (let wi = 0; wi < words.length; wi++) {
      const wlen = [...words[wi].t].length;
      const next = words[wi + 1];
      // آخر حرفٍ في الكلمة
      let last = off + wlen - 1; while (last >= off && !isLetter(ch[last])) last--;
      if (last >= off && ch[last] === 'م' && harakaOf(last) === DAM) {
        const p = prevLetter(last);
        const okPron = p >= 0 && 'هكت'.includes(ch[p]);
        const nextHamza = next && HAMZA.includes([...next.t][0]);
        if (okPron && nextHamza) set(last, TJ.ghunnah);
      }
      off += wlen + 1;
    }
  }

  // المخالف لحفص — الحروف المتبقّية في الكلمات المختلفة عن حفص (وفق المقارنة على مستوى السورة)
  if (diffRow) {
    let off = 0;
    for (let wi = 0; wi < words.length; wi++) {
      const chars = [...words[wi].t];
      if (diffRow[wi]) {
        for (let k = 0; k < chars.length; k++) if (col[off + k] === TJ.base && isLetter(chars[k])) col[off + k] = TJ.diff;
      }
      off += chars.length + 1;
    }
  }

  return sliceByWords(words, col);
}

// تلوين كلمة واحدة (للعناوين)
function tajweedSegments(word) { return colorizeAyah([{ t: word, m: '' }])[0]; }

// ── تحميل السور غير المحفوظة من مصدر موثوق (نص عثماني بالتشكيل) ─────────
// يدمج علامات الوقف المنفصلة (ۖ ۗ ۚ ۛ …) بالكلمة السابقة كي لا يُبعدها الضبط
const _remoteCache = {};
function isMarkOnlyToken(tok) {
  return [...tok].every(c =>
    (c >= '\u064B' && c <= '\u0655') || c === '\u0670' ||
    (c >= '\u06D6' && c <= '\u06ED') || c === '\u0640' || c === '\u08F0' || c === '\u08F1' || c === '\u08F2');
}
function tokenizeVerse(text) {
  // إزالة رمز بداية رُبع الحزب ۞ (U+06DE) من النصّ — علامة المحراب تُغني عنه
  const raw = text.replace(/\u06DE/g, ' ').trim().split(/\s+/);
  const words = [];
  for (const tok of raw) {
    if (!tok) continue;
    if (isMarkOnlyToken(tok) && words.length) {
      // علامة وقف/ضبط مستقلّة → ألصِقها مباشرةً بآخر كلمة كي لا يُبعدها الضبط (justify)
      words[words.length - 1].t += tok;
    } else {
      words.push({ t: tok, m: '' });
    }
  }
  return words;
}
async function fetchSurah(num) {
  if (_remoteCache[num]) return _remoteCache[num];
  const res = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${num}`);
  if (!res.ok) throw new Error('fetch failed');
  const data = await res.json();
  const ayahs = data.verses.map(v => tokenizeVerse(v.text_uthmani));
  _remoteCache[num] = ayahs;
  return ayahs;
}

// ── المصحف كامل: يُجلب مرّة واحدة في الخلفية، فتُفتح أي سورة فوراً ───────
const _allText = {};            // chapter → [ ayah:[{t,m}] ]
let _allPromise = null;
function ensureAllQuran() {
  if (_allPromise) return _allPromise;
  _allPromise = fetch('https://api.quran.com/api/v4/quran/verses/uthmani')
    .then(r => { if (!r.ok) throw new Error('quran fetch failed'); return r.json(); })
    .then(data => {
      for (const v of data.verses) {
        const ch = parseInt(v.verse_key.split(':')[0], 10);
        if (!_allText[ch]) _allText[ch] = [];
        _allText[ch].push(tokenizeVerse(v.text_uthmani));
      }
      return _allText;
    })
    .catch(e => { _allPromise = null; throw e; });   // allow retry
  return _allPromise;
}

// ── القراءات العشر: نصّ المصحف بحسب الرواية المختارة ────────────────────
// المصدر: بيانات مجمع الملك فهد (KFGQPC) عبر raw.githubusercontent (CORS مفعّل)
// متوفّرة نصوصُ ٨ روايات بالرسم العثماني مع خطوطها الرسمية لكل رواية
const KFG_BASE = 'https://raw.githubusercontent.com/thetruetruth/quran-data-kfgqpc/main/';
const KFG_JSD  = 'https://cdn.jsdelivr.net/gh/thetruetruth/quran-data-kfgqpc@main/';
const KFGQPC = {
  hafs:   { file: 'hafs/data/hafsData_v18.json',     font: '',         fontFile: '' },
  warsh:  { file: 'warsh/data/warshData_v10.json',  font: 'warsh10',  fontFile: 'warsh/font/warsh.10' },
  qaloon: { file: 'qaloon/data/QaloonData_v10.json', font: 'qaloon10', fontFile: 'qaloon/font/qaloon.10' },
  shouba: { file: 'shouba/data/ShoubaData08.json',   font: 'shouba8',  fontFile: 'shouba/font/shouba.8' },
  doori:  { file: 'doori/data/DooriData_v09.json',   font: 'doori9',   fontFile: 'doori/font/doori.9' },
  soosi:  { file: 'soosi/data/SoosiData09.json',     font: 'soosi9',   fontFile: 'soosi/font/soosi.9' },
  bazzi:  { file: 'bazzi/data/BazziData_v07.json',   font: 'bazzi7',   fontFile: 'bazzi/font/bazzi.7' },
  qumbul: { file: 'qumbul/data/QumbulData_v07.json', font: 'qumbul7',  fontFile: 'qumbul/font/qumbul.7' },
};
const _narrationCache = {};
function normAr(s) {
  return (s || '').replace(/[\u064B-\u0652\u0670]/g, '')
    .replace(/[إأآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
    .replace(/[ّـ]/g, '').replace(/\s+/g, ' ').trim();
}
const isHafsQiraah = (q) => !q || normAr(q) === normAr('حفص عن عاصم');
// يربط القراءة المختارة برواية KFGQPC المتوفّرة — أو null إن كانت حفص/غير متوفّرة
function resolveNarration(qiraah) {
  const q = normAr(qiraah);
  const has = (s) => q.indexOf(normAr(s)) >= 0;
  if (has('حفص')) return null;                 // الافتراضي — مسار حفص المعتاد
  if (has('شعبة')) return 'shouba';
  if (has('ورش')) return 'warsh';
  if (has('قالون')) return 'qaloon';
  if (has('البزي') || has('بزي')) return 'bazzi';
  if (has('قنبل')) return 'qumbul';
  if (has('السوسي') || has('سوسي')) return 'soosi';
  if (has('الدوري') && (has('عمرو') || has('البصري'))) return 'doori';
  return null;                                  // قراءةٌ نصّها غير متوفّر بعد
}
// حقن خطّ الرواية الرسمي عند الحاجة (مرّة واحدة لكل رواية)
function ensureNarrationFont(key) {
  const meta = KFGQPC[key]; if (!meta || typeof document === 'undefined') return;
  const id = 'kfg-font-' + key;
  if (document.getElementById(id)) return;
  const st = document.createElement('style'); st.id = id;
  st.textContent = `@font-face{font-family:"${meta.font}";`
    + `src:url("${KFG_JSD}${meta.fontFile}.woff2") format("woff2"),`
    + `url("${KFG_BASE}${meta.fontFile}.woff2") format("woff2"),`
    + `url("${KFG_BASE}${meta.fontFile}.ttf") format("truetype");font-display:swap;}`;
  document.head.appendChild(st);
}
// إزالة رقم الآية المُلحَق بنهاية نصّ الآية في بيانات المجمع
function stripAyaNumber(t) {
  return String(t).replace(/[\u0660-\u0669\u06F0-\u06F9]+\s*$/u, '').trim();
}
async function loadNarration(key) {
  if (_narrationCache[key]) return _narrationCache[key];
  const meta = KFGQPC[key]; if (!meta) throw new Error('unknown narration');
  let rows = null;
  for (const base of [KFG_BASE, KFG_JSD]) {     // raw أولاً ثمّ jsDelivr احتياطاً
    try { const r = await fetch(base + meta.file); if (r.ok) { rows = await r.json(); break; } } catch (e) {}
  }
  if (!rows) throw new Error('narration fetch failed');
  const byS = {};
  for (const row of rows) {
    const s = row.sura_no != null ? row.sura_no : row.sora;   // بيانات حفص تستعمل sora بدل sura_no
    if (s == null) continue;
    (byS[s] || (byS[s] = [])).push(tokenizeVerse(stripAyaNumber(row.aya_text || '')));
  }
  _narrationCache[key] = byS;
  return byS;
}
async function fetchSurahQiraah(num, qiraah) {
  const key = resolveNarration(qiraah);
  if (!key) throw new Error('no-kfgqpc');
  const all = await loadNarration(key);
  const a = all[num];
  if (!a || !a.length) throw new Error('empty');
  return a;
}

// يوائم مصفوفة آيات حفص (المرجع) مع آيات الرواية — يعالج عدّ البسملة المختلف (الفاتحة)
const BASMALA_NORM = 'بسماللهالرحمنالرحيم';
function alignHafsRef(hafs, narr) {
  if (!hafs || !narr) return hafs || null;
  if (hafs.length === narr.length) return hafs;
  if (hafs.length === narr.length + 1) {   // حفص يعدّ البسملة آيةً والرواية لا تعدّها → احذف الأولى
    const first = normForDiff(hafs[0].map(w => w.t).join(''));
    if (first.indexOf(BASMALA_NORM) >= 0) return hafs.slice(1);
    return hafs.slice(0, narr.length);
  }
  return hafs;
}

// ── تحميل التفسير الميسّر لآية (مع تخزين مؤقت) ──────────────────────────
// المصدر: التفسير الميسّر — مجمع الملك فهد لطباعة المصحف الشريف (resource_id=16)
const TAFSIR_NAME = 'التفسير الميسّر';
const _tafsirCache = {};
async function fetchTafsir(surahNum, ayahNum) {
  const key = `${surahNum}:${ayahNum}`;
  if (_tafsirCache[key]) return _tafsirCache[key];
  const res = await fetch(`https://api.quran.com/api/v4/tafsirs/16/by_ayah/${key}`);
  if (!res.ok) throw new Error('tafsir failed');
  const data = await res.json();
  const text = (data.tafsir && data.tafsir.text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  _tafsirCache[key] = text;
  return text;
}

// ── التراجم العالمية — تُجلب لحظيًّا من Quran.com API (مصادر نصوصها من Tanzil.net) ──
// لا تُخزَّن على خوادمنا: تُستدعى الترجمة المختارة عند الطلب فحسب
const AFNAN_TRANSLATIONS = [
  { key: 'none', id: null, ar: 'بدون ترجمة',  native: 'العربية فقط',      by: 'النصّ العربيّ وحده',                     dir: 'rtl' },
  { key: 'en',   id: 20,   ar: 'الإنجليزية',  native: 'English',          by: 'Saheeh International',                   dir: 'ltr' },
  { key: 'tr',   id: 77,   ar: 'التركية',     native: 'Türkçe',           by: 'Diyanet İşleri',                        dir: 'ltr' },
  { key: 'ur',   id: 97,   ar: 'الأوردية',    native: 'اردو',             by: 'سید ابو الاعلیٰ مودودی · تفہیم القرآن',  dir: 'rtl' },
  { key: 'id',   id: 33,   ar: 'الإندونيسية', native: 'Bahasa Indonesia', by: 'Kementerian Agama RI',                  dir: 'ltr' },
];
window.AFNAN_TRANSLATIONS = AFNAN_TRANSLATIONS;
const transByKey = (k) => AFNAN_TRANSLATIONS.find(t => t.key === k) || AFNAN_TRANSLATIONS[0];

const _transCache = {};
async function fetchTranslation(resourceId, surahNum) {
  const ck = resourceId + ':' + surahNum;
  if (_transCache[ck]) return _transCache[ck];
  const res = await fetch(`https://api.quran.com/api/v4/quran/translations/${resourceId}?chapter_number=${surahNum}`);
  if (!res.ok) throw new Error('translation failed');
  const data = await res.json();
  const arr = (data.translations || []).map(t => String(t.text || '')
    .replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, '')   // أزِل الحواشي
    .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  _transCache[ck] = arr;
  return arr;
}

// ── بيانات التقسيم: الصفحة/الجزء/الحزب/الربع لكلّ آية ───────────────────
// المصدر: مصحف المدينة (رواية حفص) عبر quran.com — صفحةٌ واحدة لكامل السورة
const _metaCache = {};
async function fetchSurahMeta(num) {
  if (_metaCache[num]) return _metaCache[num];
  const res = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${num}?fields=page_number,juz_number,hizb_number,rub_el_hizb_number&per_page=300`);
  if (!res.ok) throw new Error('meta failed');
  const data = await res.json();
  const meta = data.verses.map(v => ({ page: v.page_number, juz: v.juz_number, hizb: v.hizb_number, rub: v.rub_el_hizb_number }));
  _metaCache[num] = meta;
  return meta;
}
// أسماء الأجزاء (١–٣٠) بصيغة العدد الترتيبي
const JUZ_NAMES = ['', 'الأوّل', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر',
  'الحادي عشر', 'الثاني عشر', 'الثالث عشر', 'الرابع عشر', 'الخامس عشر', 'السادس عشر', 'السابع عشر', 'الثامن عشر', 'التاسع عشر', 'العشرون',
  'الحادي والعشرون', 'الثاني والعشرون', 'الثالث والعشرون', 'الرابع والعشرون', 'الخامس والعشرون', 'السادس والعشرون', 'السابع والعشرون', 'الثامن والعشرون', 'التاسع والعشرون', 'الثلاثون'];
// مواضع الرُّبع داخل الحزب (٠ = بداية الحزب، تُعالَج مع الحزب)
const RUB_FRAC = ['', 'رُبع الحزب', 'نصف الحزب', 'ثلاثة أرباع الحزب'];
const arNum = (n) => window.tnum(n);

// أحجام الخط القابلة للضبط
const FONT_STEPS = [22, 26, 30, 34, 40, 46];

// ── فهرس المصحف ────────────────────────────────────────────────────────
function QuranIndex({ onOpen, onOpenKhatmat, onOpenSaved, savedCount, bookmark, onResume, qiraah }) {
  const [q, setQ] = React.useState('');
  const rawiShort = String(qiraah || 'حفص عن عاصم').split(' عن ')[0];
  const ql = q.trim().toLowerCase();
  const list = SURAH_INDEX.filter(s => !ql || s.name.includes(q) || window.surahName(s.n, s.name).toLowerCase().includes(ql) || String(s.n).includes(q));
  const bmName = bookmark && SURAH_INDEX[bookmark.surah - 1] ? window.surahName(bookmark.surah, SURAH_INDEX[bookmark.surah - 1].name) : '';
  return (
    <Screen pad={16}>
      <div style={{ margin: '6px 2px 14px' }}>
        <h1 style={{ margin: 0, fontFamily: T.fHead, fontSize: 30, fontWeight: 700, color: T.ink }}>{window.t('tab_quran')}</h1>
        <div style={{ marginTop: 4, fontFamily: T.fBody, fontSize: 14.5, color: T.inkMuted }}>{window.tf('q_mushaf_sub', { n: window.tnum(114), rawi: rawiShort })}</div>
      </div>

      {/* تابع القراءة — يظهر إن كانت هناك علامة محفوظة */}
      {bookmark && (
        <div onClick={onResume} className="afn-tap" style={{ display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer',
          borderRadius: 18, padding: '14px 16px', marginBottom: 12, color: '#fff',
          background: `linear-gradient(120deg,${T.green},${T.greenMid})`, boxShadow: `0 8px 22px ${T.green}33` }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: 'rgba(255,255,255,.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="assets/qurani/continuou.png" alt="" style={{ width: 28, height: 28, display: 'block' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: T.fBody, fontSize: 12, opacity: .85, fontWeight: 600 }}>{window.t('q_resume')}</div>
            <div style={{ fontFamily: T.fHead, fontSize: 17, fontWeight: 700 }}>{window.tf('q_resume_at', { name: bmName, n: window.tnum(bookmark.ayah) })}</div>
          </div>
          <Icon name="chevronL" size={20} color="#fff" />
        </div>
      )}

      {/* مدخل الختمات */}
      <div onClick={onOpenKhatmat} className="afn-tap" style={{ display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer',
        borderRadius: 18, padding: '14px 16px', marginBottom: 16, background: T.card, border: `1px solid ${T.line}`,
        boxShadow: '0 1px 2px rgba(38,53,45,.04), 0 6px 18px rgba(38,53,45,.05)' }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: 'linear-gradient(160deg,#EEF3F8,#E3EAF2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="assets/qurani/Al-khatmat.png" alt="" style={{ width: 34, height: 34, display: 'block' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.fHead, fontSize: 17, fontWeight: 700, color: T.ink }}>{window.t('q_khatmat')}</div>
          <div style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted, marginTop: 1 }}>{window.t('q_khatmat_sub')}</div>
        </div>
        <Icon name="chevronL" size={18} color={T.inkMuted} />
      </div>

      {/* المحفوظات — آيات حفظها المستخدم */}
      <div onClick={onOpenSaved} className="afn-tap" style={{ display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer',
        borderRadius: 18, padding: '14px 16px', marginBottom: 16, background: T.card, border: `1px solid ${T.line}`,
        boxShadow: '0 1px 2px rgba(38,53,45,.04), 0 6px 18px rgba(38,53,45,.05)' }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: 'linear-gradient(160deg,#E9F3EA,#DDEBDF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="assets/qurani/bookmark.png" alt="" style={{ width: 26, height: 26, display: 'block' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.fHead, fontSize: 17, fontWeight: 700, color: T.ink }}>محفوظاتي</div>
          <div style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted, marginTop: 1 }}>
            {savedCount ? `${window.tnum(savedCount)} آية محفوظة` : 'اضغط مطوّلاً على أي آية لحفظها'}
          </div>
        </div>
        <Icon name="chevronL" size={18} color={T.inkMuted} />
      </div>

      {/* بحث بعرض كامل */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.card, height: 48,
          border: `1px solid ${T.line}`, borderRadius: 15, padding: '0 15px', boxShadow: '0 1px 3px rgba(38,53,45,.04)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={T.inkMuted} strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke={T.inkMuted} strokeWidth="2" strokeLinecap="round"/></svg>
          <input value={q} onChange={e => setQ(e.target.value)} dir={window.afnDir()} placeholder={window.t('q_search')}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: T.fBody, fontSize: 15.5, color: T.ink, minWidth: 0 }} />
        </div>
      </div>
      <Card style={{ overflow: 'hidden' }}>
        {list.map((s, i) => {
          const offline = !!SURAHS[s.n];
          return (
            <div key={s.n} onClick={() => onOpen(s.n)} className="afn-tap" style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '13px 15px', cursor: 'pointer',
              borderBottom: i < list.length - 1 ? `1px solid ${T.line}` : 'none' }}>
              <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 40 40" style={{ position: 'absolute', inset: 0 }}>
                  <path d="M 15.79 9.84 C 13.39 4.88, 14.87 3.79, 20.00 1.20 C 25.13 3.79, 26.61 4.88, 24.21 9.84 C 26.01 4.63, 27.84 4.91, 33.29 6.71 C 35.09 12.16, 35.37 13.99, 30.16 15.79 C 35.12 13.39, 36.21 14.87, 38.80 20.00 C 36.21 25.13, 35.12 26.61, 30.16 24.21 C 35.37 26.01, 35.09 27.84, 33.29 33.29 C 27.84 35.09, 26.01 35.37, 24.21 30.16 C 26.61 35.12, 25.13 36.21, 20.00 38.80 C 14.87 36.21, 13.39 35.12, 15.79 30.16 C 13.99 35.37, 12.16 35.09, 6.71 33.29 C 4.91 27.84, 4.63 26.01, 9.84 24.21 C 4.88 26.61, 3.79 25.13, 1.20 20.00 C 3.79 14.87, 4.88 13.39, 9.84 15.79 C 4.63 13.99, 4.91 12.16, 6.71 6.71 C 12.16 4.91, 13.99 4.63, 15.79 9.84 Z"
                    fill={T.mint} stroke={T.mintEdge} strokeWidth="1" />
                </svg>
                <span style={{ position: 'relative', fontFamily: T.fHead, fontSize: 13, fontWeight: 700, color: T.green }}>{window.tnum(s.n)}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.fHead, fontSize: 18, fontWeight: 600, color: T.ink }}>{window.t('q_surah')} {window.surahName(s.n, s.name)}</div>
                <div style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted, marginTop: 1 }}>
                  {window.surahType(s.type)} · {window.tf('q_verses', { n: window.tnum(s.ayahs) })}
                </div>
              </div>
              <Icon name="chevronL" size={18} color={T.inkMuted} />
            </div>
          );
        })}
      </Card>
    </Screen>
  );
}

// ── قارئ السورة ────────────────────────────────────────────────────────
function Word({ seg, active, onTap, onPressStart, onPressMove, onPressEnd }) {
  return (
    <span onClick={onTap} onPointerDown={onPressStart} onPointerMove={onPressMove}
      onPointerUp={onPressEnd} onPointerLeave={onPressEnd}
      style={{ cursor: 'pointer', borderRadius: 8, padding: '0 1px',
      WebkitUserSelect: 'none', userSelect: 'none', WebkitTouchCallout: 'none',
      background: active ? 'rgba(201,162,75,.24)' : 'transparent',
      boxShadow: active ? `0 0 0 1px ${T.gold}66` : 'none', transition: 'background .15s' }}>
      {seg.map((s, i) => <span key={i} style={{ color: s.c }}>{s.t}</span>)}
    </span>
  );
}

// ayah-end marker — 8-point star (green square + ivory diamond) per the reference
function AyahMark({ n, size, active, onTap }) {
  const d = size * 1.5;
  const sq = active ? '#11533E' : '#3C7A55';      // green square
  const dia = active ? '#1E6F50' : '#FBF4DF';     // ivory/green diamond
  const ink = '#243A2E';                           // dark outline
  return (
    <span onClick={onTap} className="afn-tap" style={{ display: 'inline-flex', position: 'relative',
      width: d, height: d, margin: '0 4px', verticalAlign: 'middle', cursor: 'pointer',
      alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 40 40" width={d} height={d} style={{ position: 'absolute', inset: 0 }}>
        {/* straight square */}
        <rect x="8.5" y="8.5" width="23" height="23" fill={sq} stroke={ink} strokeWidth="1.6" />
        {/* rotated square (diamond) on top */}
        <path d="M20 2.5 L37.5 20 L20 37.5 L2.5 20 Z" fill={dia} stroke={ink} strokeWidth="1.6" strokeLinejoin="miter" />
      </svg>
      <span style={{ position: 'relative', fontFamily: T.fHead, fontSize: size * 0.4, fontWeight: 700,
        color: active ? '#fff' : '#1E6F50' }}>{window.tnum(n)}</span>
    </span>
  );
}

// ── فواصل التقسيم ─────────────────────────────────────────────────────
const MARK_WRAP = { display: 'inline-block', width: '100%', lineHeight: 1.2, textAlign: 'center', verticalAlign: 'middle', userSelect: 'none' };

// خطّ رفيع يفصل الصفحات — رقم الصفحة في وسط الخطّ، والجزء عند ابتدائه
function PageLine({ page, juz }) {
  return (
    <span style={{ ...MARK_WRAP, margin: '15px 0 9px' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <span style={{ flex: 1, height: 1, background: T.goldSoft }} />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: T.fBody, fontSize: 9.5, fontWeight: 600, color: T.inkMuted, letterSpacing: '.04em' }}>{window.t('q_page')}</span>
          <span style={{ fontFamily: T.fHead, fontSize: 13, fontWeight: 700, color: T.green }}>{arNum(page)}</span>
          {juz && <React.Fragment>
            <span style={{ width: 3, height: 3, borderRadius: 99, background: T.gold }} />
            <span style={{ fontFamily: T.fBody, fontSize: 10.5, fontWeight: 700, color: T.bark }}>{window.t('q_juz')} {window.AFN_LANG === 'ar' ? JUZ_NAMES[juz] : window.tnum(juz)}</span>
          </React.Fragment>}
        </span>
        <span style={{ flex: 1, height: 1, background: T.goldSoft }} />
      </span>
    </span>
  );
}

// علامة المِحراب — بجانب الآية عند حلول الربع/الحزب؛ قُرص الكسر يمتلئ ¼ → ½ → ¾ → كامل (دون النجمة الصغيرة)
function RubMark({ pos }) {
  const G = '#1E6F50', GOLD = '#C9A24B', cx = 50, cy = 54;
  const f = pos === 0 ? 1 : pos * 0.25;   // 0=الحزب(كامل) · ١..٣ = ربع/نصف/ثلاثة أرباع
  let pie = '';
  if (f < 1) {
    const a0 = -Math.PI / 2, a1 = -Math.PI / 2 + 2 * Math.PI * f, r = 7;
    const x0 = (cx + r * Math.cos(a0)).toFixed(2), y0 = (cy + r * Math.sin(a0)).toFixed(2);
    const x1 = (cx + r * Math.cos(a1)).toFixed(2), y1 = (cy + r * Math.sin(a1)).toFixed(2);
    pie = `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${f > 0.5 ? 1 : 0} 1 ${x1} ${y1} Z`;
  }
  return (
    <span style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 1px', userSelect: 'none', lineHeight: 1 }}>
      <svg width="26" height="47" viewBox="25 5 50 90" style={{ display: 'block' }}>
        {/* إطار المحراب (الشكل المُرفق) */}
        <path d="M50 9 C51.5 12.5 63 14.5 65 23 C66.8 28 64.5 29.5 63 31 L66 31 L66 33 L71 33.5 L71 75 C71 84 56 83.5 50 90.2 C44 83.5 29 84 29 75 L29 33.5 L34 33 L34 31 L37 31 C35.5 29.5 33.2 28 35 23 C37 14.5 48.5 12.5 50 9 Z"
          fill="#FFFDF6" stroke={G} strokeWidth="1.7" strokeLinejoin="round" />
        {/* زخرفة القبّة */}
        <circle cx="50" cy="24.5" r="1.5" fill={GOLD} />
        <path d="M46.5 30 Q50 27.5 53.5 30" fill="none" stroke={GOLD} strokeWidth="0.7" />
        {/* الحلقة + قرص الكسر الذهبيّ */}
        <circle cx={cx} cy={cy} r="8.4" fill="none" stroke={G} strokeWidth="0.9" />
        {f >= 1
          ? <circle cx={cx} cy={cy} r="7" fill={GOLD} />
          : <path d={pie} fill={GOLD} />}
        <circle cx={cx} cy={cy} r="7" fill="none" stroke={G} strokeWidth="0.7" />
        <circle cx={cx} cy={cy} r="1.6" fill={f >= 1 ? '#FFFDF6' : G} />
      </svg>
    </span>
  );
}

function SurahReader({ num, onBack, onNav, fontScale, jumpAyah, bookmark, onBookmark, saved, onToggleSaved, qiraah, translation }) {
  const meta = SURAH_INDEX[num - 1];
  const bundled = SURAHS[num];
  const [ayahs, setAyahs] = React.useState(bundled ? bundled.ayahs : null);
  const [loading, setLoading] = React.useState(!bundled);
  const [error, setError] = React.useState(false);
  const [sel, setSel] = React.useState(null);            // tapped word {a,w}
  const [divs, setDivs] = React.useState(null);          // تقسيم كل آية: {page,juz,hizb,rub} (صفحة/جزء/حزب/ربع)
  const [tafsir, setTafsir] = React.useState(null);      // {ayah, text|null, loading, error}
  const [wordCtx, setWordCtx] = React.useState(null);    // contextual meaning for tapped word
  const [showColors, setShowColors] = React.useState(false); // ورقة ألوان التجويد
  const showTajweed = true;                              // always on (toggle → settings later)
  const fontSize = Math.round(28 * (fontScale || 1));
  // الرواية المختارة (إن توفّر نصّها) وخطّها الرسمي
  const narrationKey = isHafsQiraah(qiraah) ? null : resolveNarration(qiraah);
  const narrationFont = narrationKey && KFGQPC[narrationKey] ? KFGQPC[narrationKey].font : null;
  const selIsHafs = isHafsQiraah(qiraah) || normAr(qiraah).indexOf(normAr('حفص')) >= 0;
  const qiraahUnavailable = !selIsHafs && !narrationKey;   // قراءةٌ نصّها غير متوفّر بعد
  React.useEffect(() => { if (narrationKey) ensureNarrationFont(narrationKey); }, [narrationKey]);

  // مرجع المقارنة: نصّ حفص من نفس مصدر المجمع (يضمن تطابق عدّ الآيات مع الرواية)
  const [hafsRef, setHafsRef] = React.useState(null);
  React.useEffect(() => {
    if (!narrationKey) { setHafsRef(null); return; }
    let alive = true;
    loadNarration('hafs').then(all => { if (alive) setHafsRef(all[num] || null); }).catch(() => { if (alive) setHafsRef(null); });
    return () => { alive = false; };
  }, [narrationKey, num]);

  React.useEffect(() => {
    setSel(null); setTafsir(null);
    let alive = true;
    // رواية متوفّرة (غير حفص) → حمّل نصّها الرسمي من بيانات المجمع
    if (narrationKey) {
      const all = _narrationCache[narrationKey];
      if (all && all[num]) { setAyahs(all[num]); setLoading(false); setError(false); return; }
      setLoading(true); setError(false); setAyahs(null);
      fetchSurahQiraah(num, qiraah)
        .then(a => { if (alive) { setAyahs(a); setLoading(false); } })
        .catch(() => {   // تعذّر جلب الرواية → ارجع إلى نصّ حفص بدل صفحةٍ فارغة
          if (!alive) return;
          const fb = bundled ? bundled.ayahs : (_allText[num] || _remoteCache[num]);
          if (fb) { setAyahs(fb); setLoading(false); return; }
          fetchSurah(num).then(a => { if (alive) { setAyahs(a); setLoading(false); } })
            .catch(() => { if (alive) { setError(true); setLoading(false); } });
        });
      return () => { alive = false; };
    }
    // حفص (الافتراضي) — المسار السريع
    if (bundled) { setAyahs(bundled.ayahs); setLoading(false); setError(false); return; }
    if (_allText[num]) { setAyahs(_allText[num]); setLoading(false); setError(false); return; }
    if (_remoteCache[num]) { setAyahs(_remoteCache[num]); setLoading(false); setError(false); return; }
    setLoading(true); setError(false); setAyahs(null);
    // fast path: fetch just this surah (small); whole-mushaf prefetch keeps running
    fetchSurah(num).then(a => { if (alive) { setAyahs(a); setLoading(false); } })
      .catch(() => ensureAllQuran().then(all => { if (alive) { setAyahs(all[num]); setLoading(false); } })
        .catch(() => { if (alive) { setError(true); setLoading(false); } }));
    return () => { alive = false; };
  }, [num, qiraah]);

  const colored = React.useMemo(() => {
    if (!ayahs) return null;
    if (narrationKey) {
      const { flags, hmap } = buildDiffFlags(ayahs, hafsRef);   // مقارنة على مستوى السورة + محاذاة حفص
      if (narrationKey === 'warsh')   // ورش: تلوين أحكامها الخاصّة + إبراز المخالف لحفص
        return ayahs.map((a, i) => colorizeWarsh(a, flags[i]));
      if (NARRATION_RULES[narrationKey])   // بقيّة الروايات: أحكامها المثبتة + المخالف لحفص
        return ayahs.map((a, i) => colorizeNarration(narrationKey, a, flags[i], hmap[i]));
      return ayahs.map((a, i) => colorizeDiff(a, flags[i]));
    }
    return ayahs.map(a => colorizeAyah(a));
  }, [ayahs, narrationKey, num, hafsRef]);
  const selWord = sel && ayahs ? ayahs[sel.a][sel.w] : null;

  // تجميع الآيات في صفحات — لتتوسّط آخر سطر من كلّ صفحة بدل المدّ القبيح
  const pages = React.useMemo(() => {
    if (!ayahs) return null;
    if (!divs) return [{ page: null, juz: null, newJuz: false, items: ayahs.map((_, i) => i) }];
    const groups = [];
    let cur = null;
    ayahs.forEach((_, ai) => {
      const d = divs[ai] || {};
      if (!cur || d.page !== cur.page) {
        const prevJuz = cur ? cur.juz : null;
        cur = { page: d.page, juz: d.juz, newJuz: prevJuz != null && d.juz !== prevJuz, items: [] };
        groups.push(cur);
      }
      cur.items.push(ai);
    });
    return groups;
  }, [ayahs, divs]);

  // جلب بيانات التقسيم (صفحة/جزء/حزب/ربع) للسورة
  React.useEffect(() => {
    setDivs(null);
    let alive = true;
    if (_metaCache[num]) { setDivs(_metaCache[num]); return; }
    fetchSurahMeta(num).then(m => { if (alive) setDivs(m); }).catch(() => {});
    return () => { alive = false; };
  }, [num]);

  const scrollRef = React.useRef(null);
  const rootRef = React.useRef(null);
  const [bmToast, setBmToast] = React.useState(null);      // إشعار مؤقّت
  const toastTid = React.useRef(0);
  const showToast = (msg) => { setBmToast(msg); clearTimeout(toastTid.current); toastTid.current = setTimeout(() => setBmToast(null), 1900); };

  // الآيات المحفوظة في هذه السورة
  const savedHere = React.useMemo(() => {
    const set = new Set();
    (saved || []).forEach(b => { if (b.surah === num) set.add(b.ayah); });
    return set;
  }, [saved, num]);
  const isSaved = (ay) => savedHere.has(ay);

  // ── تتبّع ذكيّ لموضع القراءة: ReadingScore = الظهور×0.4 + القرب من المركز×0.4 + زمن البقاء×0.2 ──
  const timeRef = React.useRef({});       // ayah → ثوانٍ ظلّت قُرب المركز
  const bestRef = React.useRef(null);     // {surah, ayah} الأعلى درجةً
  const ayahEls = React.useRef({});       // ayah → عنصر الـ DOM
  const commitTid = React.useRef(0);
  React.useEffect(() => { timeRef.current = {}; bestRef.current = null; ayahEls.current = {}; }, [num]);

  const scoreAyahs = () => {
    const el = scrollRef.current; if (!el) return null;
    const cr = el.getBoundingClientRect();
    const center = cr.top + cr.height / 2;
    const times = timeRef.current;
    let maxT = 1; for (const k in times) if (times[k] > maxT) maxT = times[k];
    let best = null, bestScore = -1;
    el.querySelectorAll('[data-ayah]').forEach(s => {
      const r = s.getBoundingClientRect();
      const visH = Math.max(0, Math.min(r.bottom, cr.bottom) - Math.max(r.top, cr.top));
      if (visH <= 0) return;
      const ay = parseInt(s.getAttribute('data-ayah'), 10);
      const visibility = Math.min(1, visH / Math.min(r.height || 1, cr.height));
      const ayCenter = r.top + r.height / 2;
      const centerProximity = Math.max(0, 1 - Math.abs(ayCenter - center) / (cr.height / 2));
      const timeOnScreen = (times[ay] || 0) / maxT;
      const score = visibility * 0.4 + centerProximity * 0.4 + timeOnScreen * 0.2;
      if (score > bestScore) { bestScore = score; best = ay; }
    });
    return best;
  };

  // تراكم زمن بقاء كل آيةٍ قُرب المركز + تحديث الأعلى درجةً
  React.useEffect(() => {
    if (!colored) return;
    const id = setInterval(() => {
      const el = scrollRef.current; if (!el) return;
      const cr = el.getBoundingClientRect();
      const mid = cr.top + cr.height / 2, band = cr.height * 0.34;
      el.querySelectorAll('[data-ayah]').forEach(s => {
        const r = s.getBoundingClientRect();
        if (r.top <= mid + band && r.bottom >= mid - band) {
          const ay = parseInt(s.getAttribute('data-ayah'), 10);
          timeRef.current[ay] = (timeRef.current[ay] || 0) + 0.5;
        }
      });
      const b = scoreAyahs(); if (b) bestRef.current = { surah: num, ayah: b };
    }, 500);
    return () => clearInterval(id);
  }, [colored, num]);

  // حفظٌ تلقائيّ لآخر موضع: عند سكون التمرير وعند مغادرة السورة
  const commitPos = React.useRef(() => {});
  commitPos.current = () => {
    const b = bestRef.current; if (!b) return;
    if (bookmark && bookmark.surah === b.surah && bookmark.ayah === b.ayah) return;
    onBookmark && onBookmark({ surah: b.surah, ayah: b.ayah, savedAt: Date.now(), auto: true });
  };
  const onContentScroll = () => {
    const b = scoreAyahs(); if (b) bestRef.current = { surah: num, ayah: b };
    setAction(a => (a ? null : a));
    clearTimeout(commitTid.current);
    commitTid.current = setTimeout(() => commitPos.current(), 900);
  };
  React.useEffect(() => () => commitPos.current(), [num]);   // احفظ عند مغادرة/تبديل السورة

  // شارات الهامش للآيات المحفوظة — تُقاس مواضعها بعد التخطيط
  const [marginMarks, setMarginMarks] = React.useState([]);
  React.useLayoutEffect(() => {
    if (!savedHere.size) { setMarginMarks(m => (m.length ? [] : m)); return; }
    const marks = [];
    savedHere.forEach(ay => {
      const node = ayahEls.current[ay];
      if (!node || !node.offsetParent) return;
      marks.push({ ay, top: node.offsetTop + 4, pi: Number(node.offsetParent.getAttribute('data-page')) });
    });
    setMarginMarks(prev => {
      const same = prev.length === marks.length && prev.every((x, i) => x.ay === marks[i].ay && x.pi === marks[i].pi && Math.abs(x.top - marks[i].top) < 1);
      return same ? prev : marks;
    });
  }, [savedHere, fontSize, colored, divs, num, bmToast]);

  // ── الشارة المؤقّتة: ضغطٌ مطوّل على آية ──
  const [action, setAction] = React.useState(null);   // {ayah, x, y}
  const actionTid = React.useRef(0);
  const lp = React.useRef({ tid: 0, x: 0, y: 0, fired: false });
  const startLP = (ay, e) => {
    const px = e.clientX, py = e.clientY;
    clearTimeout(lp.current.tid);
    lp.current = { x: px, y: py, fired: false, tid: setTimeout(() => {
      lp.current.fired = true;
      const host = rootRef.current ? rootRef.current.getBoundingClientRect() : { left: 0, top: 0 };
      setAction({ ayah: ay, x: px - host.left, y: py - host.top });
      try { navigator.vibrate && navigator.vibrate(9); } catch (er) {}
      clearTimeout(actionTid.current); actionTid.current = setTimeout(() => setAction(null), 3600);
    }, 430) };
  };
  const moveLP = (e) => { if (Math.abs(e.clientX - lp.current.x) > 11 || Math.abs(e.clientY - lp.current.y) > 11) clearTimeout(lp.current.tid); };
  const endLP = () => clearTimeout(lp.current.tid);
  const toggleSavedAyah = (ay) => {
    const was = isSaved(ay);
    onToggleSaved && onToggleSaved(num, ay, ayahs && ayahs[ay - 1] ? ayahs[ay - 1].map(w => w.t).join(' ') : '');
    showToast(was ? 'أُزيلت الآية من المحفوظات' : 'حُفِظت الآية في المحفوظات');
    clearTimeout(actionTid.current); actionTid.current = setTimeout(() => setAction(null), 1100);
  };

  // إبراز الآية لحظة العودة إليها
  const [flash, setFlash] = React.useState(null);
  const flashTid = React.useRef(0);
  // التنقّل بالسحب بين السور (سحب لليسار = السورة التالية، لليمين = السابقة)
  const swipe = React.useRef(null);
  const onSwipeStart = (x, y) => { swipe.current = { x, y, t: Date.now() }; };
  const onSwipeEnd = (x, y) => {
    const s = swipe.current; swipe.current = null; if (!s) return;
    const dx = x - s.x, dy = y - s.y;
    const horiz = Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6 && Date.now() - s.t < 800;
    if (!horiz) return;
    if (!onNav) return;
    if (dx < 0 && num < 114) onNav(num + 1);
    else if (dx > 0 && num > 1) onNav(num - 1);
  };
  // عند الدخول من علامةٍ أو من جزءٍ بختمة، انتقل إلى الآية المطلوبة
  React.useEffect(() => {
    if (!jumpAyah || !colored) return;
    const el = scrollRef.current; if (!el) return;
    let tries = 0, tid = 0;
    const go = () => {
      const t = el.querySelector('[data-ayah="' + jumpAyah + '"]');
      if (t) { const cr = el.getBoundingClientRect(), tr = t.getBoundingClientRect(); el.scrollTop += (tr.top - cr.top) - 96;
        setFlash(jumpAyah); clearTimeout(flashTid.current); flashTid.current = setTimeout(() => setFlash(null), 1700); }
      else if (tries++ < 25) tid = setTimeout(go, 90);
    };
    tid = setTimeout(go, 80);
    return () => clearTimeout(tid);
  }, [jumpAyah, colored]);
  // ابدأ السورة الجديدة من أعلاها عند التنقّل بالسحب (ما لم يُطلب الانتقال لآية)
  React.useEffect(() => { const el = scrollRef.current; if (el && !jumpAyah) el.scrollTop = 0; }, [num]);
  // open tafsir for a verse (1-based)
  const openTafsir = (ayahNum) => {
    setSel(null);
    const tr = transByKey(translation);
    setTafsir({ ayah: ayahNum, text: null, loading: true, error: false,
      trans: tr.id ? { loading: true, text: null, error: false } : null });
    fetchTafsir(num, ayahNum)
      .then(text => setTafsir(t => (t && t.ayah === ayahNum ? { ...t, text, loading: false } : t)))
      .catch(() => setTafsir(t => (t && t.ayah === ayahNum ? { ...t, loading: false, error: true } : t)));
    if (tr.id) {
      fetchTranslation(tr.id, num)
        .then(arr => setTafsir(t => (t && t.ayah === ayahNum ? { ...t, trans: { ...t.trans, text: arr[ayahNum - 1] || '', loading: false } } : t)))
        .catch(() => setTafsir(t => (t && t.ayah === ayahNum ? { ...t, trans: { ...t.trans, loading: false, error: true } } : t)));
    }
  };
  // الضغط على أي كلمة يفتح تفسير الآية كاملةً (إلا إذا كان ضغطًا مطوّلاً)
  const tapWord = (ai, wi) => { if (lp.current.fired) { lp.current.fired = false; return; } openTafsir(ai + 1); };

  return (
    <div ref={rootRef} onPointerDown={e => onSwipeStart(e.clientX, e.clientY)} onPointerUp={e => onSwipeEnd(e.clientX, e.clientY)} onPointerCancel={() => { swipe.current = null; }}
      style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#FCFAF3' }}>
      <div style={{ flexShrink: 0, paddingTop: 52, paddingBottom: 20, background: 'linear-gradient(180deg,#16614A,#11533E)',
        color: '#fff', textAlign: 'center', position: 'relative' }}>
        <div onClick={onBack} className="afn-tap" style={{ position: 'absolute', top: 52, right: 14, width: 42, height: 42,
          borderRadius: '50%', background: 'rgba(255,255,255,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="chevronL" size={22} color="#fff" />
        </div>
        <div style={{ fontFamily: T.fDisplay, fontSize: 36, fontWeight: 700, lineHeight: 1.3 }}>{window.t('q_surah')} {window.surahName(num, meta.name)}</div>
      </div>

      <div ref={scrollRef} onScroll={onContentScroll} className="afn-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 0 170px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ display: 'inline-flex', gap: 7 }}>
              {[0,1,2].map(i => <span key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: T.green2,
                animation: `afn-pulse 1s ease-in-out ${i*0.2}s infinite` }} />)}
            </div>
            <div style={{ fontFamily: T.fBody, fontSize: 14.5, color: T.inkMuted, marginTop: 18 }}>{window.t('q_load_surah')}</div>
          </div>
        )}
        {error && (
          <div style={{ textAlign: 'center', padding: '70px 24px' }}>
            <Icon name="book" size={40} color={T.mintEdge} />
            <div style={{ fontFamily: T.fHead, fontSize: 17, fontWeight: 600, color: T.ink, marginTop: 14 }}>{window.t('q_err_surah')}</div>
            <div style={{ fontFamily: T.fBody, fontSize: 13.5, color: T.inkMuted, marginTop: 6 }}>{window.t('q_err_check')}</div>
            <button onClick={() => { setError(false); setLoading(true); ensureAllQuran().then(all=>{setAyahs(all[num]);setLoading(false);}).catch(()=>{setError(true);setLoading(false);}); }}
              className="afn-tap" style={{ marginTop: 18, border: 'none', cursor: 'pointer', padding: '11px 24px', borderRadius: 14,
              fontFamily: T.fHead, fontSize: 15, fontWeight: 700, background: T.green, color: '#fff' }}>{window.t('btn_retry')}</button>
          </div>
        )}

        {!loading && !error && colored && (
          <>
            {/* surah info band: type · count */}
            <div style={{ textAlign: 'center', padding: '16px 20px 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: T.fBody, fontSize: 13.5,
                color: T.inkSoft, fontWeight: 600 }}>
                <span>{window.surahType(meta.type)}</span>
                <span style={{ width: 4, height: 4, borderRadius: 99, background: T.gold }} />
                <span>{window.tf('q_verses', { n: window.tnum(meta.ayahs) })}</span>
              </div>
            </div>
            {/* color legend — اضغط لعرض كل التفاصيل */}
            <div onClick={() => setShowColors(true)} className="afn-tap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 13, flexWrap: 'wrap', cursor: 'pointer',
              padding: '12px 16px 14px', margin: '12px 16px 0', borderBottom: `1px solid ${T.line}` }}>
              {(narrationKey === 'warsh' ? WARSH_LEGEND : NARRATION_LEGENDS[narrationKey] ? NARRATION_LEGENDS[narrationKey] : narrationKey ? [{ c: TJ.diff, label: 'المخالف لرواية حفص' }] : TAJWEED_LEGEND).map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.c }} />
                  <span style={{ fontFamily: T.fBody, fontSize: 11.5, color: T.inkSoft }}>{l.label}</span>
                </div>
              ))}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: T.fBody, fontSize: 11, fontWeight: 700, color: T.green }}>
                <Icon name="book" size={12} color={T.green} /> تفاصيل الألوان
              </span>
            </div>

            {/* تنبيه: القراءة المختارة غير متوفّر نصّها بعد → تُعرض برواية حفص */}
            {qiraahUnavailable && (
              <div style={{ margin: '14px 16px 0', padding: '11px 14px', borderRadius: 14, background: '#FBF3DD',
                border: '1px solid #EEDFB6', display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <Icon name="book" size={16} color="#B58A2E" />
                <div style={{ fontFamily: T.fBody, fontSize: 12, color: '#7A5E1F', lineHeight: 1.7 }}>
                  نصّ <b>{qiraah}</b> غير متوفّر ضمن مصادرنا بعد، ويُعرَض هنا نصّ <b>حفص عن عاصم</b>.
                  الروايات المتوفّرة بنصّها الكامل: حفص، ورش، قالون، شعبة، الدوري، السوسي، البزّي، قُنبُل.
                </div>
              </div>
            )}

            {/* basmala — calligraphic image */}
            {num !== 1 && num !== 9 && (
              <div style={{ textAlign: 'center', padding: '20px 36px 0' }}>
                <img src="assets/zakharif/basmala.png" alt="بسم الله الرحمن الرحيم" style={{ width: '78%', maxWidth: 300,
                  height: 'auto', display: 'block', margin: '0 auto', opacity: 0.92 }} />
              </div>
            )}

            {/* mushaf text — مصفوف حسب الصفحات؛ آخر سطر من كل صفحة يتوسّط */}
            <div style={{ padding: '4px 20px 24px' }}>
              {pages.map((pg, pi) => (
                <React.Fragment key={pi}>
                  <PageLine page={pg.page} juz={pg.juz} />
                  <p data-page={pi} dir="rtl" style={{ position: 'relative', margin: 0, fontFamily: narrationFont ? `"${narrationFont}", ${T.fQuran}` : T.fQuran, fontSize: fontSize, lineHeight: 2.5,
                    textAlign: 'justify', textAlignLast: 'center', color: TJ.base, transition: 'font-size .2s ease' }}>
                    {/* شارات الآيات المحفوظة — أيقونة صغيرة شبه شفافة في هامش الصفحة، لا تلامس النصّ */}
                    {marginMarks.filter(m => m.pi === pi).map(m => (
                      <span key={m.ay} aria-label="آية محفوظة" style={{ position: 'absolute', insetInlineStart: -17,
                        top: m.top, width: 13, height: 17, pointerEvents: 'none', opacity: 0.5 }}>
                        <svg width="13" height="17" viewBox="0 0 13 17" fill="none">
                          <path d="M1.6 1.3h9.8v13.8l-4.9-3.2-4.9 3.2V1.3Z" fill={T.gold} fillOpacity="0.45" stroke={T.gold} strokeWidth="1.2" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    ))}
                    {pg.items.map(ai => {
                      const ayah = ayahs[ai];
                      const tafsirActive = tafsir && tafsir.ayah === ai + 1;
                      const flashed = flash === ai + 1;
                      // إن كانت الآية التالية تبدأ رُبعاً/حزباً جديداً، ألصِق العلامة بعلامة رقم هذه الآية مباشرةً
                      const nextRub = divs && divs[ai] && divs[ai + 1] && divs[ai + 1].rub !== divs[ai].rub
                        ? (divs[ai + 1].rub - 1) % 4 : null;
                      return (
                        <span key={ai} data-ayah={ai + 1} ref={el => { if (el) ayahEls.current[ai + 1] = el; }}
                          style={{ background: flashed ? 'rgba(201,162,75,.26)' : tafsirActive ? 'rgba(30,111,80,.10)' : 'transparent',
                            borderRadius: 6, boxShadow: flashed ? '0 0 0 2px rgba(201,162,75,.4)' : 'none',
                            transition: 'background .5s ease, box-shadow .5s ease', WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone' }}>
                          {ayah.map((wd, wi) => {
                            const seg = colored[ai][wi];
                            const active = sel && sel.a === ai && sel.w === wi;
                            return (
                              <React.Fragment key={wi}>
                                <Word seg={seg} active={active} onTap={() => tapWord(ai, wi)}
                                  onPressStart={(e) => startLP(ai + 1, e)} onPressMove={moveLP} onPressEnd={endLP} />
                                {' '}
                              </React.Fragment>
                            );
                          })}
                          <span style={{ whiteSpace: 'nowrap' }}>
                            <AyahMark n={ai + 1} size={fontSize} active={tafsirActive || isSaved(ai + 1)} onTap={() => openTafsir(ai + 1)} />
                            {nextRub !== null && <RubMark pos={nextRub} />}
                          </span>
                          {' '}
                        </span>
                      );
                    })}
                  </p>
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>

      {/* الشارة المؤقّتة — تظهر بالضغط المطوّل على آية ثمّ تختفي تلقائيّاً (مع تثبيتها داخل حدود الشاشة) */}
      {action && (() => {
        const W = rootRef.current ? rootRef.current.clientWidth : 380;
        const half = 100;                                   // نصف عرض الشارة التقريبيّ
        const cx = Math.min(W - half - 8, Math.max(half + 8, action.x));
        const top = (action.y - 56 < 96) ? action.y + 30 : action.y - 56;   // اعرضها أسفل الإصبع قُرب الأعلى
        return (
        <div onClick={() => setAction(null)} style={{ position: 'absolute', left: cx, top, zIndex: 46,
          transform: 'translateX(-50%)', animation: 'afn-fade .16s ease both' }}>
          <button onClick={(e) => { e.stopPropagation(); toggleSavedAyah(action.ayah); }} className="afn-tap"
            style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', cursor: 'pointer',
              background: isSaved(action.ayah) ? T.green : 'rgba(17,83,62,.96)', color: '#fff',
              padding: '9px 15px', borderRadius: 999, boxShadow: '0 8px 22px rgba(17,83,62,.34)',
              fontFamily: T.fHead, fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill={isSaved(action.ayah) ? '#fff' : 'none'}>
              <path d="M7 4h10v15l-5-3.2L7 19V4Z" stroke="#fff" strokeWidth="1.9" strokeLinejoin="round"/></svg>
            {isSaved(action.ayah) ? 'إزالة من المحفوظات' : 'احفظ الآية'}
            <span style={{ fontFamily: T.fBody, fontSize: 11.5, opacity: .82, fontWeight: 600 }}>· آية {window.tnum(action.ayah)}</span>
          </button>
        </div>
        );
      })()}

      {bmToast && (
        <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', zIndex: 30,
          background: 'rgba(17,83,62,.95)', color: '#fff', padding: '11px 20px', borderRadius: 999, whiteSpace: 'nowrap',
          fontFamily: T.fBody, fontSize: 13.5, fontWeight: 600, boxShadow: '0 8px 24px rgba(17,83,62,.34)',
          display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M7 4h10v15l-5-3.2L7 19V4Z"/></svg>
          {bmToast}
        </div>
      )}

      {showColors && <TajweedColorsGuide narration={narrationKey} onClose={() => setShowColors(false)} />}

      {/* tafsir sheet */}
      {tafsir && (
        <>
          <div onClick={() => setTafsir(null)} style={{ position: 'absolute', inset: 0, zIndex: 35, background: 'rgba(20,40,32,.28)',
            animation: 'afn-fade .2s ease both' }} />
          <div className="afn-rise" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40,
            background: '#fff', borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: '20px 20px 30px',
            boxShadow: '0 -10px 40px rgba(38,53,45,.22)', maxHeight: '72%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 42, height: 5, borderRadius: 99, background: T.mintEdge, margin: '0 auto 16px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: T.mint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="book" size={23} color={T.green} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.fHead, fontSize: 18, fontWeight: 700, color: T.ink }}>{window.tf('q_tafsir_for', { n: window.tnum(tafsir.ayah) })}</div>
                <div style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.gold, fontWeight: 600 }}>{window.t('q_tafsir_name')}</div>
              </div>
              <div onClick={() => setTafsir(null)} className="afn-tap" style={{ width: 32, height: 32, borderRadius: '50%',
                background: T.bgSink, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Icon name="close" size={17} color={T.inkSoft} stroke={2.2} />
              </div>
            </div>
            {/* the verse itself */}
            {ayahs && ayahs[tafsir.ayah - 1] && (
              <div style={{ background: 'linear-gradient(160deg,#F3F8EF,#fff)', borderRadius: 16, padding: '14px 16px',
                marginBottom: 14, border: `1px solid ${T.line}` }}>
                <p dir="rtl" style={{ margin: 0, fontFamily: T.fScript, fontSize: 22, lineHeight: 2, color: T.green, textAlign: 'center', fontWeight: 700 }}>
                  ﴿ {ayahs[tafsir.ayah - 1].map(x => x.t).join(' ')} ﴾
                </p>
              </div>
            )}
            <div className="afn-scroll" style={{ overflowY: 'auto', flex: 1 }}>
              {/* الترجمة المختارة — تُجلب من Quran.com API */}
              {tafsir.trans && (() => {
                const tr = transByKey(translation);
                return (
                  <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${T.line}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                      <span style={{ width: 26, height: 26, borderRadius: 8, background: '#E2EAF4', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="globe" size={15} color="#5C7CA6" />
                      </span>
                      <span style={{ fontFamily: T.fHead, fontSize: 14, fontWeight: 700, color: T.ink }}>{tr.native}</span>
                      <span style={{ fontFamily: T.fBody, fontSize: 11, color: T.inkMuted, overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tr.by}</span>
                    </div>
                    {tafsir.trans.loading && (
                      <div style={{ display: 'inline-flex', gap: 6, padding: '4px 2px' }}>
                        {[0,1,2].map(i => <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#5C7CA6',
                          animation: `afn-pulse 1s ease-in-out ${i*0.2}s infinite` }} />)}
                      </div>
                    )}
                    {tafsir.trans.error && (
                      <div style={{ fontFamily: T.fBody, fontSize: 13, color: T.inkMuted }}>{window.t('q_err_trans')}</div>
                    )}
                    {tafsir.trans.text && (
                      <p dir={tr.dir} lang={tr.key} style={{ margin: 0,
                        fontFamily: tr.dir === 'rtl' ? T.fBody : "'Georgia','Times New Roman',serif",
                        fontSize: 16, lineHeight: 1.85, color: T.inkSoft, textWrap: 'pretty',
                        textAlign: tr.dir === 'rtl' ? 'right' : 'left' }}>{tafsir.trans.text}</p>
                    )}
                  </div>
                );
              })()}
              {tafsir.loading && (
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <div style={{ display: 'inline-flex', gap: 6 }}>
                    {[0,1,2].map(i => <span key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: T.green2,
                      animation: `afn-pulse 1s ease-in-out ${i*0.2}s infinite` }} />)}
                  </div>
                  <div style={{ fontFamily: T.fBody, fontSize: 13.5, color: T.inkMuted, marginTop: 14 }}>{window.t('q_load_tafsir')}</div>
                </div>
              )}
              {tafsir.error && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontFamily: T.fBody, fontSize: 14, color: T.inkMuted }}>{window.t('q_err_tafsir')}</div>
                  <button onClick={() => openTafsir(tafsir.ayah)} className="afn-tap" style={{ marginTop: 14, border: 'none',
                    cursor: 'pointer', padding: '10px 22px', borderRadius: 13, fontFamily: T.fHead, fontSize: 14.5, fontWeight: 700,
                    background: T.green, color: '#fff' }}>{window.t('btn_retry')}</button>
                </div>
              )}
              {tafsir.text && (
                <p style={{ margin: 0, fontFamily: T.fBody, fontSize: 16.5, lineHeight: 2, color: T.inkSoft, textWrap: 'pretty' }}>{tafsir.text}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// دليل المصحف — يظهر أوّل مرّة ومن الإعدادات > تعليمات
function GuideRow({ tint, svg, title, children }) {
  return (
    <div style={{ display: 'flex', gap: 13, marginBottom: 18 }}>
      <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: tint + '1A',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{svg}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.fHead, fontSize: 16.5, fontWeight: 700, color: T.ink, marginBottom: 5 }}>{title}</div>
        <div style={{ fontFamily: T.fBody, fontSize: 13.5, lineHeight: 1.85, color: T.inkSoft, textWrap: 'pretty' }}>{children}</div>
      </div>
    </div>
  );
}
// ── ورقة ألوان التجويد (الشرح المفصّل) ─────────────────────────────────
function TJSwatch({ c }) {
  return <span style={{ width: 16, height: 16, borderRadius: 5, background: c, flexShrink: 0, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.08)' }} />;
}
function TJFamily({ title, dot, note, items }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: dot, flexShrink: 0 }} />
        <span style={{ fontFamily: T.fHead, fontSize: 16.5, fontWeight: 700, color: T.ink }}>{title}</span>
      </div>
      <div style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted, marginBottom: 10, lineHeight: 1.6 }}>{note}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {items.map((it, k) => (
          <div key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ marginTop: 2 }}><TJSwatch c={it.c} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontFamily: T.fHead, fontSize: 14, fontWeight: 600, color: T.ink }}>{it.t}</span>
              {it.d && <span style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted }}>{' — ' + it.d}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function TajweedColorsGuide({ onClose, narration }) {
  const G = (s) => (window.tc(s) || s);
  const fams = [
    { title: G('المدود'), dot: '#C0392B', note: G('كلّ المدود بالأحمر، وتتدرّج بحسب نوعها:'), items: [
      { c: TJ.maddLazim, t: G('المدّ اللازم'), d: G('يُمدّ ٦ حركات (أحمر غامق)') },
      { c: TJ.maddWajib, t: G('الواجب المتّصل'), d: G('يُمدّ ٤–٥ حركات (برتقالي)') },
      { c: TJ.maddJaiz, t: G('الجائز المنفصل والعارض للسكون'), d: G('بنفسجي (موفي)') },
      { c: TJ.maddSila, t: G('مدّ الصلة الصغرى'), d: G('هاء الضمير الموصولة (وردي)') },
    ]},
    { title: G('الغُنّة'), dot: TJ.ghunnah, note: G('كلّ أحكام الغُنّة بالأخضر:'), items: [
      { c: TJ.ghunnah, t: G('النون والميم المشدّدتان') },
      { c: TJ.ghunnah, t: G('الإخفاء والإدغام بغُنّة') },
      { c: TJ.ghunnah, t: G('الإخفاء الشفوي والإقلاب') },
    ]},
    { title: G('القلقلة'), dot: TJ.qalqalah, note: G('القلقلة والتفخيم بالأزرق وتدرّجاته:'), items: [
      { c: TJ.qalqalah, t: G('القلقلة'), d: G('حروف (قطب جد) الساكنة — أزرق غامق') },
      { c: TJ.tafkheem, t: G('الراء المفخّمة ولفظ الجلالة'), d: G('أزرق سماوي') },
    ]},
    { title: G('حروف لا تُنطق'), dot: TJ.silent, note: G('بالرمادي الخافت ليتجاوزها القارئ:'), items: [
      { c: TJ.silent, t: G('اللام الشمسية'), d: G('مثل لام «الشَّمس»') },
      { c: TJ.silent, t: G('همزة الوصل في الدرج') },
      { c: TJ.silent, t: G('الإدغام بلا غُنّة'), d: G('حيث تسقط النون/التنوين في (ل، ر)') },
    ]},
  ];
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 130, display: 'flex', alignItems: 'flex-end',
      background: 'rgba(20,38,30,.42)', animation: 'afn-fade .2s ease both' }}>
      <div onClick={e => e.stopPropagation()} className="afn-scroll" style={{ width: '100%', maxHeight: '92%', overflowY: 'auto',
        background: T.bg, borderRadius: '26px 26px 0 0', padding: '20px 20px 26px', direction: window.afnDir(),
        animation: 'afn-rise .28s cubic-bezier(.22,1,.36,1) both' }}>
        <div style={{ width: 42, height: 5, borderRadius: 99, background: T.mintEdge, margin: '0 auto 14px' }} />
        <h2 style={{ margin: '0 0 4px', textAlign: 'center', fontFamily: T.fHead, fontSize: 22, fontWeight: 700, color: T.ink }}>{G('ألوان التجويد')}</h2>
        <p style={{ margin: '0 0 18px', textAlign: 'center', fontFamily: T.fBody, fontSize: 13, color: T.inkMuted, lineHeight: 1.7 }}>
          {G('المفتاح في صفحة السورة مبسّط بأربع عائلات، وهنا تفصيلها كما تظهر على الحروف')}
        </p>
        {fams.map((f, i) => <TJFamily key={i} {...f} />)}

        {narration === 'warsh' && (
          <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 16, marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: T.fHead, fontSize: 17, fontWeight: 700, color: T.diff }}>{G('أحكام رواية ورش عن نافع')}</span>
            </div>
            <TJFamily title={G('خصائص ورش')} dot={TJ.diff}
              note={G('تُلوَّن أحكام ورش الخاصّة على حروفها كما يلي:')} items={[
                { c: TJ.diff,    t: G('المخالف لحفص'), d: G('الحرف/الكلمة التي تخالف رواية حفص') },
                { c: TJ.ghunnah, t: G('الإدغام وصلة ميم الجمع'), d: G('بالأخضر') },
                { c: TJ.wTaqlil, t: G('التقليل'), d: G('ذوات الياء (بين الفتح والإمالة)') },
                { c: TJ.wBadal,  t: G('مدّ البدل'), d: G('همزة يتبعها حرف مدّ (ءَامَن، أُوتوا)') },
                { c: TJ.wLeen,   t: G('مدّ اللين'), d: G('واو/ياء ساكنة بعد فتح (خَوْف، البَيْت)') },
                { c: TJ.wRaMur,  t: G('الراءات المرقّقة') },
                { c: TJ.wLamG,   t: G('اللامات المغلّظة'), d: G('بعد ص/ط/ظ') },
              ]} />
          </div>
        )}

        {NARRATION_DETAILS[narration] && (
          <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 16, marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: T.fHead, fontSize: 17, fontWeight: 700, color: T.diff }}>{G(NARRATION_DETAILS[narration].title)}</span>
            </div>
            <TJFamily title={G('أحكامها الملوّنة')} dot={TJ.diff}
              note={G('تُلوَّن الأحكام المثبتة في النصّ الرسمي للرواية:')} items={NARRATION_DETAILS[narration].items} />
          </div>
        )}

        <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 16, marginTop: 4 }}>
          <TJFamily title={G('ألوان القراءات')} dot={TJ.diff}
            note={G('عند اختيار قراءةٍ غير حفص يُبرَز اختلافها عن رواية حفص:')}
            items={[{ c: TJ.diff, t: G('الكلمة/الحرف المخالف لرواية حفص'), d: G('بلونٍ أخضر مزرقّ') }]} />
          <div style={{ fontFamily: T.fBody, fontSize: 12, color: T.inkMuted, lineHeight: 1.75, marginTop: -6 }}>
            {G('ويُعرَض نصّ كلّ رواية بخطّها العثماني الرسمي. وأحكامٌ خاصّةٌ بكلّ روايةٍ (كالإدغام والإمالة والتقليل ومدّ البدل وترقيق الراءات وتغليظ اللامات) تُضاف تِباعاً عند توفّر مصدرها المُحقَّق.')}
          </div>
        </div>

        <button onClick={onClose} className="afn-tap" style={{ width: '100%', border: 'none', cursor: 'pointer', marginTop: 14,
          padding: '15px', borderRadius: 16, background: T.green, color: '#fff', fontFamily: T.fHead, fontSize: 16, fontWeight: 700 }}>
          {G('فهمتُ، إغلاق')}
        </button>
      </div>
    </div>
  );
}

function GuideStep({ n, children }) {
  return (
    <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start', marginBottom: 12 }}>
      <span style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: T.mint,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: T.fHead, fontSize: 13, fontWeight: 700, color: T.green }}>{window.tnum ? window.tnum(n) : n}</span>
      <div style={{ fontFamily: T.fBody, fontSize: 14, lineHeight: 1.85, color: T.inkSoft, textWrap: 'pretty', paddingTop: 2 }}>{children}</div>
    </div>
  );
}
function QuranGuide({ onClose, onDontShow }) {
  const rubs = [[1, 'ربع الحزب'], [2, 'نصف الحزب'], [3, 'ثلاثة أرباع الحزب'], [0, 'الحزب']];
  const [page, setPage] = React.useState(0);
  const touch = React.useRef(null);
  const G = (s) => (window.tc(s) || s);   // ترجمة نصوص الدليل مع رجوعٍ للعربية

  const pages = [
    {
      title: G('دليل المصحف'), sub: G('تعرّف على علامات المصحف ومزاياه'),
      body: (
        <React.Fragment>
          <GuideRow tint={T.gold} title={G('علامات الأرباع والأحزاب')} svg={<Icon name="book" size={23} color={T.gold} />}>
            {G('عند بداية كل ربعٍ من الحزب تظهر علامة المحراب بجانب رقم الآية، ويمتلئ قرصُها الذهبيّ تدريجيًا.')}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, marginTop: 12 }}>
              {rubs.map(([pos, lbl]) => (
                <div key={pos} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 1 }}>
                  <RubMark pos={pos} />
                  <span style={{ fontFamily: T.fBody, fontSize: 10.5, fontWeight: 700, color: T.green, textAlign: 'center', lineHeight: 1.3 }}>{G(lbl)}</span>
                </div>
              ))}
            </div>
          </GuideRow>
          <GuideRow tint={T.green} title={G('حفظٌ تلقائيّ ومحفوظات')}
            svg={<img src="assets/qurani/bookmark.png" alt="" style={{ width: 24, height: 24, display: 'block' }} />}>
            {G('يحفظ التطبيق آخر موضعٍ قرأته تلقائيّاً، فتُتابع من حيث وقفت عبر بطاقة «تابع القراءة». ولحفظ آيةٍ بعينها اضغط عليها مطوّلاً، ثمّ تجدها في «محفوظاتي».')}
          </GuideRow>
          <GuideRow tint="#5C7CA6" title={G('لغة المصحف والترجمة')}
            svg={<Icon name="globe" size={22} color="#5C7CA6" />}>
            {G('يبقى نصّ المصحف بالعربيّة دائمًا حتى لو غيّرتَ لغة التطبيق — صونًا لرسمه. وإن أردتَ ترجمة المعاني، فعّلها من قسم «قرآني» في الإعدادات عبر صفّ «الترجمة».')}
          </GuideRow>
          <GuideRow tint="#5C7CA6" title={G('الختمات — فرديّة وجماعيّة')}
            svg={<svg width="23" height="23" viewBox="0 0 24 24" fill="none"><g stroke="#5C7CA6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8.5" r="3"/><path d="M3.5 19c.5-3.1 2.7-4.8 5.5-4.8S14 15.9 14.5 19"/><path d="M16 5.6a3 3 0 0 1 0 5.8"/><path d="M17.5 14.4c2.3.5 3.7 2.1 4 4.6"/></g></svg>}>
            {G('أنشئ ختمة تلاوةٍ أو حفظٍ فرديّة لتتبّع تقدّمك جزءًا جزءًا، أو ختمةً جماعيّة تشارك رابطها مع أصدقائك فتوزّعون الأجزاء وتتابعون معًا في غرفةٍ بمحادثة.')}
          </GuideRow>
        </React.Fragment>
      ),
    },
    {
      title: G('كيف تختار القارئ'), sub: G('صوتُ التلاوة الذي يرافقك'),
      body: (
        <React.Fragment>
          <GuideRow tint={T.clay} title={G('من الإعدادات')} svg={<Icon name="quote" size={22} color={T.clay} />}>
            {G('بإمكانك تبديل القارئ في أيّ وقت — يُحفظ اختيارك تلقائيًّا.')}
          </GuideRow>
          <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '16px 16px 6px', marginBottom: 4 }}>
            <GuideStep n={1}>{G('افتح تبويب «الإعدادات» من الشريط السفليّ.')}</GuideStep>
            <GuideStep n={2}>{G('ضِمن قسم «التلاوة والقراءة» اضغط صفّ «القارئ».')}</GuideStep>
            <GuideStep n={3}>{G('اختر القارئ الذي تريده من القائمة المنسدلة.')}</GuideStep>
          </div>
        </React.Fragment>
      ),
    },
    {
      title: G('كيف تبدّل القراءة'), sub: G('القراءات العشر المتواترة بروايتها'),
      body: (
        <React.Fragment>
          <GuideRow tint={T.green} title={G('القراءات العشر')} svg={<Icon name="book" size={22} color={T.green} />}>
            {G('يضمّ التطبيق القرّاء العشرة كاملين، لكلٍّ منهم راوِيان — كحفصٍ وشعبة عن عاصم، وقالون وورش عن نافع.')}
          </GuideRow>
          <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '16px 16px 6px', marginBottom: 4 }}>
            <GuideStep n={1}>{G('افتح «الإعدادات» ثمّ قسم «التلاوة والقراءة».')}</GuideStep>
            <GuideStep n={2}>{G('اضغط صفّ «القراءة (العشر)» فوق صفّ القارئ.')}</GuideStep>
            <GuideStep n={3}>{G('تظهر القراءات العشر مع رواتها — اختر القراءة والرواية التي تريد.')}</GuideStep>
          </div>
        </React.Fragment>
      ),
    },
  ];
  const total = pages.length;
  const last = page === total - 1;
  const go = (d) => setPage(p => Math.max(0, Math.min(total - 1, p + d)));
  const onTouchStart = (e) => { touch.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current; touch.current = null;
    if (Math.abs(dx) < 45) return;
    go(dx < 0 ? 1 : -1);   // سحبٌ لليسار ← التالي، ولليمين ← السابق (واجهة عربية)
  };

  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 120, display: 'flex', alignItems: 'flex-end',
      background: 'rgba(20,38,30,.42)', animation: 'afn-fade .2s ease both' }}>
      <div onClick={e => e.stopPropagation()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
        className="afn-scroll" style={{ width: '100%', maxHeight: '92%', overflowY: 'auto',
        background: T.bg, borderRadius: '26px 26px 0 0', padding: '20px 20px 26px', direction: window.afnDir(),
        animation: 'afn-rise .28s cubic-bezier(.22,1,.36,1) both' }}>
        <div style={{ width: 42, height: 5, borderRadius: 99, background: T.mintEdge, margin: '0 auto 14px' }} />

        {/* نقاط الصفحات */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginBottom: 14 }}>
          {pages.map((_, i) => (
            <span key={i} onClick={() => setPage(i)} style={{ cursor: 'pointer', height: 7, borderRadius: 99,
              width: i === page ? 22 : 7, background: i === page ? T.green : T.mintEdge, transition: 'all .25s' }} />
          ))}
        </div>

        <h2 style={{ margin: '0 0 4px', textAlign: 'center', fontFamily: T.fHead, fontSize: 22, fontWeight: 700, color: T.ink }}>{pages[page].title}</h2>
        <p style={{ margin: '0 0 20px', textAlign: 'center', fontFamily: T.fBody, fontSize: 13.5, color: T.inkMuted }}>{pages[page].sub}</p>

        <div key={page} style={{ animation: 'afn-fade .25s ease both' }}>{pages[page].body}</div>

        {/* تنقّل الصفحات */}
        <div style={{ display: 'flex', gap: 11, marginTop: 8 }}>
          {page > 0 && (
            <button onClick={() => go(-1)} className="afn-tap" style={{ flex: 1, border: `1.5px solid ${T.line}`, cursor: 'pointer',
              padding: '14px', borderRadius: 16, background: T.card, color: T.inkSoft, fontFamily: T.fHead, fontSize: 15, fontWeight: 700 }}>
              {G('السابق')}
            </button>
          )}
          <button onClick={last ? onClose : () => go(1)} className="afn-tap" style={{ flex: 2, border: 'none', cursor: 'pointer',
            padding: '15px', borderRadius: 16, background: T.green, color: '#fff', fontFamily: T.fHead, fontSize: 16, fontWeight: 700 }}>
            {last ? G('فهمتُ، إغلاق 🌿') : G('التالي')}
          </button>
        </div>

        {onDontShow && (
          <button onClick={onDontShow} className="afn-tap" style={{ width: '100%', border: 'none', cursor: 'pointer', marginTop: 10,
            padding: '12px', borderRadius: 14, background: 'transparent', color: T.inkMuted, fontFamily: T.fBody, fontSize: 14, fontWeight: 600 }}>
            {G('عدم العرض مرّة أخرى')}
          </button>
        )}
      </div>
    </div>
  );
}

// ── صفحة محفوظاتي — الآيات التي حفظها المستخدم ──────────────────
function SavedScreen({ saved, setSaved, onBack, onOpen }) {
  const list = [...(saved || [])].sort((a, b) => (a.surah - b.surah) || (a.ayah - b.ayah));
  const remove = (s, a) => setSaved(l => (l || []).filter(b => !(b.surah === s && b.ayah === a)));
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#FCFAF3' }}>
      <div style={{ flexShrink: 0, paddingTop: 52, paddingBottom: 20, background: 'linear-gradient(180deg,#16614A,#11533E)',
        color: '#fff', textAlign: 'center', position: 'relative' }}>
        <div onClick={onBack} className="afn-tap" style={{ position: 'absolute', top: 52, right: 14, width: 42, height: 42,
          borderRadius: '50%', background: 'rgba(255,255,255,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="chevronL" size={22} color="#fff" />
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <img src="assets/qurani/bookmark.png" alt="" style={{ width: 26, height: 26, display: 'block', filter: 'brightness(0) invert(1)', opacity: .95 }} />
          <span style={{ fontFamily: T.fDisplay, fontSize: 30, fontWeight: 700 }}>محفوظاتي</span>
        </div>
        <div style={{ fontFamily: T.fBody, fontSize: 13, opacity: .85, marginTop: 3 }}>
          {list.length ? window.tf('q_verses', { n: window.tnum(list.length) }) : 'آياتُك المحفوظة'}
        </div>
      </div>
      <div className="afn-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 40px' }}>
        {!list.length ? (
          <div style={{ textAlign: 'center', padding: '64px 26px' }}>
            <img src="assets/qurani/bookmark.png" alt="" style={{ width: 56, height: 56, display: 'block', margin: '0 auto', opacity: .35 }} />
            <div style={{ fontFamily: T.fHead, fontSize: 17, fontWeight: 700, color: T.ink, marginTop: 16 }}>لا محفوظات بعد</div>
            <div style={{ fontFamily: T.fBody, fontSize: 13.5, color: T.inkMuted, marginTop: 6, lineHeight: 1.85, textWrap: 'pretty' }}>
              اضغط مطوّلاً على أيّ آيةٍ أثناء القراءة لتحفظها هنا وتعود إليها بسهولة.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {list.map(b => {
              const meta = SURAH_INDEX[b.surah - 1];
              const name = meta ? window.surahName(b.surah, meta.name) : '';
              return (
                <div key={b.surah + ':' + b.ayah} onClick={() => onOpen(b.surah, b.ayah)} className="afn-tap"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: T.card,
                    border: `1px solid ${T.line}`, borderRadius: 16, padding: '13px 14px',
                    boxShadow: '0 1px 2px rgba(38,53,45,.04)' }}>
                  <div style={{ position: 'relative', width: 42, height: 42, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="42" height="42" viewBox="0 0 40 40" style={{ position: 'absolute', inset: 0 }}>
                      <path d="M 15.79 9.84 C 13.39 4.88, 14.87 3.79, 20.00 1.20 C 25.13 3.79, 26.61 4.88, 24.21 9.84 C 26.01 4.63, 27.84 4.91, 33.29 6.71 C 35.09 12.16, 35.37 13.99, 30.16 15.79 C 35.12 13.39, 36.21 14.87, 38.80 20.00 C 36.21 25.13, 35.12 26.61, 30.16 24.21 C 35.37 26.01, 35.09 27.84, 33.29 33.29 C 27.84 35.09, 26.01 35.37, 24.21 30.16 C 26.61 35.12, 25.13 36.21, 20.00 38.80 C 14.87 36.21, 13.39 35.12, 15.79 30.16 C 13.99 35.37, 12.16 35.09, 6.71 33.29 C 4.91 27.84, 4.63 26.01, 9.84 24.21 C 4.88 26.61, 3.79 25.13, 1.20 20.00 C 3.79 14.87, 4.88 13.39, 9.84 15.79 C 4.63 13.99, 4.91 12.16, 6.71 6.71 C 12.16 4.91, 13.99 4.63, 15.79 9.84 Z"
                        fill={T.mint} stroke={T.mintEdge} strokeWidth="1" />
                    </svg>
                    <span style={{ position: 'relative', fontFamily: T.fHead, fontSize: 12, fontWeight: 700, color: T.green }}>{window.tnum(b.ayah)}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontFamily: T.fHead, fontSize: 16, fontWeight: 700, color: T.ink }}>{window.t('q_surah')} {name}</span>
                      <span style={{ fontFamily: T.fBody, fontSize: 11.5, fontWeight: 700, color: T.gold }}>الآية {window.tnum(b.ayah)}</span>
                    </div>
                    {b.text && <div dir="rtl" style={{ fontFamily: T.fQuran, fontSize: 15.5, color: T.inkSoft, marginTop: 4,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.text}</div>}
                  </div>
                  <div onClick={(e) => { e.stopPropagation(); remove(b.surah, b.ayah); }} className="afn-tap"
                    aria-label="إزالة من المحفوظات"
                    style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: T.bgSink,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <img src="assets/qurani/delete.png" alt="" style={{ width: 15, height: 15, display: 'block' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function QuranScreen({ active, openSurah, jumpAyah, onOpenSurah, onCloseSurah, fontScale, qiraah, translation, bookmark, onBookmark, saved, setSaved, seenIntro, onSeenIntro, khatmat, setKhatmat, userName }) {
  // prefetch the whole mushaf in the background as soon as the tab opens
  React.useEffect(() => { ensureAllQuran().catch(() => {}); }, []);
  const [view, setView] = React.useState('index');     // index | khatmat | saved
  const [showIntro, setShowIntro] = React.useState(false);
  // البوب أب يظهر في كل مرّة يُفتح فيها قسم القرآن، حتّى يضغط المستخدم «عدم العرض مرّة أخرى»
  React.useEffect(() => { if (active && !seenIntro) setShowIntro(true); }, [active, seenIntro]);
  const KS = window.KhatmatScreen;

  const toggleSaved = (s, a, text) => setSaved(list => {
    const exists = (list || []).some(b => b.surah === s && b.ayah === a);
    if (exists) return list.filter(b => !(b.surah === s && b.ayah === a));
    return [...(list || []), { surah: s, ayah: a, text: String(text || '').slice(0, 140), savedAt: Date.now() }];
  });

  if (openSurah) return <SurahReader num={openSurah} jumpAyah={jumpAyah} onBack={onCloseSurah} onNav={onOpenSurah}
    fontScale={fontScale} qiraah={qiraah} translation={translation} bookmark={bookmark} onBookmark={onBookmark}
    saved={saved} onToggleSaved={toggleSaved} />;

  if (view === 'khatmat' && KS) {
    return <KS khatmat={khatmat} setKhatmat={setKhatmat} userName={userName} bookmark={bookmark}
      onExit={() => setView('index')}
      onOpenSurah={(s, a) => { setView('index'); onOpenSurah(s, a); }} />;
  }

  if (view === 'saved') {
    return <SavedScreen saved={saved} setSaved={setSaved} onBack={() => setView('index')}
      onOpen={(s, a) => { setView('index'); onOpenSurah(s, a); }} />;
  }

  return (
    <React.Fragment>
      <QuranIndex onOpen={onOpenSurah} onOpenKhatmat={() => setView('khatmat')} onOpenSaved={() => setView('saved')}
        savedCount={(saved || []).length} qiraah={qiraah}
        bookmark={bookmark} onResume={() => bookmark && onOpenSurah(bookmark.surah, bookmark.ayah)} />
      {showIntro && <QuranGuide onClose={() => setShowIntro(false)}
        onDontShow={() => { setShowIntro(false); onSeenIntro && onSeenIntro(); }} />}
    </React.Fragment>
  );
}

Object.assign(window, { QuranScreen, QuranGuide, TajweedColorsGuide, tajweedSegments, colorizeAyah });

// ابدأ تحميل المصحف كاملاً فور تحميل السكربت (قبل أن يفتح المستخدم أي سورة)
ensureAllQuran().catch(() => {});
