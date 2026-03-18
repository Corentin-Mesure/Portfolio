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
  var tlObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e, i) {
      if (!e.isIntersecting) return;
      setTimeout(function () { e.target.classList.add('visible'); }, i * 150);
      tlObs.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.timeline-item').forEach(function (el) { tlObs.observe(el); });

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
   IMAGE MODAL
════════════════════════════════════════════════════════ */
function openImageModal(srcs, pov, size) {
  var overlay = document.getElementById('videoModal');
  var badge   = document.getElementById('videoModalPov');
  var errDiv  = document.getElementById('videoModalErr');
  var inner   = document.querySelector('.video-modal-inner');
  var bar     = document.querySelector('.video-modal-bar');
  var wrap    = document.querySelector('.video-modal-wrap');

  _stopGif();
  var olds = inner.querySelectorAll('#videoModalMedia, canvas, .static-screen-img, .img-modal-label');
  olds.forEach(function(el) { el.remove(); });

  if (bar) bar.style.visibility = 'hidden';
  badge.innerHTML      = '';
  badge.style.cssText  = 'display:none;';
  errDiv.style.display = 'none';

  var maxW = size ? size + 'px' : '98vw';
  if (wrap) wrap.style.cssText = 'background:transparent;box-shadow:none;border:none;padding:0;max-width:' + maxW + ';width:' + maxW + ';pointer-events:none;';

  inner.style.cssText = 'display:flex;flex-direction:row;align-items:center;justify-content:center;gap:48px;background:transparent;box-shadow:none;border:none;padding:0;overflow:visible;pointer-events:none;';

  var list   = Array.isArray(srcs) ? srcs : [srcs];
  var labels = ['👑 POV Admin', '👤 POV Membre'];
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
      img.style.cssText = 'display:block;width:100%;height:auto;object-fit:contain;border-radius:12px;box-shadow:0 0 40px rgba(0,0,0,0.9);image-rendering:crisp-edges;';
    } else {
      img.style.cssText = 'display:block;height:75vh;width:auto;max-width:46vw;object-fit:contain;border-radius:12px;box-shadow:0 0 40px rgba(0,0,0,0.9);image-rendering:crisp-edges;';
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
   SYSTÈME DE VITESSE PAR GIF — PERSISTANT (localStorage)
   ════════════════════════════════════════════════════════
   Clé de stockage : "gifSpeed:<nom_du_fichier>"
   Exemple : "gifSpeed:inscription.gif" → 1.25
════════════════════════════════════════════════════════ */

var GIF_SPEED_KEY   = 'gifSpeed:';   /* préfixe localStorage */
var GIF_DEFAULT_SPD = 1;             /* vitesse par défaut si pas de préférence */
var GIF_PRESETS     = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3]; /* boutons rapides */

/* Extrait le nom de fichier depuis un chemin */
function _gifBasename(src) {
  return src ? src.split('/').pop().split('?')[0] : '';
}

/* Lit la vitesse sauvegardée pour un GIF (accepte n'importe quelle valeur) */
function _getGifSpeed(src) {
  var key   = GIF_SPEED_KEY + _gifBasename(src);
  var saved = parseFloat(localStorage.getItem(key));
  if (!isNaN(saved) && saved > 0) return saved;
  return GIF_DEFAULT_SPD;
}

/* Sauvegarde la vitesse pour un GIF */
function _saveGifSpeed(src, speed) {
  var key = GIF_SPEED_KEY + _gifBasename(src);
  localStorage.setItem(key, speed);
}

/* ── État global du lecteur GIF ── */
var _gifTimer        = null;
var _gifActive       = false;
var _gifSessionId    = 0;
var _currentGifSrc   = '';
var _currentGifSpeed = 1;

function _stopGif() {
  _gifActive = false;
  if (_gifTimer) { clearTimeout(_gifTimer); _gifTimer = null; }
}

/* ────────────────────────────────────────────────────────
   PANNEAU DE VITESSE — injecté dans .video-modal-bar
   • Presets rapides
   • Champ de saisie libre (ex: 1.10, 0.8, 3.5…)
   • Boutons − / + par pas de 0.05
──────────────────────────────────────────────────────── */
function _buildSpeedPanel(src) {
  var bar = document.querySelector('.video-modal-bar');
  if (!bar) return;

  _currentGifSpeed = _getGifSpeed(src);
  var name      = _gifBasename(src);
  var shortName = name.replace(/\.gif$/i, '').replace(/_/g, ' ');
  if (shortName.length > 26) shortName = shortName.slice(0, 24) + '…';

  bar.style.visibility = '';
  bar.innerHTML = '';

  var panel = document.createElement('div');
  panel.id = 'gifSpeedPanel';
  panel.innerHTML =
    /* Nom du GIF */
    '<div id="gifSpeedFileName">' + shortName + '</div>' +

    /* Contrôles principaux : − | saisie | + */
    '<div id="gifSpeedControls">' +
      '<button id="gifSpeedDown" title="−0.05">&#x2212;</button>' +
      '<div id="gifSpeedInputWrap">' +
        '<span id="gifSpeedPrefix">x</span>' +
        '<input id="gifSpeedInput" type="number" min="0.05" max="20" step="0.05" value="' + _currentGifSpeed + '">' +
      '</div>' +
      '<button id="gifSpeedUp" title="+0.05">+</button>' +
      '<button id="gifSpeedApply" title="Appliquer">&#x23CE;</button>' +
    '</div>' +

    /* Presets rapides */
    '<div id="gifSpeedPresets">' +
      GIF_PRESETS.map(function(s) {
        var cls = Math.abs(s - _currentGifSpeed) < 0.001 ? ' active' : '';
        return '<button class="spd-preset' + cls + '" data-spd="' + s + '">x' + s + '</button>';
      }).join('') +
    '</div>';

  bar.appendChild(panel);
  _injectSpeedCSS();

  /* ── Événements ── */
  var input = document.getElementById('gifSpeedInput');

  document.getElementById('gifSpeedDown').addEventListener('click', function() {
    var v = Math.round((_currentGifSpeed - 0.05) * 100) / 100;
    if (v < 0.05) v = 0.05;
    _applySpeed(v, src);
  });

  document.getElementById('gifSpeedUp').addEventListener('click', function() {
    var v = Math.round((_currentGifSpeed + 0.05) * 100) / 100;
    if (v > 20) v = 20;
    _applySpeed(v, src);
  });

  document.getElementById('gifSpeedApply').addEventListener('click', function() {
    _commitInput(src);
  });

  /* Entrée clavier dans le champ */
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); _commitInput(src); }
  });

  /* Mise à jour visuelle en temps réel pendant la saisie (pas de sauvegarde) */
  input.addEventListener('input', function() {
    _updatePresetsHighlight(parseFloat(input.value));
  });

  /* Presets */
  panel.querySelectorAll('.spd-preset').forEach(function(btn) {
    btn.addEventListener('click', function() {
      _applySpeed(parseFloat(btn.dataset.spd), src);
    });
  });
}

