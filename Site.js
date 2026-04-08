/* =========================================================
   Bible Reading — Site.js v4.0
   Vanilla JS — No jQuery / jQuery UI / Bootstrap
   localStorage key names preserved for existing users
   ========================================================= */

// ── localStorage key constants (must NOT change) ──────────
var settings = [];

var OldTestament_LSN = 'old_testament@$111';
var OldChapters      = 'old_chapters@$111';
var NewTestament_LSN = 'new_testament@$111';
var NewChapters      = 'new_chapters@$111';
var PrayerVersion    = 'prayer_Version@$111';

// ── Internal UI constants ──────────────────────────────────
var USR_TAB      = '#usr_tabs';
var ADMN_TAB     = '#tabs';

var USR_LST_ACC  = 'old-accordion';
var USR_LST_TAB  = 'pane-ot';
var USL_LST_ATTR = 'sel';

var PUR_LST_ACC  = 'new-accordion';
var PUR_LST_TAB  = 'pane-nt';
var PUR_LST_ATTR = 'sel';

var PEN_LST_ACC  = '.pending_accordion';
var PEN_LST_TAB  = '#usr_tabs-3';

var CAT_TBL = 'table_c';
var ITM_TBL = 'table_i';

// ── SVG ring circumference (r=26) ─────────────────────────
var RING_CIRC = 2 * Math.PI * 26; // ≈ 163.36

// ==========================================================
//  BOOK METADATA  [catid, firstChapterId, chapterCount]
//  IDs must match original hardcoded data exactly
// ==========================================================
var _OT_BOOKS_META = [
    [0,  0,   50], [1,  60,  40], [2,  110, 27], [3,  147, 36], [4,  193, 34],
    [5,  237, 24], [6,  271, 21], [7,  302,  4], [8,  316, 31], [9,  357, 24],
    [10, 391, 22], [11, 423, 25], [12, 458, 29], [13, 497, 36], [14, 543, 10],
    [15, 563, 13], [16, 586, 14], [17, 610, 16], [18, 636, 16], [19, 657, 16],
    [20, 683, 15], [21, 708, 42], [22, 760,150], [23, 920, 31], [24, 961, 12],
    [25, 983,  8], [26,1001, 19], [27,1030, 51], [28,1091, 66], [29,1167, 52],
    [30,1229,  5], [31,1244,  6], [32,1260, 48], [33,1318, 14], [34,1342, 14],
    [35,1366,  3], [36,1379,  9], [37,1398,  1], [38,1409,  4], [39,1423,  7],
    [40,1440,  3], [41,1453,  3], [42,1466,  3], [43,1479,  2], [44,1491, 14],
    [45,1515,  4]
];

var _NT_BOOKS_META = [
    [46,1529,28], [47,1567,16], [48,1593,24], [49,1627,21], [50,1658,28],
    [51,1696,16], [52,1722,16], [53,1748,13], [54,1771, 6], [55,1787, 6],
    [56,1803, 4], [57,1817, 4], [58,1831, 5], [59,1846, 3], [60,1859, 6],
    [61,1875, 4], [62,1889, 3], [63,1902, 1], [64,1913,13], [65,1936, 5],
    [66,1951, 5], [67,1966, 3], [68,1979, 5], [69,1994, 1], [70,2005, 1],
    [71,2016, 1], [72,2027,22]
];

// ── catid → firstChapterId lookup ─────────────────────────
var _CATID_FIRSTID = (function () {
    var map = {};
    var all = _OT_BOOKS_META.concat(_NT_BOOKS_META);
    for (var i = 0; i < all.length; i++) { map[all[i][0]] = all[i][1]; }
    return map;
}());

// ── Language preference ────────────────────────────────────
var LangPref_LSN = 'lang_pref@$111';

// ── Malayalam book names ───────────────────────────────────
var _BOOK_NAMES_ML = {
    0:'ഉല്‍പത്തി',       1:'പുറപ്പാട്',        2:'ലേവ്യർ',
    3:'സംഖ്യ',           4:'നിയമാവർത്തനം',      5:'ജോഷ്വാ',
    6:'ന്യായാധിപന്മാർ',  7:'റൂത്ത്',            8:'1 സാമുവൽ',
    9:'2 സാമുവൽ',        10:'1 രാജാക്കന്മാർ',   11:'2 രാജാക്കന്മാർ',
    12:'1 ദിനവൃത്താന്തം',13:'2 ദിനവൃത്താന്തം',  14:'എസ്രാ',
    15:'നെഹമിയ',          16:'തോബിത്',           17:'യൂദിത്ത്',
    18:'എസ്തേർ',          19:'1 മക്കബായർ',       20:'2 മക്കബായർ',
    21:'ജോബ്',            22:'സങ്കീർത്തനങ്ങൾ',   23:'സുഭാഷിതങ്ങൾ',
    24:'സഭാപ്രസംഗകൻ',     25:'ഉത്തമഗീതം',        26:'ജ്ഞാനം',
    27:'പ്രഭാഷകൻ',        28:'ഏശയ്യാ',            29:'ജെറെമിയ',
    30:'വിലാപങ്ങൾ',       31:'ബാറൂക്ക്',          32:'എസെക്കിയേൽ',
    33:'ദാനിയേൽ',          34:'ഹോസിയാ',           35:'ജോയേൽ',
    36:'ആമോസ്',            37:'ഒബാദിയ',            38:'യോനാ',
    39:'മിക്കാ',           40:'നാഹും',              41:'ഹബക്കുക്ക്',
    42:'സെഫാനിയ',          43:'ഹഗ്ഗായി',            44:'സഖറിയാ',
    45:'മലാക്കി',
    46:'മത്തായി',          47:'മർകോസ്',             48:'ലൂക്കാ',
    49:'യോഹന്നാൻ',          50:'അപ്പ. പ്രവർത്തനങ്ങൾ', 51:'റോമാ',
    52:'1 കൊറിന്തോസ്',     53:'2 കൊറിന്തോസ്',       54:'ഗലാത്തിയാ',
    55:'എഫേസോസ്',           56:'ഫിലിപ്പി',            57:'കൊളോസോസ്',
    58:'1 തെസലോനിക്കാ',    59:'2 തെസലോനിക്കാ',      60:'1 തിമോത്തേയോസ്',
    61:'2 തിമോത്തേയോസ്',   62:'തീത്തോസ്',            63:'ഫിലെമോൻ',
    64:'ഹെബ്രായർ',          65:'യാക്കോബ്',            66:'1 പത്രോസ്',
    67:'2 പത്രോസ്',         68:'1 യോഹന്നാൻ',          69:'2 യോഹന്നാൻ',
    70:'3 യോഹന്നാൻ',         71:'യൂദാസ്',              72:'വെളിപാട്'
};

// Helper — get book display name per catid (used in toasts)
function getBookDisplayName(catid) {
    var lang = document.body.dataset.lang || 'both';
    var ml = _BOOK_NAMES_ML[catid] || '';
    var en = _BOOK_NAMES[catid]    || '';
    if (lang === 'ml') return ml || en;
    if (lang === 'en') return en || ml;
    return (ml && en) ? ml + ' / ' + en : (ml || en);
}

// Helper — create a bilingual <span> node for a book name
function _makeBilingualSpan(catid, suffix) {
    var ml = _BOOK_NAMES_ML[catid] || '';
    var en = _BOOK_NAMES[catid]    || '';
    suffix = suffix || '';

    var wrap = document.createElement('span');

    var mlSpan = document.createElement('span');
    mlSpan.className   = 'lang-ml';
    mlSpan.textContent = ml + suffix;

    var sep = document.createElement('span');
    sep.className   = 'lang-sep';
    sep.textContent = ' / ';

    var enSpan = document.createElement('span');
    enSpan.className   = 'lang-en';
    enSpan.textContent = en + suffix;

    wrap.appendChild(mlSpan);
    wrap.appendChild(sep);
    wrap.appendChild(enSpan);
    return wrap;
}

