// prayer_times.js — مصدر مواقيت موثوق (Aladhan) مع تخزين محلي واحتياط فلكي يعمل دون إنترنت
// نأخذ الأوقات من خدمة Aladhan الرسمية (تطابق التقاويم المحلية لكل دولة)، ونحفظها لليوم
// كي تعمل لاحقاً دون إنترنت؛ وإن تعذّر الاتصال نحسبها فلكياً محلياً.
(function () {
  var CACHE_KEY = 'afnan-times-v2';

  function pad(n) { return String(n).padStart(2, '0'); }
  function parseHM(s) { var m = String(s).match(/(\d{1,2}):(\d{2})/); return m ? (+m[1]) + (+m[2]) / 60 : null; }

  // الطريقة المناسبة للمنطقة → رمز Aladhan
  function methodCode(lat, lng) {
    var k = PrayerCalc.methodFor(lat, lng);
    if (k === 'umm_alqura') return 4;   // أم القرى — مكة المكرمة (السعودية والخليج)
    if (k === 'egyptian')   return 5;   // الهيئة المصرية العامة للمساحة
    return 3;                            // رابطة العالم الإسلامي
  }

  // حساب فلكي محلي (احتياط) — school: 0 الجمهور · 1 حنفي
  function localTimes(lat, lng, date, school) {
    // المنطقة الزمنية: نستعمل منطقة الجهاز عندما يطابق خطّ الطول منطقة الجهاز تقريباً
    // (الحالة الشائعة: مدينة المستخدم)، وإلا نقدّرها من خطّ الطول للمدن البعيدة المختارة يدويّاً.
    var devTz = -date.getTimezoneOffset() / 60;
    var lonTz = Math.round(lng / 15);
    var tz = Math.abs(devTz - lng / 15) > 1.5 ? lonTz : devTz;
    return PrayerCalc.computeTimes(lat, lng, date, null, school === 1 ? 2 : 1, tz);
  }

  function readCache() { try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch (e) { return {}; } }
  function writeCache(c) {
    // لا نُبقي أكثر من ~٤٠ مدخلاً حتى لا تتضخّم الذاكرة
    var keys = Object.keys(c);
    if (keys.length > 40) { var trimmed = {}; keys.slice(-30).forEach(function (k) { trimmed[k] = c[k]; }); c = trimmed; }
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch (e) {}
  }

  // Promise بمواقيت اليوم — من المصدر الموثوق إن توفّر الإنترنت، وإلا حساب فلكي محلي
  function fetchTimes(lat, lng, date, opts) {
    opts = opts || {};
    var method = opts.method != null ? opts.method : methodCode(lat, lng);
    var school = opts.school != null ? opts.school : 0;
    var dkey = pad(date.getDate()) + '-' + pad(date.getMonth() + 1) + '-' + date.getFullYear();
    var ck = dkey + '|' + lat.toFixed(3) + '|' + lng.toFixed(3) + '|' + method + '|' + school;

    var cache = readCache();
    if (cache[ck]) return Promise.resolve({ times: cache[ck], src: 'cache' });

    var url = 'https://api.aladhan.com/v1/timings/' + dkey +
      '?latitude=' + lat + '&longitude=' + lng + '&method=' + method + '&school=' + school;

    return fetch(url).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.data || !j.data.timings) throw new Error('bad response');
      var T = j.data.timings;
      var times = {
        fajr: parseHM(T.Fajr), sunrise: parseHM(T.Sunrise), dhuhr: parseHM(T.Dhuhr),
        asr: parseHM(T.Asr), maghrib: parseHM(T.Maghrib), isha: parseHM(T.Isha),
        methodName: (j.data.meta && j.data.meta.method && j.data.meta.method.name) || ''
      };
      cache[ck] = times; writeCache(cache);
      return { times: times, src: 'api' };
    });
  }

  window.PrayerTimes = { fetchTimes: fetchTimes, methodCode: methodCode, localTimes: localTimes };
})();
