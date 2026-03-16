'use strict';

/* ════════════════════════════════════════════════════════
   PROGRESSION DE SCROLL + NAV ACTIVE
════════════════════════════════════════════════════════ */
(function () {
  var sp       = document.getElementById('scrollProgress');
  var navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  var sections = Array.from(document.querySelectorAll('section, #about, #timeline, #skills, #projects, #contact-section'));
  var ticking  = false;

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var scrolled = window.scrollY;
      var total    = document.body.scrollHeight - window.innerHeight;
      if (sp) sp.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';

      var active = '';
      for (var i = 0; i < sections.length; i++) {
        if (scrolled >= sections[i].offsetTop - 220) active = sections[i].id;
      }
      navLinks.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + active);
      });
      ticking = false;
    });
  }, { passive: true });
})();


/* ════════════════════════════════════════════════════════
   ANIMATIONS AU SCROLL
════════════════════════════════════════════════════════ */
(function () {
  /* Timeline */
  var tlObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e, i) {
      if (!e.isIntersecting) return;
      setTimeout(function () { e.target.classList.add('visible'); }, i * 150);
      tlObs.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.timeline-item').forEach(function (el) { tlObs.observe(el); });

  /* Skill cards */
  var skObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.skill-tag').forEach(function (t, i) {
        t.style.transitionDelay = (i * 0.08) + 's';
      });
      e.target.classList.add('visible');
      skObs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-card').forEach(function (c) { skObs.observe(c); });

  /* Reveal generique */
  var rvObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e, i) {
      if (!e.isIntersecting) return;
      setTimeout(function () { e.target.classList.add('visible'); }, i * 80);
      rvObs.unobserve(e.target);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function (el) { rvObs.observe(el); });
})();


