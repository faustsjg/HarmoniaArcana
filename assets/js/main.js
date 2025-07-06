import { UI } from './ui.js';
import { Director } from './director.js';
import { API_KEY_STORAGE_ID } from './config.js';

let carouselIndex=0;

document.addEventListener('DOMContentLoaded',()=>{
  UI.init(API_KEY_STORAGE_ID);
  bindHandlers();
});

function bindHandlers(){
  UI.landingStartBtn.onclick = ()=>UI.showScreen('carousel-screen');
  UI.carouselPrev.onclick = ()=>{ if(carouselIndex>0) updateCarousel(--carouselIndex);};
  UI.carouselNext.onclick = ()=>{
    if(carouselIndex<2) updateCarousel(++carouselIndex);
    else UI.showScreen('universe-selection-screen');
  };
  UI.saveApiKeyBtn.onclick =()=>{
    const key=UI.apiKeyInput.value.trim();
    if(!key.startsWith('hf_')) return alert('Clau no vàlida');
    localStorage.setItem(API_KEY_STORAGE_ID, key);
    UI.showScreen('universe-selection-screen');
  };
  UI.changeApiKeyBtn.onclick=()=>{
    localStorage.removeItem(API_KEY_STORAGE_ID);
    UI.showScreen('carousel-screen');
  };
  document.querySelectorAll('.universe-card').forEach(c=>{
    c.onclick=()=>{
      const uni=c.dataset.universe, key=localStorage.getItem(API_KEY_STORAGE_ID);
      if(!key) return alert('Clau no desada');
      if(uni==='custom') return UI.showScreen('upload-screen');
      Director.init(key, uni);
    };
  });
  UI.uploadDoneBtn.onclick=()=>{
    const key=localStorage.getItem(API_KEY_STORAGE_ID);
    Director.init(key, 'custom');
  };
  UI.toggleListeningBtn.onclick=()=> Director.toggleListening();
  UI.stopMusicBtn.onclick=()=> Director.toggleMusic();
  UI.stopSessionBtn.onclick=()=> Director.endSession();
  document.querySelectorAll('#effect-buttons button').forEach(btn=>{
    btn.onclick=()=> Director.playEffect(btn.dataset.effect);
  });
  updateCarousel(0);
}

function updateCarousel(i){
  carouselIndex=i;
  document.querySelectorAll('.carousel-step').forEach((el,idx)=>{
    idx===i?el.classList.remove('hidden'):el.classList.add('hidden');
  });
  UI.carouselPrev.style.visibility = i===0?'hidden':'visible';
}
