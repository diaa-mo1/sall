// ═══════════════════════════════════════════════════
//  Database — NeDB (Pure JS, no native deps)
// ═══════════════════════════════════════════════════
'use strict';

const Datastore = require('nedb');
const path      = require('path');
const bcrypt    = require('bcryptjs');

const dbDir = path.join(__dirname, 'data');
require('fs').mkdirSync(dbDir, { recursive: true });

// ── Collections ────────────────────────────────────
const db = {
  admins:   new Datastore({ filename: path.join(dbDir, 'admins.db'),   autoload: true }),
  awrad:    new Datastore({ filename: path.join(dbDir, 'awrad.db'),    autoload: true }),
  audio:    new Datastore({ filename: path.join(dbDir, 'audio.db'),    autoload: true }),
  videos:   new Datastore({ filename: path.join(dbDir, 'videos.db'),   autoload: true }),
  dalail:   new Datastore({ filename: path.join(dbDir, 'dalail.db'),   autoload: true }),
  settings: new Datastore({ filename: path.join(dbDir, 'settings.db'), autoload: true }),
};

// ── Promisify helpers ─────────────────────────────
db.findOne  = (col, q)       => new Promise((res,rej) => db[col].findOne(q,  (e,d)=>e?rej(e):res(d)));
db.find     = (col, q, sort) => new Promise((res,rej) => {
  let cursor = db[col].find(q);
  if (sort) cursor = cursor.sort(sort);
  cursor.exec((e,d)=>e?rej(e):res(d));
});
db.insert   = (col, doc)     => new Promise((res,rej) => db[col].insert(doc, (e,d)=>e?rej(e):res(d)));
db.update   = (col, q, upd)  => new Promise((res,rej) => db[col].update(q, {$set:upd}, {returnUpdatedDocs:true}, (e,_,d)=>e?rej(e):res(d)));
db.remove   = (col, q)       => new Promise((res,rej) => db[col].remove(q, {}, (e,n)=>e?rej(e):res(n)));
db.count    = (col, q)       => new Promise((res,rej) => db[col].count(q,    (e,n)=>e?rej(e):res(n)));