// ── English book names for plan display ───────────────────
var _BOOK_NAMES = {
    0:'Genesis',         1:'Exodus',          2:'Leviticus',       3:'Numbers',
    4:'Deuteronomy',     5:'Joshua',           6:'Judges',          7:'Ruth',
    8:'1 Samuel',        9:'2 Samuel',         10:'1 Kings',        11:'2 Kings',
    12:'1 Chronicles',   13:'2 Chronicles',    14:'Ezra',           15:'Nehemiah',
    16:'Tobit',          17:'Judith',          18:'Esther',         19:'1 Maccabees',
    20:'2 Maccabees',    21:'Job',             22:'Psalms',         23:'Proverbs',
    24:'Ecclesiastes',   25:'Song of Songs',   26:'Wisdom',         27:'Sirach',
    28:'Isaiah',         29:'Jeremiah',        30:'Lamentations',   31:'Baruch',
    32:'Ezekiel',        33:'Daniel',          34:'Hosea',          35:'Joel',
    36:'Amos',           37:'Obadiah',         38:'Jonah',          39:'Micah',
    40:'Nahum',          41:'Habakkuk',        42:'Zephaniah',      43:'Haggai',
    44:'Zechariah',      45:'Malachi',
    46:'Matthew',        47:'Mark',            48:'Luke',           49:'John',
    50:'Acts',           51:'Romans',          52:'1 Corinthians',  53:'2 Corinthians',
    54:'Galatians',      55:'Ephesians',       56:'Philippians',    57:'Colossians',
    58:'1 Thessalonians',59:'2 Thessalonians', 60:'1 Timothy',      61:'2 Timothy',
    62:'Titus',          63:'Philemon',        64:'Hebrews',        65:'James',
    66:'1 Peter',        67:'2 Peter',         68:'1 John',         69:'2 John',
    70:'3 John',         71:'Jude',            72:'Revelation'
};

// ==========================================================
//  100-DAY READING PLAN
//  Each entry: [[catid, fromChapter, toChapter], ...]
//  Index 0 = Day 1 … Index 99 = Day 100 (rest day = [])
//  Source: "Complete Bible in 100 Days" schedule (PDF)
// ==========================================================
var PLAN_100 = [
/* D01 */ [[0,1,5],[22,1,3],[46,1,2]],
/* D02 */ [[0,6,10],[22,4,6],[46,3,4]],
/* D03 */ [[0,11,15],[22,7,9],[46,5,6]],
/* D04 */ [[0,16,20],[22,10,12],[46,7,8]],
/* D05 */ [[0,21,25],[22,13,15],[46,9,10]],
/* D06 */ [[0,26,30],[22,16,18],[46,11,12]],
/* D07 */ [[0,31,35],[22,19,21],[46,13,14]],
/* D08 */ [[0,36,40],[22,22,24],[46,15,16]],
/* D09 */ [[0,41,45],[22,25,27],[46,17,18]],
/* D10 */ [[0,46,50],[22,28,30],[46,19,20]],
/* D11 */ [[1,1,6],[22,31,33],[46,21,22]],
/* D12 */ [[1,7,11],[22,34,36],[46,23,24]],
/* D13 */ [[1,12,17],[22,37,39],[46,25,26]],
/* D14 */ [[1,18,24],[22,40,42],[46,27,28]],
/* D15 */ [[1,25,30],[22,43,45],[47,1,2]],
/* D16 */ [[1,31,35],[22,46,48],[47,3,4]],
/* D17 */ [[1,36,40],[22,49,51],[47,5,6]],
/* D18 */ [[2,1,6],[22,52,54],[47,7,8]],
/* D19 */ [[2,7,11],[22,55,57],[47,9,10]],
/* D20 */ [[2,12,16],[22,58,60],[47,11,12]],
/* D21 */ [[2,17,22],[22,61,62],[47,13,14]],
/* D22 */ [[2,23,27],[22,63,65],[47,15,16]],
/* D23 */ [[3,1,6],[22,66,68],[48,1,2]],
/* D24 */ [[3,7,14],[22,69,71],[48,3,4]],
/* D25 */ [[3,15,21],[22,72,74],[48,5,6]],
/* D26 */ [[3,22,29],[22,75,77],[48,7,8]],
/* D27 */ [[3,30,36],[22,78,80],[48,9,10]],
/* D28 */ [[4,1,6],[22,81,83],[48,11,12]],
/* D29 */ [[4,7,11],[22,84,86],[48,13,14]],
/* D30 */ [[4,12,17],[22,87,89],[48,15,16]],
/* D31 */ [[4,18,25],[22,90,93],[48,17,18]],
/* D32 */ [[4,26,30],[22,94,96],[48,19,20]],
/* D33 */ [[4,31,34],[22,97,100],[48,21,22]],
/* D34 */ [[5,1,5],[22,101,103],[48,23,24]],
/* D35 */ [[5,6,11],[22,104,106],[49,1,2]],
/* D36 */ [[5,12,19],[22,107,109],[49,3,4]],
/* D37 */ [[5,20,24],[22,110,112],[49,5,6]],
/* D38 */ [[6,1,9],[22,113,115],[49,7,8]],
/* D39 */ [[6,10,21],[22,116,118],[49,9,10]],
/* D40 */ [[7,1,4],[22,119,119],[49,11,12]],
/* D41 */ [[8,1,7],[22,120,123],[49,13,14]],
/* D42 */ [[8,8,14],[22,124,126],[49,15,16]],
/* D43 */ [[8,15,23],[22,127,130],[49,17,18]],
/* D44 */ [[8,24,31],[22,131,133],[49,19,21]],
/* D45 */ [[9,1,7],[22,134,136],[50,1,2]],
/* D46 */ [[9,8,15],[22,137,140],[50,3,4]],
/* D47 */ [[9,16,24],[22,141,143],[50,5,6]],
/* D48 */ [[10,1,10],[22,144,147],[50,7,8]],
/* D49 */ [[10,11,17],[22,148,150],[50,9,10]],
/* D50 */ [[10,18,22],[23,1,4],[50,11,12]],
/* D51 */ [[11,1,8],[23,5,7],[50,13,14]],
/* D52 */ [[11,9,17],[23,8,10],[50,15,16]],
/* D53 */ [[11,18,25],[23,11,13],[50,17,18]],
/* D54 */ [[12,1,8],[23,14,16],[50,19,20]],
/* D55 */ [[12,9,17],[23,17,19],[50,21,22]],
/* D56 */ [[12,18,29],[23,20,22],[50,23,24]],
/* D57 */ [[13,1,9],[23,23,25],[50,25,26]],
/* D58 */ [[13,10,17],[23,26,28],[50,27,28]],
/* D59 */ [[13,18,23],[23,29,31],[51,1,2]],
/* D60 */ [[13,24,30],[24,1,3],[51,3,4]],
/* D61 */ [[13,31,36],[24,4,6],[51,5,6]],
/* D62 */ [[14,1,10],[24,7,9],[51,7,8]],
/* D63 */ [[15,1,13],[24,10,12],[51,9,10]],
/* D64 */ [[16,1,14],[25,1,3],[51,11,12]],
/* D65 */ [[17,1,8],[25,4,8],[51,13,14]],
/* D66 */ [[17,9,16],[26,1,3],[51,15,16]],
/* D67 */ [[18,1,16],[26,4,6],[52,1,2]],
/* D68 */ [[19,1,7],[26,7,9],[52,3,4]],
/* D69 */ [[19,8,16],[26,10,12],[52,5,6]],
/* D70 */ [[20,1,7],[26,13,15],[52,7,8]],
/* D71 */ [[20,8,15],[26,16,19],[52,9,10]],
/* D72 */ [[21,1,10],[27,1,2],[52,11,12]],
/* D73 */ [[21,11,22],[27,3,4],[52,13,14]],
/* D74 */ [[21,23,42],[27,5,6],[52,15,16]],
/* D75 */ [[28,1,11],[27,7,8],[53,1,2]],
/* D76 */ [[28,12,27],[27,9,10],[53,3,4]],
/* D77 */ [[28,28,40],[27,11,12],[53,5,6]],
/* D78 */ [[28,41,51],[27,13,14],[53,7,8]],
/* D79 */ [[28,52,66],[27,15,16],[53,9,10]],
/* D80 */ [[29,1,12],[27,17,18],[53,11,13]],
/* D81 */ [[29,13,27],[27,19,20],[54,1,6]],
/* D82 */ [[29,28,39],[27,21,22],[55,1,6]],
/* D83 */ [[29,40,52],[27,23,24],[56,1,4]],
/* D84 */ [[30,1,5],[27,25,26],[57,1,4]],
/* D85 */ [[31,1,6],[27,27,28],[58,1,5],[59,1,3]],
/* D86 */ [[32,1,14],[27,29,30],[60,1,6],[61,1,4]],
/* D87 */ [[32,15,23],[27,31,32],[62,1,3],[63,1,1]],
/* D88 */ [[32,24,36],[27,33,34],[64,1,13]],
/* D89 */ [[32,37,48],[27,35,36],[65,1,5]],
/* D90 */ [[33,1,14],[27,37,38],[66,1,5],[67,1,3]],
/* D91 */ [[34,1,14],[27,39,39],[68,1,5],[69,1,1],[70,1,1],[71,1,1]],
/* D92 */ [[35,1,3],[27,40,40],[72,1,4]],
/* D93 */ [[36,1,9],[27,41,42],[72,5,7]],
/* D94 */ [[37,1,1],[38,1,4],[27,43,44],[72,8,11]],
/* D95 */ [[39,1,7],[27,45,46],[72,12,14]],
/* D96 */ [[40,1,3],[41,1,3],[27,47,48],[72,15,16]],
/* D97 */ [[42,1,3],[43,1,2],[27,49,49],[72,17,18]],
/* D98 */ [[44,1,14],[27,50,50],[72,19,20]],
/* D99 */ [[45,1,4],[27,51,51],[72,21,22]],
/* D100*/ []
];

