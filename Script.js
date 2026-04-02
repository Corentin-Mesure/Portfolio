'use strict';

var _isMobileDevice = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

/* ════════════════════════════════════════════════════════
   FIX SAFARI IOS ROTATION
════════════════════════════════════════════════════════ */
(function () {
  if (!_isMobileDevice) return;
  var s = document.createElement('style');
  s.textContent = 'body.orientation-freeze *,body.orientation-freeze *::before,body.orientation-freeze *::after{animation-play-state:paused!important;transition:none!important;}body.orientation-freeze html{scroll-behavior:auto!important;}';
  document.head.appendChild(s);
  var t = null;
  window.addEventListener('orientationchange', function () {
    document.body.classList.add('orientation-freeze');
    clearTimeout(t);
    t = setTimeout(function () { document.body.classList.remove('orientation-freeze'); }, 500);
  });
})();

/* ════════════════════════════════════════════════════════
   SCROLL PROGRESS + NAV ACTIVE
════════════════════════════════════════════════════════ */
(function () {
  var sp = document.getElementById('scrollProgress');
  var navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  var sections = Array.from(document.querySelectorAll('section,#about,#timeline,#skills,#projects,#projet-ap,#contact-section'));
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var s = window.scrollY, tot = document.body.scrollHeight - window.innerHeight;
      if (sp) sp.style.width = (tot > 0 ? (s / tot) * 100 : 0) + '%';
      var active = '';
      for (var i = 0; i < sections.length; i++) {
        if (s >= sections[i].offsetTop - 220) active = sections[i].id;
      }
      navLinks.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + active);
      });
      ticking = false;
    });
  }, { passive: true });
})();

/* ════════════════════════════════════════════════════════
   ANIMATIONS AU SCROLL (IntersectionObserver)
════════════════════════════════════════════════════════ */
(function () {
  /* Timeline items */
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

  /* Éléments .reveal */
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
   CARTE FLIP (section À propos)
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
    card.style.transform = 'rotateY(180deg)';

    setTimeout(function () {
      if (state !== 'flipping') return;
      card.style.visibility = 'hidden';
      clone = card.cloneNode(true);
      clone.id = 'flipCardClone';
      clone.classList.add('is-clone');
      clone.removeAttribute('onclick');

      var vvp = window.visualViewport || null;
      var vw = vvp ? Math.round(vvp.width)  : window.innerWidth;
      var vh = vvp ? Math.round(vvp.height) : window.innerHeight;
      var vx = vvp ? Math.round(vvp.offsetLeft) : 0;
      var vy = vvp ? Math.round(vvp.offsetTop)  : 0;
      var tW, tH, tLeft, tTop;

      if (_isMobileDevice) {
        tW    = Math.min(vw * 0.88, 400);
        tH    = Math.min(tW * (4 / 3), vh * 0.85);
        tW    = Math.min(tW, tH * (3 / 4));
        tLeft = vx + (vw - tW) / 2;
        tTop  = vy + (vh - tH) / 2;
        if (tLeft < 8) tLeft = 8;
        if (tTop  < 8) tTop  = 8;
        if (tLeft + tW > vx + vw - 8) tLeft = vx + vw - tW - 8;
        if (tTop  + tH > vy + vh - 8) tTop  = vy + vh - tH - 8;
      } else {
        var maxH = Math.min(vh * 0.995, 1060), maxW = Math.min(vw * 0.96, 900);
        tH    = maxH;
        tW    = Math.min(maxW, tH * (5 / 6));
        tLeft = (vw - tW) / 2;
        tTop  = (vh - tH) / 2;
      }

      if (_isMobileDevice) {
        clone.style.cssText = [
          'position:fixed', 'left:' + tLeft + 'px', 'top:' + tTop + 'px',
          'width:' + tW + 'px', 'height:' + tH + 'px', 'margin:0', 'z-index:1000',
          'transform:rotateY(180deg) scale(0.85)', 'transform-style:preserve-3d',
          'transition:none', 'visibility:visible', 'opacity:0', 'aspect-ratio:unset'
        ].join(';');
      } else {
        clone.style.cssText = [
          'position:fixed', 'left:' + origRect.left + 'px', 'top:' + origRect.top + 'px',
          'width:' + origRect.width + 'px', 'height:' + origRect.height + 'px', 'margin:0',
          'z-index:1000', 'transform:rotateY(180deg)', 'transition:none',
          'visibility:visible', 'transform-style:preserve-3d', 'aspect-ratio:unset'
        ].join(';');
      }

      document.body.appendChild(clone);
      var bd = document.getElementById('cardBackdrop');
      if (bd) bd.classList.add('active');
      document.body.style.overflow = 'hidden';

      var cb = clone.querySelector('.back-close');
      if (cb) {
        cb.style.display = 'flex';
        cb.onclick = function (e) { e.stopPropagation(); window.closeCard(); };
      }

      void clone.offsetHeight;

      if (_isMobileDevice) {
        clone.style.transition = 'transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease';
        clone.style.transform  = 'rotateY(180deg) scale(1)';
        clone.style.opacity    = '1';
        state = 'open';
        expandTimer = setTimeout(function () { if (clone) clone.classList.add('expanded'); }, 500);
      } else {
        clone.style.transition = 'left 1s cubic-bezier(0.16,1,0.3,1),top 1s cubic-bezier(0.16,1,0.3,1),width 1s cubic-bezier(0.16,1,0.3,1),height 1s cubic-bezier(0.16,1,0.3,1)';
        clone.style.left   = tLeft + 'px';
        clone.style.top    = tTop  + 'px';
        clone.style.width  = tW    + 'px';
        clone.style.height = tH    + 'px';
        state = 'open';
        expandTimer = setTimeout(function () { if (clone) clone.classList.add('expanded'); }, 1050);
      }
    }, 900);
  };

  window.closeCard = function () {
    if (state !== 'open' || !clone) return;
    state = 'closing';
    clearTimeout(expandTimer);
    clone.classList.remove('expanded');
    var bd   = document.getElementById('cardBackdrop');
    var card = document.getElementById('flipCard');
    if (bd) bd.classList.remove('active');

    if (_isMobileDevice) {
      clone.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease';
      clone.style.transform  = 'rotateY(180deg) scale(0.85)';
      clone.style.opacity    = '0';
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
      }, 360);
    } else {
      var currentRect = card ? card.getBoundingClientRect() : origRect;
      clone.style.transition = 'left .65s cubic-bezier(0.4,0,0.2,1),top .65s cubic-bezier(0.4,0,0.2,1),width .65s cubic-bezier(0.4,0,0.2,1),height .65s cubic-bezier(0.4,0,0.2,1)';
      clone.style.left   = currentRect.left   + 'px';
      clone.style.top    = currentRect.top    + 'px';
      clone.style.width  = currentRect.width  + 'px';
      clone.style.height = currentRect.height + 'px';
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
    }
  };
})();

/* ════════════════════════════════════════════════════════
   MODALS PRINCIPALES
════════════════════════════════════════════════════════ */
function openModal(id) {
  var m = document.getElementById('modal-' + id);
  if (m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeModalBtn(id) {
  var m = document.getElementById('modal-' + id);
  if (m) { m.classList.remove('active'); document.body.style.overflow = ''; }
}
function closeModal(e, id) { if (e.target === e.currentTarget) closeModalBtn(id); }

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
function closeSubModal(e, id) { if (e.target === e.currentTarget) closeSubModalBtn(id); }

/* ════════════════════════════════════════════════════════
   ACCORDÉON TECH
════════════════════════════════════════════════════════ */
function toggleAcc(id) {
  var body = document.getElementById(id);
  var btn  = body && body.previousElementSibling;
  if (!body) return;
  var open = body.classList.toggle('open');
  if (btn && btn.classList.contains('tech-accordion')) btn.classList.toggle('open', open);
}

/* ════════════════════════════════════════════════════════
   IMAGE MODAL avec ZOOM COMPLET
════════════════════════════════════════════════════════ */
var _zoom = {
  scale: 1, min: 0.25, max: 5,
  ox: 0, oy: 0,
  dragging: false, startX: 0, startY: 0,
  wrap: null, img: null
};
var _ZOOM_STEPS = [25, 50, 75, 100, 125, 150, 200, 300, 400, 500];

function _zoomSet(scale, ox, oy) {
  _zoom.scale = Math.min(_zoom.max, Math.max(_zoom.min, scale));
  if (ox !== undefined) _zoom.ox = ox;
  if (oy !== undefined) _zoom.oy = oy;
  if (_zoom.img) {
    _zoom.img.style.transformOrigin = '0 0';
    _zoom.img.style.transform = 'translate(' + _zoom.ox + 'px,' + _zoom.oy + 'px) scale(' + _zoom.scale + ')';
  }
  _zoomUpdateUI();
}
function _zoomReset() { _zoomSet(1, 0, 0); }
function _zoomCenter(scale) {
  var wrap = _zoom.wrap;
  if (!wrap) { _zoomSet(scale); return; }
  var rect = wrap.getBoundingClientRect();
  var cx = rect.width / 2, cy = rect.height / 2;
  var r = scale / _zoom.scale;
  _zoomSet(scale, cx + (_zoom.ox - cx) * r, cy + (_zoom.oy - cy) * r);
}
function _zoomUpdateUI() {
  var pct = document.getElementById('_zPct');
  var rng = document.getElementById('_zRange');
  var pct_val = Math.round(_zoom.scale * 100);
  if (pct) pct.textContent = pct_val + '%';
  if (rng) {
    var log = Math.log(_zoom.max / _zoom.min);
    var pos = Math.log(_zoom.scale / _zoom.min);
    rng.value = Math.round((pos / log) * 100);
  }
}

function _zoomAttach(wrap, img) {
  _zoom.wrap = wrap;
  _zoom.img  = img;
  _zoom.scale = 1;
  _zoom.ox = 0;
  _zoom.oy = 0;

  wrap.addEventListener('wheel', function (e) {
    e.preventDefault();
    var rect   = wrap.getBoundingClientRect();
    var mx     = e.clientX - rect.left;
    var my     = e.clientY - rect.top;
    var factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    var ns     = Math.min(_zoom.max, Math.max(_zoom.min, _zoom.scale * factor));
    var r      = ns / _zoom.scale;
    _zoomSet(ns, mx + (_zoom.ox - mx) * r, my + (_zoom.oy - my) * r);
  }, { passive: false });

  wrap.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    var tag = (e.target.tagName || '').toUpperCase();
    if (['BUTTON','INPUT','SELECT','TEXTAREA','A'].indexOf(tag) !== -1) return;
    _zoom.dragging = true;
    _zoom.startX   = e.clientX - _zoom.ox;
    _zoom.startY   = e.clientY - _zoom.oy;
    wrap.style.cursor = 'grabbing';
    e.preventDefault();
  });
  window.addEventListener('mousemove', function (e) {
    if (!_zoom.dragging || _zoom.wrap !== wrap) return;
    _zoomSet(_zoom.scale, e.clientX - _zoom.startX, e.clientY - _zoom.startY);
  });
  window.addEventListener('mouseup', function () {
    if (_zoom.dragging && _zoom.wrap === wrap) {
      _zoom.dragging = false;
      wrap.style.cursor = 'grab';
    }
  });

  /* Touch pinch + pan */
  var _touches = {}, _lastDist = null, _tsX = 0, _tsY = 0;
  wrap.addEventListener('touchstart', function (e) {
    Array.from(e.changedTouches).forEach(function (t) { _touches[t.identifier] = t; });
    var pts = Object.values(_touches);
    if (pts.length === 2) {
      _lastDist = Math.hypot(pts[1].clientX - pts[0].clientX, pts[1].clientY - pts[0].clientY);
    } else if (pts.length === 1) {
      _tsX = pts[0].clientX - _zoom.ox;
      _tsY = pts[0].clientY - _zoom.oy;
    }
    e.preventDefault();
  }, { passive: false });
  wrap.addEventListener('touchmove', function (e) {
    Array.from(e.changedTouches).forEach(function (t) { _touches[t.identifier] = t; });
    var pts = Object.values(_touches);
    if (pts.length === 2 && _lastDist !== null) {
      var dist  = Math.hypot(pts[1].clientX - pts[0].clientX, pts[1].clientY - pts[0].clientY);
      var ratio = dist / _lastDist;
      _lastDist = dist;
      var rect  = wrap.getBoundingClientRect();
      var cx    = (pts[0].clientX + pts[1].clientX) / 2 - rect.left;
      var cy    = (pts[0].clientY + pts[1].clientY) / 2 - rect.top;
      var ns    = Math.min(_zoom.max, Math.max(_zoom.min, _zoom.scale * ratio));
      var r     = ns / _zoom.scale;
      _zoomSet(ns, cx + (_zoom.ox - cx) * r, cy + (_zoom.oy - cy) * r);
    } else if (pts.length === 1) {
      _zoomSet(_zoom.scale, pts[0].clientX - _tsX, pts[0].clientY - _tsY);
    }
    e.preventDefault();
  }, { passive: false });
  wrap.addEventListener('touchend', function (e) {
    Array.from(e.changedTouches).forEach(function (t) { delete _touches[t.identifier]; });
    _lastDist = null;
  });

  wrap.addEventListener('dblclick', _zoomReset);
}

function _buildZoomBar(bar) {
  _injectZoomCSS();
  bar.style.pointerEvents = 'auto';
  bar.style.position      = 'relative';
  bar.style.zIndex        = '10';
  bar.addEventListener('click',     function (e) { e.stopPropagation(); });
  bar.addEventListener('mousedown', function (e) { e.stopPropagation(); });

  var p = document.createElement('div');
  p.id = '_zPanel';
  p.innerHTML =
    '<button id="_zOut" title="Dézoomer">&#x2212;</button>' +
    '<input  id="_zRange" type="range" min="0" max="100" value="50" title="Zoom">' +
    '<button id="_zIn"  title="Zoomer">+</button>' +
    '<div    id="_zPct" title="Cliquer pour saisir un % précis">100%</div>' +
    '<button id="_zReset" title="Réinitialiser">&#x21BA;</button>';
  bar.appendChild(p);

  document.getElementById('_zIn').onclick = function () {
    var cur  = Math.round(_zoom.scale * 100);
    var next = _ZOOM_STEPS.find(function (v) { return v > cur; }) || 500;
    _zoomCenter(next / 100);
  };
  document.getElementById('_zOut').onclick = function () {
    var cur  = Math.round(_zoom.scale * 100);
    var prev = null;
    for (var i = 0; i < _ZOOM_STEPS.length; i++) if (_ZOOM_STEPS[i] < cur) prev = _ZOOM_STEPS[i];
    _zoomCenter((prev || 25) / 100);
  };
  document.getElementById('_zReset').onclick = _zoomReset;
  document.getElementById('_zRange').oninput = function () {
    var log = Math.log(_zoom.max / _zoom.min);
    var sc  = _zoom.min * Math.exp(log * this.value / 100);
    _zoomCenter(sc);
  };
  document.getElementById('_zPct').onclick = function () {
    var val = prompt('Zoom en % (25 – 500) :', Math.round(_zoom.scale * 100));
    if (val === null) return;
    var n = parseInt(val, 10);
    if (!isNaN(n) && n >= 25 && n <= 500) _zoomCenter(n / 100);
  };
  document.getElementById('_zPct').style.cursor = 'pointer';
}

function _injectZoomCSS() {
  if (document.getElementById('_zCSS')) return;
  var s = document.createElement('style');
  s.id = '_zCSS';
  s.textContent =
    '#_zPanel{display:flex;align-items:center;gap:8px;padding:10px 14px;' +
    'background:rgba(0,0,0,0.62);backdrop-filter:blur(12px);border-radius:15px;' +
    'border:1px solid rgba(200,160,60,0.28);width:100%;box-sizing:border-box;' +
    'pointer-events:auto;position:relative;z-index:10;}' +
    '#_zPanel *{pointer-events:auto;}' +
    '#_zPanel button{background:rgba(255,255,255,0.07);border:1px solid rgba(200,160,60,0.3);' +
    'color:#fff;border-radius:8px;width:32px;height:32px;font-size:17px;cursor:pointer;' +
    'transition:background .15s,transform .1s,border-color .15s;' +
    'display:flex;align-items:center;justify-content:center;flex-shrink:0;}' +
    '#_zPanel button:hover{background:rgba(200,160,60,0.22);border-color:rgba(200,160,60,0.7);transform:scale(1.1);}' +
    '#_zRange{flex:1;height:4px;accent-color:#c8a03c;cursor:pointer;min-width:80px;}' +
    '#_zPct{font-family:Cinzel,serif;font-size:13px;font-weight:700;color:#f0c84a;' +
    'min-width:52px;text-align:center;background:rgba(200,160,60,0.1);' +
    'border:1px solid rgba(200,160,60,0.35);border-radius:6px;padding:4px 8px;}' +
    '#_zReset{font-size:18px!important;color:#c8a03c!important;border-color:rgba(200,160,60,0.5)!important;}';
  document.head.appendChild(s);
}

function openImageModal(srcs, pov, size) {
  var overlay = document.getElementById('videoModal');
  var badge   = document.getElementById('videoModalPov');
  var errDiv  = document.getElementById('videoModalErr');
  var inner   = document.querySelector('.video-modal-inner');
  var bar     = document.querySelector('.video-modal-bar');
  var wrap    = document.querySelector('.video-modal-wrap');

  _gifReset();
  inner.querySelectorAll('#videoModalMedia,.static-screen-img').forEach(function (el) { el.remove(); });

  overlay.querySelectorAll('button').forEach(function (b) {
    if (b.id === '_imgModalClose') return;
    b.dataset.hiddenByImg = '1';
    b.style.display = 'none';
  });

  if (bar) {
    bar.innerHTML = '';
    bar.style.pointerEvents = 'auto';
    bar.style.position      = 'relative';
    bar.style.zIndex        = '10';
    bar.style.visibility    = '';
    _buildZoomBar(bar);
  }

  badge.innerHTML = '';
  badge.style.cssText = 'display:none;';
  errDiv.style.display = 'none';

  var maxW = size ? size + 'px' : '98vw';
  if (wrap) {
    wrap.style.cssText =
      'background:transparent;box-shadow:none;border:none;padding:0;' +
      'max-width:' + maxW + ';width:' + maxW + ';pointer-events:none;';
    if (bar) {
      bar.style.pointerEvents = 'auto';
      bar.style.position      = 'relative';
      bar.style.zIndex        = '10';
    }
  }

  inner.style.cssText =
    'display:flex;flex-direction:row;align-items:center;justify-content:center;' +
    'gap:48px;background:transparent;box-shadow:none;border:none;padding:0;' +
    'overflow:visible;pointer-events:none;';

  var list   = Array.isArray(srcs) ? srcs : [srcs];
  var labels = ['\uD83D\uDC51 POV Admin', '\uD83D\uDC64 POV Membre'];
  var useWidth = !!size;

  list.forEach(function (src, i) {
    var wrapper = document.createElement('div');
    wrapper.className = 'static-screen-img';
    wrapper.style.cssText =
      'display:flex;flex-direction:column;align-items:center;gap:12px;pointer-events:auto;' +
      (useWidth ? 'width:100%;' : '');

    var label = document.createElement('div');
    label.innerHTML = labels[i] || '';
    label.style.cssText =
      'font-family:Cinzel,serif;font-size:14px;letter-spacing:3px;' +
      'color:' + (i === 0 ? '#C89B3C' : '#5DE8F2') + ';text-shadow:0 0 10px currentColor;';

    var imgWrap = document.createElement('div');
    imgWrap.style.cssText =
      'overflow:hidden;border-radius:12px;box-shadow:0 0 40px rgba(0,0,0,0.9);' +
      'cursor:grab;touch-action:none;position:relative;' +
      (useWidth ? 'width:100%;' : '');

    var img = document.createElement('img');
    img.style.cssText = useWidth
      ? 'display:block;width:100%;height:auto;object-fit:contain;' +
        'transform-origin:0 0;transition:transform .1s;user-select:none;-webkit-user-drag:none;'
      : 'display:block;height:75vh;width:auto;max-width:46vw;object-fit:contain;' +
        'transform-origin:0 0;transition:transform .1s;user-select:none;-webkit-user-drag:none;';
    img.onerror = function () { img.style.display = 'none'; };
    img.src = src;

    _zoomAttach(imgWrap, img);
    imgWrap.appendChild(img);
    wrapper.appendChild(label);
    wrapper.appendChild(imgWrap);
    inner.appendChild(wrapper);
  });

  var existingClose = document.getElementById('_imgModalClose');
  if (existingClose) existingClose.remove();

  var closeBtn = document.createElement('button');
  closeBtn.id = '_imgModalClose';
  closeBtn.innerHTML = '&#x2715;';
  closeBtn.style.cssText =
    'position:fixed;top:18px;right:22px;z-index:10001;' +
    'width:42px;height:42px;background:rgba(0,0,0,0.65);' +
    'border:1px solid rgba(200,160,60,0.5);color:#f0c84a;' +
    'font-size:18px;border-radius:8px;cursor:pointer;' +
    'display:flex;align-items:center;justify-content:center;' +
    'backdrop-filter:blur(8px);transition:background .15s,transform .1s;' +
    'pointer-events:auto;';
  closeBtn.onmouseenter = function () {
    closeBtn.style.background = 'rgba(200,160,60,0.25)';
    closeBtn.style.transform  = 'scale(1.1)';
  };
  closeBtn.onmouseleave = function () {
    closeBtn.style.background = 'rgba(0,0,0,0.65)';
    closeBtn.style.transform  = 'scale(1)';
  };
  closeBtn.onclick = function (e) { e.stopPropagation(); closeVideoModal(); };
  document.body.appendChild(closeBtn);

  overlay.classList.add('open');
}

