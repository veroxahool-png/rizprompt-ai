(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const KEYS = { history: 'rizprompt_history_v1', draft: 'rizprompt_draft_v1', settings: 'rizprompt_settings_v1' };
  const DEFAULT_NEGATIVES = 'gerakan kaku, karakter tertukar, wajah berubah, pakaian berubah tanpa alasan, anggota tubuh tidak wajar, objek muncul tiba-tiba, kontinuitas buruk, kamera bergetar berlebihan, teks acak, watermark, kualitas buram';
  const templates = [
    { id:'action-fight', title:'Cinematic Action Choreography', category:'Aksi', icon:'⚡', description:'Aksi tangan kosong yang dinamis dengan blocking jelas, reaksi realistis, dan kontinuitas gerakan.', tags:['10 detik','Koreografi','Realistis'], values:{sceneTitle:'Koreografi aksi sinematik',sceneDescription:'Dua karakter saling berhadapan, menjaga jarak, lalu melakukan rangkaian gerakan bertahan dan menyerang yang terkoordinasi. Setiap gerakan memiliki persiapan, kontak yang terbaca, dan reaksi yang masuk akal. Akhiri dengan kedua karakter mengambil posisi siaga.',sceneType:'Aksi / pertarungan koreografi',atmosphere:'Tegang dan dinamis',cameraMovement:'Tracking shot halus',cameraFraming:'Medium-wide shot setinggi mata',actionPace:'Koreografi intens dengan reaksi realistis',visualStyle:'Live-action realistis'} },
    { id:'school-drama', title:'School Drama Scene', category:'Drama', icon:'🎭', description:'Adegan drama sekolah dengan ekspresi natural, jeda emosional, dan interaksi karakter yang jelas.', tags:['Emosional','Dialog','Live-action'], values:{sceneTitle:'Adegan drama di sekolah',sceneDescription:'Karakter utama berhenti di koridor sekolah dan berbicara dengan karakter kedua. Ekspresi berubah secara halus mengikuti percakapan. Beri jeda alami sebelum respons, pertahankan arah pandangan, lalu akhiri adegan dengan reaksi emosional yang tertahan.',sceneType:'Drama',atmosphere:'Hangat dan emosional',cameraMovement:'Slow push-in',cameraFraming:'Medium shot',actionPace:'Pergerakan lambat dan emosional',visualStyle:'Live-action realistis'} },
    { id:'sports-training', title:'Sports Training Session', category:'Olahraga', icon:'◉', description:'Sesi latihan olahraga dengan teknik tubuh masuk akal, tempo terukur, dan gerakan presisi.', tags:['Teknik','Gerakan natural','Gym'], values:{sceneTitle:'Latihan olahraga di gym',sceneDescription:'Karakter melakukan pemanasan singkat, masuk ke posisi yang benar, lalu menyelesaikan beberapa repetisi latihan dengan teknik konsisten. Gerakan dimulai dan berakhir dengan jelas, napas serta perpindahan berat badan terlihat natural.',sceneType:'Olahraga',atmosphere:'Ceria dan energik',cameraMovement:'Pan mengikuti subjek',cameraFraming:'Full-body shot',actionPace:'Gerakan olahraga teknis dan presisi',visualStyle:'Realistis sinematik'} },
    { id:'hero-entry', title:'Cinematic Hero Entrance', category:'Cinematic', icon:'✦', description:'Kemunculan karakter yang berwibawa dengan komposisi rapi, pencahayaan dramatis, dan timing sinematik.', tags:['Hero shot','Lighting','Cinematic'], values:{sceneTitle:'Kemunculan karakter sinematik',sceneDescription:'Karakter memasuki lokasi dengan langkah mantap, berhenti pada titik yang jelas, dan melihat ke arah tujuan. Gerakan pakaian dan lingkungan mengikuti gerak secara alami. Tahan komposisi sesaat sebelum adegan berakhir.',sceneType:'Cinematic lifestyle',atmosphere:'Epik dan megah',cameraMovement:'Slow push-in',cameraFraming:'Low angle sinematik',actionPace:'Gerakan natural, tegas, dan mengalir',visualStyle:'Realistis sinematik'} },
    { id:'quiet-emotion', title:'Quiet Emotional Moment', category:'Drama', icon:'☁', description:'Momen hening yang mengutamakan bahasa tubuh kecil, ekspresi, dan atmosfer lembut.', tags:['Subtle acting','Close-up','Natural light'], values:{sceneTitle:'Momen emosional yang hening',sceneDescription:'Karakter duduk diam, menarik napas secara natural, lalu memandang ke luar jendela. Jari dan bahu bergerak kecil mengikuti emosinya. Pertahankan kesunyian dan ekspresi yang halus tanpa gestur berlebihan.',sceneType:'Drama',atmosphere:'Hangat dan emosional',cameraMovement:'Slow push-in',cameraFraming:'Close-up ekspresif',actionPace:'Pergerakan lambat dan emosional',visualStyle:'Live-action realistis'} },
    { id:'street-sport', title:'Outdoor Sports Highlight', category:'Olahraga', icon:'🏃', description:'Sorotan aksi olahraga outdoor dengan subjek selalu terbaca dan lintasan gerak yang bersih.', tags:['Tracking','Outdoor','Energetic'], values:{sceneTitle:'Sorotan aksi olahraga outdoor',sceneDescription:'Karakter mulai dari posisi siap, bergerak melewati area latihan, melakukan satu gerakan inti yang terkontrol, lalu memperlambat gerakan sampai berhenti. Pertahankan orientasi tubuh serta arah gerak sepanjang adegan.',sceneType:'Olahraga',atmosphere:'Ceria dan energik',cameraMovement:'Tracking shot halus',cameraFraming:'Wide establishing shot',actionPace:'Gerakan olahraga teknis dan presisi',visualStyle:'Dokumenter realistis'} },
    { id:'mystery-reveal', title:'Mystery Reveal', category:'Cinematic', icon:'◒', description:'Adegan misteri yang membangun rasa ingin tahu menggunakan ruang, bayangan, dan timing.', tags:['Mystery','Low-key','Slow reveal'], values:{sceneTitle:'Misteri di ruangan redup',sceneDescription:'Karakter perlahan memasuki ruangan, berhenti ketika melihat sesuatu di luar frame, lalu menoleh secara bertahap. Bayangan dan detail latar terungkap sedikit demi sedikit. Akhiri dengan ekspresi penasaran, bukan gerakan mendadak.',sceneType:'Adegan bebas',atmosphere:'Misterius',cameraMovement:'Dolly out perlahan',cameraFraming:'Wide establishing shot',actionPace:'Gerakan natural, tegas, dan mengalir',visualStyle:'Realistis sinematik'} },
    { id:'free-scene', title:'Free Scene Blueprint', category:'Cinematic', icon:'✧', description:'Kerangka fleksibel untuk mengembangkan ide sendiri dengan arahan kamera dan kontinuitas.', tags:['Fleksibel','Custom','All-purpose'], values:{sceneTitle:'Adegan sinematik bebas',sceneDescription:'Subjek utama melakukan satu aksi yang mudah dibaca, diikuti respons lingkungan atau karakter lain yang relevan. Jaga hubungan ruang, arah pandangan, dan kontinuitas objek dari awal sampai akhir. Akhiri dengan komposisi yang jelas.',sceneType:'Adegan bebas',atmosphere:'Tegang dan dinamis',cameraMovement:'Kamera diam dan stabil',cameraFraming:'Medium-wide shot setinggi mata',actionPace:'Gerakan natural, tegas, dan mengalir',visualStyle:'Realistis sinematik'} }
  ];
  const iconsByCategory = { Aksi:'⚡', Drama:'🎭', Olahraga:'◉', Cinematic:'✦' };
  const state = { history: readStore(KEYS.history, []), settings: { outputLanguage:'id', autosave:true, confirmDelete:true, apiEndpoint:'/api/enhance', aiEnabled:false, ...readStore(KEYS.settings, {}) }, currentPromptId:null, latestPrompt:'', latestOutputMeta:null, activeTemplateFilter:'Semua', modalResolver:null };

  function readStore(key, fallback) {
    try { const raw = localStorage.getItem(key); if (!raw) return fallback; const value = JSON.parse(raw); return value ?? fallback; } catch { return fallback; }
  }
  function writeStore(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { toast('Penyimpanan penuh atau diblokir browser.', 'error'); return false; } }
  function esc(value='') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function toast(message, type='success') { const el = document.createElement('div'); el.className = `toast ${type}`; el.textContent = message; $('#toastRegion').append(el); setTimeout(() => el.remove(), 3400); }
  function makeId() { return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`; }
  function persistHistory() { writeStore(KEYS.history, state.history); updateCounts(); }
  function updateCounts() {
    const favs = state.history.filter(item => item.favorite);
    $('#historyCount').textContent = state.history.length;
    $('#favoriteCount').textContent = favs.length;
    $('#statTotal').textContent = state.history.length;
    $('#statFavorites').textContent = favs.length;
    $('#settingsHistoryCount').textContent = `${state.history.length} prompt`;
    $('#settingsFavoriteCount').textContent = `${favs.length} prompt`;
    $('#statTemplates').textContent = templates.length;
  }
  function switchView(name) {
    const valid = ['dashboard','generator','analyzer','templates','history','favorites','settings'].includes(name) ? name : 'dashboard';
    $$('.view').forEach(v => v.classList.toggle('active', v.id === `view-${valid}`));
    $$('.nav-item[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === valid));
    const label = ({dashboard:'Dashboard',generator:'Prompt Generator',analyzer:'SeePrompt Analyzer',templates:'Prompt Templates',history:'Riwayat Prompt',favorites:'Favorit',settings:'Pengaturan'})[valid];
    $('#currentCrumb').textContent = label;
    $('#sidebar').classList.remove('open'); $('#mobileMenu').setAttribute('aria-expanded','false');
    if (valid === 'dashboard') renderDashboard();
    if (valid === 'templates') renderTemplates();
    if (valid === 'history') renderLibrary('history');
    if (valid === 'favorites') renderLibrary('favorites');
    if (valid === 'settings') syncSettingsForm();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function getFormValues() {
    const val = id => $(`#${id}`).value.trim();
    const characters = $$('.character-row').map(row => ({ name: $('.character-name', row).value.trim(), ref: $('.character-ref-value', row).value.trim() })).filter(c => c.name || c.ref);
    return { model:val('model'), language:val('outputLanguage'), detail:val('detailLevel'), duration:val('duration'), aspect:val('aspectRatio'), style:val('visualStyle'), title:val('sceneTitle'), description:val('sceneDescription'), location:val('location'), timeMood:val('timeMood'), type:val('sceneType'), atmosphere:val('atmosphere'), characters, camera:val('cameraMovement'), framing:val('cameraFraming'), lighting:val('lighting'), pace:val('actionPace'), dialogueLanguage:val('dialogueLanguage'), audio:val('audioMood'), dialogue:val('dialogue'), negative:val('negativePrompt') };
  }
  function setField(id, value) { const el = $(`#${id}`); if (el && value != null) el.value = value; }
  function addCharacter(name='', ref='') {
    const holder = $('#characterList');
    if (holder.children.length >= 8) { toast('Maksimal 8 model untuk satu prompt.', 'error'); return; }
    const n = holder.children.length + 1;
    const row = document.createElement('div'); row.className = 'character-row';
    row.innerHTML = `<div class="character-ref">@${n}</div><label class="field"><span>Nama karakter</span><input class="character-name" maxlength="50" placeholder="Model ${n}" value="${esc(name || `Model ${n}`)}"></label><label class="field"><span>Referensi gambar</span><input class="character-ref-value" maxlength="40" placeholder="@image${n}" value="${esc(ref || `@image${n}`)}"></label><button class="remove-character" type="button" aria-label="Hapus model ${n}" title="Hapus model">×</button>`;
    $('.remove-character', row).addEventListener('click', () => { if (holder.children.length <= 1) { toast('Pertahankan setidaknya satu model.', 'error'); return; } row.remove(); reindexCharacters(); saveDraft(); updateConsistency(); });
    $$('.character-name, .character-ref-value', row).forEach(el => el.addEventListener('input', () => { saveDraft(); updateConsistency(); }));
    holder.append(row); reindexCharacters();
  }
  function reindexCharacters() { $$('.character-row').forEach((row, i) => { const index=i+1; $('.character-ref',row).textContent=`@${index}`; $('.remove-character',row).setAttribute('aria-label',`Hapus model ${index}`); }); }
  function resetCharacters(characters=null) {
    $('#characterList').innerHTML = '';
    const list = Array.isArray(characters) && characters.length ? characters : [{name:'Model 1',ref:'@image1'},{name:'Model 2',ref:'@image2'},{name:'Model 3',ref:'@image3'}];
    list.slice(0,8).forEach(c=>addCharacter(c.name,c.ref));
  }
  function generatePromptText(v) {
    const en = v.language === 'en';
    const charDesc = v.characters.map(c => `${c.name || 'Model'} (${c.ref || (en ? 'reference image' : 'gambar referensi')}): ${en ? 'Use the assigned reference as the identity anchor. Keep face, hairstyle, outfit, and body identity consistent throughout the entire clip.' : 'Gunakan referensi yang ditetapkan sebagai identitas utama. Pertahankan wajah, rambut, pakaian, dan identitas tubuh secara konsisten sepanjang klip.'}`).join('\n');
    const lines = [];
    if (en) {
      lines.push(`VIDEO PROMPT — ${v.model.toUpperCase()}`);
      lines.push(`Format: ${v.duration}, aspect ratio ${v.aspect}, visual style: ${v.style}.`);
      lines.push(`Scene title: ${v.title || 'Untitled scene'}.`);
      if (v.detail !== 'concise') lines.push(`Scene category: ${v.type}. Location: ${v.location || 'as described in the scene'}. Time and mood: ${v.timeMood || v.atmosphere}.`);
      lines.push('CHARACTER MAPPING'); lines.push(charDesc || 'Use the supplied subject references consistently.');
      lines.push('SCENE ACTION'); lines.push(v.description || 'Show a clearly readable action with a defined beginning, progression, and ending.');
      if (v.detail === 'very') lines.push(`Blocking and continuity: maintain clear spatial relationships, consistent screen direction, natural body mechanics, believable reactions, stable object positions, and continuous movement between action beats. Avoid abrupt unexplained changes.`);
      lines.push('CAMERA AND COMPOSITION'); lines.push(`Framing: ${v.framing}. Camera movement: ${v.camera}. Keep the main subject readable and the movement smooth, motivated, and coherent.`);
      lines.push('LIGHTING AND ATMOSPHERE'); lines.push(`Lighting: ${v.lighting}. Overall atmosphere: ${v.atmosphere}. Preserve natural shadows, coherent exposure, and consistent color across the shot.`);
      lines.push('MOTION QUALITY'); lines.push(`${v.pace}. Use anatomically plausible motion, clear anticipation and follow-through, realistic balance, and natural timing. Every movement should have a visible cause and result.`);
      if (v.dialogueLanguage !== 'Tidak ada dialog' || v.dialogue) lines.push(`DIALOGUE AND AUDIO\nDialogue language: ${v.dialogueLanguage}. ${v.dialogue ? `Exact dialogue: ${v.dialogue}` : 'Do not invent extra dialogue.'} ${v.audio ? `Audio atmosphere: ${v.audio}.` : ''} Keep lip movement synchronized with spoken words.`);
      else if (v.audio) lines.push(`AUDIO: ${v.audio}. Keep audio appropriate to the visible action.`);
      lines.push(`NEGATIVE PROMPT\nAvoid: ${v.negative || 'stiff motion, character swaps, inconsistent identity, unnatural anatomy, flicker, random text, watermark, and continuity errors'}.`);
      const modelDirective = v.model === 'Seedance 2.0 Fast' ? 'Keep instructions concise and prioritized: subject identity first, then the main action, camera, and continuity. Avoid competing actions or unnecessary scene complexity.' : v.model === 'Seedance 2.0 Mini' ? 'Favor one clear main action, a simple camera plan, readable framing, and a compact scene with stable identity. Avoid overcrowded choreography and too many simultaneous events.' : 'Follow the scene in clear temporal order, preserve reference identity and visual continuity, and keep camera movement motivated by the action.';
      lines.push(`MODEL-SPECIFIC DIRECTION (${v.model}): produce one coherent continuous clip. ${modelDirective} Do not add unrelated characters or unrequested events.`);
      if (v.detail === 'very') lines.push('QUALITY CONTROL: no identity drift, no duplicated limbs, no sudden wardrobe changes, no unexplained cuts, no visual flicker, and no camera motion beyond the specified direction. End on a stable, intentional final composition.');
    } else {
      lines.push(`PROMPT VIDEO — ${v.model.toUpperCase()}`);
      lines.push(`Format: durasi ${v.duration}, rasio aspek ${v.aspect}, gaya visual ${v.style}.`);
      lines.push(`Judul adegan: ${v.title || 'Adegan tanpa judul'}.`);
      if (v.detail !== 'concise') lines.push(`Kategori adegan: ${v.type}. Lokasi: ${v.location || 'sesuai deskripsi adegan'}. Waktu dan suasana: ${v.timeMood || v.atmosphere}.`);
      lines.push('PEMETAAN KARAKTER'); lines.push(charDesc || 'Gunakan referensi subjek yang tersedia secara konsisten.');
      lines.push('AKSI ADEGAN'); lines.push(v.description || 'Tampilkan aksi yang mudah dibaca dengan awal, perkembangan, dan akhir yang jelas.');
      if (v.detail === 'very') lines.push('Blocking dan kontinuitas: jaga hubungan ruang antar karakter, arah gerak yang konsisten, mekanika tubuh natural, reaksi masuk akal, posisi objek stabil, dan transisi gerakan yang berkesinambungan. Hindari perubahan mendadak tanpa sebab.');
      lines.push('KAMERA DAN KOMPOSISI'); lines.push(`Framing: ${v.framing}. Pergerakan kamera: ${v.camera}. Pastikan subjek utama mudah terlihat dan gerakan kamera halus, terarah, serta koheren.`);
      lines.push('PENCAHAYAAN DAN ATMOSFER'); lines.push(`Pencahayaan: ${v.lighting}. Atmosfer keseluruhan: ${v.atmosphere}. Pertahankan bayangan natural, eksposur konsisten, dan warna yang selaras sepanjang adegan.`);
      lines.push('KUALITAS GERAKAN'); lines.push(`${v.pace}. Gunakan gerakan tubuh yang masuk akal, persiapan dan penyelesaian gerak yang jelas, keseimbangan realistis, serta timing natural. Setiap gerakan memiliki sebab dan hasil yang terlihat.`);
      if (v.dialogueLanguage !== 'Tidak ada dialog' || v.dialogue) lines.push(`DIALOG DAN AUDIO\nBahasa dialog: ${v.dialogueLanguage}. ${v.dialogue ? `Dialog persis: ${v.dialogue}` : 'Jangan menambahkan dialog lain.'} ${v.audio ? `Suasana audio: ${v.audio}.` : ''} Selaraskan gerakan bibir dengan ucapan.`);
      else if (v.audio) lines.push(`AUDIO: ${v.audio}. Pastikan suara sesuai dengan aksi yang tampak.`);
      lines.push(`NEGATIVE PROMPT\nHindari: ${v.negative || 'gerakan kaku, karakter tertukar, identitas tidak konsisten, anatomi tidak wajar, flicker, teks acak, watermark, dan kesalahan kontinuitas'}.`);
      const modelDirective = v.model === 'Seedance 2.0 Fast' ? 'Susun instruksi secara ringkas dan berurutan: identitas subjek, aksi utama, kamera, lalu kontinuitas. Hindari aksi yang saling bersaing atau kompleksitas adegan yang tidak perlu.' : v.model === 'Seedance 2.0 Mini' ? 'Utamakan satu aksi utama yang jelas, arahan kamera sederhana, framing yang mudah dibaca, dan adegan ringkas dengan identitas stabil. Hindari koreografi terlalu padat dan terlalu banyak kejadian bersamaan.' : 'Ikuti adegan dalam urutan waktu yang jelas, pertahankan identitas referensi dan kontinuitas visual, serta gunakan gerakan kamera yang sesuai dengan aksi.';
      lines.push(`ARAHAN KHUSUS MODEL (${v.model}): hasilkan satu klip utuh yang koheren. ${modelDirective} Jangan menambahkan karakter yang tidak relevan atau kejadian yang tidak diminta.`);
      if (v.detail === 'very') lines.push('KONTROL KUALITAS: hindari perubahan identitas, anggota tubuh ganda, perubahan pakaian mendadak, potongan adegan tanpa sebab, flicker visual, dan gerakan kamera di luar arahan. Akhiri dengan komposisi final yang stabil dan disengaja.');
    }
    return lines.join('\n\n').trim();
  }
  function hasRequiredInputs(v) { if (!v.title) { setField('sceneTitle', $('#sceneTitle').value.trim()); $('#sceneTitle').focus(); toast('Isi judul atau ide utama terlebih dahulu.', 'error'); return false; } if (!v.description) { $('#sceneDescription').focus(); toast('Tambahkan deskripsi adegan agar prompt lebih terarah.', 'error'); return false; } return true; }
  function saveGeneratedPrompt(prompt, v) {
    const item = { id:makeId(), title:v.title || 'Prompt baru', prompt, model:v.model, duration:v.duration, aspect:v.aspect, language:v.language, favorite:false, createdAt:new Date().toISOString(), metadata:{...v,characters:v.characters} };
    state.history.unshift(item); state.history = state.history.slice(0,250); state.currentPromptId=item.id; state.latestPrompt=prompt; state.latestOutputMeta=item; persistHistory(); renderDashboard(); renderLibrary('history'); return item;
  }
  function showOutput(prompt, meta={}) {
    state.latestPrompt=prompt; state.latestOutputMeta={...(state.latestOutputMeta||{}),...meta};
    $('#promptOutput').value=prompt; $('#promptOutput').classList.add('visible'); $('#outputPlaceholder').hidden=true;
    const words=prompt.trim()?prompt.trim().split(/\s+/).length:0; $('#outputWords').textContent=`${words} kata`;
    $('#outputMeta').innerHTML=`<span>${esc(meta.model || $('#model').value)}</span><span>${esc(meta.aspect || $('#aspectRatio').value)}</span><span>${esc(meta.duration || $('#duration').value)}</span>`;
    $('#saveFavorite').textContent=(state.history.find(i=>i.id===state.currentPromptId)?.favorite)?'★ Favorit':'☆ Favorit';
    $('#saveFavorite').classList.toggle('is-favorite',!!state.history.find(i=>i.id===state.currentPromptId)?.favorite);
    runConsistencyCheck(getFormValues(), false);
  }
  function onGenerate() {
    const v=getFormValues(); if(!hasRequiredInputs(v)) return;
    const prompt=generatePromptText(v); const item=saveGeneratedPrompt(prompt,v); showOutput(prompt,item); toast('Prompt berhasil dibuat dan masuk ke riwayat.');
  }
  function toggleFavorite(id) { const item=state.history.find(x=>x.id===id); if(!item)return; item.favorite=!item.favorite; persistHistory(); if(state.currentPromptId===id) $('#saveFavorite').textContent=item.favorite?'★ Favorit':'☆ Favorit'; renderLibrary('history');renderLibrary('favorites');renderDashboard();toast(item.favorite?'Ditambahkan ke favorit.':'Dihapus dari favorit.'); }
  function toggleCurrentFavorite() { if(!state.latestPrompt) {toast('Buat atau muat prompt terlebih dahulu.','error');return;} let item=state.history.find(x=>x.id===state.currentPromptId); if(!item){item={id:makeId(),title:$('#sceneTitle').value.trim()||'Prompt tersimpan',prompt:state.latestPrompt,model:$('#model').value,duration:$('#duration').value,aspect:$('#aspectRatio').value,language:$('#outputLanguage').value,favorite:false,createdAt:new Date().toISOString(),metadata:getFormValues()};state.history.unshift(item);state.currentPromptId=item.id;} item.favorite=!item.favorite; persistHistory(); $('#saveFavorite').textContent=item.favorite?'★ Favorit':'☆ Favorit'; renderLibrary('favorites');renderLibrary('history');renderDashboard();toast(item.favorite?'Ditambahkan ke favorit.':'Dihapus dari favorit.'); }
  async function copyText(text) { if (!text) {toast('Tidak ada teks untuk disalin.','error');return;} try { if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(text);} else {const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();const ok=document.execCommand('copy');area.remove();if(!ok)throw new Error('copy failed');} toast('Teks berhasil disalin.'); } catch { toast('Tidak dapat menyalin otomatis. Pilih teks lalu salin manual.','error'); } }
  function downloadFile(filename, content, type='text/plain;charset=utf-8') { const blob=new Blob([content],{type}); const url=URL.createObjectURL(blob); const a=document.createElement('a');a.href=url;a.download=filename;a.style.display='none';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200); }
  function slugify(text) { return String(text||'prompt').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,45)||'prompt'; }
  function getDisplayedPrompt() { return $('#promptOutput').value.trim() || state.latestPrompt; }
  function loadHistoryItem(item) {
    if(!item)return; state.currentPromptId=item.id; state.latestPrompt=item.prompt; state.latestOutputMeta=item;
    const m=item.metadata||{}; const fields=['model','language','detail','duration','aspect','style','title','description','location','timeMood','type','atmosphere','camera','framing','lighting','pace','dialogueLanguage','audio','dialogue','negative'];
    const mapping={language:'outputLanguage',detail:'detailLevel',aspect:'aspectRatio',style:'visualStyle',title:'sceneTitle',description:'sceneDescription',timeMood:'timeMood',type:'sceneType',camera:'cameraMovement',framing:'cameraFraming',lighting:'lighting',pace:'actionPace',audio:'audioMood'};
    fields.forEach(k=>{const id=mapping[k]||k;if(m[k]!==undefined&&$(`#${id}`))setField(id,m[k]);});
    if(m.characters)resetCharacters(m.characters); else if(item.metadata?.characters)resetCharacters(item.metadata.characters);
    showOutput(item.prompt,item); switchView('generator'); toast('Prompt dimuat ke generator.');
  }
  function renderDashboard() {
    updateCounts(); const recent=$('#recentList'); recent.innerHTML=''; const items=state.history.slice(0,4); $('#recentEmpty').hidden=items.length>0;
    items.forEach(item=>{const row=document.createElement('div');row.className='recent-row';row.innerHTML=`<div class="recent-symbol">✳</div><div class="recent-main"><strong title="${esc(item.title)}">${esc(item.title)}</strong><small>${esc(item.model)} · ${esc(item.duration)} · ${formatDate(item.createdAt)}</small></div><div class="recent-actions"><button class="mini-action ${item.favorite?'is-favorite':''}" data-action="favorite" data-id="${item.id}" title="Favorit">${item.favorite?'★':'☆'}</button><button class="mini-action" data-action="load" data-id="${item.id}" title="Muat prompt">↗</button></div>`;recent.append(row);});
    const q=$('#quickTemplates');q.innerHTML=''; templates.slice(0,3).forEach(t=>{const b=document.createElement('button');b.className='quick-template';b.innerHTML=`<span class="quick-template-icon">${t.icon}</span><span class="quick-template-text"><strong>${esc(t.title)}</strong><small>${esc(t.category)} · ${esc(t.tags.slice(0,2).join(' · '))}</small></span><span class="arrow">→</span>`;b.addEventListener('click',()=>applyTemplate(t));q.append(b);});
  }
  function formatDate(value) { try {return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric'}).format(new Date(value));}catch{return 'Tanggal tidak diketahui';} }
  function renderTemplates() {
    const search=($('#templateSearch')?.value||'').trim().toLowerCase(); const grid=$('#templatesGrid');grid.innerHTML='';
    const shown=templates.filter(t=>(state.activeTemplateFilter==='Semua'||t.category===state.activeTemplateFilter)&&(!search||`${t.title} ${t.description} ${t.tags.join(' ')}`.toLowerCase().includes(search)));
    shown.forEach(t=>{const card=document.createElement('article');card.className='template-card';card.innerHTML=`<div class="template-card-top"><span class="template-icon">${t.icon}</span><span class="template-category">${esc(t.category.toUpperCase())}</span></div><h3>${esc(t.title)}</h3><p>${esc(t.description)}</p><div class="template-tags">${t.tags.map(tag=>`<span>${esc(tag)}</span>`).join('')}</div><button class="button button-outline" data-template="${t.id}">Gunakan template <span>→</span></button>`;grid.append(card);});
    if(!shown.length)grid.innerHTML='<div class="empty-state"><div class="empty-symbol">⌕</div><strong>Template tidak ditemukan</strong><p>Coba gunakan kata pencarian atau kategori lain.</p></div>';
  }
  function applyTemplate(template) {
    if(!template)return;
    Object.entries(template.values).forEach(([key,value])=>{const id=key; if($(`#${id}`))setField(id,value);});
    // Templates intentionally leave custom details and character reference mapping intact.
    switchView('generator'); updateDescriptionCount(); saveDraft(); updateConsistency(); toast(`Template “${template.title}” diterapkan.`);
  }
  function renderLibrary(type) {
    const isFav=type==='favorites'; const list=$(`#${isFav?'favoriteList':'historyList'}`); const empty=$(`#${isFav?'favoriteEmpty':'historyEmpty'}`); const search=($(`#${isFav?'favoriteSearch':'historySearch'}`).value||'').toLowerCase().trim();
    const items=state.history.filter(item=>(!isFav||item.favorite)&&(!search||`${item.title} ${item.prompt} ${item.model}`.toLowerCase().includes(search)));
    list.innerHTML=''; empty.hidden=items.length>0; $(`#${isFav?'favoriteResultsCount':'historyResultsCount'}`).textContent=`${items.length} item${items.length===1?'':'s'}`;
    items.forEach(item=>{const card=document.createElement('article');card.className='library-card';card.innerHTML=`<div class="library-card-icon">${item.favorite?'★':'✳'}</div><div class="library-card-body"><div class="library-card-top"><div><h3>${esc(item.title||'Prompt tanpa judul')}</h3><div class="library-card-meta"><span>${esc(item.model)}</span><span>·</span><span>${esc(item.duration)}</span><span>·</span><span>${esc(item.aspect)}</span><span>·</span><span>${formatDate(item.createdAt)}</span></div></div><button class="library-card-fav ${item.favorite?'active':''}" data-action="favorite" data-id="${item.id}" title="Favorit">${item.favorite?'★':'☆'}</button></div><p class="library-excerpt">${esc(item.prompt)}</p><div class="library-actions"><button class="button button-primary" data-action="load" data-id="${item.id}">Muat ke generator</button><button class="button button-outline" data-action="copy" data-id="${item.id}">Salin</button><button class="button button-outline" data-action="download" data-id="${item.id}">Ekspor TXT</button><button class="button button-outline" data-action="delete" data-id="${item.id}">Hapus</button></div></div>`;list.append(card);});
  }
  function updateDescriptionCount(){ const n=$('#sceneDescription').value.length;$('#descriptionCount').textContent=`${n}/2400`; }
  function saveDraft() { if(!state.settings.autosave)return; const values=getFormValues(); writeStore(KEYS.draft,values); $('#draftStatus').textContent='Aktif'; }
  function restoreDraft() { const d=readStore(KEYS.draft,null); if(!d)return; const mapping={language:'outputLanguage',detail:'detailLevel',aspect:'aspectRatio',style:'visualStyle',title:'sceneTitle',description:'sceneDescription',type:'sceneType',camera:'cameraMovement',framing:'cameraFraming',lighting:'lighting',pace:'actionPace',audio:'audioMood'}; const direct=['model','duration','location','timeMood','atmosphere','dialogueLanguage','dialogue','negative']; direct.forEach(k=>{if(d[k]!==undefined&&$(`#${k}`))setField(k,d[k]);}); Object.entries(mapping).forEach(([k,id])=>{if(d[k]!==undefined)setField(id,d[k]);}); if(d.characters)resetCharacters(d.characters); updateDescriptionCount(); }
  function updateConsistency() { runConsistencyCheck(getFormValues(),false); }
  function runConsistencyCheck(v, showToast=false) {
    const results=[]; const chars=v.characters.filter(c=>c.name||c.ref); const duplicateNames=chars.map(c=>c.name.toLowerCase()).filter((name,i,arr)=>name&&arr.indexOf(name)!==i); const duplicateRefs=chars.map(c=>c.ref.toLowerCase()).filter((ref,i,arr)=>ref&&arr.indexOf(ref)!==i);
    results.push({ok:chars.length>0&&chars.every(c=>c.name&&c.ref),text:chars.length?`${chars.length} model terdaftar dengan referensi gambar.`:'Belum ada model yang dipetakan.'});
    results.push({ok:duplicateNames.length===0&&duplicateRefs.length===0,text:duplicateNames.length||duplicateRefs.length?'Ada nama atau referensi gambar yang duplikat.':'Nama model dan referensi tidak duplikat.'});
    const missingNames=chars.filter(c=>c.name&&!c.ref); results.push({ok:missingNames.length===0,text:missingNames.length?`Referensi gambar kosong untuk ${missingNames.map(c=>c.name).join(', ')}.`:'Setiap nama model memiliki referensi gambar.'});
    results.push({ok:!!v.description,text:v.description?'Deskripsi adegan tersedia.':'Deskripsi adegan belum diisi.'});
    results.push({ok:!!v.negative,text:v.negative?'Negative prompt tersedia.':'Negative prompt kosong; tambahkan hal yang perlu dihindari.'});
    $('#consistencyResults').innerHTML=results.map(r=>`<div class="consistency-line"><span class="${r.ok?'check-good':'check-warn'}">${r.ok?'✓':'!'}</span><span>${esc(r.text)}</span></div>`).join('');
    const errors=results.filter(r=>!r.ok).length; $('#consistencyBadge').textContent=errors===0?'Tampak konsisten':`${errors} perhatian`; $('#consistencyBadge').style.color=errors===0?'#258d69':'#bd8a2a';
    if(showToast)toast(errors===0?'Pemeriksaan konsistensi tidak menemukan masalah dasar.':`Ada ${errors} hal yang sebaiknya diperiksa.`,errors===0?'success':'error');
  }
  function analyzePrompt(text) {
    const p=text.trim(); const low=p.toLowerCase(); const checks=[]; const suggestions=[]; let score=0;
    const hasAction=/(melakukan|berjalan|berlari|menoleh|berbicara|bergerak|menyerang|bertahan|memukul|melompat|duduk|berdiri|latihan|action|walk|run|turns|speaks|moves|fights|jumps|sits|stands|performs|moves|choreograph|enters|exits)/i.test(p);
    const hasCamera=/(kamera|camera|shot|framing|close-up|wide shot|tracking|pan |push-in|dolly|handheld|low angle|medium shot|orbit)/i.test(p);
    const hasCharacter=/(model\s*\d|@image\d|karakter|character|subjek|subject|protagonist)/i.test(p);
    const hasDuration=/(\b\d+\s*(detik|seconds?|sec|s\b)|duration|durasi)/i.test(p);
    const hasAspect=/(9:16|16:9|1:1|4:5|21:9|3:2|aspect ratio|rasio aspek)/i.test(p);
    const hasStyle=/(realistis|realistic|cinematic|sinematik|anime|dokumenter|documentary|3d|live-action)/i.test(p);
    const hasContinuity=/(konsisten|consisten|continuit|kontinuitas|natural|smooth|halus|tidak tertukar|identity|identitas|avoid|hindari|negative prompt)/i.test(p);
    const hasOrder=/(lalu|kemudian|setelah|sebelum|akhirnya|akhiri|berakhir|then|after|before|finally|ends with|beginning|awal|akhir)/i.test(p);
    const hasNegatives=/(negative prompt|hindari:|avoid:|jangan|do not|without|no watermark|tanpa watermark)/i.test(p);
    const lines=p.split(/\n+/).filter(s=>s.trim()); const hasStructure=lines.length>=3||/(scene|adegan|kamera|camera|lighting|pencahayaan|audio|dialog)/i.test(p);
    const add=(name,ok,weight,good,fix)=>{checks.push({name,ok});if(ok)score+=weight;else if(fix)suggestions.push(fix);};
    add('Struktur prompt',p.length>80&&hasStructure,18,'Struktur cukup terbaca.','Pisahkan prompt menjadi adegan, karakter, aksi, kamera, dan kualitas hasil.');
    add('Aksi dan urutan',hasAction&&hasOrder,18,'Aksi dan urutan kejadian cukup jelas.','Tuliskan aksi yang terlihat secara konkret, lalu jelaskan urutannya dengan “lalu”, “setelah”, atau urutan waktu.');
    add('Arahan kamera',hasCamera,14,'Ada arahan kamera.','Tambahkan framing dan pergerakan kamera, misalnya medium-wide shot dengan tracking halus.');
    add('Pemetaan karakter',hasCharacter,12,'Ada pengenal karakter atau subjek.','Beri label konsisten pada setiap karakter, misalnya Model 1 (@image1), Model 2 (@image2).');
    add('Durasi',hasDuration,8,'Durasi disebutkan.','Tentukan durasi klip, misalnya 10 detik.');
    add('Rasio aspek',hasAspect,6,'Rasio aspek disebutkan.','Tentukan rasio output, misalnya 9:16 untuk vertikal atau 16:9 untuk landscape.');
    add('Gaya visual',hasStyle,8,'Gaya visual ditentukan.','Sebutkan gaya yang diinginkan seperti realistis sinematik atau live-action.');
    add('Konsistensi',hasContinuity,9,'Ada arahan konsistensi.','Tambahkan instruksi untuk menjaga identitas, pakaian, arah gerak, serta posisi objek tetap konsisten.');
    add('Negative prompt',hasNegatives,7,'Ada batasan atau negative prompt.','Sebutkan hal yang harus dihindari: gerakan kaku, identitas berubah, karakter tertukar, flicker, dan watermark.');
    if(p.length<80)suggestions.unshift('Prompt masih sangat pendek. Tambahkan detail aksi, subjek, lokasi, dan hasil visual yang diharapkan.');
    if(lines.length>0&&lines.length<3&&!hasStructure)suggestions.push('Untuk prompt yang panjang, pisahkan arahan menjadi beberapa bagian agar mudah diperiksa.');
    if(!p)suggestions.unshift('Masukkan prompt terlebih dahulu untuk memulai analisis.');
    score=p?Math.min(100,score):0;
    return {score,checks,suggestions,summary:!p?'Tidak ada prompt untuk dianalisis.':score>=85?'Struktur prompt sudah kuat':score>=65?'Prompt cukup terarah':'Prompt masih perlu diperjelas',description:!p?'Masukkan teks prompt untuk melihat kekuatan dan kekurangannya.':score>=85?'Pertahankan konsistensi instruksi dan periksa detail kontinuitas.':score>=65?'Beberapa bagian penting sudah tersedia, tetapi masih ada celah yang dapat diperbaiki.':'Tambahkan arahan konkret agar model lebih mudah memahami adegan yang diinginkan.'};
  }
  function showAnalysis(result) {
    $('#scoreValue').textContent=result.score; $('#scoreRing').style.background=`conic-gradient(var(--primary) ${result.score*3.6}deg,#ecebff ${result.score*3.6}deg 360deg)`;
    $('#scoreTitle').textContent=result.summary; $('#scoreDescription').textContent=result.description; $('#analysisStatus').textContent=result.score>=85?'Kuat':result.score>=65?'Cukup':'Perlu perbaikan'; $('#analysisStatus').style.color=result.score>=85?'#258d69':result.score>=65?'#b7852d':'#c44c59';
    $('#analysisMetrics').innerHTML=result.checks.map(c=>`<div class="metric-row"><span>${esc(c.name)}</span><span class="metric-state ${c.ok?'good':'warn'}">${c.ok?'Terpenuhi':'Perlu cek'}</span></div>`).join('');
    $('#suggestionCount').textContent=`${result.suggestions.length} saran`; $('#suggestionsList').innerHTML=result.suggestions.length?result.suggestions.map(s=>`<div class="suggestion-item"><span class="suggestion-mark">↳</span><span>${esc(s)}</span></div>`).join(''):'<div class="suggestion-item"><span class="suggestion-mark">✓</span><span>Tidak ada masalah dasar yang terdeteksi. Tetap lakukan pemeriksaan visual setelah generasi.</span></div>';
  }
  function optimizeLocal(text) {
    const p=text.trim(); if(!p)return ''; const a=analyzePrompt(p); let improved=p;
    if(!/(durasi|duration|\b\d+\s*(detik|seconds?|sec)\b)/i.test(improved)) improved+='\n\nDurasi: 10 detik. Pertahankan satu alur adegan yang jelas dari awal hingga akhir.';
    if(!/(9:16|16:9|1:1|4:5|21:9|3:2|aspect ratio|rasio aspek)/i.test(improved)) improved+='\nRasio aspek: 16:9.';
    if(!/(kamera|camera|shot|framing|tracking|push-in|dolly|pan\b)/i.test(improved)) improved+='\nKamera: medium-wide shot setinggi mata, stabil, dan mengikuti aksi secara halus tanpa gerakan yang tidak perlu.';
    if(!/(konsisten|consisten|continuit|kontinuitas|identity|identitas)/i.test(improved)) improved+='\nKontinuitas: pertahankan identitas karakter, pakaian, arah gerak, proporsi tubuh, dan posisi objek secara konsisten di seluruh klip.';
    if(!/(negative prompt|hindari:|avoid:|tanpa watermark)/i.test(improved)) improved+=`\nNegative prompt: ${DEFAULT_NEGATIVES}.`;
    if(!/(lalu|kemudian|setelah|akhirnya|then|after|finally|ends with|akhir adegan)/i.test(improved)) improved+='\nUrutan aksi: mulai dengan posisi awal yang jelas, lanjutkan aksi utama dengan gerakan natural, lalu akhiri dengan posisi akhir yang stabil.';
    return improved;
  }
  async function callBackend(action,prompt) {
    const endpoint=state.settings.apiEndpoint.trim(); if(!endpoint)throw new Error('Endpoint backend belum diisi.');
    const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,prompt,language:$('#outputLanguage').value,model:$('#model').value})});
    let data={};try{data=await response.json();}catch{}
    if(!response.ok)throw new Error(data.error||`Backend merespons HTTP ${response.status}.`);
    return data;
  }
  function syncSettingsForm(){setField('settingLanguage',state.settings.outputLanguage);$('#autosaveToggle').checked=!!state.settings.autosave;$('#confirmDeleteToggle').checked=!!state.settings.confirmDelete;$('#apiEndpoint').value=state.settings.apiEndpoint||'/api/enhance';$('#aiEnabled').checked=!!state.settings.aiEnabled;updateCounts();}
  function saveSettings(){state.settings={...state.settings,outputLanguage:$('#settingLanguage').value,autosave:$('#autosaveToggle').checked,confirmDelete:$('#confirmDeleteToggle').checked,apiEndpoint:$('#apiEndpoint').value.trim()||'/api/enhance',aiEnabled:$('#aiEnabled').checked};writeStore(KEYS.settings,state.settings);setField('outputLanguage',state.settings.outputLanguage);$('#draftStatus').textContent=state.settings.autosave?'Aktif':'Nonaktif';$('#analyzerMode').innerHTML=`<span class="status-dot"></span> ${state.settings.aiEnabled?'AI backend diizinkan':'Rule-based analyzer'}`;toast('Pengaturan berhasil disimpan.');}
  function confirmAction(title,message,actionText='Ya, lanjutkan') { $('#modalTitle').textContent=title;$('#modalMessage').textContent=message;$('#modalConfirm').textContent=actionText;$('#modalLayer').hidden=false;return new Promise(resolve=>{state.modalResolver=resolve;}); }
  function closeModal(value) { $('#modalLayer').hidden=true;const fn=state.modalResolver;state.modalResolver=null;if(fn)fn(value); }
  async function handleHistoryAction(action,id){const item=state.history.find(x=>x.id===id);if(!item)return;if(action==='load'){loadHistoryItem(item);return;}if(action==='copy'){copyText(item.prompt);return;}if(action==='download'){downloadFile(`${slugify(item.title)}.txt`,item.prompt);return;}if(action==='favorite'){toggleFavorite(id);return;}if(action==='delete'){const yes=state.settings.confirmDelete?await confirmAction('Hapus prompt?',`Prompt “${item.title}” akan dihapus dari riwayat.`,'Hapus prompt'):true;if(!yes)return;state.history=state.history.filter(x=>x.id!==id);persistHistory();renderLibrary('history');renderLibrary('favorites');renderDashboard();toast('Prompt dihapus.');}}
  function attachEvents(){
    $$('.nav-item[data-view]').forEach(btn=>btn.addEventListener('click',()=>switchView(btn.dataset.view)));
    $$('[data-view-link]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();switchView(link.dataset.viewLink)}));
    $$('[data-go]').forEach(btn=>btn.addEventListener('click',()=>switchView(btn.dataset.go)));
    $('#mobileMenu').addEventListener('click',()=>{const open=$('#sidebar').classList.toggle('open');$('#mobileMenu').setAttribute('aria-expanded',String(open));});
    $('#quickSettings').addEventListener('click',()=>switchView('settings'));
    $('#addCharacter').addEventListener('click',()=>{addCharacter();saveDraft();});
    $('#generatePrompt').addEventListener('click',onGenerate);
    $('#resetGenerator').addEventListener('click',async()=>{const yes=await confirmAction('Reset form generator?','Semua isian akan dikembalikan ke nilai awal. Draft yang tersimpan juga akan diperbarui.','Reset form');if(!yes)return;$('#model').value='Seedance 2.0';$('#outputLanguage').value=state.settings.outputLanguage||'id';$('#detailLevel').value='detailed';$('#duration').value='10 detik';$('#aspectRatio').value='16:9';$('#visualStyle').value='Realistis sinematik';['sceneTitle','sceneDescription','location','timeMood','audioMood','dialogue'].forEach(id=>setField(id,''));$('#sceneType').value='Aksi / pertarungan koreografi';$('#atmosphere').value='Tegang dan dinamis';$('#cameraMovement').value='Kamera diam dan stabil';$('#cameraFraming').value='Medium-wide shot setinggi mata';$('#lighting').value='Pencahayaan natural lembut';$('#actionPace').value='Gerakan natural, tegas, dan mengalir';$('#dialogueLanguage').value='Tidak ada dialog';$('#negativePrompt').value=DEFAULT_NEGATIVES;resetCharacters();state.currentPromptId=null;state.latestPrompt='';$('#promptOutput').value='';$('#promptOutput').classList.remove('visible');$('#outputPlaceholder').hidden=false;$('#outputWords').textContent='0 kata';updateDescriptionCount();saveDraft();updateConsistency();toast('Form dikembalikan ke nilai awal.');});
    $('#randomizeIdea').addEventListener('click',()=>{const pool=[{title:'Latihan refleks di gym',desc:'Model 1 mengatur posisi tubuh, menghindari beberapa gerakan latihan yang datang bertahap, lalu kembali ke posisi siap dengan keseimbangan yang terjaga.',location:'Gym modern',mood:'Sore dengan cahaya hangat'},{title:'Pertemuan dramatis di lorong',desc:'Model 1 berjalan menyusuri lorong dan berhenti ketika melihat Model 2. Mereka saling menatap sejenak, lalu Model 2 maju satu langkah dan berbicara. Akhiri dengan reaksi Model 1 yang tertahan.',location:'Koridor sekolah',mood:'Sore, atmosfer tegang'},{title:'Sprint di lapangan',desc:'Model 1 berada pada posisi siap, mulai berlari cepat menyusuri lapangan, melewati penanda, kemudian memperlambat langkah dan berhenti dengan gerakan tubuh yang natural.',location:'Lapangan olahraga',mood:'Golden hour'},{title:'Kemunculan karakter',desc:'Model 1 masuk dari sisi frame dengan langkah mantap, berhenti di tengah lokasi, mengamati sekeliling, kemudian menoleh ke arah kamera. Gerakannya natural dan berakhir pada pose stabil.',location:'Area parkir sinematik',mood:'Malam dengan pencahayaan dramatis'}];const idea=pool[Math.floor(Math.random()*pool.length)];setField('sceneTitle',idea.title);setField('sceneDescription',idea.desc);setField('location',idea.location);setField('timeMood',idea.mood);saveDraft();updateDescriptionCount();updateConsistency();toast('Ide acak diterapkan. Sesuaikan detailnya sebelum membuat prompt.');});
    $('#defaultNegatives').addEventListener('click',()=>{setField('negativePrompt',DEFAULT_NEGATIVES);saveDraft();updateConsistency();toast('Negative prompt standar diterapkan.');});
    $('#copyPrompt').addEventListener('click',()=>copyText(getDisplayedPrompt()));
    $('#downloadTxt').addEventListener('click',()=>{const p=getDisplayedPrompt();if(!p){toast('Buat prompt terlebih dahulu.','error');return;}downloadFile(`${slugify($('#sceneTitle').value||'rizprompt')}.txt`,p);toast('File TXT disiapkan.');});
    $('#downloadJson').addEventListener('click',()=>{const p=getDisplayedPrompt();if(!p){toast('Buat prompt terlebih dahulu.','error');return;}const obj={app:'RIZPROMPT AI',version:'1.0',exportedAt:new Date().toISOString(),prompt:p,settings:getFormValues()};downloadFile(`${slugify($('#sceneTitle').value||'rizprompt')}.json`,JSON.stringify(obj,null,2),'application/json;charset=utf-8');toast('File JSON disiapkan.');});
    $('#saveFavorite').addEventListener('click',toggleCurrentFavorite);
    $('#sceneDescription').addEventListener('input',()=>{updateDescriptionCount();saveDraft();updateConsistency();});
    ['sceneTitle','location','timeMood','model','outputLanguage','detailLevel','duration','aspectRatio','visualStyle','sceneType','atmosphere','cameraMovement','cameraFraming','lighting','actionPace','dialogueLanguage','audioMood','dialogue','negativePrompt'].forEach(id=>{const el=$(`#${id}`);if(el)el.addEventListener('input',()=>{saveDraft();updateConsistency();});});
    $('#useGenerated').addEventListener('click',()=>{const p=getDisplayedPrompt();if(!p){toast('Belum ada output prompt.','error');return;}$('#analyzerInput').value=p;switchView('analyzer');toast('Output generator dimasukkan ke analyzer.');});
    $('#analyzePrompt').addEventListener('click',()=>{const p=$('#analyzerInput').value;showAnalysis(analyzePrompt(p));if(!p.trim())toast('Tempel prompt terlebih dahulu.','error');});
    $('#optimizePrompt').addEventListener('click',()=>{const p=$('#analyzerInput').value;if(!p.trim()){toast('Tempel prompt terlebih dahulu.','error');return;}const improved=optimizeLocal(p);$('#analyzerInput').value=improved;showAnalysis(analyzePrompt(improved));state.latestOptimized=improved;toast('Prompt ditambahkan arahan dasar secara lokal.');});
    $('#optimizeWithAI').addEventListener('click',async()=>{const p=$('#analyzerInput').value.trim();if(!p){toast('Tempel prompt terlebih dahulu.','error');return;}if(!state.settings.aiEnabled){toast('Aktifkan AI enhance di Pengaturan terlebih dahulu.','error');return;}const btn=$('#optimizeWithAI');btn.disabled=true;btn.textContent='Memproses...';try{const data=await callBackend('enhance',p);if(!data.result)throw new Error('Backend tidak mengirim hasil prompt.');$('#analyzerInput').value=data.result;state.latestOptimized=data.result;showAnalysis(analyzePrompt(data.result));toast('AI enhance selesai.');}catch(err){toast(`AI enhance gagal: ${err.message}`,'error');}finally{btn.disabled=false;btn.textContent='AI enhance ↗';}});
    $('#copyOptimized').addEventListener('click',()=>copyText(state.latestOptimized||$('#analyzerInput').value));
    $('#templateSearch').addEventListener('input',renderTemplates);$('#templateFilters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;state.activeTemplateFilter=b.dataset.filter;$$('.filter-pill').forEach(p=>p.classList.toggle('active',p===b));renderTemplates();});
    $('#templatesGrid').addEventListener('click',e=>{const b=e.target.closest('[data-template]');if(b)applyTemplate(templates.find(t=>t.id===b.dataset.template));});
    $('#historySearch').addEventListener('input',()=>renderLibrary('history'));$('#favoriteSearch').addEventListener('input',()=>renderLibrary('favorites'));
    $('#historyList').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b)handleHistoryAction(b.dataset.action,b.dataset.id);});$('#favoriteList').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b)handleHistoryAction(b.dataset.action,b.dataset.id);});$('#recentList').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const item=state.history.find(x=>x.id===b.dataset.id);if(b.dataset.action==='load')loadHistoryItem(item);else if(b.dataset.action==='favorite')toggleFavorite(b.dataset.id);});
    $('#clearHistory').addEventListener('click',async()=>{const yes=state.settings.confirmDelete?await confirmAction('Hapus semua riwayat?','Semua prompt dari riwayat akan dihapus. Item favorit juga akan ikut terhapus.','Hapus semua'):true;if(!yes)return;state.history=[];state.currentPromptId=null;persistHistory();renderLibrary('history');renderLibrary('favorites');renderDashboard();toast('Riwayat prompt telah dibersihkan.');});
    $('#saveSettings').addEventListener('click',saveSettings);$('#testBackend').addEventListener('click',async()=>{saveSettings();const el=$('#backendStatus');el.className='backend-status';el.textContent='Menguji koneksi...';try{const d=await callBackend('health','');if(d.configured){el.classList.add('success');}else{el.classList.add('error');}el.textContent=d.message||'Backend dapat dijangkau.';}catch(e){el.classList.add('error');el.textContent=`Koneksi gagal: ${e.message}. Pastikan server berjalan dan endpoint benar.`;}});
    $('#exportBackup').addEventListener('click',()=>{const data={app:'RIZPROMPT AI',version:'1.0',exportedAt:new Date().toISOString(),history:state.history,settings:{...state.settings,apiEndpoint:state.settings.apiEndpoint}};downloadFile('rizprompt-ai-backup.json',JSON.stringify(data,null,2),'application/json;charset=utf-8');toast('Cadangan JSON diekspor.');});
    $('#clearAllData').addEventListener('click',async()=>{const yes=await confirmAction('Hapus semua data lokal?','Riwayat, favorit, draft, dan preferensi di browser ini akan dihapus. Tindakan ini tidak dapat dibatalkan.','Hapus semua data');if(!yes)return;Object.values(KEYS).forEach(k=>localStorage.removeItem(k));state.history=[];state.currentPromptId=null;state.settings={outputLanguage:'id',autosave:true,confirmDelete:true,apiEndpoint:'/api/enhance',aiEnabled:false};syncSettingsForm();persistHistory();renderDashboard();renderLibrary('history');renderLibrary('favorites');toast('Semua data lokal dihapus.');});
    $('#modalCancel').addEventListener('click',()=>closeModal(false));$('#modalConfirm').addEventListener('click',()=>closeModal(true));$('#modalLayer').addEventListener('click',e=>{if(e.target===$('#modalLayer'))closeModal(false);});document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('#modalLayer').hidden)closeModal(false);else $('#sidebar').classList.remove('open');}});
  }
  function init() {
    resetCharacters();restoreDraft();updateDescriptionCount();syncSettingsForm();attachEvents();renderDashboard();renderTemplates();renderLibrary('history');renderLibrary('favorites');updateConsistency();
    const savedPrompt=state.history[0]; if(savedPrompt){ /* Keep the dashboard clean until the user chooses a saved prompt. */ }
    $('#analyzerMode').innerHTML=`<span class="status-dot"></span> ${state.settings.aiEnabled?'AI backend diizinkan':'Rule-based analyzer'}`;
    if(location.hash){const target=location.hash.replace('#','');if(['dashboard','generator','analyzer','templates','history','favorites','settings'].includes(target))switchView(target);}
  }
  init();
})();