// ==========================================================
//  DEFAULT DATA GENERATOR
// ==========================================================
function _makeChapters(books) {
    var arr = [];
    for (var b = 0; b < books.length; b++) {
        var catid = books[b][0], firstId = books[b][1], count = books[b][2];
        for (var i = 0; i < count; i++) {
            arr.push({ id: firstId + i, catid: catid, val: i + 1, sel: 0, pur: 0 });
        }
    }
    return arr;
}

// ==========================================================
//  LoadFromJSON — initialises localStorage on first visit
// ==========================================================
function LoadFromJSON(key) {
    if (localStorage.getItem(key) !== null) return;
    var jsonArray;
    if (key === OldTestament_LSN) {
        jsonArray = [
            { id: 0,  val: 'ഉല്‍‍പത്തി Genesis' },
            { id: 1,  val: 'പുറപ്പാട് Exodus' },
            { id: 2,  val: 'ലേവ്യര്‍ Leviticus' },
            { id: 3,  val: 'സംഖ്യ Numbers' },
            { id: 4,  val: 'നിയമാവര്‍ത്തനം Deuteronomy' },
            { id: 5,  val: 'ജോഷ്വാ Joshua' },
            { id: 6,  val: 'ന്യായാധിപ‌ന്‍‍മാര്‍ Judges' },
            { id: 7,  val: 'റൂത്ത് Ruth' },
            { id: 8,  val: '1 സാമുവല്‍ 1 Samuel' },
            { id: 9,  val: '2 സാമുവല്‍ 2 Samuel' },
            { id: 10, val: '1 രാജാക്ക‌ന്‍‍മാര്‍ 1 Kings' },
            { id: 11, val: '2 രാജാക്ക‌ന്‍‍മാര്‍ 2 Kings' },
            { id: 12, val: '1 ദിനവൃത്താന്തം 1 Chronicles' },
            { id: 13, val: '2 ദിനവൃത്താന്തം 2 Chronicles' },
            { id: 14, val: 'എസ്രാ Ezra' },
            { id: 15, val: 'നെഹമിയ Nehemiah' },
            { id: 16, val: 'തോബിത് Tobit' },
            { id: 17, val: 'യൂദിത്ത് Judith' },
            { id: 18, val: 'എസ്തേര്‍ Esther' },
            { id: 19, val: '1 മക്കബായര്‍ 1 Maccabees' },
            { id: 20, val: '2 മക്കബായര്‍ 2 Maccabees' },
            { id: 21, val: 'ജോബ്  Job' },
            { id: 22, val: 'സങ്കീര്‍ത്തനങ്ങള്‍ Psalms' },
            { id: 23, val: 'സുഭാഷിതങ്ങള്‍ Proverbs' },
            { id: 24, val: 'സഭാപ്രസംഗക‌ന്‍ Ecclesiastes' },
            { id: 25, val: 'ഉത്തമഗീതം Song of Songs' },
            { id: 26, val: 'ജ്ഞാനം The Book of Wisdom' },
            { id: 27, val: 'പ്രഭാഷക‌ന്‍ Sirach' },
            { id: 28, val: 'ഏശയ്യാ Isaiah' },
            { id: 29, val: 'ജെറെമിയ Jeremiah' },
            { id: 30, val: 'വിലാപങ്ങള്‍ Lamentations' },
            { id: 31, val: 'ബാറൂക്ക് Baruch' },
            { id: 32, val: 'എസെക്കിയേല്‍ Ezekiel' },
            { id: 33, val: 'ദാനിയേല്‍ Daniel' },
            { id: 34, val: 'ഹോസിയാ Hosea' },
            { id: 35, val: 'ജോയേല്‍ Joel' },
            { id: 36, val: 'ആമോസ് Amos' },
            { id: 37, val: 'ഒബാദിയ Obadiah' },
            { id: 38, val: 'യോനാ  Jonah' },
            { id: 39, val: 'മിക്കാ Micah' },
            { id: 40, val: 'നാഹും Nahum' },
            { id: 41, val: 'ഹബക്കുക്ക് Habakkuk' },
            { id: 42, val: 'സെഫാനിയ Zephaniah' },
            { id: 43, val: 'ഹഗ്ഗായി Haggai' },
            { id: 44, val: 'സഖറിയാ Zechariah' },
            { id: 45, val: 'മലാക്കി Malachi' }
        ];
    } else if (key === NewTestament_LSN) {
        jsonArray = [
            { id: 46, val: 'മത്തായി Matthew' },
            { id: 47, val: 'മര്‍കോസ് Mark' },
            { id: 48, val: 'ലൂക്കാ Luke' },
            { id: 49, val: 'യോഹന്നാ‌ന്‍ John' },
            { id: 50, val: 'അപ്പ. പ്രവര്‍ത്തനങ്ങള്‍ Acts' },
            { id: 51, val: 'റോമാ  Romans' },
            { id: 52, val: '1 കൊറിന്തോസ് 1 Corinthians' },
            { id: 53, val: '2 കൊറിന്തോസ് 2 Corinthians' },
            { id: 54, val: 'ഗലാത്തിയാ Galatians' },
            { id: 55, val: 'എഫേസോസ് Ephesians' },
            { id: 56, val: 'ഫിലിപ്പി Philippians' },
            { id: 57, val: 'കൊളോസോസ് Colossians' },
            { id: 58, val: '1 തെസലോനിക്കാ 1 Thessalonians' },
            { id: 59, val: '2 തെസലോനിക്കാ 2 Thessalonians' },
            { id: 60, val: '1 തിമോത്തേയോസ് 1 Timothy' },
            { id: 61, val: '2 തിമോത്തേയോസ് 2 Timothy' },
            { id: 62, val: 'തീത്തോസ് Titus' },
            { id: 63, val: 'ഫിലെമോ‌ന്‍ Philemon' },
            { id: 64, val: 'ഹെബ്രായര്‍ Hebrews' },
            { id: 65, val: 'യാക്കോബ് James' },
            { id: 66, val: '1 പത്രോസ് 1 Peter' },
            { id: 67, val: '2 പത്രോസ് 2 Peter' },
            { id: 68, val: '1 യോഹന്നാ‌ന്‍ 1 John' },
            { id: 69, val: '2 യോഹന്നാ‌ന്‍ 2 John' },
            { id: 70, val: '3 യോഹന്നാ‌ന്‍ 3 John' },
            { id: 71, val: 'യുദാസ് Jude' },
            { id: 72, val: 'വെളിപാട് Revelation' }
        ];
    } else if (key === OldChapters) {
        jsonArray = _makeChapters(_OT_BOOKS_META);
    } else if (key === NewChapters) {
        jsonArray = _makeChapters(_NT_BOOKS_META);
    } else if (key === PrayerVersion) {
        jsonArray = '1.0';
    }
    if (jsonArray !== undefined) localStorage.setItem(key, JSON.stringify(jsonArray));
}

