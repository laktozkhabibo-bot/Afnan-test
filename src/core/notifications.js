// notifications.js — جدولةُ إشعارات أفنان: الأذان، أذكار الصباح/المساء، الكهف يوم الجمعة، الورد القرآني.
// يعمل عبر Notification API + setTimeout أثناء فتح التطبيق (وعبر Service Worker إن وُجد عند التغليف بـ Capacitor).
// الاهتزاز مرتبطٌ بزرّ "الاهتزاز" في الإعدادات.

(function () {
  const LS = 'afnan-v2';
  const FIRED = 'afnan-notif-fired-v1';   // يمنع تكرار نفس الإشعار في اليوم

  function prefs() {
    try { const s = JSON.parse(localStorage.getItem(LS) || '{}'); return s; } catch (e) { return {}; }
  }
  function todayPrayers() {
    try {
      const t = JSON.parse(localStorage.getItem('afnan-today-v1'));
      if (t && t.day === new Date().toDateString() && t.times) return t.times;  // {fajr,dhuhr,asr,maghrib,isha,sunrise?}
    } catch (e) {}
    return null;
  }
  function firedSet() {
    try { const o = JSON.parse(localStorage.getItem(FIRED) || '{}'); if (o.day !== new Date().toDateString()) return { day: new Date().toDateString(), keys: {} }; return o; }
    catch (e) { return { day: new Date().toDateString(), keys: {} }; }
  }
  function markFired(key) {
    const o = firedSet(); o.keys[key] = 1;
    try { localStorage.setItem(FIRED, JSON.stringify(o)); } catch (e) {}
  }
  function alreadyFired(key) { return !!firedSet().keys[key]; }

  // ── أذونات ──
  let permission = (typeof Notification !== 'undefined') ? Notification.permission : 'denied';
  function requestPermission() {
    if (typeof Notification === 'undefined') return Promise.resolve('unsupported');
    if (Notification.permission === 'granted') { permission = 'granted'; return Promise.resolve('granted'); }
    return Notification.requestPermission().then(p => { permission = p; return p; });
  }

  // ── إطلاق إشعار ──
  function fire(title, body, tag) {
    const p = prefs();
    // الاهتزاز فقط عند تفعيل زرّ الاهتزاز
    const vibrate = (p.prefs && p.prefs.vibrate) ? [120, 60, 120] : undefined;
    if (navigator.vibrate && vibrate) { try { navigator.vibrate(vibrate); } catch (e) {} }
    if (permission !== 'granted' || typeof Notification === 'undefined') return;
    try {
      const opts = { body, tag, dir: 'rtl', lang: 'ar', badge: 'assets/icon/badge.png', icon: 'assets/icon/icon-192.png' };
      if (vibrate) opts.vibrate = vibrate;
      // عبر Service Worker إن وُجد (أفضل على الأجهزة)، وإلا إشعار مباشر
      if (navigator.serviceWorker && navigator.serviceWorker.ready && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(reg => reg.showNotification(title, opts)).catch(() => { new Notification(title, opts); });
      } else {
        new Notification(title, opts);
      }
    } catch (e) {}
  }

  // ── الترجمة (تعتمد على window.t إن وُجد، وإلا العربية) ──
  function L(ar, key) { try { return (window.AFN_LANG && window.AFN_LANG !== 'ar' && window.t) ? window.t(key) : ar; } catch (e) { return ar; } }

  function hhmmToDate(h) { const d = new Date(); d.setHours(Math.floor(h), Math.round((h % 1) * 60), 0, 0); return d; }

  // ── بناء جدول اليوم ──
  // كل عنصر: { key, at: Date, title, body, cond }
  function buildSchedule() {
    const p = prefs();
    const adhan = p.adhanOn || {};
    const pr = p.prefs || {};
    const times = todayPrayers();
    const list = [];
    const now = new Date();

    // 1) الأذان عند دخول كل وقت
    if (times) {
      [['fajr', 'الفجر'], ['dhuhr', 'الظهر'], ['asr', 'العصر'], ['maghrib', 'المغرب'], ['isha', 'العشاء']].forEach(([k, name]) => {
        if (adhan.all && adhan[k] && times[k] != null) {
          list.push({ key: 'adhan-' + k, at: hhmmToDate(times[k]),
            title: '🕌 ' + L('حانَ وقتُ صلاة ' + name, 'pr_' + k),
            body: L('حيَّ على الصلاة، حيَّ على الفلاح', 'st_adhan_sub2') });
        }
      });
    }

    // 2) أذكار الصباح بعد الشروق
    if (pr.adhkar && times) {
      const sunrise = times.sunrise != null ? times.sunrise : (times.fajr != null ? times.fajr + 1.5 : null);
      if (sunrise != null) {
        const at = hhmmToDate(sunrise); at.setMinutes(at.getMinutes() + 20);
        list.push({ key: 'adhkar-morning', at,
          title: '🌅 ' + L('أذكارُ الصباح', 'st_adhkar'),
          body: L('طابَ صباحُك بذكرِ الله — لا تنسَ وردَك من أذكار الصباح', 'st_morn_eve') });
      }
    }

    // 3) أذكار المساء عند أذان المغرب وبعده
    if (pr.adhkar && times && times.maghrib != null) {
      list.push({ key: 'adhkar-evening', at: hhmmToDate(times.maghrib),
        title: '🌇 ' + L('أذكارُ المساء', 'st_adhkar'),
        body: L('حلَّ المساء — اعمُر قلبَك بأذكار المساء', 'st_morn_eve') });
    }

    // 4) سورة الكهف يوم الجمعة
    if (pr.kahf && now.getDay() === 5) {       // 5 = الجمعة
      const at = new Date(); at.setHours(9, 0, 0, 0);
      list.push({ key: 'kahf-friday', at,
        title: '📖 ' + L('سورةُ الكهف', 'st_kahf'),
        body: L('يومُ الجمعة المبارك — لا تنسَ قراءةَ سورة الكهف', 'st_friday') });
    }

    // 5) تذكيرٌ بالورد القرآني (مرّة في اليوم، بعد الظهر)
    if (pr.wird && times && times.dhuhr != null) {
      const at = hhmmToDate(times.dhuhr); at.setMinutes(at.getMinutes() + 30);
      list.push({ key: 'wird-daily', at,
        title: '🍃 ' + L('وِردُ القرآن', 'st_wird'),
        body: L('اجعل للقرآن نصيبًا من يومك — اقرأ وردَك الآن', 'st_wird_sub') });
    }

    return list;
  }

  // ── محرّك الجدولة: يفحص كل 30 ثانية ويُطلق ما حان وقته ولم يُطلَق ──
  let timer = null;
  function tick() {
    const now = Date.now();
    const sched = buildSchedule();
    sched.forEach(item => {
      if (alreadyFired(item.key)) return;
      const t = item.at.getTime();
      // أطلِق إن حان وقته خلال آخر ٤ دقائق (نافذة سماح لمن فتح التطبيق متأخّرًا)
      if (t <= now && now - t < 4 * 60 * 1000) {
        fire(item.title, item.body, item.key);
        markFired(item.key);
      } else if (t <= now) {
        // فات وقته بأكثر من النافذة — علّمه مُطلَقًا دون إزعاج
        markFired(item.key);
      }
    });
  }

  function start() {
    if (timer) return;
    // إن كنّا داخل تطبيق Capacitor، جدوِل إشعارات النظام (تعمل والتطبيق مغلق) ثمّ أعِد المزامنة دوريًّا
    if (nativeLN()) {
      syncNative();
      setInterval(syncNative, 30 * 60 * 1000);   // أعِد الجدولة كل نصف ساعة (لالتقاط مواقيت اليوم الجديدة)
      document.addEventListener('visibilitychange', () => { if (!document.hidden) syncNative(); });
      return;
    }
    tick();
    timer = setInterval(tick, 30 * 1000);
    // أعد الفحص عند العودة للتطبيق
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
  }

  window.AfnanNotify = { requestPermission, start, fire, buildSchedule, syncNative, get permission() { return permission; } };

  // ── جسرٌ للإشعارات الأصليّة عبر Capacitor (تعمل حتى والتطبيق مغلق) ──
  // عند التغليف بـ Capacitor، نجدول إشعارات النظام بدل الاعتماد على setTimeout أثناء فتح التطبيق.
  function nativeLN() {
    try { return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications; } catch (e) { return null; }
  }
  function syncNative() {
    const LN = nativeLN(); if (!LN) return Promise.resolve(false);
    const p = prefs();
    const vibrate = !!(p.prefs && p.prefs.vibrate);
    return LN.requestPermissions().then(() => {
      const sched = buildSchedule().filter(it => it.at.getTime() > Date.now());
      const notifications = sched.map((it, i) => ({
        id: 1000 + i,
        title: it.title,
        body: it.body,
        schedule: { at: it.at, allowWhileIdle: true },
        smallIcon: 'ic_stat_icon',
        // الاهتزاز يتبع زرّ الاهتزاز (وإلا صامت)
        sound: undefined,
      }));
      // أعد الجدولة من الصفر لليوم
      return LN.getPending().then(pend => {
        const ids = (pend && pend.notifications || []).map(n => ({ id: n.id }));
        const clear = ids.length ? LN.cancel({ notifications: ids }) : Promise.resolve();
        return clear.then(() => notifications.length ? LN.schedule({ notifications }) : null);
      });
    }).then(() => true).catch(() => false);
  }

  // ابدأ تلقائيًّا
  if (document.readyState !== 'loading') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
