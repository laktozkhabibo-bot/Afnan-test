// content_hadith_detail_i18n.jsx — ترجمة الدرجة + الراوي + التخريج لكلّ اللغات
// (الشرح في ملفٍّ منفصل: content_hadith_sharh_i18n.jsx)

// ── الدرجة ──
window.afnRegTr({
  'متفق عليه · صحيح': { en: 'Agreed upon · Sahih', tr: 'Müttefekun aleyh · Sahih', ur: 'متفق علیہ · صحیح', id: 'Muttafaq ‘alaih · Sahih' },
  'رواه مسلم · صحيح': { en: 'Narrated by Muslim · Sahih', tr: 'Müslim rivayet etti · Sahih', ur: 'مسلم نے روایت کیا · صحیح', id: 'Diriwayatkan Muslim · Sahih' },
  'رواه البخاري · صحيح': { en: 'Narrated by al-Bukhari · Sahih', tr: 'Buhârî rivayet etti · Sahih', ur: 'بخاری نے روایت کیا · صحیح', id: 'Diriwayatkan al-Bukhari · Sahih' },
  'رواه الترمذي · حسن': { en: 'Narrated by at-Tirmidhi · Hasan', tr: 'Tirmizî rivayet etti · Hasen', ur: 'ترمذی نے روایت کیا · حسن', id: 'Diriwayatkan at-Tirmidzi · Hasan' },
  'رواه الترمذي · حسن صحيح': { en: 'Narrated by at-Tirmidhi · Hasan Sahih', tr: 'Tirmizî · Hasen Sahih', ur: 'ترمذی · حسن صحیح', id: 'at-Tirmidzi · Hasan Sahih' },
  'رواه ابن ماجه · حسن': { en: 'Narrated by Ibn Majah · Hasan', tr: 'İbn Mâce · Hasen', ur: 'ابن ماجہ · حسن', id: 'Ibnu Majah · Hasan' },
  'حديثٌ حسن': { en: 'A Hasan (good) hadith', tr: 'Hasen hadis', ur: 'حدیث حسن', id: 'Hadis hasan' },
  'رواه أبو داود والترمذي · صحيح': { en: 'Narrated by Abu Dawud & at-Tirmidhi · Sahih', tr: 'Ebû Dâvûd ve Tirmizî · Sahih', ur: 'ابو داؤد و ترمذی · صحیح', id: 'Abu Dawud & at-Tirmidzi · Sahih' },
  'رواه أبو داود والترمذي · حسن': { en: 'Narrated by Abu Dawud & at-Tirmidhi · Hasan', tr: 'Ebû Dâvûd ve Tirmizî · Hasen', ur: 'ابو داؤد و ترمذی · حسن', id: 'Abu Dawud & at-Tirmidzi · Hasan' },
  'رواه الترمذي والنسائي · حسن صحيح': { en: 'Narrated by at-Tirmidhi & an-Nasa’i · Hasan Sahih', tr: 'Tirmizî ve Nesâî · Hasen Sahih', ur: 'ترمذی و نسائی · حسن صحیح', id: 'at-Tirmidzi & an-Nasa’i · Hasan Sahih' },
});

