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
  var olds = inner.querySelectorAll('#videoModalMedia, canvas, .static-screen-img');
  olds.forEach(function (el) { el.remove(); });

  if (bar) { bar.innerHTML = ''; bar.style.visibility = 'hidden'; }
  badge.innerHTML      = '';
  badge.style.cssText  = 'display:none;';
  errDiv.style.display = 'none';

  var maxW = size ? size + 'px' : '98vw';
  if (wrap) wrap.style.cssText = 'background:transparent;box-shadow:none;border:none;padding:0;max-width:' + maxW + ';width:' + maxW + ';pointer-events:none;';
  inner.style.cssText = 'display:flex;flex-direction:row;align-items:center;justify-content:center;gap:48px;background:transparent;box-shadow:none;border:none;padding:0;overflow:visible;pointer-events:none;';

  var list     = Array.isArray(srcs) ? srcs : [srcs];
  var labels   = ['\uD83D\uDC51 POV Admin', '\uD83D\uDC64 POV Membre'];
  var useWidth = !!size;

  list.forEach(function (src, i) {
    var wrapper = document.createElement('div');
    wrapper.className = 'static-screen-img';
    wrapper.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:12px;pointer-events:auto;' + (useWidth ? 'width:100%;' : '');

    var label = document.createElement('div');
    label.innerHTML = labels[i] || '';
    label.style.cssText = 'font-family:Cinzel,serif;font-size:14px;letter-spacing:3px;color:' +
      (i === 0 ? '#C89B3C' : '#5DE8F2') + ';text-shadow:0 0 10px currentColor;';

    var img = document.createElement('img');
    img.style.cssText = useWidth
      ? 'display:block;width:100%;height:auto;object-fit:contain;border-radius:12px;box-shadow:0 0 40px rgba(0,0,0,0.9);image-rendering:crisp-edges;'
      : 'display:block;height:75vh;width:auto;max-width:46vw;object-fit:contain;border-radius:12px;box-shadow:0 0 40px rgba(0,0,0,0.9);image-rendering:crisp-edges;';
    img.onerror = function () { img.style.display = 'none'; };
    img.src = src;

    wrapper.appendChild(label);
    wrapper.appendChild(img);
    inner.appendChild(wrapper);
  });

  overlay.classList.add('open');
}


/* ════════════════════════════════════════════════════════
   SYSTEME DE VITESSE PAR GIF — PERSISTANT (localStorage)

   Cle    : "gifSpeed:<nom_fichier>"
   Valeur : n'importe quel nombre > 0  (ex: 1.10, 0.8, 3.5)
   −/+    : pas de 0.05
   Champ  : saisie libre → Entree ou bouton applicer
   Presets: 0.25 / 0.5 / 0.75 / 1 / 1.25 / 1.5 / 2 / 3
════════════════════════════════════════════════════════ */

var _GIF_PRESETS     = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];
var _GIF_SPEED_KEY   = 'gifSpeed:';
var _GIF_DEFAULT_SPD = 1;

var _gifTimer        = null;
var _gifActive       = false;
var _gifSessionId    = 0;
var _currentGifSrc   = '';
var _currentGifSpeed = 1;

function _gifBasename(src) {
  return src ? src.split('/').pop().split('?')[0] : '';
}
function _getGifSpeed(src) {
  var saved = parseFloat(localStorage.getItem(_GIF_SPEED_KEY + _gifBasename(src)));
  return (!isNaN(saved) && saved > 0) ? saved : _GIF_DEFAULT_SPD;
}
function _saveGifSpeed(src, spd) {
  localStorage.setItem(_GIF_SPEED_KEY + _gifBasename(src), spd);
}
function _stopGif() {
  _gifActive = false;
  if (_gifTimer) { clearTimeout(_gifTimer); _gifTimer = null; }
}


