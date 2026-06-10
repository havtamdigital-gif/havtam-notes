import { useState, useRef, useEffect } from 'react';
import { dict } from '../../data/dictionary';
import type { AIMessage } from '../../types';
import { useProgress } from '../../hooks/useProgress';

/* ════════════════════════════════════════════════════
   LOCAL KNOWLEDGE BASE — web.dev + course material
   Answers work 100% offline, no backend needed
   ════════════════════════════════════════════════════ */
const KB: Array<{ t: string[]; a: string }> = [

  // ── WEB BASICS ──────────────────────────────────────────────
  { t:['מה זה html','מהו html','html היא','html זה'],
    a:'**HTML** (HyperText Markup Language) = שפת הסימון שמגדירה את **מבנה** הדף.\n\nהיא אומרת לדפדפן *מה* יש בדף — כותרות, פסקאות, קישורים, תמונות.\n```html\n<!DOCTYPE html>\n<html lang="he">\n  <head><title>שם</title></head>\n  <body><h1>שלום!</h1></body>\n</html>\n```\nHTML = שלד | CSS = בגדים | JS = תנועה' },

  { t:['מה זה css','css היא','css זה'],
    a:'**CSS** (Cascading Style Sheets) = **עיצוב** הדף.\n\nצבעים, גדלים, פונטים, מיקומים, הכל.\n```css\nh1 {\n  color: hotpink;\n  font-size: 32px;\n  text-align: center;\n}\n```\nבלי CSS הדף אפור ומשעמם. CSS = הבגדים של האתר.' },

  { t:['מה זה javascript','js זה','javascript היא'],
    a:'**JavaScript** = שפת תכנות שרצה בדפדפן.\n\nמוסיפה **לוגיקה** — כפתורים שעובדים, חישובים, שינויי דף בזמן אמת.\n```js\nfunction greet(name) {\n  alert("שלום " + name);\n}\ngreet("רחל");\n```\nJS = הנשמה — מה שגורם לדברים לקרות.' },

  { t:['הבדל html css js','3 שפות','שלוש שפות','תפקיד של כל'],
    a:'**שלוש שפות, תפקיד אחד:**\n\n| שפה | תפקיד | דוגמה |\n|------|--------|-------|\n| HTML | מבנה | `<button>לחצי</button>` |\n| CSS | עיצוב | `button { background: pink }` |\n| JS | לוגיקה | `onclick="doThing()"` |\n\nHTML = "מה יש", CSS = "איך נראה", JS = "מה קורה".' },

  { t:['server client','שרת לקוח','מה זה שרת','browser'],
    a:'**Client** = הדפדפן שלך\n**Server** = המחשב שמחזיק את האתר\n\n```\nClient → "תן לי את הדף"\n         ───────────────→ Server\nClient ← HTML + CSS + JS\n```\nהשרת אחראי לטיפול בבקשות ושליחת תגובות.' },

  // ── HTML STRUCTURE ───────────────────────────────────────────
  { t:['מבנה html','מבנה בסיסי','דף html ריק','איך בונים דף'],
    a:'**מבנה HTML מלא:**\n```html\n<!DOCTYPE html>\n<html lang="he" dir="rtl">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    <title>שם הדף</title>\n    <link rel="stylesheet" href="style.css" />\n  </head>\n  <body>\n    <h1>כותרת ראשית</h1>\n    <p>תוכן הדף.</p>\n    <script src="script.js"></script>\n  </body>\n</html>\n```\n💡 DOCTYPE תמיד ראשון | charset לפני title | script בסוף body' },

  { t:['doctype','<!doctype','סוג מסמך'],
    a:'**`<!DOCTYPE html>`** = השורה הראשונה בכל דף.\n\nאומרת לדפדפן: "השתמש בגרסה המודרנית של HTML" (HTML5).\n\nבלי DOCTYPE הדפדפן עלול להיכנס ל-"quirks mode" ולהציג את הדף שגויה.' },

  { t:['מה ב head','מה שמים ב head','head מכיל'],
    a:'**`<head>`** מכיל מטא-נתונים שלא מוצגים על המסך:\n\n```html\n<head>\n  <meta charset="UTF-8" />          ← קידוד\n  <meta name="viewport" ... />      ← מובייל\n  <title>שם הדף</title>            ← טאב\n  <link rel="stylesheet" href="style.css" /> ← CSS\n</head>\n```\n**לא שמים** בhead: כותרות h1, פסקאות p, תמונות. אלה ב-body!' },

  { t:['charset','utf-8','קידוד','charset utf'],
    a:'**`<meta charset="UTF-8">`** = מגדיר קידוד התווים.\n\nUTF-8 תומך בעברית, ערבית, סינית, אמוג\'י — כל תו בעולם!\n\n⚠️ בלי charset — עברית תיראה כתמים: `?×§×•×"×™×™×"` במקום "כותרת".' },

  { t:['viewport','meta viewport','רספונסיבי mobile'],
    a:'**`<meta name="viewport" content="width=device-width, initial-scale=1">`**\n\nמגדיר שהאתר יתאים לגודל המסך הנוכחי (מובייל/דסקטופ).\n\nבלי זה האתר נראה מוקטן ממש על מובייל.' },

  { t:['link css','חיבור css','איך מחברים css','stylesheet'],
    a:'**איך מחברים CSS ל-HTML:**\n\n```html\n<head>\n  <link rel="stylesheet" href="style.css" />\n</head>\n```\n\n**חשוב:**\n- `rel="stylesheet"` — חובה!\n- `href` — הנתיב לקובץ CSS\n- נמצא ב-`<head>`, לא ב-`<body>`\n\n⚠️ טעות נפוצה: לשכוח `rel="stylesheet"` — הCSS לא יתחבר!' },

  { t:['script js','חיבור javascript','איך מחברים js','script src'],
    a:'**איך מחברים JavaScript ל-HTML:**\n\n```html\n<!-- בסוף body — הדף נטען לפני ה-JS -->\n<body>\n  <!-- כל התוכן של הדף -->\n  <script src="script.js"></script>\n</body>\n```\n\n💡 למה בסוף body? כדי שה-HTML יטען לפני שה-JS מנסה לגשת לאלמנטים.\n\nאפשר גם JS ישיר:\n```html\n<script>\n  alert("שלום!");\n</script>\n```' },

  // ── HTML ELEMENTS ────────────────────────────────────────────
  { t:['כותרות html','h1 h2','מה ה h1'],
    a:'**כותרות: h1–h6** לפי חשיבות יורדת:\n\n```html\n<h1>כותרת ראשית — פעם אחת בדף!</h1>\n<h2>כותרת משנית</h2>\n<h3>כותרת קטנה</h3>\n```\n\n⚠️ h1 = פעם אחת בדף (חשוב ל-SEO!)\nמשתמשים לפי היררכיה הגיונית, לא רק לגודל.' },

  { t:['פסקה html','paragraph','תגית p'],
    a:'**`<p>`** = פסקה (block element).\n\n```html\n<p>זו פסקה ראשונה.</p>\n<p>זו פסקה שנייה.</p>\n```\n\n⚠️ לא להשתמש ב-`<br>` לפסקאות — `<p>` הוא הנכון.' },

  { t:['רשימה html','ul ol li','bullet points'],
    a:'**רשימות:**\n```html\n<!-- נקודות (unordered) -->\n<ul>\n  <li>תפוח</li>\n  <li>בננה</li>\n</ul>\n\n<!-- מספרים (ordered) -->\n<ol>\n  <li>שלב 1</li>\n  <li>שלב 2</li>\n</ol>\n```\nכל `<li>` חייב להיות בתוך `<ul>` או `<ol>`!' },

  { t:['קישור html','a href','link html','target blank'],
    a:'**`<a href="">`** = קישור:\n\n```html\n<!-- קישור רגיל -->\n<a href="https://google.com">לגוגל</a>\n\n<!-- טאב חדש -->\n<a href="https://she-codes.org" target="_blank">SheCode</a>\n\n<!-- עוגן באותו דף -->\n<a href="#section2">לחלק 2</a>\n```\n⚠️ תמיד כתבי `https://` בקישורים חיצוניים!' },

  { t:['תמונה html','img src alt','image html'],
    a:'**`<img>`** = תמונה (תגית עצמאית, ללא סגירה):\n\n```html\n<img src="cat.jpg" alt="חתול חמוד" />\n\n<!-- מהאינטרנט -->\n<img src="https://picsum.photos/300" alt="תמונה רנדומלית" width="300" />\n```\n\n⚠️ `alt` חובה! — לנגישות ולSEO.\nבלי alt = דף לא נגיש.' },

  { t:['input html','שדה קלט','type text','type number'],
    a:'**`<input>`** = שדה קלט:\n\n```html\n<input type="text"     id="name"  placeholder="שמך..." />\n<input type="number"   id="age"   placeholder="גיל" />\n<input type="email"    id="email" placeholder="מייל" />\n<input type="password" id="pass"  placeholder="סיסמה" />\n<input type="checkbox" id="agree" />\n```\n\n⚠️ תמיד תני `id` — כדי לגשת מ-JavaScript!' },

  { t:['form html','טופס','button submit'],
    a:'**טופס מלא:**\n```html\n<form>\n  <label for="name">שם:</label>\n  <input type="text" id="name" placeholder="שמך..." />\n\n  <label for="age">גיל:</label>\n  <input type="number" id="age" />\n\n  <button type="button" onclick="readForm()">שלחי</button>\n</form>\n```\n\n💡 `type="button"` = לא שולח ולא מרענן את הדף!' },

  { t:['label html','תווית','for id label'],
    a:'**`<label>`** = תווית לשדה.\n\nה-`for` **חייב** להיות זהה ל-`id` של ה-input:\n\n```html\n<label for="firstName">שם פרטי:</label>\n<input type="text" id="firstName" />\n```\n\n✅ לחיצה על "שם פרטי:" תמקד את השדה!\n⚠️ אם for ≠ id — הלחיצה לא עובדת.' },

  { t:['div html','קופסה','container','מיכל'],
    a:'**`<div>`** = קופסה כללית (block).\n\nלקיבוץ אלמנטים ולעיצוב:\n```html\n<div class="card">\n  <h2>כותרת הכרטיס</h2>\n  <p>תוכן הכרטיס.</p>\n  <button>לחצי</button>\n</div>\n```\n⚠️ שכחת לסגור `</div>`? — הדף ייראה שבור!' },

  { t:['span html','inline element','חלק מטקסט'],
    a:'**`<span>`** = עוטף חלק מטקסט (inline, לא שובר שורה):\n\n```html\n<p>אני <span style="color:hotpink">אוהבת</span> לתכנת.</p>\n```\n\n**הבדל div/span:**\n- `<div>` = block — תופס שורה שלמה\n- `<span>` = inline — בתוך שורה, לא שובר' },

  { t:['section header footer nav','סמנטי html','semantic'],
    a:'**HTML סמנטי** = תגיות עם משמעות:\n\n```html\n<header>כותרת האתר + ניווט</header>\n<nav>תפריט ניווט</nav>\n<main>\n  <section>קטע תוכן</section>\n  <article>מאמר</article>\n</main>\n<footer>כותרת תחתית, ©</footer>\n```\n\n💡 מול `<div>` — תגיות סמנטיות עוזרות ל:\n• נגישות (קוראי מסך)\n• SEO (מנועי חיפוש)\n• קריאות קוד' },

  { t:['id class html','הבדל id class','מתי id מתי class'],
    a:'**id** = ייחודי — פעם אחת בדף → CSS: `#name`\n**class** = חוזר — הרבה אלמנטים → CSS: `.name`\n\n```html\n<div id="main-header">פעם אחת בלבד!</div>\n\n<p class="highlight">טקסט 1</p>\n<p class="highlight">טקסט 2</p>\n```\n\n```css\n#main-header { font-size: 24px; }\n.highlight { background: yellow; }\n```' },

  // ── CSS ──────────────────────────────────────────────────────
  { t:['מה זה selector','בורר css','איך בוחרים css'],
    a:'**Selector** = בוחר על מי יוחל העיצוב:\n\n```css\n/* תגית — כל h1 */\nh1 { color: hotpink; }\n\n/* class — נקודה לפני! */\n.card { border-radius: 12px; }\n\n/* id — סולמית לפני! */\n#header { font-size: 24px; }\n\n/* צאצא */\n.card p { color: gray; }\n\n/* hover */\nbutton:hover { background: pink; }\n```' },

  { t:['box model','padding margin border','קופסה css','model'],
    a:'**Box Model** = כל אלמנט = 4 שכבות:\n\n```\n╔══ margin ════════════════╗\n║  ╔══ border ═══════════╗ ║\n║  ║  ╔══ padding ══════╗║ ║\n║  ║  ║    content      ║║ ║\n║  ║  ╚═════════════════╝║ ║\n║  ╚═════════════════════╝ ║\n╚══════════════════════════╝\n```\n\n```css\n.box {\n  padding: 16px;           /* פנימי */\n  border: 2px solid pink;  /* מסגרת */\n  margin: 20px;            /* חיצוני */\n}\n```' },

  { t:['הבדל margin padding','margin ל padding','margin לעומת padding'],
    a:'**padding** = פנימי (בין תוכן לגבול) 📦\n**margin** = חיצוני (בין האלמנט לשכניו) 🔲\n\n```css\n.box {\n  padding: 20px;  /* תוכן ← גבול */\n  margin: 20px;   /* גבול ← שכן */\n}\n```\n💡 טריק: **P**adding = **P**illow (כרית פנימה)' },

  { t:['איך מרכזים','מרכוז div','center div','margin auto'],
    a:'**2 דרכים למרכוז:**\n\n**1. margin auto (אופקי בלבד):**\n```css\n.box {\n  width: 400px;\n  margin: 0 auto;\n}\n```\n\n**2. Flexbox (אופקי + אנכי):**\n```css\n.parent {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}\n```' },

  { t:['flexbox','display flex','פלקסבוקס'],
    a:'**Flexbox** = מערכת סידור גמישה.\n\nשמים על **ההורה**, לא הילד!\n\n```css\n.container {\n  display: flex;\n  flex-direction: row;        /* → שורה */\n  justify-content: center;    /* אופקי */\n  align-items: center;        /* אנכי */\n  gap: 16px;                  /* רווח בין ילדים */\n  flex-wrap: wrap;            /* ירידה לשורה */\n}\n```\n⚠️ הטעות הנפוצה: `display:flex` על הילד!' },

  { t:['justify content','align items','הבדל justify align'],
    a:'בFlex:\n\n**`justify-content`** = ציר **ראשי** (בד"כ אופקי)\n**`align-items`** = ציר **ניצב** (בד"כ אנכי)\n\n```css\n.container {\n  display: flex;\n  justify-content: space-between; /* ←→ */\n  align-items: center;             /* ↕ */\n}\n```\n\nערכים נפוצים: `flex-start`, `center`, `flex-end`, `space-between`' },

  { t:['position css','position fixed relative','sticky'],
    a:'**position** = איך האלמנט ממוקם:\n\n```css\n/* static — ברירת מחדל, זורם */\n.box { position: static; }\n\n/* relative — זז ביחס למיקומו הרגיל */\n.box { position: relative; top: 10px; }\n\n/* fixed — קבוע על המסך, לא זז בגלילה */\nheader { position: fixed; top: 0; width: 100%; }\n\n/* sticky — נשאר בגלילה עד גבול ההורה */\nnav { position: sticky; top: 0; }\n```' },

  { t:['display block inline','block element','inline element'],
    a:'**display** = איך האלמנט מוצג:\n\n| ערך | מה עושה | דוגמאות |\n|------|---------|----------|\n| `block` | שורה שלמה | div, p, h1 |\n| `inline` | בתוך שורה | span, a, strong |\n| `inline-block` | בשורה + width/height | img |\n| `flex` | פלקסבוקס | container |\n| `none` | מסתיר | כל אלמנט |\n\n```css\n.hide { display: none; }\n.show { display: block; }\n```' },

  { t:['hover css','pseudo class',':hover'],
    a:'**`:hover`** = עיצוב בריחוף עכבר:\n\n```css\nbutton {\n  background: pink;\n  transition: all 0.2s; /* אנימציה חלקה */\n}\n\nbutton:hover {\n  background: hotpink;\n  transform: scale(1.05);\n}\n```\n\n⚠️ `transition` צריך להיות על האלמנט עצמו, לא על `:hover`!' },

  { t:['font family','פונט','סוג גופן'],
    a:'**`font-family`** = סוג הפונט:\n\n```css\nbody {\n  font-family: "Segoe UI", Arial, sans-serif;\n  /* ↑ מועדף    ↑ גיבוי  ↑ כללי */\n}\n\nh1 { font-family: Georgia, serif; }\n```\n\n💡 תמיד שמי גופן גיבוי! `sans-serif` = ללא סריפים (מודרני), `serif` = עם סריפים (קלאסי)' },

  { t:['media query','responsive design','רספונסיבי'],
    a:'**Media Queries** = עיצוב שונה לגדלי מסך שונים:\n\n```css\n/* ברירת מחדל — מובייל */\n.cards { flex-direction: column; }\n\n/* מסך רחב (768px+) */\n@media (min-width: 768px) {\n  .cards { flex-direction: row; }\n}\n```\n\n💡 גישת Mobile First: עצבי קודם מובייל, הוסיפי מסך גדול.' },

  // ── JAVASCRIPT ───────────────────────────────────────────────
  { t:['let const var','הבדל let const','משתנה js'],
    a:'**let** = ניתן לשינוי ✏️\n**const** = קבוע 🔒\n\n```js\nlet count = 0;\ncount = 5; // ✓\n\nconst PI = 3.14;\n// PI = 5; // ✗ שגיאה!\n\n// כלל אצבע:\n// השתמשי ב-const תמיד → שני ל-let רק כשצריך לשנות\n```\n\n🚫 הימני מ-`var` — מיושן ובעייתי.' },

  { t:['function javascript','פונקציה js','function מה זה'],
    a:'**function** = בלוק קוד שרץ בקריאה:\n\n```js\n// הגדרה:\nfunction sayHello(name) {\n  alert("שלום " + name + "!");\n}\n\n// קריאה:\nsayHello("רחל");  // → "שלום רחל!"\nsayHello("שרה");  // → "שלום שרה!"\n\n// עם return:\nfunction add(a, b) {\n  return a + b;\n}\nlet result = add(5, 3); // result = 8\n```\n⚠️ `sayHello` לא מריץ. `sayHello()` מריץ!' },

  { t:['dom javascript','document','מה זה dom'],
    a:'**DOM** (Document Object Model) = ייצוג ה-HTML כעצי אובייקטים שJS יכול לשנות.\n\n```js\n// מציאת אלמנט\nlet el = document.getElementById("myId");\nlet el2 = document.querySelector(".myClass");\n\n// שינוי תוכן\nel.textContent = "טקסט חדש";\nel.innerHTML = "<b>מודגש</b>";\n\n// שינוי עיצוב\nel.style.color = "hotpink";\n\n// קריאת ערך\nlet val = document.getElementById("input").value;\n```' },

  { t:['value input js','.value','קריאת input'],
    a:'**`.value`** = הערך מה-input:\n\n```js\nlet input = document.getElementById("age");\nlet val = input.value; // תמיד STRING!\n\nconsole.log(typeof val); // "string"\n\n// לחישוב — חובה Number():\nlet num = Number(val);\nconsole.log(num + 1); // ✓ מספר\n```\n\n⚠️ תמיד string! גם אם `type="number"`\n⚠️ חובה `Number()` לפני חישוב!' },

  { t:['number','המרה מספר','parseint','string to number'],
    a:'**`Number()`** = ממיר string למספר:\n\n```js\n// בלי Number — שרשור! ❌\n"5" + 3 === "53"\n\n// עם Number — חיבור! ✓\nNumber("5") + 3 === 8\n\n// דוגמה מעשית:\nlet age = Number(document.getElementById("age").value);\nif (age >= 18) {\n  alert("מבוגר!");\n} else {\n  alert("קטין!");\n}\n```' },

  { t:['if else condition','תנאי js','אם אחרת'],
    a:'**if / else** = תנאי:\n\n```js\nlet age = Number(document.getElementById("age").value);\n\nif (age >= 18) {\n  alert("מבוגר!");\n} else if (age >= 13) {\n  alert("נוער!");\n} else {\n  alert("ילד!");\n}\n```\n\n⚠️ הבדל חשוב:\n- `=` השמה: `let x = 5`\n- `===` השוואה: `if (x === 5)`' },

  { t:['onclick event','אירוע לחיצה','button click'],
    a:'**onclick** = אירוע לחיצה:\n\n```html\n<button onclick="myFunc()">לחצי</button>\n```\n```js\nfunction myFunc() {\n  alert("נלחץ!");\n}\n```\n\nאו עם addEventListener:\n```js\ndocument.getElementById("btn")\n  .addEventListener("click", function() {\n    alert("נלחץ!");\n  });\n```\n⚠️ `onclick="myFunc"` (בלי ()) לא יריץ!' },

  { t:['classlist','classlist add remove toggle','שינוי class js'],
    a:'**classList** = ניהול class מ-JavaScript:\n\n```js\nlet el = document.getElementById("box");\n\nel.classList.add("active");     // מוסיף\nel.classList.remove("hidden");  // מסיר\nel.classList.toggle("open");    // מוסיף/מסיר\n\nif (el.classList.contains("active")) {\n  console.log("יש class active!");\n}\n```\n\n💡 שימושי לכפתורים open/close, dark mode, הדגשה.' },

  { t:['debug','f12','console log','למה הקוד לא עובד'],
    a:'**5 שלבים לדיבוג:**\n\n1. **F12 → Console** — האם יש שגיאה אדומה?\n2. **`console.log()`** — הדפיסי ערכים לבדיקה\n3. **בדקי id** — `getElementById("x")` מחזיר null?\n4. **בדקי `()`** — שכחת `()` בקריאת פונקציה?\n5. **בדקי `Number()`** — חישוב עם string?\n\n```js\nconsole.log("ערך age:", age); // הדפיסי כל דבר חשוד\nconsole.log(typeof age);      // מה סוג הערך?\n```' },

  { t:['string concatenation','חיבור מחרוזות','template literal','backtick'],
    a:'**חיבור מחרוזות:**\n\n```js\nlet name = "רחל";\nlet age = 25;\n\n// עם + :\nalert("שלום " + name + ", בת " + age);\n\n// עם template string (backtick) — מומלץ:\nalert(`שלום ${name}, בת ${age}`);\n```\n\n⚠️ שכחת רווח: `"שלום"+name` = `"שלוםרחל"` (בלי רווח!)' },

  { t:['typeof','סוג משתנה','type check'],
    a:'**`typeof`** = בודק סוג ערך:\n\n```js\nconsole.log(typeof "שלום");    // "string"\nconsole.log(typeof 42);         // "number"\nconsole.log(typeof true);       // "boolean"\nconsole.log(typeof undefined);  // "undefined"\n\n// שימושי:\nlet val = document.getElementById("age").value;\nconsole.log(typeof val); // "string" — תמיד!\n```' },

  // ── EXAM PREP ────────────────────────────────────────────────
  { t:['מה יהיה במבחן','חזרה למבחן','מה ללמוד','נושאי מבחן'],
    a:'**נושאי המבחן — לפי הקורס:**\n\n**HTML:**\n• מבנה בסיסי (DOCTYPE, html, head, body)\n• תגיות: h1-h6, p, div, span, ul/ol/li\n• קישורים (a href) ותמונות (img src alt)\n• טפסים: input, button, label, form\n• סמנטי: section, header, main, footer\n• id ו-class\n\n**CSS:**\n• selector (.class, #id, tag)\n• Box Model: padding, margin, border\n• font-size, color, background-color\n• display: flex + justify-content, align-items\n• :hover + transition\n\n**JavaScript:**\n• let, const, function\n• getElementById, .value, Number()\n• innerHTML, textContent\n• onclick, addEventListener\n• if/else' },

  { t:['שאלה מבחן','שאלה לדוגמה','דוגמה מבחן'],
    a:'**שאלות טיפוסיות במבחן:**\n\n❓ "כפתור ירוק — באיזו שפה הוגדר?" → **CSS**\n❓ "מה אחראי למבנה הדף?" → **HTML**\n❓ "מה אחראי ללחיצה על כפתור?" → **JavaScript**\n❓ "מה ההבדל בין padding ל-margin?" → padding=פנימי, margin=חיצוני\n❓ "מה display:flex עושה?" → מסדר ילדים בשורה/עמודה\n❓ "למה צריך Number()?" → כי .value מחזיר string\n❓ "מה השרת אחראי?" → לטיפול בבקשות ושליחת תגובות' },

  { t:['טעויות נפוצות','שגיאות נפוצות','common mistakes'],
    a:'**10 הטעויות הנפוצות:**\n\n1. 🔴 שכחת `()` ב-onclick: `onclick="myFunc"` → `onclick="myFunc()"`\n2. 🔴 חישוב בלי Number(): `"5"+3 = "53"`\n3. 🔴 `display:flex` על הילד במקום ההורה\n4. 🔴 שכחת לסגור תגית: `</div>`\n5. 🔴 שכחת נקודה לפני class: `box` → `.box`\n6. 🔴 for ≠ id ב-label\n7. 🔴 שכחת `rel="stylesheet"` ב-link\n8. 🔴 שכחת `alt` ב-img\n9. 🔴 שכחת `https://` בקישור חיצוני\n10. 🔴 שכחת `charset` — עברית מוצגת כתמים' },

  // ── PROJECTS — How to build ─────────────────────────────────
  { t:['מחשבון','calculator','איך עושים מחשבון','בנה מחשבון'],
    a:'**מחשבון פשוט — HTML+CSS+JS:**\n\n```html\n<div id="calc">\n  <input type="text" id="display" readonly />\n  <div class="btns">\n    <button onclick="addToDisplay(\'7\')">7</button>\n    <button onclick="addToDisplay(\'8\')">8</button>\n    <button onclick="addToDisplay(\'9\')">9</button>\n    <button onclick="addToDisplay(\'+\')">+</button>\n    <button onclick="addToDisplay(\'4\')">4</button>\n    <button onclick="addToDisplay(\'5\')">5</button>\n    <button onclick="addToDisplay(\'6\')">6</button>\n    <button onclick="addToDisplay(\'-\')">-</button>\n    <button onclick="addToDisplay(\'1\')">1</button>\n    <button onclick="addToDisplay(\'2\')">2</button>\n    <button onclick="addToDisplay(\'3\')">3</button>\n    <button onclick="addToDisplay(\'*\')">×</button>\n    <button onclick="clearDisplay()">C</button>\n    <button onclick="addToDisplay(\'0\')">0</button>\n    <button onclick="calculate()">=</button>\n    <button onclick="addToDisplay(\'/\')" >÷</button>\n  </div>\n</div>\n```\n\n```js\nfunction addToDisplay(val) {\n  document.getElementById("display").value += val;\n}\nfunction clearDisplay() {\n  document.getElementById("display").value = "";\n}\nfunction calculate() {\n  let expr = document.getElementById("display").value;\n  document.getElementById("display").value = eval(expr);\n}\n```\n\n```css\n#calc { width:200px; text-align:center; }\n#display { width:100%; padding:8px; font-size:1.2rem; margin-bottom:8px; }\n.btns { display:grid; grid-template-columns:repeat(4,1fr); gap:4px; }\n.btns button { padding:12px; font-size:1rem; cursor:pointer; }\n```' },

  { t:['שעון','clock','digital clock','שעון דיגיטלי','תאריך ושעה'],
    a:'**שעון דיגיטלי:**\n\n```html\n<div id="clock">00:00:00</div>\n```\n\n```js\nfunction updateClock() {\n  const now = new Date();\n  const h = String(now.getHours()).padStart(2, "0");\n  const m = String(now.getMinutes()).padStart(2, "0");\n  const s = String(now.getSeconds()).padStart(2, "0");\n  document.getElementById("clock").textContent = h + ":" + m + ":" + s;\n}\n\n// עדכן כל שנייה\nsetInterval(updateClock, 1000);\nupdateClock(); // הצג מיד\n```\n\n```css\n#clock {\n  font-size: 4rem;\n  font-family: monospace;\n  color: hotpink;\n  text-align: center;\n  padding: 20px;\n}\n```' },

  { t:['מונה לחיצות','counter','click counter','כמה פעמים'],
    a:'**מונה לחיצות:**\n\n```html\n<h2>לחצת <span id="count">0</span> פעמים</h2>\n<button onclick="addCount()">לחצי עלי!</button>\n<button onclick="resetCount()">אפס</button>\n```\n\n```js\nlet count = 0;\n\nfunction addCount() {\n  count++;\n  document.getElementById("count").textContent = count;\n}\n\nfunction resetCount() {\n  count = 0;\n  document.getElementById("count").textContent = 0;\n}\n```' },

  { t:['שינוי צבע','color changer','background color button','צבע רקע כפתור'],
    a:'**כפתור שמשנה צבע רקע:**\n\n```html\n<h1 id="title">שני את הצבע!</h1>\n<button onclick="changeColor()">צבע חדש!</button>\n```\n\n```js\nfunction changeColor() {\n  const colors = ["hotpink","lavender","lightblue","#fce4f3","#e8f5e9"];\n  const random = colors[Math.floor(Math.random() * colors.length)];\n  document.body.style.background = random;\n}\n```' },

  { t:['שינוי טקסט','change text','innerHTML button','כפתור משנה טקסט'],
    a:'**כפתור שמשנה טקסט:**\n\n```html\n<h1 id="message">שלום!</h1>\n<button onclick="changeMessage()">שני את הטקסט</button>\n```\n\n```js\nfunction changeMessage() {\n  let el = document.getElementById("message");\n  if (el.textContent === "שלום!") {\n    el.textContent = "ברוכה הבאה!";\n  } else {\n    el.textContent = "שלום!";\n  }\n}\n```' },

  { t:['טופס קריאה','קרא מטופס','read form','form javascript','קבלת נתונים'],
    a:'**קריאת ערכים מטופס:**\n\n```html\n<form>\n  <label for="name">שם:</label>\n  <input type="text" id="name" placeholder="שמך..." />\n\n  <label for="age">גיל:</label>\n  <input type="number" id="age" />\n\n  <button type="button" onclick="showData()">הצג</button>\n</form>\n\n<p id="result"></p>\n```\n\n```js\nfunction showData() {\n  let name = document.getElementById("name").value;\n  let age = Number(document.getElementById("age").value);\n\n  if (name === "") {\n    alert("נא להכניס שם!");\n    return;\n  }\n\n  document.getElementById("result").textContent =\n    "שלום " + name + "! את בת " + age;\n}\n```' },

  { t:['תמונה css','הצגת תמונה','style image','תמונה עגולה','profile picture'],
    a:'**תמונה מעוצבת:**\n\n```html\n<!-- תמונה רגילה -->\n<img src="photo.jpg" alt="תמונת פרופיל" class="profile" />\n\n<!-- תמונה מהאינטרנט -->\n<img src="https://picsum.photos/200" alt="תמונה" class="profile" />\n```\n\n```css\n/* תמונת פרופיל עגולה */\n.profile {\n  width: 150px;\n  height: 150px;\n  border-radius: 50%;          /* עיגול! */\n  object-fit: cover;           /* תמלא את הריבוע */\n  border: 4px solid hotpink;\n  box-shadow: 0 4px 16px rgba(255,79,163,0.3);\n}\n\n/* תמונה מרובעת עם פינות מעוגלות */\n.card-image {\n  width: 100%;\n  border-radius: 12px;\n  object-fit: cover;\n}\n```' },

  { t:['כרטיס פרופיל','profile card','כרטיס משתמש','עמוד אישי'],
    a:'**כרטיס פרופיל:**\n\n```html\n<div class="card">\n  <img src="https://picsum.photos/100" alt="פרופיל" class="avatar" />\n  <h2>רחל לוי</h2>\n  <p class="sub">Frontend Developer</p>\n  <p>אוהבת ורוד 💕 ולומדת לתכנת</p>\n  <a href="#" class="btn">צרי קשר</a>\n</div>\n```\n\n```css\n.card {\n  width: 280px; padding: 30px;\n  text-align: center; border-radius: 20px;\n  background: white; box-shadow: 0 8px 24px rgba(255,79,163,0.15);\n}\n.avatar { width:90px; height:90px; border-radius:50%; object-fit:cover; margin-bottom:12px; }\nh2 { margin:0 0 4px; }\n.sub { color: hotpink; font-size:0.9rem; margin:0 0 10px; }\n.btn {\n  display:inline-block; padding:8px 20px;\n  background:hotpink; color:white;\n  border-radius:20px; text-decoration:none;\n  font-weight:bold;\n}\n```' },

  { t:['show hide','הסתר הצג','toggle visibility','display none toggle'],
    a:'**הצג/הסתר אלמנט:**\n\n```html\n<button onclick="toggleBox()">הצג/הסתר</button>\n<div id="box" style="display:none; padding:16px; background:pink; margin-top:8px;">\n  ניהניתי! 🌸\n</div>\n```\n\n```js\nfunction toggleBox() {\n  let box = document.getElementById("box");\n  if (box.style.display === "none") {\n    box.style.display = "block";\n  } else {\n    box.style.display = "none";\n  }\n}\n\n// גרסה קצרה עם classList:\nfunction toggleBox() {\n  document.getElementById("box").classList.toggle("hidden");\n}\n```' },

  { t:['dark mode','מצב כהה','light dark toggle','שינוי ערכת נושא'],
    a:'**Dark Mode פשוט:**\n\n```html\n<button onclick="toggleDark()" id="themeBtn">🌙 מצב כהה</button>\n```\n\n```css\nbody { background: white; color: #333; transition: all 0.3s; }\nbody.dark { background: #1a1a2e; color: #eee; }\nbody.dark button { background: #333; color: #eee; border-color: #555; }\n```\n\n```js\nfunction toggleDark() {\n  document.body.classList.toggle("dark");\n  let btn = document.getElementById("themeBtn");\n  btn.textContent = document.body.classList.contains("dark")\n    ? "☀️ מצב בהיר"\n    : "🌙 מצב כהה";\n}\n```' },

  { t:['טבלה html','table html','table css','tr td th'],
    a:'**טבלה ב-HTML:**\n\n```html\n<table>\n  <thead>\n    <tr>\n      <th>שם</th>\n      <th>גיל</th>\n      <th>עיר</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>רחל</td><td>25</td><td>תל אביב</td>\n    </tr>\n    <tr>\n      <td>שרה</td><td>30</td><td>חיפה</td>\n    </tr>\n  </tbody>\n</table>\n```\n\n```css\ntable { border-collapse: collapse; width: 100%; }\nth, td { border: 1px solid #ddd; padding: 10px; text-align: right; }\nth { background: hotpink; color: white; }\ntr:nth-child(even) { background: #fce4f3; }\n```' },

  { t:['navigation menu','תפריט ניווט','navbar','menu html css'],
    a:'**תפריט ניווט:**\n\n```html\n<nav>\n  <ul>\n    <li><a href="#">בית</a></li>\n    <li><a href="#">אודות</a></li>\n    <li><a href="#">פרויקטים</a></li>\n    <li><a href="#">צור קשר</a></li>\n  </ul>\n</nav>\n```\n\n```css\nnav ul {\n  list-style: none;\n  display: flex;\n  gap: 20px;\n  padding: 0;\n  margin: 0;\n  background: hotpink;\n  padding: 14px 24px;\n}\nnav a {\n  color: white;\n  text-decoration: none;\n  font-weight: bold;\n}\nnav a:hover { text-decoration: underline; }\n```' },

  { t:['input validation','בדיקת קלט','validate form','בדיקת טופס'],
    a:'**בדיקת קלט (Validation):**\n\n```html\n<input type="number" id="age" placeholder="גיל (0-120)" />\n<button onclick="checkAge()">בדקי</button>\n<p id="msg"></p>\n```\n\n```js\nfunction checkAge() {\n  let age = Number(document.getElementById("age").value);\n  let msg = document.getElementById("msg");\n\n  if (isNaN(age) || age === 0) {\n    msg.textContent = "❌ נא להכניס מספר";\n    msg.style.color = "red";\n  } else if (age < 0 || age > 120) {\n    msg.textContent = "❌ גיל לא תקין (0-120)";\n    msg.style.color = "red";\n  } else {\n    msg.textContent = "✅ תקין!";\n    msg.style.color = "green";\n  }\n}\n```' },
];


