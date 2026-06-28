// i18n.jsx — طبقة تعدّد اللغات: لغة الواجهة الكاملة (عدا نصّ القرآن)
// اللغات المدعومة: العربية (افتراضية) · الإنجليزية · التركية · الأوردية · الإندونيسية

const AFN_LANGS = [
  { key: 'ar', ar: 'العربية',    native: 'العربية',           flag: '🇸🇦', dir: 'rtl' },
  { key: 'en', ar: 'الإنجليزية', native: 'English',           flag: '🇬🇧', dir: 'ltr' },
  { key: 'tr', ar: 'التركية',    native: 'Türkçe',            flag: '🇹🇷', dir: 'ltr' },
  { key: 'ur', ar: 'الأوردية',   native: 'اردو',              flag: '🇵🇰', dir: 'rtl' },
  { key: 'id', ar: 'الإندونيسية', native: 'Bahasa Indonesia',  flag: '🇮🇩', dir: 'ltr' },
];
window.AFN_LANGS = AFN_LANGS;
if (!window.AFN_LANG) window.AFN_LANG = 'ar';

function afnDir(lang) {
  const l = AFN_LANGS.find(x => x.key === (lang || window.AFN_LANG));
  return l ? l.dir : 'rtl';
}
window.afnDir = afnDir;

// أرقام: عربية-هندية للعربية، غربية لبقية اللغات
function tnum(n) {
  const s = String(n);
  return window.AFN_LANG === 'ar' ? s.replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : s;
}
window.tnum = tnum;

