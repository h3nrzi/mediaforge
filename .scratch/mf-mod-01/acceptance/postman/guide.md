# ماژول ۰۱ — ارزیابی با Postman

منبع: [مشخصات](../../spec.md) و هشت [تیکت](../../issues). نسخهٔ برنامه: `0cddedb485007ed4377c019e40203fc963084337`. تاریخ آماده‌سازی: ۲۰۲۶/۱۰/۱۵، Asia/Tehran. کد برنامه بدون تغییر است؛ فایل‌های این مسیر، ابزار و شواهد ارزیابی هستند.

وضعیت پذیرش انسانی: `not_run`. شواهد [قبلی](../../walkthrough-evidence.json) و [دفتر راستی‌آزمایی](../../../../docs/module-01/verification.md) حفظ شده‌اند؛ هیچ پاسخ ذخیره‌شده‌ای به‌عنوان گزارش شما حساب نشده است.

## ورود فایل‌ها و اولین اقدام

1. در Postman از **Import → Files**، [Mediaforge Module 01 - API Acceptance](module-01.postman_collection.json) و [Mediaforge Module 01 - Local Acceptance](../../../../.private/mf-mod-01-postman/local.postman_environment.json) را انتخاب کنید.
2. Environment با نام دقیق **Mediaforge Module 01 - Local Acceptance** را فعال کنید. `baseUrl` فعلی `http://127.0.0.1:60317` است؛ سرویس آماده است.
3. در **GET /v1/me** درخواست **S01.01 - Inspect initial Manager** را باز کنید و **Send** بزنید.
4. انتظار: HTTP `200`، `result: ok`، `responsibilities: ["Manager"]`، `membershipVersion: "1"` و `credentialRevision: "1"`. در **Test Results** همهٔ هفت بررسی باید موفق باشند. زمان اعتبار دقیقاً ۳۰ روز است.

Environment فقط برای هویت‌های دورریختنی همین ارزیابی است. فایل خصوصی در پوشهٔ نادیده‌گرفته‌شدهٔ Git با مجوز `0600` و پوشه با `0700` نگهداری می‌شود. در محیط محلی Postman نگه دارید؛ در workspace اشتراکی بارگذاری یا منتشر نکنید و مقدارها را Share نکنید. علامت sensitive فقط پوشاندن نمایش است و جای نگهداری محلی را نمی‌گیرد. فایل‌های owner و curl config را به فرد دیگری ندهید. برای گزارش، status و Test Results و فیلدهای غیرحساس کافی است؛ Environment، Authorization، descriptor و verifier را نفرستید.

## وضعیت شروع و آماده‌بودن

مسیر کاری تمام فرمان‌ها:

```sh
cd /Users/hossein/Projects/mediaforge
node --version
```

انتظار نسخهٔ `v24.22.0` است. آماده‌سازی واقعی با `prepare` و `bootstrap` برنامه انجام شده است: پایگاه داده ابتدا absent بود؛ bootstrap یک Manager ساخت و تکرار آن با `already_initialized` رد شد. شروع سرویس روی `http://127.0.0.1:60317` مشاهده شد. درخواست آغازین فقط خواندنی است؛ هیچ سناریوی تغییردهنده روی محیط شما اجرا نشده است.

داده‌ها فقط متعلق به این ارزیابی هستند:

- پایگاه داده: `/Users/hossein/Projects/mediaforge/.private/mf-mod-01-postman/workspace.sqlite`
- وضعیت هویت‌ها و نام فایل‌های owner: `/Users/hossein/Projects/mediaforge/.private/mf-mod-01-postman/state.json`
- تنظیم راه‌اندازی: `/Users/hossein/Projects/mediaforge/.private/mf-mod-01-postman/launch.json`
- شناسهٔ Manager آغازین: `be538269-4459-4c56-b5b9-f2fae58dd5c7`
- شناسهٔ عضو اصلی: `cd535869-2645-4b84-8c3f-a47745397e37`

فقط `manager` ثبت شده و در شروع فعال است. `member`, `contributor`, `reviewer`, `operations`, `backup`, `combined`, `allroles` فعلاً فقط کاندیدای آماده‌اند؛ S02 آن‌ها را ثبت می‌کند. `returned`, `selfnext`, `managed`, `restored`, `recovered` نیز آماده‌اند ولی هنوز فعال نیستند. نقش صاحب credential و گیرندهٔ descriptor در این محیط آزمایشی شبیه‌سازی شده؛ تأیید هویت واقعی انسان‌ها خارج از این ارزیابی است.

| کاندیدا | هویت مقصد | revision مشاهده‌شدهٔ مورد نیاز | مرحلهٔ ثبت | هویت معتبر بعدی |
| --- | --- | --- | --- | --- |
| returned | member | 2 پس از removal | S06.05 | returned |
| selfnext | member | 3 پس از readmission | S07.02 | selfnext |
| managed | member | 4 | S07.07 | managed |
| restored | member | 6 پس از revoke | S07.13 | restored |
| recovered | manager | 2 پس از self-revoke | S08.H | recovered |

این اعداد فقط برای ترتیب جداافتادهٔ همین راهنما هستند. اگر ویرایش دیگری انجام شده است، پیش از ادامه revision را از پاسخ مجاز بررسی کنید؛ عدد دلخواه جایگزین نکنید. `member_mv` و `member_cr` از پاسخ‌های موفق ثبت می‌شوند؛ `stale_mv` عمداً نسخهٔ admission اولیه و `removed_mv` عمداً نسخهٔ removal را حفظ می‌کنند. `before` آخرین snapshot عضو، `first_admission` snapshot تاریخی اولیه، `cursor` ادامهٔ صفحه با همان فیلتر و `final_snapshot` وضعیت Manager بازیابی‌شده است. Environment واردشده را در ادامه حفظ کنید؛ فایل اولیهٔ روی دیسک snapshotهای بعد از Send را ندارد.

## ترتیب اجرا میان پوشه‌های endpoint

