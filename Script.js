'use strict';

/* ════════════════════════════════════════════════════════
   DÉTECTION MOBILE
════════════════════════════════════════════════════════ */
var _isMobileDevice = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

/* ════════════════════════════════════════════════════════
   FIX SAFARI IOS — ROTATION
════════════════════════════════════════════════════════ */
(function () {
  if (!_isMobileDevice) return;
  var _freezeStyle = document.createElement('style');
  _freezeStyle.textContent =
    'body.orientation-freeze *,' +
    'body.orientation-freeze *::before,' +
    'body.orientation-freeze *::after {' +
      'animation-play-state: paused !important;' +
      'transition: none !important;' +
    '}' +
    'body.orientation-freeze html { scroll-behavior: auto !important; }';
  document.head.appendChild(_freezeStyle);
  var _freezeTimer = null;
  window.addEventListener('orientationchange', function () {
    document.body.classList.add('orientation-freeze');
    clearTimeout(_freezeTimer);
    _freezeTimer = setTimeout(function () {
      document.body.classList.remove('orientation-freeze');
    }, 500);
  });
})();

/* ════════════════════════════════════════════════════════
   SCROLL + NAV ACTIVE
════════════════════════════════════════════════════════ */
(function () {
  var sp       = document.getElementById('scrollProgress');
  var navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  var sections = Array.from(document.querySelectorAll('section,#about,#timeline,#skills,#projects,#projet-ap,#contact-section'));
  var ticking  = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var s = window.scrollY, tot = document.body.scrollHeight - window.innerHeight;
      if (sp) sp.style.width = (tot > 0 ? (s / tot) * 100 : 0) + '%';
      var active = '';
      for (var i = 0; i < sections.length; i++) if (s >= sections[i].offsetTop - 220) active = sections[i].id;
      navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + active); });
      ticking = false;
    });
  }, { passive: true });
})();

/* ════════════════════════════════════════════════════════
   ANIMATIONS AU SCROLL
════════════════════════════════════════════════════════ */
(function () {
  var tlObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e, i) { if (!e.isIntersecting) return; setTimeout(function () { e.target.classList.add('visible'); }, i * 150); tlObs.unobserve(e.target); });
  }, { threshold: 0.2 });
  document.querySelectorAll('.timeline-item').forEach(function (el) { tlObs.observe(el); });

  var skObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.skill-tag').forEach(function (t, i) { t.style.transitionDelay = (i * 0.08) + 's'; });
      e.target.classList.add('visible'); skObs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-card').forEach(function (c) { skObs.observe(c); });

  var rvObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e, i) { if (!e.isIntersecting) return; setTimeout(function () { e.target.classList.add('visible'); }, i * 80); rvObs.unobserve(e.target); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function (el) { rvObs.observe(el); });
})();