/* ════════════════════════════════════════════════════════
   CACHE GIF + CONTRÔLE VITESSE
════════════════════════════════════════════════════════ */
var _gifCache = {};
function _checkAndEvictCache() {
  var total = 0, keys = Object.keys(_gifCache);
  for (var i = 0; i < keys.length; i++) total += _gifCache[keys[i]].byteLength;
  if (total > 40 * 1024 * 1024) _gifCache = {};
}
function _patchDelays(origBuffer, speed) {
  var bytes = new Uint8Array(origBuffer.slice(0));
  for (var i = 0; i < bytes.length - 7; i++) {
    if (bytes[i] === 0x21 && bytes[i + 1] === 0xF9 && bytes[i + 2] === 0x04) {
      var d  = bytes[i + 4] | (bytes[i + 5] << 8);
      if (d < 2) d = 10;
      var nd = Math.max(2, Math.round(d / speed));
      bytes[i + 4] = nd & 0xFF;
      bytes[i + 5] = (nd >> 8) & 0xFF;
      i += 7;
    }
  }
  return bytes.buffer;
}
var _blobUrls = [];
function _makeBlobUrl(origBuffer, speed) {
  var patched = _patchDelays(origBuffer, speed);
  var blob = new Blob([patched], { type: 'image/gif' });
  var url  = URL.createObjectURL(blob);
  _blobUrls.push(url);
  return url;
}
function _revokeBlobs() {
  var toRevoke = _blobUrls.slice();
  _blobUrls = [];
  setTimeout(function () { toRevoke.forEach(function (u) { URL.revokeObjectURL(u); }); }, 1000);
}
var _modalOpen = false, _currentSrc = '', _currentSpd = 1;
function _gifReset() { _modalOpen = false; _currentSrc = ''; }
var _GIF_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];
var _SPEED_KEY   = 'gifSpeed:';
function _basename(src) { return src ? src.split('/').pop().split('?')[0] : ''; }
function _loadSpd(src) {
  var v = parseFloat(localStorage.getItem(_SPEED_KEY + _basename(src)));
  return (!isNaN(v) && v > 0) ? v : 1;
}
function _saveSpd(src, s) { localStorage.setItem(_SPEED_KEY + _basename(src), s); }

function _buildPanel(src) {
  var bar = document.querySelector('.video-modal-bar');
  if (!bar) return;
  bar.style.pointerEvents = 'auto';
  bar.style.position      = 'relative';
  bar.style.zIndex        = '10';
  bar.addEventListener('click',     function (e) { e.stopPropagation(); });
  bar.addEventListener('mousedown', function (e) { e.stopPropagation(); });

  _currentSpd = _loadSpd(src);
  var name = _basename(src).replace(/\.gif$/i, '').replace(/_/g, ' ');
  if (name.length > 26) name = name.slice(0, 24) + '\u2026';
  bar.style.visibility = '';
  bar.innerHTML = '';
  var p = document.createElement('div');
  p.id = 'gifSpeedPanel';
  p.innerHTML =
    '<div id="gifSpeedFileName">' + name + '</div>' +
    '<div id="gifSpeedControls">' +
      '<button id="gifSpeedDown">\u2212</button>' +
      '<div id="gifSpeedInputWrap"><span id="gifSpeedPrefix">x</span>' +
        '<input id="gifSpeedInput" type="number" min="0.05" max="20" step="0.05" value="' + _currentSpd + '">' +
      '</div>' +
      '<button id="gifSpeedUp">+</button>' +
      '<button id="gifSpeedApply">\u23CE</button>' +
    '</div>' +
    '<div id="gifSpeedPresets">' +
      _GIF_PRESETS.map(function (s) {
        return '<button class="spd-preset' + (Math.abs(s - _currentSpd) < 0.001 ? ' active' : '') +
               '" data-spd="' + s + '">x' + s + '</button>';
      }).join('') +
    '</div>';
  bar.appendChild(p);
  _injectGifCSS();

  var input = document.getElementById('gifSpeedInput');
  document.getElementById('gifSpeedDown').onclick = function () {
    _setSpd(Math.max(0.05, Math.round((_currentSpd - 0.05) * 100) / 100), src);
  };
  document.getElementById('gifSpeedUp').onclick = function () {
    _setSpd(Math.min(20, Math.round((_currentSpd + 0.05) * 100) / 100), src);
  };
  document.getElementById('gifSpeedApply').onclick = function () { _commitSpd(src); };
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); _commitSpd(src); } });
  input.addEventListener('input', function () { _hlPreset(parseFloat(input.value)); });
  p.querySelectorAll('.spd-preset').forEach(function (btn) {
    btn.onclick = function () { _setSpd(parseFloat(btn.dataset.spd), src); };
  });
}

function _commitSpd(src) {
  var input = document.getElementById('gifSpeedInput');
  if (!input) return;
  var v = parseFloat(input.value);
  if (isNaN(v) || v <= 0) { input.value = _currentSpd; return; }
  _setSpd(Math.max(0.05, Math.min(20, Math.round(v * 100) / 100)), src);
}
function _setSpd(spd, src) {
  _currentSpd = spd;
  _saveSpd(src, spd);
  var input = document.getElementById('gifSpeedInput');
  if (input) input.value = spd;
  _hlPreset(spd);
  _toast('x' + spd + ' \u2014 enregistr\u00e9');
  _reloadImg(src, spd);
}
function _reloadImg(src, spd) {
  var buf = _gifCache[src];
  if (!buf) return;
  _revokeBlobs();
  var newUrl = _makeBlobUrl(buf, spd);
  var inner  = document.querySelector('.video-modal-inner');
  if (!inner) return;
  var oldImg = inner.querySelector('#videoModalMedia');
  var newImg = document.createElement('img');
  newImg.id  = 'videoModalMedia-next';
  newImg.style.cssText = (oldImg ? oldImg.style.cssText : 'display:block;width:100%;border-radius:18px;') +
    ';position:absolute;opacity:0;pointer-events:none;';
  newImg.onload = function () {
    if (!_modalOpen || _currentSrc !== src) { newImg.remove(); return; }
    newImg.id = 'videoModalMedia';
    newImg.style.position    = '';
    newImg.style.opacity     = '1';
    newImg.style.pointerEvents = '';
    if (oldImg && oldImg.parentNode) oldImg.remove();
  };
  newImg.onerror = function () { newImg.remove(); };
  newImg.src = newUrl;
  if (oldImg && oldImg.parentNode) inner.insertBefore(newImg, oldImg);
  else inner.insertBefore(newImg, inner.firstChild);
}
function _hlPreset(spd) {
  document.querySelectorAll('.spd-preset').forEach(function (b) {
    b.classList.toggle('active', Math.abs(parseFloat(b.dataset.spd) - spd) < 0.001);
  });
}
function _toast(msg) {
  var old = document.getElementById('gifSpeedToast');
  if (old) old.remove();
  var t = document.createElement('div');
  t.id = 'gifSpeedToast';
  t.textContent = msg;
  t.style.cssText =
    'position:fixed;bottom:82px;left:50%;transform:translateX(-50%) translateY(10px);' +
    'background:rgba(14,11,30,0.97);border:1px solid rgba(200,160,60,0.45);color:#f0c84a;' +
    'font-family:Cinzel,serif;font-size:11px;letter-spacing:3px;padding:8px 22px;' +
    'border-radius:20px;z-index:9999999;pointer-events:none;opacity:0;' +
    'transition:opacity .22s,transform .22s;white-space:nowrap;';
  document.body.appendChild(t);
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      t.style.opacity   = '1';
      t.style.transform = 'translateX(-50%) translateY(0)';
    });
  });
  setTimeout(function () {
    t.style.opacity   = '0';
    t.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(function () { if (t.parentNode) t.remove(); }, 280);
  }, 1600);
}
function _injectGifCSS() {
  if (document.getElementById('gifSpeedCSS')) return;
  var s = document.createElement('style');
  s.id = 'gifSpeedCSS';
  s.textContent =
    '#gifSpeedPanel{display:flex;flex-direction:column;align-items:center;gap:9px;padding:11px 14px 10px;' +
    'background:rgba(0,0,0,0.62);backdrop-filter:blur(12px);border-radius:15px;' +
    'border:1px solid rgba(200,160,60,0.28);width:100%;box-sizing:border-box;' +
    'pointer-events:auto;position:relative;z-index:10;}' +
    '#gifSpeedPanel *{pointer-events:auto;}' +
    '#gifSpeedFileName{font-family:Cinzel,serif;font-size:9.5px;letter-spacing:1.8px;' +
    'color:rgba(200,160,60,0.65);text-transform:uppercase;text-align:center;}' +
    '#gifSpeedControls{display:flex;align-items:center;gap:8px;}' +
    '#gifSpeedControls button{background:rgba(255,255,255,0.07);border:1px solid rgba(200,160,60,0.3);' +
    'color:#fff;border-radius:8px;width:30px;height:30px;font-size:17px;cursor:pointer;' +
    'transition:background .15s,transform .1s,border-color .15s;' +
    'display:flex;align-items:center;justify-content:center;flex-shrink:0;}' +
    '#gifSpeedControls button:hover{background:rgba(200,160,60,0.22);border-color:rgba(200,160,60,0.7);transform:scale(1.1);}' +
    '#gifSpeedApply{font-size:14px!important;color:#c8a03c!important;border-color:rgba(200,160,60,0.5)!important;}' +
    '#gifSpeedInputWrap{display:flex;align-items:center;background:rgba(255,255,255,0.06);' +
    'border:1.5px solid rgba(200,160,60,0.45);border-radius:9px;padding:0 8px;gap:2px;transition:border-color .2s;}' +
    '#gifSpeedInputWrap:focus-within{border-color:rgba(200,160,60,0.9);background:rgba(200,160,60,0.08);}' +
    '#gifSpeedPrefix{font-family:Cinzel,serif;font-size:15px;font-weight:700;color:#c8a03c;' +
    'pointer-events:none;user-select:none;}' +
    '#gifSpeedInput{background:transparent;border:none;outline:none;font-family:Cinzel,serif;' +
    'font-size:17px;font-weight:700;color:#f0c84a;width:58px;text-align:center;padding:4px 2px;' +
    '-moz-appearance:textfield;}' +
    '#gifSpeedInput::-webkit-inner-spin-button,#gifSpeedInput::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}' +
    '#gifSpeedPresets{display:flex;gap:5px;flex-wrap:wrap;justify-content:center;}' +
    '.spd-preset{font-family:Cinzel,serif;font-size:10.5px;padding:3px 9px;border-radius:6px;' +
    'background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);' +
    'color:rgba(255,255,255,0.48);cursor:pointer;transition:all .15s;letter-spacing:.4px;}' +
    '.spd-preset:hover{background:rgba(200,160,60,0.12);color:#c8a03c;border-color:rgba(200,160,60,0.45);}' +
    '.spd-preset.active{background:rgba(200,160,60,0.2);border-color:rgba(200,160,60,0.75);color:#f0c84a;font-weight:700;}';
  document.head.appendChild(s);
}

/* ════════════════════════════════════════════════════════
   VIDEO MODAL (GIF + MP4)
════════════════════════════════════════════════════════ */
function _safeSrc(src) {
  return src.split('').map(function (c) {
    return c.charCodeAt(0) > 127 ? encodeURIComponent(c) : c;
  }).join('');
}
function _resolveGifSrc(src) {
  if (src.match(/^(https?:|data:|blob:)/)) return src;
  var a = document.createElement('a');
  a.href = src;
  return a.href;
}

function openVideoModal(src, pov, size) {
  var overlay = document.getElementById('videoModal');
  var badge   = document.getElementById('videoModalPov');
  var errDiv  = document.getElementById('videoModalErr');
  var errPath = document.getElementById('videoModalErrPath');
  var inner   = document.querySelector('.video-modal-inner');
  var wrap    = document.querySelector('.video-modal-wrap');
  var bar     = document.querySelector('.video-modal-bar');

  _gifReset();
  inner.querySelectorAll('#videoModalMedia,#videoModalMedia-next,canvas,.static-screen-img,#gifLoader').forEach(function (el) { el.remove(); });
  if (wrap) { wrap.style.cssText = ''; if (size) wrap.style.maxWidth = size + 'px'; }
  if (bar)  { bar.innerHTML = ''; bar.style.visibility = 'hidden'; bar.style.pointerEvents = 'auto'; }

  badge.innerHTML = pov;
  errDiv.style.display = 'none';

  var safeSrc = _safeSrc(src);
  var ext     = safeSrc.split('?')[0].split('.').pop().toLowerCase();

  if (ext === 'gif') {
    _currentSrc  = src;
    _modalOpen   = true;
    if (_isMobileDevice) {
      var imgM = document.createElement('img');
      imgM.id  = 'videoModalMedia';
      imgM.style.cssText = 'display:block;width:100%;border-radius:18px;';
      imgM.onerror = function () { errPath.textContent = safeSrc; errDiv.style.display = 'block'; };
      imgM.src = safeSrc;
      inner.insertBefore(imgM, inner.firstChild);
      overlay.classList.add('open');
      return;
    }
    _buildPanel(src);
    var absSrc = _resolveGifSrc(safeSrc);
    if (_gifCache[src]) {
      _showGif(inner, src, _gifCache[src]);
    } else {
      var loader = document.createElement('div');
      loader.id = 'gifLoader';
      loader.style.cssText =
        'color:rgba(200,160,60,0.6);font-family:Cinzel,serif;font-size:11px;' +
        'letter-spacing:3px;text-align:center;padding:48px 0;width:100%;';
      loader.textContent = 'Chargement\u2026';
      inner.insertBefore(loader, inner.firstChild);
      fetch(absSrc)
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer(); })
        .then(function (buf) {
          var l = inner.querySelector('#gifLoader');
          if (l) l.remove();
          if (!_modalOpen || _currentSrc !== src) return;
          _checkAndEvictCache();
          _gifCache[src] = buf;
          _showGif(inner, src, buf);
        })
        .catch(function () {
          var l = inner.querySelector('#gifLoader');
          if (l) l.remove();
          if (!_modalOpen || _currentSrc !== src) return;
          var imgF = document.createElement('img');
          imgF.id  = 'videoModalMedia';
          imgF.style.cssText = 'display:block;width:100%;border-radius:18px;';
          imgF.onerror = function () { errPath.textContent = safeSrc; errDiv.style.display = 'block'; };
          imgF.src = safeSrc;
          inner.insertBefore(imgF, inner.firstChild);
        });
    }
  } else {
    var video  = document.createElement('video');
    video.id   = 'videoModalMedia';
    video.autoplay   = true;
    video.loop       = true;
    video.muted      = true;
    video.playsInline = true;
    video.style.cssText = 'display:block;width:100%;min-height:100px;';
    var source = document.createElement('source');
    source.src  = safeSrc;
    source.type = 'video/' + (ext === 'webm' ? 'webm' : 'mp4');
    video.appendChild(source);
    video.onerror = function () {
      video.style.display = 'none';
      errPath.textContent  = safeSrc;
      errDiv.style.display = 'block';
    };
    inner.insertBefore(video, inner.firstChild);
  }
  overlay.classList.add('open');
}

function _showGif(inner, src, buf) {
  var url = _makeBlobUrl(buf, _currentSpd);
  var img = document.createElement('img');
  img.id  = 'videoModalMedia';
  img.style.cssText = 'display:block;width:100%;border-radius:18px;';
  img.onerror = function () { img.onerror = null; img.src = _safeSrc(src); };
  img.src = url;
  inner.insertBefore(img, inner.firstChild);
}

function closeVideoModal() {
  _gifReset();
  _revokeBlobs();
  var inner = document.querySelector('.video-modal-inner');
  if (inner) {
    inner.querySelectorAll('#videoModalMedia,#videoModalMedia-next,canvas,.static-screen-img,#gifLoader').forEach(function (el) { el.remove(); });
    inner.style.cssText = '';
  }
  var wrap  = document.querySelector('.video-modal-wrap');  if (wrap)  wrap.style.cssText  = '';
  var badge = document.getElementById('videoModalPov');     if (badge) { badge.style.cssText = ''; badge.innerHTML = ''; }
  var bar   = document.querySelector('.video-modal-bar');   if (bar)   { bar.innerHTML = ''; bar.style.visibility = ''; bar.style.pointerEvents = ''; }
  var ic    = document.getElementById('_imgModalClose');    if (ic)    ic.remove();
  document.querySelectorAll('[data-hidden-by-img]').forEach(function (b) { b.style.display = ''; delete b.dataset.hiddenByImg; });
  document.getElementById('videoModal').classList.remove('open');
}

function closeVideoModalOverlay(e) {
  if (e.target === document.getElementById('videoModal')) closeVideoModal();
}

/* ════════════════════════════════════════════════════════
   PROJETS PERSONNELS toggle
════════════════════════════════════════════════════════ */
function togglePersoProjects() {
  var grid = document.getElementById('persoGrid');
  var btn  = document.getElementById('persoTeaserBtn');
  if (!grid) return;
  var open = grid.classList.toggle('open');
  if (btn) btn.classList.toggle('open', open);
}