// ==========================================================
//  localStorage helpers — names preserved from original
// ==========================================================
function GetLocalStorage(key) {
    var raw = localStorage.getItem(key);
    if (raw === null) return [];
    try { return JSON.parse(raw); } catch (e) { return []; }
}

function AddLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

// ==========================================================
//  Data utilities — names preserved from original
// ==========================================================
function CheckExists(JSONObject, searchString) {
    for (var i = 0; i < JSONObject.length; i++) {
        if (JSONObject[i].val === searchString) return true;
    }
    return false;
}

function GetJSONValue(JSONObject, keyColumn, keyName, returnColumn) {
    for (var i = 0; i < JSONObject.length; i++) {
        if (JSONObject[i][keyColumn] === keyName) return JSONObject[i][returnColumn];
    }
    return null;
}

function GetNextID(JSONObject) {
    var max = 0;
    for (var i = 0; i < JSONObject.length; i++) {
        if (JSONObject[i].id > max) max = JSONObject[i].id;
    }
    return max + 1;
}

// ==========================================================
//  Initialize — name preserved from original
// ==========================================================
function Initialize() {
    LoadFromJSON(OldTestament_LSN);
    LoadFromJSON(OldChapters);
    LoadFromJSON(NewTestament_LSN);
    LoadFromJSON(NewChapters);
    LoadFromJSON(PrayerVersion);
}

// ==========================================================
//  Plan helpers
// ==========================================================

// Get the storage ID for catid + 1-based chapter number
function getChapterId(catid, chNum) {
    var firstId = _CATID_FIRSTID[catid];
    return firstId !== undefined ? firstId + chNum - 1 : null;
}

// Build a map of chapterId → sel state (0 or 1) from localStorage
function buildCheckedMap() {
    var map = {};
    var ot = GetLocalStorage(OldChapters);
    var nt = GetLocalStorage(NewChapters);
    for (var i = 0; i < ot.length; i++) map[ot[i].id] = ot[i].sel;
    for (var j = 0; j < nt.length; j++) map[nt[j].id] = nt[j].sel;
    return map;
}

// ==========================================================
//  Sibling-chapter support (e.g. Esther duplicate chapters)
//  Siblings share the same catid + val (chapter number) but
//  have different storage IDs — e.g. Greek additions.
// ==========================================================
var _SIBLING_MAP    = null; // chapterId → [siblingId, ...]
var _CHAPTER_PRIMARY = null; // chapterId → primaryId (the one the plan uses)

function _buildSiblingMap() {
    _SIBLING_MAP    = {};
    _CHAPTER_PRIMARY = {};
    var all = GetLocalStorage(OldChapters).concat(GetLocalStorage(NewChapters));
    var groups = {}; // "catid_val" → [id, ...]
    for (var i = 0; i < all.length; i++) {
        var key = all[i].catid + '_' + all[i].val;
        if (!groups[key]) groups[key] = [];
        groups[key].push(all[i].id);
    }
    for (var k in groups) {
        var ids = groups[k];
        // Primary ID = what getChapterId returns (metadata-driven, matches plan checkboxes)
        var parts   = k.split('_');
        var primary = getChapterId(parseInt(parts[0], 10), parseInt(parts[1], 10));
        if (primary === null) primary = ids[0];
        for (var j = 0; j < ids.length; j++) {
            _CHAPTER_PRIMARY[ids[j]] = primary;
            if (ids.length < 2) continue;
            var siblings = [];
            for (var m = 0; m < ids.length; m++) { if (m !== j) siblings.push(ids[m]); }
            _SIBLING_MAP[ids[j]] = siblings;
        }
    }
}

function getSiblingIds(chapterId) {
    if (!_SIBLING_MAP) _buildSiblingMap();
    return _SIBLING_MAP[chapterId] || [];
}

// Returns the plan-side ID for a chapter (primary metadata ID)
function getPrimaryChapterId(chapterId) {
    if (!_CHAPTER_PRIMARY) _buildSiblingMap();
    var p = _CHAPTER_PRIMARY[chapterId];
    return p !== undefined ? p : chapterId;
}

// ==========================================================
//  Distinct chapter stats — counts unique (catid, val) pairs
//  so duplicate chapters (e.g. Esther Greek additions) are
//  only counted once in totals and progress.
// ==========================================================
function _distinctStats(chapters) {
    var seenTot = {}, seenRead = {}, total = 0, read = 0;
    for (var i = 0; i < chapters.length; i++) {
        var key = chapters[i].catid + '_' + chapters[i].val;
        if (!seenTot[key]) { seenTot[key] = true; total++; }
        if (chapters[i].sel === 1 && !seenRead[key]) { seenRead[key] = true; read++; }
    }
    return { total: total, read: read };
}

// Count total/read chapters for one plan day (uses a pre-built map for efficiency).
// For chapters that have siblings (e.g. Esther), all OT copies must be read
// before the chapter counts as read in the plan.
function getDayStats(dayIndex, checkedMap) {
    var segments = PLAN_100[dayIndex];
    if (!segments || segments.length === 0) return { total: 0, read: 0 };
    var total = 0, read = 0;
    for (var s = 0; s < segments.length; s++) {
        var seg = segments[s];
        for (var ch = seg[1]; ch <= seg[2]; ch++) {
            var id = getChapterId(seg[0], ch);
            if (id !== null) {
                total++;
                if (checkedMap[id]) {
                    // If this chapter has sibling copies, all must also be checked
                    var sibs = getSiblingIds(id);
                    var allRead = true;
                    for (var si = 0; si < sibs.length; si++) {
                        if (!checkedMap[sibs[si]]) { allRead = false; break; }
                    }
                    if (allRead) read++;
                }
            }
        }
    }
    return { total: total, read: read };
}

// Find which plan day indices (0-based) contain a given chapter storage ID
function findPlanDaysForChapter(chapterId) {
    var days = [];
    for (var d = 0; d < 99; d++) {
        var segs = PLAN_100[d];
        if (!segs) continue;
        for (var s = 0; s < segs.length; s++) {
            var seg = segs[s];
            var fromId = getChapterId(seg[0], seg[1]);
            var toId   = getChapterId(seg[0], seg[2]);
            if (fromId !== null && chapterId >= fromId && chapterId <= toId) {
                days.push(d);
                break;
            }
        }
    }
    return days;
}

// ==========================================================
//  Select_Item — name & logic preserved from original
// ==========================================================
function Select_Item(checked, id, keyColumn, attrId) {
    var numId = parseInt(id, 10);

    function updateArray(storageKey) {
        var items = GetLocalStorage(storageKey);
        var changed = false;
        for (var i = 0; i < items.length; i++) {
            if (items[i][keyColumn] === numId) {
                if (USL_LST_ATTR === attrId) items[i][PUR_LST_ATTR] = 0;
                items[i][attrId] = checked ? 1 : 0;
                changed = true;
            }
        }
        if (changed) AddLocalStorage(storageKey, JSON.stringify(items));
    }

    updateArray(OldChapters);
    updateArray(NewChapters);

    BindDashboard();
}

// ==========================================================
//  AlertMessage — name preserved, toast-based
// ==========================================================
function AlertMessage(msgType, message) {
    var typeMap = { Success:'toast-success', Info:'toast-info', Warning:'toast-warning', Danger:'toast-danger' };
    var area = document.getElementById('toast-area');
    if (!area) return;
    var el = document.createElement('div');
    el.className   = 'toast ' + (typeMap[msgType] || 'toast-info');
    el.textContent = message;
    area.appendChild(el);
    el.addEventListener('animationend', function () {
        if (el.parentNode) el.parentNode.removeChild(el);
    });
}