/* ── Panneau de vitesse ── */
function _buildSpeedPanel(src) {
  var bar = document.querySelector('.video-modal-bar');
  if (!bar) return;

  _currentGifSpeed = _getGifSpeed(src);

  var shortName = _gifBasename(src).replace(/\.gif$/i, '').replace(/_/g, ' ');
  if (shortName.length > 26) shortName = shortName.slice(0, 24) + '\u2026';

  bar.style.visibility = '';
  bar.innerHTML = '';

  var panel = document.createElement('div');
  panel.id = 'gifSpeedPanel';
  panel.innerHTML =
    '<div id="gifSpeedFileName">' + shortName + '</div>' +
    '<div id="gifSpeedControls">' +
      '<button id="gifSpeedDown" title="\u22120.05">\u2212</button>' +
      '<div id="gifSpeedInputWrap">' +
        '<span id="gifSpeedPrefix">x</span>' +
        '<input id="gifSpeedInput" type="number" min="0.05" max="20" step="0.05" value="' + _currentGifSpeed + '">' +
      '</div>' +
      '<button id="gifSpeedUp" title="+0.05">+</button>' +
      '<button id="gifSpeedApply" title="Appliquer (Entr\u00e9e)">\u23CE</button>' +
    '</div>' +
    '<div id="gifSpeedPresets">' +
      _GIF_PRESETS.map(function (s) {
        return '<button class="spd-preset' + (Math.abs(s - _currentGifSpeed) < 0.001 ? ' active' : '') +
          '" data-spd="' + s + '">x' + s + '</button>';
      }).join('') +
    '</div>';

  bar.appendChild(panel);
  _injectSpeedCSS();

  var input = document.getElementById('gifSpeedInput');

  document.getElementById('gifSpeedDown').addEventListener('click', function () {
    _applySpeed(Math.max(0.05, Math.round((_currentGifSpeed - 0.05) * 100) / 100), src);
  });
  document.getElementById('gifSpeedUp').addEventListener('click', function () {
    _applySpeed(Math.min(20, Math.round((_currentGifSpeed + 0.05) * 100) / 100), src);
  });
  document.getElementById('gifSpeedApply').addEventListener('click', function () {
    _commitInput(src);
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); _commitInput(src); }
  });
  input.addEventListener('input', function () {
    _syncPresetHighlight(parseFloat(input.value));
  });
  panel.querySelectorAll('.spd-preset').forEach(function (btn) {
    btn.addEventListener('click', function () {
      _applySpeed(parseFloat(btn.dataset.spd), src);
    });
  });
}

function _commitInput(src) {
  var input = document.getElementById('gifSpeedInput');
  if (!input) return;
  var v = parseFloat(input.value);
  if (isNaN(v) || v <= 0) { input.value = _currentGifSpeed; return; }
  v = Math.round(v * 100) / 100;
  v = Math.max(0.05, Math.min(20, v));
  _applySpeed(v, src);
}

function _applySpeed(spd, src) {
  _currentGifSpeed = spd;
  _saveGifSpeed(src, spd);
  var input = document.getElementById('gifSpeedInput');
  if (input) input.value = spd;
  _syncPresetHighlight(spd);
  _showSpeedToast(spd);
}

function _syncPresetHighlight(spd) {
  document.querySelectorAll('.spd-preset').forEach(function (b) {
    b.classList.toggle('active', Math.abs(parseFloat(b.dataset.spd) - spd) < 0.001);
  });
}

function _showSpeedToast(spd) {
  var old = document.getElementById('gifSpeedToast');
  if (old) old.remove();
  var t = document.createElement('div');
  t.id = 'gifSpeedToast';
  t.textContent = 'x' + spd + ' \u2014 enregistr\u00e9';
  t.style.cssText = 'position:fixed;bottom:82px;left:50%;transform:translateX(-50%) translateY(10px);' +
    'background:rgba(200,160,60,0.16);border:1px solid rgba(200,160,60,0.55);' +
    'color:#f0c84a;font-family:Cinzel,serif;font-size:11px;letter-spacing:3px;' +
    'padding:8px 22px;border-radius:20px;z-index:9999999;pointer-events:none;' +
    'opacity:0;transition:opacity .22s,transform .22s;white-space:nowrap;';
  document.body.appendChild(t);
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)'; });
  });
  setTimeout(function () {
    t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(function () { if (t.parentNode) t.remove(); }, 280);
  }, 1600);
}