/* ════════════════════════════════════════════════════════
   KC VIEWER — Visionneuse clips plein écran avec navigation
════════════════════════════════════════════════════════ */
var _kcViewer = (function () {
  var _clips = [], _idx = 0, _overlay = null, _img = null, _loadingEl = null, _labelEl = null;

  function _injectStyles() {
    if (document.getElementById('kcViewerCSS')) return;
    var s = document.createElement('style');
    s.id = 'kcViewerCSS';
    s.textContent = [
      '#kcViewer{position:fixed;inset:0;z-index:9999;background:rgba(2,0,8,0.98);display:flex;flex-direction:column;align-items:center;justify-content:center;animation:kcvIn 0.2s ease;}',
      '@keyframes kcvIn{from{opacity:0}to{opacity:1}}',
      '#kcViewerHeader{position:absolute;top:0;left:0;right:0;padding:16px 28px;display:flex;align-items:center;gap:14px;background:linear-gradient(to bottom,rgba(2,0,8,1) 60%,transparent);z-index:2;}',
      '#kcViewerLogo{width:34px;height:34px;border-radius:50%;object-fit:contain;filter:drop-shadow(0 0 8px rgba(255,50,50,0.9));}',
      '#kcViewerLabel{font-family:Cinzel,serif;font-size:14px;letter-spacing:5px;color:#fff;text-transform:uppercase;flex:1;text-shadow:0 0 20px rgba(255,50,50,0.5);}',
      '#kcViewerCounter{font-family:Cinzel,serif;font-size:11px;letter-spacing:2px;color:rgba(255,100,100,0.65);}',
      '#kcViewerClose{width:36px;height:36px;background:none;border:1px solid rgba(255,60,60,0.45);color:#ff8888;font-size:17px;display:flex;align-items:center;justify-content:center;border-radius:4px;cursor:pointer;transition:all 0.2s;flex-shrink:0;}',
      '#kcViewerClose:hover{background:rgba(180,15,15,0.5);color:#fff;border-color:rgba(255,60,60,0.9);}',
      '#kcViewerBody{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:56px 72px 64px;overflow:hidden;}',
      '#kcViewerMedia{width:75vw;height:75vh;object-fit:contain;object-position:center;border-radius:18px;box-shadow:0 0 120px rgba(140,5,5,0.65),0 0 200px rgba(5,10,140,0.35),0 50px 100px rgba(0,0,0,0.9);display:block;animation:kcvImgIn 0.28s cubic-bezier(0.16,1,0.3,1);flex-shrink:0;}',
      '@keyframes kcvImgIn{from{opacity:0;transform:scale(0.92) translateY(14px)}to{opacity:1;transform:scale(1) translateY(0)}}',
      '#kcViewerLoading{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;}',
      '#kcViewerLoading .kc-spin{width:50px;height:50px;border:3px solid rgba(255,50,50,0.1);border-top-color:#ff3333;border-radius:50%;animation:kcSpin 0.7s linear infinite;}',
      '#kcViewerLoading span{font-family:Cinzel,serif;font-size:11px;letter-spacing:4px;color:rgba(255,120,120,0.5);text-transform:uppercase;}',
      '@keyframes kcSpin{to{transform:rotate(360deg)}}',
      '.kc-nav-btn{position:absolute;top:50%;transform:translateY(-50%);width:68px;height:68px;background:rgba(0,0,0,0.5);border:1px solid rgba(255,50,50,0.3);color:#ff9999;font-size:32px;display:flex;align-items:center;justify-content:center;border-radius:50%;cursor:pointer;transition:all 0.18s;z-index:3;backdrop-filter:blur(12px);}',
      '.kc-nav-btn:hover{background:rgba(180,10,10,0.55);border-color:rgba(255,60,60,0.95);color:#fff;transform:translateY(-50%) scale(1.1);}',
      '.kc-nav-btn:disabled{opacity:0.12;cursor:default;pointer-events:none;}',
      '#kcNavPrev{left:20px;}#kcNavNext{right:20px;}',
      '#kcViewerFooter{position:absolute;bottom:0;left:0;right:0;padding:14px 24px 16px;background:linear-gradient(to top,rgba(2,0,8,0.95) 60%,transparent);display:flex;justify-content:center;gap:12px;z-index:2;align-items:center;}',
      '.kc-dot{width:9px;height:9px;border-radius:50%;background:rgba(255,50,50,0.18);border:1px solid rgba(255,50,50,0.22);cursor:pointer;transition:all 0.2s;flex-shrink:0;}',
      '.kc-dot.active{background:#ff3333;box-shadow:0 0 14px rgba(255,50,50,0.95),0 0 28px rgba(255,50,50,0.4);transform:scale(1.45);}',
      '.kc-dot:hover:not(.active){background:rgba(255,50,50,0.42);}',
    ].join('');
    document.head.appendChild(s);
  }

  function open(clips, startIdx, logoSrc) {
    _clips = clips; _idx = startIdx || 0;
    _injectStyles();
    _overlay = document.createElement('div');
    _overlay.id = 'kcViewer';
    _overlay.addEventListener('click', function (e) { if (e.target === _overlay) close(); });

    var hdr     = document.createElement('div'); hdr.id = 'kcViewerHeader';
    var logo    = document.createElement('img'); logo.id = 'kcViewerLogo'; logo.src = logoSrc || ''; logo.alt = 'KC';
    _labelEl    = document.createElement('div'); _labelEl.id = 'kcViewerLabel';
    var counter = document.createElement('div'); counter.id = 'kcViewerCounter';
    var cb      = document.createElement('button'); cb.id = 'kcViewerClose'; cb.innerHTML = '&#x2715;'; cb.onclick = close;
    hdr.appendChild(logo); hdr.appendChild(_labelEl); hdr.appendChild(counter); hdr.appendChild(cb);

    var body = document.createElement('div'); body.id = 'kcViewerBody';
    _loadingEl = document.createElement('div'); _loadingEl.id = 'kcViewerLoading';
    var spin = document.createElement('div'); spin.className = 'kc-spin';
    var lt   = document.createElement('span'); lt.textContent = 'Chargement\u2026';
    _loadingEl.appendChild(spin); _loadingEl.appendChild(lt);
    body.appendChild(_loadingEl);
    _img = document.createElement('img'); _img.id = 'kcViewerMedia'; _img.style.display = 'none';
    body.appendChild(_img);
    var prev = document.createElement('button'); prev.className = 'kc-nav-btn'; prev.id = 'kcNavPrev'; prev.innerHTML = '&#x2039;'; prev.onclick = function () { _nav(-1); };
    var next = document.createElement('button'); next.className = 'kc-nav-btn'; next.id = 'kcNavNext'; next.innerHTML = '&#x203A;'; next.onclick = function () { _nav(1); };
    body.appendChild(prev); body.appendChild(next);

    var footer = document.createElement('div'); footer.id = 'kcViewerFooter';
    clips.forEach(function (_, i) {
      var dot = document.createElement('div'); dot.className = 'kc-dot'; dot.dataset.i = i;
      dot.onclick = function () { _go(parseInt(dot.dataset.i)); };
      footer.appendChild(dot);
    });

    _overlay.appendChild(hdr); _overlay.appendChild(body); _overlay.appendChild(footer);
    document.body.appendChild(_overlay);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', _onKey);
    _go(_idx);
  }

  function _onKey(e) {
    if (!_overlay) return;
    if (e.key === 'ArrowLeft')  _nav(-1);
    if (e.key === 'ArrowRight') _nav(1);
    if (e.key === 'Escape')     close();
  }
  function _nav(dir) { var n = _idx + dir; if (n < 0 || n >= _clips.length) return; _go(n); }
  function _go(i) {
    if (i < 0 || i >= _clips.length) return;
    _idx = i;
    var clip = _clips[i];
    if (_labelEl) _labelEl.textContent = clip.label || '';
    var ctr = document.getElementById('kcViewerCounter');
    if (ctr) ctr.textContent = (i + 1) + ' / ' + _clips.length;
    document.querySelectorAll('.kc-dot').forEach(function (d) { d.classList.toggle('active', parseInt(d.dataset.i) === i); });
    var p = document.getElementById('kcNavPrev'); var n = document.getElementById('kcNavNext');
    if (p) p.disabled = (i === 0); if (n) n.disabled = (i === _clips.length - 1);
    var src = _safeSrc(clip.src);
    var ext = src.split('?')[0].split('.').pop().toLowerCase();
    var body = document.getElementById('kcViewerBody');
    var oldVid = body && body.querySelector('video.kc-vid');
    if (oldVid) { oldVid.pause(); oldVid.src = ''; oldVid.remove(); }
    if (_img) _img.style.display = 'none';
    if (_loadingEl) _loadingEl.style.display = 'flex';
    if (ext === 'mp4' || ext === 'webm') {
      var vid = document.createElement('video');
      vid.className = 'kc-vid';
      vid.setAttribute('playsinline',''); vid.setAttribute('autoplay','');
      vid.setAttribute('muted',''); vid.setAttribute('loop','');
      vid.style.cssText = 'width:75vw;height:75vh;object-fit:contain;border-radius:18px;display:block;background:#000;';
      if (_loadingEl) _loadingEl.style.display = 'none';
      var src2 = document.createElement('source'); src2.src = src; src2.type = 'video/mp4';
      vid.appendChild(src2);
      if (body) body.insertBefore(vid, body.firstChild);
      vid.load(); vid.play().catch(function(){});
    } else {
      _img.onload = function () {
        if (_loadingEl) _loadingEl.style.display = 'none';
        _img.style.display = 'block';
        _img.style.animation = 'none'; void _img.offsetHeight;
        _img.style.animation = 'kcvImgIn 0.28s cubic-bezier(0.16,1,0.3,1)';
      };
      _img.onerror = function () { if (_loadingEl) _loadingEl.style.display = 'none'; };
      _img.src = src;
    }
  }
  function close() {
    if (!_overlay) return;
    document.removeEventListener('keydown', _onKey);
    _overlay.style.transition = 'opacity 0.18s ease';
    _overlay.style.opacity    = '0';
    setTimeout(function () {
      if (_overlay && _overlay.parentNode) _overlay.remove();
      _overlay = null; _img = null; _loadingEl = null; _labelEl = null;
      document.body.style.overflow = '';
    }, 200);
  }
  return { open: open, close: close };
})();

/* ════════════════════════════════════════════════════════
   EASTER EGG — KARMINE CORP (taper "lol")
════════════════════════════════════════════════════════ */
(function () {
  var seq = ['l','o','l'], ts = [], _kcActive = false, _savedCards = [];
  var KC_LOGO = 'images/icon_kc.jpeg';

  var KC_PLAYERS = [
    { name:'Canna',    role:'Top Lane',               emoji:'\uD83D\uDDE1\uFE0F', photo:'images/kc/CANNA.webp',    clips:[{src:'videos/kc/clip_kc_final.mp4',label:'Canna \uD83D\uDDE1\uFE0F'}] },
    { name:'Yike',     role:'Jungle',                 emoji:'\uD83C\uDF32',        photo:'images/kc/YIKE.webp',     clips:[] },
    { name:'Khyaehoo', role:'Mid Lane',               emoji:'\u26A1',              photo:'images/kc/KHYAEHOO.webp', clips:[] },
    { name:'Caliste',  role:'ADC \u2014 Rookie of the Year', emoji:'\uD83C\uDFF9', photo:'images/kc/CALISTE.webp',  clips:[] },
    { name:'Busio',    role:'Support',                emoji:'\uD83D\uDEE1\uFE0F', photo:'images/kc/BUSIO.jpg',     clips:[] },
  ];

  function _injectKCCSS() {
    if (document.getElementById('kcCSS')) return;
    var s = document.createElement('style'); s.id = 'kcCSS';
    s.textContent = [
      'body.kc-mode{background:#090112!important;}',
      'body.kc-mode nav{background:linear-gradient(to bottom,rgba(9,1,18,0.97),transparent)!important;}',
      'body.kc-mode .nav-logo{color:#ff3333!important;}',
      'body.kc-mode .hero-name{background:linear-gradient(135deg,#ff8888 0%,#ff3333 40%,#aa0000 70%,#ff3333 100%)!important;-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important;}',
      'body.kc-mode .hero-subtitle{color:#4488ff!important;}',
      'body.kc-mode .section-title{color:#ff3333!important;}',
      'body.kc-mode .project-card{background:rgba(20,3,3,0.95)!important;border-color:rgba(255,50,50,0.2)!important;}',
      'body.kc-mode .project-title{color:#ff3333!important;}',
      'body.kc-mode .project-btn{border-color:#cc1111!important;color:#ff3333!important;}',
      'body.kc-mode .project-btn::before{background:linear-gradient(90deg,#7B0000,#08003a)!important;}',
      'body.kc-mode .project-btn:hover{color:#fff!important;}',
      'body.kc-mode .contact-title{color:#ff3333!important;}',
      'body.kc-mode .contact-link{border-color:#cc1111!important;color:#ff3333!important;}',
      '.kc-visual-replace{position:absolute;inset:0;z-index:5;background:linear-gradient(135deg,#6B0000 0%,#0a0a2e 60%,#12003a 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;}',
      '.kc-main-logo{width:130px;height:130px;object-fit:contain;border-radius:50%;filter:drop-shadow(0 0 20px rgba(255,40,40,1)) drop-shadow(0 0 40px rgba(30,50,255,0.9));animation:kcPulse 2.4s ease-in-out infinite;}',
      '.kc-main-label{font-family:Cinzel,serif;font-size:11px;letter-spacing:5px;color:rgba(255,200,200,0.8);text-transform:uppercase;}',
      '.kc-badge{position:absolute;top:10px;right:10px;z-index:10;font-family:Cinzel,serif;font-size:8px;letter-spacing:2px;background:rgba(120,5,5,0.95);border:1px solid rgba(255,60,60,0.8);color:#fff;padding:4px 10px;border-radius:3px;text-transform:uppercase;}',
      '.kc-card{background:linear-gradient(160deg,rgba(70,3,3,0.7),rgba(3,3,35,0.85))!important;border-color:rgba(200,15,15,0.85)!important;}',
      '.kc-btn{border-color:rgba(255,50,50,0.85)!important;color:#ff7070!important;}',
      '.kc-btn:hover{color:#fff!important;}',
      '.kc-btn::before{background:linear-gradient(90deg,#7B0000,#08003a)!important;}',
      '.kc-grid-mode{display:flex!important;justify-content:center!important;}',
      '#kcGallery{position:fixed;inset:0;z-index:6000;background:rgba(2,0,8,0.98);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:0;overflow-y:auto;}',
      '.kc-gal-hdr{display:flex;align-items:center;gap:16px;padding:24px 40px 20px;width:100%;max-width:2200px;align-self:center;flex-shrink:0;}',
      '.kc-gal-hdr-logo{width:44px;height:44px;object-fit:contain;border-radius:50%;filter:drop-shadow(0 0 10px rgba(255,50,50,0.9));}',
      '.kc-gal-hdr-title{font-family:Cinzel,serif;font-size:18px;letter-spacing:5px;color:#fff;text-transform:uppercase;flex:1;}',
      '.kc-gal-close{width:40px;height:40px;background:none;border:1px solid rgba(255,70,70,0.42);color:#ff8888;font-size:18px;display:flex;align-items:center;justify-content:center;border-radius:4px;cursor:pointer;}',
      '.kc-players-grid{display:flex;gap:24px;padding:16px 48px 64px;width:100%;max-width:2200px;align-self:center;justify-content:center;flex-wrap:wrap;}',
      '.kc-player-card{position:relative;flex:1;min-width:280px;max-width:400px;border-radius:16px;overflow:hidden;border:1px solid rgba(255,50,50,0.18);background:linear-gradient(160deg,rgba(50,3,3,0.92),rgba(3,3,25,0.96));cursor:pointer;transition:transform 0.28s,border-color 0.25s,box-shadow 0.28s;aspect-ratio:3/4;}',
      '.kc-player-card:hover{transform:translateY(-12px) scale(1.04);border-color:rgba(255,50,50,0.9);}',
      '.kc-player-photo{width:100%;height:100%;object-fit:cover;object-position:center 15%;display:block;}',
      '.kc-player-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(2,0,8,0.96) 0%,rgba(2,0,8,0.38) 42%,transparent 68%);pointer-events:none;}',
      '.kc-player-info{position:absolute;bottom:0;left:0;right:0;padding:22px 18px 18px;pointer-events:none;}',
      '.kc-player-role{font-family:Cinzel,serif;font-size:11px;letter-spacing:3px;color:rgba(68,136,255,0.85);text-transform:uppercase;margin-bottom:5px;display:block;}',
      '.kc-player-name{font-family:Cinzel,serif;font-size:26px;font-weight:700;letter-spacing:2px;color:#fff;display:block;}',
      '.kc-player-nophoto{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:68px;background:linear-gradient(135deg,#280808,#081030);}',
      '#kcToast{position:fixed;bottom:40px;left:50%;transform:translateX(-50%) translateY(24px);background:linear-gradient(135deg,rgba(110,6,6,0.97),rgba(6,14,65,0.97));border:1px solid rgba(255,70,70,0.78);color:#fff;font-family:Cinzel,serif;font-size:13px;letter-spacing:4px;padding:20px 44px 16px;z-index:99999;pointer-events:none;opacity:0;transition:opacity .45s,transform .45s;text-align:center;border-radius:6px;}',
      '#kcToast .kt-logo{display:block;width:44px;height:44px;object-fit:contain;margin:0 auto 10px;border-radius:50%;}',
      '#kcToast .kt-sub{display:block;font-size:10px;letter-spacing:3px;opacity:0.65;margin-top:6px;color:#ffaaaa;}',
      '.kc-banner-wrap{width:100%;max-width:2200px;align-self:center;padding:0 48px 48px;}',
      '.kc-banner-img{width:100%;height:auto;display:block;border-radius:14px;border:1px solid rgba(255,50,50,0.18);}',
      '@keyframes kcPulse{0%,100%{transform:scale(1) rotate(0deg);}50%{transform:scale(1.1) rotate(3deg);}}',
    ].join('');
    document.head.appendChild(s);
  }

  function _on()  { document.body.classList.add('kc-mode'); }
  function _off() { document.body.classList.remove('kc-mode'); }

  function _activate() {
    _injectKCCSS(); _on(); _savedCards = [];
    var allCards = Array.from(document.querySelectorAll('#projects .project-card')).filter(function (c) { return !c.classList.contains('perso-card'); });
    if (!allCards.length) return;
    allCards.forEach(function (card, idx) {
      var vis = card.querySelector('.project-visual'); if (!vis) return;
      var imgs = [];
      vis.querySelectorAll('img').forEach(function (img) { imgs.push({ alt:img.alt||'', src:img.src, ds:img.dataset.src||'' }); });
      _savedCards.push({
        card:card, display:card.style.display||'',
        visNodes:Array.from(vis.childNodes).map(function(n){return n.cloneNode(true);}),
        type:(card.querySelector('.project-type')||{}).textContent||'',
        title:(card.querySelector('.project-title')||{}).textContent||'',
        desc:(card.querySelector('.project-desc')||{}).textContent||'',
        btnHTML:(card.querySelector('.project-btn')||{}).outerHTML||'',
        imgs:imgs,
      });
      if (idx >= 1) { card.style.display = 'none'; return; }
      vis.style.position = 'relative';
      while (vis.firstChild) vis.removeChild(vis.firstChild);
      var ov  = document.createElement('div'); ov.className = 'kc-visual-replace';
      var lg  = document.createElement('img'); lg.className = 'kc-main-logo'; lg.src = KC_LOGO; lg.alt = 'Karmine Corp';
      var lbl = document.createElement('div'); lbl.className = 'kc-main-label'; lbl.textContent = 'Karmine Corp';
      ov.appendChild(lg); ov.appendChild(lbl); vis.appendChild(ov);
      var bdg = document.createElement('div'); bdg.className = 'kc-badge'; bdg.textContent = 'LOL MODE'; vis.appendChild(bdg);
      if (card.querySelector('.project-type'))  card.querySelector('.project-type').textContent  = 'Esport \u2014 LEC / LFL';
      if (card.querySelector('.project-title')) card.querySelector('.project-title').textContent = 'Karmine Corp';
      if (card.querySelector('.project-desc'))  card.querySelector('.project-desc').textContent  = 'ALLEZ LES BLEUS ! La meilleure \u00e9quipe de League of Legends.';
      var oldBtn = card.querySelector('.project-btn');
      if (oldBtn) {
        var nb = document.createElement('button'); nb.className = 'project-btn kc-btn';
        nb.innerHTML = '<span>\uD83D\uDC65 Voir les joueurs</span>'; nb.onclick = _openGallery;
        oldBtn.replaceWith(nb);
      }
      card.classList.add('kc-card');
    });
    var grid = document.querySelector('#projects .projects-grid');
    if (grid) grid.classList.add('kc-grid-mode');
    document.documentElement.classList.add('custom-cursor');
    _kcActive = true; _showToast(true);
  }

  function _deactivate() {
    _kcActive = false;
    document.documentElement.classList.remove('custom-cursor');
    _off();
    _kcViewer.close();
    var g = document.getElementById('kcGallery'); if (g) g.remove();
    var grid = document.querySelector('#projects .projects-grid'); if (grid) grid.classList.remove('kc-grid-mode');
    _savedCards.forEach(function (saved) {
      var card = saved.card; card.style.display = saved.display;
      var vis  = card.querySelector('.project-visual');
      if (vis) {
        while (vis.firstChild) vis.removeChild(vis.firstChild);
        saved.visNodes.forEach(function (n) { vis.appendChild(n.cloneNode(true)); });
        saved.imgs.forEach(function (info) {
          vis.querySelectorAll('img').forEach(function (img) {
            if (img.alt === info.alt) { img.src = info.src; if (info.ds) img.dataset.src = info.ds; }
          });
        });
      }
      if (card.querySelector('.project-type'))  card.querySelector('.project-type').textContent  = saved.type;
      if (card.querySelector('.project-title')) card.querySelector('.project-title').textContent = saved.title;
      if (card.querySelector('.project-desc'))  card.querySelector('.project-desc').textContent  = saved.desc;
      var btn = card.querySelector('.project-btn'); if (btn && saved.btnHTML) btn.outerHTML = saved.btnHTML;
      card.classList.remove('kc-card');
    });
    _savedCards = []; document.body.style.overflow = ''; _showToast(false);
  }

  function _openGallery() {
    var old = document.getElementById('kcGallery'); if (old) old.remove();
    var overlay = document.createElement('div'); overlay.id = 'kcGallery';
    var hdr     = document.createElement('div'); hdr.className = 'kc-gal-hdr';
    var hlogo   = document.createElement('img'); hlogo.className = 'kc-gal-hdr-logo'; hlogo.src = KC_LOGO; hlogo.alt = 'KC';
    var htitle  = document.createElement('div'); htitle.className = 'kc-gal-hdr-title'; htitle.textContent = '\uD83C\uDFC6 Karmine Corp \u2014 Roster 2026';
    var hclose  = document.createElement('button'); hclose.className = 'kc-gal-close'; hclose.innerHTML = '&#x2715;';
    hclose.onclick = function () { overlay.remove(); document.body.style.overflow = ''; };
    hdr.appendChild(hlogo); hdr.appendChild(htitle); hdr.appendChild(hclose);
    var grd = document.createElement('div'); grd.className = 'kc-players-grid';
    KC_PLAYERS.forEach(function (player) {
      var card  = document.createElement('div'); card.className = 'kc-player-card';
      var photo = document.createElement('img'); photo.className = 'kc-player-photo'; photo.src = player.photo || ''; photo.alt = player.name; photo.loading = 'eager';
      photo.onerror = function () {
        photo.style.display = 'none';
        var fb = document.createElement('div'); fb.className = 'kc-player-nophoto'; fb.textContent = player.emoji;
        card.insertBefore(fb, photo);
      };
      card.appendChild(photo);
      var ov   = document.createElement('div'); ov.className = 'kc-player-overlay'; card.appendChild(ov);
      var info = document.createElement('div'); info.className = 'kc-player-info';
      var role = document.createElement('span'); role.className = 'kc-player-role'; role.textContent = player.role;
      var name = document.createElement('span'); name.className = 'kc-player-name'; name.textContent = player.name;
      info.appendChild(role); info.appendChild(name); card.appendChild(info);
      card.onclick = function () {
        if (!player.clips || !player.clips.length) { _toastMsg('Clips bient\u00f4t disponibles !'); return; }
        _kcViewer.open(player.clips, 0, KC_LOGO);
      };
      grd.appendChild(card);
    });
    var bannerWrap = document.createElement('div'); bannerWrap.className = 'kc-banner-wrap';
    var bannerImg  = document.createElement('img'); bannerImg.className = 'kc-banner-img';
    bannerImg.src = 'images/kc/Brand-Banner-Karmine-Corp-V3.webp'; bannerImg.loading = 'eager'; bannerImg.alt = 'Karmine Corp Banner';
    bannerImg.onerror = function () { bannerWrap.style.display = 'none'; };
    bannerWrap.appendChild(bannerImg);
    overlay.appendChild(hdr); overlay.appendChild(grd); overlay.appendChild(bannerWrap);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) { overlay.remove(); document.body.style.overflow = ''; } });
    document.body.appendChild(overlay); document.body.style.overflow = 'hidden';
  }

  function _toastMsg(msg) {
    var old = document.getElementById('kcMsgToast'); if (old) old.remove();
    var t = document.createElement('div'); t.id = 'kcMsgToast'; t.textContent = msg;
    t.style.cssText =
      'position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(12px);' +
      'background:rgba(100,5,5,0.92);border:1px solid rgba(255,60,60,0.55);color:#ffaaaa;' +
      'font-family:Cinzel,serif;font-size:11px;letter-spacing:3px;padding:10px 24px;' +
      'border-radius:20px;z-index:9999999;pointer-events:none;opacity:0;transition:opacity .2s,transform .2s;white-space:nowrap;';
    document.body.appendChild(t);
    requestAnimationFrame(function () { requestAnimationFrame(function () { t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)'; }); });
    setTimeout(function () { t.style.opacity='0'; setTimeout(function(){if(t.parentNode)t.remove();},250); }, 2200);
  }

  function _showToast(on) {
    var old = document.getElementById('kcToast'); if (old) old.remove();
    var t = document.createElement('div'); t.id = 'kcToast';
    t.innerHTML =
      '<img class="kt-logo" src="' + KC_LOGO + '" alt="KC">' +
      (on ? '\uD83C\uDFC6 KARMINE CORP MODE' : '\uD83D\uDC4B MODE KC D\u00c9SACTIV\u00c9') +
      '<span class="kt-sub">' + (on ? 'ALLEZ LES BLEUS !' : '\u00c0 bient\u00f4t sur la Rift') + '</span>';
    document.body.appendChild(t);
    requestAnimationFrame(function () { requestAnimationFrame(function () { t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)'; }); });
    setTimeout(function () { t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(24px)'; setTimeout(function(){if(t.parentNode)t.remove();},450); }, 3800);
  }

  document.addEventListener('keydown', function (e) {
    var key = e.key.toLowerCase();
    if (key === seq[ts.length]) {
      var now = Date.now();
      if (ts.length > 0 && now - ts[0] > 5000) { ts = []; if (key === seq[0]) ts.push(now); return; }
      ts.push(now);
      if (ts.length === seq.length) { ts = []; if (_kcActive) _deactivate(); else _activate(); }
    } else { ts = (key === seq[0]) ? [Date.now()] : []; }
  });
})();

/* ════════════════════════════════════════════════════════
   ÉCHAP — ferme tout
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
   PERFORMANCES — Lazy load images + préchargement GIFs
════════════════════════════════════════════════════════ */
(function () {
  var isMobile = _isMobileDevice;
  if (isMobile) { var hg = document.querySelector('.hero-grid'); if (hg) hg.style.display = 'none'; }
  var BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  function loadImg(img) { if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; } }

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { loadImg(e.target); obs.unobserve(e.target); }
      });
    }, { rootMargin: '300px' });
    document.querySelectorAll('img').forEach(function (img) {
      if (img.closest('#hero')) return;
      if (img.classList.contains('kc-player-photo')) return;
      if (!img.src || img.src === BLANK || img.src.startsWith('data:')) return;
      img.dataset.src = img.src; img.src = BLANK; img.decoding = 'async'; img.loading = 'lazy';
      obs.observe(img);
    });
    document.querySelectorAll('img[data-src]').forEach(function (img) { obs.observe(img); });
    requestAnimationFrame(function () {
      document.querySelectorAll('img[data-src]').forEach(function (img) {
        var r = img.getBoundingClientRect();
        if (r.top < window.innerHeight + 400) { loadImg(img); obs.unobserve(img); }
      });
    });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        document.querySelectorAll('img[data-src]').forEach(function (img) {
          var r = img.getBoundingClientRect();
          if (r.top < window.innerHeight + 400) { loadImg(img); obs.unobserve(img); }
        });
      }
    });
  } else {
    document.querySelectorAll('img[data-src]').forEach(function (img) { loadImg(img); });
  }

  /* Lazy load dans les modals */
  function loadLazy(el) { if (!el) return; el.querySelectorAll('img[data-src]').forEach(function (img) { loadImg(img); }); }
  var _om = window.openModal;
  window.openModal = function (id) { loadLazy(document.getElementById('modal-' + id)); if (typeof _om === 'function') _om(id); };
  var _osm = window.openSubModal;
  window.openSubModal = function (id) { loadLazy(document.getElementById(id)); if (typeof _osm === 'function') _osm(id); };

  /* Touch passif */
  document.addEventListener('touchstart', function () {}, { passive: true });
  document.addEventListener('touchmove',  function () {}, { passive: true });

  /* Styles allégés mobile */
  if (isMobile) {
    var st = document.createElement('style');
    st.textContent =
      '.about-glow{display:none!important}.hero-grid{display:none!important}' +
      '.scroll-indicator{animation:none!important;opacity:.25!important}' +
      '.project-visual img{animation:logoMobile 5s ease-in-out infinite!important;filter:none!important}';
    document.head.appendChild(st);
  }

  /* Préchargement GIFs desktop uniquement */
  if (!isMobile) {
    var GIF_SRCS = [
      'videos/inscription.gif', 'videos/accept_inscription.gif',
      'videos/creation_conversation_membre.gif', 'videos/creation_de_groupe.gif',
      'videos/test_message_tempsréel.gif', 'videos/test_notif.gif',
      'videos/test_message_accueil.gif', 'videos/test_group_et_conversation.gif',
      'videos/test_fond_ecran.gif', 'videos/test_sondage.gif', 'videos/test_role_suppresion.gif',
    ];
    function prefetchNext(idx) {
      if (idx >= GIF_SRCS.length) return;
      var src = GIF_SRCS[idx];
      if (_gifCache[src]) { prefetchNext(idx + 1); return; }
      var a = document.createElement('a'); a.href = src;
      fetch(a.href)
        .then(function (r) { return r.ok ? r.arrayBuffer() : Promise.reject(); })
        .then(function (buf) { _checkAndEvictCache(); _gifCache[src] = buf; setTimeout(function () { prefetchNext(idx + 1); }, 500); })
        .catch(function () { setTimeout(function () { prefetchNext(idx + 1); }, 500); });
    }
    window.addEventListener('load', function () { setTimeout(function () { prefetchNext(0); }, 4000); });
  }
})();

