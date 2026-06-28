# 📦 تصدير أفنان كتطبيق APK (أندرويد) و iOS

تطبيق أفنان جاهزٌ للتغليف كتطبيقٍ أصليٍّ يعمل على **أندرويد و iOS** من نفس الشيفرة، باللوجو الذي اخترناه، ومع الإشعارات الأصليّة (أذان، أذكار، الكهف، الورد) التي تعمل **حتى والتطبيق مغلق**.

نستخدم **Capacitor** من Ionic — وهو الأداة القياسيّة لتغليف تطبيقات الويب إلى تطبيقاتٍ أصليّة. كلُّ الملفات المطلوبة موجودةٌ في المشروع (`package.json`, `capacitor.config.json`, `manifest.webmanifest`, `sw.js`, مجلّد `assets/icon`).

---

## ✅ المتطلّبات (مرّة واحدة)

| للنظام | تحتاج |
|---|---|
| **أندرويد (APK)** | [Android Studio](https://developer.android.com/studio) + JDK 17 (يأتي معه) |
| **iOS** | جهاز **Mac** + [Xcode](https://apps.apple.com/app/xcode/id497799835) + حساب Apple Developer (٩٩$/سنة للنشر على App Store) |
| **كلاهما** | [Node.js 18+](https://nodejs.org) |

> 💡 يمكنك بناء APK لأندرويد من أيِّ نظام (Windows / Mac / Linux). أمّا iOS فيتطلّب **Mac** حصراً (قيدٌ من Apple).

---

## 🚀 الخطوات

### 1) نزّل المشروع
نزّل ملفات المشروع كاملةً (زرّ التنزيل) وفُكّ الضغط، ثمّ افتح الطرفيّة (Terminal) داخل المجلّد.

### 2) ثبّت الأدوات
```bash
npm install
npm install -g @capacitor/cli
```

### 3) جهّز ملفات الويب وأضِف المنصّات
```bash
npm run copy:web        # ينسخ ملفات التطبيق إلى مجلّد www
npx cap add android     # يضيف مشروع أندرويد
npx cap add ios         # يضيف مشروع iOS (على Mac فقط)
```

### 4) فعّل الإشعارات الأصليّة
داخل ملفّ `index.html`، أضِف هذا السطر قبل `</body>` ليُحمّل جسرَ Capacitor (يتجاهله المتصفّح العادي):
```html
<script src="capacitor.js"></script>
```
ثمّ ثبّت إضافة الإشعارات (مثبّتةٌ مسبقاً في `package.json`):
```bash
npm install @capacitor/local-notifications @capacitor/splash-screen
npx cap sync
```
> التطبيق يكتشف Capacitor تلقائيّاً ويجدول إشعارات النظام (أذان/أذكار/كهف/ورد) عبر الكود الموجود في `src/core/notifications.js` — لا حاجة لأيّ تعديلٍ إضافيّ.

### 5) ضع الأيقونة (اللوجو)
الأيقونات جاهزةٌ في `assets/icon/`. لتوليد أيقونات النظام بالأحجام كلّها تلقائيّاً:
```bash
npm install -g @capacitor/assets
npx capacitor-assets generate --iconBackgroundColor '#0C4636' --iconBackgroundColorDark '#0C4636'
```
(ضع `assets/icon/icon-512.png` في مجلّد `resources/icon.png` إن طلبت الأداة ذلك.)

### 6) ابنِ التطبيق

**أندرويد → APK:**
```bash
npm run sync
npx cap open android      # يفتح Android Studio
```
في Android Studio:  `Build ▸ Build Bundle(s)/APK(s) ▸ Build APK(s)` → ستجد ملفّ `app-debug.apk` جاهزاً للتثبيت على أيِّ هاتف أندرويد.
للنشر على Google Play: `Build ▸ Generate Signed Bundle/APK` ثمّ اتبع خطوات التوقيع.

**iOS → تطبيق:**
```bash
npm run sync
npx cap open ios          # يفتح Xcode
```
في Xcode: اختر جهازك أو محاكياً، ثمّ اضغط **Run ▶**. للنشر على App Store: `Product ▸ Archive`.

---

## 🔔 ملاحظات عن الإشعارات
- عند أوّل تشغيل سيطلب التطبيق إذن الإشعارات — يجب قبوله.
- الإشعارات تُجدوَل من مواقيت الصلاة المحفوظة لموقعك؛ افتح شاشة «صلاتي» مرّةً ليُحفظ جدول اليوم.
- **الاهتزاز**: يأتي الإشعار باهتزازٍ فقط عند تفعيل زرّ «الاهتزاز» في الإعدادات، وإلّا فبلا اهتزاز.
- على الويب (دون تغليف) تعمل الإشعارات أثناء فتح التطبيق فقط؛ أمّا في تطبيق APK/iOS فتعمل في الخلفيّة وحتى والتطبيق مغلق.

---

## 🌐 بديلٌ سريع: تثبيت كـ PWA (دون متجر)
التطبيق مهيّأٌ كـ **Progressive Web App**: ارفع الملفّات على أيِّ استضافة https، وافتحها على الهاتف، ثمّ:
- **أندرويد (Chrome):** القائمة ▸ «تثبيت التطبيق».
- **iOS (Safari):** زرّ المشاركة ▸ «إضافة إلى الشاشة الرئيسيّة».
سيظهر بأيقونته ويعمل دون إنترنت — لكنّ الإشعارات في الخلفيّة محدودةٌ على iOS، لذا للتجربة الكاملة استخدم تغليف Capacitor أعلاه.