از **Send** برای تک‌درخواست‌ها استفاده کنید و ترتیب جدول را رعایت کنید. ترتیب پوشه‌ها ترتیب سناریو نیست؛ **Run collection** یا اجرای همهٔ یک پوشه برای این گردش معتبر نیست. هر سطر با نام انگلیسی دقیق در Collection قابل یافتن است. خطای مورد انتظار مانند `401/403/409` با موفقیت Test Results تأیید می‌شود.

| گام | مسیر دقیق پوشه و درخواست | هویت | انتظار یا توقف |
| --- | --- | --- | --- |
| S01.01 | **GET /v1/me / S01.01 - Inspect initial Manager** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S01.02 | **GET /v1/me / S01.02 - Reject anonymous caller** | `anonymous` | HTTP `401`؛ همهٔ Test Results موفق |
| S01.03 | **PATCH /v1/actors/{actorId} / S01.03 - Protect last Manager from demotion** | `manager` | HTTP `409`؛ همهٔ Test Results موفق |
| S01.04 | **POST /v1/actors/{actorId}/remove / S01.04 - Protect last Manager from removal** | `manager` | HTTP `409`؛ همهٔ Test Results موفق |
| S02.1a | **PUT /v1/actors/{actorId} / S02.1a - Admit member** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S02.1b | **GET /v1/me / S02.1b - Inspect member self** | `member` | HTTP `200`؛ همهٔ Test Results موفق |
| S02.2a | **PUT /v1/actors/{actorId} / S02.2a - Admit contributor** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S02.2b | **GET /v1/me / S02.2b - Inspect contributor self** | `contributor` | HTTP `200`؛ همهٔ Test Results موفق |
| S02.3a | **PUT /v1/actors/{actorId} / S02.3a - Admit reviewer** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S02.3b | **GET /v1/me / S02.3b - Inspect reviewer self** | `reviewer` | HTTP `200`؛ همهٔ Test Results موفق |
| S02.4a | **PUT /v1/actors/{actorId} / S02.4a - Admit operations** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S02.4b | **GET /v1/me / S02.4b - Inspect operations self** | `operations` | HTTP `200`؛ همهٔ Test Results موفق |
| S02.5a | **PUT /v1/actors/{actorId} / S02.5a - Admit backup** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S02.5b | **GET /v1/me / S02.5b - Inspect backup self** | `backup` | HTTP `200`؛ همهٔ Test Results موفق |
| S02.6a | **PUT /v1/actors/{actorId} / S02.6a - Admit combined** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S02.6b | **GET /v1/me / S02.6b - Inspect combined self** | `combined` | HTTP `200`؛ همهٔ Test Results موفق |
| S02.7a | **PUT /v1/actors/{actorId} / S02.7a - Admit allroles** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S02.7b | **GET /v1/me / S02.7b - Inspect allroles self** | `allroles` | HTTP `200`؛ همهٔ Test Results موفق |
| S02.08 | **PUT /v1/actors/{actorId} / S02.08 - Confirm identical admission** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S02.09 | **GET /v1/actors / S02.09 - Reject zero-role directory access** | `member` | HTTP `403`؛ همهٔ Test Results موفق |
| S02.10 | **GET /v1/actors/{actorId} / S02.10 - Conceal other actor** | `member` | HTTP `403`؛ همهٔ Test Results موفق |
| S02.11 | **PATCH /v1/actors/{actorId} / S02.11 - Reject zero-role membership edit** | `member` | HTTP `403`؛ همهٔ Test Results موفق |
| S02.12 | **GET /v1/actors/{actorId}/credential / S02.12 - Conceal other credential metadata** | `member` | HTTP `403`؛ همهٔ Test Results موفق |
| S03.01 | **GET /v1/actors / S03.01 - Read first directory page** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S03.02 | **GET /v1/actors / S03.02 - Read distinct next page** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S03.03 | **GET /v1/actors / S03.03 - Reject changed cursor filters** | `manager` | HTTP `400`؛ همهٔ Test Results موفق |
| S03.04 | **GET /v1/actors / S03.04 - Reject excessive page size** | `manager` | HTTP `400`؛ همهٔ Test Results موفق |
| S03.05 | **GET /v1/actors / S03.05 - Inspect exact actor filter** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S04.01 | **PATCH /v1/actors/{actorId} / S04.01 - Reject unknown responsibility** | `manager` | HTTP `400`؛ همهٔ Test Results موفق |
| S04.02 | **PATCH /v1/actors/{actorId} / S04.02 - Reject duplicate responsibility** | `manager` | HTTP `400`؛ همهٔ Test Results موفق |
| S04.03 | **PATCH /v1/actors/{actorId} / S04.03 - Reject empty label** | `manager` | HTTP `400`؛ همهٔ Test Results موفق |
| S04.04 | **PATCH /v1/actors/{actorId} / S04.04 - Reject long Unicode label** | `manager` | HTTP `400`؛ همهٔ Test Results موفق |
| S04.05 | **PATCH /v1/actors/{actorId} / S04.05 - Reject immutable identity field** | `manager` | HTTP `400`؛ همهٔ Test Results موفق |
| S04.06 | **PATCH /v1/actors/{actorId} / S04.06 - Reject missing precondition** | `manager` | HTTP `400`؛ همهٔ Test Results موفق |
| S04.07 | **PATCH /v1/actors/{actorId} / S04.07 - Reject malformed JSON** | `manager` | HTTP `400`؛ همهٔ Test Results موفق |
| S04.08 | **PATCH /v1/actors/{actorId} / S04.08 - Reject wrong content type** | `manager` | HTTP `400`؛ همهٔ Test Results موفق |
| S04.09 | **PATCH /v1/actors/{actorId} / S04.09 - Reject oversized body** | `manager` | HTTP `413`؛ همهٔ Test Results موفق |
| S04.10 | **GET /v1/actors/{actorId} / S04.10 - Confirm validation has no effect** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S04.11 | **GET /v1/actors/{actorId} / S04.11 - Reject unknown actor** | `manager` | HTTP `404`؛ همهٔ Test Results موفق |
| S05.01 | **PATCH /v1/actors/{actorId} / S05.01 - Rename and assign complete role set** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S05.02 | **PATCH /v1/actors/{actorId} / S05.02 - Refuse stale incompatible edit** | `manager` | HTTP `409`؛ همهٔ Test Results موفق |
| S05.03 | **GET /v1/actors/{actorId} / S05.03 - Confirm stale edit has no effect** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S05.04 | **PATCH /v1/actors/{actorId} / S05.04 - Confirm matching edit without new effect** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S05.05 | **GET /v1/me / S05.05 - Observe current roles using same credential** | `member` | HTTP `200`؛ همهٔ Test Results موفق |
| S06.01 | **POST /v1/actors/{actorId}/remove / S06.01 - Remove member** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S06.02 | **GET /v1/me / S06.02 - Deny removed credential** | `member` | HTTP `401`؛ همهٔ Test Results موفق |
| S06.03 | **POST /v1/actors/{actorId}/remove / S06.03 - Confirm repeated removal** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S06.04 | **PUT /v1/actors/{actorId} / S06.04 - Refuse admission replay for removed actor** | `manager` | HTTP `409`؛ همهٔ Test Results موفق |
| S06.05 | **POST /v1/actors/{actorId}/readmit / S06.05 - Readmit exact actor with fresh credential** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S06.06 | **GET /v1/me / S06.06 - Inspect readmitted self** | `returned` | HTTP `200`؛ همهٔ Test Results موفق |
| S06.07 | **POST /v1/actors/{actorId}/remove / S06.07 - Refuse stale removal of readmission** | `manager` | HTTP `409`؛ همهٔ Test Results موفق |
| S06.08 | **GET /v1/actors/{actorId} / S06.08 - Confirm readmission survives stale removal** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S07.01 | **GET /v1/actors/{actorId}/credential / S07.01 - Inspect own credential metadata** | `returned` | HTTP `200`؛ همهٔ Test Results موفق |
| S07.02 | **POST /v1/actors/{actorId}/credential / S07.02 - Replace own zero-role credential** | `returned` | HTTP `200`؛ همهٔ Test Results موفق |
| S07.03 | **GET /v1/me / S07.03 - Deny superseded owner credential** | `returned` | HTTP `401`؛ همهٔ Test Results موفق |
| S07.04 | **GET /v1/me / S07.04 - Inspect saved replacement candidate** | `selfnext` | HTTP `200`؛ همهٔ Test Results موفق |
| S07.05 | **POST /v1/actors/{actorId}/credential / S07.05 - Confirm exact current registration** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S07.06 | **POST /v1/actors/{actorId}/credential / S07.06 - Deny another actor replacement** | `selfnext` | HTTP `403`؛ همهٔ Test Results موفق |
| S07.07 | **POST /v1/actors/{actorId}/credential / S07.07 - Manager replaces member credential** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S07.08 | **POST /v1/actors/{actorId}/credential / S07.08 - Refuse superseded candidate replay** | `manager` | HTTP `409`؛ همهٔ Test Results موفق |
| S07.09 | **GET /v1/actors/{actorId} / S07.09 - Confirm stale replacement has no effect** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S07.10 | **POST /v1/actors/{actorId}/credentials/{credentialId}/revoke / S07.10 - Revoke exact current credential** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S07.11 | **GET /v1/me / S07.11 - Deny revoked credential** | `managed` | HTTP `401`؛ همهٔ Test Results موفق |
| S07.12 | **POST /v1/actors/{actorId}/credentials/{credentialId}/revoke / S07.12 - Confirm repeated exact revocation** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S07.13 | **POST /v1/actors/{actorId}/credential / S07.13 - Restore admitted member credential** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S07.14 | **POST /v1/actors/{actorId}/credentials/{credentialId}/revoke / S07.14 - Old revocation cannot redirect** | `manager` | HTTP `409`؛ همهٔ Test Results موفق |
| S07.15 | **GET /v1/me / S07.15 - Inspect restored owner after old revocation** | `restored` | HTTP `200`؛ همهٔ Test Results موفق |
| S08.01 | **PATCH /v1/actors/{actorId} / S08.01 - Demote backup Manager** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S08.02 | **GET /v1/actors / S08.02 - Deny next page after demotion** | `backup` | HTTP `403`؛ همهٔ Test Results موفق |
| S08.03 | **POST /v1/actors/{actorId}/credentials/{credentialId}/revoke / S08.03 - Revoke all-roles Manager credential** | `allroles` | HTTP `200`؛ همهٔ Test Results موفق |
| S08.04 | **POST /v1/actors/{actorId}/credentials/{credentialId}/revoke / S08.04 - Revoke initial Manager credential** | `manager` | HTTP `200`؛ همهٔ Test Results موفق |
| S08.05 | **GET /v1/me / S08.05 - Deny revoked Manager** | `manager` | HTTP `401`؛ همهٔ Test Results موفق |
| S08.H | توقف میزبان؛ فرمان بخش زیر | اپراتور میزبان | بازیابی میزبان پس از ازبین‌رفتن همهٔ credentialهای Manager؛ تنها manager و allroles هنوز نقش Manager دارند و هر دو credential باطل شده‌اند. |
| S08.06 | **GET /v1/me / S08.06 - Inspect recovered Manager candidate** | `recovered` | HTTP `200`؛ همهٔ Test Results موفق |
| S09.H | توقف میزبان؛ فرمان بخش زیر | اپراتور میزبان | سرویس همین پایگاه داده را متوقف و دوباره راه‌اندازی کنید؛ Environment را دوباره Import نکنید و فقط baseUrl را در صورت تغییر پورت ویرایش کنید. |
| S09.01 | **GET /v1/me / S09.01 - Inspect persisted recovered Manager** | `recovered` | HTTP `200`؛ همهٔ Test Results موفق |
| S09.02 | **GET /v1/actors/{actorId} / S09.02 - Inspect persisted restored member** | `recovered` | HTTP `200`؛ همهٔ Test Results موفق |