/* ════════════════════════════════════════════════════════
   TRADUCTIONS (i18n)
════════════════════════════════════════════════════════ */
var TRANSLATIONS = {
  fr: {
    "nav.about":"A propos","nav.timeline":"Parcours","nav.skills":"Competences",
    "nav.projects":"Projets","nav.ap":"Projet AP","nav.contact":"Contact",
    "hero.subtitle":"Etudiant","hero.cta1":"Voir mes projets",
    "hero.cta2":"&#x2B07; Telecharger CV","hero.scroll":"Defiler",
    "btn.animOff":"Anims ON","btn.animOn":"Anims OFF","btn.open":"&#x2756; Ouvrir",
    "about.title":"A propos","about.flipHint":"&#x2756; Cliquer pour decouvrir &#x2756;",
    "about.text1":"Bonjour, je m'appelle Corentin, je vais vous expliquer mon parcours et comment je me suis retrouve a faire un BTS informatique alors qu'a la base j'etais en Bac Pro MELEC.",
    "about.text2":"J'ai fait mon Bac Pro Metiers de l'Electricite et de ses Environnements Connectes, et au bout de deux ans j'ai realise que ca ne me correspondait plus. Donc j'ai decide de me reorienter vers l'informatique, j'ai integre un BTS SIO option SLAM et franchement des le debut j'ai retrouve l'envie. Aujourd'hui je developpe des applications mobiles et web, j'ai meme publie une appli sur le Play Store durant mon stage.",
    "about.projects":"Projets","about.apps":"Apps Play Store",
    "timeline.title":"Parcours",
    "tl1.title":"BTS SIO — 2eme annee","tl1.sub":"Option SLAM",
    "tl1.desc":"Approfondissement des competences, realisation de projets concrets dont Animal'and publie sur le Play Store.",
    "tl1.badge":"&#x2756; En cours",
    "tl2.title":"BTS SIO — 1ere annee","tl2.sub":"Option SLAM",
    "tl2.desc":"Apprentissage des fondamentaux du developpement web et mobile. Premiers projets Flutter, PHP et MySQL.",
    "tl2.badge":"Valide",
    "tl3.title":"Lycee","tl3.sub":"Bac Pro MELEC",
    "tl3.desc":"Obtention du Bac Pro Metiers de l'Electricite et de ses Environnements Connectes.",
    "tl3.badge":"Diplome",
    "skills.title":"Competences",
    "skill1.name":"Developpement",
    "skill2.name":"Donnees","skill2.tag4":"Modelisation BDD","skill2.tag5":"SQL avance",
    "skill3.name":"Outils &amp; Methodes","skill3.tag4":"Methode Agile","skill3.tag5":"Tests &amp; Recette",
    "skill4.name":"Bloc 1 — Support","skill4.tag1":"Gestion patrimoine","skill4.tag2":"Support &amp; incidents","skill4.tag3":"Deploiement service","skill4.tag4":"Mode projet","skill4.tag5":"Veille techno",
    "skill5.name":"Bloc 2 — SLAM","skill5.tag1":"Conception applicative","skill5.tag2":"Maintenance corrective","skill5.tag3":"Maintenance evolutive","skill5.tag4":"Architecture logicielle","skill5.tag5":"UML / Modelisation",
    "skill6.name":"Bloc 3 — Cybersecurite","skill6.tag1":"RGPD / CNIL","skill6.tag2":"Gestion des acces","skill6.tag3":"Securite applicative","skill6.tag4":"Analyse logs","skill6.tag5":"Prevention attaques",
    "projects.title":"Projets","projects.personal":"Voir mes projets personnels",
    "p1.type":"Application Mobile — Chat Temps Reel",
    "p1.desc":"Application de messagerie instantanee Flutter avec chat en temps reel, notifications push et panel administrateur.",
    "p2.type":"Application Mobile","p2.type2":"Application Mobile — Boutique Privee",
    "p2.desc":"Application compagnon d'Animal'and dediee a la gestion des equipements et accessoires pour animaux.",
    "p3.type":"Projet Web — Personnel",
    "p3.desc":"Projet web autour de l'univers de League of Legends avec affichage de donnees et design immersif.",
    "modal.clickHint":"&#x2756; Cliquer sur une fonctionnalite pour en savoir plus",
    "submodal.feature":"Fonctionnalite",
    "m1.desc":"Animal'and Chat est une application mobile de messagerie instantanee developpee avec Flutter. Le backend est deploye sur un serveur OVH via <strong>Termius SSH</strong>, la base de donnees est PostgreSQL, et les notifications sont gerees par Firebase Messaging.",
    "f1.title":"&#x1F511; Inscription &amp; Acces","f1.preview":"Validation manuelle des comptes par un administrateur avant acces.",
    "f1.desc":"L'acces a l'application n'est pas ouvert a tous. Chaque nouvelle inscription passe par un processus de validation avant que l'utilisateur puisse se connecter.",
    "f1.s1":"L'utilisateur remplit un formulaire d'inscription avec ses informations (nom, email, mot de passe).<br><span class=\"step-play-hint\">Voir la demo</span>",
    "f1.s2":"La demande est enregistree en base PostgreSQL avec le statut <strong>« en attente »</strong>. L'acces est bloque jusqu'a validation.<br><span class=\"step-play-hint\">Voir le screen</span>",
    "f1.s3":"Un administrateur recoit la demande dans son panel et peut <strong>accepter ou refuser</strong> le compte.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "f1.s4":"Une fois accepte, l'utilisateur peut se connecter et <strong>creer des conversations</strong> avec d'autres membres.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "f1.s5":"La creation de <strong>groupes</strong> est reservee aux administrateurs uniquement.<br><span class=\"step-play-hint\">Voir le screen</span>",
    "f2.title":"&#x1F4AC; Chat en temps reel","f2.preview":"Messages instantanes dans les salons grace a Socket.io, avec horodatage.",
    "f3.title":"&#x1F514; Notifications push","f3.preview":"Firebase Messaging envoie des alertes meme quand l'app est fermee.",
    "f4.title":"&#x1F43E; Conversations &amp; Groupes","f4.preview":"Les utilisateurs creent des conversations, seuls les admins peuvent creer des groupes.",
    "f5.title":"&#x1F4CA; Sondages","f5.preview":"Creation de sondages dans les salons, resultats mis a jour en temps reel.",
    "f6.title":"&#x1F3A8; Personnalisation","f6.preview":"Fond d'ecran personnalisable par l'utilisateur selon ses preferences.",
    "f7.title":"&#x1F6E1;&#xFE0F; Panel administrateur","f7.preview":"Gestion complete des comptes : roles, bans, suppressions, inscriptions.",
    "f8.title":"&#x1F5C4;&#xFE0F; Base de donnees","f8.preview":"PostgreSQL sur OVH, deploye via Termius SSH.",
    "m2.desc":"Animal'vest est la boutique privee de l'association, reservee a ses membres.",
    "v1.title":"&#x1F510; Acces membres uniquement","v1.preview":"Connexion sans identifiants via un compte temporaire supprime a la deconnexion.",
    "v2.title":"&#x1F6CD;&#xFE0F; Catalogue de produits","v2.preview":"Consultation des articles avec photos, descriptions, prix et selection de taille.",
    "v3.title":"&#x1F5BC;&#xFE0F; Galerie multi-photos","v3.preview":"Jusqu'a 8 photos par produit avec carousel, zoom plein ecran et visionneuse.",
    "v4.title":"&#x1F4CB; Categories &amp; Unites","v4.preview":"Grille d'unites sur l'accueil, chacune liee a des categories de la boutique.",
    "v5.title":"&#x1F6D2; Panier &amp; Commandes","v5.preview":"Ajout au panier, formulaire de livraison et suivi de l'etat de la commande.",
    "v6.title":"&#x1F6E1;&#xFE0F; Panel administrateur","v6.preview":"Gestion des produits, des stocks, des commandes et suivi avec notes internes.",
    "v7.title":"&#x1F4E6; Numero de colis obligatoire","v7.preview":"L'expedition est bloquee tant qu'un numero de colis valide (8 chiffres) n'est pas saisi.",
    "v8.title":"&#x1F514; Notifications push","v8.preview":"L'admin est alerte en temps reel des qu'une nouvelle commande est passee.",
    "v9.title":"&#x2709;&#xFE0F; Emails automatiques","v9.preview":"Un email est envoye au membre a chaque changement de statut de sa commande.",
    "v10.title":"&#x1F512; Securite &amp; Mot de passe","v10.preview":"Politique commune avec indicateur de force, formatters et rate limiter anti-abus.",
    "v11.title":"&#x1F5C4;&#xFE0F; Base de donnees","v11.preview":"Flutter, Firebase pour les notifs et PostgreSQL/MySQL pour les donnees.",
    "gsb1.type":"Application Windows — GSB Mission 1","gsb1.mTitle":"GSB Gestion des Conges",
    "gsb1.desc":"Application C# Windows developpee dans le cadre du projet AP GSB. Elle permet aux praticiens de soumettre des demandes de conges et au responsable RH de les valider ou refuser, avec gestion automatique des soldes et notifications a la connexion.",
    "gsb2.type":"Application Mobile — GSB Mission 5","gsb2.mTitle":"GSB Notes Praticiens",
    "g1.title":"&#x1F511; Connexion &amp; Comptes","g1.preview":"Deux comptes distincts : praticien et responsable RH avec acces differencies.",
    "g2.title":"&#x1F4C5; Demande de conges","g2.preview":"Formulaire de saisie avec selection des dates et verification automatique du solde.",
    "g3.title":"&#x1F6E1;&#xFE0F; Panel RH","g3.preview":"Liste des demandes en attente, consultation et decision d'acceptation ou de refus.",
    "g4.title":"&#x1F514; Notifications a la connexion","g4.preview":"Le praticien est notifie de l'etat de ses demandes des la connexion.",
    "g5.title":"&#x1F5C4;&#xFE0F; Base de donnees","g5.preview":"API REST Laravel, base MySQL, consommee par l'application C# Windows.",
    "ap.title":"Projet AP",
    "ap.gsb1desc":"Application C# Windows permettant aux praticiens de faire des demandes de conges et au responsable RH de les accepter ou refuser. Gestion des soldes, notifications et panel administrateur.",
    "ap.gsb2desc":"Application Flutter affichant les notes des praticiens GSB. Deux types d'evaluateurs (client et expert), classement par note, detail avec commentaires. En cours de developpement.",
    "ap.inprogress":"&#x23F3; En cours",
    "lol.desc":"Projet web immersif inspire de l'univers de League of Legends. Affichage de donnees de jeu, design thematique et integration d'une base de donnees pour gerer les champions et statistiques.",
    "lol.features":"Fonctionnalites","lol.f1":"Affichage et recherche de champions",
    "lol.f2":"Base de donnees MySQL des personnages","lol.f3":"Design thematique inspire du jeu",
    "lol.f4":"Interface web responsive en PHP/HTML/CSS",
    "contact.title":"Me contacter",
    "contact.text":"\"Chaque grand voyage commence par un premier message.\"<br>Discutons de ton prochain projet.",
    "contact.email":"&#x2709; Email","contact.linkedin":"&#x25C8; LinkedIn","contact.cv":"&#x2B07; CV PDF",
    "footer.text":"&#169; 2026 Corentin Mesure — BTS SIO SLAM",
    "video.notfound":"Fichier introuvable :",
    "v1.desc":"Animal'vest utilise un systeme d'acces unique : les membres se connectent sans identifiants grace a un <strong>compte temporaire genere automatiquement</strong>.",
    "v1.s1":"Quand un membre ouvre l'application, un <strong>compte temporaire est genere automatiquement</strong>.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "v1.s2":"Des que le membre <strong>ferme l'application</strong>, le compte temporaire est <strong>supprime automatiquement</strong>.<br><span class=\"step-play-hint\">Voir le log</span>",
    "v1.s3":"Si l'application reste ouverte, le compte est <strong>supprime au bout de 24h</strong>.<br><span class=\"step-play-hint\">Voir le log</span>",
    "v1.s4":"Seules l'email, l'adresse postale et le telephone sont conserves, <strong>supprimes au bout de 6 mois</strong>.",
    "v1.s5":"<strong>Seul l'administrateur</strong> dispose d'un compte permanent avec identifiants.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "v2.desc":"Les membres accedent a un catalogue complet des articles proposes, avec filtrage par categorie et selection de taille.",
    "v2.s1":"La boutique affiche les <strong>produits disponibles</strong> en grille 2 colonnes.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "v2.s2":"Un <strong>carousel de categories</strong> permet de filtrer les produits instantanement.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "v2.s3":"Chaque article possede une <strong>fiche detaillee</strong> avec tailles vetements (XS–XXL) et chaussures (37–45).",
    "v3.desc":"Chaque produit peut disposer de plusieurs photos pour mieux presenter l'article sous tous ses angles.",
    "v3.s1":"L'administrateur peut ajouter <strong>jusqu'a 8 photos</strong> par produit.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "v3.s2":"Chaque carte produit affiche un <strong>mini-carousel</strong> avec indicateurs et compteur <strong>X/Y</strong>.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "v3.s3":"Un tap sur l'image ouvre une <strong>visionneuse plein ecran</strong>.",
    "v4.desc":"L'ecran d'accueil affiche une grille d'unites representant les differents groupes de l'association.",
    "v4.s1":"La page d'accueil presente une <strong>grille d'unites en 2 colonnes</strong>.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "v4.s2":"Taper une categorie <strong>redirige directement</strong> vers la boutique filtree.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "v4.s3":"Les admins voient un bouton <strong>···</strong> pour gerer les unites.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "v5.desc":"Les membres peuvent composer leur panier et passer commande en renseignant leurs informations de livraison.",
    "v5.s1":"Le membre ajoute les articles a son <strong>panier</strong>.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "v5.s2":"En validant, un <strong>formulaire de commande</strong> s'ouvre.",
    "v5.s3":"Le membre recoit un <strong>email automatique a chaque changement de statut</strong>.<br><span class=\"step-play-hint\">Voir les emails</span>",
    "v6.desc":"L'administrateur dispose d'un espace complet pour gerer la boutique, les commandes et les membres.",
    "v6.s1":"<strong>Statistiques en temps reel.</strong><br><span class=\"step-play-hint\">Voir le screen</span>",
    "v6.s2":"<strong>Suivi des commandes :</strong> liste filtrable avec fiche client.<br><span class=\"step-play-hint\">Voir le screen</span>",
    "v6.s3":"<strong>Traitement manuel :</strong> changement de statut et ajout d'une <strong>note interne</strong>.",
    "v6.s4":"<strong>Gestion des admins.</strong><br><span class=\"step-play-hint\">Voir le screen</span>",
    "v6.s5":"<strong>Creation de compte admin.</strong><br><span class=\"step-play-hint\">Voir le screen</span>",
    "v7.desc":"Le passage au statut 'expediee' est bloque tant qu'un numero de colis valide n'est pas saisi.",
    "v7.s1":"Le bouton reste <strong>grise et bloque</strong> tant que le numero n'est pas valide.",
    "v7.s2":"Le numero doit contenir <strong>exactement 8 chiffres</strong>.",
    "v7.s3":"Un indicateur affiche le <strong>nombre de chiffres restants</strong> en temps reel.",
    "v7.s4":"Le numero est <strong>enregistre avec la commande</strong> et un email de suivi est automatiquement envoye.",
    "v8.desc":"Firebase Cloud Messaging alerte l'administrateur en temps reel.",
    "v8.s1":"Des qu'un membre valide une commande, une <strong>notification push FCM</strong> est envoyee a l'administrateur.",
    "v8.s2":"La notification est recue <strong>meme si l'app est fermee</strong>.",
    "v8.s3":"Un tap <strong>ouvre directement</strong> le detail de la commande.",
    "v9.desc":"A chaque etape du traitement de sa commande, le membre recoit automatiquement un email de suivi.",
    "v9.s1":"Commande <strong>confirmee</strong> : email de recapitulatif.",
    "v9.s2":"Statut <em style=\"color:var(--cyan)\">\"traitee\"</em> : email en cours de preparation.",
    "v9.s3":"Statut <em style=\"color:var(--cyan)\">\"expediee\"</em> : email avec le <strong>numero de colis</strong>.",
    "v9.s4":"Statut <em style=\"color:var(--cyan)\">\"livree\"</em> : email de <strong>confirmation</strong>.",
    "v9.s5":"L'envoi est declenche <strong>cote serveur</strong>.",
    "v10.desc":"L'application integre plusieurs mecanismes de securite.",
    "v10.s1":"<strong>Politique commune :</strong> minimum 8 caracteres, majuscule, chiffre, caractere special.",
    "v10.s2":"<strong>Indicateur de force en temps reel.</strong>",
    "v10.s3":"<strong>Formatters de saisie.</strong>",
    "v10.s4":"<strong>Rate limiter :</strong> 5 tentatives max en 2 minutes.",
    "v10.s5":"<strong>FlutterSecureStorage</strong> pour les tokens JWT.",
    "v11.desc":"Architecture Flutter, base relationnelle, Firebase pour les notifications.",
    "v11.s1":"<strong>Flutter / Dart</strong> pour l'interface mobile.",
    "v11.s2":"<strong>MySQL / PostgreSQL</strong> stocke produits, membres, commandes.",
    "v11.s3":"<strong>Firebase</strong> pour les <strong>notifications push (FCM)</strong>.",
    "v11.s4":"Totalement independante d'Animal'and Chat.",
    "v11.s5":"Singleton <strong>ApiService</strong> avec injection automatique du token JWT.",
    "g1.desc":"L'application propose deux types de comptes avec des interfaces et des droits distincts selon le role.",
    "g1.s1":"Deux roles : <strong>Praticien</strong> et <strong>Responsable RH</strong>.<br><span class=\"step-play-hint\">Voir le schema</span>",
    "g1.s2":"Le <strong>compte praticien</strong> donne acces au formulaire de demande et a l'historique.",
    "g1.s3":"Le <strong>compte RH</strong> donne acces a la liste complete des demandes.",
    "g2.desc":"Le praticien peut soumettre une demande de conges. L'application verifie automatiquement son solde avant d'autoriser la demande.",
    "g2.s1":"Selection de la <strong>date de debut</strong> et <strong>date de fin</strong>.<br><span class=\"step-play-hint\">Voir le screen</span>",
    "g2.s2":"Le solde disponible s'affiche en cliquant sur <strong>\"Voir mes jours restants\"</strong>.<br><span class=\"step-play-hint\">Voir le screen</span>",
    "g2.s3":"Si le solde est suffisant, la demande est <strong>soumise et enregistree</strong> en base.<br><span class=\"step-play-hint\">Voir le screen</span>",
    "g2.s4":"Si refusee, une notification s'affiche a la prochaine connexion.<br><span class=\"step-play-hint\">Voir le screen</span>",
    "g3.desc":"Le responsable RH dispose d'un espace dedie pour consulter et traiter toutes les demandes.",
    "g3.s1":"Le RH voit la <strong>liste de toutes les demandes</strong> en attente.<br><span class=\"step-play-hint\">Voir le screen</span>",
    "g3.s2":"Le RH peut <strong>accepter ou refuser</strong> en un clic. Le solde est mis a jour automatiquement.",
    "g4.desc":"Lors de chaque connexion, le praticien est automatiquement informe de l'etat de ses demandes en cours.",
    "g4.s1":"Des la connexion, une <strong>notification s'affiche</strong> si des demandes ont ete traitees.<br><span class=\"step-play-hint\">Voir le screen</span>",
    "g4.s2":"Le praticien peut consulter l'<strong>historique complet</strong> de ses demandes avec leur statut.",
    "g5.desc":"L'application C# communique avec un backend Laravel via une API REST. Les donnees sont en MySQL.",
    "g5.s1":"<strong>Laravel</strong> expose une API REST pour toutes les operations.",
    "g5.s2":"<strong>MySQL</strong> stocke les praticiens, soldes, demandes et statuts.",
    "g5.s3":"<strong>C# Windows Forms</strong> constitue l'interface graphique.",
    "f2.desc":"Le coeur de l'application repose sur une messagerie instantanee via Socket.io.",
    "f2.s1":"L'utilisateur selectionne une conversation et redige son message.",
    "f2.s2":"A l'envoi, le message est <strong>enregistre en base PostgreSQL</strong> pour garantir la persistance.<br><span class=\"step-play-hint\">Voir le screen</span>",
    "f2.s3":"<strong>Si le destinataire est connecte</strong>, il recoit le message <strong>instantanement via Socket.io</strong>.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "f2.s4":"<strong>Si le destinataire est absent</strong>, une <strong>notification push Firebase Messaging</strong> est declenchee.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "f2.s5":"Chaque message affiche l'auteur, le contenu et <strong>l'horodatage precis</strong> de l'envoi.<br><span class=\"step-play-hint\">Voir le screen</span>",
    "f2.s6":"<strong>Indicateur de frappe :</strong> lorsqu'un utilisateur ecrit, un message s'affiche en temps reel.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "f3.desc":"Grace a Firebase Cloud Messaging (FCM), les utilisateurs sont alertes des nouveaux messages meme lorsqu'ils n'ont pas l'application ouverte.",
    "f3.s1":"Lors de la connexion, l'application recupere le <strong>token FCM</strong> de l'appareil et l'enregistre en base.<br><span class=\"step-play-hint\">Voir le screen</span>",
    "f3.s2":"Quand un message est envoye, le backend <strong>declenche une notification FCM</strong> vers les membres du salon.<br><span class=\"step-play-hint\">Voir le log</span>",
    "f3.s3":"La notification apparait meme si l'application est <strong>fermee ou en arriere-plan</strong>.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "f3.s4":"Un tap sur la notification <strong>ouvre directement le salon</strong> concerne.",
    "f4.desc":"L'application distingue deux types d'espaces : les <strong>conversations</strong> creees librement, et les <strong>groupes</strong> reserves aux administrateurs.",
    "f4.s1":"<strong>Conversations (utilisateurs) :</strong> chaque utilisateur peut creer une conversation en choisissant un ou plusieurs contacts.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "f4.s2":"<strong>Groupes (admins uniquement) :</strong> seuls les administrateurs peuvent creer des groupes visibles par tous.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "f4.s3":"L'<strong>historique complet</strong> est charge a l'ouverture et les nouveaux messages arrivent en temps reel via Socket.io.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "f4.s4":"Un indicateur de <strong>presence en ligne</strong> permet de savoir quels membres sont connectes.<br><span class=\"step-play-hint\">Voir le screen</span>",
    "f4.s5":"<strong>Suppression automatique :</strong> les messages de plus de <strong>6 mois</strong> sont supprimes de la base PostgreSQL.<br><span class=\"step-play-hint\">Voir le screen</span>",
    "f5.desc":"Les utilisateurs peuvent animer leur salon en creant des sondages interactifs. Les votes et resultats sont visibles en temps reel.",
    "f5.s1":"N'importe quel membre peut creer un sondage en definissant une <strong>question et plusieurs options</strong>.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "f5.s2":"Le sondage est enregistre en PostgreSQL et diffuse via <strong>Socket.io</strong> a tous les membres.<br><span class=\"step-play-hint\">Voir le screen</span>",
    "f5.s3":"Chaque membre vote une seule fois. <strong>Un seul vote par utilisateur</strong> est autorise.",
    "f5.s4":"Les <strong>resultats se mettent a jour en direct</strong> avec le pourcentage de votes pour chaque option.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "f6.desc":"Chaque utilisateur peut personnaliser son experience visuelle en choisissant un fond d'ecran selon ses gouts.",
    "f6.s1":"Dans les parametres, l'utilisateur accede a une <strong>liste de fonds d'ecran predefinis</strong>.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "f6.s2":"Il peut egalement choisir une <strong>image personnalisee depuis sa galerie locale</strong>.",
    "f6.s3":"Le fond d'ecran est stocke <strong>uniquement en local sur l'appareil</strong> — jamais envoye au serveur.",
    "f6.s4":"L'interface <strong>s'adapte immediatement</strong> avec le fond d'ecran choisi.",
    "f7.desc":"Un espace dedie aux administrateurs permet de gerer entierement la communaute depuis l'application.",
    "f7.s1":"<strong>Validation des inscriptions :</strong> l'admin accepte ou refuse en un tap.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "f7.s2":"<strong>Modification des roles :</strong> l'admin peut promouvoir un utilisateur en moderateur ou administrateur.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "f7.s3":"<strong>Bannissement :</strong> l'admin peut bannir un compte. L'utilisateur banni ne peut plus se connecter.<br><span class=\"step-play-hint\">Voir la demo</span>",
    "f7.s4":"<strong>Suppression de compte :</strong> l'admin peut supprimer definitivement un compte et toutes ses donnees.",
    "f8.desc":"L'ensemble des donnees est stocke dans une base PostgreSQL hebergee sur un serveur OVH, deploye via Termius SSH.",
    "f8.s1":"<strong>PostgreSQL</strong> a ete choisi pour sa robustesse et sa gestion avancee des donnees relationnelles.",
    "f8.s2":"Le serveur est <strong>heberge sur OVH</strong>, offrant une disponibilite fiable sans dependance a un service tiers.",
    "f8.s3":"<strong>Termius SSH</strong> a ete utilise pour deployer le backend et configurer PostgreSQL directement depuis un terminal securise.",
  },

  en: {
    "nav.about":"About","nav.timeline":"Journey","nav.skills":"Skills",
    "nav.projects":"Projects","nav.ap":"AP Project","nav.contact":"Contact",
    "hero.subtitle":"Student","hero.cta1":"View my projects",
    "hero.cta2":"&#x2B07; Download CV","hero.scroll":"Scroll",
    "btn.animOff":"Anims ON","btn.animOn":"Anims OFF","btn.open":"&#x2756; Open",
    "about.title":"About","about.flipHint":"&#x2756; Click to discover &#x2756;",
    "about.text1":"Hi, my name is Corentin. Let me tell you about my journey and how I ended up studying IT, even though I originally started in an Electrical Engineering vocational program.",
    "about.text2":"I completed a vocational Bac Pro in Electrical Engineering and Connected Environments, but after two years I realized it was no longer the right fit for me. So I decided to pivot to IT, enrolled in a BTS SIO with a SLAM specialization, and honestly fell in love with it from day one. Today I build mobile and web applications — I even published an app on the Play Store during my internship.",
    "about.projects":"Projects","about.apps":"Play Store Apps",
    "timeline.title":"Journey",
    "tl1.title":"BTS SIO — 2nd year","tl1.sub":"SLAM track",
    "tl1.desc":"Deepened skills and completed real-world projects including Animal'and published on the Play Store.",
    "tl1.badge":"&#x2756; In progress",
    "tl2.title":"BTS SIO — 1st year","tl2.sub":"SLAM track",
    "tl2.desc":"Learned web and mobile development fundamentals. First Flutter, PHP and MySQL projects.",
    "tl2.badge":"Validated",
    "tl3.title":"High School","tl3.sub":"Vocational Bac — MELEC",
    "tl3.desc":"Obtained the Vocational Baccalaureate in Electrical Engineering and Connected Environments.",
    "tl3.badge":"Graduated",
    "skills.title":"Skills","skill1.name":"Development",
    "skill2.name":"Data","skill2.tag4":"DB Modeling","skill2.tag5":"Advanced SQL",
    "skill3.name":"Tools &amp; Methods","skill3.tag4":"Agile Method","skill3.tag5":"Testing &amp; QA",
    "skill4.name":"Block 1 — Support","skill4.tag1":"Asset management","skill4.tag2":"Support &amp; incidents","skill4.tag3":"Service deployment","skill4.tag4":"Project mode","skill4.tag5":"Tech watch",
    "skill5.name":"Block 2 — SLAM","skill5.tag1":"App design","skill5.tag2":"Corrective maintenance","skill5.tag3":"Evolutive maintenance","skill5.tag4":"Software architecture","skill5.tag5":"UML / Modeling",
    "skill6.name":"Block 3 — Cybersecurity","skill6.tag1":"GDPR / CNIL","skill6.tag2":"Access management","skill6.tag3":"App security","skill6.tag4":"Log analysis","skill6.tag5":"Attack prevention",
    "projects.title":"Projects","projects.personal":"View my personal projects",
    "p1.type":"Mobile App — Real-Time Chat",
    "p1.desc":"Flutter instant messaging app with real-time chat, push notifications and admin panel.",
    "p2.type":"Mobile App","p2.type2":"Mobile App — Private Shop",
    "p2.desc":"Companion app to Animal'and dedicated to managing equipment and accessories for animals.",
    "p3.type":"Web Project — Personal",
    "p3.desc":"Web project set in the League of Legends universe with data display and immersive design.",
    "modal.clickHint":"&#x2756; Click on a feature to learn more",
    "submodal.feature":"Feature",
    "m1.desc":"Animal'and Chat is a Flutter mobile messaging application. The backend is deployed on an OVH server via <strong>Termius SSH</strong>, the database is PostgreSQL, and notifications are handled by Firebase Messaging.",
    "f1.title":"&#x1F511; Registration &amp; Access","f1.preview":"Manual account validation by an administrator before access is granted.",
    "f1.desc":"Access to the app is not open to everyone. Every new registration goes through a validation process before the user can log in.",
    "f1.s1":"The user fills in a registration form with their details (name, email, password).<br><span class=\"step-play-hint\">View demo</span>",
    "f1.s2":"The request is stored in PostgreSQL with status <strong>\"pending\"</strong>. Access is blocked until validation.<br><span class=\"step-play-hint\">View screenshot</span>",
    "f1.s3":"An admin receives the request in their panel and can <strong>accept or reject</strong> the account.<br><span class=\"step-play-hint\">View demo</span>",
    "f1.s4":"Once accepted, the user can log in and <strong>create conversations</strong> with other members.<br><span class=\"step-play-hint\">View demo</span>",
    "f1.s5":"Creating <strong>groups</strong> is reserved for administrators only.<br><span class=\"step-play-hint\">View screenshot</span>",
    "f2.title":"&#x1F4AC; Real-time chat","f2.preview":"Instant messages in channels via Socket.io, with timestamps.",
    "f3.title":"&#x1F514; Push notifications","f3.preview":"Firebase Messaging sends alerts even when the app is closed.",
    "f4.title":"&#x1F43E; Conversations &amp; Groups","f4.preview":"Users create conversations; only admins can create groups.",
    "f5.title":"&#x1F4CA; Polls","f5.preview":"Create polls in channels, results updated in real time.",
    "f6.title":"&#x1F3A8; Customization","f6.preview":"Wallpaper customizable by the user according to their preferences.",
    "f7.title":"&#x1F6E1;&#xFE0F; Admin panel","f7.preview":"Full account management: roles, bans, deletions, registrations.",
    "f8.title":"&#x1F5C4;&#xFE0F; Database","f8.preview":"PostgreSQL on OVH, deployed via Termius SSH.",
    "m2.desc":"Animal'vest is the association's private shop, reserved for its members.",
    "v1.title":"&#x1F510; Members-only access","v1.preview":"Login without credentials via a temporary account deleted on logout.",
    "v2.title":"&#x1F6CD;&#xFE0F; Product catalog","v2.preview":"Browse items with photos, descriptions, prices and size selection.",
    "v3.title":"&#x1F5BC;&#xFE0F; Multi-photo gallery","v3.preview":"Up to 8 photos per product with carousel, fullscreen zoom and viewer.",
    "v4.title":"&#x1F4CB; Categories &amp; Units","v4.preview":"Unit grid on the home screen, each linked to shop categories.",
    "v5.title":"&#x1F6D2; Cart &amp; Orders","v5.preview":"Add to cart, delivery form and order status tracking.",
    "v6.title":"&#x1F6E1;&#xFE0F; Admin panel","v6.preview":"Manage products, stock, orders and tracking with internal notes.",
    "v7.title":"&#x1F4E6; Mandatory parcel number","v7.preview":"Shipping is blocked until a valid parcel number (8 digits) is entered.",
    "v8.title":"&#x1F514; Push notifications","v8.preview":"Admin is alerted in real time when a new order is placed.",
    "v9.title":"&#x2709;&#xFE0F; Automatic emails","v9.preview":"An email is sent to the member at each order status change.",
    "v10.title":"&#x1F512; Security &amp; Password","v10.preview":"Shared policy with strength indicator, formatters and anti-abuse rate limiter.",
    "v11.title":"&#x1F5C4;&#xFE0F; Database","v11.preview":"Flutter, Firebase for notifications and PostgreSQL/MySQL for data.",
    "gsb1.type":"Windows App — GSB Mission 1","gsb1.mTitle":"GSB Leave Management",
    "gsb1.desc":"C# Windows application developed as part of the GSB AP project. It allows practitioners to submit leave requests and the HR manager to approve or reject them.",
    "gsb2.type":"Mobile App — GSB Mission 5","gsb2.mTitle":"GSB Practitioner Ratings",
    "g1.title":"&#x1F511; Login &amp; Accounts","g1.preview":"Two distinct accounts: practitioner and HR manager with differentiated access.",
    "g2.title":"&#x1F4C5; Leave request","g2.preview":"Entry form with date selection and automatic balance check.",
    "g3.title":"&#x1F6E1;&#xFE0F; HR Panel","g3.preview":"List of pending requests, review and accept/reject decision.",
    "g4.title":"&#x1F514; Login notifications","g4.preview":"The practitioner is notified of their request status on login.",
    "g5.title":"&#x1F5C4;&#xFE0F; Database","g5.preview":"Laravel REST API, MySQL database, consumed by the C# Windows app.",
    "ap.title":"AP Project",
    "ap.gsb1desc":"C# Windows application allowing practitioners to submit leave requests and the HR manager to accept or reject them.",
    "ap.gsb2desc":"Flutter application displaying GSB practitioner ratings. In development.",
    "ap.inprogress":"&#x23F3; In progress",
    "lol.desc":"Immersive web project inspired by the League of Legends universe.",
    "lol.features":"Features","lol.f1":"Champion display and search",
    "lol.f2":"MySQL character database","lol.f3":"Thematic design inspired by the game",
    "lol.f4":"Responsive PHP/HTML/CSS web interface",
    "contact.title":"Get in touch",
    "contact.text":"\"Every great journey starts with a first message.\"<br>Let's talk about your next project.",
    "contact.email":"&#x2709; Email","contact.linkedin":"&#x25C8; LinkedIn","contact.cv":"&#x2B07; CV PDF",
    "footer.text":"&#169; 2026 Corentin Mesure — BTS SIO SLAM",
    "video.notfound":"File not found:",
  }
};