/* Valide et applique la valeur du champ libre */
function _commitInput(src) {
  var input = document.getElementById('gifSpeedInput');
  if (!input) return;
  var v = parseFloat(input.value);
  if (isNaN(v) || v <= 0) { input.value = _currentGifSpeed; return; }
  v = Math.round(v * 100) / 100;   /* arrondi à 2 décimales */
  v = Math.max(0.05, Math.min(20, v));
  _applySpeed(v, src);
}

/* Applique une vitesse (preset ou saisie libre) */
function _applySpeed(spd, src) {
  _currentGifSpeed = spd;
  _saveGifSpeed(src, spd);

  /* Sync champ */
  var input = document.getElementById('gifSpeedInput');
  if (input) input.value = spd;

  _updatePresetsHighlight(spd);
  _showSpeedToast(spd);
}

/* Met en surbrillance le preset correspondant (ou aucun si valeur libre) */
function _updatePresetsHighlight(spd) {
  document.querySelectorAll('.spd-preset').forEach(function(b) {
    b.classList.toggle('active', Math.abs(parseFloat(b.dataset.spd) - spd) < 0.001);
  });
}

function _injectSpeedCSS() {
  if (document.getElementById('gifSpeedCSS')) return;
  var s = document.createElement('style');
  s.id = 'gifSpeedCSS';
  s.textContent = [
    '#gifSpeedPanel{display:flex;flex-direction:column;align-items:center;gap:9px;',
      'padding:11px 14px 10px;background:rgba(0,0,0,0.62);backdrop-filter:blur(12px);',
      'border-radius:15px;border:1px solid rgba(200,160,60,0.28);width:100%;box-sizing:border-box;}',

    /* Nom du GIF */
    '#gifSpeedFileName{font-family:Cinzel,serif;font-size:9.5px;letter-spacing:1.8px;',
      'color:rgba(200,160,60,0.65);text-transform:uppercase;text-align:center;}',

    /* Contrôles − | input | + | ↵ */
    '#gifSpeedControls{display:flex;align-items:center;gap:8px;}',

    '#gifSpeedControls button{background:rgba(255,255,255,0.07);border:1px solid rgba(200,160,60,0.3);',
      'color:#fff;border-radius:8px;width:30px;height:30px;font-size:17px;line-height:1;',
      'cursor:pointer;transition:background .15s,transform .1s,border-color .15s;',
      'display:flex;align-items:center;justify-content:center;flex-shrink:0;}',
    '#gifSpeedControls button:hover{background:rgba(200,160,60,0.22);border-color:rgba(200,160,60,0.7);transform:scale(1.1);}',

    '#gifSpeedApply{font-size:14px !important;color:#c8a03c !important;',
      'border-color:rgba(200,160,60,0.5) !important;}',

    /* Champ de saisie libre */
    '#gifSpeedInputWrap{display:flex;align-items:center;',
      'background:rgba(255,255,255,0.06);border:1.5px solid rgba(200,160,60,0.45);',
      'border-radius:9px;padding:0 8px;gap:2px;transition:border-color .2s;}',
    '#gifSpeedInputWrap:focus-within{border-color:rgba(200,160,60,0.9);',
      'background:rgba(200,160,60,0.08);}',

    '#gifSpeedPrefix{font-family:Cinzel,serif;font-size:15px;font-weight:700;',
      'color:#c8a03c;line-height:1;pointer-events:none;user-select:none;}',

    '#gifSpeedInput{background:transparent;border:none;outline:none;',
      'font-family:Cinzel,serif;font-size:17px;font-weight:700;color:#f0c84a;',
      'width:58px;text-align:center;padding:4px 2px;',
      '-moz-appearance:textfield;}',
    '#gifSpeedInput::-webkit-inner-spin-button,',
    '#gifSpeedInput::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}',

    /* Presets */
    '#gifSpeedPresets{display:flex;gap:5px;flex-wrap:wrap;justify-content:center;}',
    '#gifSpeedPresets .spd-preset{font-family:Cinzel,serif;font-size:10.5px;',
      'padding:3px 9px;border-radius:6px;background:rgba(255,255,255,0.05);',
      'border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.48);',
      'cursor:pointer;transition:all .15s;letter-spacing:.4px;}',
    '#gifSpeedPresets .spd-preset:hover{background:rgba(200,160,60,0.12);color:#c8a03c;',
      'border-color:rgba(200,160,60,0.45);}',
    '#gifSpeedPresets .spd-preset.active{background:rgba(200,160,60,0.2);',
      'border-color:rgba(200,160,60,0.75);color:#f0c84a;font-weight:700;}'
  ].join('');
  document.head.appendChild(s);
}