## سناریوها به‌ترتیب اجرا

### S01 — هویت آغازین و حفاظت از آخرین Manager

اجراکننده `manager` است. S01.01 نسخه‌ها، نقش مستقل Manager، مدت اعتبار و محرمانگی پاسخ را بررسی می‌کند؛ S01.02 بدون هویت باید `401` بگیرد. S01.03 و S01.04 باید با `409` مانع حذف آخرین Manager شوند. این ردها اثر ندارند. نقطهٔ ادامه S02.1a است؛ Manager آغازین همچنان معتبر می‌ماند.

### S02 — پذیرش و نقش‌های مستقل

با `manager` هر admission و بلافاصله درخواست self صاحب همان credential را به‌ترتیب جدول اجرا کنید. مجموعه‌ها عبارت‌اند از صفر نقش، هر نقش تنها، Contributor+Reviewer و همهٔ نقش‌ها. درخواست S02.08 تکرار همان admission است و باید `already_satisfied`, `effect: none` بدهد؛ کل snapshot شامل زمان و attribution برابر می‌ماند. S02.09 تا S02.12 با هویت صفرنقش باید `403` و بدون `data/currentState` باشند. این بررسی نمایش نقش‌ها و مجوز مدیریت را نشان می‌دهد؛ قدرت رسانه/درخواست هنوز صرفاً شواهد فنی دارد.