var currentLang = localStorage.getItem('portfolio-lang') || 'fr';

function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  localStorage.setItem('portfolio-lang', lang);
  var dict = TRANSLATIONS[lang];
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
}
function toggleLang() { applyLang(currentLang === 'fr' ? 'en' : 'fr'); }

/* ════════════════════════════════════════════════════════
   ANIMATIONS toggle
════════════════════════════════════════════════════════ */
var animEnabled = localStorage.getItem('portfolio-anim') !== 'off';

function applyAnimState(enabled) {
  animEnabled = enabled;
  localStorage.setItem('portfolio-anim', enabled ? 'on' : 'off');
  document.documentElement.classList.toggle('no-anim', !enabled);
}
function toggleAnimations() { applyAnimState(!animEnabled); }

/* ════════════════════════════════════════════════════════
   INIT au chargement
════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  applyLang(currentLang);
  applyAnimState(animEnabled);
});

/* ════════════════════════════════════════════════════════
   CODE CAROUSEL — Données et moteur
   Ajouter à la fin de Script.js ou inclure séparément
════════════════════════════════════════════════════════ */

/* ── Données des slides par projet ── */
var CODE_SLIDES_DATA = {

  'animaland': [
    {
      filename: 'chat_server.js',
      lang: 'Node.js / Socket.io',
      title: 'Chat en temps réel — Socket.io',
      explanation: 'Le <strong>serveur Node.js</strong> écoute les connexions Socket.io. Quand un utilisateur envoie un message (<code>sendMessage</code>), il est enregistré en base PostgreSQL puis diffusé instantanément à tous les membres du salon via <code>io.to(roomId).emit()</code>. La persistance et le temps réel sont ainsi combinés.',
      code: [
        { hl: false, html: '<span class="tk-cmt">// server.js — Serveur Socket.io + Express</span>' },
        { hl: false, html: '<span class="tk-kw">const</span> <span class="tk-var">io</span> <span class="tk-op">=</span> <span class="tk-fn">require</span>(<span class="tk-str">\'socket.io\'</span>)(server, { cors: { origin: <span class="tk-str">\'*\'</span> } });' },
        { hl: false, html: '' },
        { hl: false, html: '<span class="tk-var">io</span>.<span class="tk-fn">on</span>(<span class="tk-str">\'connection\'</span>, (<span class="tk-var">socket</span>) <span class="tk-op">=&gt;</span> {' },
        { hl: true,  html: '  <span class="tk-var">socket</span>.<span class="tk-fn">on</span>(<span class="tk-str">\'sendMessage\'</span>, <span class="tk-kw">async</span> ({ roomId, userId, content }) <span class="tk-op">=&gt;</span> {' },
        { hl: false, html: '    <span class="tk-cmt">// 1. Persister en PostgreSQL</span>' },
        { hl: false, html: '    <span class="tk-kw">const</span> <span class="tk-var">saved</span> <span class="tk-op">=</span> <span class="tk-kw">await</span> <span class="tk-fn">saveMessage</span>({ roomId, userId, content });' },
        { hl: false, html: '' },
        { hl: false, html: '    <span class="tk-cmt">// 2. Diffuser à tous les membres du salon</span>' },
        { hl: true,  html: '    <span class="tk-var">io</span>.<span class="tk-fn">to</span>(roomId).<span class="tk-fn">emit</span>(<span class="tk-str">\'newMessage\'</span>, {' },
        { hl: false, html: '      id: saved.<span class="tk-prop">id</span>, content: saved.<span class="tk-prop">content</span>,' },
        { hl: false, html: '      author: saved.<span class="tk-prop">username</span>, timestamp: saved.<span class="tk-prop">created_at</span>' },
        { hl: false, html: '    });' },
        { hl: false, html: '' },
        { hl: false, html: '    <span class="tk-cmt">// 3. Notification FCM si destinataire absent</span>' },
        { hl: false, html: '    <span class="tk-kw">await</span> <span class="tk-fn">sendFCMIfOffline</span>(roomId, userId, content);' },
        { hl: false, html: '  });' },
        { hl: false, html: '' },
        { hl: false, html: '  socket.<span class="tk-fn">on</span>(<span class="tk-str">\'typing\'</span>, ({ roomId, username }) <span class="tk-op">=&gt;</span> {' },
        { hl: false, html: '    socket.<span class="tk-fn">to</span>(roomId).<span class="tk-fn">emit</span>(<span class="tk-str">\'userTyping\'</span>, { username });' },
        { hl: false, html: '  });' },
        { hl: false, html: '});' },
      ]
    },
    {
      filename: 'auth_service.js',
      lang: 'Node.js / JWT',
      title: 'Inscription & Validation admin',
      explanation: 'Lors de l\'inscription, le compte est créé avec le statut <code>"pending"</code>. Le login vérifie ce statut : si le compte n\'est pas encore validé, une erreur <code>403</code> est retournée. Seul l\'admin peut faire passer le statut à <code>"approved"</code>.',
      code: [
        { hl: false, html: '<span class="tk-cmt">// auth.js — Inscription avec validation manuelle</span>' },
        { hl: false, html: '<span class="tk-var">router</span>.<span class="tk-fn">post</span>(<span class="tk-str">\'/register\'</span>, <span class="tk-kw">async</span> (req, res) <span class="tk-op">=&gt;</span> {' },
        { hl: false, html: '  <span class="tk-kw">const</span> { name, email, password } <span class="tk-op">=</span> req.<span class="tk-prop">body</span>;' },
        { hl: false, html: '  <span class="tk-kw">const</span> hashed <span class="tk-op">=</span> <span class="tk-kw">await</span> bcrypt.<span class="tk-fn">hash</span>(password, <span class="tk-num">12</span>);' },
        { hl: false, html: '' },
        { hl: true,  html: '  <span class="tk-kw">await</span> db.<span class="tk-fn">query</span>(' },
        { hl: false, html: '    <span class="tk-str">`INSERT INTO users (name, email, password, status)</span>' },
        { hl: false, html: '     <span class="tk-str">VALUES ($1, $2, $3, \'pending\')`</span>,' },
        { hl: false, html: '    [name, email, hashed]' },
        { hl: false, html: '  );' },
        { hl: false, html: '  res.<span class="tk-fn">json</span>({ message: <span class="tk-str">\'En attente de validation\'</span> });' },
        { hl: false, html: '});' },
        { hl: false, html: '' },
        { hl: false, html: '<span class="tk-cmt">// Connexion — vérifie le statut</span>' },
        { hl: false, html: '<span class="tk-var">router</span>.<span class="tk-fn">post</span>(<span class="tk-str">\'/login\'</span>, <span class="tk-kw">async</span> (req, res) <span class="tk-op">=&gt;</span> {' },
        { hl: false, html: '  <span class="tk-kw">const</span> user <span class="tk-op">=</span> <span class="tk-kw">await</span> <span class="tk-fn">findUserByEmail</span>(req.<span class="tk-prop">body</span>.email);' },
        { hl: true,  html: '  <span class="tk-kw">if</span> (user.status <span class="tk-op">!==</span> <span class="tk-str">\'approved\'</span>) {' },
        { hl: false, html: '    <span class="tk-kw">return</span> res.<span class="tk-fn">status</span>(<span class="tk-num">403</span>).<span class="tk-fn">json</span>({ error: <span class="tk-str">\'Compte non validé\'</span> });' },
        { hl: false, html: '  }' },
        { hl: false, html: '  <span class="tk-kw">const</span> token <span class="tk-op">=</span> jwt.<span class="tk-fn">sign</span>({ userId: user.id }, JWT_SECRET);' },
        { hl: false, html: '  res.<span class="tk-fn">json</span>({ token });' },
        { hl: false, html: '});' },
      ]
    },
    {
      filename: 'fcm_service.js',
      lang: 'Firebase Admin SDK',
      title: 'Notifications Push FCM',
      explanation: 'Le token FCM de chaque appareil est stocké en base à la connexion. Quand un message est envoyé, <code>sendFCMIfOffline()</code> récupère les tokens des membres absents et appelle l\'API Firebase pour envoyer une notification push, même si l\'app est fermée.',
      code: [
        { hl: false, html: '<span class="tk-cmt">// fcm.js — Envoi notification Firebase Cloud Messaging</span>' },
        { hl: false, html: '<span class="tk-kw">const</span> admin <span class="tk-op">=</span> <span class="tk-fn">require</span>(<span class="tk-str">\'firebase-admin\'</span>);' },
        { hl: false, html: '' },
        { hl: false, html: '<span class="tk-kw">async function</span> <span class="tk-fn">sendFCMIfOffline</span>(roomId, senderId, content) {' },
        { hl: false, html: '  <span class="tk-cmt">// Récupérer les tokens des membres hors-ligne</span>' },
        { hl: true,  html: '  <span class="tk-kw">const</span> offlineTokens <span class="tk-op">=</span> <span class="tk-kw">await</span> db.<span class="tk-fn">query</span>(`' },
        { hl: false, html: '    <span class="tk-str">SELECT fcm_token FROM room_members rm</span>' },
        { hl: false, html: '    <span class="tk-str">JOIN users u ON u.id = rm.user_id</span>' },
        { hl: false, html: '    <span class="tk-str">WHERE rm.room_id = $1 AND rm.user_id != $2</span>' },
        { hl: false, html: '    <span class="tk-str">  AND u.is_online = false AND u.fcm_token IS NOT NULL</span>' },
        { hl: false, html: '  `, [roomId, senderId]);' },
        { hl: false, html: '' },
        { hl: false, html: '  <span class="tk-kw">for</span> (<span class="tk-kw">const</span> { fcm_token } <span class="tk-kw">of</span> offlineTokens.rows) {' },
        { hl: true,  html: '    <span class="tk-kw">await</span> admin.<span class="tk-fn">messaging</span>().<span class="tk-fn">send</span>({' },
        { hl: false, html: '      token: fcm_token,' },
        { hl: false, html: '      notification: { title: <span class="tk-str">\'Nouveau message\'</span>, body: content.<span class="tk-fn">slice</span>(<span class="tk-num">0</span>, <span class="tk-num">80</span>) },' },
        { hl: false, html: '      data: { roomId: String(roomId) }' },
        { hl: false, html: '    });' },
        { hl: false, html: '  }' },
        { hl: false, html: '}' },
      ]
    },
    {
      filename: 'schema.sql',
      lang: 'PostgreSQL',
      title: 'Structure de la base de données',
      explanation: 'La base PostgreSQL sur OVH comprend : <code>users</code> (avec statut et token FCM), <code>rooms</code> (conversations et groupes), <code>messages</code> supprimés automatiquement après 6 mois, et <code>polls</code> / <code>poll_votes</code> pour les sondages.',
      code: [
        { hl: false, html: '<span class="tk-cmt">-- schema.sql — Base PostgreSQL Animal\'and</span>' },
        { hl: false, html: '' },
        { hl: false, html: '<span class="tk-kw">CREATE TABLE</span> users (' },
        { hl: false, html: '  id         <span class="tk-cls">SERIAL PRIMARY KEY</span>,' },
        { hl: false, html: '  name       <span class="tk-cls">VARCHAR</span>(<span class="tk-num">100</span>) <span class="tk-kw">NOT NULL</span>,' },
        { hl: false, html: '  email      <span class="tk-cls">VARCHAR</span>(<span class="tk-num">255</span>) <span class="tk-kw">UNIQUE NOT NULL</span>,' },
        { hl: false, html: '  password   <span class="tk-cls">TEXT</span> <span class="tk-kw">NOT NULL</span>,' },
        { hl: true,  html: '  status     <span class="tk-cls">VARCHAR</span>(<span class="tk-num">20</span>) <span class="tk-kw">DEFAULT</span> <span class="tk-str">\'pending\'</span>,  <span class="tk-cmt">-- pending/approved/banned</span>' },
        { hl: false, html: '  role       <span class="tk-cls">VARCHAR</span>(<span class="tk-num">20</span>) <span class="tk-kw">DEFAULT</span> <span class="tk-str">\'user\'</span>,' },
        { hl: false, html: '  fcm_token  <span class="tk-cls">TEXT</span>,' },
        { hl: false, html: '  is_online  <span class="tk-cls">BOOLEAN DEFAULT false</span>' },
        { hl: false, html: ');' },
        { hl: false, html: '' },
        { hl: false, html: '<span class="tk-kw">CREATE TABLE</span> messages (' },
        { hl: false, html: '  id         <span class="tk-cls">SERIAL PRIMARY KEY</span>,' },
        { hl: false, html: '  room_id    <span class="tk-cls">INT REFERENCES</span> rooms(id) <span class="tk-kw">ON DELETE CASCADE</span>,' },
        { hl: false, html: '  user_id    <span class="tk-cls">INT REFERENCES</span> users(id),' },
        { hl: false, html: '  content    <span class="tk-cls">TEXT</span>,' },
        { hl: true,  html: '  created_at <span class="tk-cls">TIMESTAMP DEFAULT NOW</span>()  <span class="tk-cmt">-- Supprimé après 6 mois</span>' },
        { hl: false, html: ');' },
        { hl: false, html: '' },
        { hl: true,  html: '<span class="tk-kw">DELETE FROM</span> messages <span class="tk-kw">WHERE</span> created_at &lt; <span class="tk-fn">NOW</span>() - <span class="tk-str">INTERVAL \'6 months\'</span>;' },
      ]
    },
  ],

  'animalvest': [
    {
      filename: 'guest_auth.dart',
      lang: 'Flutter / Dart',
      title: 'Authentification — Compte temporaire auto',
      explanation: 'À l\'ouverture de l\'app, un compte invité est créé automatiquement via <code>POST /guest</code>. L\'UUID généré sert de token temporaire stocké dans <code>FlutterSecureStorage</code>. À la fermeture, <code>deleteGuestAccount()</code> est appelé — aucune donnée personnelle ne persiste.',
      code: [
        { hl: false, html: '<span class="tk-cmt">// guest_auth.dart — Compte temporaire auto-généré</span>' },
        { hl: false, html: '<span class="tk-kw">class</span> <span class="tk-cls">GuestAuthService</span> {' },
        { hl: false, html: '  <span class="tk-kw">static</span> <span class="tk-kw">Future</span>&lt;<span class="tk-cls">String</span>&gt; <span class="tk-fn">createGuestSession</span>() <span class="tk-kw">async</span> {' },
        { hl: true,  html: '    <span class="tk-kw">final</span> response <span class="tk-op">=</span> <span class="tk-kw">await</span> ApiService.instance.<span class="tk-fn">post</span>(<span class="tk-str">\'/guest\'</span>, {' },
        { hl: false, html: '      <span class="tk-str">\'device_id\'</span>: <span class="tk-kw">await</span> DeviceInfo.<span class="tk-fn">getDeviceId</span>(),' },
        { hl: false, html: '      <span class="tk-str">\'created_at\'</span>: DateTime.now().<span class="tk-fn">toIso8601String</span>(),' },
        { hl: false, html: '    });' },
        { hl: false, html: '    <span class="tk-kw">final</span> token <span class="tk-op">=</span> response[<span class="tk-str">\'guest_token\'</span>];' },
        { hl: false, html: '    <span class="tk-kw">await</span> SecureStorage.<span class="tk-fn">write</span>(<span class="tk-str">\'guest_token\'</span>, token);' },
        { hl: false, html: '    <span class="tk-kw">return</span> token;' },
        { hl: false, html: '  }' },
        { hl: false, html: '' },
        { hl: false, html: '  <span class="tk-cmt">// Appelé à la fermeture — supprime le compte</span>' },
        { hl: true,  html: '  <span class="tk-kw">static</span> <span class="tk-kw">Future</span>&lt;<span class="tk-cls">void</span>&gt; <span class="tk-fn">deleteGuestAccount</span>() <span class="tk-kw">async</span> {' },
        { hl: false, html: '    <span class="tk-kw">final</span> token <span class="tk-op">=</span> <span class="tk-kw">await</span> SecureStorage.<span class="tk-fn">read</span>(<span class="tk-str">\'guest_token\'</span>);' },
        { hl: false, html: '    <span class="tk-kw">if</span> (token <span class="tk-op">!=</span> <span class="tk-kw">null</span>) {' },
        { hl: false, html: '      <span class="tk-kw">await</span> ApiService.instance.<span class="tk-fn">delete</span>(<span class="tk-str">\'/guest/$token\'</span>);' },
        { hl: false, html: '      <span class="tk-kw">await</span> SecureStorage.<span class="tk-fn">delete</span>(<span class="tk-str">\'guest_token\'</span>);' },
        { hl: false, html: '    }' },
        { hl: false, html: '  }' },
        { hl: false, html: '}' },
      ]
    },
    {
      filename: 'order_service.php',
      lang: 'PHP / PHPMailer',
      title: 'Commandes — Emails automatiques par statut',
      explanation: 'Quand l\'admin change le statut d\'une commande, <code>updateOrderStatus()</code> met à jour la base puis appelle <code>sendStatusEmail()</code>. PHPMailer envoie un template HTML différent pour chaque statut : confirmée, traitée, expédiée (avec numéro de colis), livrée.',
      code: [
        { hl: false, html: '<span class="tk-cmt">&lt;?php // order_service.php — Statut + email auto</span>' },
        { hl: false, html: '<span class="tk-kw">function</span> <span class="tk-fn">updateOrderStatus</span>(<span class="tk-var">$orderId</span>, <span class="tk-var">$status</span>, <span class="tk-var">$tracking</span> = <span class="tk-kw">null</span>) {' },
        { hl: true,  html: '  <span class="tk-var">$stmt</span> <span class="tk-op">=</span> <span class="tk-var">$pdo</span>-&gt;<span class="tk-fn">prepare</span>(' },
        { hl: false, html: '    <span class="tk-str">"UPDATE orders SET status=?, tracking_number=? WHERE id=?"</span>' },
        { hl: false, html: '  );' },
        { hl: false, html: '  <span class="tk-var">$stmt</span>-&gt;<span class="tk-fn">execute</span>([<span class="tk-var">$status</span>, <span class="tk-var">$tracking</span>, <span class="tk-var">$orderId</span>]);' },
        { hl: false, html: '' },
        { hl: false, html: '  <span class="tk-var">$order</span> <span class="tk-op">=</span> <span class="tk-fn">getOrderById</span>(<span class="tk-var">$orderId</span>);' },
        { hl: true,  html: '  <span class="tk-fn">sendStatusEmail</span>(<span class="tk-var">$order</span>[<span class="tk-str">\'member_email\'</span>], <span class="tk-var">$status</span>, <span class="tk-var">$order</span>);' },
        { hl: false, html: '}' },
        { hl: false, html: '' },
        { hl: false, html: '<span class="tk-kw">function</span> <span class="tk-fn">sendStatusEmail</span>(<span class="tk-var">$email</span>, <span class="tk-var">$status</span>, <span class="tk-var">$order</span>) {' },
        { hl: false, html: '  <span class="tk-var">$templates</span> <span class="tk-op">=</span> [' },
        { hl: false, html: '    <span class="tk-str">\'confirmed\'</span> =&gt; <span class="tk-fn">getConfirmedTemplate</span>(<span class="tk-var">$order</span>),' },
        { hl: true,  html: '    <span class="tk-str">\'shipped\'</span>   =&gt; <span class="tk-fn">getShippedTemplate</span>(<span class="tk-var">$order</span>, <span class="tk-var">$order</span>[<span class="tk-str">\'tracking_number\'</span>]),' },
        { hl: false, html: '    <span class="tk-str">\'delivered\'</span> =&gt; <span class="tk-fn">getDeliveredTemplate</span>(<span class="tk-var">$order</span>),' },
        { hl: false, html: '  ];' },
        { hl: false, html: '  PHPMailer::<span class="tk-fn">send</span>(<span class="tk-var">$email</span>, <span class="tk-var">$templates</span>[<span class="tk-var">$status</span>]);' },
        { hl: false, html: '}' },
      ]
    },
    {
      filename: 'password_policy.dart',
      lang: 'Flutter / Dart',
      title: 'Sécurité — Indicateur force du mot de passe',
      explanation: 'La politique vérifie en temps réel : longueur ≥ 8, majuscule, chiffre, caractère spécial. Le score 0→4 détermine la couleur de l\'indicateur. Le <code>RateLimiter</code> bloque les tentatives après 5 échecs en 2 minutes via <code>FlutterSecureStorage</code>.',
      code: [
        { hl: false, html: '<span class="tk-cmt">// password_policy.dart — Validation force</span>' },
        { hl: false, html: '<span class="tk-kw">class</span> <span class="tk-cls">PasswordStrength</span> {' },
        { hl: false, html: '  <span class="tk-kw">static</span> <span class="tk-kw">int</span> <span class="tk-fn">score</span>(<span class="tk-cls">String</span> pwd) {' },
        { hl: false, html: '    <span class="tk-kw">int</span> score <span class="tk-op">=</span> <span class="tk-num">0</span>;' },
        { hl: true,  html: '    <span class="tk-kw">if</span> (pwd.length <span class="tk-op">&gt;=</span> <span class="tk-num">8</span>) score++;' },
        { hl: true,  html: '    <span class="tk-kw">if</span> (pwd.<span class="tk-fn">contains</span>(RegExp(<span class="tk-str">r\'[A-Z]\'</span>))) score++;' },
        { hl: true,  html: '    <span class="tk-kw">if</span> (pwd.<span class="tk-fn">contains</span>(RegExp(<span class="tk-str">r\'[0-9]\'</span>))) score++;' },
        { hl: true,  html: '    <span class="tk-kw">if</span> (pwd.<span class="tk-fn">contains</span>(RegExp(<span class="tk-str">r\'[!@#\\$%^&*]\'</span>))) score++;' },
        { hl: false, html: '    <span class="tk-kw">return</span> score; <span class="tk-cmt">// 0=faible ... 4=fort</span>' },
        { hl: false, html: '  }' },
        { hl: false, html: '}' },
        { hl: false, html: '' },
        { hl: false, html: '<span class="tk-cmt">// Rate limiter — 5 essais max / 2 min</span>' },
        { hl: false, html: '<span class="tk-kw">class</span> <span class="tk-cls">RateLimiter</span> {' },
        { hl: false, html: '  <span class="tk-kw">static</span> <span class="tk-kw">Future</span>&lt;<span class="tk-kw">bool</span>&gt; <span class="tk-fn">isBlocked</span>(<span class="tk-cls">String</span> email) <span class="tk-kw">async</span> {' },
        { hl: false, html: '    <span class="tk-kw">final</span> data <span class="tk-op">=</span> <span class="tk-kw">await</span> SecureStorage.<span class="tk-fn">read</span>(<span class="tk-str">\'login_attempts_$email\'</span>);' },
        { hl: false, html: '    <span class="tk-kw">if</span> (data <span class="tk-op">==</span> <span class="tk-kw">null</span>) <span class="tk-kw">return false</span>;' },
        { hl: false, html: '    <span class="tk-kw">final</span> attempts <span class="tk-op">=</span> jsonDecode(data);' },
        { hl: true,  html: '    <span class="tk-kw">return</span> attempts[<span class="tk-str">\'count\'</span>] <span class="tk-op">&gt;=</span> <span class="tk-num">5</span> &amp;&amp;' },
        { hl: false, html: '      DateTime.<span class="tk-fn">now</span>().<span class="tk-fn">difference</span>(DateTime.<span class="tk-fn">parse</span>(attempts[<span class="tk-str">\'since\'</span>])).inMinutes &lt; <span class="tk-num">2</span>;' },
        { hl: false, html: '  }' },
        { hl: false, html: '}' },
      ]
    },
  ],

  'taskmanager': [
    {
      filename: 'tasks.js',
      lang: 'JavaScript',
      title: 'Navigation conditionnelle — Bouton Suivant',
      explanation: 'La fonction <code>tryAdvance()</code> vérifie que toutes les checkboxes sont cochées avant d\'avancer. Si une sous-tâche de la tâche 1 est décochée après coup, <code>conditionalHide()</code> masque automatiquement la tâche 2 — forçant une revalidation.',
      code: [
        { hl: false, html: '<span class="tk-cmt">// tasks.js — Navigation séquentielle conditionnelle</span>' },
        { hl: false, html: '<span class="tk-kw">function</span> <span class="tk-fn">tryAdvance</span>(taskIndex) {' },
        { hl: true,  html: '  <span class="tk-kw">const</span> boxes <span class="tk-op">=</span> document.<span class="tk-fn">querySelectorAll</span>(<span class="tk-str">`#task-${taskIndex} .subtask-check`</span>);' },
        { hl: false, html: '  <span class="tk-kw">const</span> allChecked <span class="tk-op">=</span> [...boxes].<span class="tk-fn">every</span>(b <span class="tk-op">=&gt;</span> b.checked);' },
        { hl: false, html: '' },
        { hl: false, html: '  <span class="tk-kw">if</span> (!allChecked) {' },
        { hl: false, html: '    <span class="tk-fn">showError</span>(<span class="tk-str">\'Veuillez cocher toutes les sous-tâches\'</span>);' },
        { hl: false, html: '    <span class="tk-kw">return</span>;' },
        { hl: false, html: '  }' },
        { hl: true,  html: '  <span class="tk-fn">unlockTask</span>(taskIndex <span class="tk-op">+</span> <span class="tk-num">1</span>);' },
        { hl: false, html: '}' },
        { hl: false, html: '' },
        { hl: false, html: '<span class="tk-cmt">// Tâche 2 disparaît si tâche 1 décochée a posteriori</span>' },
        { hl: false, html: '<span class="tk-kw">function</span> <span class="tk-fn">conditionalHide</span>() {' },
        { hl: false, html: '  <span class="tk-kw">const</span> task1Boxes <span class="tk-op">=</span> document.<span class="tk-fn">querySelectorAll</span>(<span class="tk-str">\'#task-1 .subtask-check\'</span>);' },
        { hl: false, html: '  <span class="tk-kw">const</span> task2 <span class="tk-op">=</span> document.<span class="tk-fn">getElementById</span>(<span class="tk-str">\'task-2\'</span>);' },
        { hl: true,  html: '  <span class="tk-kw">const</span> allChecked <span class="tk-op">=</span> [...task1Boxes].<span class="tk-fn">every</span>(b <span class="tk-op">=&gt;</span> b.checked);' },
        { hl: true,  html: '  task2.style.display <span class="tk-op">=</span> allChecked <span class="tk-op">?</span> <span class="tk-str">\'block\'</span> <span class="tk-op">:</span> <span class="tk-str">\'none\'</span>;' },
        { hl: false, html: '}' },
        { hl: false, html: '' },
        { hl: false, html: 'document.<span class="tk-fn">querySelectorAll</span>(<span class="tk-str">\'#task-1 .subtask-check\'</span>)' },
        { hl: false, html: '  .<span class="tk-fn">forEach</span>(box <span class="tk-op">=&gt;</span> box.<span class="tk-fn">addEventListener</span>(<span class="tk-str">\'change\'</span>, conditionalHide));' },
      ]
    },
    {
      filename: 'quittancement.php',
      lang: 'PHP / FPDF',
      title: 'Génération PDF & envoi email automatique',
      explanation: 'Quand toutes les tâches sont validées et l\'utilisateur confirme, <code>generateQuittancement()</code> crée un PDF via <strong>FPDF</strong> avec le récapitulatif du projet, puis PHPMailer l\'envoie automatiquement en pièce jointe.',
      code: [
        { hl: false, html: '<span class="tk-cmt">&lt;?php // quittancement.php — Génération PDF + email</span>' },
        { hl: false, html: '<span class="tk-fn">require_once</span>(<span class="tk-str">\'fpdf/fpdf.php\'</span>);' },
        { hl: false, html: '<span class="tk-fn">require_once</span>(<span class="tk-str">\'phpmailer/PHPMailer.php\'</span>);' },
        { hl: false, html: '' },
        { hl: false, html: '<span class="tk-kw">function</span> <span class="tk-fn">generateQuittancement</span>(<span class="tk-var">$data</span>) {' },
        { hl: false, html: '  <span class="tk-var">$pdf</span> <span class="tk-op">=</span> <span class="tk-kw">new</span> <span class="tk-cls">FPDF</span>();' },
        { hl: false, html: '  <span class="tk-var">$pdf</span>-&gt;<span class="tk-fn">AddPage</span>();' },
        { hl: false, html: '  <span class="tk-var">$pdf</span>-&gt;<span class="tk-fn">SetFont</span>(<span class="tk-str">\'Arial\'</span>, <span class="tk-str">\'B\'</span>, <span class="tk-num">16</span>);' },
        { hl: true,  html: '  <span class="tk-var">$pdf</span>-&gt;<span class="tk-fn">Cell</span>(<span class="tk-num">0</span>, <span class="tk-num">10</span>, <span class="tk-str">\'Quittancement — \'</span> . <span class="tk-var">$data</span>[<span class="tk-str">\'project\'</span>], <span class="tk-str">\'B\'</span>, <span class="tk-num">1</span>, <span class="tk-str">\'C\'</span>);' },
        { hl: false, html: '  <span class="tk-var">$pdf</span>-&gt;<span class="tk-fn">SetFont</span>(<span class="tk-str">\'Arial\'</span>, <span class="tk-str">\'\'</span>, <span class="tk-num">12</span>);' },
        { hl: false, html: '' },
        { hl: false, html: '  <span class="tk-kw">foreach</span> (<span class="tk-var">$data</span>[<span class="tk-str">\'tasks\'</span>] <span class="tk-kw">as</span> <span class="tk-var">$task</span>) {' },
        { hl: false, html: '    <span class="tk-var">$pdf</span>-&gt;<span class="tk-fn">Cell</span>(<span class="tk-num">0</span>, <span class="tk-num">8</span>, <span class="tk-str">\'✓ \'</span> . <span class="tk-var">$task</span>[<span class="tk-str">\'title\'</span>], <span class="tk-str">\'\'</span>, <span class="tk-num">1</span>);' },
        { hl: false, html: '  }' },
        { hl: true,  html: '  <span class="tk-var">$pdf</span>-&gt;<span class="tk-fn">Output</span>(<span class="tk-str">\'F\'</span>, <span class="tk-str">\'/tmp/quittancement.pdf\'</span>);' },
        { hl: false, html: '' },
        { hl: false, html: '  <span class="tk-var">$mail</span> <span class="tk-op">=</span> <span class="tk-kw">new</span> <span class="tk-cls">PHPMailer</span>();' },
        { hl: false, html: '  <span class="tk-var">$mail</span>-&gt;<span class="tk-fn">addAddress</span>(<span class="tk-var">$data</span>[<span class="tk-str">\'recipient\'</span>]);' },
        { hl: false, html: '  <span class="tk-var">$mail</span>-&gt;<span class="tk-fn">Subject</span> <span class="tk-op">=</span> <span class="tk-str">\'Validation de quittancement\'</span>;' },
        { hl: true,  html: '  <span class="tk-var">$mail</span>-&gt;<span class="tk-fn">addAttachment</span>(<span class="tk-str">\'/tmp/quittancement.pdf\'</span>);' },
        { hl: false, html: '  <span class="tk-var">$mail</span>-&gt;<span class="tk-fn">send</span>();' },
        { hl: false, html: '}' },
      ]
    },
    {
      filename: 'edit_modal.js',
      lang: 'JavaScript',
      title: 'Édition tâche — Mise à jour dynamique du DOM',
      explanation: 'Le modal d\'édition pré-remplit les champs avec les données actuelles. À la soumission, <code>updateTaskDOM()</code> modifie le DOM immédiatement sans rechargement — le titre et les sous-tâches sont mis à jour en place.',
      code: [
        { hl: false, html: '<span class="tk-cmt">// edit_modal.js — Édition sans rechargement de page</span>' },
        { hl: false, html: '<span class="tk-kw">function</span> <span class="tk-fn">openEditModal</span>(taskId) {' },
        { hl: false, html: '  <span class="tk-kw">const</span> task <span class="tk-op">=</span> tasks[taskId];' },
        { hl: true,  html: '  document.<span class="tk-fn">getElementById</span>(<span class="tk-str">\'edit-title\'</span>).value <span class="tk-op">=</span> task.title;' },
        { hl: false, html: '' },
        { hl: false, html: '  <span class="tk-kw">const</span> container <span class="tk-op">=</span> document.<span class="tk-fn">getElementById</span>(<span class="tk-str">\'edit-subtasks\'</span>);' },
        { hl: false, html: '  container.innerHTML <span class="tk-op">=</span> task.subtasks.<span class="tk-fn">map</span>((sub, i) <span class="tk-op">=&gt;</span>' },
        { hl: false, html: '    <span class="tk-str">`&lt;input type="text" id="sub-${i}" value="${sub.label}"&gt;`</span>' },
        { hl: false, html: '  ).<span class="tk-fn">join</span>(<span class="tk-str">\'\'</span>);' },
        { hl: false, html: '  document.<span class="tk-fn">getElementById</span>(<span class="tk-str">\'edit-modal\'</span>).style.display <span class="tk-op">=</span> <span class="tk-str">\'flex\'</span>;' },
        { hl: false, html: '}' },
        { hl: false, html: '' },
        { hl: false, html: '<span class="tk-kw">function</span> <span class="tk-fn">saveEdit</span>(taskId) {' },
        { hl: false, html: '  <span class="tk-kw">const</span> newTitle <span class="tk-op">=</span> document.<span class="tk-fn">getElementById</span>(<span class="tk-str">\'edit-title\'</span>).value;' },
        { hl: true,  html: '  tasks[taskId].title <span class="tk-op">=</span> newTitle;' },
        { hl: false, html: '  tasks[taskId].subtasks.<span class="tk-fn">forEach</span>((sub, i) <span class="tk-op">=&gt;</span> {' },
        { hl: false, html: '    sub.label <span class="tk-op">=</span> document.<span class="tk-fn">getElementById</span>(<span class="tk-str">`sub-${i}`</span>).value;' },
        { hl: false, html: '  });' },
        { hl: true,  html: '  <span class="tk-fn">updateTaskDOM</span>(taskId);  <span class="tk-cmt">// Màj sans rechargement</span>' },
        { hl: false, html: '  document.<span class="tk-fn">getElementById</span>(<span class="tk-str">\'edit-modal\'</span>).style.display <span class="tk-op">=</span> <span class="tk-str">\'none\'</span>;' },
        { hl: false, html: '}' },
      ]
    },
  ],

  'lol': [
    {
      filename: 'champions.php',
      lang: 'PHP / MySQL',
      title: 'Recherche de champions — PDO',
      explanation: 'La page récupère les champions depuis MySQL avec une requête PDO préparée filtrée par le paramètre GET <code>q</code>. Le wildcard <code>%$search%</code> permet une recherche partielle sur le nom ou le rôle, protégée contre les injections SQL.',
      code: [
        { hl: false, html: '<span class="tk-cmt">&lt;?php // champions.php — Recherche sécurisée PDO</span>' },
        { hl: false, html: '<span class="tk-fn">require_once</span>(<span class="tk-str">\'db.php\'</span>);' },
        { hl: false, html: '' },
        { hl: false, html: '<span class="tk-var">$search</span> <span class="tk-op">=</span> <span class="tk-fn">isset</span>(<span class="tk-var">$_GET</span>[<span class="tk-str">\'q\'</span>]) ? <span class="tk-fn">trim</span>(<span class="tk-var">$_GET</span>[<span class="tk-str">\'q\'</span>]) : <span class="tk-str">\'\'</span>;' },
        { hl: false, html: '' },
        { hl: true,  html: '<span class="tk-var">$stmt</span> <span class="tk-op">=</span> <span class="tk-var">$pdo</span>-&gt;<span class="tk-fn">prepare</span>(<span class="tk-str">"' },
        { hl: false, html: '  SELECT * FROM champions' },
        { hl: false, html: '  WHERE name LIKE :search OR role LIKE :search' },
        { hl: false, html: '  ORDER BY name ASC' },
        { hl: false, html: '<span class="tk-str">"</span>);' },
        { hl: false, html: '<span class="tk-var">$stmt</span>-&gt;<span class="tk-fn">execute</span>([<span class="tk-str">\'search\'</span> <span class="tk-op">=&gt;</span> <span class="tk-str">"%<span class="tk-var">$search</span>%"</span>]);' },
        { hl: false, html: '<span class="tk-var">$champions</span> <span class="tk-op">=</span> <span class="tk-var">$stmt</span>-&gt;<span class="tk-fn">fetchAll</span>(<span class="tk-cls">PDO</span>::<span class="tk-prop">FETCH_ASSOC</span>);' },
        { hl: false, html: '<span class="tk-op">?&gt;</span>' },
        { hl: false, html: '' },
        { hl: false, html: '<span class="tk-tag">&lt;div</span> <span class="tk-attr">class</span>=<span class="tk-val">"champions-grid"</span><span class="tk-tag">&gt;</span>' },
        { hl: true,  html: '<span class="tk-op">&lt;?php</span> <span class="tk-kw">foreach</span> (<span class="tk-var">$champions</span> <span class="tk-kw">as</span> <span class="tk-var">$c</span>): <span class="tk-op">?&gt;</span>' },
        { hl: false, html: '  <span class="tk-tag">&lt;div</span> <span class="tk-attr">class</span>=<span class="tk-val">"card"</span><span class="tk-tag">&gt;</span>' },
        { hl: false, html: '    <span class="tk-tag">&lt;img</span> <span class="tk-attr">src</span>=<span class="tk-val">"images/&lt;?= $c[\'image\'] ?&gt;"</span><span class="tk-tag">&gt;</span>' },
        { hl: false, html: '    <span class="tk-tag">&lt;h3&gt;</span><span class="tk-op">&lt;?=</span> <span class="tk-fn">htmlspecialchars</span>(<span class="tk-var">$c</span>[<span class="tk-str">\'name\'</span>]) <span class="tk-op">?&gt;</span><span class="tk-tag">&lt;/h3&gt;</span>' },
        { hl: false, html: '  <span class="tk-tag">&lt;/div&gt;</span>' },
        { hl: false, html: '<span class="tk-op">&lt;?php</span> <span class="tk-kw">endforeach</span>; <span class="tk-op">?&gt;</span>' },
      ]
    },
    {
      filename: 'schema.sql',
      lang: 'MySQL',
      title: 'Base de données MySQL — Champions & Capacités',
      explanation: 'La base contient <code>champions</code> avec les stats (PV, armure, attaque), leur rôle et leur image, et <code>abilities</code> avec les 4 compétences par champion (Q, W, E, R). Un <code>INDEX</code> sur le nom accélère les recherches.',
      code: [
        { hl: false, html: '<span class="tk-cmt">-- schema.sql — League of Legends DB</span>' },
        { hl: false, html: '' },
        { hl: false, html: '<span class="tk-kw">CREATE TABLE</span> champions (' },
        { hl: false, html: '  id          <span class="tk-cls">INT AUTO_INCREMENT PRIMARY KEY</span>,' },
        { hl: false, html: '  name        <span class="tk-cls">VARCHAR</span>(<span class="tk-num">100</span>) <span class="tk-kw">NOT NULL</span>,' },
        { hl: false, html: '  role        <span class="tk-cls">VARCHAR</span>(<span class="tk-num">50</span>),   <span class="tk-cmt">-- Mage, Tank, ADC...</span>' },
        { hl: false, html: '  hp          <span class="tk-cls">INT DEFAULT</span> <span class="tk-num">550</span>,' },
        { hl: false, html: '  armor       <span class="tk-cls">INT DEFAULT</span> <span class="tk-num">28</span>,' },
        { hl: false, html: '  attack      <span class="tk-cls">INT DEFAULT</span> <span class="tk-num">55</span>,' },
        { hl: false, html: '  image       <span class="tk-cls">VARCHAR</span>(<span class="tk-num">255</span>),' },
        { hl: false, html: '  description <span class="tk-cls">TEXT</span>' },
        { hl: false, html: ');' },
        { hl: false, html: '' },
        { hl: true,  html: '<span class="tk-kw">CREATE INDEX</span> idx_champion_name <span class="tk-kw">ON</span> champions(name);' },
        { hl: false, html: '' },
        { hl: false, html: '<span class="tk-kw">CREATE TABLE</span> abilities (' },
        { hl: false, html: '  id           <span class="tk-cls">INT AUTO_INCREMENT PRIMARY KEY</span>,' },
        { hl: false, html: '  champion_id  <span class="tk-cls">INT REFERENCES</span> champions(id),' },
        { hl: false, html: '  ability_key  <span class="tk-cls">CHAR</span>(<span class="tk-num">1</span>),  <span class="tk-cmt">-- Q, W, E, R</span>' },
        { hl: false, html: '  name         <span class="tk-cls">VARCHAR</span>(<span class="tk-num">100</span>),' },
        { hl: false, html: '  description  <span class="tk-cls">TEXT</span>' },
        { hl: false, html: ');' },
        { hl: false, html: '' },
        { hl: true,  html: '<span class="tk-kw">INSERT INTO</span> champions (name, role, hp, attack, image)' },
        { hl: false, html: '<span class="tk-kw">VALUES</span> (<span class="tk-str">\'Ahri\'</span>, <span class="tk-str">\'Mage\'</span>, <span class="tk-num">590</span>, <span class="tk-num">53</span>, <span class="tk-str">\'ahri.jpg\'</span>);' },
      ]
    },
  ],

  'gsb-conges': [
    {
      filename: 'LeaveRequestForm.cs',
      lang: 'C# / Windows Forms',
      title: 'Demande de congés — Formulaire C#',
      explanation: 'Le formulaire Windows Forms récupère les dates sélectionnées et calcule le nombre de jours. Avant de soumettre, il vérifie via <code>ApiClient.GetLeaveBalance()</code> que le solde est suffisant. La requête est envoyée à l\'API Laravel en JSON via <code>HttpClient</code>.',
      code: [
        { hl: false, html: '<span class="tk-cmt">// LeaveRequestForm.cs — Windows Forms C#</span>' },
        { hl: false, html: '<span class="tk-kw">private async void</span> <span class="tk-fn">BtnSubmit_Click</span>(<span class="tk-kw">object</span> sender, <span class="tk-cls">EventArgs</span> e) {' },
        { hl: true,  html: '  <span class="tk-kw">var</span> startDate <span class="tk-op">=</span> datePickerStart.Value;' },
        { hl: true,  html: '  <span class="tk-kw">var</span> endDate   <span class="tk-op">=</span> datePickerEnd.Value;' },
        { hl: false, html: '  <span class="tk-kw">int</span> days <span class="tk-op">=</span> (<span class="tk-kw">int</span>)(endDate <span class="tk-op">-</span> startDate).TotalDays <span class="tk-op">+</span> <span class="tk-num">1</span>;' },
        { hl: false, html: '' },
        { hl: false, html: '  <span class="tk-cmt">// Vérifier le solde via API Laravel</span>' },
        { hl: false, html: '  <span class="tk-kw">int</span> balance <span class="tk-op">=</span> <span class="tk-kw">await</span> ApiClient.<span class="tk-fn">GetLeaveBalance</span>(currentUser.Id);' },
        { hl: false, html: '  <span class="tk-kw">if</span> (days <span class="tk-op">&gt;</span> balance) {' },
        { hl: false, html: '    <span class="tk-cls">MessageBox</span>.<span class="tk-fn">Show</span>(<span class="tk-str">"Solde insuffisant"</span>, <span class="tk-str">"Erreur"</span>);' },
        { hl: false, html: '    <span class="tk-kw">return</span>;' },
        { hl: false, html: '  }' },
        { hl: false, html: '' },
        { hl: true,  html: '  <span class="tk-kw">var</span> result <span class="tk-op">=</span> <span class="tk-kw">await</span> ApiClient.<span class="tk-fn">PostLeaveRequest</span>(<span class="tk-kw">new</span> {' },
        { hl: false, html: '    userId    <span class="tk-op">=</span> currentUser.Id,' },
        { hl: false, html: '    startDate <span class="tk-op">=</span> startDate.<span class="tk-fn">ToString</span>(<span class="tk-str">"yyyy-MM-dd"</span>),' },
        { hl: false, html: '    endDate   <span class="tk-op">=</span> endDate.<span class="tk-fn">ToString</span>(<span class="tk-str">"yyyy-MM-dd"</span>),' },
        { hl: false, html: '    days      <span class="tk-op">=</span> days' },
        { hl: false, html: '  });' },
        { hl: false, html: '  <span class="tk-cls">MessageBox</span>.<span class="tk-fn">Show</span>(<span class="tk-str">"Demande envoyée !"</span>);' },
        { hl: false, html: '}' },
      ]
    },
    {
      filename: 'LeaveController.php',
      lang: 'Laravel / PHP',
      title: 'API REST Laravel — Panel RH',
      explanation: 'L\'API expose <code>POST /api/leaves</code> pour créer une demande et <code>PATCH /api/leaves/{id}</code> pour l\'accepter ou la refuser. Lors d\'une validation, le solde est automatiquement décrémenté dans <code>leave_balances</code> via <code>decrement()</code>.',
      code: [
        { hl: false, html: '<span class="tk-cmt">// LeaveController.php — API REST Laravel</span>' },
        { hl: false, html: '<span class="tk-kw">class</span> <span class="tk-cls">LeaveController</span> <span class="tk-kw">extends</span> <span class="tk-cls">Controller</span> {' },
        { hl: false, html: '' },
        { hl: false, html: '  <span class="tk-kw">public function</span> <span class="tk-fn">store</span>(<span class="tk-cls">Request</span> <span class="tk-var">$request</span>) {' },
        { hl: false, html: '    <span class="tk-var">$request</span>-&gt;<span class="tk-fn">validate</span>([' },
        { hl: false, html: '      <span class="tk-str">\'user_id\'</span>    =&gt; <span class="tk-str">\'required|exists:users,id\'</span>,' },
        { hl: false, html: '      <span class="tk-str">\'start_date\'</span> =&gt; <span class="tk-str">\'required|date\'</span>,' },
        { hl: false, html: '      <span class="tk-str">\'end_date\'</span>   =&gt; <span class="tk-str">\'required|date|after:start_date\'</span>,' },
        { hl: false, html: '    ]);' },
        { hl: true,  html: '    <span class="tk-kw">return</span> <span class="tk-cls">LeaveRequest</span>::<span class="tk-fn">create</span>([' },
        { hl: false, html: '      ...<span class="tk-var">$request</span>-&gt;<span class="tk-fn">all</span>(),' },
        { hl: false, html: '      <span class="tk-str">\'status\'</span> =&gt; <span class="tk-str">\'pending\'</span>' },
        { hl: false, html: '    ]);' },
        { hl: false, html: '  }' },
        { hl: false, html: '' },
        { hl: false, html: '  <span class="tk-kw">public function</span> <span class="tk-fn">updateStatus</span>(<span class="tk-cls">LeaveRequest</span> <span class="tk-var">$leave</span>, <span class="tk-cls">Request</span> <span class="tk-var">$req</span>) {' },
        { hl: false, html: '    <span class="tk-var">$leave</span>-&gt;<span class="tk-fn">update</span>([<span class="tk-str">\'status\'</span> =&gt; <span class="tk-var">$req</span>-&gt;<span class="tk-prop">status</span>]);' },
        { hl: true,  html: '    <span class="tk-kw">if</span> (<span class="tk-var">$req</span>-&gt;<span class="tk-prop">status</span> <span class="tk-op">===</span> <span class="tk-str">\'approved\'</span>) {' },
        { hl: false, html: '      <span class="tk-cls">LeaveBalance</span>::<span class="tk-fn">where</span>(<span class="tk-str">\'user_id\'</span>, <span class="tk-var">$leave</span>-&gt;<span class="tk-prop">user_id</span>)' },
        { hl: false, html: '        -&gt;<span class="tk-fn">decrement</span>(<span class="tk-str">\'days\'</span>, <span class="tk-var">$leave</span>-&gt;<span class="tk-prop">days</span>);' },
        { hl: false, html: '    }' },
        { hl: false, html: '  }' },
        { hl: false, html: '}' },
      ]
    },
  ],

  'gsb-salaires': [
    {
      filename: 'SalaireController.php',
      lang: 'Laravel / PHP',
      title: 'Calcul automatique de l\'échelon',
      explanation: 'La méthode <code>getEchelon()</code> convertit les jours d\'ancienneté en l\'un des 13 échelons via un <code>match</code>. Dès qu\'une ancienneté est modifiée, <code>updateSalary()</code> recalcule l\'échelon et récupère le salaire brut depuis la table <code>echelons</code>.',
      code: [
        { hl: false, html: '<span class="tk-cmt">// SalaireController.php — Calcul échelon</span>' },
        { hl: false, html: '<span class="tk-kw">private function</span> <span class="tk-fn">getEchelon</span>(<span class="tk-kw">int</span> <span class="tk-var">$jours</span>): <span class="tk-kw">int</span> {' },
        { hl: false, html: '  <span class="tk-var">$annees</span> <span class="tk-op">=</span> <span class="tk-var">$jours</span> <span class="tk-op">/</span> <span class="tk-num">365</span>;' },
        { hl: false, html: '' },
        { hl: true,  html: '  <span class="tk-kw">return match</span>(<span class="tk-kw">true</span>) {' },
        { hl: false, html: '    <span class="tk-var">$annees</span> <span class="tk-op">&lt;</span>  <span class="tk-num">2</span>  =&gt; <span class="tk-num">1</span>,' },
        { hl: false, html: '    <span class="tk-var">$annees</span> <span class="tk-op">&lt;</span>  <span class="tk-num">4</span>  =&gt; <span class="tk-num">2</span>,' },
        { hl: false, html: '    <span class="tk-var">$annees</span> <span class="tk-op">&lt;</span>  <span class="tk-num">6</span>  =&gt; <span class="tk-num">3</span>,' },
        { hl: false, html: '    <span class="tk-cmt">    // ... 4→8 (par pas de 2 ans)</span>' },
        { hl: false, html: '    <span class="tk-var">$annees</span> <span class="tk-op">&lt;</span> <span class="tk-num">20</span>  =&gt; <span class="tk-num">10</span>,' },
        { hl: false, html: '    <span class="tk-var">$annees</span> <span class="tk-op">&lt;</span> <span class="tk-num">28</span>  =&gt; <span class="tk-num">12</span>,' },
        { hl: false, html: '    <span class="tk-kw">default</span>         =&gt; <span class="tk-num">13</span>,  <span class="tk-cmt">// 32+ ans</span>' },
        { hl: false, html: '  };' },
        { hl: false, html: '}' },
        { hl: false, html: '' },
        { hl: false, html: '<span class="tk-kw">public function</span> <span class="tk-fn">updateSalary</span>(<span class="tk-cls">Request</span> <span class="tk-var">$req</span>, <span class="tk-kw">int</span> <span class="tk-var">$id</span>) {' },
        { hl: false, html: '  <span class="tk-var">$praticien</span> <span class="tk-op">=</span> <span class="tk-cls">Praticien</span>::<span class="tk-fn">findOrFail</span>(<span class="tk-var">$id</span>);' },
        { hl: false, html: '  <span class="tk-var">$praticien</span>-&gt;<span class="tk-fn">update</span>([<span class="tk-str">\'anciennete\'</span> =&gt; <span class="tk-var">$req</span>-&gt;<span class="tk-prop">anciennete</span>]);' },
        { hl: true,  html: '  <span class="tk-var">$echelon</span> <span class="tk-op">=</span> <span class="tk-var">$this</span>-&gt;<span class="tk-fn">getEchelon</span>(<span class="tk-var">$req</span>-&gt;<span class="tk-prop">anciennete</span>);' },
        { hl: true,  html: '  <span class="tk-var">$salaire</span> <span class="tk-op">=</span> <span class="tk-cls">Echelon</span>::<span class="tk-fn">find</span>(<span class="tk-var">$echelon</span>)-&gt;<span class="tk-prop">salaire_brut</span>;' },
        { hl: false, html: '  <span class="tk-var">$praticien</span>-&gt;<span class="tk-fn">update</span>(compact(<span class="tk-str">\'echelon\'</span>, <span class="tk-str">\'salaire\'</span>));' },
        { hl: false, html: '}' },
      ]
    },
    {
      filename: 'api.php',
      lang: 'Laravel / API REST',
      title: 'API REST — Endpoint praticiens JSON',
      explanation: 'Les routes <code>routes/api.php</code> exposent les données pour le futur portage Flutter (Mission 3). L\'<code>ApiResource</code> sérialise chaque praticien avec son ancienneté, son échelon et son salaire brut au format JSON propre.',
      code: [
        { hl: false, html: '<span class="tk-cmt">// routes/api.php — Endpoints REST Laravel</span>' },
        { hl: false, html: '<span class="tk-cls">Route</span>::<span class="tk-fn">prefix</span>(<span class="tk-str">\'v1\'</span>)-&gt;<span class="tk-fn">group</span>(<span class="tk-kw">function</span> () {' },
        { hl: true,  html: '  <span class="tk-cls">Route</span>::<span class="tk-fn">get</span>(<span class="tk-str">\'/praticiens\'</span>, [<span class="tk-cls">PraticienController</span>::<span class="tk-kw">class</span>, <span class="tk-str">\'index\'</span>]);' },
        { hl: false, html: '  <span class="tk-cls">Route</span>::<span class="tk-fn">get</span>(<span class="tk-str">\'/praticiens/{id}\'</span>, [<span class="tk-cls">PraticienController</span>::<span class="tk-kw">class</span>, <span class="tk-str">\'show\'</span>]);' },
        { hl: true,  html: '  <span class="tk-cls">Route</span>::<span class="tk-fn">patch</span>(<span class="tk-str">\'/praticiens/{id}/anciennete\'</span>,' },
        { hl: false, html: '    [<span class="tk-cls">SalaireController</span>::<span class="tk-kw">class</span>, <span class="tk-str">\'updateSalary\'</span>]);' },
        { hl: false, html: '  <span class="tk-cls">Route</span>::<span class="tk-fn">get</span>(<span class="tk-str">\'/praticiens/{id}/commentaires\'</span>,' },
        { hl: false, html: '    [<span class="tk-cls">CommentaireController</span>::<span class="tk-kw">class</span>, <span class="tk-str">\'forPraticien\'</span>]);' },
        { hl: false, html: '});' },
        { hl: false, html: '' },
        { hl: false, html: '<span class="tk-cmt">// PraticienResource.php — Sérialisation JSON</span>' },
        { hl: false, html: '<span class="tk-kw">class</span> <span class="tk-cls">PraticienResource</span> <span class="tk-kw">extends</span> <span class="tk-cls">JsonResource</span> {' },
        { hl: false, html: '  <span class="tk-kw">public function</span> <span class="tk-fn">toArray</span>(<span class="tk-var">$request</span>) {' },
        { hl: true,  html: '    <span class="tk-kw">return</span> [' },
        { hl: false, html: '      <span class="tk-str">\'id\'</span>         =&gt; <span class="tk-var">$this</span>-&gt;<span class="tk-prop">id</span>,' },
        { hl: false, html: '      <span class="tk-str">\'nom\'</span>        =&gt; <span class="tk-var">$this</span>-&gt;<span class="tk-prop">nom</span>,' },
        { hl: false, html: '      <span class="tk-str">\'anciennete\'</span> =&gt; <span class="tk-var">$this</span>-&gt;<span class="tk-prop">anciennete</span>,' },
        { hl: false, html: '      <span class="tk-str">\'echelon\'</span>    =&gt; <span class="tk-var">$this</span>-&gt;<span class="tk-prop">echelon</span>,' },
        { hl: false, html: '      <span class="tk-str">\'salaire\'</span>    =&gt; <span class="tk-var">$this</span>-&gt;<span class="tk-prop">salaire_brut</span>,' },
        { hl: false, html: '    ];' },
        { hl: false, html: '  }' },
        { hl: false, html: '}' },
      ]
    },
  ],

  'gsb-notes': [
    {
      filename: 'praticien_service.dart',
      lang: 'Flutter / Dart',
      title: 'Fetch API & Tri côté client',
      explanation: 'Le service effectue <code>GET /v1/praticiens</code> et parse le JSON en objets <code>Praticien</code>. La méthode <code>sortBy()</code> trie la liste localement selon la note choisie (clientèle ou expert) — instantané, sans nouveau call API.',
      code: [
        { hl: false, html: '<span class="tk-cmt">// praticien_service.dart — API + Tri local</span>' },
        { hl: false, html: '<span class="tk-kw">class</span> <span class="tk-cls">PraticienService</span> {' },
        { hl: false, html: '  <span class="tk-kw">static</span> <span class="tk-kw">const</span> baseUrl <span class="tk-op">=</span> <span class="tk-str">\'https://api.gsb.local/v1\'</span>;' },
        { hl: false, html: '' },
        { hl: true,  html: '  <span class="tk-kw">static</span> <span class="tk-kw">Future</span>&lt;<span class="tk-cls">List</span>&lt;<span class="tk-cls">Praticien</span>&gt;&gt; <span class="tk-fn">fetchAll</span>() <span class="tk-kw">async</span> {' },
        { hl: false, html: '    <span class="tk-kw">final</span> res <span class="tk-op">=</span> <span class="tk-kw">await</span> http.<span class="tk-fn">get</span>(<span class="tk-cls">Uri</span>.<span class="tk-fn">parse</span>(<span class="tk-str">\'$baseUrl/praticiens\'</span>));' },
        { hl: false, html: '    <span class="tk-kw">if</span> (res.statusCode <span class="tk-op">!=</span> <span class="tk-num">200</span>) <span class="tk-kw">throw</span> <span class="tk-cls">Exception</span>(<span class="tk-str">\'Erreur API\'</span>);' },
        { hl: false, html: '    <span class="tk-kw">final</span> List data <span class="tk-op">=</span> jsonDecode(res.body);' },
        { hl: true,  html: '    <span class="tk-kw">return</span> data.<span class="tk-fn">map</span>((j) =&gt; <span class="tk-cls">Praticien</span>.<span class="tk-fn">fromJson</span>(j)).<span class="tk-fn">toList</span>();' },
        { hl: false, html: '  }' },
        { hl: false, html: '' },
        { hl: false, html: '  <span class="tk-cmt">// Tri côté client — sans appel serveur</span>' },
        { hl: false, html: '  <span class="tk-kw">static</span> <span class="tk-cls">List</span>&lt;<span class="tk-cls">Praticien</span>&gt; <span class="tk-fn">sortBy</span>(' },
        { hl: false, html: '    <span class="tk-cls">List</span>&lt;<span class="tk-cls">Praticien</span>&gt; list, <span class="tk-cls">String</span> criterion' },
        { hl: false, html: '  ) {' },
        { hl: false, html: '    <span class="tk-kw">final</span> sorted <span class="tk-op">=</span> [...list];' },
        { hl: true,  html: '    sorted.<span class="tk-fn">sort</span>((a, b) =&gt; criterion <span class="tk-op">==</span> <span class="tk-str">\'client\'</span>' },
        { hl: false, html: '      ? b.noteClient.<span class="tk-fn">compareTo</span>(a.noteClient)' },
        { hl: false, html: '      : b.noteExpert.<span class="tk-fn">compareTo</span>(a.noteExpert)' },
        { hl: false, html: '    );' },
        { hl: false, html: '    <span class="tk-kw">return</span> sorted;' },
        { hl: false, html: '  }' },
        { hl: false, html: '}' },
      ]
    },
    {
      filename: 'praticien_detail.dart',
      lang: 'Flutter / Dart',
      title: 'Fiche détail — Notes étoiles & Commentaires',
      explanation: 'L\'écran de détail affiche les deux notes en étoiles via le widget <code>StarRating</code>. Les commentaires sont chargés via <code>fetchCommentaires(id)</code> (<code>GET /praticiens/{id}/commentaires</code>) et affichés dans un <code>ListView</code> scrollable indépendant.',
      code: [
        { hl: false, html: '<span class="tk-cmt">// praticien_detail.dart — Fiche complète</span>' },
        { hl: false, html: '<span class="tk-kw">class</span> <span class="tk-cls">PraticienDetailScreen</span> <span class="tk-kw">extends</span> <span class="tk-cls">StatefulWidget</span> {' },
        { hl: false, html: '  <span class="tk-kw">final</span> <span class="tk-cls">Praticien</span> praticien;' },
        { hl: false, html: '' },
        { hl: false, html: '  <span class="tk-ann">@override</span>' },
        { hl: false, html: '  <span class="tk-cls">Widget</span> <span class="tk-fn">build</span>(<span class="tk-cls">BuildContext</span> context) {' },
        { hl: false, html: '    <span class="tk-kw">return</span> <span class="tk-cls">Scaffold</span>(' },
        { hl: false, html: '      body: <span class="tk-cls">Column</span>(children: [' },
        { hl: true,  html: '        <span class="tk-cls">StarRating</span>(note: praticien.noteExpert, label: <span class="tk-str">\'Note Expert\'</span>),' },
        { hl: true,  html: '        <span class="tk-cls">StarRating</span>(note: praticien.noteClient, label: <span class="tk-str">\'Note Clientèle\'</span>),' },
        { hl: false, html: '' },
        { hl: false, html: '        <span class="tk-cmt">// Commentaires — ListView scrollable</span>' },
        { hl: false, html: '        <span class="tk-cls">Expanded</span>(' },
        { hl: false, html: '          child: <span class="tk-cls">FutureBuilder</span>&lt;<span class="tk-cls">List</span>&lt;<span class="tk-cls">Commentaire</span>&gt;&gt;(' },
        { hl: true,  html: '            future: <span class="tk-cls">PraticienService</span>.<span class="tk-fn">fetchCommentaires</span>(praticien.id),' },
        { hl: false, html: '            builder: (ctx, snap) =&gt; <span class="tk-cls">ListView</span>.<span class="tk-fn">builder</span>(' },
        { hl: false, html: '              itemCount: snap.data?.length <span class="tk-op">??</span> <span class="tk-num">0</span>,' },
        { hl: false, html: '              itemBuilder: (_, i) =&gt; <span class="tk-cls">CommentaireTile</span>(' },
        { hl: false, html: '                commentaire: snap.data![i]' },
        { hl: false, html: '              ),' },
        { hl: false, html: '            ),' },
        { hl: false, html: '          ),' },
        { hl: false, html: '        ),' },
        { hl: false, html: '      ]),' },
        { hl: false, html: '    );' },
        { hl: false, html: '  }' },
        { hl: false, html: '}' },
      ]
    },
  ],

};