/* ════════════════════════════════════════════════════════
   CARTE FLIP
════════════════════════════════════════════════════════ */
(function () {
  var state = 'closed', clone = null, origRect = null, expandTimer = null;
  window.handleFlip = function () {
    if (state !== 'closed') return;
    state = 'flipping';
    var card = document.getElementById('flipCard');
    if (!card) { state = 'closed'; return; }
    origRect = card.getBoundingClientRect();
    card.style.transition = 'transform 0.85s cubic-bezier(0.4,0.2,0.2,1)';
    card.style.transform  = 'rotateY(180deg)';
    setTimeout(function () {
      if (state !== 'flipping') return;
      card.style.visibility = 'hidden';
      clone = card.cloneNode(true);
      clone.id = 'flipCardClone'; clone.classList.add('is-clone'); clone.removeAttribute('onclick');
      var vvp = window.visualViewport || null;
      var vw  = vvp ? Math.round(vvp.width)  : window.innerWidth;
      var vh  = vvp ? Math.round(vvp.height) : window.innerHeight;
      var vx  = vvp ? Math.round(vvp.offsetLeft) : 0;
      var vy  = vvp ? Math.round(vvp.offsetTop)  : 0;
      var tW,tH,tLeft,tTop;
      if(_isMobileDevice){
        tW    = Math.min(vw * 0.88, 400);
        tH    = Math.min(tW * (4/3), vh * 0.85);
        tW    = Math.min(tW, tH * (3/4));
        tLeft = vx + (vw - tW) / 2;
        tTop  = vy + (vh - tH) / 2;
        if(tLeft < 8) tLeft = 8;
        if(tTop  < 8) tTop  = 8;
        if(tLeft + tW > vx + vw - 8) tLeft = vx + vw - tW - 8;
        if(tTop  + tH > vy + vh - 8) tTop  = vy + vh - tH - 8;
      } else {
        var maxH=Math.min(vh*.995,1060),maxW=Math.min(vw*.96,900);
        tH=maxH; tW=Math.min(maxW,tH*(5/6)); tLeft=(vw-tW)/2; tTop=(vh-tH)/2;
      }
      if(_isMobileDevice){
        clone.style.cssText = [
          'position:fixed','left:'+tLeft+'px','top:'+tTop+'px',
          'width:'+tW+'px','height:'+tH+'px','margin:0','z-index:1000',
          'transform:rotateY(180deg) scale(0.85)','transform-style:preserve-3d',
          'transition:none','visibility:visible','opacity:0','aspect-ratio:unset'
        ].join(';');
      } else {
        clone.style.cssText = [
          'position:fixed','left:'+origRect.left+'px','top:'+origRect.top+'px',
          'width:'+origRect.width+'px','height:'+origRect.height+'px','margin:0',
          'z-index:1000','transform:rotateY(180deg)','transition:none',
          'visibility:visible','transform-style:preserve-3d','aspect-ratio:unset'
        ].join(';');
      }
      document.body.appendChild(clone);
      var bd = document.getElementById('cardBackdrop'); if (bd) bd.classList.add('active');
      document.body.style.overflow = 'hidden';
      var cb = clone.querySelector('.back-close');
      if (cb) { cb.style.display = 'flex'; cb.onclick = function (e) { e.stopPropagation(); window.closeCard(); }; }
      void clone.offsetHeight;
      if(_isMobileDevice){
        clone.style.transition = 'transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease';
        clone.style.transform  = 'rotateY(180deg) scale(1)';
        clone.style.opacity    = '1';
        state = 'open';
        expandTimer = setTimeout(function(){ if(clone) clone.classList.add('expanded'); }, 500);
      } else {
        clone.style.transition='left 1s cubic-bezier(0.16,1,0.3,1),top 1s cubic-bezier(0.16,1,0.3,1),width 1s cubic-bezier(0.16,1,0.3,1),height 1s cubic-bezier(0.16,1,0.3,1)';
        clone.style.left=tLeft+'px'; clone.style.top=tTop+'px'; clone.style.width=tW+'px'; clone.style.height=tH+'px';
        state = 'open';
        expandTimer = setTimeout(function(){ if(clone) clone.classList.add('expanded'); }, 1050);
      }
    }, 900);
  };
  window.closeCard = function () {
    if (state !== 'open' || !clone) return;
    state = 'closing'; clearTimeout(expandTimer); clone.classList.remove('expanded');
    var bd = document.getElementById('cardBackdrop'); if (bd) bd.classList.remove('active');
    var card = document.getElementById('flipCard');
    if(_isMobileDevice){
      clone.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease';
      clone.style.transform  = 'rotateY(180deg) scale(0.85)';
      clone.style.opacity    = '0';
      setTimeout(function(){
        if(clone){ clone.remove(); clone = null; }
        document.body.style.overflow = '';
        if(card){ card.style.transition='none'; card.style.transform='rotateY(0deg)'; card.style.visibility='visible'; void card.offsetHeight; card.style.transition=''; card.style.transform=''; }
        state = 'closed';
      }, 360);
    } else {
      var currentRect = card ? card.getBoundingClientRect() : origRect;
      clone.style.transition='left .65s cubic-bezier(0.4,0,0.2,1),top .65s cubic-bezier(0.4,0,0.2,1),width .65s cubic-bezier(0.4,0,0.2,1),height .65s cubic-bezier(0.4,0,0.2,1)';
      clone.style.left=currentRect.left+'px'; clone.style.top=currentRect.top+'px'; clone.style.width=currentRect.width+'px'; clone.style.height=currentRect.height+'px';
      setTimeout(function () {
        if (!clone) return;
        clone.style.transition = 'transform .65s cubic-bezier(0.4,0.2,0.2,1)'; clone.style.transform = 'rotateY(0deg)';
        setTimeout(function () {
          if (clone) { clone.remove(); clone = null; } document.body.style.overflow = '';
          if (card) { card.style.transition='none'; card.style.transform='rotateY(0deg)'; card.style.visibility='visible'; void card.offsetHeight; card.style.transition=''; card.style.transform=''; }
          state = 'closed';
        }, 660);
      }, 620);
    }
  };
})();

/* ════════════════════════════════════════════════════════
   MODALS
════════════════════════════════════════════════════════ */
function openModal(id) { var m=document.getElementById('modal-'+id); if(m){m.classList.add('active');document.body.style.overflow='hidden';} }
function closeModalBtn(id) { var m=document.getElementById('modal-'+id); if(m){m.classList.remove('active');document.body.style.overflow='';} }
function closeModal(e,id) { if(e.target===e.currentTarget) closeModalBtn(id); }
function openSubModal(id) { var m=document.getElementById(id); if(m) m.classList.add('active'); }
function closeSubModalBtn(id) { var m=document.getElementById(id); if(m) m.classList.remove('active'); }
function closeSubModal(e,id) { if(e.target===e.currentTarget) closeSubModalBtn(id); }
function toggleAcc(id) {
  var body=document.getElementById(id),btn=body&&body.previousElementSibling;
  if(!body) return;
  var open=body.classList.toggle('open');
  if(btn&&btn.classList.contains('tech-accordion')) btn.classList.toggle('open',open);
}