### S03 — فهرست و ادامهٔ صفحه

با `manager` صفحهٔ اول دو عضو و cursor می‌گیرد. S03.02 باید دو شناسهٔ متفاوت از صفحهٔ اول نشان دهد. S03.03 تغییر فیلتر با همان cursor را `400 invalid_cursor` رد می‌کند. S03.04 سقف ۱۰۰ را بررسی می‌کند و S03.05 فقط شناسهٔ دقیق member را برمی‌گرداند. cursor مجوز یا snapshot ثابت نیست؛ آن را برای S08.02 حفظ کنید. ترتیب کامل، default 50 و همهٔ حالت‌های ورود هم‌زمان در آزمون فنی جدا پوشش دارند.

### S04 — ورودی نامعتبر و عدم اثر

با `manager` S04.01 تا S04.09 را اجرا کنید. نقش ناشناخته/تکراری، label خالی/۸۱ حرفی، فیلد هویت تغییرناپذیر، نبود precondition، JSON خراب، content type اشتباه و بدنهٔ بزرگ عمداً رد می‌شوند. S04.10 باید برابری کامل snapshot عضو با قبل را تأیید کند. S04.11 lookup شناسهٔ معتبر ولی ناشناخته را `404` می‌گیرد. دادهٔ محصول فارسی است؛ label کنترلی یا نیم‌فاصله مطابق قرارداد فعلی پذیرفته نمی‌شود.

### S05 — تغییر نسخه‌دار، stale و no-op

S05.01 نام عضو را به «عضو ویرایش شده» و نقش‌ها را به Contributor+Reviewer تغییر می‌دهد؛ membershipVersion یک پله افزایش و credential/firstAdmission ثابت می‌ماند. S05.02 با `stale_mv` عمداً قدیمی و نام متفاوت باید `409` بدهد. S05.03 عدم اثر را تأیید می‌کند. S05.04 همان وضعیت با ترتیب متفاوت roleها را بدون اثر جدید تأیید می‌کند؛ نسخه، زمان و attribution نباید عوض شوند. در S05.05 همان credential اولیه نقش‌های جدید را می‌بیند. اکنون member نسخهٔ عضویت ۲ دارد.

### S06 — حذف و بازپذیری دقیق

S06.01 با `manager` عضو را removed، نقش‌ها را خالی و credential را invalidated می‌کند. S06.02 با `member` باید `401` شود. S06.03 تکرار بدون اثر و S06.04 تلاش نامعتبر برای readmit از مسیر admission است. S06.05 تنها از مسیر readmit و کاندیدای `returned` استفاده می‌کند؛ شناسه و firstAdmission حفظ می‌شوند و نقش‌ها صریحاً خالی‌اند. با `returned` در S06.06 وارد شوید. S06.07 removal با نسخهٔ removed قدیمی را رد می‌کند و S06.08 بقای readmission را می‌سنجد. عضو در پایان admitted، membershipVersion=4 و credentialRevision=3 دارد؛ `member` هرگز دوباره معتبر نمی‌شود.

### S07 — جایگزینی و ابطال دقیق credential

S07.01 metadata خود را با `returned` بخوانید. S07.02 جایگزینی self بدون نقش Manager است. از اینجا `returned` نامعتبر و `selfnext` معتبر است؛ S07.03 و S07.04 هر دو را می‌سنجند. S07.05 با Manager همان descriptor ثبت‌شده را بدون تمدید یا اثر تأیید می‌کند. S07.06 درخواست صفرنقش برای credential فرد دیگر را `403` می‌گیرد.

S07.07 با `manager` کاندیدای `managed` را ثبت می‌کند. replay کاندیدای superseded در S07.08 باید `409` و S07.09 snapshot ثابت بدهد. S07.10 فقط credentialId مشخص managed را revoke می‌کند؛ S07.11 احراز هویت آن را `401` و S07.12 تکرار را بدون revision جدید می‌سنجد. S07.13 با Manager کاندیدای `restored` را فعال می‌کند. S07.14 با همان ID قدیمی `409` می‌گیرد و S07.15 با `restored` ثابت می‌کند credential تازه باطل نشده است. membershipVersion در تمام این بخش ۴ می‌ماند و credentialRevision نهایی ۷ است.

### S08 — از‌دست‌رفتن credentialهای Manager و بازیابی میزبان

S08.01 نقش `backup` را صفر می‌کند؛ S08.02 با همان credential هنوز فعال backup و cursor قبلی باید `403` بدهد. S08.03 با هویت `allroles` credential خودش را باطل می‌کند. S08.04 با `manager` credential خودش را باطل می‌کند و S08.05 باید `401` بگیرد. اکنون هیچ credential معتبر Manager باقی نمانده، ولی عضویت Managerها حفظ شده است.