/* ── Conversational phrases ── */
const CONVO_MAP: Array<{t:string[];a:string}> = [
  { t:['לא הבנתי','לא הבינה','הבנתי','תסבירי שוב','שוב','חזרי','תחזרי','תסביר שוב'],
    a:'בסדר גמור, אסביר שוב בצורה אחרת! 🌸\n\n**איזה חלק לא ברור?** ספרי לי ואנסה:\n• דוגמה שונה\n• הסבר פשוט יותר\n• בשלבים קטנים\n\nאפשר לשאול "תסבירי לי [מושג] בצורה פשוטה".' },
  { t:['יש לי עוד שאלה','עוד שאלה','שאלה נוספת','שאלה אחרת'],
    a:'כמובן! שאלי 😊\n\nאני כאן לכל שאלה על HTML, CSS, JavaScript.\nאפשר גם לשאול "איך עושים X?" או "מה זה Y?".' },
  { t:['תודה','תודה רבה','thanks','thank you','יפה','מעולה','מצוין'],
    a:'בשמחה! 🌸 אם יש עוד שאלות — אני כאן.\n\nרוצי לחזק נושא? לחצי על 📖 **מילון** לקריאה מלאה.' },
  { t:['מה אני יכולה לשאול','מה אפשר לשאול','עזרה','help'],
    a:'**אפשר לשאול אותי:**\n\n• "מה זה [מושג]?" — הסבר\n• "איך עושים [פרויקט]?" — קוד שלם\n• "הבדל בין X ל-Y" — השוואה\n• "למה הקוד לא עובד?" — דיבוג\n• "מה יהיה במבחן?" — חזרה\n• "תסבירי לי [נושא] שוב" — הסבר חוזר\n\nאו לחצי על אחת השאלות המהירות למטה! 👇' },
  { t:['היכן','איפה','לינק למילון','מילון','ראיתי','מצאתי','חפשי'],
    a:'לחצי על 📖 **מילון** בתפריט לרשימה המלאה של 72 מושגים!\n\nאפשר לחפש לפי שם, לסנן לפי HTML/CSS/JavaScript, ולפתוח כל מושג עם דוגמת קוד.' },
  { t:['שלום','היי','הי','hello','hi','בוקר טוב','ערב טוב'],
    a:'שלום! 👋🌸 שמחה שבאת!\n\nמה תרצי ללמוד היום? אפשר לשאול על כל נושא מהקורס.' },
];