/* ════════════════════════════════════════════════════════
   IMAGE MODAL
════════════════════════════════════════════════════════ */
function openImageModal(srcs,pov,size) {
  var overlay=document.getElementById('videoModal');
  var badge=document.getElementById('videoModalPov');
  var errDiv=document.getElementById('videoModalErr');
  var inner=document.querySelector('.video-modal-inner');
  var bar=document.querySelector('.video-modal-bar');
  var wrap=document.querySelector('.video-modal-wrap');
  _gifReset();
  inner.querySelectorAll('#videoModalMedia,.static-screen-img').forEach(function(el){el.remove();});
  if(bar){bar.innerHTML='';bar.style.visibility='hidden';}
  badge.innerHTML='';badge.style.cssText='display:none;';errDiv.style.display='none';
  var maxW=size?size+'px':'98vw';
  if(wrap) wrap.style.cssText='background:transparent;box-shadow:none;border:none;padding:0;max-width:'+maxW+';width:'+maxW+';pointer-events:none;';
  inner.style.cssText='display:flex;flex-direction:row;align-items:center;justify-content:center;gap:48px;background:transparent;box-shadow:none;border:none;padding:0;overflow:visible;pointer-events:none;';
  var list=Array.isArray(srcs)?srcs:[srcs],labels=['\uD83D\uDC51 POV Admin','\uD83D\uDC64 POV Membre'],useWidth=!!size;
  list.forEach(function(src,i){
    var wrapper=document.createElement('div');wrapper.className='static-screen-img';
    wrapper.style.cssText='display:flex;flex-direction:column;align-items:center;gap:12px;pointer-events:auto;'+(useWidth?'width:100%;':'');
    var label=document.createElement('div');label.innerHTML=labels[i]||'';
    label.style.cssText='font-family:Cinzel,serif;font-size:14px;letter-spacing:3px;color:'+(i===0?'#C89B3C':'#5DE8F2')+';text-shadow:0 0 10px currentColor;';
    var img=document.createElement('img');
    img.style.cssText=useWidth?'display:block;width:100%;height:auto;object-fit:contain;border-radius:12px;box-shadow:0 0 40px rgba(0,0,0,0.9);':'display:block;height:75vh;width:auto;max-width:46vw;object-fit:contain;border-radius:12px;box-shadow:0 0 40px rgba(0,0,0,0.9);';
    img.onerror=function(){img.style.display='none';};img.src=src;
    wrapper.appendChild(label);wrapper.appendChild(img);inner.appendChild(wrapper);
  });
  overlay.classList.add('open');
}

/* ════════════════════════════════════════════════════════
   CACHE GIF (desktop uniquement)
════════════════════════════════════════════════════════ */
var _gifCache = {};

function _checkAndEvictCache() {
  var total = 0, keys = Object.keys(_gifCache);
  for (var i = 0; i < keys.length; i++) { total += _gifCache[keys[i]].byteLength; }
  if (total > 40 * 1024 * 1024) { _gifCache = {}; }
}

function _patchDelays(origBuffer, speed) {
  var bytes = new Uint8Array(origBuffer.slice(0));
  for (var i = 0; i < bytes.length - 7; i++) {
    if (bytes[i]===0x21 && bytes[i+1]===0xF9 && bytes[i+2]===0x04) {
      var d = bytes[i+4] | (bytes[i+5]<<8);
      if (d < 2) d = 10;
      var nd = Math.max(2, Math.round(d / speed));
      bytes[i+4] = nd & 0xFF; bytes[i+5] = (nd >> 8) & 0xFF;
      i += 7;
    }
  }
  return bytes.buffer;
}

var _blobUrls = [];
function _makeBlobUrl(origBuffer, speed) {
  var patched = _patchDelays(origBuffer, speed);
  var blob    = new Blob([patched], { type: 'image/gif' });
  var url     = URL.createObjectURL(blob);
  _blobUrls.push(url);
  return url;
}
function _revokeBlobs() {
  var toRevoke = _blobUrls.slice(); _blobUrls = [];
  setTimeout(function() { toRevoke.forEach(function(u){ URL.revokeObjectURL(u); }); }, 1000);
}

var _modalOpen = false, _currentSrc = '', _currentSpd = 1;
function _gifReset() { _modalOpen = false; _currentSrc = ''; }

var _GIF_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];
var _SPEED_KEY   = 'gifSpeed:';
function _basename(src) { return src ? src.split('/').pop().split('?')[0] : ''; }
function _loadSpd(src)  { var v=parseFloat(localStorage.getItem(_SPEED_KEY+_basename(src))); return (!isNaN(v)&&v>0)?v:1; }
function _saveSpd(src,s){ localStorage.setItem(_SPEED_KEY+_basename(src), s); }

