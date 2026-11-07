# إجراءات المتابعة الأمنية الإلزامية لصاحب الموقع

تم تنفيذ إغلاق المسارات الإدارية وحذف المفتاح المكشوف من الكود المصدري وإلغاء مسارات الـ seed العامة.
نظراً لأن المفاتيح السابقة تم دفعها سابقاً إلى مستودع Git العام، يجب على مالك المشروع تنفيذ الخطوات التالية لحماية بنية Sanity وبيئة الإنتاج بالكامل:

---

### 1. تجديد رمز الكتابة في Sanity (Rotate API Write Token)
1. افتح لوحة تحكم [Sanity Management](https://www.sanity.io/manage).
2. اختر المشروع: `10ol7pkg` (Mnaveth ALTourid).
3. انتقل إلى تبويب **API** ⟵ **Tokens**.
4. احذف الرمز القديم (Revoke old write tokens).
5. أنشئ رمزا جديداً للصلاحيات (Write Token) وسمّه مثلاً `Vercel Production Write Token 2026`.
6. قم بتحديث متغير البيئة `SANITY_API_WRITE_TOKEN` في لوحة تحكم **Vercel** (Settings ⟵ Environment Variables).

---

### 2. تحويل المستودع إلى خاص (Make Repository Private)
1. افتح صفحة المستودع على GitHub: [https://github.com/shoaibhajj/manaveth_al-tourid](https://github.com/shoaibhajj/manaveth_al-tourid).
2. انتقل إلى **Settings** ⟵ قسم **Danger Zone** (في أسفل الصفحة).
3. اختر **Change repository visibility** ⟵ واجعله **Private**.
   *(هذا الإجراء يمنع وصول محركات البحث وزواحف الذكاء الاصطناعي والمتطفلين إلى سجل التغييرات التاريخية Commit History)*.

---

### 3. إعداد متغير بيئة للأدوات الإدارية (ADMIN_API_SECRET)
- إذا رغبت في استخدام استيراد الأصناف عبر `POST /api/admin/import-catalog`، أضف متغيراً سرياً في Vercel باسم `ADMIN_API_SECRET` وضع فيه رمز أمان قوي ومعقد غير معروف علناً.