// ==========================================================
//  updateBookItemStatus — update badge + status class for a
//  book-item element in the main accordion
// ==========================================================
function updateBookItemStatus(bookItem) {
    var allBoxes = bookItem.querySelectorAll('input[type=checkbox]');

    // Group by displayed chapter number to handle duplicate chapters (e.g. Esther).
    // A chapter is "read" if ANY of its duplicate entries is checked.
    var groups = {}; // chapterNumber → anyChecked
    for (var i = 0; i < allBoxes.length; i++) {
        var box = allBoxes[i].nextElementSibling;
        var chNum = box ? box.textContent.trim() : String(i);
        if (!(chNum in groups)) groups[chNum] = false;
        if (allBoxes[i].checked) groups[chNum] = true;
    }

    var total = 0, checked = 0;
    for (var n in groups) { total++; if (groups[n]) checked++; }

    var badge = document.getElementById('badge-' + bookItem.dataset.catid);
    if (badge) badge.textContent = checked + '/' + total;

    bookItem.classList.remove('status-complete', 'status-partial');
    if (checked === total && total > 0) bookItem.classList.add('status-complete');
    else if (checked > 0)              bookItem.classList.add('status-partial');
}

// ==========================================================
//  syncCheckboxes — propagate a check/uncheck to all other
//  views (main accordion ↔ plan) in real-time
// ==========================================================
function syncCheckboxes(chapterId, isChecked, skipEl) {
    var all = document.querySelectorAll('input[type=checkbox][value="' + chapterId + '"]');
    for (var i = 0; i < all.length; i++) {
        var inp = all[i];
        if (inp === skipEl) continue;
        if (inp.checked === isChecked) continue;
        inp.checked = isChecked;

        // Update parent container styling
        var bookItem = inp.closest('.book-item');
        if (bookItem) updateBookItemStatus(bookItem);
    }
}

// ==========================================================
//  updatePlanDayCard — refresh a plan day's badge/dot/tint
// ==========================================================
function updatePlanDayCard(dayIndex, dayCard, checkedMap) {
    var map = checkedMap || buildCheckedMap();
    var stats = getDayStats(dayIndex, map);
    var badge = document.getElementById('plan-badge-' + dayIndex);
    if (badge) badge.textContent = stats.read + '/' + stats.total;

    var dot = dayCard.querySelector('.plan-day-dot');
    dayCard.classList.remove('day-complete', 'day-partial');
    if (stats.total > 0 && stats.read === stats.total) {
        dayCard.classList.add('day-complete');
        if (dot) dot.textContent = '✓';
    } else if (stats.read > 0) {
        dayCard.classList.add('day-partial');
        if (dot) dot.textContent = '◑';
    } else {
        if (dot) dot.textContent = '○';
    }
}

// ==========================================================
//  BindDashboard — drives all 4 stat cards + plan strip
// ==========================================================
function BindDashboard() {
    var otChapters = GetLocalStorage(OldChapters);
    var ntChapters = GetLocalStorage(NewChapters);
    var otBooks    = GetLocalStorage(OldTestament_LSN);
    var ntBooks    = GetLocalStorage(NewTestament_LSN);

    // Use distinct (catid, val) counts so duplicate chapters (e.g. Esther) are not double-counted
    var otStats = _distinctStats(otChapters);
    var ntStats = _distinctStats(ntChapters);
    var otTotal = otStats.total, otRead = otStats.read;
    var ntTotal = ntStats.total, ntRead = ntStats.read;
    var total = otTotal + ntTotal, totalRead = otRead + ntRead;

    // Fully-completed books
    var booksTotal = otBooks.length + ntBooks.length, booksComplete = 0;
    function countBooks(books, chapters) {
        for (var k = 0; k < books.length; k++) {
            var catid = books[k].id;
            // Build distinct-val map for this book: val → anyRead
            var valRead = {}, valFound = false;
            for (var c = 0; c < chapters.length; c++) {
                if (chapters[c].catid !== catid) continue;
                valFound = true;
                var v = chapters[c].val;
                if (!(v in valRead)) valRead[v] = false;
                if (chapters[c].sel === 1) valRead[v] = true;
            }
            if (!valFound) continue;
            // Complete only if every distinct chapter number has been read
            var bookDone = true;
            for (var v2 in valRead) { if (!valRead[v2]) { bookDone = false; break; } }
            if (bookDone) booksComplete++;
        }
    }
    countBooks(otBooks, otChapters);
    countBooks(ntBooks, ntChapters);

    // 100-day plan progress (days 1-99; day 100 is rest)
    var checkedMap = buildCheckedMap();
    var planDaysComplete = 0;
    for (var d = 0; d < 99; d++) {
        var s = getDayStats(d, checkedMap);
        if (s.total > 0 && s.read === s.total) planDaysComplete++;
    }

    // Helpers
    function setRing(id, read, tot) {
        var el = document.getElementById(id);
        if (el) el.style.strokeDashoffset = RING_CIRC * (1 - (tot > 0 ? read / tot : 0));
    }
    function setText(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; }
    function pct(read, tot) { return tot > 0 ? Math.round(read / tot * 100) + '%' : '0%'; }

    setRing('ring-total', totalRead, total);
    setRing('ring-ot',    otRead,    otTotal);
    setRing('ring-nt',    ntRead,    ntTotal);

    setText('pct-total',   pct(totalRead, total));
    setText('pct-ot',      pct(otRead,    otTotal));
    setText('pct-nt',      pct(ntRead,    ntTotal));
    setText('count-total', totalRead + ' / ' + total);
    setText('count-ot',    otRead    + ' / ' + otTotal);
    setText('count-nt',    ntRead    + ' / ' + ntTotal);
    setText('count-books', booksComplete + ' / ' + booksTotal);

    var barBooks = document.getElementById('bar-books');
    if (barBooks) barBooks.style.width = (booksTotal > 0 ? Math.round(booksComplete / booksTotal * 100) : 0) + '%';

    // Plan strip
    setText('plan-days-count', planDaysComplete + ' / 99 days');
    var barPlan = document.getElementById('bar-plan');
    if (barPlan) barPlan.style.width = Math.round(planDaysComplete / 99 * 100) + '%';
}

// ==========================================================
//  BindAccordion — replaces jQuery UI accordion
// ==========================================================
function BindAccordion(containerId, categoryData, itemData, attrId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    var frag = document.createDocumentFragment();

    for (var ci = 0; ci < categoryData.length; ci++) {
        var cat = categoryData[ci], catid = cat.id;
        var arr = [];
        for (var k = 0; k < itemData.length; k++) {
            if (itemData[k].catid === catid) arr.push(itemData[k]);
        }
        if (arr.length === 0) continue;

        var checkedCount = 0;
        for (var n = 0; n < arr.length; n++) { if (arr[n][attrId] === 1) checkedCount++; }

        var statusClass = checkedCount === arr.length ? 'status-complete' : (checkedCount > 0 ? 'status-partial' : '');

        var bookItem = document.createElement('div');
        bookItem.className     = 'book-item' + (statusClass ? ' ' + statusClass : '');
        bookItem.dataset.catid = catid;

        var header = document.createElement('button');
        header.className = 'book-header';
        header.type      = 'button';
        header.setAttribute('aria-expanded', 'false');
        header.setAttribute('aria-controls', 'panel-' + catid);

        var nameSpan = document.createElement('span');
        nameSpan.className = 'book-name';

        var _mlN = document.createElement('span');
        _mlN.className   = 'lang-ml';
        _mlN.textContent = _BOOK_NAMES_ML[catid] || cat.val;

        var _sepN = document.createElement('span');
        _sepN.className   = 'lang-sep';
        _sepN.textContent = ' / ';

        var _enN = document.createElement('span');
        _enN.className   = 'lang-en';
        _enN.textContent = _BOOK_NAMES[catid] || cat.val;

        nameSpan.appendChild(_mlN);
        nameSpan.appendChild(_sepN);
        nameSpan.appendChild(_enN);

        var badge = document.createElement('span');
        badge.className   = 'book-badge';
        badge.id          = 'badge-' + catid;
        badge.textContent = checkedCount + '/' + arr.length;

        var chevron = document.createElement('span');
        chevron.className   = 'book-chevron';
        chevron.setAttribute('aria-hidden', 'true');
        chevron.textContent = '▾';

        header.appendChild(nameSpan);
        header.appendChild(badge);
        header.appendChild(chevron);

        var panel = document.createElement('div');
        panel.className = 'chapter-panel';
        panel.id        = 'panel-' + catid;
        panel.hidden    = true;

        var grid = document.createElement('div');
        grid.className = 'chapter-grid';

        for (var m = 0; m < arr.length; m++) {
            var ch = arr[m];
            var label = document.createElement('label');
            label.className = 'chk_container';
            var inp = document.createElement('input');
            inp.type    = 'checkbox';
            inp.value   = ch.id;
            inp.checked = (ch[attrId] === 1);
            var box = document.createElement('span');
            box.className   = 'chapter-box';
            box.textContent = ch.val;
            label.appendChild(inp);
            label.appendChild(box);
            grid.appendChild(label);
        }

        panel.appendChild(grid);
        bookItem.appendChild(header);
        bookItem.appendChild(panel);
        frag.appendChild(bookItem);
    }

    container.appendChild(frag);
    BindCheckBoxClick(containerId, attrId);
}