function _buildPanel(src) {
  var bar = document.querySelector('.video-modal-bar'); if (!bar) return;
  _currentSpd = _loadSpd(src);
  var name = _basename(src).replace(/\.gif$/i,'').replace(/_/g,' ');
  if (name.length > 26) name = name.slice(0,24)+'\u2026';
  bar.style.visibility = ''; bar.innerHTML = '';
  var p = document.createElement('div'); p.id = 'gifSpeedPanel';
  p.innerHTML =
    '<div id="gifSpeedFileName">'+name+'</div>'+
    '<div id="gifSpeedControls">'+
      '<button id="gifSpeedDown">\u2212</button>'+
      '<div id="gifSpeedInputWrap"><span id="gifSpeedPrefix">x</span>'+
        '<input id="gifSpeedInput" type="number" min="0.05" max="20" step="0.05" value="'+_currentSpd+'">'+
      '</div>'+
      '<button id="gifSpeedUp">+</button>'+
      '<button id="gifSpeedApply">\u23CE</button>'+
    '</div>'+
    '<div id="gifSpeedPresets">'+
      _GIF_PRESETS.map(function(s){return '<button class="spd-preset'+(Math.abs(s-_currentSpd)<0.001?' active':'')+'" data-spd="'+s+'">x'+s+'</button>';}).join('')+
    '</div>';
  bar.appendChild(p); _injectCSS();
  var input = document.getElementById('gifSpeedInput');
  document.getElementById('gifSpeedDown').onclick  = function(){ _setSpd(Math.max(0.05,Math.round((_currentSpd-0.05)*100)/100),src); };
  document.getElementById('gifSpeedUp').onclick    = function(){ _setSpd(Math.min(20,Math.round((_currentSpd+0.05)*100)/100),src); };
  document.getElementById('gifSpeedApply').onclick = function(){ _commitSpd(src); };
  input.addEventListener('keydown',function(e){ if(e.key==='Enter'){e.preventDefault();_commitSpd(src);} });
  input.addEventListener('input',function(){ _hlPreset(parseFloat(input.value)); });
  p.querySelectorAll('.spd-preset').forEach(function(btn){ btn.onclick=function(){ _setSpd(parseFloat(btn.dataset.spd),src); }; });
}