const STR = {
  // ── التبويبات ──
  tab_home:     { ar: 'الرئيسية',  en: 'Home',     tr: 'Ana Sayfa', ur: 'ہوم',      id: 'Beranda' },
  tab_quran:    { ar: 'قرآني',     en: 'Quran',    tr: "Kur'an",    ur: 'قرآن',     id: 'Quran' },
  tab_prayer:   { ar: 'صلاتي',     en: 'Prayer',   tr: 'Namaz',     ur: 'نماز',     id: 'Salat' },
  tab_seeds:    { ar: 'البذور',    en: 'Seeds',    tr: 'Tohumlar',  ur: 'بیج',      id: 'Benih' },
  tab_adhkar:   { ar: 'الأذكار',   en: 'Adhkar',   tr: 'Zikirler',  ur: 'اذکار',    id: 'Zikir' },
  tab_settings: { ar: 'الإعدادات', en: 'Settings', tr: 'Ayarlar',   ur: 'ترتیبات',  id: 'Pengaturan' },

  // ── أسماء الصلوات ──
  p_fajr:    { ar: 'الفجر',   en: 'Fajr',    tr: 'Sabah',   ur: 'فجر',          id: 'Subuh' },
  p_sunrise: { ar: 'الشروق',  en: 'Sunrise', tr: 'Güneş',   ur: 'طلوعِ آفتاب',  id: 'Syuruk' },
  p_dhuhr:   { ar: 'الظهر',   en: 'Dhuhr',   tr: 'Öğle',    ur: 'ظہر',          id: 'Zuhur' },
  p_asr:     { ar: 'العصر',   en: 'Asr',     tr: 'İkindi',  ur: 'عصر',          id: 'Asar' },
  p_maghrib: { ar: 'المغرب',  en: 'Maghrib', tr: 'Akşam',   ur: 'مغرب',         id: 'Magrib' },
  p_isha:    { ar: 'العشاء',  en: 'Isha',    tr: 'Yatsı',   ur: 'عشاء',         id: 'Isya' },

  // وحدات المدّة + ص/م
  u_hr:  { ar: 'س',  en: 'h',  tr: 'sa', ur: 'گھ',  id: 'j' },
  u_min: { ar: 'د',  en: 'm',  tr: 'dk', ur: 'منٹ', id: 'm' },
  u_am:  { ar: 'ص',  en: 'AM', tr: 'ÖÖ', ur: 'ص',   id: 'AM' },
  u_pm:  { ar: 'م',  en: 'PM', tr: 'ÖS', ur: 'م',   id: 'PM' },

  // ── الرئيسية ──
  h_salam:      { ar: 'السلام عليكم يا {name}', en: 'Assalamu alaikum, {name}', tr: 'Selamün aleyküm, {name}', ur: 'السلام علیکم {name}', id: 'Assalamualaikum, {name}' },
  h_next:       { ar: 'الصلاة القادمة', en: 'Next prayer', tr: 'Sonraki namaz', ur: 'اگلی نماز', id: 'Salat berikutnya' },
  h_missed:     { ar: 'الصلاة الفائتة', en: 'Last prayer', tr: 'Geçen namaz', ur: 'پچھلی نماز', id: 'Salat terakhir' },
  h_after:      { ar: 'بعد {x}', en: 'in {x}', tr: '{x} sonra', ur: '{x} میں', id: '{x} lagi' },
  h_since:      { ar: 'منذ {x}', en: '{x} ago', tr: '{x} önce', ur: '{x} پہلے', id: '{x} lalu' },
  h_hadith:     { ar: 'حديثُ اليوم', en: 'Hadith of the day', tr: 'Günün hadisi', ur: 'حدیثِ روز', id: 'Hadis hari ini' },
  h_quran_msg:  { ar: 'اقرأ وردك من القرآن', en: 'Read your daily portion', tr: 'Günlük Kur’an dersin', ur: 'اپنا روزانہ ورد پڑھیں', id: 'Baca bacaan harianmu' },
  h_adhkar_msg: { ar: 'حصّن يومك بالذكر', en: 'Fortify your day with dhikr', tr: 'Gününü zikirle güçlendir', ur: 'ذکر سے دن محفوظ کریں', id: 'Perkuat harimu dengan zikir' },
  h_seed_tree:  { ar: 'مِن بذرةٍ إلى شجرة', en: 'From a seed to a tree', tr: 'Tohumdan ağaca', ur: 'بیج سے درخت تک', id: 'Dari benih ke pohon' },
  h_tap_hadith: { ar: 'اضغط لقراءة الشرح والسند', en: 'Tap to read the explanation & source', tr: 'Açıklama ve kaynak için dokun', ur: 'شرح اور سند کے لیے دبائیں', id: 'Ketuk untuk penjelasan & sumber' },
  hd_rawi:      { ar: 'الراوي', en: 'Narrator', tr: 'Râvî', ur: 'راوی', id: 'Perawi' },
  hd_takhrij:   { ar: 'التخريج والسند', en: 'Source & chain', tr: 'Kaynak ve sened', ur: 'تخریج و سند', id: 'Sumber & sanad' },
  hd_grade:     { ar: 'الدرجة', en: 'Grade', tr: 'Derece', ur: 'درجہ', id: 'Derajat' },
  hd_sharh:     { ar: 'الشرح', en: 'Explanation', tr: 'Açıklama', ur: 'شرح', id: 'Penjelasan' },
  hd_title:     { ar: 'شرحُ الحديث', en: 'Hadith explained', tr: 'Hadis açıklaması', ur: 'شرحِ حدیث', id: 'Penjelasan hadis' },
  tb_title:     { ar: 'المسبحة', en: 'Tasbih', tr: 'Tesbih', ur: 'تسبیح', id: 'Tasbih' },
  tb_hint:      { ar: 'اضغط الدائرة لتُسبِّح', en: 'Tap the circle to count', tr: 'Saymak için daireye dokun', ur: 'گننے کے لیے دائرہ دبائیں', id: 'Ketuk lingkaran untuk menghitung' },
  tb_done:      { ar: 'أتممتَ دورة · تبارك الله', en: 'Cycle complete · barakAllah', tr: 'Tur tamamlandı · bârekellah', ur: 'دور مکمل · بارک اللہ', id: 'Putaran selesai · barakallah' },
  tb_total:     { ar: 'إجمالي اليوم {n}', en: 'Today’s total {n}', tr: 'Bugünkü toplam {n}', ur: 'آج کا کل {n}', id: 'Total hari ini {n}' },

  // ── صلاتي ──
  pr_locating:   { ar: 'جارٍ تحديد موقعك…', en: 'Locating you…', tr: 'Konumun belirleniyor…', ur: 'مقام معلوم ہو رہا ہے…', id: 'Menentukan lokasi…' },
  pr_denied:     { ar: 'تعذّر الوصول للموقع', en: 'Location unavailable', tr: 'Konuma erişilemedi', ur: 'مقام دستیاب نہیں', id: 'Lokasi tidak tersedia' },
  pr_unsup_loc:  { ar: 'الموقع غير مدعوم', en: 'Location not supported', tr: 'Konum desteklenmiyor', ur: 'مقام تعاون یافتہ نہیں', id: 'Lokasi tidak didukung' },
  pr_denied_msg: { ar: 'فعّل إذن الموقع من إعدادات المتصفح لمواقيت دقيقة — تُعرض الآن مواقيت الرياض تقريبياً.', en: 'Enable location permission in your browser for accurate times — Riyadh times are shown approximately.', tr: 'Doğru vakitler için tarayıcıdan konum iznini etkinleştirin — şu an Riyad vakitleri gösteriliyor.', ur: 'درست اوقات کے لیے براؤزر سے مقام کی اجازت دیں — اب ریاض کے اوقات تخمیناً دکھائے جا رہے ہیں۔', id: 'Aktifkan izin lokasi di peramban untuk waktu akurat — kini ditampilkan waktu Riyadh (perkiraan).' },
  pr_retry:      { ar: 'أعد المحاولة', en: 'Try again', tr: 'Tekrar dene', ur: 'دوبارہ کوشش', id: 'Coba lagi' },
  pr_until:      { ar: 'متبقٍّ على رفع الأذان · طريقة {m}', en: 'until adhan · {m} method', tr: 'ezana kalan · {m} yöntemi', ur: 'اذان میں باقی · {m} طریقہ', id: 'menuju azan · metode {m}' },
  pr_today:      { ar: 'مواقيت اليوم', en: "Today's times", tr: 'Bugünün vakitleri', ur: 'آج کے اوقات', id: 'Waktu hari ini' },
  pr_qibla:      { ar: 'اتجاه القبلة', en: 'Qibla direction', tr: 'Kıble yönü', ur: 'سمتِ قبلہ', id: 'Arah kiblat' },
  pr_tap_comp:   { ar: 'اضغط لتفعيل البوصلة', en: 'Tap to enable compass', tr: 'Pusulayı etkinleştir', ur: 'کمپاس فعال کریں', id: 'Aktifkan kompas' },
  pr_qibla_deg:  { ar: 'القبلة على {x}° من الشمال', en: 'Qibla is {x}° from north', tr: 'Kıble kuzeyden {x}°', ur: 'قبلہ شمال سے {x}°', id: 'Kiblat {x}° dari utara' },
  pr_aligned:    { ar: '✓ أنت الآن باتجاه القبلة', en: "✓ You're facing the Qibla", tr: '✓ Kıbleye dönüksün', ur: '✓ آپ قبلہ رخ ہیں', id: '✓ Anda menghadap kiblat' },
  pr_move:       { ar: 'حرّك هاتفك حتى يستقيم السهم الأحمر للأعلى', en: 'Turn your phone until the red arrow points up', tr: 'Kırmızı ok yukarı bakana dek telefonu çevir', ur: 'فون گھمائیں یہاں تک کہ سرخ تیر اوپر ہو', id: 'Putar ponsel hingga panah merah ke atas' },
  pr_qibla_w:    { ar: 'القبلة', en: 'Qibla', tr: 'Kıble', ur: 'قبلہ', id: 'Kiblat' },
  pr_dist:       { ar: '{city} · تبعد عن الكعبة {km} كم', en: '{city} · {km} km from the Kaaba', tr: '{city} · Kâbe’ye {km} km', ur: '{city} · کعبہ سے {km} کلومیٹر', id: '{city} · {km} km dari Ka’bah' },
  pr_heading:    { ar: 'اتجاهك الحالي: {x}°', en: 'Your heading: {x}°', tr: 'Yönün: {x}°', ur: 'آپ کی سمت: {x}°', id: 'Arah Anda: {x}°' },
  pr_comp_hint:  { ar: 'تدور البوصلة مع دوران الهاتف — افتح التطبيق على هاتفك لتفعيلها', en: 'The compass turns with your phone — open the app on your phone to enable it', tr: 'Pusula telefonla döner — etkinleştirmek için uygulamayı telefonda aç', ur: 'کمپاس فون کے ساتھ گھومتا ہے — فعال کرنے کے لیے ایپ فون پر کھولیں', id: 'Kompas berputar bersama ponsel — buka aplikasi di ponsel untuk mengaktifkannya' },
  pr_qibla_sub:  { ar: 'وجّه هاتفك حتى تستقرّ الكعبة في الأعلى', en: 'Turn your phone until the Kaaba rests at the top', tr: 'Kâbe yukarıda durana dek telefonu çevir', ur: 'فون گھمائیں یہاں تک کہ کعبہ اوپر آ جائے', id: 'Putar ponsel hingga Ka’bah berada di atas' },
  pr_aligned_toast:{ ar: 'تم تحديد اتجاه القبلة', en: 'Qibla direction found', tr: 'Kıble yönü bulundu', ur: 'سمتِ قبلہ مل گئی', id: 'Arah kiblat ditemukan' },
  pr_calibrate:  { ar: 'حرّك هاتفك على شكل الرقم ٨ لمعايرة البوصلة', en: 'Move your phone in a figure-8 to calibrate the compass', tr: 'Pusulayı ayarlamak için telefonu 8 çizerek hareket ettir', ur: 'کمپاس کیلیبریٹ کرنے کے لیے فون کو 8 کی شکل میں ہلائیں', id: 'Gerakkan ponsel membentuk angka 8 untuk kalibrasi kompas' },
  pr_to_mecca:   { ar: 'إلى مكّة المكرّمة', en: 'to Makkah', tr: 'Mekke’ye', ur: 'مکہ مکرمہ تک', id: 'ke Makkah' },
  pr_unit_km:    { ar: 'كم', en: 'km', tr: 'km', ur: 'کلومیٹر', id: 'km' },
  pr_angle:      { ar: 'زاوية القبلة {x}° من الشمال', en: 'Qibla bearing {x}° from north', tr: 'Kıble açısı kuzeyden {x}°', ur: 'سمتِ قبلہ شمال سے {x}°', id: 'Sudut kiblat {x}° dari utara' },
  pr_loc_needed_t:{ ar: 'حدِّد موقعك لمعرفة القبلة', en: 'Set your location for Qibla', tr: 'Kıble için konumunu belirle', ur: 'قبلہ کے لیے مقام منتخب کریں', id: 'Atur lokasi untuk kiblat' },
  pr_loc_needed_b:{ ar: 'نحتاج موقعك لحساب اتجاه القبلة بدقّة من مكانك.', en: 'We need your location to compute the exact Qibla direction from where you are.', tr: 'Bulunduğun yerden kesin kıble yönünü hesaplamak için konumun gerekli.', ur: 'آپ کی جگہ سے درست سمتِ قبلہ کے لیے ہمیں آپ کا مقام چاہیے۔', id: 'Kami perlu lokasi Anda untuk menghitung arah kiblat yang tepat.' },
  pr_loc_enable: { ar: 'تحديد موقعي', en: 'Set my location', tr: 'Konumumu belirle', ur: 'میرا مقام منتخب کریں', id: 'Atur lokasi saya' },
  pr_adhan:      { ar: 'صوت الأذان', en: 'Adhan sound', tr: 'Ezan sesi', ur: 'اذان کی آواز', id: 'Suara azan' },
  pr_adhan_sub:  { ar: 'يُرفع الأذان صوتيّاً عند دخول كل وقت', en: 'The adhan plays at each prayer time', tr: 'Her vakitte ezan okunur', ur: 'ہر وقت پر اذان چلتی ہے', id: 'Azan diputar tiap waktu' },
  pr_adhan_listen:{ ar: 'الأذان', en: 'Adhan', tr: 'Ezan', ur: 'اذان', id: 'Azan' },
  pr_adhan_listen_fajr:{ ar: 'أذان الفجر', en: 'Fajr adhan', tr: 'Sabah ezanı', ur: 'فجر اذان', id: 'Azan Subuh' },
  pr_adhan_stop: { ar: 'إيقاف', en: 'Stop', tr: 'Durdur', ur: 'روکیں', id: 'Hentikan' },
  pr_riyadh:     { ar: 'الرياض (تقريبي)', en: 'Riyadh (approx.)', tr: 'Riyad (yaklaşık)', ur: 'ریاض (تخمینی)', id: 'Riyadh (perkiraan)' },

  // ── تحديد الموقع ──
  pr_loc_title:   { ar: 'تحديد الموقع', en: 'Set location', tr: 'Konumu ayarla', ur: 'مقام منتخب کریں', id: 'Atur lokasi' },
  pr_loc_current: { ar: 'استخدام موقعي الحالي', en: 'Use my current location', tr: 'Mevcut konumumu kullan', ur: 'میرا موجودہ مقام استعمال کریں', id: 'Gunakan lokasi saya' },
  pr_loc_search:  { ar: 'ابحث عن مدينة في أي مكان…', en: 'Search a city anywhere…', tr: 'Herhangi bir şehir ara…', ur: 'کہیں بھی شہر تلاش کریں…', id: 'Cari kota di mana saja…' },
  pr_loc_searching:{ ar: 'جارٍ البحث…', en: 'Searching…', tr: 'Aranıyor…', ur: 'تلاش جاری…', id: 'Mencari…' },
  pr_loc_noresult:{ ar: 'لا توجد نتائج', en: 'No results', tr: 'Sonuç yok', ur: 'کوئی نتیجہ نہیں', id: 'Tidak ada hasil' },
  pr_loc_method:  { ar: 'طريقة الحساب', en: 'Calculation method', tr: 'Hesaplama yöntemi', ur: 'حساب کا طریقہ', id: 'Metode perhitungan' },
  pr_loc_auto:    { ar: 'تلقائي', en: 'Automatic', tr: 'Otomatik', ur: 'خودکار', id: 'Otomatis' },
  pr_loc_school:  { ar: 'مذهب العصر', en: 'Asr method', tr: 'İkindi mezhebi', ur: 'عصر کا مسلک', id: 'Mazhab Asar' },
  pr_school_std:  { ar: 'الجمهور', en: 'Standard', tr: 'Çoğunluk', ur: 'جمہور', id: 'Mayoritas' },
  pr_school_hanafi:{ ar: 'حنفي', en: 'Hanafi', tr: 'Hanefi', ur: 'حنفی', id: 'Hanafi' },
  pr_loc_manual:  { ar: 'موقع يدوي', en: 'Manual', tr: 'Elle', ur: 'دستی', id: 'Manual' },
  pr_loc_done:    { ar: 'تم', en: 'Done', tr: 'Tamam', ur: 'ہو گیا', id: 'Selesai' },
  pr_src_offline: { ar: 'حساب فلكي (دون إنترنت)', en: 'Astronomical estimate (offline)', tr: 'Astronomik tahmin (çevrimdışı)', ur: 'فلکی تخمینہ (آف لائن)', id: 'Perkiraan astronomi (luring)' },

  // ── الإعدادات ──
  st_sub:        { ar: 'خصِّصْ رحلتك في أفنان', en: 'Customize your Afnan journey', tr: 'Afnan yolculuğunu özelleştir', ur: 'اپنا افنان سفر ترتیب دیں', id: 'Sesuaikan perjalanan Afnan-mu' },
  st_change_name:{ ar: 'اضغط لتغيير الاسم', en: 'Tap to change name', tr: 'İsmi değiştir', ur: 'نام تبدیل کریں', id: 'Ubah nama' },
  st_add_photo:  { ar: 'إضافة صورة', en: 'Add photo', tr: 'Fotoğraf ekle', ur: 'تصویر شامل کریں', id: 'Tambah foto' },
  st_remove_photo:{ ar: 'إزالة الصورة', en: 'Remove photo', tr: 'Fotoğrafı kaldır', ur: 'تصویر ہٹائیں', id: 'Hapus foto' },
  st_notif:      { ar: 'التنبيهات', en: 'Notifications', tr: 'Bildirimler', ur: 'اطلاعات', id: 'Notifikasi' },
  st_adhan_sub2: { ar: 'تنبيهٌ عند دخول كل وقت', en: 'Alert at each prayer time', tr: 'Her vakitte uyarı', ur: 'ہر وقت پر اطلاع', id: 'Peringatan tiap waktu' },
  st_adhkar:     { ar: 'تذكير الأذكار', en: 'Adhkar reminder', tr: 'Zikir hatırlatması', ur: 'اذکار یاددہانی', id: 'Pengingat zikir' },
  st_morn_eve:   { ar: 'الصباح والمساء', en: 'Morning & evening', tr: 'Sabah ve akşam', ur: 'صبح و شام', id: 'Pagi & petang' },
  st_wird:       { ar: 'وِردُ القرآن', en: 'Quran wird', tr: 'Kur’an dersi', ur: 'وردِ قرآن', id: 'Wirid Quran' },
  st_wird_sub:   { ar: 'تذكيرٌ يوميّ بوردك', en: 'A daily reminder of your portion', tr: 'Günlük dersin için hatırlatma', ur: 'روزانہ ورد کی یاددہانی', id: 'Pengingat harian bacaanmu' },
  st_kahf:       { ar: 'سورة الكهف', en: 'Surah Al-Kahf', tr: 'Kehf Suresi', ur: 'سورۃ الکہف', id: 'Surah Al-Kahf' },
  st_friday:     { ar: 'كل يوم جمعة', en: 'Every Friday', tr: 'Her Cuma', ur: 'ہر جمعہ', id: 'Setiap Jumat' },
  st_vibrate:    { ar: 'الاهتزاز', en: 'Vibration', tr: 'Titreşim', ur: 'ارتعاش', id: 'Getaran' },
  st_vibrate_sub:{ ar: 'تنبيهٌ باللمس', en: 'Haptic alert', tr: 'Dokunsal uyarı', ur: 'لمسی اطلاع', id: 'Peringatan getar' },
  st_qurani:     { ar: 'قرآني', en: 'Quran', tr: "Kur'an", ur: 'قرآن', id: 'Quran' },
  st_qiraat:     { ar: 'القراءات العشر', en: 'The Ten Qira’at', tr: 'On Kıraat', ur: 'دس قراءتیں', id: 'Sepuluh Qira’at' },
  st_reciter:    { ar: 'القارئ', en: 'Reciter', tr: 'Hafız', ur: 'قاری', id: 'Qari' },
  st_choose_rec: { ar: 'اختر القارئ', en: 'Choose reciter', tr: 'Hafız seç', ur: 'قاری منتخب کریں', id: 'Pilih qari' },
  st_translation:{ ar: 'الترجمة', en: 'Translation', tr: 'Meal', ur: 'ترجمہ', id: 'Terjemahan' },
  st_font:       { ar: 'حجم خطّ المصحف', en: 'Mushaf font size', tr: 'Mushaf yazı boyutu', ur: 'مصحف فونٹ سائز', id: 'Ukuran font mushaf' },
  st_calendar:   { ar: 'التقويم', en: 'Calendar', tr: 'Takvim', ur: 'تقویم', id: 'Kalender' },
  st_hijri_first:{ ar: 'إظهار الهجري أولاً', en: 'Show Hijri first', tr: 'Önce Hicri göster', ur: 'پہلے ہجری دکھائیں', id: 'Tampilkan Hijriah dulu' },
  st_hijri_sub:  { ar: 'ترتيب التاريخ في الرئيسية', en: 'Date order on the home screen', tr: 'Ana ekranda tarih sırası', ur: 'ہوم پر تاریخ کی ترتیب', id: 'Urutan tanggal di beranda' },
  st_instr:      { ar: 'تعليمات', en: 'Guides', tr: 'Kılavuzlar', ur: 'ہدایات', id: 'Panduan' },
  st_mushaf_g:   { ar: 'دليل المصحف', en: 'Mushaf guide', tr: 'Mushaf kılavuzu', ur: 'مصحف گائیڈ', id: 'Panduan mushaf' },
  st_tajweed:    { ar: 'ألوان التجويد', en: 'Tajweed colors', tr: 'Tecvid renkleri', ur: 'تجوید رنگ', id: 'Warna tajwid' },
  st_view:       { ar: 'عرض', en: 'View', tr: 'Göster', ur: 'دیکھیں', id: 'Lihat' },
  st_version:    { ar: 'الإصدار ٢٫٠', en: 'Version 2.0', tr: 'Sürüm 2.0', ur: 'ورژن ۲٫۰', id: 'Versi 2.0' },
  st_language:   { ar: 'لغة التطبيق', en: 'App language', tr: 'Uygulama dili', ur: 'ایپ کی زبان', id: 'Bahasa aplikasi' },
  st_general:    { ar: 'عامّ', en: 'General', tr: 'Genel', ur: 'عمومی', id: 'Umum' },

  // ── ورقة الاسم ──
  nm_title: { ar: 'الاسم', en: 'Name', tr: 'İsim', ur: 'نام', id: 'Nama' },
  nm_sub:   { ar: 'بمَ نُناديك في صفحتك؟', en: 'What should we call you?', tr: 'Sana nasıl hitap edelim?', ur: 'ہم آپ کو کیا پکاریں؟', id: 'Kami panggil kamu apa?' },
  nm_chars: { ar: '{n} / ١٠ أحرف', en: '{n} / 10 chars', tr: '{n} / 10 karakter', ur: '{n} / 10 حروف', id: '{n} / 10 huruf' },
  btn_cancel: { ar: 'إلغاء', en: 'Cancel', tr: 'İptal', ur: 'منسوخ', id: 'Batal' },
  btn_save:   { ar: 'حفظ', en: 'Save', tr: 'Kaydet', ur: 'محفوظ', id: 'Simpan' },
  btn_continue:{ ar: 'متابعة', en: 'Continue', tr: 'Devam', ur: 'جاری رکھیں', id: 'Lanjutkan' },

  // ── ورقة الترجمات ──
  tr_title:  { ar: 'الترجمات', en: 'Translations', tr: 'Mealler', ur: 'تراجم', id: 'Terjemahan' },
  tr_off:    { ar: 'بدون', en: 'Off', tr: 'Kapalı', ur: 'بند', id: 'Nonaktif' },
  tr_sub:    { ar: 'اختر لغةً تُعرَض ترجمتها تحت تفسير كلّ آية', en: 'Pick a language shown under each verse’s tafsir', tr: 'Her ayetin tefsiri altında gösterilecek dili seç', ur: 'ہر آیت کی تفسیر کے نیچے دکھائی جانے والی زبان منتخب کریں', id: 'Pilih bahasa yang tampil di bawah tafsir tiap ayat' },
  tr_tap:    { ar: 'تظهر الترجمة بعد الضغط على الآية في المصحف — لا يتغيّر نصّ القرآن.', en: 'The translation appears after you tap a verse in the mushaf — the Quran text itself does not change.', tr: 'Çeviri, mushafta bir ayete dokununca görünür — Kur’an metni değişmez.', ur: 'ترجمہ مصحف میں آیت پر دبانے کے بعد ظاہر ہوتا ہے — قرآن کا متن تبدیل نہیں ہوتا۔', id: 'Terjemahan muncul setelah Anda menekan ayat di mushaf — teks Quran tidak berubah.' },
  tr_src:    { ar: 'تُجلب التراجم لحظيًّا عبر Quran.com API من نصوصٍ موثّقة لـ Tanzil.net — دون تخزينها على خوادمنا، فتبقى محدّثةً دائمًا.', en: 'Translations are fetched live via the Quran.com API from Tanzil.net’s verified texts — never stored on our servers, so they stay up to date.', tr: 'Mealler, Tanzil.net’in doğrulanmış metinlerinden Quran.com API ile anlık çekilir — sunucumuzda tutulmaz, hep güncel kalır.', ur: 'تراجم Quran.com API کے ذریعے Tanzil.net کے مستند متون سے فوری حاصل ہوتے ہیں — ہمارے سرور پر محفوظ نہیں، ہمیشہ تازہ۔', id: 'Terjemahan diambil langsung via Quran.com API dari teks tepercaya Tanzil.net — tidak disimpan di server kami, selalu terbaru.' },

  // ── ورقة لغة التطبيق ──
  lang_title: { ar: 'لغة التطبيق', en: 'App language', tr: 'Uygulama dili', ur: 'ایپ کی زبان', id: 'Bahasa aplikasi' },
  lang_sub:   { ar: 'اختر اللغة التي تريد استعمالها في التطبيق', en: 'Choose the language you want to use in the app', tr: 'Uygulamada kullanmak istediğin dili seç', ur: 'وہ زبان منتخب کریں جو ایپ میں استعمال کرنا چاہتے ہیں', id: 'Pilih bahasa yang ingin Anda gunakan di aplikasi' },
  lang_note:  { ar: 'تتبدّل واجهة التطبيق بالكامل إلى لغتك. أمّا نصّ القرآن الكريم فيبقى بالعربية، وتظهر ترجمة الآية بعد الضغط عليها في المصحف.', en: 'The whole interface switches to your language. The Holy Quran text stays in Arabic, and a verse’s translation appears after you tap it in the mushaf.', tr: 'Tüm arayüz diline geçer. Kur’an-ı Kerim metni Arapça kalır; ayetin çevirisi mushafta ona dokununca görünür.', ur: 'پوری انٹرفیس آپ کی زبان میں بدل جاتی ہے۔ قرآنِ کریم کا متن عربی ہی رہتا ہے، اور آیت کا ترجمہ مصحف میں اس پر دبانے کے بعد ظاہر ہوتا ہے۔', id: 'Seluruh antarmuka beralih ke bahasa Anda. Teks Al-Quran tetap berbahasa Arab, dan terjemahan ayat muncul setelah Anda menekannya di mushaf.' },

  // ── قرآني (الفهرس) ──
  q_mushaf_sub: { ar: 'المصحف الشريف · {n} سورة · برواية {rawi}', en: 'The Holy Mushaf · {n} surahs · {rawi} narration', tr: 'Mushaf-ı Şerif · {n} sure · {rawi} rivayeti', ur: 'مصحف شریف · {n} سورتیں · روایت {rawi}', id: 'Mushaf Syarif · {n} surah · riwayat {rawi}' },
  q_resume:      { ar: 'تابع القراءة', en: 'Continue reading', tr: 'Okumaya devam', ur: 'پڑھنا جاری رکھیں', id: 'Lanjut membaca' },
  q_resume_at:   { ar: 'سورة {name} · الآية {n}', en: 'Surah {name} · Verse {n}', tr: '{name} Suresi · {n}. ayet', ur: 'سورۃ {name} · آیت {n}', id: 'Surah {name} · Ayat {n}' },
  q_khatmat:     { ar: 'الختمات', en: 'Khatmat', tr: 'Hatimler', ur: 'ختمات', id: 'Khataman' },
  q_khatmat_sub: { ar: 'اقرأ وأتمّ القرآن — فرديًّا أو جماعيًّا', en: 'Read & complete the Quran — solo or together', tr: "Kur'an'ı bitir — tek veya grupça", ur: 'قرآن مکمل کریں — انفرادی یا اجتماعی', id: 'Khatamkan Quran — sendiri atau bersama' },
  q_search:      { ar: 'ابحث عن سورة…', en: 'Search for a surah…', tr: 'Sure ara…', ur: 'سورت تلاش کریں…', id: 'Cari surah…' },
  q_surah:       { ar: 'سورة', en: 'Surah', tr: 'Sûre', ur: 'سورۃ', id: 'Surah' },
  q_verses:      { ar: '{n} آية', en: '{n} verses', tr: '{n} ayet', ur: '{n} آیات', id: '{n} ayat' },
  q_with_mean:   { ar: 'مع المعاني', en: 'with meanings', tr: 'anlamlarıyla', ur: 'معانی کے ساتھ', id: 'dengan makna' },
  q_makki:       { ar: 'مكية', en: 'Meccan', tr: 'Mekkî', ur: 'مکی', id: 'Makkiyah' },
  q_madani:      { ar: 'مدنية', en: 'Medinan', tr: 'Medenî', ur: 'مدنی', id: 'Madaniyah' },
  q_page:        { ar: 'صفحة', en: 'Page', tr: 'Sayfa', ur: 'صفحہ', id: 'Halaman' },
  q_juz:         { ar: 'الجزء', en: 'Juz', tr: 'Cüz', ur: 'پارہ', id: 'Juz' },
  q_tafsir_for:  { ar: 'تفسير الآية {n}', en: 'Tafsir of verse {n}', tr: '{n}. ayetin tefsiri', ur: 'آیت {n} کی تفسیر', id: 'Tafsir ayat {n}' },
  q_tafsir_name: { ar: 'التفسير الميسّر', en: 'Al-Tafsir Al-Muyassar', tr: 'el-Tefsîru\'l-Muyesser', ur: 'التفسیر المیسّر', id: 'At-Tafsir Al-Muyassar' },
  q_load_surah:  { ar: 'يُحمّل نصّ السورة…', en: 'Loading the surah…', tr: 'Sure yükleniyor…', ur: 'سورت لوڈ ہو رہی ہے…', id: 'Memuat surah…' },
  q_load_tafsir: { ar: 'يُحمّل التفسير…', en: 'Loading tafsir…', tr: 'Tefsir yükleniyor…', ur: 'تفسیر لوڈ ہو رہی ہے…', id: 'Memuat tafsir…' },
  q_err_surah:   { ar: 'تعذّر تحميل السورة', en: 'Could not load the surah', tr: 'Sure yüklenemedi', ur: 'سورت لوڈ نہ ہو سکی', id: 'Gagal memuat surah' },
  q_err_check:   { ar: 'تحقّق من اتصالك ثم أعِد المحاولة', en: 'Check your connection and try again', tr: 'Bağlantını kontrol edip tekrar dene', ur: 'اپنا کنکشن چیک کر کے دوبارہ کوشش کریں', id: 'Periksa koneksi lalu coba lagi' },
  q_err_tafsir:  { ar: 'تعذّر تحميل التفسير — تحقّق من اتصالك', en: 'Could not load tafsir — check your connection', tr: 'Tefsir yüklenemedi — bağlantını kontrol et', ur: 'تفسیر لوڈ نہ ہوئی — کنکشن چیک کریں', id: 'Gagal memuat tafsir — periksa koneksi' },
  q_err_trans:   { ar: 'تعذّر تحميل الترجمة — تحقّق من اتصالك', en: 'Could not load translation — check your connection', tr: 'Çeviri yüklenemedi — bağlantını kontrol et', ur: 'ترجمہ لوڈ نہ ہوا — کنکشن چیک کریں', id: 'Gagal memuat terjemahan — periksa koneksi' },
  btn_retry:     { ar: 'إعادة المحاولة', en: 'Try again', tr: 'Tekrar dene', ur: 'دوبارہ کوشش', id: 'Coba lagi' },

  // ── نظام صفحات المصحف ──
  st_quran_view: { ar: 'نظام عرض القرآن', en: 'Quran display mode', tr: "Kur'an görünümü", ur: 'قرآن کا اندازِ نمائش', id: 'Mode tampilan Quran' },
  qv_surah:      { ar: 'نظام السور', en: 'By surah', tr: 'Sûre düzeni', ur: 'سورت کے اعتبار سے', id: 'Per surah' },
  qv_pages:      { ar: 'صفحات المصحف', en: 'Mushaf pages', tr: 'Mushaf sayfaları', ur: 'مصحف کے صفحات', id: 'Halaman mushaf' },
  qv_surah_sub:  { ar: 'تقرأ كلَّ سورة كاملةً بالتمرير', en: 'Read each surah by scrolling', tr: 'Her sureyi kaydırarak oku', ur: 'ہر سورت اسکرول کر کے پڑھیں', id: 'Baca tiap surah dengan menggulir' },
  qv_pages_sub:  { ar: 'تصفّح القرآن صفحةً صفحة كالمصحف المطبوع', en: 'Browse page by page like the printed mushaf', tr: 'Basılı mushaf gibi sayfa sayfa gez', ur: 'چھپے مصحف کی طرح صفحہ بہ صفحہ', id: 'Telusuri halaman demi halaman seperti mushaf' },
  qp_loading:    { ar: 'تُحمّل صفحة المصحف…', en: 'Loading mushaf page…', tr: 'Mushaf sayfası yükleniyor…', ur: 'مصحف کا صفحہ لوڈ ہو رہا ہے…', id: 'Memuat halaman mushaf…' },
  qp_err:        { ar: 'تعذّر تحميل الصفحة', en: 'Could not load the page', tr: 'Sayfa yüklenemedi', ur: 'صفحہ لوڈ نہ ہو سکا', id: 'Gagal memuat halaman' },
  qp_menu_index: { ar: 'الرجوع إلى الفهرس', en: 'Back to index', tr: 'Fihriste dön', ur: 'فہرست پر واپس', id: 'Kembali ke indeks' },
  qp_menu_home:  { ar: 'الصفحة الرئيسية', en: 'Home', tr: 'Ana sayfa', ur: 'مرکزی صفحہ', id: 'Beranda' },
  qp_menu_bm:    { ar: 'وضع علامة', en: 'Set bookmark', tr: 'Yer imi koy', ur: 'نشان لگائیں', id: 'Tandai halaman' },
  qp_menu_goto:  { ar: 'الانتقال إلى العلامة', en: 'Go to bookmark', tr: 'Yer imine git', ur: 'نشان پر جائیں', id: 'Ke tanda' },
  qp_menu_read:  { ar: 'قراءة الصفحة كاملة', en: 'Recite full page', tr: 'Sayfayı sesli oku', ur: 'پورا صفحہ پڑھیں', id: 'Baca seluruh halaman' },
  qp_soon:       { ar: 'قريباً', en: 'Soon', tr: 'Yakında', ur: 'جلد', id: 'Segera' },
  qp_soon_msg:   { ar: 'ستتوفّر القراءة الصوتية قريبًا بإذن الله', en: 'Audio recitation will be available soon', tr: 'Sesli okuma yakında eklenecek', ur: 'صوتی تلاوت جلد دستیاب ہوگی', id: 'Tilawah audio segera tersedia' },
  qp_bm_set:     { ar: 'وُضِعت علامة على هذه الصفحة', en: 'Page bookmarked', tr: 'Sayfa yer imine eklendi', ur: 'صفحہ نشان زدہ', id: 'Halaman ditandai' },
  qp_no_bm:      { ar: 'لا توجد علامة محفوظة بعد', en: 'No bookmark saved yet', tr: 'Henüz yer imi yok', ur: 'ابھی کوئی نشان نہیں', id: 'Belum ada tanda' },
  qp_page_of:    { ar: 'صفحة {n}', en: 'Page {n}', tr: 'Sayfa {n}', ur: 'صفحہ {n}', id: 'Halaman {n}' },
  qa_translation:{ ar: 'الترجمة', en: 'Translation', tr: 'Çeviri', ur: 'ترجمہ', id: 'Terjemahan' },
  qa_tafsir:     { ar: 'التفسير', en: 'Tafsir', tr: 'Tefsir', ur: 'تفسیر', id: 'Tafsir' },
  qa_save:       { ar: 'حفظ الآية', en: 'Save verse', tr: 'Ayeti kaydet', ur: 'آیت محفوظ کریں', id: 'Simpan ayat' },
  qa_unsave:     { ar: 'إزالة الآية', en: 'Remove verse', tr: 'Ayeti kaldır', ur: 'آیت ہٹائیں', id: 'Hapus ayat' },
  qa_read:       { ar: 'قراءة الآية', en: 'Recite verse', tr: 'Ayeti oku', ur: 'آیت پڑھیں', id: 'Baca ayat' },

  // ── الأذكار ──
  ad_sub:        { ar: 'حصِّنْ يومك بالأذكار', en: 'Fortify your day with adhkar', tr: 'Gününü zikirlerle güçlendir', ur: 'اپنا دن اذکار سے محفوظ کریں', id: 'Perkuat harimu dengan zikir' },
  ad_count:      { ar: '{n} ذكرًا', en: '{n} adhkar', tr: '{n} zikir', ur: '{n} اذکار', id: '{n} zikir' },
  ad_times:      { ar: 'المرّة {c} من {n}', en: '{c} of {n}', tr: '{c} / {n}', ur: '{c} از {n}', id: '{c} dari {n}' },
  ad_done:       { ar: 'تمّ بحمد الله', en: 'Completed, praise be to Allah', tr: 'Tamamlandı, elhamdülillah', ur: 'مکمل ہوا، الحمد للہ', id: 'Selesai, alhamdulillah' },
  ad_repeat:     { ar: 'كرّر', en: 'Repeat', tr: 'Tekrarla', ur: 'دہرائیں', id: 'Ulangi' },
  ad_reset:      { ar: 'إعادة', en: 'Reset', tr: 'Sıfırla', ur: 'دوبارہ', id: 'Atur ulang' },
  ad_search:     { ar: 'ابحثْ في الأذكار…', en: 'Search adhkar…', tr: 'Zikirlerde ara…', ur: 'اذکار میں تلاش…', id: 'Cari zikir…' },
  ad_done_s:     { ar: 'تمّ', en: 'Done', tr: 'Bitti', ur: 'مکمل', id: 'Selesai' },
  ad_tap:        { ar: 'انقُرِ البطاقةَ مع كلِّ تكرار', en: 'Tap the card with each repetition', tr: 'Her tekrarda karta dokun', ur: 'ہر بار دہرانے پر کارڈ دبائیں', id: 'Ketuk kartu setiap pengulangan' },
  ad_one:        { ar: '{n} ذِكر', en: '{n} adhkar', tr: '{n} zikir', ur: '{n} اذکار', id: '{n} zikir' },

  // ── البذور / البستان ──
  sd_sub:        { ar: 'ازرع عادةً صالحة وارعَها', en: 'Plant a good habit and tend it', tr: 'İyi bir alışkanlık ek ve büyüt', ur: 'اچھی عادت بوئیں اور پالیں', id: 'Tanam kebiasaan baik dan rawat' },
  sd_empty:      { ar: 'لم تزرع بذرةً بعد', en: 'You haven’t planted a seed yet', tr: 'Henüz tohum ekmedin', ur: 'ابھی کوئی بیج نہیں بویا', id: 'Belum menanam benih' },
  sd_empty_sub:  { ar: 'ابدأ بذرتك الأولى نحو عادةٍ راسخة', en: 'Start your first seed toward a lasting habit', tr: 'Kalıcı bir alışkanlık için ilk tohumunu ek', ur: 'مستقل عادت کے لیے پہلا بیج بوئیں', id: 'Mulai benih pertamamu menuju kebiasaan' },
  sd_plant:      { ar: 'ازرع بذرة', en: 'Plant a seed', tr: 'Tohum ek', ur: 'بیج بوئیں', id: 'Tanam benih' },
  sd_leaves:     { ar: '{n} ورقة', en: '{n} leaves', tr: '{n} yaprak', ur: '{n} پتے', id: '{n} daun' },
  unit_leaf:     { ar: 'ورقة', en: 'leaves', tr: 'yaprak', ur: 'پتے', id: 'daun' },
  adhan_at:      { ar: 'الأذان {t}', en: 'Adhan {t}', tr: 'Ezan {t}', ur: 'اذان {t}', id: 'Azan {t}' },
  sd_garden_sub: { ar: 'ازرعْ ما تريد تطويره في نفسك — وراقِبه يُثمِر', en: 'Plant what you want to grow in yourself — and watch it bear fruit', tr: 'Kendinde geliştirmek istediğini ek — meyve verişini izle', ur: 'جو خود میں نکھارنا چاہیں بوئیں — اور پھل لگتا دیکھیں', id: 'Tanam yang ingin kamu kembangkan — dan lihat ia berbuah' },
  sd_plant_new:  { ar: 'ازرعْ بذرةً جديدة', en: 'Plant a new seed', tr: 'Yeni bir tohum ek', ur: 'نیا بیج بوئیں', id: 'Tanam benih baru' },
  sd_your_garden:{ ar: 'بستانك', en: 'Your garden', tr: 'Bahçen', ur: 'آپ کا باغ', id: 'Tamanmu' },
  sd_empty_t:    { ar: 'بستانك فارغ — ابدأ بزرع أوّل بذرة', en: 'Your garden is empty — plant your first seed', tr: 'Bahçen boş — ilk tohumunu ek', ur: 'آپ کا باغ خالی ہے — پہلا بیج بوئیں', id: 'Tamanmu kosong — tanam benih pertamamu' },
  sd_empty_d:    { ar: 'اكتب ما تريد تطويره في نفسك، ويصوغ لك أفنان جدولاً متدرّجاً تنمو معه شجرتك. كل ما تزرعه يُحفظ هنا.', en: 'Write what you want to develop, and Afnan crafts a gradual plan your tree grows with. Everything you plant is saved here.', tr: 'Geliştirmek istediğini yaz, Afnan ağacının büyüyeceği kademeli bir plan hazırlasın. Ektiğin her şey burada saklanır.', ur: 'جو نکھارنا چاہیں لکھیں، افنان ایک تدریجی منصوبہ بناتا ہے جس کے ساتھ آپ کا درخت بڑھتا ہے۔ جو بوئیں یہاں محفوظ رہتا ہے۔', id: 'Tulis yang ingin kamu kembangkan, dan Afnan menyusun rencana bertahap untuk pohonmu. Semua yang kamu tanam tersimpan di sini.' },
  sd_note:       { ar: 'كل بذرةٍ تبدأ صغيرة. مع كل إنجازٍ في جدولها تكبر شجرتها — والثمرةُ تبقى وإن تعثّرت يوماً.', en: 'Every seed starts small. With each step done, its tree grows — and the fruit remains even if you stumble one day.', tr: 'Her tohum küçük başlar. Her adımla ağacı büyür — bir gün aksasan bile meyve kalır.', ur: 'ہر بیج چھوٹا شروع ہوتا ہے۔ ہر قدم کے ساتھ درخت بڑھتا ہے — اور پھل باقی رہتا ہے چاہے کسی دن لغزش ہو۔', id: 'Setiap benih mulai kecil. Tiap langkah selesai, pohonnya tumbuh — buahnya tetap meski kau tersandung suatu hari.' },
};

