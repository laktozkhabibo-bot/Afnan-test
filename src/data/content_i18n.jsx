// content_i18n.jsx — ترجمة المحتوى الديني (أذكار · أدعية · أحاديث · آيات) تحت النصّ العربي.
// النصّ العربيّ يبقى دائمًا للتلاوة؛ هذه الطبقة تُظهر ترجمةً أسفله بلغة الواجهة المختارة.
// مفتاح البحث = النصّ العربي بعد تجريده من التشكيل والترقيم (afnNormAr) ليتطابق رغم اختلاف الرسم.

function afnNormAr(s) {
  return String(s)
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '')   // الحركات + التطويل
    .replace(/[\u200f\u200e]/g, '')
    .replace(/\uFDFA/g, '')                         // ﷺ
    .replace(/[«».،·…ـ]/g, ' ')
    .replace(/[آأإٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
    .replace(/\s+/g, ' ').trim();
}
window.afnNormAr = afnNormAr;

// خريطة الترجمة تُجمَّع من عدّة ملفّات (أذكار/أحاديث/...) — كلٌّ يدمج فيها
window.CONTENT_TR = window.CONTENT_TR || {};
function afnRegTr(map) { for (const k in map) window.CONTENT_TR[afnNormAr(k)] = map[k]; }
window.afnRegTr = afnRegTr;

// ترجمة المحتوى: تُعيد نصّ اللغة الحالية أو '' إن لم توجد/كانت العربية
function tc(arText) {
  const L = window.AFN_LANG;
  if (!arText || L === 'ar') return '';
  const e = window.CONTENT_TR[afnNormAr(arText)];
  return (e && e[L]) ? e[L] : '';
}
window.tc = tc;

// ── ترجمة المراجع (اسم السورة + رقم الآية، ودرجة الحديث) ──────────────────
const AR2W = s => String(s).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

const SURAH_TR = {
  'البقرة':   { en: 'Al-Baqarah', tr: 'Bakara', ur: 'البقرة', id: 'Al-Baqarah' },
  'ال عمران': { en: 'Aal-Imran', tr: 'Âl-i İmrân', ur: 'آل عمران', id: 'Ali Imran' },
  'الاعراف':  { en: "Al-A'raf", tr: 'A‘râf', ur: 'الأعراف', id: "Al-A'raf" },
  'التوبه':   { en: 'At-Tawbah', tr: 'Tevbe', ur: 'التوبہ', id: 'At-Taubah' },
  'ابراهيم':  { en: 'Ibrahim', tr: 'İbrâhîm', ur: 'ابراہیم', id: 'Ibrahim' },
  'طه':       { en: 'Ta-Ha', tr: 'Tâhâ', ur: 'طٰہٰ', id: 'Ta-Ha' },
  'الفرقان':  { en: 'Al-Furqan', tr: 'Furkân', ur: 'الفرقان', id: 'Al-Furqan' },
  'النمل':    { en: 'An-Naml', tr: 'Neml', ur: 'النمل', id: 'An-Naml' },
  'الزخرف':   { en: 'Az-Zukhruf', tr: 'Zuhruf', ur: 'الزخرف', id: 'Az-Zukhruf' },
  'الرحمن':   { en: 'Ar-Rahman', tr: 'Rahmân', ur: 'الرحمٰن', id: 'Ar-Rahman' },
  'الحشر':    { en: 'Al-Hashr', tr: 'Haşr', ur: 'الحشر', id: 'Al-Hasyr' },
  'الشرح':    { en: 'Ash-Sharh', tr: 'İnşirâh', ur: 'الشرح', id: 'Asy-Syarh' },
  'الاخلاص':  { en: 'Al-Ikhlas', tr: 'İhlâs', ur: 'الإخلاص', id: 'Al-Ikhlas' },
  'الفلق':    { en: 'Al-Falaq', tr: 'Felak', ur: 'الفلق', id: 'Al-Falaq' },
  'الناس':    { en: 'An-Nas', tr: 'Nâs', ur: 'الناس', id: 'An-Nas' },
  'الحج':     { en: 'Al-Hajj', tr: 'Hac', ur: 'الحج', id: 'Al-Hajj' },
};
const SURAH_WORD = { en: 'Surah', tr: 'Sûre', ur: 'سورۃ', id: 'Surah' };
const AYAH_WORD  = { en: 'verse', tr: 'âyet', ur: 'آیت', id: 'ayat' };
const SURAH_TR_N = {};
for (const k in SURAH_TR) SURAH_TR_N[afnNormAr(k)] = SURAH_TR[k];
const surahLookup = name => SURAH_TR_N[afnNormAr(name)];

const GRADING_TR = {
  'متفق عليه':     { en: 'Agreed upon', tr: 'Müttefekun aleyh', ur: 'متفق علیہ', id: 'Muttafaq alaih' },
  'رواه مسلم':     { en: 'Muslim', tr: 'Müslim', ur: 'مسلم', id: 'Muslim' },
  'رواه البخاري':  { en: 'Al-Bukhari', tr: 'Buhârî', ur: 'بخاری', id: 'Al-Bukhari' },
  'رواه الترمذي':  { en: 'At-Tirmidhi', tr: 'Tirmizî', ur: 'ترمذی', id: 'At-Tirmidzi' },
  'رواه أبو داود': { en: 'Abu Dawud', tr: 'Ebû Dâvûd', ur: 'ابو داؤد', id: 'Abu Dawud' },
  'رواه ابن ماجه': { en: 'Ibn Majah', tr: 'İbn Mâce', ur: 'ابن ماجہ', id: 'Ibnu Majah' },
  'رواه البيهقي':  { en: 'Al-Bayhaqi', tr: 'Beyhakî', ur: 'بیہقی', id: 'Al-Baihaqi' },
  'مسند أحمد':     { en: 'Musnad Ahmad', tr: 'Müsned-i Ahmed', ur: 'مسند احمد', id: 'Musnad Ahmad' },
  'سنن أبي داود':  { en: 'Sunan Abi Dawud', tr: 'Sünen-i Ebû Dâvûd', ur: 'سنن ابی داؤد', id: 'Sunan Abu Dawud' },
  'سنن الترمذي':   { en: 'Sunan At-Tirmidhi', tr: 'Sünen-i Tirmizî', ur: 'سنن ترمذی', id: 'Sunan At-Tirmidzi' },
  'حديث حسن':      { en: 'Hasan hadith', tr: 'Hasen hadis', ur: 'حدیث حسن', id: 'Hadis hasan' },
};

function tcRef(ref) {
  const L = window.AFN_LANG;
  if (!ref || L === 'ar') return '';
  const r = afnNormAr(ref);
  if (GRADING_TR[ref]) return GRADING_TR[ref][L];
  // "سوره X ايه N"
  let m = r.match(/^سوره\s+(.+?)\s+ايه\s+([٠-٩\d]+)$/);
  if (m) { const s = surahLookup(m[1]); if (s) return L === 'ur' ? `${s.ur} · ${AYAH_WORD.ur} ${m[2]}` : `${s[L]} · ${AYAH_WORD[L]} ${AR2W(m[2])}`; }
  // "سوره X" (بلا رقم)
  m = r.match(/^سوره\s+(.+)$/);
  if (m) { const s = surahLookup(m[1]); if (s) return `${SURAH_WORD[L]} ${s[L]}`; }
  // "X N" (مثل: الرحمن ٤٨)
  m = r.match(/^(.+?)\s+([٠-٩\d]+)$/);
  if (m) { const s = surahLookup(m[1]); if (s) return L === 'ur' ? `${s.ur} ${m[2]}` : `${s[L]} ${AR2W(m[2])}`; }
  return '';
}
window.tcRef = tcRef;