/* ════════════════════════════════════════════════════════
   MOTEUR DE RENDU — Génère le HTML du carrousel
════════════════════════════════════════════════════════ */

function buildCodeCarousel(modalId) {
  var slides = CODE_SLIDES_DATA[modalId];
  if (!slides || !slides.length) return '';
  var carouselId = 'codeCarousel_' + modalId;

  var slidesHTML = slides.map(function(slide, i) {
    var linesHTML = slide.code.map(function(line) {
      if (line.hl) {
        return '<span class="code-line hl">' + line.html + '</span>';
      }
      return '<span class="code-line">' + line.html + '</span>';
    }).join('\n');

    return '<div class="code-slide' + (i === 0 ? ' active' : '') + '">' +
      '<div class="code-window">' +
        '<div class="code-window-bar">' +
          '<div class="code-window-dots">' +
            '<div class="code-dot red"></div>' +
            '<div class="code-dot yellow"></div>' +
            '<div class="code-dot green"></div>' +
          '</div>' +
          '<div class="code-window-filename">' + slide.filename + '</div>' +
          '<div class="code-window-lang">' + slide.lang + '</div>' +
        '</div>' +
        '<div class="code-window-content">' +
          '<pre class="code-block">' + linesHTML + '</pre>' +
        '</div>' +
      '</div>' +
      '<div class="code-explanation">' +
        '<div class="code-explanation-title">' + slide.title + '</div>' +
        '<div class="code-explanation-text">' + slide.explanation + '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  var dotsHTML = slides.map(function(_, i) {
    return '<div class="code-carousel-dot' + (i === 0 ? ' active' : '') + '" ' +
      'onclick="goCodeSlideIndex(\'' + carouselId + '\',' + i + ')"></div>';
  }).join('');

  return '<div class="code-carousel">' +
    '<div class="code-carousel-header">' +
      '<div class="code-carousel-title">&#x1F4BB; Extraits de code</div>' +
      '<div class="code-carousel-sub">Cliquer sur les lignes surlignées pour les points clés</div>' +
    '</div>' +
    '<div id="' + carouselId + '" class="code-slide-wrap">' +
      slidesHTML +
      '<div class="code-carousel-nav">' +
        '<button class="code-nav-btn code-nav-prev" onclick="goCodeSlide(\'' + carouselId + '\',-1)" disabled>&#x2039; Préc.</button>' +
        '<span class="code-carousel-counter">1 / ' + slides.length + '</span>' +
        '<button class="code-nav-btn code-nav-next" onclick="goCodeSlide(\'' + carouselId + '\',1)"' + (slides.length <= 1 ? ' disabled' : '') + '>Suiv. &#x203A;</button>' +
      '</div>' +
      '<div class="code-carousel-dots">' + dotsHTML + '</div>' +
    '</div>' +
  '</div>';
}