function _injectSpeedCSS() {
  if (document.getElementById('gifSpeedCSS')) return;
  var s = document.createElement('style');
  s.id = 'gifSpeedCSS';
  s.textContent =
    '#gifSpeedPanel{display:flex;flex-direction:column;align-items:center;gap:9px;' +
      'padding:11px 14px 10px;background:rgba(0,0,0,0.62);backdrop-filter:blur(12px);' +
      'border-radius:15px;border:1px solid rgba(200,160,60,0.28);width:100%;box-sizing:border-box;}' +
    '#gifSpeedFileName{font-family:Cinzel,serif;font-size:9.5px;letter-spacing:1.8px;' +
      'color:rgba(200,160,60,0.65);text-transform:uppercase;text-align:center;}' +
    '#gifSpeedControls{display:flex;align-items:center;gap:8px;}' +
    '#gifSpeedControls button{background:rgba(255,255,255,0.07);border:1px solid rgba(200,160,60,0.3);' +
      'color:#fff;border-radius:8px;width:30px;height:30px;font-size:17px;line-height:1;cursor:pointer;' +
      'transition:background .15s,transform .1s,border-color .15s;' +
      'display:flex;align-items:center;justify-content:center;flex-shrink:0;}' +
    '#gifSpeedControls button:hover{background:rgba(200,160,60,0.22);border-color:rgba(200,160,60,0.7);transform:scale(1.1);}' +
    '#gifSpeedApply{font-size:14px!important;color:#c8a03c!important;border-color:rgba(200,160,60,0.5)!important;}' +
    '#gifSpeedInputWrap{display:flex;align-items:center;background:rgba(255,255,255,0.06);' +
      'border:1.5px solid rgba(200,160,60,0.45);border-radius:9px;padding:0 8px;gap:2px;transition:border-color .2s;}' +
    '#gifSpeedInputWrap:focus-within{border-color:rgba(200,160,60,0.9);background:rgba(200,160,60,0.08);}' +
    '#gifSpeedPrefix{font-family:Cinzel,serif;font-size:15px;font-weight:700;color:#c8a03c;' +
      'line-height:1;pointer-events:none;user-select:none;}' +
    '#gifSpeedInput{background:transparent;border:none;outline:none;font-family:Cinzel,serif;' +
      'font-size:17px;font-weight:700;color:#f0c84a;width:58px;text-align:center;padding:4px 2px;' +
      '-moz-appearance:textfield;}' +
    '#gifSpeedInput::-webkit-inner-spin-button,#gifSpeedInput::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}' +
    '#gifSpeedPresets{display:flex;gap:5px;flex-wrap:wrap;justify-content:center;}' +
    '#gifSpeedPresets .spd-preset{font-family:Cinzel,serif;font-size:10.5px;padding:3px 9px;border-radius:6px;' +
      'background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.48);' +
      'cursor:pointer;transition:all .15s;letter-spacing:.4px;}' +
    '#gifSpeedPresets .spd-preset:hover{background:rgba(200,160,60,0.12);color:#c8a03c;border-color:rgba(200,160,60,0.45);}' +
    '#gifSpeedPresets .spd-preset.active{background:rgba(200,160,60,0.2);border-color:rgba(200,160,60,0.75);color:#f0c84a;font-weight:700;}';
  document.head.appendChild(s);
}


/* ════════════════════════════════════════════════════════
   LECTURE GIF (omggif frame-par-frame)
════════════════════════════════════════════════════════ */
function _safeSrc(src) {
  return src.split('').map(function (c) {
    return c.charCodeAt(0) > 127 ? encodeURIComponent(c) : c;
  }).join('');
}

function _fallbackImg(src, container, onError) {
  var bar = document.querySelector('.video-modal-bar');
  if (bar) bar.style.visibility = 'hidden';
  var img = document.createElement('img');
  img.id  = 'videoModalMedia';
  img.style.cssText = 'display:block;width:100%;min-height:100px;';
  img.onerror = function () { img.style.display = 'none'; if (onError) onError(src); };
  img.src = src;
  container.insertBefore(img, container.firstChild);
}

