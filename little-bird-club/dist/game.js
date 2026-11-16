(() => {
 const canvas=document.querySelector('#bird-game'),ctx=canvas.getContext('2d');
 const overlay=document.querySelector('#game-overlay'),start=document.querySelector('#game-start'),pause=document.querySelector('#game-pause');
 const sprites=new Image(); sprites.src='assets/bird-sprites.png';
 const neighbors=new Image(); neighbors.src='assets/bird-neighbors-flapping.png';
 const seagull=new Image(); seagull.src='assets/seagull-boss.png';
 const ships=new Image(); ships.src='assets/spacecraft.png';
 const species=[{name:'Cardinal',points:30},{name:'Parakeet',points:20},{name:'Robin',points:25},{name:'Sparrow',points:15},{name:'Dove',points:20},{name:'Pigeon',points:25}];
 const keys=new Set(),W=800,H=500;
 const keyboardControls=new Set(),pointerControls=new Map();
 // Paint the space layers once; each tile wraps vertically without a seam.
 const spaceLayers=[4,10,22].map((speed,layer)=>{
  const tile=document.createElement('canvas');tile.width=W;tile.height=H*2;
  const sky=tile.getContext('2d');
  if(layer===0){
   for(let i=0;i<180;i++){
    const y=Math.random()*tile.height,x=W*(.5+.3*Math.sin(y/190))+(Math.random()-.5)*300,r=35+Math.random()*130;
    for(const offset of [-tile.height,0,tile.height]){
     const cloud=sky.createRadialGradient(x,y+offset,0,x,y+offset,r);
     cloud.addColorStop(0,i%3?'rgba(56,83,135,.035)':'rgba(116,64,133,.045)');cloud.addColorStop(1,'rgba(0,0,0,0)');
     sky.fillStyle=cloud;sky.fillRect(x-r,y+offset-r,r*2,r*2);
    }
   }
  }
  for(let i=0;i<[650,170,45][layer];i++){
   const x=Math.random()*W,y=Math.random()*tile.height,r=(.25+Math.random()*.55)*(1+layer*.45);
   const color=i%7===0?'255,219,185':i%3===0?'180,207,255':'230,238,255';
   for(const offset of [-tile.height,0,tile.height]){
    if(layer>0){
     const glow=sky.createRadialGradient(x,y+offset,0,x,y+offset,r*5);
     glow.addColorStop(0,`rgba(${color},.25)`);glow.addColorStop(1,`rgba(${color},0)`);
     sky.fillStyle=glow;sky.fillRect(x-r*5,y+offset-r*5,r*10,r*10);
    }
    sky.fillStyle=`rgba(${color},${.25+Math.random()*.65})`;sky.beginPath();sky.arc(x,y+offset,r,0,Math.PI*2);sky.fill();
   }
  }
  return {tile,speed};
 });
 let spaceTime=0;
 const difficultySelect=document.querySelector('#game-difficulty');
 const difficultySpeeds={easy:1,normal:1.25,hard:1.5};
 let difficulty='easy',enemySpeed=1;
 const soundButton=document.querySelector('#game-sound');
 const powers={skeen:false,superman:false,guns:false};
 const timedPowers={guns:0,superman:0,skeen:0};
 const pickupTypes=['guns','superman','skeen'];
 const pickupCycle=['guns','skeen','guns','skeen','superman'];
 const pickupLabels={guns:'RAPID FIRE',superman:'SHIELD',skeen:'ESCORTS'};
 const pickupColors={guns:'#ffdc58',superman:'#86e7ff',skeen:'#baeb72'};
 const hasPower=code=>powers[code]||timedPowers[code]>0;
 let pickups=[],defeatedCount=0,pickupIndex=0,pickupAt=10;
 const codeInput=document.querySelector('#game-code-input');
 const continueButton=document.querySelector('#game-continue');
 document.querySelector('#game-code').addEventListener('submit',e=>{
  e.preventDefault();const code=codeInput.value.trim().toLowerCase();
  if(!Object.hasOwn(powers,code))return;
  powers[code]=true;codeInput.value='';canvas.focus({preventScroll:true});
 });
 let audio,master,musicGain,musicSource,musicKind,musicOffset=0,musicStarted=0,muted=false,chirpAt=3;
 const tracks={level:{url:'assets/level-cruising-8bit.mp3'},boss:{url:'assets/boss-blood-ascendant.mp3'}};
 let state='ready',score=0,best=0,wave=1,lives=3,player=400,playerY=465,birds=[],seeds=[],drops=[],particles=[],direction=1,shotAt=0,dropAt=0,invincible=0,previous=0,boss=null,bossesCleared=0,continues=0;
 try{best=Number(localStorage.getItem('flock-best'))||0}catch{}
 const hud=()=>{for(const [id,value] of Object.entries({score:String(score).padStart(4,'0'),best:String(best).padStart(4,'0'),wave:String(wave).padStart(2,'0'),lives:'♥ × '+lives,continues:String(continues)}))document.querySelector('#game-'+id).textContent=value};
 function volume(active){if(master)master.gain.setValueAtTime(!muted&&active ? .18 : 0,audio.currentTime);syncMusic(active)}
 function syncMusic(active){
  if(!audio)return;
  const kind=boss?'boss':'level';
  if(musicSource&&(!active||muted||musicKind!==kind)){musicOffset+=audio.currentTime-musicStarted;musicSource.stop();musicSource=null}
  if(musicKind!==kind){musicKind=kind;musicOffset=0}
  const buffer=tracks[kind].buffer;
  if(active&&!muted&&state==='playing'&&buffer&&!musicSource){musicSource=audio.createBufferSource();musicSource.buffer=buffer;musicSource.loop=true;musicSource.connect(musicGain);musicStarted=audio.currentTime;musicSource.start(0,musicOffset%buffer.duration)}
 }
 function unlockAudio(){
  if(muted)return;
  if(!audio){try{audio=new window.AudioContext();master=audio.createGain();master.connect(audio.destination);musicGain=audio.createGain();musicGain.gain.value=.8;musicGain.connect(master);
   for(const track of Object.values(tracks))fetch(track.url).then(r=>{if(!r.ok)throw new Error('Music load failed');return r.arrayBuffer()}).then(data=>audio.decodeAudioData(data)).then(buffer=>{track.buffer=buffer;syncMusic(state==='playing')}).catch(()=>{document.querySelector('#game-status').textContent='Music could not load. Sound effects are still available.'})
  }catch{soundButton.disabled=true;soundButton.textContent='Sound unavailable';return}}
  audio.resume().then(()=>{volume(state==='playing');if(state==='playing')sound('chirp')}).catch(()=>{});volume(true);
 }
 function tone(from,to,duration,delay=0,shape='sine',level=.35){
  const at=audio.currentTime+delay,osc=audio.createOscillator(),gain=audio.createGain();osc.type=shape;
  osc.frequency.setValueAtTime(from,at);osc.frequency.exponentialRampToValueAtTime(to,at+duration);
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(level,at+.008);gain.gain.exponentialRampToValueAtTime(.001,at+duration);
  osc.connect(gain);gain.connect(master);osc.start(at);osc.stop(at+duration+.01);
 }
 function hiss(delay=0,duration=.45){
  const at=audio.currentTime+delay,buffer=audio.createBuffer(1,Math.ceil(audio.sampleRate*duration),audio.sampleRate),data=buffer.getChannelData(0);
  for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length);
  const source=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();source.buffer=buffer;filter.type='bandpass';filter.frequency.value=1400;filter.Q.value=.7;gain.gain.value=.45;
  source.connect(filter);filter.connect(gain);gain.connect(master);source.start(at);source.stop(at+duration);
 }
 function sound(event,type=0){
  if(!audio||muted||audio.state!=='running')return;
  if(event==='shot')tone(950,220,.09,0,'square',.13);
  else if(event==='chirp'){
   if(type===4||type===5){tone(360,260,.22,0,'sine',.3);tone(310,235,.3,.25,'sine',.25)}
   else{const pitch=[2100,1700,2400,3000][type];tone(pitch,pitch*1.5,.075);tone(pitch*1.3,pitch*.8,.1,.11)}
  }else if(event==='hit'){tone(520,120,.12,0,'triangle',.5);sound('chirp',type)}
  else if(event==='damage'){tone(180,45,.4,0,'sawtooth',.5);hiss(0,.15)}
  else if(event==='wave'){[523,659,784].forEach((f,i)=>tone(f,f,.15,i*.12,'square',.22));sound('chirp',2)}
  else if(event==='boss'){[130,123,98,65].forEach((f,i)=>tone(f,f*.8,.45,i*.22,'sawtooth',.5));hiss(.5,.9);tone(62,42,1.4,0,'triangle',.6)}
  else if(event==='attack'){tone(130,65,.18,0,'sawtooth',.25)}
  else if(event==='pickup')[659,880,1319].forEach((f,i)=>tone(f,f,.12,i*.07,'triangle',.35));
  else if(event==='boss-hit')tone(240,70,.1,0,'square',.3);
  else if(event==='hiss')hiss();
  else if(event==='rage'){hiss(0,.7);tone(90,180,.6,0,'sawtooth',.45)}
  else if(event==='victory'){[392,523,659,784,1047].forEach((f,i)=>tone(f,f,.25,i*.12,'square',.3));hiss(0,.3)}
  else if(event==='over')[330,277,220,110].forEach((f,i)=>tone(f,f*.8,.3,i*.18,'triangle',.4));
 }
 soundButton.addEventListener('click',()=>{muted=!muted;soundButton.setAttribute('aria-pressed',String(!muted));soundButton.textContent=muted?'Sound off ♫':'Sound on ♪';if(state==='playing'){if(!muted)unlockAudio();volume(true)}else volume(false);canvas.focus({preventScroll:true})});
 function formation(){
  birds=[];boss=null;
  if(wave%3===0){const round=Math.ceil(wave/6),kind=wave%6===0?'seagull':'vulture',hp=kind==='seagull'?120+(round-1)*30:28+(round-1)*8;boss={kind,gapIndex:11,burstCount:0,aimAt:1.6,aimTarget:null,x:400,y:115,hp,maxHp:hp,phase:0,round,volley:0,splitCount:round+1,speed:1+(round-1)*.15,twinHp:22+(round-1)*6}}
  else for(let r=0;r<3;r++)for(let c=0;c<8;c++)birds.push({x:115+c*78,y:65+r*65,type:wave===1?[0,2,3][r]:wave===2?[1,4,5][r]:(wave+r)%species.length});
  seeds=[];drops=[];pickupAt=10;direction=1;dropAt=boss?1.8:1;invincible=1.5;chirpAt=3;
  if(state==='playing'){syncMusic(true);if(wave===1||wave%3!==1)sound(boss?'boss':'wave')}
  document.querySelector('#game-encounter').textContent=boss?`WAVE ${String(wave).padStart(2,'0')} · ${boss.kind==='seagull'?'SEAGULL':'TURKEY VULTURE'} · BOSS ${wave/3}`:`WAVE ${String(wave).padStart(2,'0')} · ${[...new Set(birds.map(b=>species[b.type].name))].join(' / ')}`;
  document.querySelector('#game-status').textContent=boss?`Wave ${wave}. ${boss.kind==='seagull'?'Seagull incoming. Dodge through the gap in its crescent attack.':'Turkey vulture incoming. '+boss.maxHp+' hits before the split.'}`:'Wave '+wave+'. Here comes the flock.';
 }
 function addScore(points){score+=points;if(score>best){best=score;try{localStorage.setItem('flock-best',String(best))}catch{}}hud()}
 function show(title,message,label){overlay.hidden=false;document.querySelector('#game-title').textContent=title;document.querySelector('#game-message').textContent=message;start.textContent=label;document.querySelector('#game-status').textContent=title+'. '+message}
 function begin(){if(!sprites.complete||!sprites.naturalWidth||!neighbors.complete||!neighbors.naturalWidth||!seagull.complete||!seagull.naturalWidth||!ships.complete||!ships.naturalWidth){document.querySelector('#game-message').textContent='The flock is still getting ready. Try again in a moment.';return}unlockAudio();if(state==='paused'){state='playing';volume(true);overlay.hidden=true;pause.textContent='Pause Ⅱ'}else{difficulty=difficultySelect.value;enemySpeed=difficultySpeeds[difficulty];difficultySelect.disabled=true;if(state!=='ready')Object.keys(powers).forEach(code=>powers[code]=false);Object.keys(timedPowers).forEach(code=>timedPowers[code]=0);defeatedCount=0;pickupIndex=0;pickups=[];updatePowerupHud();score=0;wave=1;lives=3;bossesCleared=0;continues=0;continueButton.hidden=true;player=400;playerY=465;shotAt=0;particles=[];formation();state='playing';volume(true);sound('wave');overlay.hidden=true;pause.disabled=false;hud()}canvas.focus({preventScroll:true})}
 function togglePause(){if(state==='playing'){state='paused';volume(false);clearControls();show('BIRD BREAK.','Even chaos needs a little rest.','Resume the chaos →');pause.textContent='Resume ▶'}else if(state==='paused')begin()}
 function finish(){sound('over');state='over';difficultySelect.disabled=false;syncMusic(false);clearControls();pause.disabled=true;show('OUT-FLOCKED.',`You scored ${score} on wave ${wave}. The birds request a rematch.`,continues?'New run →':'One more flock →');continueButton.hidden=continues<1;continueButton.textContent=`Continue (${continues}) · ${difficulty} →`}
 function continueRun(){
  if(state!=='over'||continues<1)return;
  difficultySelect.value=difficulty;difficultySelect.disabled=true;
  continues--;pickups=[];lives=3;player=400;playerY=465;shotAt=0;particles=[];clearControls();formation();state='playing';unlockAudio();volume(true);sound(boss?'boss':'wave');
  overlay.hidden=true;continueButton.hidden=true;pause.disabled=false;pause.textContent='Pause Ⅱ';hud();canvas.focus({preventScroll:true});
 }
 continueButton.addEventListener('click',continueRun);
 function updatePowerupHud(){
  const display=pickupTypes.filter(type=>timedPowers[type]>0).map(type=>`${pickupLabels[type]} ${Math.ceil(timedPowers[type])}s`).join(' · '),element=document.querySelector('#game-powerups');
  if(element.textContent!==display)element.textContent=display;
  element.hidden=!display;
 }
 function spawnPickup(x,y){pickups.push({x:Math.max(24,Math.min(W-24,x)),y,type:pickupCycle[pickupIndex++%pickupCycle.length]})}
 function updatePickups(dt){
  for(const type of pickupTypes)timedPowers[type]=Math.max(0,timedPowers[type]-dt);
  for(const pickup of pickups){
   pickup.y+=85*dt;
   if(Math.abs(pickup.x-player)<30&&Math.abs(pickup.y-playerY)<28){
    timedPowers[pickup.type]=12;pickup.y=H+50;sound('pickup');burst(player,playerY,pickupColors[pickup.type]);
    if(pickup.type==='skeen')player=Math.max(90,Math.min(W-90,player));
    document.querySelector('#game-status').textContent=pickupLabels[pickup.type]+' collected. Active for 12 seconds.';
   }
  }
  pickups=pickups.filter(p=>p.y<H+24);updatePowerupHud();
 }
 function burst(x,y,color){for(let i=0;i<8;i++)particles.push({x,y,vx:(Math.random()-.5)*150,vy:(Math.random()-.5)*150,life:.4,color})}
 function updateParticles(dt){particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt});particles=particles.filter(p=>p.life>0)}
 function bossTransition(kind,target){
  boss.transition={kind,time:0,x:target.x,y:target.y};seeds=[];drops=[];clearControls();
  for(let i=0;i<7;i++)burst(target.x+(Math.random()-.5)*90,target.y+(Math.random()-.5)*60,kind==='split'?'#ff85b5':'#ffdc58');
  sound(kind==='split'?'rage':'victory');
  document.querySelector('#game-encounter').textContent=kind==='split'?'NOT OVER YET · THE VULTURE IS SPLITTING':'BOSS CLEARED · THE SKY IS YOURS';
  document.querySelector('#game-status').textContent=kind==='split'?`The turkey vulture splits into ${boss.splitCount}. Get ready for the next battle.`:'Boss cleared. 2,000 bonus points and one extra life.';
  if(kind==='victory'){bossesCleared++;lives++;if(bossesCleared%3===0){continues++;document.querySelector('#game-status').textContent+=' One continue earned.'}addScore(2000)}
 }
 function advanceBossTransition(dt){
  const t=boss.transition;t.time+=dt;updateParticles(dt);
  if(t.time<(t.kind==='split'?2.8:2.2))return;
  if(t.kind==='split'){
   boss.twins=Array.from({length:boss.splitCount},(_,i)=>({x:W*(i+1)/(boss.splitCount+1),y:140,hp:boss.twinHp,maxHp:boss.twinHp,phase:i*Math.PI,dir:i%2?-1:1}));delete boss.transition;
   boss.volley=0;dropAt=1.8;invincible=2;chirpAt=3;sound('boss');
   document.querySelector('#game-encounter').textContent=`WAVE ${String(wave).padStart(2,'0')} · ${boss.splitCount} VULTURES · BOSS ${boss.round}`;
   document.querySelector('#game-status').textContent=`${boss.splitCount} vultures, ${boss.twinHp} health each. Defeat them all to clear boss ${boss.round}.`;
  }else{wave++;formation();hud()}
 }
 function step(dt){
  if(boss?.transition){advanceBossTransition(dt);return}
  updatePickups(dt);
  invincible=Math.max(0,invincible-dt);shotAt-=dt;dropAt-=dt;chirpAt-=dt;
  if(chirpAt<=0){if(boss)sound('hiss');else if(birds.length)sound('chirp',birds[Math.floor(Math.random()*birds.length)].type);chirpAt=3+Math.random()*2}
  const dx=(keys.has('right')?1:0)-(keys.has('left')?1:0),dy=(keys.has('down')?1:0)-(keys.has('up')?1:0),distance=Math.hypot(dx,dy)||1;
  player=Math.max(hasPower('skeen')?90:24,Math.min(W-(hasPower('skeen')?90:24),player+dx/distance*360*dt));
  playerY=Math.max(65,Math.min(H-35,playerY+dy/distance*360*dt));
  if(keys.has('fire')&&shotAt<=0){for(const offset of hasPower('skeen')?[-72,-42,0,42,72]:[0])seeds.push({x:player+offset,y:playerY-13});shotAt=hasPower('guns')?.06:.2;sound('shot')}
  if(boss){
   pickupAt-=dt;if(pickupAt<=0){const target=(boss.twins||[boss])[0];spawnPickup(target.x,target.y);pickupAt=10}
   const targets=boss.twins||[boss],enraged=boss.twins?targets.reduce((total,b)=>total+b.hp,0)<=boss.splitCount*boss.twinHp/2:boss.hp<=boss.maxHp/2;
   for(const b of targets){
    b.phase+=dt;if(boss.kind==='seagull'){b.x=400+Math.sin(b.phase*.65)*160;b.y=145+Math.sin(b.phase*1.3)*15;continue}b.x+=(boss.twins?b.dir:direction)*(boss.twins?(enraged?195:155):(enraged?135:90))*boss.speed*enemySpeed*dt;b.y=(boss.twins?140:115)+Math.sin(b.phase*2)*35;
    const edge=boss.twins?65:100;
    if(b.x<edge||b.x>W-edge){if(boss.twins)b.dir*=-1;else direction*=-1;b.x=Math.max(edge,Math.min(W-edge,b.x))}
   }
   if(boss.kind==='seagull'){
    boss.aimAt-=dt;
    if(boss.aimAt<=.6&&!boss.aimTarget)boss.aimTarget={x:player,y:playerY};
    if(boss.aimAt<=0){
     const angle=Math.atan2(boss.aimTarget.y-boss.y-45,boss.aimTarget.x-boss.x);
     for(const spread of [-.12,0,.12])drops.push({x:boss.x,y:boss.y+45,vx:Math.cos(angle+spread)*220,vy:Math.sin(angle+spread)*220});
     boss.aimTarget=null;boss.aimAt=(enraged?1.65:2.2)/enemySpeed;sound('attack');
    }
   }
   if(dropAt<=0){
    sound('attack');
    if(boss.kind==='seagull'){
     // Leave three adjacent shots out of the crescent to form a dodge corridor.
     const speed=Math.min(180,145+(boss.round-1)*7);
     for(let i=0;i<23;i++)if(Math.abs(i-boss.gapIndex)>1){const angle=.18+i*(Math.PI-.36)/22;drops.push({x:boss.x+Math.cos(angle)*70,y:boss.y+Math.sin(angle)*70,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,crescent:true})}
     boss.volley++;boss.gapIndex=[11,8,11,14][boss.volley%4];
     if(enraged){boss.burstCount=(boss.burstCount+1)%3;dropAt=(boss.burstCount?1.1:1.8)/enemySpeed}else dropAt=3/enemySpeed;
    }else{
     const b=targets[boss.volley%targets.length],spread=[[-70,0,70],[-85,-35],[35,85]][boss.volley%3];
     for(const vx of spread)drops.push({x:b.x,y:b.y+35,vx,vy:Math.min(230,180+(boss.round-1)*7)});
     boss.volley++;dropAt=boss.volley%3===0?2.1:Math.max(1,(1.3-(boss.round-1)*.06)/enemySpeed);
    }
   }
  }else{
   const speed=(30+wave*8+(24-birds.length)*2)*enemySpeed;
   if(birds.some(b=>b.x+direction*speed*dt<28||b.x+direction*speed*dt>W-28)){direction*=-1;birds.forEach(b=>b.y+=20)}
   birds.forEach(b=>b.x+=direction*speed*dt);
   if(dropAt<=0&&birds.length){const b=birds[Math.floor(Math.random()*birds.length)];drops.push({x:b.x,y:b.y+20,vx:0});dropAt=Math.max(.22,(1.1-wave*.1)/enemySpeed)}
  }
  seeds.forEach(s=>s.y-=520*dt);drops.forEach(d=>{d.y+=(d.vy??(150+wave*15))*enemySpeed*dt;d.x+=(d.vx||0)*enemySpeed*dt});
  for(const seed of seeds){
   const target=boss&&(boss.twins||[boss]).find(b=>Math.abs(b.x-seed.x)<(boss.twins?Math.max(26,47-(boss.splitCount-2)*3):boss.kind==='seagull'?100:72)&&Math.abs(b.y-seed.y)<(boss.twins?30:42));
   if(target){
    seed.y=-100;target.hp--;sound(target.hp===Math.floor(target.maxHp/2)?'rage':'boss-hit');burst(seed.x,target.y,'#ffdc58');
    if(!target.hp){
     if(boss.kind==='seagull'){bossTransition('victory',target);return}
     if(!boss.twins){bossTransition('split',target);return}
     burst(target.x,target.y,'#ff85b5');boss.twins=boss.twins.filter(b=>b!==target);
     if(!boss.twins.length){bossTransition('victory',target);return}
    }
   }else{const index=birds.findIndex(b=>Math.abs(b.x-seed.x)<23&&Math.abs(b.y-seed.y)<20);if(index>=0){const b=birds.splice(index,1)[0];seed.y=-100;sound('hit',b.type);addScore(species[b.type].points);if(++defeatedCount%5===0)spawnPickup(b.x,b.y);burst(b.x,b.y,b.type===0?'#ff85b5':'#b8e85a')}}
  }
  seeds=seeds.filter(s=>s.y>-10);drops=drops.filter(d=>d.y>-20&&d.y<H+10&&d.x>-10&&d.x<W+10);
  const hit=drops.find(d=>Math.abs(d.x-player)<22&&Math.abs(d.y-playerY)<19);
  if(hit&&invincible<=0&&!hasPower('superman')){drops=drops.filter(d=>d!==hit);lives--;sound('damage');invincible=1.5;burst(player,playerY,'#ffdc58');hud();if(!lives){finish();return}}
  if(birds.some(b=>b.y>425)){if(hasPower('superman'))birds=birds.filter(b=>b.y<=425);else{finish();return}}
  if(!birds.length&&!boss){wave++;formation();hud()}
  updateParticles(dt);
 }
 function draw(time){
  ctx.fillStyle='#030711';ctx.fillRect(0,0,W,H);
  ctx.imageSmoothingEnabled=true;
  for(const {tile,speed} of spaceLayers){const y=spaceTime*speed%tile.height;ctx.drawImage(tile,0,y);ctx.drawImage(tile,0,y-tile.height)}
  ctx.imageSmoothingEnabled=false;
  const frame=Math.floor(time/180)%2;
  if(sprites.complete&&sprites.naturalWidth&&neighbors.complete&&neighbors.naturalWidth){
   for(const b of birds){const original=b.type<2,img=original?sprites:neighbors,sw=img.naturalWidth/2,sh=img.naturalHeight/(original?2:5),row=original?b.type:b.type-2;ctx.drawImage(img,frame*sw,row*sh,sw,sh,b.x-32,b.y-32+Math.sin(time/180+b.type)*2,64,64)}
   if(boss){
    const bossSprite=boss.kind==='seagull'?seagull:neighbors,sw=bossSprite.naturalWidth/2,sh=bossSprite.naturalHeight/(boss.kind==='seagull'?1:5);
    const drawBoss=(x,y,size,alpha=1)=>{if(boss.kind==='seagull')size*=1.6;ctx.globalAlpha=alpha;ctx.drawImage(bossSprite,frame*sw,boss.kind==='seagull'?0:4*sh,sw,sh,x-size/2,y-size/2,size,size);ctx.globalAlpha=1};
    if(boss.transition){
     const t=boss.transition,p=Math.min(1,t.time/2.8);ctx.strokeStyle=t.kind==='split'?'#ff85b5':'#ffdc58';ctx.lineWidth=4;ctx.globalAlpha=1-p;ctx.beginPath();ctx.arc(t.x,t.y,25+t.time*100,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
     if(t.kind==='split'){
      if(t.time<.8)drawBoss(t.x+Math.sin(t.time*45)*3,t.y,180*(1-t.time*.5),1-t.time);
      if(t.time>.55){const emerge=Math.min(1,(t.time-.55)/1.7),ease=1-Math.pow(1-emerge,3);for(const x of Array.from({length:boss.splitCount},(_,i)=>W*(i+1)/(boss.splitCount+1)))drawBoss(t.x+(x-t.x)*ease,t.y+(140-t.y)*ease,45+(Math.max(60,120-(boss.splitCount-2)*10)-45)*emerge,emerge)}
     }
     ctx.textAlign='center';ctx.fillStyle=t.kind==='split'?'#ff85b5':'#ffdc58';ctx.font='bold 36px monospace';ctx.fillText(t.kind==='split'?(t.time<1?'YOU THOUGHT.':boss.splitCount===2?'DOUBLE TROUBLE.':'FLOCK MULTIPLIED.'):'FLOCK. OFF.',W/2,290);
     ctx.fillStyle='#fff9e9';ctx.font='14px monospace';ctx.fillText(t.kind==='split'?`${boss.splitCount} VULTURES. ZERO MERCY.`:`+2000 · +1 LIFE${bossesCleared%3===0?' · +1 CONTINUE':''}`,W/2,320);
    }else{
     const targets=boss.twins||[boss];
     for(const [i,b] of targets.entries()){drawBoss(b.x,b.y,boss.twins?Math.max(60,120-(boss.splitCount-2)*10):180);const slot=(W-80)/targets.length,w=boss.twins?slot*.85:320,x=boss.twins?40+i*slot:240;ctx.fillStyle='#58465f';ctx.fillRect(x,31,w,10);ctx.fillStyle=b.hp>b.maxHp/2?'#ffdc58':'#ff85b5';ctx.fillRect(x,31,w*b.hp/b.maxHp,10)}
     if(boss.kind==='seagull'&&boss.aimTarget){
      const {x,y}=boss.aimTarget;ctx.save();ctx.strokeStyle='#ff85b5';ctx.lineWidth=2;ctx.setLineDash([4,6]);ctx.beginPath();ctx.moveTo(boss.x,boss.y+45);ctx.lineTo(x,y);ctx.stroke();ctx.setLineDash([]);
      ctx.beginPath();ctx.arc(x,y,14,0,Math.PI*2);ctx.moveTo(x-20,y);ctx.lineTo(x+20,y);ctx.moveTo(x,y-20);ctx.lineTo(x,y+20);ctx.stroke();ctx.restore();
     }
     if(boss.kind==='seagull'&&dropAt<=.8){
      const angle=.18+boss.gapIndex*(Math.PI-.36)/22,halfGap=2*(Math.PI-.36)/22;
      ctx.save();ctx.strokeStyle='#86e7ff';ctx.lineWidth=2;ctx.setLineDash([6,8]);ctx.beginPath();
      for(const edge of [angle-halfGap,angle+halfGap]){ctx.moveTo(boss.x+Math.cos(edge)*80,boss.y+Math.sin(edge)*80);ctx.lineTo(boss.x+Math.cos(edge)*440,boss.y+Math.sin(edge)*440)}
      ctx.stroke();ctx.restore();
     }
     if(dropAt<=.5){const b=targets[boss.volley%targets.length];ctx.fillStyle='#ffdc58';ctx.font='bold 20px monospace';ctx.textAlign='center';ctx.fillText('!',b.x,b.y+(boss.twins?70:95))}
     ctx.fillStyle='#fff9e9';ctx.font='bold 14px monospace';ctx.textAlign='center';ctx.fillText(boss.twins?`SPLIT FLOCK · ${targets.length} VULTURES REMAIN`:boss.kind==='seagull'?(boss.hp<=boss.maxHp/2?'SEAGULL · TRIPLE CRESCENT':'SEAGULL · FIND THE GAP'):'TURKEY VULTURE · '+(boss.hp>boss.maxHp/2?'BIG WING ENERGY':'ABSOLUTELY FERAL'),W/2,22);
    }
   }
  }
  ctx.fillStyle='#ffdc58';for(const s of seeds)ctx.fillRect(s.x-3,s.y-8,6,14);
  ctx.fillStyle='#ff85b5';for(const d of drops){if(d.crescent){ctx.fillStyle='#86e7ff';ctx.beginPath();ctx.arc(d.x,d.y,5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ff85b5';continue}ctx.fillRect(d.x-4,d.y-4,8,8);ctx.fillRect(d.x-2,d.y-7,4,14)}
  for(const pickup of pickups){
   ctx.save();ctx.translate(pickup.x,pickup.y);const color=pickupColors[pickup.type];
   ctx.shadowColor=color;ctx.shadowBlur=12;ctx.fillStyle='#101526';ctx.strokeStyle=color;ctx.lineWidth=2;
   ctx.beginPath();for(let i=0;i<6;i++){const angle=Math.PI/3*i;ctx.lineTo(Math.cos(angle)*20,Math.sin(angle)*20)}ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;
   ctx.fillStyle=color;
   if(pickup.type==='guns'){
    for(const [x,y,scale] of [[-9,1,.6],[0,-1,1],[9,1,.6]]){
     ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.beginPath();ctx.moveTo(0,-12);ctx.lineTo(-7,2);ctx.lineTo(-1,2);ctx.lineTo(-3,12);ctx.lineTo(8,-3);ctx.lineTo(2,-3);ctx.closePath();ctx.fill();ctx.restore();
    }
   }else if(pickup.type==='superman'){
    ctx.beginPath();ctx.moveTo(0,-12);ctx.lineTo(11,-7);ctx.lineTo(9,4);ctx.quadraticCurveTo(7,10,0,14);ctx.quadraticCurveTo(-7,10,-9,4);ctx.lineTo(-11,-7);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#fff9e9';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-6,-5);ctx.lineTo(-5,2);ctx.lineTo(-2,6);ctx.stroke();
   }else{
    for(const [x,y,scale] of [[-10,5,.65],[0,-4,1],[10,5,.65]]){
     ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(7,7);ctx.lineTo(0,4);ctx.lineTo(-7,7);ctx.closePath();ctx.fill();ctx.fillStyle='#86e7ff';ctx.fillRect(-2,7,4,4);ctx.fillStyle=color;ctx.restore();
    }
   }
   ctx.restore();
  }
  if(hasPower('superman')){ctx.strokeStyle='#86e7ff';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(player,playerY-2,29,24,0,0,Math.PI*2);ctx.stroke()}
  if(hasPower('superman')||invincible<=0||Math.floor(time/100)%2){
   for(const offset of hasPower('skeen')?[-72,-42,0,42,72]:[0]){
    const size=offset===0?64:42,sw=ships.naturalWidth/2;
    if(ships.complete&&sw)ctx.drawImage(ships,offset===0?0:sw,0,sw,ships.naturalHeight,player+offset-size/2,playerY-size/2,size,size);
   }
  }
  for(const p of particles){ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,5,5)}
 }
 function frame(time){const dt=Math.min((time-previous)/1000,.04);previous=time;if(state!=='paused')spaceTime+=dt;if(state==='playing')step(dt);draw(time);requestAnimationFrame(frame)}
 function syncControls(){
  keys.clear();for(const control of keyboardControls)keys.add(control);for(const controls of pointerControls.values())for(const control of controls)keys.add(control);
  document.querySelectorAll('[data-control]').forEach(button=>button.classList.toggle('is-held',keys.has(button.dataset.control)));
 }
 function clearControls(){keyboardControls.clear();pointerControls.clear();syncControls()}
 const mapping={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right',' ':'fire'};
 canvas.addEventListener('keydown',e=>{if(mapping[e.key]){e.preventDefault();if(state==='playing'){keyboardControls.add(mapping[e.key]);syncControls()}}if(e.key.toLowerCase()==='p'){e.preventDefault();togglePause()}});
 window.addEventListener('keyup',e=>{if(mapping[e.key]){keyboardControls.delete(mapping[e.key]);syncControls()}});
 canvas.addEventListener('blur',clearControls);window.addEventListener('blur',clearControls);
 for(const area of [document.querySelector('.game-screen'),document.querySelector('.game-controls')]){
  for(const event of ['copy','cut','paste','selectstart','contextmenu','dragstart'])area.addEventListener(event,e=>e.preventDefault());
  area.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&['a','c','v','x'].includes(e.key.toLowerCase()))e.preventDefault()});
 }
 const directionPad=document.querySelector('.direction-pad');
 function padControls(e){
  const rect=directionPad.getBoundingClientRect(),dx=(e.clientX-rect.left)/rect.width-.5,dy=(e.clientY-rect.top)/rect.height-.5,controls=[];
  if(Math.abs(dx)>.12&&Math.abs(dx)>=Math.abs(dy)*.55)controls.push(dx<0?'left':'right');
  if(Math.abs(dy)>.12&&Math.abs(dy)>=Math.abs(dx)*.55)controls.push(dy<0?'up':'down');
  return controls;
 }
 for(const target of [directionPad,...document.querySelectorAll('[data-control="fire"]')]){
  target.addEventListener('pointerdown',e=>{e.preventDefault();if(state!=='playing')return;canvas.focus({preventScroll:true});target.setPointerCapture(e.pointerId);pointerControls.set(e.pointerId,target===directionPad?padControls(e):['fire']);syncControls()});
  target.addEventListener('pointermove',e=>{if(target===directionPad&&pointerControls.has(e.pointerId)){pointerControls.set(e.pointerId,padControls(e));syncControls()}});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])target.addEventListener(event,e=>{pointerControls.delete(e.pointerId);syncControls()});
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='playing')togglePause()});
 start.addEventListener('click',begin);pause.addEventListener('click',togglePause);
 for(const img of [sprites,neighbors,seagull,ships])img.addEventListener('error',()=>{document.querySelector('#game-message').textContent='The sprites could not load. Refresh to bring the flock back.'});
 formation();hud();requestAnimationFrame(frame);
})();