function _showSpeedToast(spd) {
  var existing = document.getElementById('gifSpeedToast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.id = 'gifSpeedToast';
  toast.textContent = 'x' + spd + ' \u2014 enregistr\u00e9';
  toast.style.cssText = [
    'position:fixed;bottom:82px;left:50%;transform:translateX(-50%) translateY(10px);',
    'background:rgba(200,160,60,0.16);border:1px solid rgba(200,160,60,0.55);',
    'color:#f0c84a;font-family:Cinzel,serif;font-size:11px;letter-spacing:3px;',
    'padding:8px 22px;border-radius:20px;z-index:9999999;pointer-events:none;',
    'opacity:0;transition:opacity .22s,transform .22s;white-space:nowrap;'
  ].join('');
  document.body.appendChild(toast);
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      toast.style.opacity   = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
  });
  setTimeout(function() {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(function() { if (toast.parentNode) toast.remove(); }, 280);
  }, 1600);
}


/* ════════════════════════════════════════════════════════
   VIDEO MODAL — lecture GIF avec vitesse par GIF
════════════════════════════════════════════════════════ */

function _safeSrc(src) {
  return src.split('').map(function(c) {
    return c.charCodeAt(0) > 127 ? encodeURIComponent(c) : c;
  }).join('');
}

/* Fallback <img> natif */
function _fallbackImg(src, container, onError) {
  var bar = document.querySelector('.video-modal-bar');
  if (bar) bar.style.visibility = 'hidden';
  var img = document.createElement('img');
  img.id  = 'videoModalMedia';
  img.style.cssText = 'display:block;width:100%;min-height:100px;';
  img.onerror = function() { img.style.display = 'none'; if (onError) onError(src); };
  img.src = src;
  container.insertBefore(img, container.firstChild);
}