// ── أسماء السور بالحروف اللاتينية (للإنجليزية/التركية/الإندونيسية) ──
// الأوردية تستعمل الاسم العربي (نفس الرسم)، والعربية اسمها الأصلي
const SURAH_LATIN = [
  'Al-Fatihah','Al-Baqarah','Aali Imran','An-Nisa','Al-Maidah','Al-Anam','Al-Araf','Al-Anfal','At-Tawbah','Yunus',
  'Hud','Yusuf','Ar-Rad','Ibrahim','Al-Hijr','An-Nahl','Al-Isra','Al-Kahf','Maryam','Ta-Ha',
  'Al-Anbiya','Al-Hajj','Al-Muminun','An-Nur','Al-Furqan','Ash-Shuara','An-Naml','Al-Qasas','Al-Ankabut','Ar-Rum',
  'Luqman','As-Sajdah','Al-Ahzab','Saba','Fatir','Ya-Sin','As-Saffat','Sad','Az-Zumar','Ghafir',
  'Fussilat','Ash-Shura','Az-Zukhruf','Ad-Dukhan','Al-Jathiyah','Al-Ahqaf','Muhammad','Al-Fath','Al-Hujurat','Qaf',
  'Adh-Dhariyat','At-Tur','An-Najm','Al-Qamar','Ar-Rahman','Al-Waqiah','Al-Hadid','Al-Mujadilah','Al-Hashr','Al-Mumtahanah',
  'As-Saff','Al-Jumuah','Al-Munafiqun','At-Taghabun','At-Talaq','At-Tahrim','Al-Mulk','Al-Qalam','Al-Haqqah','Al-Maarij',
  'Nuh','Al-Jinn','Al-Muzzammil','Al-Muddaththir','Al-Qiyamah','Al-Insan','Al-Mursalat','An-Naba','An-Naziat','Abasa',
  'At-Takwir','Al-Infitar','Al-Mutaffifin','Al-Inshiqaq','Al-Buruj','At-Tariq','Al-Ala','Al-Ghashiyah','Al-Fajr','Al-Balad',
  'Ash-Shams','Al-Layl','Ad-Duha','Ash-Sharh','At-Tin','Al-Alaq','Al-Qadr','Al-Bayyinah','Az-Zalzalah','Al-Adiyat',
  'Al-Qariah','At-Takathur','Al-Asr','Al-Humazah','Al-Fil','Quraysh','Al-Maun','Al-Kawthar','Al-Kafirun','An-Nasr',
  'Al-Masad','Al-Ikhlas','Al-Falaq','An-Nas',
];
// الاسم المعروض حسب اللغة — العربية والأوردية بالاسم العربيّ، والبقية باللاتينية
function surahName(n, arabicName) {
  const L = window.AFN_LANG;
  if (L === 'ar' || L === 'ur') return arabicName;
  return SURAH_LATIN[n - 1] || arabicName;
}
window.surahName = surahName;
window.SURAH_LATIN = SURAH_LATIN;
// نوع السورة (مكية/مدنية)
function surahType(arType) {
  const makki = arType === 'مكية';
  return t(makki ? 'q_makki' : 'q_madani');
}
window.surahType = surahType;

