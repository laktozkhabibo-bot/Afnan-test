// prayer_calc.js — حساب فلكي لمواقيت الصلاة + اتجاه القبلة + أقرب مدينة (يعمل دون إنترنت)
// خوارزمية الموقع الشمسي القياسية (praytimes-style)
(function () {
  var KAABA = { lat: 21.422487, lng: 39.826206 };

  var rad = function (d) { return d * Math.PI / 180; };
  var deg = function (r) { return r * 180 / Math.PI; };
  var fixAngle = function (a) { return ((a % 360) + 360) % 360; };
  var fixHour = function (h) { return ((h % 24) + 24) % 24; };

  function julian(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    var A = Math.floor(y / 100);
    var B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }

  // موقع الشمس: الميل + معادلة الزمن
  function sunPos(jd) {
    var D = jd - 2451545.0;
    var g = fixAngle(357.529 + 0.98560028 * D);
    var q = fixAngle(280.459 + 0.98564736 * D);
    var L = fixAngle(q + 1.915 * Math.sin(rad(g)) + 0.020 * Math.sin(rad(2 * g)));
    var e = 23.439 - 0.00000036 * D;
    var RA = deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(L)), Math.cos(rad(L)))) / 15;
    return {
      decl: deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(L)))),
      eqt: q / 15 - fixHour(RA)
    };
  }

  function midDay(jd, t) { return fixHour(12 - sunPos(jd + t / 24).eqt); }

  function sunAngleTime(jd, lat, angle, t, ccw) {
    var d = sunPos(jd + t / 24).decl;
    var noon = midDay(jd, t);
    var cosH = (-Math.sin(rad(angle)) - Math.sin(rad(d)) * Math.sin(rad(lat))) /
               (Math.cos(rad(d)) * Math.cos(rad(lat)));
    if (cosH < -1 || cosH > 1) return NaN;
    var T = deg(Math.acos(cosH)) / 15;
    return noon + (ccw ? -T : T);
  }

  function asrTime(jd, lat, factor, t) {
    var d = sunPos(jd + t / 24).decl;
    var angle = -deg(Math.atan(1 / (factor + Math.tan(rad(Math.abs(lat - d))))));
    return sunAngleTime(jd, lat, angle, t, false);
  }

  // طرق الحساب
  var METHODS = {
    umm_alqura: { name: 'أم القرى',                 fajr: 18.5, ishaMin: 90 },
    egyptian:   { name: 'الهيئة المصرية',            fajr: 19.5, isha: 17.5 },
    mwl:        { name: 'رابطة العالم الإسلامي',     fajr: 18,   isha: 17 },
  };

  // احتياط الزوال فقط (دقيقتان) — تبقى بقيّة الأوقات كما يحسبها المصدر الموثوق دون إضافات
  var IHTIYAT = { fajr: 0, sunrise: 0, dhuhr: 2, asr: 0, maghrib: 0, isha: 0 };

  // اختيار تلقائي للطريقة حسب المنطقة
  function methodFor(lat, lng) {
    if (lat >= 12 && lat <= 32.5 && lng >= 34 && lng <= 60) return 'umm_alqura'; // الجزيرة العربية
    if (lat >= 21 && lat <= 32 && lng >= 24 && lng <= 36)  return 'egyptian';    // مصر والسودان الشمالي
    return 'mwl';
  }

  // يعيد أوقات اليوم بالساعات المحلية العشرية { fajr, sunrise, dhuhr, asr, maghrib, isha }
  function computeTimes(lat, lng, date, methodKey, asrFactor, tzOverride) {
    var aF = asrFactor || 1; // 1 = الجمهور (شافعي/مالكي/حنبلي) · 2 = حنفي
    var method = METHODS[methodKey || methodFor(lat, lng)];
    var jd = julian(date.getFullYear(), date.getMonth() + 1, date.getDate()) - lng / (15 * 24);
    var tz = tzOverride != null ? tzOverride : -date.getTimezoneOffset() / 60;

    var t = { fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, maghrib: 18, isha: 18 };
    // تكرارات إضافية لتقارب أدقّ للقيم الفلكية (دقّة دون الدقيقة)
    for (var i = 0; i < 4; i++) {
      t.fajr    = sunAngleTime(jd, lat, method.fajr, t.fajr, true);
      t.sunrise = sunAngleTime(jd, lat, 0.833, t.sunrise, true);
      t.dhuhr   = midDay(jd, t.dhuhr);
      t.asr     = asrTime(jd, lat, aF, t.asr);
      t.maghrib = sunAngleTime(jd, lat, 0.833, t.maghrib, false);
      t.isha    = method.isha != null
        ? sunAngleTime(jd, lat, method.isha, t.isha, false)
        : t.maghrib + method.ishaMin / 60;
    }

    var out = {};
    for (var k in t) out[k] = fixHour(t[k] + tz - lng / 15 + (IHTIYAT[k] || 0) / 60);
    out.methodName = method.name;
    return out;
  }

  // اتجاه القبلة من الشمال الجغرافي (بالدرجات)
  function qiblaBearing(lat, lng) {
    var f1 = rad(lat), f2 = rad(KAABA.lat), dl = rad(KAABA.lng - lng);
    var y = Math.sin(dl);
    var x = Math.cos(f1) * Math.tan(f2) - Math.sin(f1) * Math.cos(dl);
    return fixAngle(deg(Math.atan2(y, x)));
  }

  // المسافة إلى الكعبة (كم)
  function kaabaDistance(lat, lng) {
    var R = 6371;
    var dLat = rad(KAABA.lat - lat), dLng = rad(KAABA.lng - lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(lat)) * Math.cos(rad(KAABA.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // أقرب مدينة معروفة (احتياطي دون إنترنت)
  var CITIES = [
    ['الرياض', 24.71, 46.68], ['جدة', 21.49, 39.19], ['مكة المكرمة', 21.42, 39.83],
    ['المدينة المنورة', 24.47, 39.61], ['الدمام', 26.43, 50.10], ['أبها', 18.25, 42.51],
    ['تبوك', 28.38, 36.57], ['القاهرة', 30.04, 31.24], ['الإسكندرية', 31.20, 29.92],
    ['أسوان', 24.09, 32.90], ['عمّان', 31.95, 35.93], ['دبي', 25.20, 55.27],
    ['أبوظبي', 24.45, 54.38], ['الدوحة', 25.29, 51.53], ['الكويت', 29.38, 47.99],
    ['المنامة', 26.23, 50.59], ['مسقط', 23.59, 58.41], ['صنعاء', 15.37, 44.19],
    ['بغداد', 33.31, 44.37], ['البصرة', 30.51, 47.78], ['الموصل', 36.34, 43.13],
    ['دمشق', 33.51, 36.29], ['حلب', 36.20, 37.13], ['بيروت', 33.89, 35.50],
    ['القدس', 31.78, 35.23], ['غزة', 31.50, 34.47], ['الخرطوم', 15.50, 32.56],
    ['طرابلس', 32.89, 13.19], ['تونس', 36.81, 10.18], ['الجزائر', 36.75, 3.06],
    ['الدار البيضاء', 33.57, -7.59], ['الرباط', 34.02, -6.84], ['نواكشوط', 18.08, -15.98],
    ['إسطنبول', 41.01, 28.98], ['أنقرة', 39.93, 32.86], ['كوالالمبور', 3.14, 101.69],
    ['جاكرتا', -6.21, 106.85], ['إسلام آباد', 33.68, 73.05], ['لندن', 51.51, -0.13],
    ['باريس', 48.86, 2.35], ['برلين', 52.52, 13.40], ['نيويورك', 40.71, -74.01],
    ['تورونتو', 43.65, -79.38],
  ];
  function nearestCity(lat, lng) {
    var best = CITIES[0], bd = 1e9;
    for (var i = 0; i < CITIES.length; i++) {
      var d = (CITIES[i][1] - lat) * (CITIES[i][1] - lat) +
              (CITIES[i][2] - lng) * (CITIES[i][2] - lng);
      if (d < bd) { bd = d; best = CITIES[i]; }
    }
    return best[0];
  }

  window.PrayerCalc = {
    computeTimes: computeTimes,
    qiblaBearing: qiblaBearing,
    kaabaDistance: kaabaDistance,
    nearestCity: nearestCity,
    methodFor: methodFor,
    METHODS: METHODS,
    KAABA: KAABA,
  };
})();