// ── الراوي (أسماء الصحابة) ──
window.afnRegTr({
  'عمر بن الخطّاب رضي الله عنه': { en: 'Umar ibn al-Khattab (may Allah be pleased with him)', tr: 'Ömer b. Hattâb (Allah ondan razı olsun)', ur: 'عمر بن الخطاب رضی اللہ عنہ', id: 'Umar bin al-Khattab (semoga Allah meridhainya)' },
  'أبو هريرة رضي الله عنه': { en: 'Abu Hurayrah (may Allah be pleased with him)', tr: 'Ebû Hüreyre (Allah ondan razı olsun)', ur: 'ابو ہریرہ رضی اللہ عنہ', id: 'Abu Hurairah (semoga Allah meridhainya)' },
  'تميم الداريّ رضي الله عنه': { en: 'Tamim ad-Dari (may Allah be pleased with him)', tr: 'Temîm ed-Dârî (Allah ondan razı olsun)', ur: 'تمیم الداری رضی اللہ عنہ', id: 'Tamim ad-Dari (semoga Allah meridhainya)' },
  'عبد الله بن عمرو بن العاص رضي الله عنهما': { en: 'Abdullah ibn ‘Amr ibn al-‘As (may Allah be pleased with them)', tr: 'Abdullah b. Amr b. Âs (Allah onlardan razı olsun)', ur: 'عبد اللہ بن عمرو بن العاص رضی اللہ عنہما', id: 'Abdullah bin ‘Amr bin al-‘Ash (semoga Allah meridhai keduanya)' },
  'أنس بن مالك رضي الله عنه': { en: 'Anas ibn Malik (may Allah be pleased with him)', tr: 'Enes b. Mâlik (Allah ondan razı olsun)', ur: 'انس بن مالک رضی اللہ عنہ', id: 'Anas bin Malik (semoga Allah meridhainya)' },
  'أبو ذرٍّ ومعاذ بن جبل رضي الله عنهما': { en: 'Abu Dharr & Mu‘adh ibn Jabal (may Allah be pleased with them)', tr: 'Ebû Zer ve Muâz b. Cebel (Allah onlardan razı olsun)', ur: 'ابو ذر و معاذ بن جبل رضی اللہ عنہما', id: 'Abu Dzar & Mu‘adz bin Jabal (semoga Allah meridhai keduanya)' },
  'جرير بن عبد الله البَجَليّ رضي الله عنه': { en: 'Jarir ibn Abdullah al-Bajali (may Allah be pleased with him)', tr: 'Cerîr b. Abdullah el-Becelî (Allah ondan razı olsun)', ur: 'جریر بن عبد اللہ البجلی رضی اللہ عنہ', id: 'Jarir bin Abdullah al-Bajali (semoga Allah meridhainya)' },
  'أبو ذرٍّ الغفاريّ رضي الله عنه': { en: 'Abu Dharr al-Ghifari (may Allah be pleased with him)', tr: 'Ebû Zer el-Gıfârî (Allah ondan razı olsun)', ur: 'ابو ذر الغفاری رضی اللہ عنہ', id: 'Abu Dzar al-Ghifari (semoga Allah meridhainya)' },
  'عائشة رضي الله عنها': { en: 'Aishah (may Allah be pleased with her)', tr: 'Âişe (Allah ondan razı olsun)', ur: 'عائشہ رضی اللہ عنہا', id: 'Aisyah (semoga Allah meridhainya)' },
  'أبو مسعودٍ الأنصاريّ رضي الله عنه': { en: 'Abu Mas‘ud al-Ansari (may Allah be pleased with him)', tr: 'Ebû Mes‘ûd el-Ensârî (Allah ondan razı olsun)', ur: 'ابو مسعود الانصاری رضی اللہ عنہ', id: 'Abu Mas‘ud al-Anshari (semoga Allah meridhainya)' },
  'عثمان بن عفّان رضي الله عنه': { en: 'Uthman ibn ‘Affan (may Allah be pleased with him)', tr: 'Osman b. Affân (Allah ondan razı olsun)', ur: 'عثمان بن عفان رضی اللہ عنہ', id: 'Utsman bin ‘Affan (semoga Allah meridhainya)' },
  'أبو مالكٍ الأشعريّ رضي الله عنه': { en: 'Abu Malik al-Ash‘ari (may Allah be pleased with him)', tr: 'Ebû Mâlik el-Eş‘arî (Allah ondan razı olsun)', ur: 'ابو مالک الاشعری رضی اللہ عنہ', id: 'Abu Malik al-Asy‘ari (semoga Allah meridhainya)' },
  'عديّ بن حاتمٍ رضي الله عنه': { en: 'Adi ibn Hatim (may Allah be pleased with him)', tr: 'Adî b. Hâtim (Allah ondan razı olsun)', ur: 'عدی بن حاتم رضی اللہ عنہ', id: 'Adi bin Hatim (semoga Allah meridhainya)' },
  'شدّاد بن أوسٍ رضي الله عنه': { en: 'Shaddad ibn Aws (may Allah be pleased with him)', tr: 'Şeddâd b. Evs (Allah ondan razı olsun)', ur: 'شداد بن اوس رضی اللہ عنہ', id: 'Syaddad bin Aus (semoga Allah meridhainya)' },
  'النوّاس بن سمعانَ رضي الله عنه': { en: 'An-Nawwas ibn Sam‘an (may Allah be pleased with him)', tr: 'Nevvâs b. Sem‘ân (Allah ondan razı olsun)', ur: 'النواس بن سمعان رضی اللہ عنہ', id: 'An-Nawwas bin Sam‘an (semoga Allah meridhainya)' },
  'عمران بن حُصينٍ رضي الله عنه': { en: 'Imran ibn Husayn (may Allah be pleased with him)', tr: 'İmrân b. Husayn (Allah ondan razı olsun)', ur: 'عمران بن حصین رضی اللہ عنہ', id: 'Imran bin Hushain (semoga Allah meridhainya)' },
  'جابر بن عبد الله رضي الله عنهما': { en: 'Jabir ibn Abdullah (may Allah be pleased with them)', tr: 'Câbir b. Abdullah (Allah onlardan razı olsun)', ur: 'جابر بن عبد اللہ رضی اللہ عنہما', id: 'Jabir bin Abdullah (semoga Allah meridhai keduanya)' },
  'سهل بن سعدٍ الساعديّ رضي الله عنه': { en: 'Sahl ibn Sa‘d as-Sa‘idi (may Allah be pleased with him)', tr: 'Sehl b. Sa‘d es-Sâidî (Allah ondan razı olsun)', ur: 'سہل بن سعد الساعدی رضی اللہ عنہ', id: 'Sahl bin Sa‘d as-Sa‘idi (semoga Allah meridhainya)' },
  'معاذ بن جبلٍ رضي الله عنه': { en: 'Mu‘adh ibn Jabal (may Allah be pleased with him)', tr: 'Muâz b. Cebel (Allah ondan razı olsun)', ur: 'معاذ بن جبل رضی اللہ عنہ', id: 'Mu‘adz bin Jabal (semoga Allah meridhainya)' },
  'الحسن بن عليّ بن أبي طالب رضي الله عنهما': { en: 'Al-Hasan ibn Ali ibn Abi Talib (may Allah be pleased with them)', tr: 'Hasan b. Ali b. Ebî Tâlib (Allah onlardan razı olsun)', ur: 'الحسن بن علی بن ابی طالب رضی اللہ عنہما', id: 'Al-Hasan bin Ali bin Abi Thalib (semoga Allah meridhai keduanya)' },
  'عبد الله بن مسعودٍ رضي الله عنه': { en: 'Abdullah ibn Mas‘ud (may Allah be pleased with him)', tr: 'Abdullah b. Mes‘ûd (Allah ondan razı olsun)', ur: 'عبد اللہ بن مسعود رضی اللہ عنہ', id: 'Abdullah bin Mas‘ud (semoga Allah meridhainya)' },
  'عبد الله بن عمر رضي الله عنهما': { en: 'Abdullah ibn Umar (may Allah be pleased with them)', tr: 'Abdullah b. Ömer (Allah onlardan razı olsun)', ur: 'عبد اللہ بن عمر رضی اللہ عنہما', id: 'Abdullah bin Umar (semoga Allah meridhai keduanya)' },
  'أنس بن مالكٍ رضي الله عنه': { en: 'Anas ibn Malik (may Allah be pleased with him)', tr: 'Enes b. Mâlik (Allah ondan razı olsun)', ur: 'انس بن مالک رضی اللہ عنہ', id: 'Anas bin Malik (semoga Allah meridhainya)' },
});

