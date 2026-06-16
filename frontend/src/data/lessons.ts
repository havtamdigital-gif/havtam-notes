import type { Lesson } from '../types';

export const lessons: Lesson[] = [
  { id:1, icon:"🌐", title:"מבוא לפיתוח Web", sub:"HTML, CSS, JS, Server, Client, Browser",
    date:"26 אפריל 2025", category:"Mixed",
    concepts:["Frontend","Server / Client","Browser","URL","HTML / CSS / JS"],
    content:`<p>3 השפות של Frontend ואיך האינטרנט עובד:</p>
    <ul><li><b>HTML</b> — מבנה ותוכן</li><li><b>CSS</b> — עיצוב ומראה</li>
    <li><b>JavaScript</b> — לוגיקה ואינטראקציה</li>
    <li><b>Server</b> — אחראי לטיפול בבקשות</li>
    <li><b>Browser</b> — מציג דפי אינטרנט</li></ul>`,
    quiz:[
      {q:"מי אחראי לטיפול בבקשות משתמשים במודל שרת-לקוח?",opts:["שרת","דפדפן","IP","URL"],ans:0,explanation:"השרת מקבל בקשות מהדפדפן (Client) ומחזיר תשובות."},
      {q:"איזה סוג תכנות אחראי לממשק המשתמש?",opts:["FrontEnd","Backend","FullStack","IoT"],ans:0,explanation:"Frontend = כל מה שהמשתמש רואה ומרגיש בדפדפן."},
      {q:"מה המטרה של דפדפן (כמו Chrome)?",opts:["מציג דפי אינטרנט","מריץ קוד","מנוע חיפוש","אתר אינטרנט"],ans:0,explanation:"הדפדפן מקבל HTML/CSS/JS ומציג אותם למשתמש."},
      {q:"איזו שפה אחראית למבנה ותוכן הדף?",opts:["HTML","CSS","JavaScript","DNS"],ans:0,explanation:"HTML מגדירה את המבנה — כותרות, פסקאות, קישורים וכו'."},
      {q:"כפתור ירוק באתר — באיזו שפה הוגדר הצבע?",opts:["CSS","HTML","JavaScript","HTTP"],ans:0,explanation:"CSS אחראית לכל העיצוב — צבעים, גדלים, פונטים."},
    ]},

  { id:2, icon:"📝", title:"כותרות, טקסט, רשימות", sub:"h1-h6, p, span, ul, ol, li",
    date:"3 מאי 2025", category:"HTML",
    concepts:["h1–h6","<p>","<span>","<ul> / <ol>","<!DOCTYPE html>","<html>","<head>","<body>"],
    content:`<p>תגיות הטקסט הבסיסיות ב-HTML.</p>`,
    quiz:[
      {q:"איזו תגית מציינת כותרת ראשית?",opts:["<h1>","<title>","<header>","<main>"],ans:0,explanation:"h1 היא כותרת ראשית — הכי גדולה וחשובה. h6 היא הקטנה ביותר."},
      {q:"הכותרת h1 צריכה להופיע בדף...",opts:["פעם אחת","כמה פעמים שרוצים","לפחות פעמיים","רק ב-header"],ans:0,explanation:"לכל דף צריך להיות h1 אחד בלבד — לSEO ולנגישות."},
      {q:"מה ההבדל בין <ul> ל-<ol>?",opts:["ul=נקודות, ol=מספרים","ul=מספרים, ol=נקודות","זהים","ul=גדול, ol=קטן"],ans:0,explanation:"ul = unordered list (•) | ol = ordered list (1,2,3...)"},
      {q:"מה התגית <span> משמשת בדרך כלל?",opts:["עיצוב חלק מטקסט inline","פסקה שלמה","כותרת","רשימה"],ans:0,explanation:"span היא inline — מתאימה לעיצוב מילה בודדת בתוך פסקה."},
      {q:"איזו תגית מייצגת פסקת טקסט?",opts:["<p>","<div>","<text>","<para>"],ans:0,explanation:"<p> = paragraph — תגית הפסקה הסטנדרטית ב-HTML."},
    ]},

  { id:3, icon:"🔗", title:"קישורים ותמונות", sub:"a href, img src, alt, target",
    date:"10 מאי 2025", category:"HTML",
    concepts:["<a>","<img>","href","src","alt","URL"],
    content:`<p>תגיות לניווט ומדיה.</p>`,
    quiz:[
      {q:"מה המאפיין href מגדיר ב-<a>?",opts:["כתובת היעד","צבע הקישור","גודל הטקסט","שם הדף"],ans:0,explanation:"href = hyperlink reference. זה הURL שהקישור ילך אליו."},
      {q:"למה alt חובה ב-<img>?",opts:["נגישות ו-SEO","צבע התמונה","גודל התמונה","מיקום התמונה"],ans:0,explanation:"alt מתאר את התמונה לקוראי מסך ולגוגל. בלי alt — האתר לא נגיש."},
      {q:"מה target='_blank' עושה?",opts:["פותח בטאב חדש","סוגר הטאב","מבטל קישור","פותח בחלון חדש"],ans:0,explanation:"_blank = פתח בחלון/טאב חדש. שימושי לקישורים לאתרים חיצוניים."},
      {q:"מה <a href='#'> עושה?",opts:["קישור לאותו הדף","קישור חיצוני","פתיחת מייל","קישור שבור"],ans:0,explanation:"# = anchor — מגלגל לתחילת הדף. שימושי ל-nav links זמניים."},
      {q:"איזה מאפיין מגדיר את גודל התמונה?",opts:["width ו-height","size","scale","img-size"],ans:0,explanation:"width ו-height ב-HTML (px) או CSS. מומלץ תמיד להגדיר למניעת layout shift."},
    ]},

  { id:4, icon:"🎨", title:"מבוא ל-CSS", sub:"color, font-size, background, text-align",
    date:"17 מאי 2025", category:"CSS",
    concepts:["selector","color","background-color","font-size / weight","text-align"],
    content:`<p>עיצוב בסיסי עם CSS.</p>`,
    quiz:[
      {q:"איך מגדירים צבע טקסט ב-CSS?",opts:["color: red","text-color: red","font-color: red","style: red"],ans:0,explanation:"color = צבע הטקסט. background-color = צבע הרקע. לא להתבלבל!"},
      {q:"איך מחברים קובץ CSS חיצוני ל-HTML?",opts:['<link rel="stylesheet" href="style.css">','<css src="style.css">','<style href="style.css">','<script src="style.css">'],ans:0,explanation:"link עם rel='stylesheet' בתוך head. זה הדרך הנכונה לחיבור CSS חיצוני."},
      {q:"מה color עושה לעומת background-color?",opts:["color=טקסט, background=רקע","שניהם זהים","color=רקע, background=טקסט","לא רלוונטי"],ans:0,explanation:"color מצבע את הטקסט. background-color מצבע את הרקע של האלמנט."},
      {q:"מה הכוונה ב-CSS 'Cascading'?",opts:["חוקים יורדים מהורה לילד","מדרגות","קבצים","מחלקות"],ans:0,explanation:"Cascading = חוקים יורדים מהורה לילד (ירושה) ומנצחים לפי specificity."},
      {q:"איזו דרך לכתוב CSS ישירות באלמנט?",opts:['style="color:red"','css="color:red"','color="red"','<style>color:red</style>'],ans:0,explanation:"inline style — אפשרי אבל לא מומלץ. עדיף CSS בקובץ נפרד לתחזוקה טובה."},
    ]},

  { id:5, icon:"🏷️", title:"מחלקות CSS", sub:"class, id, selector",
    date:"24 מאי 2025", category:"CSS",
    concepts:["id ו-class","selector","color","background-color"],
    content:`<p>בחירת אלמנטים לעיצוב ייעודי.</p>`,
    quiz:[
      {q:"איך בוחרים קלאס ב-CSS?",opts:[".myClass","#myClass","myClass","*myClass"],ans:0,explanation:"נקודה (.) = selector לclass. סולמית (#) = selector ל-id."},
      {q:"מה ההבדל בין id ל-class?",opts:["id ייחודי, class חוזר","id חוזר, class ייחודי","זהים","id לJS, class לCSS"],ans:0,explanation:"id = אחד בדף. class = אפשר לשים על כמה אלמנטים."},
      {q:"איך בוחרים id ב-CSS?",opts:["#myId",".myId","myId","id=myId"],ans:0,explanation:"# ב-CSS בוחר את ה-id. בHTML: id='myId'. בCSS: #myId { ... }"},
      {q:"איזה selector חזק יותר מבחינת specificity?",opts:["#id","class",".element","tag"],ans:0,explanation:"id > class > tag. ככל ש-specificity גבוה יותר כך הכלל מנצח."},
      {q:"מה * (כוכב) עושה ב-CSS?",opts:["בוחר כל האלמנטים","הוסף כוכב","כפל ערך","selector ריק"],ans:0,explanation:"* = universal selector — מעצב את כל האלמנטים בדף. * { box-sizing: border-box } שימושי מאוד!"},
    ]},

  { id:6, icon:"📦", title:"Box Model + Div", sub:"padding, margin, border, width, height",
    date:"26 מאי 2025", category:"CSS",
    concepts:["padding","margin","border","border-radius","width / height","display","<div>","<section>"],
    content:`<p>כל אלמנט הוא קופסה עם שכבות: content → padding → border → margin.</p>`,
    quiz:[
      {q:"מה ההבדל בין padding ל-margin?",opts:["padding=פנימי, margin=חיצוני","padding=חיצוני, margin=פנימי","זהים","padding לטקסט, margin לתמונות"],ans:0,explanation:"padding = מרווח בין התוכן לגבול. margin = מרווח בין האלמנט לאחרים."},
      {q:"מה border-radius עושה?",opts:["מעגל פינות","מסגרת","מרווח","רוחב"],ans:0,explanation:"border-radius מעגל את פינות האלמנט. 50% = עיגול מלא (מתאים לתמונות פרופיל)."},
      {q:"margin: 0 auto מה עושה?",opts:["מרכז אופקית","מרכז אנכית","מסיר margin","נותן padding"],ans:0,explanation:"auto מחלק את ה-margin שווה משמאל וימין — מרכז את האלמנט. עובד רק עם width מוגדר."},
      {q:"מה box-sizing: border-box עושה?",opts:["כולל padding/border ב-width","מוסיף padding לwidth","מסיר border","לא משנה"],ans:0,explanation:"border-box = ה-width כולל גם padding וגם border. הרבה יותר אינטואיטיבי מה-default."},
      {q:"padding: 10px 20px — מה ההבדל?",opts:["10=למעלה/מטה, 20=שמאל/ימין","10=שמאל, 20=ימין","זהה ל-10px","10=ימין, 20=שמאל"],ans:0,explanation:"shorthand: 2 ערכים = top/bottom ו-left/right. 4 ערכים = top right bottom left (כיוון שעון)."},
    ]},

  { id:7, icon:"🧩", title:"Flexbox", sub:"display:flex, justify-content, align-items, gap",
    date:"31 מאי 2025", category:"CSS",
    concepts:["display: flex","justify-content","align-items","gap","flex-direction","flex-wrap"],
    content:`<p>סידור אלמנטים בגמישות.</p>`,
    quiz:[
      {q:"על מי שמים display:flex?",opts:["ההורה","הילד","שניהם","לא משנה"],ans:0,explanation:"flex מוגדר על ה-container (ההורה). הילדים הופכים ל-flex items אוטומטית."},
      {q:"מה מרכז אלמנטים אופקית ב-flex?",opts:["justify-content: center","align-items: center","text-align: center","flex: center"],ans:0,explanation:"justify-content = ציר ראשי (main axis). ב-flex-direction:row זה אופקי."},
      {q:"מה gap עושה?",opts:["מרווח בין ילדים","מרווח פנימי","מסגרת","גובה"],ans:0,explanation:"gap מגדיר מרווח בין כל הילדים ב-flex/grid. הרבה יותר נוח מ-margin על כל ילד."},
      {q:"justify-content: space-between — מה זה עושה?",opts:["ילד ראשון בהתחלה, אחרון בסוף, שאר מרווחים שווים","כולם במרכז","כולם בסוף","אחד בהתחלה"],ans:0,explanation:"space-between מפזר ילדים עם מרווח שווה ביניהם. מושלם לnavbar עם לוגו ותפריט."},
      {q:"מה flex-direction: column עושה?",opts:["סדר ילדים אנכית (מעלה-מטה)","הופך את הצבע","מסובב 90°","מסתיר ילדים"],ans:0,explanation:"column = הילדים מסודרים אנכית. row (ברירת מחדל) = אופקית."},
    ]},

  { id:8, icon:"⌨️", title:"Inputs & Buttons", sub:"input, button, label, form, placeholder",
    date:"2 יוני 2025", category:"HTML",
    concepts:["<input>","<button>","<label>","<form>","placeholder","id ו-class"],
    content:`<p>אלמנטי טופס לאיסוף קלט מהמשתמש.</p>`,
    quiz:[
      {q:"מה מאפיין for ב-label עושה?",opts:["מחבר ל-id של input","מגדיר צבע","מגדיר גודל","שם הטופס"],ans:0,explanation:"for='myId' מחבר את הlabel לinput עם id='myId'. לחיצה על הlabel מפקוסת את הinput."},
      {q:"מה placeholder עושה?",opts:["טקסט רמז שנעלם בהקלדה","תווית קבועה","שם השדה","הערה ל-JS"],ans:0,explanation:"placeholder = טקסט אפור שנראה לפני ההקלדה ונעלם כשמתחילים לכתוב."},
      {q:"מה type='number' עושה ל-input?",opts:["מקבל רק מספרים","מציג מספר","מחשב","מסתיר"],ans:0,explanation:"type='number' = מקלדת מספרים במובייל + חסימת אותיות. .value עדיין מחזיר string!"},
      {q:"מה type='checkbox' מאפשר?",opts:["בחירה בין פועל/לא פועל","בחירת צבע","הזנת טקסט","בחירה מרשימה"],ans:0,explanation:"checkbox = אפשרות on/off. בודקים אם מסומן עם .checked (boolean)."},
      {q:"מה required עושה בטופס?",opts:["מונע שליחה אם השדה ריק","מגדיר גודל","מסמן אדום","מחייב מספר"],ans:0,explanation:"required = HTML validation — הדפדפן יציג שגיאה ויחסום שליחה אם השדה ריק."},
    ]},

  { id:9, icon:"⚡", title:"JavaScript Events", sub:"onclick, alert, getElementById, innerHTML",
    date:"9 יוני 2025", category:"JavaScript",
    concepts:["onclick","function","alert()","console.log()","getElementById","innerHTML","textContent"],
    content:`<p>תגובה לאירועי משתמש.</p>`,
    quiz:[
      {q:"מה onclick עושה?",opts:["מקשיב ללחיצה","שינוי CSS","הוספת טקסט","מחיקת אלמנט"],ans:0,explanation:"onclick = event listener. כשלוחצים על האלמנט — הקוד בתוכו רץ."},
      {q:"מה document.getElementById מחזיר?",opts:["האלמנט עצמו","הערך","הid","מחרוזת"],ans:0,explanation:"מחזיר אובייקט DOM — הAלמנט עצמו. אחר כך אפשר לשנות .innerHTML, .style, etc."},
      {q:"מה .value מחזיר תמיד?",opts:["string","number","boolean","object"],ans:0,explanation:"כל ערך מ-input.value הוא string גם אם הuser הקיש מספר. צריך Number() להמרה."},
      {q:"מה innerHTML עושה?",opts:["מגדיר/מחזיר HTML פנימי","מגדיר CSS","מוסיף תג","מוחק אלמנט"],ans:0,explanation:"innerHTML = התוכן הHTML בתוך האלמנט. אפשר לקרוא וגם לשנות — כולל תגיות."},
      {q:"מה addEventListener עדיף על onclick?",opts:["אפשר כמה listeners, לא דורס","מהיר יותר","קצר יותר","לא צריך function"],ans:0,explanation:"addEventListener מאפשר כמה handlers לאותו event ולא מוחק handlers קיימים."},
    ]},

  { id:10, icon:"🔧", title:"Variables + Parameters + DOM", sub:"let, const, Number(), parameters, return",
    date:"16 יוני 2025", category:"JavaScript",
    concepts:["let","const","Number()","פרמטרים","return","if / else","חיבור מחרוזות","addEventListener"],
    content:`<p>משתנים, פרמטרים, ותנאים.</p>`,
    quiz:[
      {q:"למה צריך Number() עם ערך מ-input?",opts:["כי .value מחזיר string","כי JS לא אוהב מספרים","כי input מחזיר object","לא צריך"],ans:0,explanation:'input.value = תמיד string. 5 + 3 = "53" (חיבור מחרוזות)! Number("5") + 3 = 8.'},
      {q:"מה ההבדל בין let ל-const?",opts:["let ניתן לשינוי, const קבוע","let קבוע, const ניתן לשינוי","זהים","let לJS, const לCSS"],ans:0,explanation:"const = לא ניתן לשינוי (reassign). let = אפשר. עדיפות: const ראשית, let רק אם חייבים."},
      {q:"מה return עושה בפונקציה?",opts:["מחזיר ערך ועוצר","מדפיס לconsole","מחיק אלמנט","מציג alert"],ans:0,explanation:"return עוצר את הפונקציה ומחזיר ערך. ללא return — הפונקציה מחזירה undefined."},
      {q:"מה if/else בודק?",opts:["תנאי אמת/שקר","מספר","string","function"],ans:0,explanation:"if(condition) — אם condition === true (או truthy) — הבלוק רץ. אחרת — else רץ."},
      {q:"מה + עושה כאשר אחד האיברים הוא string?",opts:["חיבור מחרוזות","חיבור מספרים","שגיאה","מחיקה"],ans:0,explanation:'בJS, אם אחד האיברים הוא string ו-+ הוא האופרטור — JavaScript מחבר מחרוזות. "3" + 4 = "34".'},
    ]},
];
