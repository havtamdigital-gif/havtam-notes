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
      {q:"איזו תגית מציינת כותרת ראשית?",opts:["<h1>","<title>","<header>","<main>"],ans:0},
      {q:"הכותרת h1 צריכה להופיע בדף...",opts:["פעם אחת","כמה פעמים שרוצים","לפחות פעמיים","רק ב-header"],ans:0},
      {q:"מה ההבדל בין <ul> ל-<ol>?",opts:["ul=נקודות, ol=מספרים","ul=מספרים, ol=נקודות","זהים","ul=גדול, ol=קטן"],ans:0},
    ]},

  { id:3, icon:"🔗", title:"קישורים ותמונות", sub:"a href, img src, alt, target",
    date:"10 מאי 2025", category:"HTML",
    concepts:["<a>","<img>","href","src","alt","URL"],
    content:`<p>תגיות לניווט ומדיה.</p>`,
    quiz:[
      {q:"מה המאפיין href מגדיר ב-<a>?",opts:["כתובת היעד","צבע הקישור","גודל הטקסט","שם הדף"],ans:0},
      {q:"למה alt חובה ב-<img>?",opts:["נגישות ו-SEO","צבע התמונה","גודל התמונה","מיקום התמונה"],ans:0},
      {q:"מה target='_blank' עושה?",opts:["פותח בטאב חדש","סוגר הטאב","מבטל קישור","פותח בחלון חדש"],ans:0},
    ]},

  { id:4, icon:"🎨", title:"מבוא ל-CSS", sub:"color, font-size, background, text-align",
    date:"17 מאי 2025", category:"CSS",
    concepts:["selector","color","background-color","font-size / weight","text-align"],
    content:`<p>עיצוב בסיסי עם CSS.</p>`,
    quiz:[
      {q:"איך מגדירים צבע טקסט ב-CSS?",opts:["color: red","text-color: red","font-color: red","style: red"],ans:0},
      {q:"איך מחברים קובץ CSS חיצוני ל-HTML?",opts:['<link rel="stylesheet" href="style.css">','<css src="style.css">','<style href="style.css">','<script src="style.css">'],ans:0},
      {q:"מה color עושה לעומת background-color?",opts:["color=טקסט, background=רקע","שניהם זהים","color=רקע, background=טקסט","לא רלוונטי"],ans:0},
    ]},

  { id:5, icon:"🏷️", title:"מחלקות CSS", sub:"class, id, selector",
    date:"24 מאי 2025", category:"CSS",
    concepts:["id ו-class","selector","color","background-color"],
    content:`<p>בחירת אלמנטים לעיצוב ייעודי.</p>`,
    quiz:[
      {q:"איך בוחרים קלאס ב-CSS?",opts:[".myClass","#myClass","myClass","*myClass"],ans:0},
      {q:"מה ההבדל בין id ל-class?",opts:["id ייחודי, class חוזר","id חוזר, class ייחודי","זהים","id לJS, class לCSS"],ans:0},
      {q:"איך בוחרים id ב-CSS?",opts:["#myId",".myId","myId","id=myId"],ans:0},
    ]},

  { id:6, icon:"📦", title:"Box Model + Div", sub:"padding, margin, border, width, height",
    date:"26 מאי 2025", category:"CSS",
    concepts:["padding","margin","border","border-radius","width / height","display","<div>","<section>"],
    content:`<p>כל אלמנט הוא קופסה עם שכבות: content → padding → border → margin.</p>`,
    quiz:[
      {q:"מה ההבדל בין padding ל-margin?",opts:["padding=פנימי, margin=חיצוני","padding=חיצוני, margin=פנימי","זהים","padding לטקסט, margin לתמונות"],ans:0},
      {q:"מה border-radius עושה?",opts:["מעגל פינות","מסגרת","מרווח","רוחב"],ans:0},
      {q:"margin: 0 auto מה עושה?",opts:["מרכז אופקית","מרכז אנכית","מסיר margin","נותן padding"],ans:0},
    ]},

  { id:7, icon:"🧩", title:"Flexbox", sub:"display:flex, justify-content, align-items, gap",
    date:"31 מאי 2025", category:"CSS",
    concepts:["display: flex","justify-content","align-items","gap","flex-direction","flex-wrap"],
    content:`<p>סידור אלמנטים בגמישות.</p>`,
    quiz:[
      {q:"על מי שמים display:flex?",opts:["ההורה","הילד","שניהם","לא משנה"],ans:0},
      {q:"מה מרכז אלמנטים אופקית ב-flex?",opts:["justify-content: center","align-items: center","text-align: center","flex: center"],ans:0},
      {q:"מה gap עושה?",opts:["מרווח בין ילדים","מרווח פנימי","מסגרת","גובה"],ans:0},
    ]},

  { id:8, icon:"⌨️", title:"Inputs & Buttons", sub:"input, button, label, form, placeholder",
    date:"2 יוני 2025", category:"HTML",
    concepts:["<input>","<button>","<label>","<form>","placeholder","id ו-class"],
    content:`<p>אלמנטי טופס לאיסוף קלט מהמשתמש.</p>`,
    quiz:[
      {q:"מה מאפיין for ב-label עושה?",opts:["מחבר ל-id של input","מגדיר צבע","מגדיר גודל","שם הטופס"],ans:0},
      {q:"מה placeholder עושה?",opts:["טקסט רמז שנעלם בהקלדה","תווית קבועה","שם השדה","הערה ל-JS"],ans:0},
      {q:"מה type='number' עושה ל-input?",opts:["מקבל רק מספרים","מציג מספר","מחשב","מסתיר"],ans:0},
    ]},

  { id:9, icon:"⚡", title:"JavaScript Events", sub:"onclick, alert, getElementById, innerHTML",
    date:"9 יוני 2025", category:"JavaScript",
    concepts:["onclick","function","alert()","console.log()","getElementById","innerHTML","textContent"],
    content:`<p>תגובה לאירועי משתמש.</p>`,
    quiz:[
      {q:"מה onclick עושה?",opts:["מקשיב ללחיצה","שינוי CSS","הוספת טקסט","מחיקת אלמנט"],ans:0},
      {q:"מה document.getElementById מחזיר?",opts:["האלמנט עצמו","הערך","הid","מחרוזת"],ans:0},
      {q:"מה .value מחזיר תמיד?",opts:["string","number","boolean","object"],ans:0},
    ]},

  { id:10, icon:"🔧", title:"Variables + Parameters + DOM", sub:"let, const, Number(), parameters, return",
    date:"16 יוני 2025", category:"JavaScript",
    concepts:["let","const","Number()","פרמטרים","return","if / else","חיבור מחרוזות","addEventListener"],
    content:`<p>משתנים, פרמטרים, ותנאים.</p>`,
    quiz:[
      {q:"למה צריך Number() עם ערך מ-input?",opts:["כי .value מחזיר string","כי JS לא אוהב מספרים","כי input מחזיר object","לא צריך"],ans:0},
      {q:"מה ההבדל בין let ל-const?",opts:["let ניתן לשינוי, const קבוע","let קבוע, const ניתן לשינוי","זהים","let לJS, const לCSS"],ans:0},
      {q:"מה return עושה בפונקציה?",opts:["מחזיר ערך ועוצר","מדפיס לconsole","מחיק אלמנט","מציג alert"],ans:0},
    ]},
];