// ==========================================================
//  BindCheckBoxClick — delegated event for main accordion
// ==========================================================
function BindCheckBoxClick(containerId, attrId) {
    var container = document.getElementById(containerId);
    if (!container || container._eventsAttached) return;
    container._eventsAttached = true;

    container.addEventListener('change', function (e) {
        var inp = e.target;
        if (inp.type !== 'checkbox') return;

        Select_Item(inp.checked, inp.value, 'id', attrId);

        var bookItem = inp.closest('.book-item');
        if (!bookItem) return;

        updateBookItemStatus(bookItem);

        var chId     = parseInt(inp.value, 10);
        var siblings = getSiblingIds(chId);

        if (siblings.length > 0) {
            // ── Sibling chapter (e.g. Esther duplicate) ─────────────
            // OT copies are INDEPENDENT — do NOT auto-check the other copy.
            // Plan marks chapter as read only when ALL OT copies are checked.
            var freshMap   = buildCheckedMap();
            var allIds     = [chId].concat(siblings);
            var mergedRead = true;
            for (var si = 0; si < allIds.length; si++) {
                if (!freshMap[allIds[si]]) { mergedRead = false; break; }
            }
            var primaryId = getPrimaryChapterId(chId);
            // Push merged state to plan checkboxes ONLY — scoped to #plan-list
            // to avoid accidentally checking the OT primary accordion checkbox.
            var planList  = document.getElementById('plan-list');
            var planBoxes = planList ? planList.querySelectorAll('input[type=checkbox][value="' + primaryId + '"]') : [];
            for (var pi = 0; pi < planBoxes.length; pi++) {
                if (planBoxes[pi].checked !== mergedRead) {
                    planBoxes[pi].checked = mergedRead;
                }
            }
            // Refresh plan day card(s) containing this chapter
            var planDays = findPlanDaysForChapter(primaryId);
            for (var pd = 0; pd < planDays.length; pd++) {
                var planDayCard = document.querySelector('.plan-day[data-day="' + planDays[pd] + '"]');
                if (planDayCard) updatePlanDayCard(planDays[pd], planDayCard, freshMap);
            }
        } else {
            // ── Normal (non-sibling) chapter ─────────────────────────
            syncCheckboxes(chId, inp.checked, inp);
            var map       = buildCheckedMap();
            var planDays2 = findPlanDaysForChapter(chId);
            for (var pd2 = 0; pd2 < planDays2.length; pd2++) {
                var planDayCard2 = document.querySelector('.plan-day[data-day="' + planDays2[pd2] + '"]');
                if (planDayCard2) updatePlanDayCard(planDays2[pd2], planDayCard2, map);
            }
        }

        // Toast
        var toastCatid = parseInt(bookItem.dataset.catid, 10);
        var bookName   = getBookDisplayName(toastCatid);
        var chLabel    = inp.nextElementSibling ? inp.nextElementSibling.textContent : '';
        AlertMessage(inp.checked ? 'Success' : 'Info',
            bookName + ' — Ch.' + chLabel + (inp.checked ? ' marked as read.' : ' unmarked.'));
    });

    container.addEventListener('click', function (e) {
        var header = e.target.closest('.book-header');
        if (!header) return;
        var bookItem = header.closest('.book-item');
        var panel    = bookItem ? bookItem.querySelector('.chapter-panel') : null;
        if (!panel) return;
        var isOpen   = !panel.hidden;
        panel.hidden = isOpen;
        header.setAttribute('aria-expanded', String(!isOpen));
        bookItem.classList.toggle('open', !isOpen);
    });
}

// ==========================================================
//  BindUserData — name preserved from original
// ==========================================================
function BindUserData() {
    var otBooks    = GetLocalStorage(OldTestament_LSN);
    var otChapters = GetLocalStorage(OldChapters);
    var ntBooks    = GetLocalStorage(NewTestament_LSN);
    var ntChapters = GetLocalStorage(NewChapters);

    BindAccordion(USR_LST_ACC, otBooks, otChapters, USL_LST_ATTR);
    BindAccordion(PUR_LST_ACC, ntBooks, ntChapters, PUR_LST_ATTR);
}