در **S08.H** در ترمینال و از ریشهٔ مخزن اجرا کنید:

```sh
node .scratch/mf-mod-01/acceptance/postman/prepare.mjs recover /Users/hossein/Projects/mediaforge/.private/mf-mod-01-postman
```

این ابزار فقط `recovery-status` و `recover` پشتیبانی‌شده را اجرا می‌کند، revision مشاهده‌شدهٔ ۲ و وضعیت invalidated را کنترل می‌کند، descriptor آمادهٔ `recovered` را می‌دهد و سپس همان candidate را بدون تغییر دوباره تأیید می‌کند. انتظار خروجی غیرحساس: `result: ok`, `credentialRevision: "3"`, `noOpSnapshotEqual: true`. معادل دقیق فرمان‌های میزبان، برای همین هویت و همین checkpoint:

```sh
node src/cli.js recovery-status --db /Users/hossein/Projects/mediaforge/.private/mf-mod-01-postman/workspace.sqlite --actor be538269-4459-4c56-b5b9-f2fae58dd5c7
node src/cli.js recover --db /Users/hossein/Projects/mediaforge/.private/mf-mod-01-postman/workspace.sqlite --actor be538269-4459-4c56-b5b9-f2fae58dd5c7 --revision 2 --descriptor /Users/hossein/Projects/mediaforge/.private/mf-mod-01-postman/recovered.owner.json.registration.json
```

روش بالا جایگزین اجرای wrapper است؛ هر دو روش را به دنبال هم اجرا نکنید. هیچ recovery endpoint شبکه‌ای وجود ندارد. اگر پاسخ میزبان گم شد wrapper را کورکورانه تکرار نکنید؛ `recovery-status` و درخواست **GET /v1/me / S08.06 - Inspect recovered Manager candidate** با `recovered` وضعیت فعلی دقیق را مشخص می‌کنند. نتیجهٔ تاریخی نامعلوم را نامعلوم نگه دارید. S08.06 باید اصل عضویت، نقش و firstAdmission را ثابت و attribution را `host_operator` با principal سیستم‌عامل نشان دهد. از اینجا فقط `recovered` برای مدیریت استفاده می‌شود.

### S09 — ماندگاری پس از راه‌اندازی مجدد

در **S09.H** ابتدا فقط سرویس همین ارزیابی را متوقف کنید:

```sh
node .scratch/mf-mod-01/acceptance/postman/prepare.mjs stop /Users/hossein/Projects/mediaforge/.private/mf-mod-01-postman
```

پس از خروج سرویس، در یک ترمینال اجرا کنید و آن را باز نگه دارید:

```sh
node .scratch/mf-mod-01/acceptance/postman/prepare.mjs serve /Users/hossein/Projects/mediaforge/.private/mf-mod-01-postman
```

انتظار JSON با `result: ok` و `data.listening.port` است. در صورت اشغال پورت، فقط مقدار `port` را در فایل خصوصی `launch.json` به یک پورت آزاد تغییر دهید، همان فرمان را اجرا کنید و `baseUrl` محلی Environment واردشده را به همان آدرس تغییر دهید. فایل اولیه Environment را دوباره Import نکنید. S09.01 با `recovered` کل snapshot Manager و S09.02 کل snapshot عضو restored را با قبل از restart برابر می‌سنجد، شامل نسخه‌ها، اعتبار، زمان‌ها و attribution.

## پوشش معیارهای هر تیکت

شمارهٔ `Txx.Cyy` یعنی معیار yy به ترتیب بخش Acceptance criteria در همان تیکت. سناریو HTTP فقط قسمت قابل مشاهدهٔ معیار را نشان می‌دهد؛ ستون فنی مکمل آن است. ادعاهای persistence، fault، clock، concurrency، فایل و policy از مشاهدهٔ دستی API جدا هستند. متن کامل هر معیار در منبع لینک‌شده است.