// ── Seed default data ─────────────────────────────
async function seed() {

  // Default admin
  const existing = await db.findOne('admins', { username: 'admin' });
  if (!existing) {
    const hash = await bcrypt.hash('admin123', 10);
    await db.insert('admins', {
      username: 'admin',
      password: hash,
      name: 'مدير الموقع',
      createdAt: new Date().toISOString()
    });
    console.log('✓ Default admin created (admin / admin123)');
  }

  // Settings
  const settings = await db.findOne('settings', { key: 'daily_wird_id' });
  if (!settings) {
    await db.insert('settings', { key: 'daily_wird_id', value: null });
    await db.insert('settings', { key: 'site_name',    value: 'الطريقة البيومية الأحمدية — السادة آل سلَّام' });
  }

  // Seed Awrad
  const awradCount = await db.count('awrad', {});
  if (awradCount === 0) {
    const awrad = [
      { slug:'wird-sabahi',  title:'الورد الصباحي',                    category:'يومي',    description:'بداية اليوم بذكر الله والصلاة على النبي ﷺ',           text:'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ\n\nالْحَمْدُ للهِ رَبِّ الْعَالَمِينَ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى أَشْرَفِ الْمُرْسَلِينَ سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ أَجْمَعِينَ.\n\nاللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.', audioFile:null, duration:'15:30', order:1, createdAt:new Date().toISOString() },
      { slug:'wird-masai',   title:'الورد المسائي',                    category:'يومي',    description:'أذكار المساء لتحصين القلب والروح',                      text:'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ\n\nاللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ.', audioFile:null, duration:'18:45', order:2, createdAt:new Date().toISOString() },
      { slug:'hizb-bahr',    title:'حزب البحر',                        category:'أسبوعي', description:'الحزب المبارك للإمام الشاذلي رضي الله عنه',               text:'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ\n\nيَا اللهُ يَا عَلِيُّ يَا عَظِيمُ يَا حَلِيمُ، يَا عَلِيمُ أَنْتَ رَبِّي وَعِلْمُكَ حَسْبِي...', audioFile:null, duration:'32:10', order:3, createdAt:new Date().toISOString() },
      { slug:'wird-asasi',   title:'الورد الأساسي للطريقة البيومية',   category:'أساسي',   description:'الورد الجامع الذي يمثل نواة السلوك في الطريقة الأحمدية البيومية، يجمع بين الاستغفار والصلاة على النبي ﷺ وكلمة التوحيد مع أسرار الأسماء الحسنى.', text:'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ\n\nأَسْتَغْفِرُ اللهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ...\n\nاللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ...', audioFile:null, duration:'45:20', order:4, createdAt:new Date().toISOString() },
    ];
    for (const w of awrad) await db.insert('awrad', w);
    // Set default daily wird
    await db.update('settings', { key:'daily_wird_id' }, { value:'wird-asasi' });
    console.log('✓ Awrad seeded');
  }

  // Seed Audio
  const audioCount = await db.count('audio', {});
  if (audioCount === 0) {
    const tracks = [
      { slug:'track-burdah',      title:'قصيدة البردة الشريفة كاملة',   artist:'المنشد محمود ياسين التهامي', category:'قصائد',  audioFile:null, thumbnail:null, duration:'45:20', featured:true,  order:1, createdAt:new Date().toISOString() },
      { slug:'track-wird-asasi',  title:'الورد الأساسي للطريقة',         artist:'الشيخ أحمد البيومي',        category:'أذكار',  audioFile:null, thumbnail:null, duration:'45:20', featured:false, order:2, createdAt:new Date().toISOString() },
      { slug:'track-nabi-salam',  title:'يا نبي سلام عليك',              artist:'فرقة الرضوان',               category:'إنشاد',  audioFile:null, thumbnail:null, duration:'12:05', featured:false, order:3, createdAt:new Date().toISOString() },
      { slug:'track-majlis-dhikr',title:'مجلس الذكر الأسبوعي',           artist:'الزاوية الرئيسية',           category:'أذكار',  audioFile:null, thumbnail:null, duration:'28:30', featured:false, order:4, createdAt:new Date().toISOString() },
    ];
    for (const t of tracks) await db.insert('audio', t);
    console.log('✓ Audio tracks seeded');
  }

  // Seed Videos
  const videosCount = await db.count('videos', {});
  if (videosCount === 0) {
    const videos = [
      { slug:'video-hadra-hussein', title:'الحضرة الكبرى بمسجد الإمام الحسين', description:'تسجيل كامل للحضرة البيومية الكبرى في رحاب مولانا الإمام الحسين', category:'حضرات',    videoFile:null, thumbnail:null, youtubeId:null, duration:'1:45:00', featured:true,  order:1, createdAt:new Date().toISOString() },
      { slug:'video-majlis-juma',   title:'مجلس الذكر الأسبوعي — الجمعة',      description:'تسجيل لمجلس الذكر الأسبوعي يتضمن قصائد مختارة',              category:'حضرات',    videoFile:null, thumbnail:null, youtubeId:null, duration:'45:00', featured:false, order:2, createdAt:new Date().toISOString() },
      { slug:'video-muhad-tareeqa', title:'التعريف بالطريقة البيومية الأحمدية', description:'محاضرة شاملة في التعريف بالطريقة ونسبها وشيوخها',              category:'محاضرات', videoFile:null, thumbnail:null, youtubeId:null, duration:'32:15', featured:false, order:3, createdAt:new Date().toISOString() },
    ];
    for (const v of videos) await db.insert('videos', v);
    console.log('✓ Videos seeded');
  }

  // Seed Dalail
  const dalailCount = await db.count('dalail', {});
  if (dalailCount === 0) {
    const ahzab = [
      { number:1, arabicNumber:'الأوَّل',    title:'الحزب الأول',   preview:'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ...', text:'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ\n\nاللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ فِي الْعَالَمِينَ إِنَّكَ حَمِيدٌ مَجِيدٌ.', audioFile:null, duration:'22:15', order:1 },
      { number:2, arabicNumber:'الثَّانِي',  title:'الحزب الثاني',  preview:'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الأُمِّيِّ...', text:'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ\n\nاللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الأُمِّيِّ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ.', audioFile:null, duration:'19:40', order:2 },
      { number:3, arabicNumber:'الثَّالِث',  title:'الحزب الثالث',  preview:'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الفَاتِحِ لِمَا أُغْلِقَ...', text:'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ\n\nاللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الفَاتِحِ لِمَا أُغْلِقَ وَالْخَاتِمِ لِمَا سَبَقَ.', audioFile:null, duration:'24:00', order:3 },
      { number:4, arabicNumber:'الرَّابِع',  title:'الحزب الرابع',  preview:'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ عَدَدَ مَا فِي عِلْمِ اللهِ...', text:'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ\n\nاللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ عَدَدَ مَا فِي عِلْمِ اللهِ صَلَاةً دَائِمَةً بِدَوَامِ مُلْكِ اللهِ.', audioFile:null, duration:'21:30', order:4 },
      { number:5, arabicNumber:'الْخَامِس', title:'الحزب الخامس',  preview:'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ صَلَاةً تُنَجِّينَا بِهَا...', text:'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ\n\nاللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ صَلَاةً تُنَجِّينَا بِهَا مِنْ جَمِيعِ الْأَهْوَالِ وَالْآفَاتِ.', audioFile:null, duration:'20:15', order:5 },
      { number:6, arabicNumber:'السَّادِس', title:'الحزب السادس',  preview:'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ صَلَاةَ...', text:'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ\n\nاللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ صَلَاةً تَمْلَأُ الْخَزَائِنَ وَتَزِيدُ الْمَوَازِينَ.', audioFile:null, duration:'23:45', order:6 },
      { number:7, arabicNumber:'السَّابِع', title:'الحزب السابع',  preview:'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ نُورِ الْأَنْوَارِ...', text:'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ\n\nاللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ نُورِ الْأَنْوَارِ وَسِرِّ الْأَسْرَارِ وَسَيِّدِ الْأَبْرَارِ.', audioFile:null, duration:'18:55', order:7 },
      { number:8, arabicNumber:'الثَّامِن', title:'الحزب الثامن',  preview:'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الَّذِي مَلَأْتَ قَلْبَهُ...', text:'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ\n\nاللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الَّذِي مَلَأْتَ قَلْبَهُ مِنْ جَلَالِكَ وَعَيْنَهُ مِنْ جَمَالِكَ.', audioFile:null, duration:'25:10', order:8 },
    ];
    for (const h of ahzab) await db.insert('dalail', { ...h, createdAt: new Date().toISOString() });
    console.log('✓ Dalail seeded');
  }
}

seed().catch(console.error);

module.exports = db;