// ==========================================================
//  BindPlan — renders all 100 day card headers (lazy body)
// ==========================================================
function BindPlan() {
    var container = document.getElementById('plan-list');
    if (!container || container._planBound) return;
    container._planBound = true;
    container.innerHTML  = '';

    var checkedMap = buildCheckedMap();
    var frag       = document.createDocumentFragment();

    for (var d = 0; d < 100; d++) {
        var segments  = PLAN_100[d];
        var isRestDay = (d === 99);
        var stats     = isRestDay ? { total: 0, read: 0 } : getDayStats(d, checkedMap);

        var statusClass = '';
        if (isRestDay)                                       statusClass = 'day-rest';
        else if (stats.total > 0 && stats.read === stats.total) statusClass = 'day-complete';
        else if (stats.read > 0)                             statusClass = 'day-partial';

        // Summary line  e.g. "Genesis 1-5 • Psalms 1-3 • Matthew 1-2"
        var summaryObj = isRestDay ? null : _makeDaySummary(segments);

        var dayCard = document.createElement('div');
        dayCard.className  = 'plan-day' + (statusClass ? ' ' + statusClass : '');
        dayCard.dataset.day = d;

        var header = document.createElement('button');
        header.className = 'plan-day-header';
        header.type      = 'button';
        header.setAttribute('aria-expanded', 'false');
        if (isRestDay) header.disabled = true;

        var numEl = document.createElement('span');
        numEl.className   = 'plan-day-num';
        numEl.textContent = 'Day ' + (d + 1);

        var summEl = document.createElement('span');
        summEl.className = 'plan-day-summary';
        if (isRestDay) {
            summEl.textContent = 'Day of Rest & Reflection';
        } else {
            var mlS = document.createElement('span');
            mlS.className   = 'lang-ml';
            mlS.textContent = summaryObj.ml;
            var sepS = document.createElement('span');
            sepS.className   = 'lang-sep';
            sepS.textContent = ' / ';
            var enS = document.createElement('span');
            enS.className   = 'lang-en';
            enS.textContent = summaryObj.en;
            summEl.appendChild(mlS);
            summEl.appendChild(sepS);
            summEl.appendChild(enS);
        }

        var badgeEl = document.createElement('span');
        badgeEl.className = 'plan-day-badge';
        badgeEl.id        = 'plan-badge-' + d;
        if (!isRestDay) badgeEl.textContent = stats.read + '/' + stats.total;

        var dotEl = document.createElement('span');
        dotEl.className   = 'plan-day-dot';
        dotEl.setAttribute('aria-hidden', 'true');
        dotEl.textContent = isRestDay ? '✦' :
                            (stats.total > 0 && stats.read === stats.total) ? '✓' :
                            stats.read > 0 ? '◑' : '○';

        var chevron = document.createElement('span');
        chevron.className   = 'book-chevron';
        chevron.setAttribute('aria-hidden', 'true');
        chevron.textContent = '▾';

        header.appendChild(numEl);
        header.appendChild(summEl);
        header.appendChild(badgeEl);
        header.appendChild(dotEl);
        if (!isRestDay) header.appendChild(chevron);

        // Body (lazy)
        var body = document.createElement('div');
        body.className        = 'plan-day-body';
        body.hidden           = true;
        body.dataset.rendered = '0';

        if (isRestDay) {
            body.innerHTML = '<div class="plan-rest-body">✦ Rest, reflect and give thanks for completing another day in the Word. ✦</div>';
            body.dataset.rendered = '1';
        }

        dayCard.appendChild(header);
        dayCard.appendChild(body);
        frag.appendChild(dayCard);
    }

    container.appendChild(frag);

    // ── Event delegation ────────────────────────────────────
    // Accordion toggle
    container.addEventListener('click', function (e) {
        var header = e.target.closest('.plan-day-header');
        if (!header || header.disabled) return;
        var dayCard = header.closest('.plan-day');
        var body    = dayCard ? dayCard.querySelector('.plan-day-body') : null;
        if (!body) return;

        var isOpen   = !body.hidden;
        body.hidden  = isOpen;
        header.setAttribute('aria-expanded', String(!isOpen));
        dayCard.classList.toggle('open', !isOpen);

        // Lazy render on first open
        if (!isOpen && body.dataset.rendered === '0') {
            var idx = parseInt(dayCard.dataset.day, 10);
            BindPlanDayContent(idx, body);
            body.dataset.rendered = '1';
        }
    });

    // Mark-all / unmark-all buttons
    container.addEventListener('click', function (e) {
        var btn = e.target.closest('.plan-btn');
        if (!btn) return;
        var markAll  = btn.classList.contains('plan-btn-all');
        var dayCard  = btn.closest('.plan-day');
        if (!dayCard) return;
        var dayIdx   = parseInt(dayCard.dataset.day, 10);
        var segments = PLAN_100[dayIdx];
        if (!segments) return;

        var checkboxes = dayCard.querySelectorAll('input[type=checkbox]');
        for (var i = 0; i < checkboxes.length; i++) {
            var inp = checkboxes[i];
            var markChId = parseInt(inp.value, 10);
            if (inp.checked !== markAll) {
                inp.checked = markAll;
                Select_Item(markAll, markChId, 'id', USL_LST_ATTR);
                syncCheckboxes(markChId, markAll, inp);
            }
            // Always sync siblings so duplicate chapters stay consistent
            var markSiblings = getSiblingIds(markChId);
            for (var mi = 0; mi < markSiblings.length; mi++) {
                Select_Item(markAll, markSiblings[mi], 'id', USL_LST_ATTR);
                syncCheckboxes(markSiblings[mi], markAll, null);
            }
        }

        var map = buildCheckedMap();
        updatePlanDayCard(dayIdx, dayCard, map);

        // Also update book items in main accordion for all affected chapters
        var allInputs = dayCard.querySelectorAll('input[type=checkbox]');
        var updatedBooks = {};
        for (var j = 0; j < allInputs.length; j++) {
            var chId = parseInt(allInputs[j].value, 10);
            var planDays = findPlanDaysForChapter(chId);
            // Update main accordion badge for any books affected
            var mainInp = document.querySelector('#old-accordion input[value="' + chId + '"], #new-accordion input[value="' + chId + '"]');
            if (mainInp) {
                var bi = mainInp.closest('.book-item');
                if (bi && !updatedBooks[bi.dataset.catid]) {
                    updateBookItemStatus(bi);
                    updatedBooks[bi.dataset.catid] = true;
                }
            }
        }

        AlertMessage(markAll ? 'Success' : 'Info',
            'Day ' + (dayIdx + 1) + (markAll ? ' — all chapters marked as read.' : ' — all chapters unmarked.'));
    });

    // Chapter checkbox change
    container.addEventListener('change', function (e) {
        var inp = e.target;
        if (inp.type !== 'checkbox') return;

        Select_Item(inp.checked, inp.value, 'id', USL_LST_ATTR);

        var chId    = parseInt(inp.value, 10);
        syncCheckboxes(chId, inp.checked, inp);

        // Sync sibling chapters (e.g. Esther duplicate chapters) — OT/NT accordion ONLY.
        // Do NOT use syncCheckboxes() here: the sibling's storage ID may collide with
        // a different chapter's plan checkbox value, causing false ticks in the plan.
        var chSiblings = getSiblingIds(chId);
        for (var csi = 0; csi < chSiblings.length; csi++) {
            var sibId = chSiblings[csi];
            Select_Item(inp.checked, sibId, 'id', USL_LST_ATTR);
            var sibBoxes = document.querySelectorAll(
                '#old-accordion input[type=checkbox][value="' + sibId + '"],' +
                '#new-accordion input[type=checkbox][value="' + sibId + '"]'
            );
            for (var sb = 0; sb < sibBoxes.length; sb++) {
                if (sibBoxes[sb].checked !== inp.checked) {
                    sibBoxes[sb].checked = inp.checked;
                    var sibItem = sibBoxes[sb].closest('.book-item');
                    if (sibItem) updateBookItemStatus(sibItem);
                }
            }
        }

        var dayCard = inp.closest('.plan-day');
        if (dayCard) {
            var dayIdx = parseInt(dayCard.dataset.day, 10);
            updatePlanDayCard(dayIdx, dayCard);

            // Update affected book section badge inside plan body
            var bookSec = inp.closest('.plan-book-section');
            if (bookSec) {
                var allInp = bookSec.querySelectorAll('input[type=checkbox]');
                var tot = allInp.length, rd = 0;
                for (var i = 0; i < allInp.length; i++) { if (allInp[i].checked) rd++; }
                var bName = bookSec.querySelector('.plan-book-name');
                // Update the count span to show sub-progress
                if (bName) {
                    var cntEl = bName.querySelector('.plan-book-count');
                    if (cntEl) cntEl.textContent = ' (' + rd + '/' + tot + ')';
                }
            }
        }

        var planBookSec = inp.closest('.plan-book-section');
        var planBookName = planBookSec ? planBookSec.querySelector('.plan-book-name') : null;
        var lang = document.body.dataset.lang || 'both';
        var bookLabel = '';
        if (planBookName) {
            bookLabel = (lang === 'ml' ? planBookName.dataset.baseMl : planBookName.dataset.baseEn) || planBookName.dataset.baseEn || '';
        }
        AlertMessage(inp.checked ? 'Success' : 'Info',
            (bookLabel || 'Chapter') + ' Ch.' + (inp.nextElementSibling ? inp.nextElementSibling.textContent : '') +
            (inp.checked ? ' marked as read.' : ' unmarked.'));
    });
}

// Helper — build readable summary for a day (plain text, lang-aware)
// Returns { ml: string, en: string }
function _makeDaySummary(segments) {
    if (!segments || segments.length === 0) return { ml: '', en: '' };
    var mlParts = [], enParts = [];
    for (var s = 0; s < segments.length; s++) {
        var seg    = segments[s];
        var catid  = seg[0];
        var ml     = _BOOK_NAMES_ML[catid] || _BOOK_NAMES[catid] || '';
        var en     = _BOOK_NAMES[catid]    || '';
        var chStr  = seg[1] === seg[2] ? seg[1] : seg[1] + '-' + seg[2];
        mlParts.push(ml + ' ' + chStr);
        enParts.push(en + ' ' + chStr);
    }
    return { ml: mlParts.join(' • '), en: enParts.join(' • ') };
}