function _playGifFrames(src, container, onError) {
  /* On utilise deux canvas :
     - offscreen : reçoit le blit omggif (taille du GIF)
     - canvas    : canvas visible, composite proprement chaque frame */
  var canvas = document.createElement('canvas');
  canvas.id  = 'videoModalMedia';
  canvas.style.cssText = 'display:block;width:100%;';
  container.insertBefore(canvas, container.firstChild);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', src, true);
  xhr.responseType = 'arraybuffer';

  xhr.onload = function () {
    if (!xhr.response || !xhr.response.byteLength) {
      canvas.remove(); _fallbackImg(src, container, onError); return;
    }
    var gr;
    try { gr = new window.GifReader(new Uint8Array(xhr.response)); }
    catch (e) { canvas.remove(); _fallbackImg(src, container, onError); return; }

    var W = gr.width, H = gr.height, N = gr.numFrames();
    if (!N) { canvas.remove(); _fallbackImg(src, container, onError); return; }

    canvas.width  = W;
    canvas.height = H;

    var ctx = canvas.getContext('2d');

    /* Canvas offscreen pour recevoir le blit omggif */
    var offscreen = document.createElement('canvas');
    offscreen.width  = W;
    offscreen.height = H;
    var offCtx = offscreen.getContext('2d');

    /* Pré-décode toutes les frames en ImageData */
    var frames = [];
    try {
      for (var f = 0; f < N; f++) {
        var info   = gr.frameInfo(f);
        var pixels = new Uint8ClampedArray(W * H * 4);
        gr.decodeAndBlitFrameRGBA(f, pixels);
        frames.push({
          data:     new ImageData(pixels, W, H),
          x:        info.x        || 0,
          y:        info.y        || 0,
          w:        info.width,
          h:        info.height,
          delay:    info.delay    || 10,
          disposal: info.disposal || 0
        });
      }
    } catch (e) {
      canvas.remove(); _fallbackImg(src, container, onError); return;
    }

    var sid = ++_gifSessionId;
    _gifActive = true;
    var idx = 0;

    /* Snapshot du canvas avant d'afficher une frame (pour disposal=3) */
    var savedSnapshot = null;

    function tick() {
      if (!_gifActive || sid !== _gifSessionId) return;

      var frame = frames[idx];

      /* --- Gestion du disposal de la frame PRECEDENTE --- */
      var prevIdx = (idx === 0) ? N - 1 : idx - 1;
      var prev    = frames[prevIdx];

      if (idx > 0 || N === 1) {
        switch (prev.disposal) {
          case 2:
            /* Effacer la zone de la frame précédente avec du transparent */
            ctx.clearRect(prev.x, prev.y, prev.w, prev.h);
            break;
          case 3:
            /* Restaurer le snapshot pris avant d'avoir affiché la frame précédente */
            if (savedSnapshot) {
              ctx.putImageData(savedSnapshot, 0, 0);
            }
            break;
          /* case 0 et 1 : ne rien faire, on laisse le canvas tel quel */
        }
      }

      /* Sauvegarde avant d'afficher si la frame courante demande disposal=3 */
      if (frame.disposal === 3) {
        savedSnapshot = ctx.getImageData(0, 0, W, H);
      }

      /* Blit de la frame courante via le canvas offscreen */
      offCtx.putImageData(frame.data, 0, 0);
      ctx.drawImage(offscreen,
        frame.x, frame.y, frame.w, frame.h,   /* source dans l'offscreen */
        frame.x, frame.y, frame.w, frame.h    /* destination sur le canvas visible */
      );

      var ms = Math.max(16, (frame.delay * 10) / _currentGifSpeed);
      idx = (idx + 1) % N;
      _gifTimer = setTimeout(tick, ms);
    }

    tick();
  };

  xhr.onerror = function () { canvas.remove(); _fallbackImg(src, container, onError); };
  xhr.send();
}