function handleConvo(q: string): string | null {
  const lower = q.toLowerCase().trim();
  for (const { t, a } of CONVO_MAP) {
    if (t.some(trigger => lower.includes(trigger))) return a;
  }
  return null;
}

function searchLocal(q: string): string | null {
  const lower = q.toLowerCase().trim();
  // 1. KB
  for (const { t, a } of KB) {
    if (t.some(trigger => lower.includes(trigger))) return a;
  }
  // 2. Dict search
  const clean = lower.replace(/[<>?!]/g,'').trim();
  const item = dict.find(d =>
    d.term.toLowerCase().replace(/[<>]/g,'').includes(clean) ||
    (d.aliases||[]).some(al => al.toLowerCase().includes(clean) || clean.includes(al.toLowerCase())) ||
    clean.includes(d.term.toLowerCase().replace(/[<>]/g,''))
  );
  if (item) return `📖 **${item.term}** — *${item.cat}*\n\n${item.desc}\n\n⏰ **מתי?** ${item.when}\n\n\`\`\`\n${item.code}\n\`\`\`\n\n🔍 **פירוק:** ${item.lines}\n\n⚠️ **טעות נפוצה:** ${item.mistake}`;
  return null;
}

function renderMd(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.*?)\*/g,'<em>$1</em>')
    .replace(/```[\w]*\n?([\s\S]*?)```/g,'<pre class="code-block" style="font-size:0.72rem;margin:6px 0;padding:10px 12px;overflow-x:auto">$1</pre>')
    .replace(/`(.*?)`/g,'<code style="background:#f0e6ff;padding:1px 5px;border-radius:4px;font-family:monospace;font-size:0.85em">$1</code>')
    .replace(/\n/g,'<br/>')
    .replace(/\| /g,'<span style="border-left:1px solid #eee;padding:0 8px"> ')
    .replace(/ \|/g,' </span>');
}