/* Lecture GIF frame par frame via omggif + vitesse dynamique */
function _playGifFrames(src, container, onError) {
  /* Canvas */
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

      /* Vitesse lue en temps réel depuis _currentGifSpeed */
      var ms = Math.max(16, ((info.delay || 10) * 10) / _currentGifSpeed);
      idx = (idx+1) % N;
      _gifTimer = setTimeout(tick, ms);
    }
    tick();
  };

  xhr.onerror = function() { canvas.remove(); _fallbackImg(src, container, onError); };
  xhr.send();
}


function openVideoModal(src, pov, size) {
  var overlay = document.getElementById('videoModal');
  var badge   = document.getElementById('videoModalPov');
  var errDiv  = document.getElementById('videoModalErr');
  var errPath = document.getElementById('videoModalErrPath');
  var inner   = document.querySelector('.video-modal-inner');
  var wrap    = document.querySelector('.video-modal-wrap');

  /* Nettoyage */
  _stopGif();
  var old = inner.querySelector('#videoModalMedia, canvas, .static-screen-img');
  if (old) old.remove();

  if (wrap) wrap.style.maxWidth = size ? size + 'px' : '';

  _currentGifSrc = src;
  badge.innerHTML = pov;
  errDiv.style.display = 'none';

  var safeSrc = _safeSrc(src);
  var ext     = safeSrc.split('?')[0].split('.').pop().toLowerCase();

  if (ext === 'gif') {
    /* Construire le panneau de vitesse avec la vitesse sauvegardée */
    _buildSpeedPanel(src);

    /* Lire les frames avec omggif si disponible, sinon fallback <img> */
    if (typeof window.GifReader === 'function') {
      _playGifFrames(safeSrc, inner, function(errSrc) {
        errPath.textContent = errSrc;
        errDiv.style.display = 'block';
      });
    } else {
      _fallbackImg(safeSrc, inner, function(errSrc) {
        errPath.textContent = errSrc;
        errDiv.style.display = 'block';
      });
    }

  } else {
    /* Vidéo MP4/WEBM */
    var bar = document.querySelector('.video-modal-bar');
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
  _currentGifSrc = '';
  var inner = document.querySelector('.video-modal-inner');
  var media = inner && inner.querySelector('#videoModalMedia, canvas, .static-screen-img');
  if (media) media.remove();
  if (inner) inner.style.cssText = '';
  var wrap = document.querySelector('.video-modal-wrap');
  if (wrap) wrap.style.cssText = '';
  var badge = document.getElementById('videoModalPov');
  if (badge) { badge.style.cssText = ''; badge.innerHTML = ''; }

  /* Vider la barre de vitesse */
  var bar = document.querySelector('.video-modal-bar');
  if (bar) { bar.innerHTML = ''; bar.style.visibility = ''; }

  document.getElementById('videoModal').classList.remove('open');
}

function closeVideoModalOverlay(e) {
  if (e.target === document.getElementById('videoModal')) closeVideoModal();
}

/* Compatibilité : l'ancien bouton toggleGifSpeed n'est plus utilisé mais
   on garde la fonction pour éviter des erreurs si elle est appelée ailleurs */
function toggleGifSpeed() {}


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
   EASTER EGG — L O L
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
      'color:#5de8f2', 'font-family:Cinzel,serif',
      'font-size:12px', 'letter-spacing:4px',
      'padding:16px 36px', 'z-index:99999',
      'pointer-events:none', 'opacity:0',
      'transition:opacity 0.4s ease, transform 0.4s ease',
      'text-align:center', 'white-space:nowrap'
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
          isOn ? '&#x2694;&#xFE0F; CURSEUR LOL ACTIVE &#x2694;&#xFE0F;'
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