| معیار | مسیر محصول | شواهد فنی مکمل یا محدودیت |
| --- | --- | --- |
| [T01.C01](../../issues/01-establish-private-workspace.md) | شروع/S01 | runtime؛ test/workspace.test.js |
| [T01.C02](../../issues/01-establish-private-workspace.md) | آماده‌سازی/S01.01 | test/workspace.test.js؛ تأیید شخص واقعی دستی و خارج از نمونهٔ محلی |
| [T01.C03](../../issues/01-establish-private-workspace.md) | آماده‌سازی | test/validation.test.js؛ حفاظت فایل و وقفهٔ آماده‌سازی فنی است |
| [T01.C04](../../issues/01-establish-private-workspace.md) | آماده‌سازی/S01 | test/workspace.test.js؛ status و bootstrap واقعی اجرا شدند |
| [T01.C05](../../issues/01-establish-private-workspace.md) | S09 | test/persistence.test.js؛ فساد/مهاجرت/PRAGMA فنی |
| [T01.C06](../../issues/01-establish-private-workspace.md) | فقط فنی | test/concurrency.test.js و test/faults.test.js؛ gate و commit قابل ساختن از Postman نیست |
| [T01.C07](../../issues/01-establish-private-workspace.md) | S01/S06/S07 | test/validation.test.js و test/expiry.test.js؛ strict proof و مرز ۳۰ روز فنی |
| [T01.C08](../../issues/01-establish-private-workspace.md) | همهٔ درخواست‌ها | test/transport.test.js؛ HTTPS غیرمحلی در این محیط اجرا نشده |
| [T01.C09](../../issues/01-establish-private-workspace.md) | راهنمای توقف/ادامه | test/persistence.test.js و test/faults.test.js؛ گم‌شدن پاسخ ساختگی فنی |
| [T02.C01](../../issues/02-manage-actors-and-responsibilities.md) | S02 | test/membership.test.js؛ تأیید گیرندهٔ واقعی موکول به استفادهٔ واقعی |
| [T02.C02](../../issues/02-manage-actors-and-responsibilities.md) | S02.08/S06.04 | test/membership.test.js؛ تکرار و binding |
| [T02.C03](../../issues/02-manage-actors-and-responsibilities.md) | S02/S05 | test/policy.test.js؛ ماتریس کامل ۱۶ ترکیب صرفاً فنی |
| [T02.C04](../../issues/02-manage-actors-and-responsibilities.md) | S05 | test/membership.test.js و test/concurrency.test.js |
| [T02.C05](../../issues/02-manage-actors-and-responsibilities.md) | S01.03/S08 | test/concurrency.test.js؛ invariant هم‌زمان فنی |
| [T02.C06](../../issues/02-manage-actors-and-responsibilities.md) | S05/S06 | test/membership.test.js؛ duplicate label و snapshot مدیر فنی |
| [T02.C07](../../issues/02-manage-actors-and-responsibilities.md) | S02.10/S02.12/S07.01 | test/validation.test.js؛ نبود secret/verifier در همهٔ پاسخ‌ها بررسی می‌شود |
| [T02.C08](../../issues/02-manage-actors-and-responsibilities.md) | S03/S08.02 | test/directory.test.js؛ ترتیب کامل و ورود هم‌زمان فنی |
| [T02.C09](../../issues/02-manage-actors-and-responsibilities.md) | S04 | test/validation.test.js؛ overflow و همهٔ حدود متن فنی |
| [T02.C10](../../issues/02-manage-actors-and-responsibilities.md) | S04 و همهٔ پاسخ‌ها | test/faults.test.js؛ 503 و certainty صرفاً فنی |
| [T02.C11](../../issues/02-manage-actors-and-responsibilities.md) | کل راهنما | docs/module-01/client.md؛ مسیر Postman کنار curl حفظ شده |
| [T03.C01](../../issues/03-remove-and-readmit-members.md) | S06.01/S06.02 | test/membership.test.js؛ removal با credential قبلاً باطل فنی |
| [T03.C02](../../issues/03-remove-and-readmit-members.md) | S06.03/S06.07/S05.02 | test/membership.test.js |
| [T03.C03](../../issues/03-remove-and-readmit-members.md) | S06.04/S06.05 | test/membership.test.js؛ bindingهای منفی فنی |
| [T03.C04](../../issues/03-remove-and-readmit-members.md) | S06.05/S06.08 | test/membership.test.js؛ duplicate label و ترتیب اولیه فنی |
| [T03.C05](../../issues/03-remove-and-readmit-members.md) | S01.04/S08 | test/concurrency.test.js؛ شمارش credential منقضی و رقابت فنی |
| [T03.C06](../../issues/03-remove-and-readmit-members.md) | فقط فنی و ادغام آتی | test/policy.test.js؛ work/media واقعی در Modules 02–06 وجود ندارد |
| [T03.C07](../../issues/03-remove-and-readmit-members.md) | S05.03/S06.08/S08.02 | test/faults.test.js؛ تاریخچهٔ نامعلوم بازسازی نمی‌شود |
| [T03.C08](../../issues/03-remove-and-readmit-members.md) | S06 و راهنمای توقف | docs/module-01/client.md؛ self-demotion/رقابت مکمل فنی |
| [T04.C01](../../issues/04-replace-and-revoke-credentials.md) | S07.02/S07.06 | test/credentials.test.js و test/expiry.test.js |
| [T04.C02](../../issues/04-replace-and-revoke-credentials.md) | S07.07/S07.08 | test/credentials.test.js؛ binding و تعارض اپراتور فنی |
| [T04.C03](../../issues/04-replace-and-revoke-credentials.md) | S07/S09 | test/validation.test.js؛ overflow فنی |
| [T04.C04](../../issues/04-replace-and-revoke-credentials.md) | S01.01/S07.05 | test/expiry.test.js؛ قبل/دقیقاً/بعد از expiry و downtime فنی |
| [T04.C05](../../issues/04-replace-and-revoke-credentials.md) | S07.05/S07.08 | test/credentials.test.js؛ تأیید candidate منقضی توسط Manager فنی |
| [T04.C06](../../issues/04-replace-and-revoke-credentials.md) | S07.10–S07.15/S08.03 | test/credentials.test.js؛ exact-ID و no-op |
| [T04.C07](../../issues/04-replace-and-revoke-credentials.md) | S07.03/S07.04 و توقف | test/faults.test.js؛ افت acknowledgement صرفاً فنی |
| [T04.C08](../../issues/04-replace-and-revoke-credentials.md) | همهٔ درخواست‌ها و آماده‌سازی | test/validation.test.js؛ حفاظت فایل و strict parsing فنی |
| [T05.C01](../../issues/05-recover-manager-credentials.md) | S08.H | test/credentials.test.js و test/concurrency.test.js |
| [T05.C02](../../issues/05-recover-manager-credentials.md) | S08.H/S08.06 | test/credentials.test.js؛ loss ناشی از expiry فنی |
| [T05.C03](../../issues/05-recover-manager-credentials.md) | فقط فنی | test/credentials.test.js و test/concurrency.test.js؛ همهٔ targetهای نامعتبر و stale |
| [T05.C04](../../issues/05-recover-manager-credentials.md) | S08.06 | test/credentials.test.js؛ origin و principal |
| [T05.C05](../../issues/05-recover-manager-credentials.md) | S08.H | test/credentials.test.js؛ تأیید بدون تمدید و replay منفی |
| [T05.C06](../../issues/05-recover-manager-credentials.md) | شروع/S08.H | test/workspace.test.js و test/transport.test.js؛ هیچ endpoint بازیابی ساخته نشده |
| [T05.C07](../../issues/05-recover-manager-credentials.md) | توقف/ادامه و S08.06 | test/faults.test.js؛ ambiguity و connection disposal فنی |
| [T05.C08](../../issues/05-recover-manager-credentials.md) | S08 و راهنمای کامل | docs/module-01/client.md؛ handoff واقعی انسان‌ها خارج از نمونه |
| [T06.C01](../../issues/06-verify-shared-authority-boundary.md) | فقط فنی | test/policy.test.js؛ consumer scope اتمیک و confinement |
| [T06.C02](../../issues/06-verify-shared-authority-boundary.md) | فقط فنی؛ ادغام آتی | test/policy.test.js؛ subjectهای واقعی Modules 02–06 هنوز وجود ندارند |
| [T06.C03](../../issues/06-verify-shared-authority-boundary.md) | S02 فقط نقش و مدیریت | test/policy.test.js؛ shared_read و union تمام roleها صرفاً contract |
| [T06.C04](../../issues/06-verify-shared-authority-boundary.md) | فقط فنی | test/concurrency.test.js و test/expiry.test.js؛ gate تازه و rollback |
| [T06.C05](../../issues/06-verify-shared-authority-boundary.md) | فقط فنی؛ ادغام آتی | test/policy.test.js؛ continuity رسانه/کار واقعی موکول است |
| [T06.C06](../../issues/06-verify-shared-authority-boundary.md) | فقط مستند/فنی | docs/module-01/authority.md؛ موضوعات quota/lifecycle/transfer موکول به مصرف‌کنندگان |
| [T07.C01](../../issues/07-recover-interrupted-administration.md) | فقط فنی | test/concurrency.test.js و test/faults.test.js؛ مالکیت transaction و بودجهٔ monotonic |
| [T07.C02](../../issues/07-recover-interrupted-administration.md) | فقط فنی | test/concurrency.test.js؛ 503 و invalidation هنگام انتظار |
| [T07.C03](../../issues/07-recover-interrupted-administration.md) | فقط فنی | test/faults.test.js؛ rollback/indeterminate و quarantine |
| [T07.C04](../../issues/07-recover-interrupted-administration.md) | همهٔ پاسخ‌ها؛ 503 فقط فنی | test/faults.test.js؛ قطع شبکهٔ ساختگی در Postman اجرا نمی‌شود |
| [T07.C05](../../issues/07-recover-interrupted-administration.md) | S02.08/S05/S06/S07/S08 و توقف | test/faults.test.js؛ حفظ uncertainty تاریخی |
| [T07.C06](../../issues/07-recover-interrupted-administration.md) | S09 | test/persistence.test.js؛ missing/corrupt/migration صرفاً فنی |
| [T07.C07](../../issues/07-recover-interrupted-administration.md) | S04 و همهٔ پاسخ‌ها | test/validation.test.js؛ overflow و حدود summary فنی |
| [T07.C08](../../issues/07-recover-interrupted-administration.md) | توقف/ادامه | docs/module-01/client.md؛ fault/clock endpoint وجود ندارد |
| [T08.C01](../../issues/08-verify-module-and-handoff.md) | آماده‌سازی و S01 | README.md و docs/module-01/client.md؛ HTTPS واقعی بررسی نشده |
| [T08.C02](../../issues/08-verify-module-and-handoff.md) | S01–S09 | HTTP واقعی؛ sample credentialها جای تحویل واقعی شخص نیستند |
| [T08.C03](../../issues/08-verify-module-and-handoff.md) | S01–S09؛ 503 فقط فنی | test/transport.test.js، test/faults.test.js؛ همهٔ semantics فنی تکمیل می‌شوند |
| [T08.C04](../../issues/08-verify-module-and-handoff.md) | دفتر شواهد | docs/module-01/verification.md؛ M01-V01 تا M01-V17 و فایل preflight جدید |
| [T08.C05](../../issues/08-verify-module-and-handoff.md) | شواهد جاری | technical-test-evidence.txt؛ 50 آزمون موفق و npm run check موفق |
| [T08.C06](../../issues/08-verify-module-and-handoff.md) | محدودهٔ ادغام آتی | docs/module-01/verification.md؛ MF-AC-02/03/04 جزئی، MF-AC-29/33/37/38/41 نیازمند subject واقعی |
| [T08.C07](../../issues/08-verify-module-and-handoff.md) | محدودهٔ ادغام آتی | docs/module-01/verification.md؛ Modules 02–06 و MF-GATE-07، نه پذیرش کل V1 |
| [T08.C08](../../issues/08-verify-module-and-handoff.md) | تحویل/نقطهٔ ادامه | پذیرش مالک pending؛ تغییر labelهای tracker و پذیرش کل V1 ادعا نمی‌شود |