/* ════════════════════════════════════════════════════════
   INITIALISATION — Injecter les onglets dans les modals
════════════════════════════════════════════════════════ */

function injectCodeTabsIntoModals() {
  var modals = [
    'animaland', 'animalvest', 'taskmanager', 'lol',
    'gsb-conges', 'gsb-salaires', 'gsb-notes'
  ];

  modals.forEach(function(modalId) {
    var modal = document.getElementById('modal-' + modalId);
    if (!modal) return;

    var body = modal.querySelector('.modal-body');
    if (!body) return;

    // Ajouter les onglets après le modal-header
    var header = modal.querySelector('.modal-header');
    if (!header) return;

    // Créer la barre d'onglets
    var tabsBar = document.createElement('div');
    tabsBar.className = 'modal-tabs';
    tabsBar.innerHTML =
      '<button class="modal-tab-btn active" data-tab="features" ' +
        'onclick="switchModalTab(\'' + modalId + '\',\'features\')">' +
        '<span class="tab-icon">&#x2756;</span> Fonctionnalités' +
      '</button>' +
      '<button class="modal-tab-btn" data-tab="code" ' +
        'onclick="switchModalTab(\'' + modalId + '\',\'code\')">' +
        '<span class="tab-icon">&#x1F4BB;</span> Voir les codes' +
      '</button>';

    // Wraper le contenu du body dans un panel "features"
    var featuresPanel = document.createElement('div');
    featuresPanel.className = 'modal-tab-panel active';
    featuresPanel.dataset.panel = 'features';
    while (body.firstChild) {
      featuresPanel.appendChild(body.firstChild);
    }

    // Créer le panel "code"
    var codePanel = document.createElement('div');
    codePanel.className = 'modal-tab-panel';
    codePanel.dataset.panel = 'code';
    codePanel.innerHTML = buildCodeCarousel(modalId);

    body.appendChild(featuresPanel);
    body.appendChild(codePanel);

    // Insérer la barre d'onglets entre header et body
    modal.insertBefore(tabsBar, body);
  });
}