function _commitSpd(src) {
  var input=document.getElementById('gifSpeedInput'); if(!input) return;
  var v=parseFloat(input.value); if(isNaN(v)||v<=0){input.value=_currentSpd;return;}
  _setSpd(Math.max(0.05,Math.min(20,Math.round(v*100)/100)),src);
}
function _setSpd(spd,src) {
  _currentSpd=spd; _saveSpd(src,spd);
  var input=document.getElementById('gifSpeedInput'); if(input) input.value=spd;
  _hlPreset(spd); _toast('x'+spd+' \u2014 enregistr\u00e9'); _reloadImg(src,spd);
}
function _reloadImg(src,spd) {
  var buf=_gifCache[src]; if(!buf) return;
  _revokeBlobs();
  var newUrl=_makeBlobUrl(buf,spd), inner=document.querySelector('.video-modal-inner'); if(!inner) return;
  var oldImg=inner.querySelector('#videoModalMedia'), newImg=document.createElement('img');
  newImg.id='videoModalMedia-next';
  newImg.style.cssText=oldImg?oldImg.style.cssText+';position:absolute;opacity:0;pointer-events:none;':'display:block;width:100%;border-radius:18px;position:absolute;opacity:0;pointer-events:none;';
  newImg.onload=function(){ if(!_modalOpen||_currentSrc!==src){newImg.remove();return;} newImg.id='videoModalMedia'; newImg.style.position=''; newImg.style.opacity='1'; newImg.style.pointerEvents=''; if(oldImg&&oldImg.parentNode) oldImg.remove(); };
  newImg.onerror=function(){newImg.remove();};
  newImg.src=newUrl;
  if(oldImg&&oldImg.parentNode){inner.insertBefore(newImg,oldImg);}else{inner.insertBefore(newImg,inner.firstChild);}
}
function _hlPreset(spd) { document.querySelectorAll('.spd-preset').forEach(function(b){b.classList.toggle('active',Math.abs(parseFloat(b.dataset.spd)-spd)<0.001);}); }
function _toast(msg) {
  var old=document.getElementById('gifSpeedToast'); if(old) old.remove();
  var t=document.createElement('div'); t.id='gifSpeedToast'; t.textContent=msg;
  t.style.cssText='position:fixed;bottom:82px;left:50%;transform:translateX(-50%) translateY(10px);background:rgba(200,160,60,0.16);border:1px solid rgba(200,160,60,0.55);color:#f0c84a;font-family:Cinzel,serif;font-size:11px;letter-spacing:3px;padding:8px 22px;border-radius:20px;z-index:9999999;pointer-events:none;opacity:0;transition:opacity .22s,transform .22s;white-space:nowrap;';
  document.body.appendChild(t);
  requestAnimationFrame(function(){requestAnimationFrame(function(){t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)';});});
  setTimeout(function(){t.style.opacity='0';t.style.transform='translateX(-50%) translateY(10px)';setTimeout(function(){if(t.parentNode)t.remove();},280);},1600);
}
function _injectCSS() {
  if(document.getElementById('gifSpeedCSS')) return;
  var s=document.createElement('style'); s.id='gifSpeedCSS';
  s.textContent='#gifSpeedPanel{display:flex;flex-direction:column;align-items:center;gap:9px;padding:11px 14px 10px;background:rgba(0,0,0,0.62);backdrop-filter:blur(12px);border-radius:15px;border:1px solid rgba(200,160,60,0.28);width:100%;box-sizing:border-box;}#gifSpeedFileName{font-family:Cinzel,serif;font-size:9.5px;letter-spacing:1.8px;color:rgba(200,160,60,0.65);text-transform:uppercase;text-align:center;}#gifSpeedControls{display:flex;align-items:center;gap:8px;}#gifSpeedControls button{background:rgba(255,255,255,0.07);border:1px solid rgba(200,160,60,0.3);color:#fff;border-radius:8px;width:30px;height:30px;font-size:17px;cursor:pointer;transition:background .15s,transform .1s,border-color .15s;display:flex;align-items:center;justify-content:center;flex-shrink:0;}#gifSpeedControls button:hover{background:rgba(200,160,60,0.22);border-color:rgba(200,160,60,0.7);transform:scale(1.1);}#gifSpeedApply{font-size:14px!important;color:#c8a03c!important;border-color:rgba(200,160,60,0.5)!important;}#gifSpeedInputWrap{display:flex;align-items:center;background:rgba(255,255,255,0.06);border:1.5px solid rgba(200,160,60,0.45);border-radius:9px;padding:0 8px;gap:2px;transition:border-color .2s;}#gifSpeedInputWrap:focus-within{border-color:rgba(200,160,60,0.9);background:rgba(200,160,60,0.08);}#gifSpeedPrefix{font-family:Cinzel,serif;font-size:15px;font-weight:700;color:#c8a03c;pointer-events:none;user-select:none;}#gifSpeedInput{background:transparent;border:none;outline:none;font-family:Cinzel,serif;font-size:17px;font-weight:700;color:#f0c84a;width:58px;text-align:center;padding:4px 2px;-moz-appearance:textfield;}#gifSpeedInput::-webkit-inner-spin-button,#gifSpeedInput::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}#gifSpeedPresets{display:flex;gap:5px;flex-wrap:wrap;justify-content:center;}.spd-preset{font-family:Cinzel,serif;font-size:10.5px;padding:3px 9px;border-radius:6px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.48);cursor:pointer;transition:all .15s;letter-spacing:.4px;}.spd-preset:hover{background:rgba(200,160,60,0.12);color:#c8a03c;border-color:rgba(200,160,60,0.45);}.spd-preset.active{background:rgba(200,160,60,0.2);border-color:rgba(200,160,60,0.75);color:#f0c84a;font-weight:700;}';
  document.head.appendChild(s);
}

/* ════════════════════════════════════════════════════════
   VIDEO MODAL
════════════════════════════════════════════════════════ */
function _safeSrc(src) { return src.split('').map(function(c){return c.charCodeAt(0)>127?encodeURIComponent(c):c;}).join(''); }
function _resolveGifSrc(src) { if(src.match(/^(https?:|data:|blob:)/)) return src; var a=document.createElement('a');a.href=src;return a.href; }

function openVideoModal(src,pov,size) {
  var overlay=document.getElementById('videoModal'),badge=document.getElementById('videoModalPov'),errDiv=document.getElementById('videoModalErr'),errPath=document.getElementById('videoModalErrPath'),inner=document.querySelector('.video-modal-inner'),wrap=document.querySelector('.video-modal-wrap'),bar=document.querySelector('.video-modal-bar');
  _gifReset();
  inner.querySelectorAll('#videoModalMedia,#videoModalMedia-next,canvas,.static-screen-img,#gifLoader').forEach(function(el){el.remove();});
  if(wrap){wrap.style.cssText='';if(size) wrap.style.maxWidth=size+'px';}
  if(bar){bar.innerHTML='';bar.style.visibility='hidden';}
  badge.innerHTML=pov; errDiv.style.display='none';
  var safeSrc=_safeSrc(src), ext=safeSrc.split('?')[0].split('.').pop().toLowerCase();
  if(ext==='gif'){
    _currentSrc=src; _modalOpen=true;
    if(_isMobileDevice){
      var imgM=document.createElement('img');imgM.id='videoModalMedia';imgM.style.cssText='display:block;width:100%;border-radius:18px;';
      imgM.onerror=function(){errPath.textContent=safeSrc;errDiv.style.display='block';};imgM.src=safeSrc;
      inner.insertBefore(imgM,inner.firstChild);overlay.classList.add('open');return;
    }
    _buildPanel(src);
    var absSrc=_resolveGifSrc(safeSrc);
    if(_gifCache[src]){ _showGif(inner,src,_gifCache[src]); }
    else {
      var loader=document.createElement('div');loader.id='gifLoader';loader.style.cssText='color:rgba(200,160,60,0.6);font-family:Cinzel,serif;font-size:11px;letter-spacing:3px;text-align:center;padding:48px 0;width:100%;';loader.textContent='Chargement\u2026';inner.insertBefore(loader,inner.firstChild);
      fetch(absSrc).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.arrayBuffer();}).then(function(buf){var l=inner.querySelector('#gifLoader');if(l)l.remove();if(!_modalOpen||_currentSrc!==src)return;_checkAndEvictCache();_gifCache[src]=buf;_showGif(inner,src,buf);}).catch(function(){var l=inner.querySelector('#gifLoader');if(l)l.remove();if(!_modalOpen||_currentSrc!==src)return;var imgF=document.createElement('img');imgF.id='videoModalMedia';imgF.style.cssText='display:block;width:100%;border-radius:18px;';imgF.onerror=function(){errPath.textContent=safeSrc;errDiv.style.display='block';};imgF.src=safeSrc;inner.insertBefore(imgF,inner.firstChild);});
    }
  } else {
    var video=document.createElement('video');video.id='videoModalMedia';video.autoplay=true;video.loop=true;video.muted=true;video.playsInline=true;video.style.cssText='display:block;width:100%;min-height:100px;';
    var source=document.createElement('source');source.src=safeSrc;source.type='video/'+(ext==='webm'?'webm':'mp4');video.appendChild(source);
    video.onerror=function(){video.style.display='none';errPath.textContent=safeSrc;errDiv.style.display='block';};inner.insertBefore(video,inner.firstChild);
  }
  overlay.classList.add('open');
}

function _showGif(inner,src,buf){
  var url=_makeBlobUrl(buf,_currentSpd),img=document.createElement('img');img.id='videoModalMedia';img.style.cssText='display:block;width:100%;border-radius:18px;';
  img.onerror=function(){img.onerror=null;img.src=_safeSrc(src);};img.src=url;inner.insertBefore(img,inner.firstChild);
}

function closeVideoModal(){
  _gifReset();_revokeBlobs();
  var inner=document.querySelector('.video-modal-inner');
  if(inner){inner.querySelectorAll('#videoModalMedia,#videoModalMedia-next,canvas,.static-screen-img,#gifLoader').forEach(function(el){el.remove();});inner.style.cssText='';}
  var wrap=document.querySelector('.video-modal-wrap');if(wrap)wrap.style.cssText='';
  var badge=document.getElementById('videoModalPov');if(badge){badge.style.cssText='';badge.innerHTML='';}
  var bar=document.querySelector('.video-modal-bar');if(bar){bar.innerHTML='';bar.style.visibility='';}
  document.getElementById('videoModal').classList.remove('open');
}
function closeVideoModalOverlay(e){if(e.target===document.getElementById('videoModal'))closeVideoModal();}
function toggleGifSpeed(){}

/* ════════════════════════════════════════════════════════
   PROJETS PERSONNELS
════════════════════════════════════════════════════════ */
function toggleApProjects(){var grid=document.getElementById('apGrid'),btn=document.getElementById('apTeaserBtn');var open=grid.classList.toggle('open');btn.classList.toggle('open',open);}
function togglePersoProjects(){var grid=document.getElementById('persoGrid'),btn=document.getElementById('persoTeaserBtn');var open=grid.classList.toggle('open');btn.classList.toggle('open',open);}

/* ════════════════════════════════════════════════════════
   EASTER EGG — LOL / KARMINE CORP
   Tape "lol" en moins de 5s :
   → Carte Animal'and transformée en mode KC
   → Titre, description, bouton changent
   → Bouton ouvre une galerie de clips GIFs KC
   → Curseur KC activé
   → Retape "lol" pour désactiver
════════════════════════════════════════════════════════ */
(function(){
  var seq=['l','o','l'], ts=[], _kcActive=false;

  /* ── GIFs de clips KC — remplace les chemins par tes vrais fichiers ── */
  var KC_CLIPS = [
    { src: 'videos/kc/clip_pentakill.gif',   label: 'Pentakill 🔥' },
    { src: 'videos/kc/clip_baron.gif',        label: 'Baron Steal 😤' },
    { src: 'videos/kc/clip_comeback.gif',     label: 'Comeback 💪' },
    { src: 'videos/kc/clip_ace.gif',          label: 'ACE ! ⚔️' },
    { src: 'videos/kc/clip_nexus.gif',        label: 'GG WP 🏆' },
    { src: 'videos/kc/clip_skyroz.gif',       label: 'Skyroz 👑' },
    { src: 'videos/kc/clip_rekkles.gif',      label: 'Rekkles 🏹' },
    { src: 'videos/kc/clip_targamas.gif',     label: 'Targamas 🛡️' },
    { src: 'videos/kc/clip_canna.gif',        label: 'Canna 🗡️' },
  ];


  /* Sauvegarde originale des deux cartes */
  var _originalCards = [];

  /* ── Activer le mode KC — transforme les DEUX cartes ── */
  function _activateKC(){
    _kcActive=true;
    _injectKCCSS();
    document.documentElement.classList.add('custom-cursor');
    _originalCards = [];

    var cards = document.querySelectorAll('#projects .projects-grid .project-card');
    cards.forEach(function(card, idx){
      var vis = card.querySelector('.project-visual');
      var savedImgs = [];
      vis.querySelectorAll('img').forEach(function(img){
        savedImgs.push({alt:img.alt||'', src:img.src, dataSrc:img.dataset.src||''});
      });

      _originalCards.push({
        card           : card,
        visualChildren : Array.from(vis.childNodes).map(function(n){ return n.cloneNode(true); }),
        type           : card.querySelector('.project-type').textContent,
        title          : card.querySelector('.project-title').textContent,
        desc           : card.querySelector('.project-desc').textContent,
        btnHTML        : card.querySelector('.project-btn').outerHTML,
        savedImgs      : savedImgs,
      });

      /* Vider visuel proprement */
      vis.style.position = 'relative';
      while(vis.firstChild) vis.removeChild(vis.firstChild);

      /* Injecter logo KC */
      var ov = document.createElement('div'); ov.className='kc-visual-replace';
      var lg = document.createElement('img'); lg.className='kc-main-logo';
      lg.setAttribute('src','icon_kc.jpeg'); lg.removeAttribute('data-src');
      lg.alt='Karmine Corp'; lg.loading='eager';
      var lbl = document.createElement('div'); lbl.className='kc-main-label';
      lbl.textContent = idx===0 ? "Animal\'and Chat" : "Animal\'vest";
      ov.appendChild(lg); ov.appendChild(lbl); vis.appendChild(ov);
      var badge=document.createElement('div'); badge.className='kc-badge';
      badge.textContent='LOL MODE'; vis.appendChild(badge);

      /* Textes KC */
      card.querySelector('.project-type').textContent  = 'Esport \u2014 LEC / LFL';
      card.querySelector('.project-title').textContent = 'Karmine Corp';
      card.querySelector('.project-desc').textContent  = idx===0
        ? 'ALLEZ LES BLEUS ! La meilleure equipe de League of Legends. Ambiance, passion, victoires.'
        : 'Go KC go ! Une equipe, une famille, une passion. Rouge et bleu dans le sang.';

      /* Bouton KC */
      var oldBtn = card.querySelector('.project-btn');
      var newBtn = document.createElement('button');
      newBtn.className = 'project-btn kc-btn';
      newBtn.innerHTML = idx===0 ? '<span>\uD83C\uDFAC Voir les clips</span>' : '<span>\uD83C\uDFC6 Allez KC !</span>';
      newBtn.onclick = idx===0 ? _openGallery : function(){ _kcToast(true); };
      oldBtn.replaceWith(newBtn);

      card.classList.add('kc-active-card');
    });

    _kcToast(true);
  }

  /* ── Désactiver le mode KC ── */
  function _deactivateKC(){
    _kcActive=false;
    document.documentElement.classList.remove('custom-cursor');

    _originalCards.forEach(function(saved){
      var card = saved.card;
      var vis = card.querySelector('.project-visual');

      while(vis.firstChild) vis.removeChild(vis.firstChild);
      saved.visualChildren.forEach(function(node){ vis.appendChild(node.cloneNode(true)); });

      saved.savedImgs.forEach(function(info){
        vis.querySelectorAll('img').forEach(function(img){
          if(img.alt===info.alt){ img.src=info.src; if(info.dataSrc) img.dataset.src=info.dataSrc; }
        });
      });

      card.querySelector('.project-type').textContent  = saved.type;
      card.querySelector('.project-title').textContent = saved.title;
      card.querySelector('.project-desc').textContent  = saved.desc;

      var kcBtn = card.querySelector('.project-btn');
      if(kcBtn) kcBtn.outerHTML = saved.btnHTML;

      card.classList.remove('kc-active-card');
    });

    _originalCards = [];
    var gal = document.getElementById('kcGalleryOverlay'); if(gal) gal.remove();
    document.body.style.overflow='';
    _kcToast(false);
  }


  /* ── Ouvrir la galerie de clips ── */
  function _openGallery(){
    var old = document.getElementById('kcGalleryOverlay'); if(old) old.remove();
    var overlay = document.createElement('div'); overlay.id='kcGalleryOverlay';

    /* Header */
    var header = document.createElement('div'); header.className='kc-gal-header';
    var logo = document.createElement('img'); logo.className='kc-gal-logo'; logo.src='icon_kc.jpeg'; logo.alt='KC';
    var title = document.createElement('div'); title.className='kc-gal-title'; title.textContent='🏆 Clips Karmine Corp';
    var closeBtn = document.createElement('button'); closeBtn.className='kc-gal-close'; closeBtn.innerHTML='&#x2715;';
    closeBtn.onclick = function(){ overlay.remove(); document.body.style.overflow=''; };
    header.appendChild(logo); header.appendChild(title); header.appendChild(closeBtn);

    /* Grille */
    var grid = document.createElement('div'); grid.className='kc-gal-grid';
    KC_CLIPS.forEach(function(clip){
      var thumb = document.createElement('div'); thumb.className='kc-clip-thumb';
      var img = document.createElement('img'); img.src=clip.src; img.alt=clip.label;
      img.onerror=function(){ img.style.display='none'; thumb.style.background='linear-gradient(135deg,#2a0808,#08103a)'; };
      var lbl = document.createElement('div'); lbl.className='kc-clip-label'; lbl.textContent=clip.label;
      var playDiv = document.createElement('div'); playDiv.className='kc-clip-play';
      var playBtn = document.createElement('span'); playBtn.textContent='▶'; playDiv.appendChild(playBtn);
      thumb.appendChild(img); thumb.appendChild(lbl); thumb.appendChild(playDiv);
      thumb.onclick = function(){ openVideoModal(clip.src, '🎬 '+clip.label); };
      grid.appendChild(thumb);
    });

    overlay.appendChild(header); overlay.appendChild(grid);
    /* Ferme en cliquant sur le fond */
    overlay.addEventListener('click', function(e){ if(e.target===overlay){ overlay.remove(); document.body.style.overflow=''; } });
    document.body.appendChild(overlay);
    document.body.style.overflow='hidden';
  }

  /* ── Toast KC ── */
  function _kcToast(on){
    var old=document.getElementById('kcToast');if(old)old.remove();
    var t=document.createElement('div');t.id='kcToast';
    t.innerHTML=
      '<img class="kc-toast-logo" src="icon_kc.jpeg" alt="KC">'+
      (on?'🏆 KARMINE CORP MODE':'👋 MODE KC DÉSACTIVÉ')+
      '<span class="kc-toast-sub">'+(on?'ALLEZ LES BLEUS !':'À bientôt sur la Rift')+'</span>';
    document.body.appendChild(t);
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)';
    });});
    setTimeout(function(){
      t.style.opacity='0';t.style.transform='translateX(-50%) translateY(24px)';
      setTimeout(function(){if(t.parentNode)t.remove();},450);
    },3800);
  }

  /* ── Détection séquence "lol" ── */
  document.addEventListener('keydown',function(e){
    var key=e.key.toLowerCase();
    if(key===seq[ts.length]){
      var now=Date.now();
      if(ts.length>0&&now-ts[0]>5000){ts=[];if(key===seq[0])ts.push(now);return;}
      ts.push(now);
      if(ts.length===seq.length){
        ts=[];
        if(_kcActive){_deactivateKC();}else{_activateKC();}
      }
    } else { ts=(key===seq[0])?[Date.now()]:[]; }
  });
})();

