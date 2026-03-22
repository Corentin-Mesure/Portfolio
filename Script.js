'use strict';

var _isMobileDevice = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

/* ════ FIX SAFARI IOS ROTATION ════ */
(function(){
  if(!_isMobileDevice) return;
  var s=document.createElement('style');
  s.textContent='body.orientation-freeze *,body.orientation-freeze *::before,body.orientation-freeze *::after{animation-play-state:paused!important;transition:none!important;}body.orientation-freeze html{scroll-behavior:auto!important;}';
  document.head.appendChild(s);
  var t=null;
  window.addEventListener('orientationchange',function(){
    document.body.classList.add('orientation-freeze');
    clearTimeout(t);
    t=setTimeout(function(){document.body.classList.remove('orientation-freeze');},500);
  });
})();

/* ════ SCROLL + NAV ════ */
(function(){
  var sp=document.getElementById('scrollProgress');
  var navLinks=Array.from(document.querySelectorAll('.nav-links a'));
  var sections=Array.from(document.querySelectorAll('section,#about,#timeline,#skills,#projects,#projet-ap,#contact-section'));
  var ticking=false;
  window.addEventListener('scroll',function(){
    if(ticking) return; ticking=true;
    requestAnimationFrame(function(){
      var s=window.scrollY,tot=document.body.scrollHeight-window.innerHeight;
      if(sp) sp.style.width=(tot>0?(s/tot)*100:0)+'%';
      var active='';
      for(var i=0;i<sections.length;i++) if(s>=sections[i].offsetTop-220) active=sections[i].id;
      navLinks.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+active);});
      ticking=false;
    });
  },{passive:true});
})();

/* ════ ANIMATIONS SCROLL ════ */
(function(){
  var tlObs=new IntersectionObserver(function(entries){entries.forEach(function(e,i){if(!e.isIntersecting)return;setTimeout(function(){e.target.classList.add('visible');},i*150);tlObs.unobserve(e.target);});},{threshold:0.2});
  document.querySelectorAll('.timeline-item').forEach(function(el){tlObs.observe(el);});
  var skObs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(!e.isIntersecting)return;e.target.querySelectorAll('.skill-tag').forEach(function(t,i){t.style.transitionDelay=(i*0.08)+'s';});e.target.classList.add('visible');skObs.unobserve(e.target);});},{threshold:0.3});
  document.querySelectorAll('.skill-card').forEach(function(c){skObs.observe(c);});
  var rvObs=new IntersectionObserver(function(entries){entries.forEach(function(e,i){if(!e.isIntersecting)return;setTimeout(function(){e.target.classList.add('visible');},i*80);rvObs.unobserve(e.target);});},{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(function(el){rvObs.observe(el);});
})();

/* ════ CARTE FLIP ════ */
(function(){
  var state='closed',clone=null,origRect=null,expandTimer=null;
  window.handleFlip=function(){
    if(state!=='closed') return;
    state='flipping';
    var card=document.getElementById('flipCard');
    if(!card){state='closed';return;}
    origRect=card.getBoundingClientRect();
    card.style.transition='transform 0.85s cubic-bezier(0.4,0.2,0.2,1)';
    card.style.transform='rotateY(180deg)';
    setTimeout(function(){
      if(state!=='flipping') return;
      card.style.visibility='hidden';
      clone=card.cloneNode(true);
      clone.id='flipCardClone';clone.classList.add('is-clone');clone.removeAttribute('onclick');
      var vvp=window.visualViewport||null;
      var vw=vvp?Math.round(vvp.width):window.innerWidth;
      var vh=vvp?Math.round(vvp.height):window.innerHeight;
      var vx=vvp?Math.round(vvp.offsetLeft):0;
      var vy=vvp?Math.round(vvp.offsetTop):0;
      var tW,tH,tLeft,tTop;
      if(_isMobileDevice){
        tW=Math.min(vw*0.88,400);tH=Math.min(tW*(4/3),vh*0.85);tW=Math.min(tW,tH*(3/4));
        tLeft=vx+(vw-tW)/2;tTop=vy+(vh-tH)/2;
        if(tLeft<8)tLeft=8;if(tTop<8)tTop=8;
        if(tLeft+tW>vx+vw-8)tLeft=vx+vw-tW-8;if(tTop+tH>vy+vh-8)tTop=vy+vh-tH-8;
      } else {
        var maxH=Math.min(vh*.995,1060),maxW=Math.min(vw*.96,900);
        tH=maxH;tW=Math.min(maxW,tH*(5/6));tLeft=(vw-tW)/2;tTop=(vh-tH)/2;
      }
      if(_isMobileDevice){
        clone.style.cssText=['position:fixed','left:'+tLeft+'px','top:'+tTop+'px','width:'+tW+'px','height:'+tH+'px','margin:0','z-index:1000','transform:rotateY(180deg) scale(0.85)','transform-style:preserve-3d','transition:none','visibility:visible','opacity:0','aspect-ratio:unset'].join(';');
      } else {
        clone.style.cssText=['position:fixed','left:'+origRect.left+'px','top:'+origRect.top+'px','width:'+origRect.width+'px','height:'+origRect.height+'px','margin:0','z-index:1000','transform:rotateY(180deg)','transition:none','visibility:visible','transform-style:preserve-3d','aspect-ratio:unset'].join(';');
      }
      document.body.appendChild(clone);
      var bd=document.getElementById('cardBackdrop');if(bd)bd.classList.add('active');
      document.body.style.overflow='hidden';
      var cb=clone.querySelector('.back-close');
      if(cb){cb.style.display='flex';cb.onclick=function(e){e.stopPropagation();window.closeCard();};}
      void clone.offsetHeight;
      if(_isMobileDevice){
        clone.style.transition='transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease';
        clone.style.transform='rotateY(180deg) scale(1)';clone.style.opacity='1';
        state='open';expandTimer=setTimeout(function(){if(clone)clone.classList.add('expanded');},500);
      } else {
        clone.style.transition='left 1s cubic-bezier(0.16,1,0.3,1),top 1s cubic-bezier(0.16,1,0.3,1),width 1s cubic-bezier(0.16,1,0.3,1),height 1s cubic-bezier(0.16,1,0.3,1)';
        clone.style.left=tLeft+'px';clone.style.top=tTop+'px';clone.style.width=tW+'px';clone.style.height=tH+'px';
        state='open';expandTimer=setTimeout(function(){if(clone)clone.classList.add('expanded');},1050);
      }
    },900);
  };
  window.closeCard=function(){
    if(state!=='open'||!clone) return;
    state='closing';clearTimeout(expandTimer);clone.classList.remove('expanded');
    var bd=document.getElementById('cardBackdrop');if(bd)bd.classList.remove('active');
    var card=document.getElementById('flipCard');
    if(_isMobileDevice){
      clone.style.transition='transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease';
      clone.style.transform='rotateY(180deg) scale(0.85)';clone.style.opacity='0';
      setTimeout(function(){
        if(clone){clone.remove();clone=null;}
        document.body.style.overflow='';
        if(card){card.style.transition='none';card.style.transform='rotateY(0deg)';card.style.visibility='visible';void card.offsetHeight;card.style.transition='';card.style.transform='';}
        state='closed';
      },360);
    } else {
      var currentRect=card?card.getBoundingClientRect():origRect;
      clone.style.transition='left .65s cubic-bezier(0.4,0,0.2,1),top .65s cubic-bezier(0.4,0,0.2,1),width .65s cubic-bezier(0.4,0,0.2,1),height .65s cubic-bezier(0.4,0,0.2,1)';
      clone.style.left=currentRect.left+'px';clone.style.top=currentRect.top+'px';clone.style.width=currentRect.width+'px';clone.style.height=currentRect.height+'px';
      setTimeout(function(){
        if(!clone) return;
        clone.style.transition='transform .65s cubic-bezier(0.4,0.2,0.2,1)';clone.style.transform='rotateY(0deg)';
        setTimeout(function(){
          if(clone){clone.remove();clone=null;}document.body.style.overflow='';
          if(card){card.style.transition='none';card.style.transform='rotateY(0deg)';card.style.visibility='visible';void card.offsetHeight;card.style.transition='';card.style.transform='';}
          state='closed';
        },660);
      },620);
    }
  };
})();