// Lancer après le chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
  injectCodeTabsIntoModals();
});

/* ════════════════════════════════════════════════════════
   SYSTÈME D'ONGLETS — switchModalTab
════════════════════════════════════════════════════════ */
function switchModalTab(modalId, tabName) {
  var modal = document.getElementById('modal-' + modalId);
  if (!modal) return;

  modal.querySelectorAll('.modal-tab-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  modal.querySelectorAll('.modal-tab-panel').forEach(function(panel) {
    panel.classList.toggle('active', panel.dataset.panel === tabName);
  });

  // Init le carrousel si premier affichage
  if (tabName === 'code') {
    var carouselId = 'codeCarousel_' + modalId;
    if (_codeCarousels[carouselId] === undefined) {
      _codeCarousels[carouselId] = 0;
      _updateCodeCarousel(carouselId);
    }
  }
}

/* ════════════════════════════════════════════════════════
   CARROUSEL — Navigation
════════════════════════════════════════════════════════ */
var _codeCarousels = {};

function goCodeSlide(carouselId, dir) {
  var slides = document.querySelectorAll('#' + carouselId + ' .code-slide');
  if (!slides.length) return;
  var current = _codeCarousels[carouselId] || 0;
  var next = current + dir;
  if (next < 0 || next >= slides.length) return;
  _codeCarousels[carouselId] = next;
  _updateCodeCarousel(carouselId);
}

function goCodeSlideIndex(carouselId, idx) {
  var slides = document.querySelectorAll('#' + carouselId + ' .code-slide');
  if (idx < 0 || idx >= slides.length) return;
  _codeCarousels[carouselId] = idx;
  _updateCodeCarousel(carouselId);
}

function _updateCodeCarousel(carouselId) {
  var container = document.getElementById(carouselId);
  if (!container) return;
  var slides  = container.querySelectorAll('.code-slide');
  var dots    = container.querySelectorAll('.code-carousel-dot');
  var counter = container.querySelector('.code-carousel-counter');
  var prevBtn = container.querySelector('.code-nav-prev');
  var nextBtn = container.querySelector('.code-nav-next');
  var current = _codeCarousels[carouselId] || 0;

  slides.forEach(function(s, i) { s.classList.toggle('active', i === current); });
  dots.forEach(function(d, i)   { d.classList.toggle('active', i === current); });
  if (counter) counter.textContent = (current + 1) + ' / ' + slides.length;
  if (prevBtn) prevBtn.disabled = current === 0;
  if (nextBtn) nextBtn.disabled = current === slides.length - 1;
}