const QUICK = [
  'מבנה HTML בסיסי','הבדל margin padding','מה זה flexbox?',
  'איך מחברים CSS?','טעויות נפוצות','מה זה getElementById?','איך מרכזים div?',
];

export default function AIChat() {
  const [messages, setMessages] = useState<AIMessage[]>([{
    role:'assistant',
    content:'שלום! 👋 אני ה-AI Tutor — ספריית הידע שלי מבוססת על הקורס + web.dev.\n\n**אני יודעת לענות על:**\n• כל תגיות HTML (כולל מבנה, head, semantic)\n• כל CSS שנלמד (flex, box model, hover, ועוד)\n• JavaScript בסיסי (DOM, events, functions)\n• שאלות מבחן\n• טעויות נפוצות\n\nשאלי! 🌸',
    timestamp:new Date().toISOString()
  }]);
  const [input,setInput]=useState('');
  const [loading,setLoading]=useState(false);
  const bottom=useRef<HTMLDivElement>(null);
  const {addSearch}=useProgress();

  useEffect(()=>{ bottom.current?.scrollIntoView({behavior:'smooth'}); },[messages]);

  const send=async()=>{
    const q=input.trim(); if(!q) return;
    setInput(''); addSearch(q);
    const userMsg:AIMessage={role:'user',content:q,timestamp:new Date().toISOString()};
    setMessages(m=>[...m,userMsg]);
    setLoading(true);

    const local=handleConvo(q) ?? searchLocal(q);
    if(local){
      setTimeout(()=>{
        setMessages(m=>[...m,{role:'assistant',content:local,timestamp:new Date().toISOString()}]);
        setLoading(false);
      },350);
      return;
    }

    try{
      const r=await fetch('http://localhost:3001/api/ai/chat',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({message:q,history:messages.slice(-6)}),
      });
      const d=await r.json();
      setMessages(m=>[...m,{role:'assistant',content:d.reply,timestamp:new Date().toISOString()}]);
    }catch{
      setMessages(m=>[...m,{
        role:'assistant',
        content:`לא מצאתי תשובה מוכנה לשאלה הזו.\n\nנסי לנסח אחרת:\n• **"מה זה [מושג]?"** — הסבר מושג\n• **"הבדל בין X ל-Y"** — השוואה\n• **"איך עושים Z?"** — הוראות\n\nאו חפשי ב-📖 **מילון** — 72 מושגים עם הסבר מלא! 🌸`,
        timestamp:new Date().toISOString(),
      }]);
    }
    setLoading(false);
  };

  return(
    <div style={{direction:'rtl',height:'calc(100vh - 160px)',display:'flex',flexDirection:'column'}}>
      <div className="rounded-2xl flex-1 flex flex-col overflow-hidden"
        style={{background:'white',boxShadow:'0 2px 12px rgba(233,30,140,0.10)'}}>
        <div className="p-4 border-b" style={{borderColor:'#F3B6D3'}}>
          <h2 className="font-bold text-lg" style={{color:'#FF4FA3'}}>🤖 AI Tutor — שואלת AI</h2>
          <p className="text-xs text-gray-500">ספריית ידע: HTML מלא · CSS · JavaScript · web.dev</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg,i)=>(
            <div key={i} className={`flex ${msg.role==='user'?'justify-start':'justify-end'}`}>
              <div className="max-w-[88%] rounded-2xl px-4 py-3 text-sm"
                style={{background:msg.role==='user'?'#FFE0F0':'linear-gradient(135deg,#FFF0F7,#f5e6ff)',
                  color:'#2B2230',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
                <div dangerouslySetInnerHTML={{__html:renderMd(msg.content)}}/>
              </div>
            </div>
          ))}
          {loading&&<div className="flex justify-end">
            <div className="px-4 py-3 rounded-2xl text-sm" style={{background:'#FFF0F7'}}>
              <span className="animate-pulse">✨ מחפשת בספריית הידע...</span>
            </div>
          </div>}
          <div ref={bottom}/>
        </div>

        <div className="px-3 py-2 border-t flex gap-2 flex-wrap" style={{borderColor:'#F3B6D3'}}>
          {QUICK.map(q=>(
            <button key={q} onClick={()=>setInput(q)}
              className="text-xs px-3 py-1 rounded-full"
              style={{background:'#FFE0F0',color:'#D63384'}}>
              {q}
            </button>
          ))}
        </div>

        <div className="p-3 border-t" style={{borderColor:'#F3B6D3'}}>
          <div className="flex gap-2">
            <textarea value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}
              placeholder="שאלי... (Enter לשליחה)"
              className="flex-1 px-4 py-2 rounded-xl border-2 text-sm outline-none resize-none"
              style={{borderColor:'#F3B6D3',background:'#fdf8fb',direction:'rtl',minHeight:'44px',maxHeight:'100px'}}
              rows={1}/>
            <button onClick={send} disabled={loading||!input.trim()}
              className="px-5 py-2 rounded-xl font-bold text-white"
              style={{background:'linear-gradient(135deg,#FF4FA3,#9c27b0)',opacity:loading?0.7:1}}>
              שלחי
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// This file gets appended — ignore, rebuild handles it