/* ════════════════════════════════════════════════════════
   VIDEO MODAL — ouverture / fermeture
════════════════════════════════════════════════════════ */
function openVideoModal(src, pov, size) {
  var overlay = document.getElementById('videoModal');
  var badge   = document.getElementById('videoModalPov');
  var errDiv  = document.getElementById('videoModalErr');
  var errPath = document.getElementById('videoModalErrPath');
  var inner   = document.querySelector('.video-modal-inner');
  var wrap    = document.querySelector('.video-modal-wrap');

  _stopGif();
  var old = inner.querySelector('#videoModalMedia, canvas, .static-screen-img');
  if (old) old.remove();

  if (wrap) wrap.style.maxWidth = size ? size + 'px' : '';

  _currentGifSrc   = src;
  badge.innerHTML  = pov;
  errDiv.style.display = 'none';

  var safeSrc = _safeSrc(src);
  var ext     = safeSrc.split('?')[0].split('.').pop().toLowerCase();

  if (ext === 'gif') {
    _buildSpeedPanel(src);
    if (typeof window.GifReader === 'function') {
      _playGifFrames(safeSrc, inner, function (errSrc) {
        errPath.textContent = errSrc; errDiv.style.display = 'block';
      });
    } else {
      _fallbackImg(safeSrc, inner, function (errSrc) {
        errPath.textContent = errSrc; errDiv.style.display = 'block';
      });
    }
  } else {
    var bar = document.querySelector('.video-modal-bar');
    if (bar) { bar.innerHTML = ''; bar.style.visibility = 'hidden'; }
    var video = document.createElement('video');
    video.id = 'videoModalMedia';
    video.autoplay = true; video.loop = true; video.muted = true; video.playsInline = true;
    video.style.cssText = 'display:block;width:100%;min-height:100px;';
    var source = document.createElement('source');
    source.src  = safeSrc;
    source.type = 'video/' + (ext === 'webm' ? 'webm' : 'mp4');
    video.appendChild(source);
    video.addEventListener('canplay', function () { video.playbackRate = 1.0; });
    video.onerror = function () {
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
  var bar = document.querySelector('.video-modal-bar');
  if (bar) { bar.innerHTML = ''; bar.style.visibility = ''; }
  document.getElementById('videoModal').classList.remove('open');
}

function closeVideoModalOverlay(e) {
  if (e.target === document.getElementById('videoModal')) closeVideoModal();
}

/* Retrocompatibilite */
function toggleGifSpeed() {}


/* ════════════════════════════════════════════════════════
   PROJETS PERSONNELS — TOGGLE
════════════════════════════════════════════════════════ */
function togglePersoProjects() {
  var grid   = document.getElementById('persoGrid');
  var btn    = document.getElementById('persoTeaserBtn');
  var isOpen = grid.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
}


/* ════════════════════════════════════════════════════════
   EASTER EGG — taper "lol" en moins de 5s
════════════════════════════════════════════════════════ */
(function () {
  var seq = ['l', 'o', 'l'], ts = [], timer = null;

  function showToast(msg, dur) {
    var ex = document.getElementById('easterToast');
    if (ex) ex.remove();
    clearTimeout(timer);
    var t = document.createElement('div');
    t.id = 'easterToast';
    t.innerHTML = msg;
    t.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(20px);' +
      'background:linear-gradient(135deg,#1a1a50,#2a2880);border:1px solid rgba(93,232,242,0.6);' +
      'box-shadow:0 0 24px rgba(93,232,242,0.2);color:#5de8f2;font-family:Cinzel,serif;font-size:12px;' +
      'letter-spacing:4px;padding:16px 36px;z-index:99999;pointer-events:none;opacity:0;' +
      'transition:opacity .4s,transform .4s;text-align:center;white-space:nowrap;';
    document.body.appendChild(t);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)'; });
    });
    timer = setTimeout(function () {
      t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(function () { if (t.parentNode) t.remove(); }, 400);
    }, dur || 3500);
  }

  document.addEventListener('keydown', function (e) {
    var key = e.key.toLowerCase();
    if (key === seq[ts.length]) {
      var now = Date.now();
      if (ts.length > 0 && now - ts[0] > 5000) { ts = []; if (key === seq[0]) ts.push(now); return; }
      ts.push(now);
      if (ts.length === seq.length) {
        ts = [];
        var on = document.documentElement.classList.toggle('custom-cursor');
        showToast(on
          ? '&#x2694;&#xFE0F; CURSEUR LOL ACTIVE &#x2694;&#xFE0F;'
          : '&#x2694;&#xFE0F; CURSEUR LOL DESACTIVE &#x2694;&#xFE0F;', 3500);
      }
    } else {
      ts = (key === seq[0]) ? [Date.now()] : [];
    }
  });
})();