## شواهد و نقطهٔ ادامه

- [پیش‌بررسی HTTP و scriptهای خروجی](preflight-evidence.json): ۷۵ درخواست واقعی و ۳۹۰ assertion موفق، bootstrap/status واقعی، recovery، تأیید recovery بدون اثر و restart روی پایگاه دادهٔ جدا و دورریختنی. هیچ mutation روی محیط انسانی اجرا نشده است.
- روش اجرا: fetch و adapter کوچک `pm` با `pm.test`, `pm.expect(...).to.eql`, `pm.response.code/json/headers.get`, `pm.environment.get/set`؛ این adapter import یا sandbox واقعی Postman را اثبات نمی‌کند.
- [شواهد فنی جاری](technical-test-evidence.txt): ۵۰ آزمون موفق؛ `npm run check` نیز موفق. اجرای اول HTTP به علت `listen EPERM` در sandbox مسدود شد؛ اجرای مجاز بیرون sandbox موفق بود. تفاوت prototype میان VM و نمونهٔ label دارای کاراکتر کنترل در ابزار ارزیابی اصلاح و تمام توالی دوباره اجرا شد؛ کد برنامه تغییر نکرد.
- Postman UI/runner: `not_run`. schema رسمی به‌طور ماشینی اعتبارسنجی نشده؛ ساختار v2.1، JSON، syntax scriptها، variableها، مسیر و هویت همهٔ گام‌ها بررسی شده‌اند. نتیجهٔ Import را باید شما گزارش کنید.
- شواهد مربوط به clock/fault/concurrency/policy کاملاً فنی‌اند؛ 503 را با endpoint ساختگی ایجاد نکرده‌ایم. nonlocal HTTPS و ادغام واقعی رسانه/درخواست/حسابداری/transfer و تأیید هویت انسان‌ها اجرا نشده‌اند.
- [نقطهٔ ادامه](checkpoint.json) و [پوشش تک‌معیارها](coverage.json) و [ترتیب قابل پردازش](sequence.json) کنار راهنما ذخیره شده‌اند. شواهد و نتیجه‌های هر تیکت جدا نگه داشته می‌شوند.