// ── أسماء أقسام الأذكار حسب اللغة ──
const ADHKAR_CAT_NAMES = {
  sabah:     { en: 'Morning Adhkar',          tr: 'Sabah Zikirleri',     ur: 'صبح کے اذکار',     id: 'Zikir Pagi' },
  masa:      { en: 'Evening Adhkar',          tr: 'Akşam Zikirleri',     ur: 'شام کے اذکار',     id: 'Zikir Petang' },
  isteyqaz:  { en: 'Waking Adhkar',           tr: 'Uyanış Zikirleri',    ur: 'بیداری کے اذکار',  id: 'Zikir Bangun Tidur' },
  noom:      { en: 'Sleep Adhkar',            tr: 'Uyku Zikirleri',      ur: 'سونے کے اذکار',    id: 'Zikir Tidur' },
  wudu:      { en: 'Wudu Adhkar',             tr: 'Abdest Zikirleri',    ur: 'وضو کے اذکار',     id: 'Zikir Wudu' },
  salah:     { en: 'Prayer Adhkar',           tr: 'Namaz Zikirleri',     ur: 'نماز کے اذکار',    id: 'Zikir Salat' },
  masjed:    { en: 'Mosque Adhkar',           tr: 'Cami Zikirleri',      ur: 'مسجد کے اذکار',    id: 'Zikir Masjid' },
  ta3am:     { en: 'Food Adhkar',             tr: 'Yemek Zikirleri',     ur: 'کھانے کے اذکار',   id: 'Zikir Makan' },
  safar:     { en: 'Travel Adhkar',           tr: 'Yolculuk Zikirleri',  ur: 'سفر کے اذکار',     id: 'Zikir Safar' },
  haj:       { en: 'Hajj & Umrah',            tr: 'Hac ve Umre',         ur: 'حج و عمرہ',        id: 'Haji & Umrah' },
  nabaweyya: { en: 'Prophetic Supplications', tr: 'Nebevî Dualar',       ur: 'نبوی دعائیں',      id: 'Doa Nabawi' },
  quraniyya: { en: 'Quranic Supplications',   tr: "Kur'anî Dualar",      ur: 'قرآنی دعائیں',     id: 'Doa Qurani' },
  jawamie:   { en: 'Comprehensive Duas',      tr: 'Câmi Dualar',         ur: 'جامع دعائیں',      id: "Doa Jami'" },
  fadl:      { en: 'Virtue of Dhikr',         tr: 'Zikrin Fazileti',     ur: 'ذکر کی فضیلت',     id: 'Keutamaan Zikir' },
  tasabeeh:  { en: 'Tasbihat',                tr: 'Tesbihler',           ur: 'تسبیحات',          id: 'Tasbih' },
  motafareqa:{ en: 'Miscellaneous Adhkar',    tr: 'Çeşitli Zikirler',    ur: 'متفرق اذکار',      id: 'Zikir Lainnya' },
};
function adhkarCatName(key, arabicTitle) {
  const L = window.AFN_LANG;
  if (L === 'ar' || !ADHKAR_CAT_NAMES[key] || !ADHKAR_CAT_NAMES[key][L]) return arabicTitle;
  return ADHKAR_CAT_NAMES[key][L];
}
window.adhkarCatName = adhkarCatName;

function t(key) {
  const e = STR[key];
  if (!e) return key;
  return e[window.AFN_LANG] != null ? e[window.AFN_LANG] : e.ar;
}
window.t = t;

// نصّ بقوالب {x}
function tf(key, vals) {
  let s = t(key);
  if (vals) for (const k in vals) s = s.split('{' + k + '}').join(vals[k]);
  return s;
}
window.tf = tf;
