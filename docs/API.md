# توثيق REST API
## موقع الطريقة البيومية الأحمدية — السادة آل سلَّام

**Base URL:** `http://localhost:3000/api`
**التوثيق:** JWT — يُرسل في header: `Authorization: Bearer <token>`
**صيغة الاستجابة:** JSON دائماً
**صيغة رفع الملفات:** `multipart/form-data` (استخدام `FormData` في الفرونت)

---

## 1. Authentication — `/api/auth`

### `POST /api/auth/login`
تسجيل دخول المدير.

**Body:**
```json
{ "username": "admin", "password": "admin123" }
```

**Response `200`:**
```json
{ "token": "eyJhbGc...", "name": "مدير الموقع" }
```

**Response `401`:**
```json
{ "error": "بيانات غير صحيحة" }
```

---

### `GET /api/auth/me` 🔒
التحقق من صلاحية الـ token وجلب بيانات المدير الحالي.

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{ "id": "...", "username": "admin", "name": "مدير الموقع" }
```

---

### `PUT /api/auth/password` 🔒
تغيير كلمة المرور.

**Body:**
```json
{ "current": "admin123", "next": "newSecurePass123" }
```

**Response `200`:** `{ "success": true }`
**Response `401`:** `{ "error": "كلمة المرور الحالية غير صحيحة" }`

---

## 2. Awrad — `/api/awrad`

### `GET /api/awrad`
جلب كل الأوراد. **عام — بدون مصادقة.**

**Query params:**
- `category` (اختياري): `يومي` | `أسبوعي` | `أساسي` | `كل`

**Response `200`:**
```json
[
  {
    "_id": "...",
    "slug": "wird-sabahi",
    "title": "الورد الصباحي",
    "category": "يومي",
    "description": "...",
    "text": "بِسْمِ اللهِ...",
    "audioFile": "/uploads/audio/123-wird.mp3",
    "duration": "15:30",
    "order": 1,
    "createdAt": "2026-..."
  }
]
```

---

### `GET /api/awrad/:slug`
جلب ورد واحد. **عام.**

**Response `200`:** نفس شكل العنصر أعلاه
**Response `404`:** `{ "error": "الورد غير موجود" }`

---

### `POST /api/awrad` 🔒
إضافة ورد جديد.

**Content-Type:** `multipart/form-data`

**Fields:**
| الحقل | مطلوب | الوصف |
|---|---|---|
| `slug` | ✅ | معرف فريد (إنجليزي، بدون مسافات) |
| `title` | ✅ | العنوان |
| `category` | ✅ | `يومي` \| `أسبوعي` \| `أساسي` |
| `description` | ❌ | وصف مختصر |
| `text` | ❌ | النص الكامل |
| `duration` | ❌ | المدة `15:30` |
| `audioFile` | ❌ | ملف صوتي (حد أقصى 200MB) |

**Response `201`:** العنصر المُنشأ كاملاً.

---

### `PUT /api/awrad/:slug` 🔒
تعديل ورد موجود. نفس حقول `POST` (كلها اختيارية — يُحدّث فقط ما يُرسل).

**Response `200`:** العنصر المُحدَّث.
**Response `404`:** `{ "error": "الورد غير موجود" }`

---

### `DELETE /api/awrad/:slug` 🔒
حذف ورد.

**Response `200`:** `{ "success": true }`
**Response `404`:** `{ "error": "الورد غير موجود" }`

---

## 3. Audio — `/api/audio`

### `GET /api/audio`
جلب كل المقاطع الصوتية. **عام.**

**Query params:** `category`: `أذكار` | `إنشاد` | `قصائد` | `كل`

**Response `200`:**
```json
[
  {
    "_id": "...",
    "slug": "track-burdah",
    "title": "قصيدة البردة الشريفة كاملة",
    "artist": "المنشد محمود ياسين التهامي",
    "category": "قصائد",
    "audioFile": "/uploads/audio/...",
    "thumbnail": "/uploads/images/...",
    "duration": "45:20",
    "featured": true,
    "order": 1
  }
]
```

---

### `GET /api/audio/:slug`
**عام.** نفس شكل العنصر أعلاه. `404` إن لم يوجد.

---

### `POST /api/audio` 🔒
**Content-Type:** `multipart/form-data`

| الحقل | مطلوب | الوصف |
|---|---|---|
| `slug` | ✅ | معرف فريد |
| `title` | ✅ | العنوان |
| `artist` | ❌ | اسم المنشد |
| `category` | ✅ | `أذكار` \| `إنشاد` \| `قصائد` |
| `duration` | ❌ | المدة |
| `featured` | ❌ | `"true"` \| `"false"` (نص) |
| `audioFile` | ❌ | ملف صوتي (حد أقصى 500MB) |
| `thumbnail` | ❌ | صورة مصغرة |

**Response `201`:** العنصر المُنشأ.

---

### `PUT /api/audio/:slug` 🔒 / `DELETE /api/audio/:slug` 🔒
نفس نمط `awrad`.

---

## 4. Videos — `/api/videos`

### `GET /api/videos`
**عام.** Query: `category`: `محاضرات` | `حضرات` | `مناسبات` | `كل`

**Response `200`:**
```json
[
  {
    "_id": "...",
    "slug": "video-hadra-hussein",
    "title": "الحضرة الكبرى بمسجد الإمام الحسين",
    "description": "...",
    "category": "حضرات",
    "videoFile": null,
    "youtubeId": null,
    "thumbnail": null,
    "duration": "1:45:00",
    "featured": true,
    "order": 1
  }
]
```

---

### `POST /api/videos` 🔒
**Content-Type:** `multipart/form-data`

| الحقل | مطلوب | الوصف |
|---|---|---|
| `slug` | ✅ | معرف فريد |
| `title` | ✅ | العنوان |
| `description` | ❌ | الوصف |
| `category` | ✅ | `محاضرات` \| `حضرات` \| `مناسبات` |
| `duration` | ❌ | المدة |
| `youtubeId` | ❌ | معرف يوتيوب (بديل لرفع ملف) |
| `featured` | ❌ | `"true"` \| `"false"` |
| `videoFile` | ❌ | ملف فيديو (حد أقصى 2GB) |
| `thumbnail` | ❌ | صورة مصغرة |

**Response `201`:** العنصر المُنشأ.

---

### `PUT /api/videos/:slug` 🔒 / `DELETE /api/videos/:slug` 🔒
نفس النمط.

---

## 5. Dalail — `/api/dalail`

### `GET /api/dalail`
**عام.** جلب الأحزاب الثمانية بالترتيب.

**Response `200`:**
```json
[
  {
    "_id": "...",
    "number": 1,
    "arabicNumber": "الأوَّل",
    "title": "الحزب الأول",
    "preview": "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ...",
    "text": "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ\n\n...",
    "audioFile": null,
    "duration": "22:15",
    "order": 1
  }
]
```

---

### `GET /api/dalail/:number`
**عام.** `number` بين 1-8. `404` إن لم يوجد.

---

### `PUT /api/dalail/:number` 🔒
تعديل حزب (لا يوجد POST/DELETE — الأحزاب الثمانية ثابتة).

**Content-Type:** `multipart/form-data`

| الحقل | مطلوب | الوصف |
|---|---|---|
| `title` | ❌ | العنوان |
| `preview` | ❌ | المقتطف |
| `text` | ❌ | النص الكامل |
| `duration` | ❌ | المدة |
| `audioFile` | ❌ | تسجيل صوتي |

**Response `200`:** العنصر المُحدَّث.

---

## 6. Settings — `/api/settings`

### `GET /api/settings/daily-wird`
**عام.** يُرجع كائن الورد الكامل المحدد كـ "ورد اليوم"، أو `null` إن لم يُحدَّد.

**Response `200`:**
```json
{
  "_id": "...", "slug": "wird-asasi", "title": "الورد الأساسي للطريقة البيومية",
  "category": "أساسي", "text": "...", "description": "...",
  "audioFile": null, "duration": "45:20"
}
```
أو `null`

---

### `PUT /api/settings/daily-wird` 🔒
تحديد ورد اليوم.

**Body:**
```json
{ "wirdSlug": "wird-asasi" }
```

**Response `200`:** `{ "success": true }`

---

### `GET /api/settings/stats` 🔒
إحصائيات سريعة للوحة التحكم.

**Response `200`:**
```json
{ "awrad": 4, "audio": 4, "videos": 3, "dalail": 8 }
```

---

## أكواد الأخطاء العامة

| الكود | المعنى |
|---|---|
| `200` | نجاح |
| `201` | تم الإنشاء |
| `400` | بيانات ناقصة/خاطئة في الطلب |
| `401` | غير مصرح — مفقود/منتهي الـ token |
| `404` | العنصر غير موجود |
| `500` | خطأ في الخادم |

كل خطأ يُرجع: `{ "error": "<رسالة بالعربية>" }`

---

## ملفات الرفع — `/uploads`

كل الملفات المرفوعة تُخزَّن في:
```
backend/uploads/
├── audio/    (.mp3, .ogg, .wav)
├── video/    (.mp4, .webm)
└── images/   (.jpg, .png, .webp) — صور مصغرة
```

ويُصار إليها عبر: `http://localhost:3000/uploads/audio/<filename>`
(يُخدَّم كـ static عبر `express.static`)

---

## مفاتيح localStorage في الفرونت إند

| المفتاح | الاستخدام |
|---|---|
| `bayoumiyya_token` | JWT token للوحة التحكم |
| `bayoumiyya_name` | اسم المدير المعروض |
| `nooraltareeq_autoplay` | slug المقطع للتشغيل التلقائي عند التحويل من الرئيسية |
| `dalail_hizb` | آخر حزب مفتوح في دلائل الخيرات |
| `dalail_fontSize` | حجم الخط المحفوظ (16-28px) |
| `dalail_progress` | تقدم القراءة لكل حزب (٪) |
