const photos = [
 {file:'IMG_2530.jpeg',category:'Doves',title:"Rent? I pay in vibes.",note:'A quiet moment above it all.',alt:'A brown dove perched on roof shingles against blue sky',position:'50% 65%'},
 {file:'IMG_2534.png',category:'Cardinals',title:"The group chat, in person.",note:'Two bright personalities in a tangle of branches.',alt:'A red male and brown female cardinal sitting together in bare branches',position:'50% 45%'},
 {file:'IMG_2505.jpeg',category:'Parakeets',title:"CEO of looking busy",note:'The best seat in the neighborhood.',alt:'A green parakeet perched at the top of a leafy tree',position:'45% 40%'},
 {file:'IMG_2515.png',category:'Geese',title:"My last brain cell leaving",note:'Wings up. Nothing but blue ahead.',alt:'A Canada goose flying with wings raised against blue sky',position:'50% 54%'},
 {file:'IMG_2433.jpeg',category:'Sparrows',title:"Just a little guy",note:'A tiny pause in a very big day.',alt:'A small brown sparrow standing on a speckled surface',position:'60% 40%'},
 {file:'IMG_2506.jpeg',category:'Parakeets',title:"This meeting is over",note:'That split second between here and gone.',alt:'A green parakeet taking flight above a leafy tree',position:'65% 27%'},
 {file:'IMG_2516.png',category:'Geese',title:"No GPS. Just confidence.",note:'A passing silhouette, perfectly on course.',alt:'A Canada goose in flight with wings sweeping downward',position:'50% 56%'},
 {file:'IMG_2358.jpeg',category:'Parakeets',title:"On my silly little walk",note:'Sometimes the best encounters are at eye level.',alt:'A green parakeet standing on a sunny sidewalk',position:'50% 55%'},
 {"file": "IMG_2435.jpeg", "category": "Sparrows", "title": "Social battery: 1%", "note": "A small pause beside the railing.", "alt": "A brown sparrow resting on a ledge beside a white railing", "position": "35% 60%"},
 {"file": "IMG_2172.jpeg", "category": "Blackbirds", "title": "Free shower? In this economy?", "note": "Front-row seats to a little sidewalk rain.", "alt": "A brown bird standing on wet pavement beneath sprinkler droplets", "position": "40% 60%"},
 {"file": "IMG_2071.jpeg", "category": "Chickens", "title": "The manager has arrived", "note": "Some neighbors arrive with a little extra attitude.", "alt": "A black and gold chicken striding across grass", "position": "60% 50%"},
 {"file": "IMG_2030.jpeg", "category": "Blackbirds", "title": "Judging you professionally", "note": "A bright eye and a brighter backdrop.", "alt": "A glossy black bird with a pale yellow eye against yellow walls and green leaves", "position": "50% 45%"},
 {"file": "IMG_1918.jpeg", "category": "Seabirds", "title": "Airplane mode: activated", "note": "A long-winged silhouette against an open sky.", "alt": "A dark seabird with long wings and a forked tail gliding across blue sky", "position": "50% 65%"},
 {"file": "IMG_1849.jpeg", "category": "Swallows", "title": "Waiting for the Wi-Fi", "note": "Three little faces, one very good vantage point.", "alt": "Three young swallows perched together at the edge of a mud nest", "position": "40% 10%"},
 {"file": "IMG_1634.jpeg", "category": "Vultures", "title": "Budget airline. Premium wings.", "note": "Every feather doing its part.", "alt": "A red-headed turkey vulture banking in flight with broad wings spread", "position": "50% 50%"},
 {"file": "IMG_1186.jpeg", "category": "Cardinals", "title": "Main character spotted", "note": "A bright little visitor in a garden full of color.", "alt": "A red cardinal perched on a garden chair among flowers and green plants", "position": "45% 40%"},
 {"file": "IMG_0911.jpeg", "category": "Pigeons", "title": "Crumb inspector, on duty", "note": "Taking the scenic route through the flowers.", "alt": "A gray pigeon standing among white clover flowers", "position": "50% 50%"},
 {"file": "IMG_0744.jpeg", "category": "Robins", "title": "The grass is greener over here", "note": "A familiar face, just a little further away.", "alt": "An orange-breasted robin on grass behind a chain-link fence", "position": "45% 45%"},
 {"file": "IMG_0717.jpeg", "category": "Robins", "title": "It\u2019s not a phase, mom.", "note": "Big eyes. A few wonderfully unruly feathers.", "alt": "A young robin with a speckled breast perched on a metal railing", "position": "50% 20%"},
 {"file": "IMG_5482.jpeg", "category": "Flamingos", "title": "On Wednesdays we wear pink", "note": "A quiet ripple and a very elegant gathering.", "alt": "Pink flamingos preening in shallow water", "position": "50% 50%"},
 {"file": "IMG_5286.jpeg", "category": "Other birds", "title": "You got games on your phone?", "note": "A curious little encounter on a dusty path.", "alt": "A small brown bird looking toward the camera on sandy ground", "position": "50% 55%"},
 {"file": "IMG_1624.jpeg", "category": "Cardinals", "title": "Hair budget: unlimited", "note": "A red crest that does all the talking.", "alt": "A red-crested bird with a white breast and gray back standing on pavement", "position": "60% 45%"},
 {"file": "IMG_1567.jpeg", "category": "Toucans", "title": "Big beak energy", "note": "A splash of orange behind the aviary mesh.", "alt": "A black and white toucan with a large orange bill behind an aviary enclosure", "position": "50% 45%"},
 {"file": "IMG_0623.jpeg", "category": "Robins", "title": "Same branch. New drama.", "note": "A little sunshine, a familiar orange waistcoat.", "alt": "An orange-breasted robin perched among bare branches", "position": "45% 50%"},
 {"file": "IMG_1658.jpeg", "category": "Pigeons", "title": "Vacation mode: permanent", "note": "White feathers. Pink feet. No hurry.", "alt": "A white pigeon standing on a low wall beside a sandy beach", "position": "50% 50%"},
 {"file": "IMG_0202.jpeg", "category": "Sparrows", "title": "The HOA is watching", "note": "A couple of neighbors keeping an eye on things.", "alt": "Two sparrows tucked into the bare branches of a trimmed shrub", "position": "50% 45%"},
 {"file": "IMG_0198.jpeg", "category": "Sparrows", "title": "Do not perceive me", "note": "A small bundle of feathers taking a break.", "alt": "A sparrow with its head tucked into its feathers atop a shrub", "position": "35% 50%"},
 {"file": "IMG_0721.mp4", "poster": "IMG_0721-poster.jpg", "type": "video", "category": "Robins", "title": "The debrief", "note": "A brief meeting on the railing. Silent clip · 2 seconds.", "alt": "Two robins meeting on a sunny metal railing", "position": "50% 70%"},
 {"file": "IMG_0200.mp4", "poster": "IMG_0200-poster.jpg", "type": "video", "category": "Sparrows", "title": "Live from the group chat", "note": "A closer look at the hedge regular. Silent clip · 2 seconds.", "alt": "A sparrow perched on the bare branches of a hedge", "position": "50% 45%"}
];
const guest = {file:'IMG_0148.jpeg',guest:true,category:'Unexpected company',title:'An unexpected plus-one',note:'A waterside encounter from the wider wildlife collection. This guest sits outside the bird count.',alt:'An alligator resting beside water with its reflection below',position:'50% 50%'};
const collectionOrder = [...photos.slice(8), ...photos.slice(0,8)];
let filtered = collectionOrder;
let viewerPhotos = photos;
let current = 0;
const gallery = document.querySelector('#gallery');
const viewer = document.querySelector('#viewer');
const filmstrip = document.querySelector('#filmstrip');
const viewerVideo = document.querySelector('#viewer-video');
const groupSelect = document.querySelector('#bird-group');
const groups = [...new Set(photos.map(p=>p.category))].sort();
groupSelect.innerHTML = '<option value="All">All bird personalities</option>'+groups.map(group=>`<option value="${group}">${group} (${photos.filter(p=>p.category===group).length})</option>`).join('');
document.querySelectorAll('[data-total]').forEach(e=>e.textContent=photos.length);
document.querySelector('#group-total').textContent=String(groups.length).padStart(2,'0');
function render() {
 gallery.innerHTML = filtered.map((p,i)=>`<button class="photo-card" data-index="${i}" aria-label="View ${p.title}"><div class="image-wrap"><img src="assets/${p.poster||p.file}" alt="${p.alt}" style="object-position:${p.position}" loading="lazy"><span class="image-tag">${p.category}</span><span class="meme-caption" aria-hidden="true">${p.title}</span><span class="image-open" aria-hidden="true">${p.type==='video'?'▶':'↗'}</span>${p.type==='video'?'<span class="video-tag">SILENT FILM · 0:02</span>':''}</div><div class="card-caption"><span class="card-index">${String(photos.indexOf(p)+1).padStart(2,'0')}</span><div><h3>${p.title}</h3><p>${p.note}</p></div></div></button>`).join('');
 gallery.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>openPhoto(Number(b.dataset.index),filtered)));
 document.querySelector('#result-count').textContent=`${filtered.length} ${filtered.length===1?'moment':'moments'}, and counting`;
}
function updateViewer() {
 const p=viewerPhotos[current];
 const image=document.querySelector('#viewer-image');
 viewerVideo.pause();
 const isVideo=p.type==='video';
 image.hidden=isVideo; viewerVideo.hidden=!isVideo;
 if(isVideo){viewerVideo.src=`assets/${p.file}`;viewerVideo.poster=`assets/${p.poster}`;viewerVideo.setAttribute('aria-label',p.alt)}
 else{viewerVideo.removeAttribute('src');viewerVideo.load();image.src=`assets/${p.file}`; image.alt=p.alt;}
 document.querySelector('#viewer-title').textContent=p.title;
 document.querySelector('#viewer-description').textContent=p.note;
 document.querySelector('#viewer-category').textContent=p.category;
 document.querySelector('#viewer-counter').textContent=`${p.guest?'GUEST SIGHTING':'FIELD NOTE '+String(photos.indexOf(p)+1).padStart(3,'0')} / ${current+1} OF ${viewerPhotos.length}`;
 document.querySelector('#previous').hidden=document.querySelector('#next').hidden=viewerPhotos.length<2;
 filmstrip.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===current)));
 if(viewer.open)filmstrip.children[current].scrollIntoView({block:'nearest',inline:'nearest'});
}
function openPhoto(index,collection=photos) {
 viewerPhotos=collection; current=index;
 filmstrip.innerHTML=viewerPhotos.map((p,i)=>`<button aria-label="Show ${p.title}" aria-pressed="false" data-index="${i}"><img src="assets/${p.poster||p.file}" alt="" style="object-position:${p.position}"></button>`).join('');
 filmstrip.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{current=Number(b.dataset.index);updateViewer()}));
 updateViewer(); viewer.showModal(); document.body.style.overflow='hidden';
 filmstrip.children[current].scrollIntoView({block:'nearest',inline:'nearest'});
}
function move(delta) {current=(current+delta+viewerPhotos.length)%viewerPhotos.length;updateViewer();}
viewer.addEventListener('close',()=>{viewerVideo.pause();viewerVideo.currentTime=0;document.body.style.overflow=''});
document.querySelector('#close-viewer').addEventListener('click',()=>viewer.close());
document.querySelector('#previous').addEventListener('click',()=>move(-1));
document.querySelector('#next').addEventListener('click',()=>move(1));
viewer.addEventListener('keydown',e=>{if(e.target===viewerVideo)return;if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}});
let swipeStart;
const viewerImage=document.querySelector('#viewer-image');
viewerImage.addEventListener('pointerdown',e=>{swipeStart=e.clientX});
viewerImage.addEventListener('pointerup',e=>{if(swipeStart!==undefined&&Math.abs(e.clientX-swipeStart)>50)move(e.clientX<swipeStart?1:-1);swipeStart=undefined});
viewerImage.addEventListener('pointercancel',()=>{swipeStart=undefined});
viewerImage.addEventListener('dragstart',e=>e.preventDefault());
function selectFilter(filter) {
 document.querySelectorAll('[data-filter]').forEach(b=>{const selected=b.dataset.filter===filter;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected))});
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 groupSelect.value='All'; selectFilter(button.dataset.filter);
 filtered=button.dataset.filter==='New'?photos.slice(8):button.dataset.filter==='Videos'?photos.filter(p=>p.type==='video'):collectionOrder;
 render();
}));
groupSelect.addEventListener('change',()=>{selectFilter(groupSelect.value==='All'?'All':'');filtered=groupSelect.value==='All'?collectionOrder:collectionOrder.filter(p=>p.category===groupSelect.value);render()});
document.querySelector('#guest-photo').addEventListener('click',()=>openPhoto(0,[guest]));
document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>openPhoto(Number(b.dataset.photo))));
let lastSurprise=-1;
document.querySelector('#surprise').addEventListener('click',()=>{
 let index=Math.floor(Math.random()*(photos.length-(lastSurprise<0?0:1)));
 if(lastSurprise>=0&&index>=lastSurprise)index++;
 lastSurprise=index;openPhoto(index);
});
const editorialView=document.querySelector('#editorial-view');
const contactView=document.querySelector('#contact-view');
function setLayout(compact){gallery.classList.toggle('contact-sheet',compact);editorialView.setAttribute('aria-pressed',String(!compact));contactView.setAttribute('aria-pressed',String(compact));}
editorialView.addEventListener('click',()=>setLayout(false));
contactView.addEventListener('click',()=>setLayout(true));
const momentSlider=document.querySelector('#moment-slider');
momentSlider.addEventListener('input',()=>{
 document.querySelector('.comparison').style.setProperty('--split',`${momentSlider.value}%`);
 momentSlider.setAttribute('aria-valuetext',`${momentSlider.value} percent of perched photograph revealed`);
});
const progress=document.querySelector('.reading-progress span');
let scrollQueued=false;
function updateProgress(){const distance=document.documentElement.scrollHeight-window.innerHeight;progress.style.transform=`scaleX(${distance>0?window.scrollY/distance:0})`;scrollQueued=false;}
window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateProgress)}},{passive:true});
window.addEventListener('resize',updateProgress);
render(); updateProgress();