/* ════ MODALS ════ */
function openModal(id){var m=document.getElementById('modal-'+id);if(m){m.classList.add('active');document.body.style.overflow='hidden';}}
function closeModalBtn(id){var m=document.getElementById('modal-'+id);if(m){m.classList.remove('active');document.body.style.overflow='';}}
function closeModal(e,id){if(e.target===e.currentTarget)closeModalBtn(id);}
function openSubModal(id){var m=document.getElementById(id);if(m)m.classList.add('active');}
function closeSubModalBtn(id){var m=document.getElementById(id);if(m)m.classList.remove('active');}
function closeSubModal(e,id){if(e.target===e.currentTarget)closeSubModalBtn(id);}
function toggleAcc(id){
  var body=document.getElementById(id),btn=body&&body.previousElementSibling;
  if(!body) return;
  var open=body.classList.toggle('open');
  if(btn&&btn.classList.contains('tech-accordion'))btn.classList.toggle('open',open);
}

/* ════ IMAGE MODAL ════ */
function openImageModal(srcs,pov,size){
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
  if(wrap)wrap.style.cssText='background:transparent;box-shadow:none;border:none;padding:0;max-width:'+maxW+';width:'+maxW+';pointer-events:none;';
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

/* ════ CACHE GIF ════ */
var _gifCache={};
function _checkAndEvictCache(){var total=0,keys=Object.keys(_gifCache);for(var i=0;i<keys.length;i++){total+=_gifCache[keys[i]].byteLength;}if(total>40*1024*1024){_gifCache={};}}
function _patchDelays(origBuffer,speed){var bytes=new Uint8Array(origBuffer.slice(0));for(var i=0;i<bytes.length-7;i++){if(bytes[i]===0x21&&bytes[i+1]===0xF9&&bytes[i+2]===0x04){var d=bytes[i+4]|(bytes[i+5]<<8);if(d<2)d=10;var nd=Math.max(2,Math.round(d/speed));bytes[i+4]=nd&0xFF;bytes[i+5]=(nd>>8)&0xFF;i+=7;}}return bytes.buffer;}
var _blobUrls=[];
function _makeBlobUrl(origBuffer,speed){var patched=_patchDelays(origBuffer,speed);var blob=new Blob([patched],{type:'image/gif'});var url=URL.createObjectURL(blob);_blobUrls.push(url);return url;}
function _revokeBlobs(){var toRevoke=_blobUrls.slice();_blobUrls=[];setTimeout(function(){toRevoke.forEach(function(u){URL.revokeObjectURL(u);});},1000);}
var _modalOpen=false,_currentSrc='',_currentSpd=1;
function _gifReset(){_modalOpen=false;_currentSrc='';}
var _GIF_PRESETS=[0.25,0.5,0.75,1,1.25,1.5,2,3];
var _SPEED_KEY='gifSpeed:';
function _basename(src){return src?src.split('/').pop().split('?')[0]:'';}
function _loadSpd(src){var v=parseFloat(localStorage.getItem(_SPEED_KEY+_basename(src)));return(!isNaN(v)&&v>0)?v:1;}
function _saveSpd(src,s){localStorage.setItem(_SPEED_KEY+_basename(src),s);}
function _buildPanel(src){
  var bar=document.querySelector('.video-modal-bar');if(!bar)return;
  _currentSpd=_loadSpd(src);
  var name=_basename(src).replace(/\.gif$/i,'').replace(/_/g,' ');
  if(name.length>26)name=name.slice(0,24)+'\u2026';
  bar.style.visibility='';bar.innerHTML='';
  var p=document.createElement('div');p.id='gifSpeedPanel';
  p.innerHTML='<div id="gifSpeedFileName">'+name+'</div><div id="gifSpeedControls"><button id="gifSpeedDown">\u2212</button><div id="gifSpeedInputWrap"><span id="gifSpeedPrefix">x</span><input id="gifSpeedInput" type="number" min="0.05" max="20" step="0.05" value="'+_currentSpd+'"></div><button id="gifSpeedUp">+</button><button id="gifSpeedApply">\u23CE</button></div><div id="gifSpeedPresets">'+_GIF_PRESETS.map(function(s){return'<button class="spd-preset'+(Math.abs(s-_currentSpd)<0.001?' active':'')+'" data-spd="'+s+'">x'+s+'</button>';}).join('')+'</div>';
  bar.appendChild(p);_injectCSS();
  var input=document.getElementById('gifSpeedInput');
  document.getElementById('gifSpeedDown').onclick=function(){_setSpd(Math.max(0.05,Math.round((_currentSpd-0.05)*100)/100),src);};
  document.getElementById('gifSpeedUp').onclick=function(){_setSpd(Math.min(20,Math.round((_currentSpd+0.05)*100)/100),src);};
  document.getElementById('gifSpeedApply').onclick=function(){_commitSpd(src);};
  input.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();_commitSpd(src);}});
  input.addEventListener('input',function(){_hlPreset(parseFloat(input.value));});
  p.querySelectorAll('.spd-preset').forEach(function(btn){btn.onclick=function(){_setSpd(parseFloat(btn.dataset.spd),src);};});
}
function _commitSpd(src){var input=document.getElementById('gifSpeedInput');if(!input)return;var v=parseFloat(input.value);if(isNaN(v)||v<=0){input.value=_currentSpd;return;}_setSpd(Math.max(0.05,Math.min(20,Math.round(v*100)/100)),src);}
function _setSpd(spd,src){_currentSpd=spd;_saveSpd(src,spd);var input=document.getElementById('gifSpeedInput');if(input)input.value=spd;_hlPreset(spd);_toast('x'+spd+' \u2014 enregistr\u00e9');_reloadImg(src,spd);}
function _reloadImg(src,spd){var buf=_gifCache[src];if(!buf)return;_revokeBlobs();var newUrl=_makeBlobUrl(buf,spd),inner=document.querySelector('.video-modal-inner');if(!inner)return;var oldImg=inner.querySelector('#videoModalMedia'),newImg=document.createElement('img');newImg.id='videoModalMedia-next';newImg.style.cssText=oldImg?oldImg.style.cssText+';position:absolute;opacity:0;pointer-events:none;':'display:block;width:100%;border-radius:18px;position:absolute;opacity:0;pointer-events:none;';newImg.onload=function(){if(!_modalOpen||_currentSrc!==src){newImg.remove();return;}newImg.id='videoModalMedia';newImg.style.position='';newImg.style.opacity='1';newImg.style.pointerEvents='';if(oldImg&&oldImg.parentNode)oldImg.remove();};newImg.onerror=function(){newImg.remove();};newImg.src=newUrl;if(oldImg&&oldImg.parentNode){inner.insertBefore(newImg,oldImg);}else{inner.insertBefore(newImg,inner.firstChild);}}
function _hlPreset(spd){document.querySelectorAll('.spd-preset').forEach(function(b){b.classList.toggle('active',Math.abs(parseFloat(b.dataset.spd)-spd)<0.001);});}
function _toast(msg){var old=document.getElementById('gifSpeedToast');if(old)old.remove();var t=document.createElement('div');t.id='gifSpeedToast';t.textContent=msg;t.style.cssText='position:fixed;bottom:82px;left:50%;transform:translateX(-50%) translateY(10px);background:rgba(200,160,60,0.16);border:1px solid rgba(200,160,60,0.55);color:#f0c84a;font-family:Cinzel,serif;font-size:11px;letter-spacing:3px;padding:8px 22px;border-radius:20px;z-index:9999999;pointer-events:none;opacity:0;transition:opacity .22s,transform .22s;white-space:nowrap;';document.body.appendChild(t);requestAnimationFrame(function(){requestAnimationFrame(function(){t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)';});});setTimeout(function(){t.style.opacity='0';t.style.transform='translateX(-50%) translateY(10px)';setTimeout(function(){if(t.parentNode)t.remove();},280);},1600);}
function _injectCSS(){if(document.getElementById('gifSpeedCSS'))return;var s=document.createElement('style');s.id='gifSpeedCSS';s.textContent='#gifSpeedPanel{display:flex;flex-direction:column;align-items:center;gap:9px;padding:11px 14px 10px;background:rgba(0,0,0,0.62);backdrop-filter:blur(12px);border-radius:15px;border:1px solid rgba(200,160,60,0.28);width:100%;box-sizing:border-box;}#gifSpeedFileName{font-family:Cinzel,serif;font-size:9.5px;letter-spacing:1.8px;color:rgba(200,160,60,0.65);text-transform:uppercase;text-align:center;}#gifSpeedControls{display:flex;align-items:center;gap:8px;}#gifSpeedControls button{background:rgba(255,255,255,0.07);border:1px solid rgba(200,160,60,0.3);color:#fff;border-radius:8px;width:30px;height:30px;font-size:17px;cursor:pointer;transition:background .15s,transform .1s,border-color .15s;display:flex;align-items:center;justify-content:center;flex-shrink:0;}#gifSpeedControls button:hover{background:rgba(200,160,60,0.22);border-color:rgba(200,160,60,0.7);transform:scale(1.1);}#gifSpeedApply{font-size:14px!important;color:#c8a03c!important;border-color:rgba(200,160,60,0.5)!important;}#gifSpeedInputWrap{display:flex;align-items:center;background:rgba(255,255,255,0.06);border:1.5px solid rgba(200,160,60,0.45);border-radius:9px;padding:0 8px;gap:2px;transition:border-color .2s;}#gifSpeedInputWrap:focus-within{border-color:rgba(200,160,60,0.9);background:rgba(200,160,60,0.08);}#gifSpeedPrefix{font-family:Cinzel,serif;font-size:15px;font-weight:700;color:#c8a03c;pointer-events:none;user-select:none;}#gifSpeedInput{background:transparent;border:none;outline:none;font-family:Cinzel,serif;font-size:17px;font-weight:700;color:#f0c84a;width:58px;text-align:center;padding:4px 2px;-moz-appearance:textfield;}#gifSpeedInput::-webkit-inner-spin-button,#gifSpeedInput::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}#gifSpeedPresets{display:flex;gap:5px;flex-wrap:wrap;justify-content:center;}.spd-preset{font-family:Cinzel,serif;font-size:10.5px;padding:3px 9px;border-radius:6px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.48);cursor:pointer;transition:all .15s;letter-spacing:.4px;}.spd-preset:hover{background:rgba(200,160,60,0.12);color:#c8a03c;border-color:rgba(200,160,60,0.45);}.spd-preset.active{background:rgba(200,160,60,0.2);border-color:rgba(200,160,60,0.75);color:#f0c84a;font-weight:700;}';document.head.appendChild(s);}

/* ════ VIDEO MODAL ════ */
function _safeSrc(src){return src.split('').map(function(c){return c.charCodeAt(0)>127?encodeURIComponent(c):c;}).join('');}
function _resolveGifSrc(src){if(src.match(/^(https?:|data:|blob:)/))return src;var a=document.createElement('a');a.href=src;return a.href;}
function openVideoModal(src,pov,size){
  var overlay=document.getElementById('videoModal'),badge=document.getElementById('videoModalPov'),errDiv=document.getElementById('videoModalErr'),errPath=document.getElementById('videoModalErrPath'),inner=document.querySelector('.video-modal-inner'),wrap=document.querySelector('.video-modal-wrap'),bar=document.querySelector('.video-modal-bar');
  _gifReset();
  inner.querySelectorAll('#videoModalMedia,#videoModalMedia-next,canvas,.static-screen-img,#gifLoader').forEach(function(el){el.remove();});
  if(wrap){wrap.style.cssText='';if(size)wrap.style.maxWidth=size+'px';}
  if(bar){bar.innerHTML='';bar.style.visibility='hidden';}
  badge.innerHTML=pov;errDiv.style.display='none';
  var safeSrc=_safeSrc(src),ext=safeSrc.split('?')[0].split('.').pop().toLowerCase();
  if(ext==='gif'){
    _currentSrc=src;_modalOpen=true;
    if(_isMobileDevice){
      var imgM=document.createElement('img');imgM.id='videoModalMedia';imgM.style.cssText='display:block;width:100%;border-radius:18px;';
      imgM.onerror=function(){errPath.textContent=safeSrc;errDiv.style.display='block';};imgM.src=safeSrc;
      inner.insertBefore(imgM,inner.firstChild);overlay.classList.add('open');return;
    }
    _buildPanel(src);
    var absSrc=_resolveGifSrc(safeSrc);
    if(_gifCache[src]){_showGif(inner,src,_gifCache[src]);}
    else{
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
function _showGif(inner,src,buf){var url=_makeBlobUrl(buf,_currentSpd),img=document.createElement('img');img.id='videoModalMedia';img.style.cssText='display:block;width:100%;border-radius:18px;';img.onerror=function(){img.onerror=null;img.src=_safeSrc(src);};img.src=url;inner.insertBefore(img,inner.firstChild);}
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

/* ════ PROJETS PERSONNELS ════ */
function toggleApProjects(){var grid=document.getElementById('apGrid'),btn=document.getElementById('apTeaserBtn');if(!grid)return;var open=grid.classList.toggle('open');btn.classList.toggle('open',open);}
function togglePersoProjects(){var grid=document.getElementById('persoGrid'),btn=document.getElementById('persoTeaserBtn');if(!grid)return;var open=grid.classList.toggle('open');btn.classList.toggle('open',open);}

/* ════════════════════════════════════════════════════════
   EASTER EGG — LOL / KARMINE CORP
   Tape "lol" pour activer le thème KC sur toute la page.
   Retape "lol" pour tout restaurer.
════════════════════════════════════════════════════════ */
(function(){
  var seq=['l','o','l'], ts=[], _kcActive=false, _savedCards=[];

  var KC_LOGO = 'images/icon_kc.jpeg';

  var KC_CLIPS = [
    { src:'videos/kc/clip_pentakill.gif',  label:'Pentakill \uD83D\uDD25' },
    { src:'videos/kc/clip_baron.gif',       label:'Baron Steal \uD83D\uDE24' },
    { src:'videos/kc/clip_comeback.gif',    label:'Comeback \uD83D\uDCAA' },
    { src:'videos/kc/clip_ace.gif',         label:'ACE ! \u2694\uFE0F' },
    { src:'videos/kc/clip_nexus.gif',       label:'GG WP \uD83C\uDFC6' },
    { src:'videos/kc/clip_skyroz.gif',      label:'Skyroz \uD83D\uDC51' },
    { src:'videos/kc/clip_rekkles.gif',     label:'Rekkles \uD83C\uDFF9' },
    { src:'videos/kc/clip_targamas.gif',    label:'Targamas \uD83D\uDEE1\uFE0F' },
    { src:'videos/kc/clip_canna.gif',       label:'Canna \uD83D\uDDE1\uFE0F' },
  ];

  /* ── CSS injecté une seule fois ── */
  function _injectKCCSS(){
    if(document.getElementById('kcCSS')) return;
    var s=document.createElement('style');
    s.id='kcCSS';
    s.textContent=[

      /* ── THÈME GLOBAL via body.kc-mode ── */

      /* Fond de page */
      'body.kc-mode{background:#090112!important;}',

      /* Nav */
      'body.kc-mode nav{background:linear-gradient(to bottom,rgba(9,1,18,0.97),transparent)!important;}',
      'body.kc-mode .nav-logo{color:#ff3333!important;}',
      'body.kc-mode .nav-links a{color:rgba(255,200,200,0.75)!important;}',
      'body.kc-mode .nav-links a:hover,body.kc-mode .nav-links a.active{color:#ff3333!important;}',
      'body.kc-mode .nav-links a::after{background:#ff3333!important;}',

      /* Barre de progression */
      'body.kc-mode .scroll-progress{background:linear-gradient(to right,#8B0000,#ff3333,#ff6666)!important;box-shadow:0 0 8px #ff3333!important;}',

      /* Hero */
      'body.kc-mode .hero-grid{background-image:linear-gradient(rgba(255,50,50,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,50,50,0.06) 1px,transparent 1px)!important;}',
      'body.kc-mode .hero-eyebrow{color:#cc1111!important;}',
      'body.kc-mode .hero-eyebrow::before,body.kc-mode .hero-eyebrow::after{background:#cc1111!important;}',
      'body.kc-mode .hero-name{background:linear-gradient(135deg,#ff8888 0%,#ff3333 40%,#aa0000 70%,#ff3333 100%)!important;-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important;}',
      'body.kc-mode .hero-subtitle{color:#4488ff!important;}',
      'body.kc-mode .hero-cta{border-color:#cc1111!important;color:#ff3333!important;}',
      'body.kc-mode .hero-cta::before{background:#cc1111!important;}',
      'body.kc-mode .hero-cta:hover{color:#fff!important;}',
      'body.kc-mode .scroll-indicator span{color:#cc1111!important;}',
      'body.kc-mode .scroll-line{background:linear-gradient(to bottom,#cc1111,transparent)!important;}',

      /* Dividers */
      'body.kc-mode .arcane-divider::before{background:linear-gradient(to right,transparent,#ff3333)!important;}',
      'body.kc-mode .arcane-divider::after{background:linear-gradient(to left,transparent,#ff3333)!important;}',
      'body.kc-mode .divider-gem{background:#ff3333!important;box-shadow:0 0 10px rgba(255,50,50,0.6)!important;}',

      /* Sections — header */
      'body.kc-mode .section-number{color:#cc1111!important;}',
      'body.kc-mode .section-title{color:#ff3333!important;}',
      'body.kc-mode .section-line{background:linear-gradient(to right,#cc1111,transparent)!important;}',

      /* About — carte flip */
      'body.kc-mode .flip-front{background:linear-gradient(135deg,#2a0808,#400c0c,#1e0606)!important;border-color:#cc1111!important;}',
      'body.kc-mode .flip-back{background:linear-gradient(135deg,#220606,#2e0808,#1a0505)!important;border-color:#cc1111!important;}',
      'body.kc-mode .about-frame-corner{border-color:#ff3333!important;}',
      'body.kc-mode .about-initials{-webkit-text-stroke:1px #cc1111!important;color:transparent!important;}',
      'body.kc-mode .about-glow{background:radial-gradient(circle,rgba(255,50,50,0.35),transparent)!important;}',
      'body.kc-mode .flip-hint{color:#cc1111!important;}',
      'body.kc-mode .back-tag{color:#4488ff!important;}',
      'body.kc-mode .back-subtitle{color:#4488ff!important;}',
      'body.kc-mode .back-divider{background:linear-gradient(to right,transparent,#cc1111,transparent)!important;}',
      'body.kc-mode .back-stat-number{color:#ff3333!important;}',
      'body.kc-mode .back-stat-item{background:rgba(255,50,50,0.07)!important;border-color:rgba(255,50,50,0.2)!important;}',
      'body.kc-mode .back-skill-tag{border-color:rgba(68,136,255,0.35)!important;color:#4488ff!important;}',
      'body.kc-mode .back-close{border-color:rgba(255,50,50,0.4)!important;color:#cc1111!important;}',
      'body.kc-mode .back-close:hover{background:#ff3333!important;border-color:#ff3333!important;color:#fff!important;}',

      /* Timeline */
      'body.kc-mode .timeline-track::before{background:linear-gradient(to bottom,transparent,#cc1111 15%,#cc1111 85%,transparent)!important;}',
      'body.kc-mode .timeline-gem{border-color:rgba(255,50,50,0.4)!important;background:#090112!important;}',
      'body.kc-mode .timeline-item.visible .timeline-gem{border-color:#ff3333!important;box-shadow:0 0 12px rgba(255,50,50,0.55)!important;}',
      'body.kc-mode .timeline-item.current .timeline-gem{background:#ff3333!important;box-shadow:0 0 20px rgba(255,50,50,0.75)!important;}',
      'body.kc-mode .timeline-year{color:#cc1111!important;}',
      'body.kc-mode .timeline-title{color:#ff3333!important;}',
      'body.kc-mode .timeline-sub{color:#4488ff!important;}',
      'body.kc-mode .timeline-badge{border-color:rgba(255,50,50,0.3)!important;color:#cc1111!important;}',
      'body.kc-mode .timeline-badge.active{border-color:rgba(68,136,255,0.5)!important;color:#4488ff!important;box-shadow:0 0 12px rgba(68,136,255,0.15)!important;}',

      /* Compétences */
      'body.kc-mode #skills::before{background-image:repeating-linear-gradient(60deg,rgba(255,50,50,0.06) 0px,rgba(255,50,50,0.06) 1px,transparent 1px,transparent 30px)!important;}',
      'body.kc-mode .skill-card{background:rgba(40,5,5,0.9)!important;border-color:rgba(255,50,50,0.25)!important;}',
      'body.kc-mode .skill-card:hover{background:rgba(60,8,8,0.98)!important;}',
      'body.kc-mode .skill-card::before{background:linear-gradient(to right,transparent,#ff3333,transparent)!important;}',
      'body.kc-mode .skill-name{color:#ff3333!important;}',
      'body.kc-mode .skill-tag{border-color:rgba(68,136,255,0.25)!important;color:#aaccff!important;}',
      'body.kc-mode .skill-card:hover .skill-tag{border-color:rgba(68,136,255,0.6)!important;}',

      /* Projets — cartes normales (non-KC) */
      'body.kc-mode .project-card{background:rgba(20,3,3,0.95)!important;border-color:rgba(255,50,50,0.2)!important;}',
      'body.kc-mode .project-card:hover{border-color:rgba(68,136,255,0.6)!important;box-shadow:0 30px 60px rgba(0,0,0,0.5),0 0 40px rgba(68,136,255,0.12)!important;}',
      'body.kc-mode .project-type{color:#4488ff!important;}',
      'body.kc-mode .project-title{color:#ff3333!important;}',
      'body.kc-mode .project-tag{background:rgba(255,50,50,0.07)!important;border-color:rgba(255,50,50,0.2)!important;color:rgba(255,150,150,0.9)!important;}',
      'body.kc-mode .project-btn{border-color:#cc1111!important;color:#ff3333!important;}',
      'body.kc-mode .project-btn::before{background:linear-gradient(90deg,#7B0000,#08003a)!important;}',
      'body.kc-mode .project-btn:hover{color:#fff!important;}',

      /* Teaser perso */
      'body.kc-mode .perso-teaser-btn{border-color:rgba(68,136,255,0.35)!important;color:#4488ff!important;}',
      'body.kc-mode .perso-teaser-btn::before{background:rgba(68,136,255,0.08)!important;}',
      'body.kc-mode .perso-card::after{border-color:rgba(68,136,255,0.4)!important;color:#4488ff!important;background:rgba(68,136,255,0.07)!important;}',

      /* Contact */
      'body.kc-mode .contact-rune{color:#ff3333!important;}',
      'body.kc-mode .contact-title{color:#ff3333!important;}',
      'body.kc-mode .contact-link{border-color:#cc1111!important;color:#ff3333!important;}',
      'body.kc-mode .contact-link::before{background:#cc1111!important;}',
      'body.kc-mode .contact-link:hover{color:#fff!important;}',

      /* Footer */
      'body.kc-mode footer{border-top-color:rgba(255,50,50,0.15)!important;}',

      /* Modals */
      'body.kc-mode .modal{background:linear-gradient(160deg,#1a0505,#100212)!important;border-color:rgba(255,50,50,0.35)!important;}',
      'body.kc-mode .modal::before{background:linear-gradient(to right,transparent,#ff3333,transparent)!important;}',
      'body.kc-mode .modal-corner{border-color:#ff3333!important;}',
      'body.kc-mode .modal-type{color:#4488ff!important;}',
      'body.kc-mode .modal-title{color:#ff3333!important;}',
      'body.kc-mode .modal-close{border-color:rgba(255,50,50,0.4)!important;color:#cc1111!important;}',
      'body.kc-mode .modal-close:hover{background:#ff3333!important;border-color:#ff3333!important;color:#fff!important;}',
      'body.kc-mode .modal-features-title{color:rgba(255,200,200,0.8)!important;}',
      'body.kc-mode .modal-feature-btn{background:rgba(255,50,50,0.03)!important;border-color:rgba(255,50,50,0.12)!important;}',
      'body.kc-mode .modal-feature-btn:hover{background:rgba(255,50,50,0.09)!important;border-color:rgba(255,50,50,0.4)!important;}',
      'body.kc-mode .feat-title{color:#ff3333!important;}',
      'body.kc-mode .feat-arrow{color:#ff3333!important;}',
      'body.kc-mode .modal-tag{background:rgba(255,50,50,0.07)!important;border-color:rgba(255,50,50,0.25)!important;}',

      /* Sous-modals */
      'body.kc-mode .submodal{background:linear-gradient(150deg,#1e0606,#100212,#160518)!important;border-color:rgba(68,136,255,0.28)!important;}',
      'body.kc-mode .submodal::before{background:linear-gradient(to right,transparent,#4488ff,transparent)!important;}',
      'body.kc-mode .submodal-type{color:#4488ff!important;}',
      'body.kc-mode .submodal-title{color:#ff3333!important;}',
      'body.kc-mode .submodal-close{border-color:rgba(68,136,255,0.3)!important;color:#4488ff!important;}',
      'body.kc-mode .submodal-close:hover{background:#4488ff!important;color:#fff!important;}',
      'body.kc-mode .submodal-step{background:rgba(255,50,50,0.04)!important;border-color:rgba(255,50,50,0.12)!important;}',
      'body.kc-mode .submodal-step.has-video:hover{background:rgba(200,30,30,0.1)!important;}',
      'body.kc-mode .step-num{color:#cc1111!important;}',
      'body.kc-mode .step-play-hint{color:#ff6666!important;}',
      'body.kc-mode .step-play-hint::before{background:rgba(200,30,30,0.2)!important;border-color:rgba(255,80,80,0.5)!important;}',

      /* Tech accordion */
      'body.kc-mode .tech-accordion{background:rgba(68,136,255,0.08)!important;border-color:rgba(68,136,255,0.28)!important;color:#4488ff!important;}',
      'body.kc-mode .tech-accordion:hover{background:rgba(68,136,255,0.15)!important;}',
      'body.kc-mode .tech-accordion-body li::before{color:#4488ff!important;}',
      'body.kc-mode .tech-accordion-inner{border-color:rgba(68,136,255,0.18)!important;border-left-color:rgba(68,136,255,0.5)!important;}',

      /* Card backdrop */
      'body.kc-mode .card-backdrop{background:rgba(9,1,18,0.94)!important;}',

      /* ── CARTE KC (Animal'and transformée) ── */
      '.kc-visual-replace{position:absolute;inset:0;z-index:5;background:linear-gradient(135deg,#6B0000 0%,#0a0a2e 60%,#12003a 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;animation:kcFadeIn 0.4s ease forwards;}',
      '.kc-main-logo{width:130px;height:130px;object-fit:contain;display:block;border-radius:50%;filter:drop-shadow(0 0 20px rgba(255,40,40,1)) drop-shadow(0 0 40px rgba(30,50,255,0.9));animation:kcPulse 2.4s ease-in-out infinite;}',
      '.kc-main-label{font-family:Cinzel,serif;font-size:11px;letter-spacing:5px;color:rgba(255,200,200,0.8);text-transform:uppercase;}',
      '.kc-badge{position:absolute;top:10px;right:10px;z-index:10;font-family:Cinzel,serif;font-size:8px;letter-spacing:2px;background:rgba(120,5,5,0.95);border:1px solid rgba(255,60,60,0.8);color:#fff;padding:4px 10px;border-radius:3px;text-transform:uppercase;}',
      '.kc-card{background:linear-gradient(160deg,rgba(70,3,3,0.7),rgba(3,3,35,0.85))!important;border-color:rgba(200,15,15,0.85)!important;box-shadow:0 0 30px rgba(140,5,5,0.5),0 0 60px rgba(5,10,140,0.25)!important;}',
      '.kc-card:hover{border-color:rgba(255,40,40,1)!important;box-shadow:0 20px 50px rgba(0,0,0,0.6),0 0 70px rgba(180,10,10,0.7)!important;transform:translateY(-8px)!important;}',
      '.kc-btn{border-color:rgba(255,50,50,0.85)!important;color:#ff7070!important;}',
      '.kc-btn:hover{color:#fff!important;}',
      '.kc-btn::before{background:linear-gradient(90deg,#7B0000,#08003a)!important;}',
      '.kc-grid-mode{display:flex!important;justify-content:center!important;}',
      '.kc-grid-mode .kc-card{max-width:500px;width:100%;}',

      /* ── GALERIE CLIPS ── */
      '#kcGallery{position:fixed;inset:0;z-index:6000;background:rgba(3,3,18,0.97);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:56px 24px 32px;overflow-y:auto;animation:kcFadeIn 0.3s ease;}',
      '.kc-gal-hdr{display:flex;align-items:center;gap:16px;margin-bottom:32px;width:100%;max-width:920px;}',
      '.kc-gal-hdr-logo{width:46px;height:46px;object-fit:contain;border-radius:50%;filter:drop-shadow(0 0 10px rgba(255,50,50,0.9));}',
      '.kc-gal-hdr-title{font-family:Cinzel,serif;font-size:20px;letter-spacing:4px;color:#fff;text-transform:uppercase;flex:1;}',
      '.kc-gal-close{width:40px;height:40px;background:none;border:1px solid rgba(255,70,70,0.5);color:#ff8888;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;border-radius:4px;cursor:pointer;}',
      '.kc-gal-close:hover{background:rgba(200,20,20,0.4);color:#fff;}',
      '.kc-gal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;width:100%;max-width:920px;}',
      '.kc-thumb{position:relative;border-radius:10px;overflow:hidden;border:1px solid rgba(255,50,50,0.2);background:#0a0a1a;aspect-ratio:9/16;transition:transform 0.2s,border-color 0.2s,box-shadow 0.2s;cursor:pointer;}',
      '.kc-thumb:hover{transform:translateY(-4px) scale(1.02);border-color:rgba(255,50,50,0.8);box-shadow:0 8px 30px rgba(160,10,10,0.55);}',
      '.kc-thumb img{width:100%;height:100%;object-fit:cover;display:block;}',
      '.kc-thumb-lbl{position:absolute;bottom:0;left:0;right:0;padding:8px 10px;background:linear-gradient(to top,rgba(0,0,0,0.92),transparent);font-family:Cinzel,serif;font-size:10px;letter-spacing:2px;color:#fff;text-align:center;}',
      '.kc-thumb-play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3);opacity:0;transition:opacity 0.2s;}',
      '.kc-thumb:hover .kc-thumb-play{opacity:1;}',
      '.kc-thumb-play span{width:46px;height:46px;border-radius:50%;background:rgba(190,15,15,0.88);border:2px solid rgba(255,80,80,0.85);display:flex;align-items:center;justify-content:center;font-size:17px;color:#fff;}',

      /* ── TOAST KC ── */
      '#kcToast{position:fixed;bottom:40px;left:50%;transform:translateX(-50%) translateY(24px);background:linear-gradient(135deg,rgba(110,6,6,0.97),rgba(6,14,65,0.97));border:1px solid rgba(255,70,70,0.78);box-shadow:0 0 40px rgba(150,8,8,0.55),0 0 80px rgba(8,18,160,0.35);color:#fff;font-family:Cinzel,serif;font-size:13px;letter-spacing:4px;padding:20px 44px 16px;z-index:99999;pointer-events:none;opacity:0;transition:opacity .45s,transform .45s;text-align:center;white-space:nowrap;border-radius:6px;}',
      '#kcToast .kt-logo{display:block;width:44px;height:44px;object-fit:contain;margin:0 auto 10px;border-radius:50%;filter:drop-shadow(0 0 10px rgba(255,60,60,0.9));}',
      '#kcToast .kt-sub{display:block;font-size:10px;letter-spacing:3px;opacity:0.65;margin-top:6px;color:#ffaaaa;}',

      /* ── KEYFRAMES ── */
      '@keyframes kcFadeIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}',
      '@keyframes kcPulse{0%,100%{transform:scale(1) rotate(0deg);}50%{transform:scale(1.1) rotate(3deg);}}',

      /* ── RESPONSIVE GALERIE ── */
      '@media(max-width:600px){.kc-gal-grid{grid-template-columns:repeat(2,1fr)!important;}}',

    ].join('');
    document.head.appendChild(s);
  }

  /* ── Appliquer le thème KC sur toute la page ── */
  function _applyKCTheme(){
    document.body.classList.add('kc-mode');
  }

  /* ── Retirer le thème KC ── */
  function _removeKCTheme(){
    document.body.classList.remove('kc-mode');
  }

  /* ── ACTIVER ── */
  function _activateKC(){
    _injectKCCSS();
    _applyKCTheme();
    _savedCards=[];

    var allCards=Array.from(document.querySelectorAll('#projects .project-card')).filter(function(c){
      return !c.classList.contains('perso-card');
    });
    if(allCards.length===0){ console.warn('KC: cartes non trouvées'); return; }

    allCards.forEach(function(card,idx){
      var vis=card.querySelector('.project-visual');
      if(!vis) return;

      var imgs=[];
      vis.querySelectorAll('img').forEach(function(img){imgs.push({alt:img.alt||'',src:img.src,ds:img.dataset.src||''});});
      _savedCards.push({
        card    : card,
        display : card.style.display||'',
        visNodes: Array.from(vis.childNodes).map(function(n){return n.cloneNode(true);}),
        type    : (card.querySelector('.project-type')||{}).textContent||'',
        title   : (card.querySelector('.project-title')||{}).textContent||'',
        desc    : (card.querySelector('.project-desc')||{}).textContent||'',
        btnHTML : (card.querySelector('.project-btn')||{}).outerHTML||'',
        imgs    : imgs,
      });

      /* Animal'vest (idx >= 1) → cacher */
      if(idx>=1){ card.style.display='none'; return; }

      /* Animal'and (idx === 0) → transformer en KC */
      vis.style.position='relative';
      while(vis.firstChild) vis.removeChild(vis.firstChild);

      var ov=document.createElement('div'); ov.className='kc-visual-replace';
      var lg=document.createElement('img'); lg.className='kc-main-logo';
      lg.src=KC_LOGO; lg.alt='Karmine Corp'; lg.loading='eager';
      lg.onerror=function(){lg.style.display='none';};
      var lbl=document.createElement('div'); lbl.className='kc-main-label'; lbl.textContent='Karmine Corp';
      ov.appendChild(lg); ov.appendChild(lbl); vis.appendChild(ov);
      var bdg=document.createElement('div'); bdg.className='kc-badge'; bdg.textContent='LOL MODE'; vis.appendChild(bdg);

      if(card.querySelector('.project-type'))  card.querySelector('.project-type').textContent  = 'Esport \u2014 LEC / LFL';
      if(card.querySelector('.project-title')) card.querySelector('.project-title').textContent = 'Karmine Corp';
      if(card.querySelector('.project-desc'))  card.querySelector('.project-desc').textContent  = 'ALLEZ LES BLEUS ! La meilleure équipe de League of Legends. Ambiance, passion, victoires.';

      var oldBtn=card.querySelector('.project-btn');
      if(oldBtn){
        var nb=document.createElement('button');
        nb.className='project-btn kc-btn';
        nb.innerHTML='<span>\uD83C\uDFAC Voir les clips</span>';
        nb.onclick=_openGallery;
        oldBtn.replaceWith(nb);
      }
      card.classList.add('kc-card');
    });

    var grid=document.querySelector('#projects .projects-grid');
    if(grid) grid.classList.add('kc-grid-mode');

    document.documentElement.classList.add('custom-cursor');
    _kcActive=true;
    _showToast(true);
  }

  /* ── DÉSACTIVER ── */
  function _deactivateKC(){
    _kcActive=false;
    document.documentElement.classList.remove('custom-cursor');
    _removeKCTheme();

    var grid=document.querySelector('#projects .projects-grid');
    if(grid) grid.classList.remove('kc-grid-mode');

    _savedCards.forEach(function(saved){
      var card=saved.card;
      card.style.display=saved.display;
      var vis=card.querySelector('.project-visual');
      if(vis){
        while(vis.firstChild) vis.removeChild(vis.firstChild);
        saved.visNodes.forEach(function(n){vis.appendChild(n.cloneNode(true));});
        saved.imgs.forEach(function(info){
          vis.querySelectorAll('img').forEach(function(img){
            if(img.alt===info.alt){img.src=info.src;if(info.ds)img.dataset.src=info.ds;}
          });
        });
      }
      if(card.querySelector('.project-type'))  card.querySelector('.project-type').textContent  = saved.type;
      if(card.querySelector('.project-title')) card.querySelector('.project-title').textContent = saved.title;
      if(card.querySelector('.project-desc'))  card.querySelector('.project-desc').textContent  = saved.desc;
      var btn=card.querySelector('.project-btn');
      if(btn&&saved.btnHTML) btn.outerHTML=saved.btnHTML;
      card.classList.remove('kc-card');
    });
    _savedCards=[];

    var gal=document.getElementById('kcGallery');if(gal)gal.remove();
    document.body.style.overflow='';
    _showToast(false);
  }

  /* ── GALERIE CLIPS ── */
  function _openGallery(){
    var old=document.getElementById('kcGallery');if(old)old.remove();
    var overlay=document.createElement('div');overlay.id='kcGallery';

    var hdr=document.createElement('div');hdr.className='kc-gal-hdr';
    var hlogo=document.createElement('img');hlogo.className='kc-gal-hdr-logo';hlogo.src=KC_LOGO;hlogo.alt='KC';
    var htitle=document.createElement('div');htitle.className='kc-gal-hdr-title';htitle.textContent='\uD83C\uDFC6 Clips Karmine Corp';
    var hclose=document.createElement('button');hclose.className='kc-gal-close';hclose.innerHTML='&#x2715;';
    hclose.onclick=function(){overlay.remove();document.body.style.overflow='';};
    hdr.appendChild(hlogo);hdr.appendChild(htitle);hdr.appendChild(hclose);

    var grd=document.createElement('div');grd.className='kc-gal-grid';
    KC_CLIPS.forEach(function(clip){
      var thumb=document.createElement('div');thumb.className='kc-thumb';
      var img=document.createElement('img');img.src=clip.src;img.alt=clip.label;
      img.onerror=function(){img.style.display='none';thumb.style.background='linear-gradient(135deg,#280808,#081030)';};
      var lbl=document.createElement('div');lbl.className='kc-thumb-lbl';lbl.textContent=clip.label;
      var play=document.createElement('div');play.className='kc-thumb-play';
      var pbtn=document.createElement('span');pbtn.textContent='\u25B6';play.appendChild(pbtn);
      thumb.appendChild(img);thumb.appendChild(lbl);thumb.appendChild(play);
      thumb.onclick=function(){openVideoModal(clip.src,'\uD83C\uDFAC '+clip.label);};
      grd.appendChild(thumb);
    });

    overlay.appendChild(hdr);overlay.appendChild(grd);
    overlay.addEventListener('click',function(e){if(e.target===overlay){overlay.remove();document.body.style.overflow='';}});
    document.body.appendChild(overlay);
    document.body.style.overflow='hidden';
  }

  /* ── TOAST ── */
  function _showToast(on){
    var old=document.getElementById('kcToast');if(old)old.remove();
    var t=document.createElement('div');t.id='kcToast';
    t.innerHTML='<img class="kt-logo" src="'+KC_LOGO+'" alt="KC">'
      +(on?'\uD83C\uDFC6 KARMINE CORP MODE':'\uD83D\uDC4B MODE KC DÉSACTIVÉ')
      +'<span class="kt-sub">'+(on?'ALLEZ LES BLEUS !':'À bientôt sur la Rift')+'</span>';
    document.body.appendChild(t);
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)';
    });});
    setTimeout(function(){
      t.style.opacity='0';t.style.transform='translateX(-50%) translateY(24px)';
      setTimeout(function(){if(t.parentNode)t.remove();},450);
    },3800);
  }

  /* ── DÉTECTION "lol" ── */
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
    } else {
      ts=(key===seq[0])?[Date.now()]:[];
    }
  });
})();

/* ════ ECHAP ════ */
document.addEventListener('keydown',function(e){
  if(e.key!=='Escape') return;
  document.querySelectorAll('.modal-overlay.active').forEach(function(m){m.classList.remove('active');});
  document.querySelectorAll('.submodal-overlay.active').forEach(function(m){m.classList.remove('active');});
  closeVideoModal();
  if(typeof closeCard==='function') closeCard();
  document.body.style.overflow='';
});

/* ════ PERFORMANCE — lazy load + prefetch GIFs ════ */
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
  } else {document.querySelectorAll('img[data-src]').forEach(function(img){loadImg(img);});}
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
