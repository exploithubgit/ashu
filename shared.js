const pageOrder=['index','chapter1','chapter2','chapter3','chapter4','chapter5','chapter6','chapter7','chapter8','chapter9','timeline','finale'];
const currentPage=window.location.pathname.split('/').pop().replace('.html','')||'index';
const pageIndex=pageOrder.indexOf(currentPage);
const totalPages=pageOrder.length;

document.addEventListener('DOMContentLoaded',()=>{
  // Page counter
  if(pageIndex>0&&pageIndex<totalPages-1){
    const counter=document.createElement('div');
    counter.className='page-counter';
    counter.textContent=`Part ${pageIndex} of ${totalPages-2}`;
    document.body.appendChild(counter);
  }

  // Watermark
  const wm=document.createElement('div');
  wm.className='watermark';
  wm.textContent='Letter for Ashu ♥';
  document.body.appendChild(wm);

  // Cursor glow
  const glow=document.createElement('div');
  glow.className='cursor-glow';
  document.body.appendChild(glow);
  let glowVisible=false;
  document.addEventListener('mousemove',e=>{
    if(!glowVisible){glow.style.opacity='1';glowVisible=true;}
    glow.style.left=e.clientX+'px';
    glow.style.top=e.clientY+'px';
    document.body.style.setProperty('--mouse-x',e.clientX+'px');
    document.body.style.setProperty('--mouse-y',e.clientY+'px');
  });

  // Print button
  if(pageIndex>0){
    const printBtn=document.createElement('button');
    printBtn.className='print-btn';
    printBtn.innerHTML='📄 Print Letter';
    printBtn.onclick=()=>window.print();
    document.body.appendChild(printBtn);
  }

  // Hearts with variety + click burst
  const heartTypes=['❤️','💕','💖','💗','💝'];
  setInterval(()=>{
    const h=document.createElement('div');
    h.className='heart-particle';
    h.innerHTML=heartTypes[Math.floor(Math.random()*heartTypes.length)];
    h.style.left=Math.random()*100+'%';
    h.style.animationDuration=(Math.random()*3+5)+'s';
    h.style.fontSize=(Math.random()*10+15)+'px';
    h.style.filter=`hue-rotate(${Math.random()*30-15}deg)`;
    h.addEventListener('click',function(e){
      e.stopPropagation();
      this.remove();
      for(let i=0;i<8;i++){
        const burst=document.createElement('div');
        burst.className='heart-burst';
        burst.innerHTML='💕';
        burst.style.left=e.clientX+'px';
        burst.style.top=e.clientY+'px';
        burst.style.fontSize='20px';
        const angle=Math.random()*360;
        const dist=Math.random()*100+50;
        burst.style.setProperty('--burst-x',Math.cos(angle)*dist+'px');
        burst.style.setProperty('--burst-y',Math.sin(angle)*dist+'px');
        document.body.appendChild(burst);
        setTimeout(()=>burst.remove(),800);
      }
      playSound('pop');
    });
    document.body.appendChild(h);
    setTimeout(()=>h.remove(),10000);
  },1800);

  // Parallax hearts
  let ticking=false;
  document.addEventListener('scroll',()=>{
    if(!ticking){
      window.requestAnimationFrame(()=>{
        const hearts=document.querySelectorAll('.heart-particle');
        hearts.forEach(h=>{
          const speed=parseFloat(h.dataset.speed||0.5);
          h.style.transform=`translateY(${window.scrollY*speed*-0.3}px)`;
        });
        ticking=false;
      });
      ticking=true;
    }
  });

  // Highlight Ashu's name
  const content=document.querySelector('.story-content');
  if(content){
    let html=content.innerHTML;
    html=html.replace(/Ashu/g,"<span class='name-highlight' data-name='ashu'>Ashu</span>");
    content.innerHTML=html;

    // Triple click easter egg
    let nameClicks=0;
    document.querySelectorAll("[data-name='ashu']").forEach(n=>{
      n.addEventListener('click',()=>{
        nameClicks++;
        if(nameClicks===3){
          nameClicks=0;
          showSecretMessage();
        }
        setTimeout(()=>nameClicks=0,2000);
      });
    });
  }

  // Secret message for triple-click
  function showSecretMessage(){
    const msg=document.createElement('div');
    msg.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,rgba(136,19,55,.95),rgba(244,63,94,.95));border:3px solid var(--rose-300);border-radius:20px;padding:3rem;z-index:10000;text-align:center;box-shadow:0 0 80px rgba(244,63,94,.8);animation:fadeInUp .5s;max-width:90%;';
    msg.innerHTML=`<div style='font-size:2.5rem;color:var(--rose-300);font-family:Playfair Display,serif;margin-bottom:1rem'>You found the secret! 💖</div><div style='font-size:1.3rem;color:#fafafa;line-height:1.8'>Every time you say my name,<br>my heart skips a beat.<br><br><span style='font-style:italic;color:var(--rose-200)'>I love you, Ashu.</span></div><button onclick='this.parentElement.remove()' style='margin-top:2rem;padding:.8rem 2rem;background:var(--rose-500);color:#fff;border:none;border-radius:25px;cursor:pointer;font-size:1rem;font-weight:600'>Close ❤️</button>`;
    document.body.appendChild(msg);
    playSound('secret');
  }

  // Easter egg: type "i love you"
  let typed='';
  document.addEventListener('keypress',e=>{
    typed+=e.key.toLowerCase();
    if(typed.length>20)typed=typed.slice(-20);
    if(typed.includes('iloveyou')||typed.includes('i love you')){
      typed='';
      heartExplosion();
    }
  });

  function heartExplosion(){
    for(let i=0;i<50;i++){
      setTimeout(()=>{
        const h=document.createElement('div');
        h.className='heart-burst';
        h.innerHTML=heartTypes[Math.floor(Math.random()*heartTypes.length)];
        h.style.left=Math.random()*100+'%';
        h.style.top=Math.random()*100+'%';
        h.style.fontSize=(Math.random()*20+20)+'px';
        document.body.appendChild(h);
        setTimeout(()=>h.remove(),800);
      },i*30);
    }
    playSound('explosion');
  }

  // Page transition with petals
  document.querySelectorAll('.nav-btn').forEach(btn=>{
    btn.addEventListener('click',function(e){
      if(this.classList.contains('next')){
        e.preventDefault();
        const href=this.getAttribute('href');
        petalTransition(()=>window.location.href=href);
      }
    });
  });

  function petalTransition(callback){
    playSound('page');
    for(let i=0;i<30;i++){
      setTimeout(()=>{
        const petal=document.createElement('div');
        petal.className='petal';
        petal.innerHTML='🌹';
        petal.style.left=Math.random()*100+'%';
        petal.style.fontSize=(Math.random()*15+15)+'px';
        petal.style.animationDelay=Math.random()*0.5+'s';
        document.body.appendChild(petal);
        setTimeout(()=>petal.remove(),3000);
      },i*40);
    }
    setTimeout(callback,800);
  }

  // Music with pulse
  const music=document.getElementById('bgMusic');
  const btn=document.getElementById('musicControl');
  if(music&&btn){
    let playing=false;
    const set=()=>btn.textContent=playing?'🔊':'🎵';
    try{music.currentTime=parseFloat(localStorage.getItem('musicTime'))||0;}catch(e){}
    async function play(){
      try{
        await music.play();
        playing=true;
        localStorage.setItem('musicPlaying','true');
        set();
        startMusicPulse();
      }catch(e){playing=false;localStorage.setItem('musicPlaying','false');set();}
    }
    function pause(){music.pause();playing=false;localStorage.setItem('musicPlaying','false');set();}
    btn.addEventListener('click',()=>{playing?pause():play();});
    setInterval(()=>{if(playing)localStorage.setItem('musicTime',music.currentTime);},1000);
    if(localStorage.getItem('musicPlaying')==='true')play();
    set();

    function startMusicPulse(){
      // Sync button pulse with music beat (approximate)
      setInterval(()=>{
        if(playing){
          btn.style.transform='scale(1.15)';
          setTimeout(()=>btn.style.transform='scale(1)',100);
        }
      },600);
    }
  }

  // Sounds (silent if no audio files)
  const sounds={pop:null,page:null,explosion:null,secret:null};
  function playSound(type){
    try{
      if(sounds[type]){
        sounds[type].currentTime=0;
        sounds[type].play().catch(()=>{});
      }
    }catch(e){}
  }

  // 3D tilt on cards
  document.querySelectorAll('.memory-card, .quote-box').forEach(card=>{
    card.addEventListener('mousemove',function(e){
      const rect=this.getBoundingClientRect();
      const x=e.clientX-rect.left;
      const y=e.clientY-rect.top;
      const centerX=rect.width/2;
      const centerY=rect.height/2;
      const rotateX=(y-centerY)/20;
      const rotateY=(centerX-x)/20;
      this.style.transform=`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave',function(){
      this.style.transform='perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // Background color per page (emotional shift)
  const bgColors={
    'index':'linear-gradient(135deg,#000,#1a0a0f,#000)',
    'chapter1':'linear-gradient(to bottom,#000,#0f0f0f,#000)',
    'chapter2':'linear-gradient(to bottom,#0a0a0a,#1a0a14,#000)',
    'chapter3':'radial-gradient(ellipse at center,#1a0505 0%,#000 100%)',
    'chapter4':'linear-gradient(to bottom,#000,#0f0f0f,#000)',
    'chapter5':'linear-gradient(135deg,#000 0%,#0f0a14 40%,#000 100%)',
    'chapter6':'linear-gradient(to bottom,#000,#0f0f0f,#000)',
    'chapter7':'linear-gradient(to bottom,#000,#1a0a14,#000)',
    'chapter8':'linear-gradient(to bottom,#000,#0a0514,#000)',
    'chapter9':'linear-gradient(to bottom,#000,#0a1628,#000)',
    'timeline':'linear-gradient(to bottom,#000,#2d0a1f,#000)',
    'finale':'radial-gradient(ellipse at center,#4c0519 0%,#000 70%)'
  };
  if(bgColors[currentPage]){
    document.body.style.background=bgColors[currentPage];
  }

  // Keyboard navigation
  document.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'){const p=document.querySelector('.nav-btn.prev');if(p)p.click();}
    if(e.key==='ArrowRight'){const n=document.querySelector('.nav-btn.next');if(n)n.click();}
  });
});