/* ════════════════════════════════════════════════════════
   ECHAP
════════════════════════════════════════════════════════ */
document.addEventListener('keydown',function(e){
  if(e.key!=='Escape') return;
  document.querySelectorAll('.modal-overlay.active').forEach(function(m){m.classList.remove('active');});
  document.querySelectorAll('.submodal-overlay.active').forEach(function(m){m.classList.remove('active');});
  closeVideoModal();
  if(typeof closeCard==='function') closeCard();
  document.body.style.overflow='';
});

/* ════════════════════════════════════════════════════════
   PERFORMANCE — lazy load + pré-fetch GIFs
════════════════════════════════════════════════════════ */
(function(){
  var isMobile=_isMobileDevice;
  if(isMobile){var hg=document.querySelector('.hero-grid');if(hg)hg.style.display='none';}
  var BLANK='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  function loadImg(img){if(img.dataset.src){img.src=img.dataset.src;delete img.dataset.src;}}
  if('IntersectionObserver' in window){
    var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){loadImg(e.target);obs.unobserve(e.target);}});},{rootMargin:'300px'});
    document.querySelectorAll('img').forEach(function(img){
      if(img.closest('#hero')) return;
      if(!img.src||img.src===BLANK||img.src.startsWith('data:')) return;
      img.dataset.src=img.src;img.src=BLANK;img.decoding='async';img.loading='lazy';obs.observe(img);
    });
    document.querySelectorAll('img[data-src]').forEach(function(img){obs.observe(img);});
    requestAnimationFrame(function(){document.querySelectorAll('img[data-src]').forEach(function(img){var r=img.getBoundingClientRect();if(r.top<window.innerHeight+400){loadImg(img);obs.unobserve(img);}});});
    document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'){document.querySelectorAll('img[data-src]').forEach(function(img){var r=img.getBoundingClientRect();if(r.top<window.innerHeight+400){loadImg(img);obs.unobserve(img);}});}});
  } else { document.querySelectorAll('img[data-src]').forEach(function(img){loadImg(img);}); }
  function loadLazy(el){if(!el)return;el.querySelectorAll('img[data-src]').forEach(function(img){loadImg(img);});}
  var _om=window.openModal;window.openModal=function(id){loadLazy(document.getElementById('modal-'+id));if(typeof _om==='function')_om(id);};
  var _osm=window.openSubModal;window.openSubModal=function(id){loadLazy(document.getElementById(id));if(typeof _osm==='function')_osm(id);};
  var sb=document.getElementById('scrollProgress');
  if(sb){var tk=false;window.addEventListener('scroll',function(){if(!tk){requestAnimationFrame(function(){var st=window.scrollY,dh=document.documentElement.scrollHeight-window.innerHeight;sb.style.width=(dh>0?(st/dh)*100:0)+'%';tk=false;});tk=true;}},{passive:true});}
  document.addEventListener('touchstart',function(){},{passive:true});
  document.addEventListener('touchmove',function(){},{passive:true});
  if(isMobile){var st=document.createElement('style');st.textContent='.about-glow{display:none!important}.hero-grid{display:none!important}.scroll-indicator{animation:none!important;opacity:.25!important}.project-visual img{animation:logoMobile 5s ease-in-out infinite!important;filter:none!important}';document.head.appendChild(st);}
  if(!isMobile){
    var GIF_SRCS=['videos/inscription.gif','videos/accept_inscription.gif','videos/creation_conversation_membre.gif','videos/creation_de_groupe.gif','videos/test_message_tempsréel.gif','videos/test_notif.gif','videos/test_message_accueil.gif','videos/test_group_et_conversation.gif','videos/test_fond_ecran.gif','videos/test_sondage.gif','videos/test_role_suppresion.gif'];
    function prefetchNext(idx){
      if(idx>=GIF_SRCS.length) return;
      var src=GIF_SRCS[idx];if(_gifCache[src]){prefetchNext(idx+1);return;}
      var a=document.createElement('a');a.href=src;
      fetch(a.href).then(function(r){return r.ok?r.arrayBuffer():Promise.reject();}).then(function(buf){_checkAndEvictCache();_gifCache[src]=buf;setTimeout(function(){prefetchNext(idx+1);},500);}).catch(function(){setTimeout(function(){prefetchNext(idx+1);},500);});
    }
    window.addEventListener('load',function(){setTimeout(function(){prefetchNext(0);},4000);});
  }
})();