/* ════════════════════════════════════════════════════════
   CARTE FLIP — A PROPOS
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
      clone.id = 'flipCardClone';
      clone.classList.add('is-clone');
      clone.removeAttribute('onclick');
      clone.style.cssText = [
        'position:fixed',
        'left:' + origRect.left + 'px',
        'top:'  + origRect.top  + 'px',
        'width:' + origRect.width  + 'px',
        'height:' + origRect.height + 'px',
        'margin:0', 'z-index:1000',
        'transform:rotateY(180deg)',
        'transition:none', 'visibility:visible',
        'transform-style:preserve-3d',
        'aspect-ratio:unset', 'will-change:left,top,width,height'
      ].join(';');
      document.body.appendChild(clone);

      var backdrop = document.getElementById('cardBackdrop');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';

      var cb = clone.querySelector('.back-close');
      if (cb) {
        cb.style.display = 'flex';
        cb.onclick = function (e) { e.stopPropagation(); window.closeCard(); };
      }

      void clone.offsetHeight;

      var vw = window.innerWidth, vh = window.innerHeight;
      var maxH = Math.min(vh * 0.995, 1060);
      var maxW = Math.min(vw * 0.96, 900);
      var tH   = maxH;
      var tW   = Math.min(maxW, tH * (5 / 6));
      var tLeft = (vw - tW) / 2;
      var tTop  = (vh - tH) / 2;

      clone.style.transition = [
        'left 1s cubic-bezier(0.16,1,0.3,1)',
        'top 1s cubic-bezier(0.16,1,0.3,1)',
        'width 1s cubic-bezier(0.16,1,0.3,1)',
        'height 1s cubic-bezier(0.16,1,0.3,1)'
      ].join(',');
      clone.style.left   = tLeft + 'px';
      clone.style.top    = tTop  + 'px';
      clone.style.width  = tW    + 'px';
      clone.style.height = tH    + 'px';
      state = 'open';
      expandTimer = setTimeout(function () { if (clone) clone.classList.add('expanded'); }, 1050);
    }, 900);
  };

  window.closeCard = function () {
    if (state !== 'open' || !clone) return;
    state = 'closing';
    clearTimeout(expandTimer);
    clone.classList.remove('expanded');

    var backdrop = document.getElementById('cardBackdrop');
    if (backdrop) backdrop.classList.remove('active');
    var card = document.getElementById('flipCard');

    clone.style.transition = [
      'left .65s cubic-bezier(0.4,0,0.2,1)',
      'top .65s cubic-bezier(0.4,0,0.2,1)',
      'width .65s cubic-bezier(0.4,0,0.2,1)',
      'height .65s cubic-bezier(0.4,0,0.2,1)'
    ].join(',');
    clone.style.left   = origRect.left   + 'px';
    clone.style.top    = origRect.top    + 'px';
    clone.style.width  = origRect.width  + 'px';
    clone.style.height = origRect.height + 'px';

    setTimeout(function () {
      if (!clone) return;
      clone.style.transition = 'transform .65s cubic-bezier(0.4,0.2,0.2,1)';
      clone.style.transform  = 'rotateY(0deg)';
      setTimeout(function () {
        if (clone) { clone.remove(); clone = null; }
        document.body.style.overflow = '';
        if (card) {
          card.style.transition = 'none';
          card.style.transform  = 'rotateY(0deg)';
          card.style.visibility = 'visible';
          void card.offsetHeight;
          card.style.transition = '';
          card.style.transform  = '';
        }
        state = 'closed';
      }, 660);
    }, 620);
  };
})();


/* ════════════════════════════════════════════════════════
   MODALS PROJETS
════════════════════════════════════════════════════════ */
function openModal(id) {
  var m = document.getElementById('modal-' + id);
  if (m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeModalBtn(id) {
  var m = document.getElementById('modal-' + id);
  if (m) { m.classList.remove('active'); document.body.style.overflow = ''; }
}
function closeModal(e, id) {
  if (e.target === e.currentTarget) closeModalBtn(id);
}


/* ════════════════════════════════════════════════════════
   SOUS-MODALS
════════════════════════════════════════════════════════ */
function openSubModal(id) {
  var m = document.getElementById(id);
  if (m) m.classList.add('active');
}
function closeSubModalBtn(id) {
  var m = document.getElementById(id);
  if (m) m.classList.remove('active');
}
function closeSubModal(e, id) {
  if (e.target === e.currentTarget) closeSubModalBtn(id);
}


/* ════════════════════════════════════════════════════════
   ACCORDEON TECHNOLOGIE
════════════════════════════════════════════════════════ */
function toggleAcc(id) {
  var body = document.getElementById(id);
  var btn  = body && body.previousElementSibling;
  if (!body) return;
  var isOpen = body.classList.toggle('open');
  if (btn && btn.classList.contains('tech-accordion')) btn.classList.toggle('open', isOpen);
}


/* ════════════════════════════════════════════════════════
   IMAGE MODAL — affiche des screenshots statiques
   Taille identique et agrandie pour une meilleure lisibilité
════════════════════════════════════════════════════════ */
function openImageModal(srcs, pov, size) {
  var overlay = document.getElementById('videoModal');
  var badge   = document.getElementById('videoModalPov');
  var errDiv  = document.getElementById('videoModalErr');
  var inner   = document.querySelector('.video-modal-inner');
  var bar     = document.querySelector('.video-modal-bar');
  var wrap    = document.querySelector('.video-modal-wrap');

  /* Nettoyage */
  _stopGif();
  var olds = inner.querySelectorAll('#videoModalMedia, canvas, .static-screen-img, .img-modal-label');
  olds.forEach(function(el) { el.remove(); });

  if (bar) bar.style.visibility = 'hidden';
  badge.innerHTML      = '';
  badge.style.cssText  = 'display:none;';
  errDiv.style.display = 'none';

  /* Taille personnalisée si fournie */
  var maxW = size ? size + 'px' : '98vw';
  if (wrap) wrap.style.cssText = 'background:transparent;box-shadow:none;border:none;padding:0;max-width:' + maxW + ';width:' + maxW + ';pointer-events:none;';

  /* Conteneur flex centré */
  inner.style.cssText = 'display:flex;flex-direction:row;align-items:center;justify-content:center;gap:48px;background:transparent;box-shadow:none;border:none;padding:0;overflow:visible;pointer-events:none;';

  var list   = Array.isArray(srcs) ? srcs : [srcs];
  var labels = ['👑 POV Admin', '👤 POV Membre'];

  /* Si size fourni (image large) : width 100%, sinon height 75vh */
  var useWidth = !!size;

  list.forEach(function(src, i) {
    var wrapper = document.createElement('div');
    wrapper.className = 'static-screen-img';
    wrapper.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:12px;pointer-events:auto;' + (useWidth ? 'width:100%;' : '');

    var label = document.createElement('div');
    label.innerHTML = labels[i] || '';
    label.style.cssText = 'font-family:Cinzel,serif;font-size:14px;letter-spacing:3px;color:' + (i === 0 ? '#C89B3C' : '#5DE8F2') + ';text-shadow:0 0 10px currentColor;';

    var img = document.createElement('img');
    if (useWidth) {
      img.style.cssText = [
        'display:block',
        'width:100%',
        'height:auto',
        'object-fit:contain',
        'border-radius:12px',
        'box-shadow:0 0 40px rgba(0,0,0,0.9)',
        'image-rendering:crisp-edges'
      ].join(';');
    } else {
      img.style.cssText = [
        'display:block',
        'height:75vh',
        'width:auto',
        'max-width:46vw',
        'object-fit:contain',
        'border-radius:12px',
        'box-shadow:0 0 40px rgba(0,0,0,0.9)',
        'image-rendering:crisp-edges'
      ].join(';');
    }
    img.onerror = function() { img.style.display = 'none'; };
    img.src = src;

    wrapper.appendChild(label);
    wrapper.appendChild(img);
    inner.appendChild(wrapper);
  });

  overlay.classList.add('open');
}


/* ════════════════════════════════════════════════════════
   VIDEO MODAL — GIF x2 via canvas
   Utilise omggif (window.GifReader) chargé dans le <head>.
════════════════════════════════════════════════════════ */

/* Encode les caractères non-ASCII dans une URL */
function _safeSrc(src) {
  return src.split('').map(function(c){
    return c.charCodeAt(0) > 127 ? encodeURIComponent(c) : c;
  }).join('');
}

var _gifTimer     = null;
var _gifActive    = false;
var _gifSessionId = 0;
var _gifSpeed     = 2; /* 1 = normal · 2 = double vitesse */

function _stopGif() {
  _gifActive = false;
  if (_gifTimer) { clearTimeout(_gifTimer); _gifTimer = null; }
}

function _syncSpeedBtn() {
  var btn = document.getElementById('videoSpeedBtn');
  if (!btn) return;
  if (_gifSpeed === 2) {
    btn.innerHTML = '&#x26A1; x2';
    btn.classList.add('active');
  } else {
    btn.innerHTML = '&#x25BA; x1';
    btn.classList.remove('active');
  }
}

/* Appelé par onclick du bouton */
function toggleGifSpeed() {
  _gifSpeed = (_gifSpeed === 2) ? 1 : 2;
  _syncSpeedBtn();
}

/* Charge omggif si pas encore présent, puis appelle cb() */
function _ensureGifReader(cb) {
  if (typeof window.GifReader === 'function') { cb(); return; }
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/omggif@1.0.10/omggif.js';
  s.onload  = cb;
  s.onerror = function() { cb(true); };
  document.head.appendChild(s);
}

/* Lire + jouer le GIF sur un canvas inséré dans container */
function _playGif(src, container, onError) {
  var canvas = document.createElement('canvas');
  canvas.id  = 'videoModalMedia';
  canvas.style.cssText = 'display:block;width:100%;';
  container.insertBefore(canvas, container.firstChild);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', src, true);
  xhr.responseType = 'arraybuffer';
  xhr.withCredentials = false;

  xhr.onload = function() {
    if (!xhr.response || !xhr.response.byteLength) {
      canvas.remove(); _fallbackImg(src, container, onError); return;
    }

    var gr;
    try { gr = new window.GifReader(new Uint8Array(xhr.response)); }
    catch(e) { canvas.remove(); _fallbackImg(src, container, onError); return; }

    var W = gr.width, H = gr.height, N = gr.numFrames();
    if (!N) { canvas.remove(); _fallbackImg(src, container, onError); return; }

    canvas.width  = W;
    canvas.height = H;

    var ctx  = canvas.getContext('2d');
    var comp = ctx.createImageData(W, H);
    var sid  = ++_gifSessionId;
    _gifActive = true;
    var idx  = 0;

    function tick() {
      if (!_gifActive || sid !== _gifSessionId) return;

      var info   = gr.frameInfo(idx);
      var pixels = new Uint8ClampedArray(W * H * 4);

      try { gr.decodeAndBlitFrameRGBA(idx, pixels); }
      catch(e) { idx = (idx+1)%N; _gifTimer = setTimeout(tick, 50); return; }

      if (info.disposal === 2) {
        var fx=info.x||0, fy=info.y||0, fw=info.width, fh=info.height;
        for (var r=0;r<fh;r++) for (var c=0;c<fw;c++) {
          var di=((fy+r)*W+(fx+c))*4;
          comp.data[di]=comp.data[di+1]=comp.data[di+2]=comp.data[di+3]=0;
        }
      }

      var fx2=info.x||0, fy2=info.y||0, fw2=info.width, fh2=info.height;
      for (var r2=0;r2<fh2;r2++) for (var c2=0;c2<fw2;c2++) {
        var si2=(r2*fw2+c2)*4, di2=((fy2+r2)*W+(fx2+c2))*4;
        if (pixels[si2+3]>0){
          comp.data[di2]=pixels[si2]; comp.data[di2+1]=pixels[si2+1];
          comp.data[di2+2]=pixels[si2+2]; comp.data[di2+3]=pixels[si2+3];
        }
      }

      ctx.putImageData(comp, 0, 0);

      var ms = Math.max(16, ((info.delay||10) * 10) / _gifSpeed);
      idx = (idx+1) % N;
      _gifTimer = setTimeout(tick, ms);
    }

    tick();
  };

  xhr.onerror = function() { canvas.remove(); _fallbackImg(src, container, onError); };
  xhr.send();
}

/* Fallback : <img> natif */
function _fallbackImg(src, container, onError) {
  var bar = document.querySelector('.video-modal-bar');
  if (bar) bar.style.visibility = 'hidden';

  var img = document.createElement('img');
  img.id  = 'videoModalMedia';
  img.style.cssText = 'display:block;width:100%;min-height:100px;';
  img.onerror = function() { img.style.display='none'; if(onError) onError(src); };
  img.src = src;
  container.insertBefore(img, container.firstChild);
}


function openVideoModal(src, pov, size) {
  var overlay = document.getElementById('videoModal');
  var badge   = document.getElementById('videoModalPov');
  var errDiv  = document.getElementById('videoModalErr');
  var errPath = document.getElementById('videoModalErrPath');
  var inner   = document.querySelector('.video-modal-inner');
  var bar     = document.querySelector('.video-modal-bar');
  var wrap    = document.querySelector('.video-modal-wrap');

  /* Nettoyage */
  _stopGif();
  var old = inner.querySelector('#videoModalMedia, canvas, .static-screen-img');
  if (old) old.remove();

  /* Taille personnalisée si fournie, sinon reset */
  if (wrap) wrap.style.maxWidth = size ? size + 'px' : '';

  /* Réinitialiser le bouton vitesse */
  _gifSpeed = 2;
  if (bar) bar.style.visibility = '';
  _syncSpeedBtn();

  badge.innerHTML      = pov;
  errDiv.style.display = 'none';

  var safeSrc = _safeSrc(src);
  var ext     = safeSrc.split('?')[0].split('.').pop().toLowerCase();

  if (ext === 'gif') {
    /* Utilise <img> natif — compatible avec tous les serveurs, pas de CORS */
    if (bar) bar.style.visibility = 'hidden';
    var gifImg = document.createElement('img');
    gifImg.id = 'videoModalMedia';
    gifImg.style.cssText = 'display:block;width:100%;min-height:100px;';
    gifImg.onerror = function() {
      gifImg.style.display = 'none';
      errPath.textContent = safeSrc; errDiv.style.display = 'block';
    };
    gifImg.src = safeSrc;
    inner.insertBefore(gifImg, inner.firstChild);

  } else {
    /* Vidéo MP4/WEBM */
    if (bar) bar.style.visibility = 'hidden';
    var video = document.createElement('video');
    video.id = 'videoModalMedia';
    video.autoplay = true; video.loop = true;
    video.muted = true; video.playsInline = true;
    video.style.cssText = 'display:block;width:100%;min-height:100px;';
    var source = document.createElement('source');
    source.src  = safeSrc;
    source.type = 'video/' + (ext === 'webm' ? 'webm' : 'mp4');
    video.appendChild(source);
    video.addEventListener('canplay', function() { video.playbackRate = 2.0; });
    video.onerror = function() {
      video.style.display = 'none';
      errPath.textContent = safeSrc; errDiv.style.display = 'block';
    };
    inner.insertBefore(video, inner.firstChild);
  }

  overlay.classList.add('open');
}


function closeVideoModal() {
  _stopGif();
  var inner = document.querySelector('.video-modal-inner');
  var media = inner && inner.querySelector('#videoModalMedia, canvas, .static-screen-img');
  if (media) media.remove();
  if (inner) inner.style.cssText = '';
  var wrap = document.querySelector('.video-modal-wrap');
  if (wrap) wrap.style.cssText = '';
  var badge = document.getElementById('videoModalPov');
  if (badge) { badge.style.cssText = ''; }

  /* Réinitialiser le bouton vitesse */
  var bar = document.querySelector('.video-modal-bar');
  if (bar) bar.style.visibility = '';
  _gifSpeed = 2;
  _syncSpeedBtn();

  document.getElementById('videoModal').classList.remove('open');
}

function closeVideoModalOverlay(e) {
  if (e.target === document.getElementById('videoModal')) closeVideoModal();
}


/* ════════════════════════════════════════════════════════
   PROJETS PERSONNELS — TOGGLE
════════════════════════════════════════════════════════ */
function togglePersoProjects() {
  var grid = document.getElementById('persoGrid');
  var btn  = document.getElementById('persoTeaserBtn');
  var isOpen = grid.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
}


/* ════════════════════════════════════════════════════════
   EASTER EGG — L O L en moins de 5s → CURSEUR CUSTOM
════════════════════════════════════════════════════════ */
(function () {
  var sequence   = ['l', 'o', 'l'];
  var timestamps = [];
  var toastTimer = null;

  function showToast(msg, duration) {
    var existing = document.getElementById('easterToast');
    if (existing) existing.remove();
    clearTimeout(toastTimer);

    var toast = document.createElement('div');
    toast.id = 'easterToast';
    toast.innerHTML = msg;
    toast.style.cssText = [
      'position:fixed', 'bottom:32px', 'left:50%',
      'transform:translateX(-50%) translateY(20px)',
      'background:linear-gradient(135deg,#1a1a50,#2a2880)',
      'border:1px solid rgba(93,232,242,0.6)',
      'box-shadow:0 0 24px rgba(93,232,242,0.2)',
      'color:#5de8f2',
      'font-family:Cinzel,serif',
      'font-size:12px',
      'letter-spacing:4px',
      'padding:16px 36px',
      'z-index:99999',
      'pointer-events:none',
      'opacity:0',
      'transition:opacity 0.4s ease, transform 0.4s ease',
      'text-align:center',
      'white-space:nowrap'
    ].join(';');
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.style.opacity   = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
      });
    });

    toastTimer = setTimeout(function () {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(function () { if (toast.parentNode) toast.remove(); }, 400);
    }, duration || 3500);
  }

  document.addEventListener('keydown', function (e) {
    var key      = e.key.toLowerCase();
    var expected = sequence[timestamps.length];

    if (key === expected) {
      var now = Date.now();
      if (timestamps.length > 0 && now - timestamps[0] > 5000) {
        timestamps = [];
        if (key === sequence[0]) timestamps.push(now);
        return;
      }
      timestamps.push(now);
      if (timestamps.length === sequence.length) {
        timestamps = [];
        var isOn = document.documentElement.classList.toggle('custom-cursor');
        showToast(
          isOn
            ? '&#x2694;&#xFE0F; CURSEUR LOL ACTIVE &#x2694;&#xFE0F;'
            : '&#x2694;&#xFE0F; CURSEUR LOL DESACTIVE &#x2694;&#xFE0F;',
          3500
        );
      }
    } else {
      timestamps = (key === sequence[0]) ? [Date.now()] : [];
    }
  });
})();


/* ════════════════════════════════════════════════════════
   FERMETURE PAR TOUCHE ECHAP
════════════════════════════════════════════════════════ */
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.modal-overlay.active').forEach(function (m) {
    m.classList.remove('active');
  });
  document.querySelectorAll('.submodal-overlay.active').forEach(function (m) {
    m.classList.remove('active');
  });
  closeVideoModal();
  if (typeof closeCard === 'function') closeCard();
  document.body.style.overflow = '';
});