// ── التخريج ──
window.afnRegTr({
  'أخرجه البخاريُّ ومسلمٌ في صحيحيهما، وهو أوّلُ حديثٍ في صحيح البخاري.': { en: 'Reported by al-Bukhari and Muslim in their Sahihs; it is the first hadith in Sahih al-Bukhari.', tr: 'Buhârî ve Müslim Sahîh’lerinde rivayet etti; Sahîh-i Buhârî’nin ilk hadisidir.', ur: 'بخاری و مسلم نے اپنی صحیحین میں روایت کیا، اور یہ صحیح بخاری کی پہلی حدیث ہے۔', id: 'Diriwayatkan al-Bukhari dan Muslim dalam Shahih keduanya; ia adalah hadis pertama dalam Shahih al-Bukhari.' },
  'أخرجه البخاريُّ ومسلمٌ في صحيحيهما.': { en: 'Reported by al-Bukhari and Muslim in their Sahihs.', tr: 'Buhârî ve Müslim Sahîh’lerinde rivayet etti.', ur: 'بخاری و مسلم نے اپنی صحیحین میں روایت کیا۔', id: 'Diriwayatkan al-Bukhari dan Muslim dalam Shahih keduanya.' },
  'أخرجه مسلمٌ في صحيحه.': { en: 'Reported by Muslim in his Sahih.', tr: 'Müslim Sahîh’inde rivayet etti.', ur: 'مسلم نے اپنی صحیح میں روایت کیا۔', id: 'Diriwayatkan Muslim dalam Shahih-nya.' },
  'أخرجه البخاريُّ في صحيحه.': { en: 'Reported by al-Bukhari in his Sahih.', tr: 'Buhârî Sahîh’inde rivayet etti.', ur: 'بخاری نے اپنی صحیح میں روایت کیا۔', id: 'Diriwayatkan al-Bukhari dalam Shahih-nya.' },
  'أخرجه الترمذيُّ في سننه وقال: حديثٌ حسن.': { en: 'Reported by at-Tirmidhi in his Sunan, who said: a Hasan hadith.', tr: 'Tirmizî Sünen’inde rivayet etti ve “hasen hadis” dedi.', ur: 'ترمذی نے اپنی سنن میں روایت کیا اور فرمایا: حدیث حسن ہے۔', id: 'Diriwayatkan at-Tirmidzi dalam Sunan-nya, ia berkata: hadis hasan.' },
  'أخرجه الترمذيُّ في سننه.': { en: 'Reported by at-Tirmidhi in his Sunan.', tr: 'Tirmizî Sünen’inde rivayet etti.', ur: 'ترمذی نے اپنی سنن میں روایت کیا۔', id: 'Diriwayatkan at-Tirmidzi dalam Sunan-nya.' },
  'أخرجه الترمذيُّ في سننه وحسَّنه.': { en: 'Reported by at-Tirmidhi in his Sunan, who graded it Hasan.', tr: 'Tirmizî Sünen’inde rivayet etti ve hasen saydı.', ur: 'ترمذی نے اپنی سنن میں روایت کیا اور اسے حسن قرار دیا۔', id: 'Diriwayatkan at-Tirmidzi dalam Sunan-nya dan menilainya hasan.' },
  'أخرجه الترمذيُّ في سننه وقال: حسنٌ صحيح.': { en: 'Reported by at-Tirmidhi in his Sunan, who said: Hasan Sahih.', tr: 'Tirmizî Sünen’inde rivayet etti ve “hasen sahih” dedi.', ur: 'ترمذی نے اپنی سنن میں روایت کیا اور فرمایا: حسن صحیح۔', id: 'Diriwayatkan at-Tirmidzi dalam Sunan-nya, ia berkata: Hasan Sahih.' },
  'أخرجه ابن ماجه في سننه بإسنادٍ حسن.': { en: 'Reported by Ibn Majah in his Sunan with a Hasan chain.', tr: 'İbn Mâce Sünen’inde hasen bir isnadla rivayet etti.', ur: 'ابن ماجہ نے اپنی سنن میں حسن سند کے ساتھ روایت کیا۔', id: 'Diriwayatkan Ibnu Majah dalam Sunan-nya dengan sanad hasan.' },
  'أخرجه مسلمٌ في صحيحه ضمنَ حديثِ "لا تدخلون الجنّةَ حتى تؤمنوا".': { en: 'Reported by Muslim within the hadith: “You will not enter Paradise until you believe…”.', tr: 'Müslim, “İman etmedikçe cennete giremezsiniz…” hadisi içinde rivayet etti.', ur: 'مسلم نے اس حدیث کے ضمن میں روایت کیا: «تم جنت میں داخل نہ ہو گے جب تک ایمان نہ لاؤ…»۔', id: 'Diriwayatkan Muslim dalam hadis: “Kalian tidak akan masuk surga hingga beriman…”.' },
  'أخرجه أبو داود والترمذيُّ في سننيهما بإسنادٍ صحيح.': { en: 'Reported by Abu Dawud and at-Tirmidhi with a Sahih chain.', tr: 'Ebû Dâvûd ve Tirmizî Sünen’lerinde sahih bir isnadla rivayet etti.', ur: 'ابو داؤد و ترمذی نے اپنی سنن میں صحیح سند کے ساتھ روایت کیا۔', id: 'Diriwayatkan Abu Dawud dan at-Tirmidzi dengan sanad sahih.' },
  'أخرجه الترمذيُّ والنسائيُّ، وقال الترمذي: حسنٌ صحيح.': { en: 'Reported by at-Tirmidhi and an-Nasa’i; at-Tirmidhi said: Hasan Sahih.', tr: 'Tirmizî ve Nesâî rivayet etti; Tirmizî “hasen sahih” dedi.', ur: 'ترمذی و نسائی نے روایت کیا، اور ترمذی نے فرمایا: حسن صحیح۔', id: 'Diriwayatkan at-Tirmidzi dan an-Nasa’i; at-Tirmidzi berkata: Hasan Sahih.' },
  'أخرجه أبو داود والترمذيُّ وابن ماجه في سننهم.': { en: 'Reported by Abu Dawud, at-Tirmidhi and Ibn Majah in their Sunans.', tr: 'Ebû Dâvûd, Tirmizî ve İbn Mâce Sünen’lerinde rivayet etti.', ur: 'ابو داؤد، ترمذی اور ابن ماجہ نے اپنی سنن میں روایت کیا۔', id: 'Diriwayatkan Abu Dawud, at-Tirmidzi dan Ibnu Majah dalam Sunan mereka.' },
  'أخرجه الطبرانيُّ والقُضاعيُّ، وحسَّنه جمعٌ من أهل العلم.': { en: 'Reported by at-Tabarani and al-Quda‘i; a number of scholars graded it Hasan.', tr: 'Taberânî ve Kudâî rivayet etti; bir grup âlim hasen saydı.', ur: 'طبرانی و قضاعی نے روایت کیا، اور اہلِ علم کی ایک جماعت نے اسے حسن قرار دیا۔', id: 'Diriwayatkan ath-Thabarani dan al-Quda‘i; sejumlah ulama menilainya hasan.' },
  'أخرجه الطبرانيُّ والبزّار، وحسَّنه بعضُ أهل العلم.': { en: 'Reported by at-Tabarani and al-Bazzar; some scholars graded it Hasan.', tr: 'Taberânî ve Bezzâr rivayet etti; bazı âlimler hasen saydı.', ur: 'طبرانی و بزار نے روایت کیا، اور بعض اہلِ علم نے اسے حسن قرار دیا۔', id: 'Diriwayatkan ath-Thabarani dan al-Bazzar; sebagian ulama menilainya hasan.' },
  'أخرجه البيهقيُّ والطبرانيُّ، وحسَّنه جماعةٌ من أهل العلم.': { en: 'Reported by al-Bayhaqi and at-Tabarani; a group of scholars graded it Hasan.', tr: 'Beyhakî ve Taberânî rivayet etti; bir grup âlim hasen saydı.', ur: 'بیہقی و طبرانی نے روایت کیا، اور اہلِ علم کی ایک جماعت نے اسے حسن قرار دیا۔', id: 'Diriwayatkan al-Baihaqi dan ath-Thabarani; sekelompok ulama menilainya hasan.' },
});