// ==========================================================
//  BindPlanDayContent — lazily render chapters for one day
// ==========================================================
function BindPlanDayContent(dayIndex, container) {
    var segments   = PLAN_100[dayIndex];
    if (!segments || segments.length === 0) return;

    var checkedMap = buildCheckedMap();
    var frag       = document.createDocumentFragment();

    // "Mark all / Unmark all" actions
    var actions = document.createElement('div');
    actions.className = 'plan-day-actions';
    var btnAll  = document.createElement('button');
    btnAll.type      = 'button';
    btnAll.className = 'plan-btn plan-btn-all';
    btnAll.textContent = '✓ Mark Day as Read';
    var btnNone = document.createElement('button');
    btnNone.type      = 'button';
    btnNone.className = 'plan-btn plan-btn-none';
    btnNone.textContent = '✕ Unmark All';
    actions.appendChild(btnAll);
    actions.appendChild(btnNone);
    frag.appendChild(actions);

    for (var s = 0; s < segments.length; s++) {
        var seg      = segments[s];
        var catid    = seg[0];
        var fromCh   = seg[1];
        var toCh     = seg[2];
        var chRange  = fromCh + (fromCh !== toCh ? '–' + toCh : '');
        var labelEN  = (_BOOK_NAMES[catid]    || 'Book ' + catid) + ' ' + chRange;
        var labelML  = (_BOOK_NAMES_ML[catid] || _BOOK_NAMES[catid] || 'Book ' + catid) + ' ' + chRange;

        // Count read in this segment
        var segTotal = toCh - fromCh + 1, segRead = 0;
        for (var ch = fromCh; ch <= toCh; ch++) {
            var cid = getChapterId(catid, ch);
            if (cid !== null && checkedMap[cid]) segRead++;
        }

        var section = document.createElement('div');
        section.className = 'plan-book-section';

        var nameEl = document.createElement('div');
        nameEl.className        = 'plan-book-name';
        nameEl.dataset.baseEn   = labelEN;
        nameEl.dataset.baseMl   = labelML;

        var mlNameSpan  = document.createElement('span');
        mlNameSpan.className   = 'lang-ml';
        mlNameSpan.textContent = labelML;
        var sepNameSpan = document.createElement('span');
        sepNameSpan.className   = 'lang-sep';
        sepNameSpan.textContent = ' / ';
        var enNameSpan  = document.createElement('span');
        enNameSpan.className   = 'lang-en';
        enNameSpan.textContent = labelEN;
        var cntSpan = document.createElement('span');
        cntSpan.className   = 'plan-book-count';
        cntSpan.textContent = ' (' + segRead + '/' + segTotal + ')';

        nameEl.appendChild(mlNameSpan);
        nameEl.appendChild(sepNameSpan);
        nameEl.appendChild(enNameSpan);
        nameEl.appendChild(cntSpan);

        var grid = document.createElement('div');
        grid.className = 'chapter-grid';

        for (var c = fromCh; c <= toCh; c++) {
            var chId = getChapterId(catid, c);
            if (chId === null) continue;

            var lbl = document.createElement('label');
            lbl.className = 'chk_container';

            var inp = document.createElement('input');
            inp.type    = 'checkbox';
            inp.value   = chId;
            // For sibling chapters: checked in plan only when ALL OT copies are read
            var _chSibs  = getSiblingIds(chId);
            var _chRead  = (checkedMap[chId] === 1);
            if (_chRead && _chSibs.length > 0) {
                for (var _si = 0; _si < _chSibs.length; _si++) {
                    if (!checkedMap[_chSibs[_si]]) { _chRead = false; break; }
                }
            }
            inp.checked = _chRead;

            var box = document.createElement('span');
            box.className   = 'chapter-box';
            box.textContent = c;

            lbl.appendChild(inp);
            lbl.appendChild(box);
            grid.appendChild(lbl);
        }

        section.appendChild(nameEl);
        section.appendChild(grid);
        frag.appendChild(section);
    }

    container.appendChild(frag);
}

// ==========================================================
//  Day / Night theme toggle
// ==========================================================
var ThemePref_LSN = 'theme_pref@$111';

function initThemeToggle() {
    var saved = localStorage.getItem(ThemePref_LSN) ||
                (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    _applyTheme(saved);

    var btn = document.getElementById('theme-btn');
    if (btn) {
        btn.addEventListener('click', function () {
            var next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
            _applyTheme(next);
            localStorage.setItem(ThemePref_LSN, next);
        });
    }
}

function _applyTheme(theme) {
    document.body.dataset.theme = theme;
    var btn = document.getElementById('theme-btn');
    if (btn) btn.title = theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode';
}

// ==========================================================
//  Reset reading progress
// ==========================================================
function initResetModal() {
    var btn     = document.getElementById('reset-btn');
    var modal   = document.getElementById('reset-modal');
    var cancel  = document.getElementById('reset-cancel');
    var confirm = document.getElementById('reset-confirm');
    if (!btn || !modal) return;

    btn.addEventListener('click', function () {
        modal.hidden = false;
        cancel.focus();
    });

    cancel.addEventListener('click', function () {
        modal.hidden = true;
    });

    // Close on overlay click (outside the box)
    modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.hidden = true;
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
        if (!modal.hidden && (e.key === 'Escape' || e.key === 'Esc')) {
            modal.hidden = true;
        }
    });

    confirm.addEventListener('click', function () {
        modal.hidden = true;
        doReset();
    });
}

function doReset() {
    // Clear all reading progress keys
    localStorage.removeItem(OldTestament_LSN);
    localStorage.removeItem(OldChapters);
    localStorage.removeItem(NewTestament_LSN);
    localStorage.removeItem(NewChapters);
    localStorage.removeItem(PrayerVersion);

    // Invalidate sibling map cache (will rebuild from fresh data)
    _SIBLING_MAP    = null;
    _CHAPTER_PRIMARY = null;

    // Re-initialise localStorage with default (all-unread) data
    Initialize();

    // Re-render OT accordion
    var otContainer = document.getElementById(USR_LST_ACC);
    if (otContainer) {
        otContainer._eventsAttached = false;
        otContainer.innerHTML = '';
    }
    // Re-render NT accordion
    var ntContainer = document.getElementById(PUR_LST_ACC);
    if (ntContainer) {
        ntContainer._eventsAttached = false;
        ntContainer.innerHTML = '';
    }
    BindUserData();

    // Re-render 100-day plan if it was ever opened
    var planList = document.getElementById('plan-list');
    if (planList) {
        planList._planBound = false;
        planList.innerHTML  = '';
        // Only re-bind if the plan tab is currently visible
        if (!document.getElementById('pane-plan').hidden) {
            BindPlan();
        }
    }

    BindDashboard();
    AlertMessage('Info', 'All reading progress has been reset.');
}

// ==========================================================
//  Language switcher
// ==========================================================
function initLangToggle() {
    var saved = localStorage.getItem(LangPref_LSN) || 'both';
    _applyLang(saved);

    var btns = document.querySelectorAll('.lang-opt[data-lang]');
    btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            _applyLang(btn.dataset.lang);
            localStorage.setItem(LangPref_LSN, btn.dataset.lang);
        });
    });
}

function _applyLang(lang) {
    document.body.dataset.lang = lang;
    var btns = document.querySelectorAll('.lang-opt[data-lang]');
    btns.forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

// ==========================================================
//  Tab switching
// ==========================================================
function initTabs() {
    var tabBtns   = document.querySelectorAll('.tab-btn[data-pane]');
    var planBound = false;

    tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetId = btn.dataset.pane;

            tabBtns.forEach(function (b) {
                var active = (b.dataset.pane === targetId);
                b.classList.toggle('active', active);
                b.setAttribute('aria-selected', String(active));
            });

            document.querySelectorAll('.tab-pane').forEach(function (pane) {
                var show = (pane.id === targetId);
                pane.classList.toggle('active', show);
                pane.hidden = !show;
            });

            // Lazy-init the 100-day plan on first visit
            if (targetId === 'pane-plan' && !planBound) {
                BindPlan();
                planBound = true;
            }
        });
    });
}

// ==========================================================
//  Boot
// ==========================================================
document.addEventListener('DOMContentLoaded', function () {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    Initialize();
    _buildSiblingMap();
    initThemeToggle();
    initLangToggle();
    initResetModal();
    BindUserData();
    BindDashboard();
    initTabs();
});