| سناریو | پیش‌بررسی agent | نتیجهٔ کاربر | مشاهده و نسخه |
| --- | --- | --- | --- |
| S01 | موفق؛ HTTP/host و adapter خروجی | not_run | منتظر گزارش؛ `0cddedb48500` |
| S02 | موفق؛ HTTP/host و adapter خروجی | not_run | منتظر گزارش؛ `0cddedb48500` |
| S03 | موفق؛ HTTP/host و adapter خروجی | not_run | منتظر گزارش؛ `0cddedb48500` |
| S04 | موفق؛ HTTP/host و adapter خروجی | not_run | منتظر گزارش؛ `0cddedb48500` |
| S05 | موفق؛ HTTP/host و adapter خروجی | not_run | منتظر گزارش؛ `0cddedb48500` |
| S06 | موفق؛ HTTP/host و adapter خروجی | not_run | منتظر گزارش؛ `0cddedb48500` |
| S07 | موفق؛ HTTP/host و adapter خروجی | not_run | منتظر گزارش؛ `0cddedb48500` |
| S08 | موفق؛ HTTP/host و adapter خروجی | not_run | منتظر گزارش؛ `0cddedb48500` |
| S09 | موفق؛ HTTP/host و adapter خروجی | not_run | منتظر گزارش؛ `0cddedb48500` |

سناریوی جاری: S01.01، اجرا توسط کاربر شروع نشده. اقدام امن بعدی: **Import** دو فایل و **Send** روی **GET /v1/me / S01.01 - Inspect initial Manager**. پس از مشاهده، فقط status، role/version و تعداد Test Results موفق/ناموفق را گزارش کنید؛ نتیجهٔ انسانی فقط با گزارش واقعی شما pass/fail/blocked می‌شود.

## توقف، پاک‌سازی و ادامه

توقف امن فقط برای فرآیند ارزیابی:

```sh
cd /Users/hossein/Projects/mediaforge
node .scratch/mf-mod-01/acceptance/postman/prepare.mjs stop /Users/hossein/Projects/mediaforge/.private/mf-mod-01-postman
```

ابزار PID ذخیره‌شده را با فرمان واقعی شامل مسیر همین database تطبیق می‌دهد؛ اگر فرآیند فرق کند آن را متوقف نمی‌کند. برای ادامه از همان database و فرمان serve بخش S09 استفاده کنید. credentialها ۳۰ روزه‌اند؛ پس از انقضا مسیر بازیابی معتبر لازم است و تکرار خودکار سناریو صحیح نیست.

در یک توقف عادی Environment واردشده، fixtureها و checkpoint را نگه دارید. فقط baseUrl را در صورت تغییر پورت عوض کنید. ابزار `prepare` مقصد موجود را نمی‌نویسد؛ برای محیط تازهٔ کاملاً جدا می‌توان نام پوشهٔ تازه به آن داد، ولی تا پایان پذیرش محیط حاضر را جایگزین نکنید. دستور `export` فقط برای تکمیل خروجی اولیهٔ آماده‌سازی موجود است و فایل Environment موجود را هم overwrite نمی‌کند؛ برای ادامهٔ ارزیابی از آن استفاده نکنید.

در `400/413` یا `409 refused_without_effect` بازرسی مجاز و اصلاح آگاهانه ممکن است. در قطع ارتباط، `503 indeterminate` یا گم‌شدن پاسخ، وابسته‌ها را متوقف کنید؛ admission را با actorId آماده، membership را با exact GET، replacement را با candidate ذخیره‌شده، revocation را با exact credentialId/metadata و bootstrap/recovery را با status میزبان بررسی کنید. درخواست mutation را برای حدس‌زدن نتیجه تکرار نکنید. با `401/403` نتیجهٔ mutation قبلی را استنباط نکنید. در تردید سلامت storage سرویس را برای آزمون بعدی راه نیندازید تا اعتماد storage برقرار شود؛ restart به‌تنهایی عدم اثر را ثابت نمی‌کند.

بعد از پایان واقعی پذیرش، ابتدا سرویس را با stop ببندید؛ سپس فقط پوشهٔ `/Users/hossein/Projects/mediaforge/.private/mf-mod-01-postman` را در Finder حذف کنید. تا آن زمان حذف ownerها، descriptorها، database و snapshotها ممنوعِ عملیِ ادامه است. فایل‌های شواهد غیرحساس و نتیجهٔ گزارش‌شدهٔ شما باقی بمانند.

## پذیرش باقی‌مانده

همهٔ S01–S09 و Import واقعی Postman هنوز `not_run` هستند. پذیرش انسانی، شواهد فنی موفق و آماده‌بودن راهنما سه وضعیت مستقل‌اند. پس از هر گزارش، نام سناریو، مشاهدهٔ بدون اطلاعات حساس و نسخه را در checkpoint ثبت می‌کنیم. در شکست، expected/observed حفظ، وابسته‌ها متوقف و بعد از اصلاح فقط گام‌های متأثر برای rerun علامت می‌خورند؛ تاریخچه پاک نمی‌شود.

مستندات جاری با Context7 بررسی شد: [متغیرها و محلی‌بودن مقدارها](https://learning.postman.com/docs/sending-requests/variables)، [آزمون و انتظار](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-test-expect)، [مثال‌های script](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-examples) و [ساختار Collection SDK](https://github.com/postmanlabs/postman-collection/blob/develop/docs/concepts.md). این‌ها مرجع ساخت artifact هستند؛ مشاهدهٔ UI محسوب نمی‌شوند.