/* ════════════════════════════════════════════════════════
   FERMETURE PAR TOUCHE ECHAP
════════════════════════════════════════════════════════ */
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.modal-overlay.active').forEach(function (m) { m.classList.remove('active'); });
  document.querySelectorAll('.submodal-overlay.active').forEach(function (m) { m.classList.remove('active'); });
  closeVideoModal();
  if (typeof closeCard === 'function') closeCard();
  document.body.style.overflow = '';
});


/* ════════════════════════════════════════════════════════
   OPTIMISATIONS PERFORMANCE
════════════════════════════════════════════════════════ */
(function () {
  var isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  if (isMobile) { var hg = document.querySelector('.hero-grid'); if (hg) hg.style.display = 'none'; }

  var BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  function loadImg(img) { if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; } }

  if ('IntersectionObserver' in window) {
    var imgObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { loadImg(e.target); imgObs.unobserve(e.target); } });
    }, { rootMargin: '300px' });

    document.querySelectorAll('img').forEach(function (img) {
      if (img.closest('#hero')) return;
      if (!img.src || img.src === BLANK || img.src.startsWith('data:')) return;
      img.dataset.src = img.src; img.src = BLANK; img.decoding = 'async'; img.loading = 'lazy';
      imgObs.observe(img);
    });
    document.querySelectorAll('img[data-src]').forEach(function (img) { imgObs.observe(img); });

    requestAnimationFrame(function () {
      document.querySelectorAll('img[data-src]').forEach(function (img) {
        var r = img.getBoundingClientRect();
        if (r.top < window.innerHeight + 400) { loadImg(img); imgObs.unobserve(img); }
      });
    });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        document.querySelectorAll('img[data-src]').forEach(function (img) {
          var r = img.getBoundingClientRect();
          if (r.top < window.innerHeight + 400) { loadImg(img); imgObs.unobserve(img); }
        });
      }
    });
  } else {
    document.querySelectorAll('img[data-src]').forEach(function (img) { loadImg(img); });
  }

  function loadLazy(el) { if (!el) return; el.querySelectorAll('img[data-src]').forEach(function (img) { loadImg(img); }); }
  var _om  = window.openModal;    window.openModal    = function (id) { loadLazy(document.getElementById('modal-' + id)); if (typeof _om  === 'function') _om(id); };
  var _osm = window.openSubModal; window.openSubModal = function (id) { loadLazy(document.getElementById(id));           if (typeof _osm === 'function') _osm(id); };

  var _cv = window.closeVideoModal;
  window.closeVideoModal = function () {
    if (typeof _cv === 'function') _cv();
    setTimeout(function () { var el = document.getElementById('videoModalPov'); if (el) el.innerHTML = ''; }, 500);
  };

  var scrollBar = document.getElementById('scrollProgress');
  if (scrollBar) {
    var ticking2 = false;
    window.addEventListener('scroll', function () {
      if (!ticking2) {
        requestAnimationFrame(function () {
          var st = window.scrollY, dh = document.documentElement.scrollHeight - window.innerHeight;
          scrollBar.style.width = (dh > 0 ? (st / dh) * 100 : 0) + '%';
          ticking2 = false;
        });
        ticking2 = true;
      }
    }, { passive: true });
  }

  document.addEventListener('touchstart', function () {}, { passive: true });
  document.addEventListener('touchmove',  function () {}, { passive: true });

  if (isMobile) {
    var st = document.createElement('style');
    st.textContent =
      '.about-glow{display:none!important}' +
      '.hero-grid{display:none!important}' +
      '.scroll-indicator{animation:none!important;opacity:.25!important}' +
      '.project-visual img{animation:logoEntrance 8s ease-in-out infinite!important}';
    document.head.appendChild(st);
  }
})();
