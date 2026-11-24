// 液态玻璃开关 —— 照搬参考站 blog.quicer.top 的完整控制逻辑
// 状态 100% 依赖 localStorage['liquid-glass']，无记录 = 默认开
(function () {
  'use strict';
  if (window.__quiGlassControl) return;
  window.__quiGlassControl = true;

  var KEY = 'liquid-glass';
  var TIP_KEY = 'glass-tip-dismissed';
  var TIP_VER = '1';
  var root = document.documentElement;
  var BTN_IDS = ['rightsideGlass'];
  var TOGGLE_SEL = '#rightsideGlass';

  function isOn() {
    try { return localStorage.getItem(KEY) !== 'off'; } catch (e) { return true; }
  }
  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function write(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }

  function paint(on) {
    for (var i = 0; i < BTN_IDS.length; i++) {
      var b = document.getElementById(BTN_IDS[i]);
      if (b) b.classList.toggle('on', on);
    }
  }
  function syncUI() {
    var on = isOn();
    root.classList.toggle('no-glass', !on);
    paint(on);
    return on;
  }
  function apply(on) {
    root.classList.toggle('no-glass', !on);
    paint(on);
    try { document.dispatchEvent(new CustomEvent('glass:change', { detail: { on: !!on } })); } catch (e) {}
  }
  function set(on, persist) {
    apply(on);
    if (persist !== false) write(KEY, on ? 'on' : 'off');
  }
  function toast(text) {
    try {
      if (window.Solitude && typeof window.Solitude.snackbarShow === 'function') {
        window.Solitude.snackbarShow(text, false, 2000);
      } else {
        var t = document.createElement('div');
        t.className = 'glass-toast';
        t.textContent = text;
        document.body.appendChild(t);
        setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2000);
      }
    } catch (e) {}
  }

  syncUI();

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (!t.closest(TOGGLE_SEL)) return;
    e.preventDefault();
    e.stopPropagation();
    var next = !isOn();
    set(next);
    toast(next ? '已开启液态玻璃效果' : '已关闭液态玻璃效果');
  }, true);

  document.addEventListener('pjax:complete', syncUI);
  document.addEventListener('pageshow', syncUI);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) syncUI();
  });

  window.QuiGlass = { isOn: isOn, set: set, apply: apply, sync: syncUI };

  // 低端设备检测：强信号 + 实测帧率
  function strongSignal() {
    try {
      var c = navigator.connection;
      if (c) {
        if (c.saveData) return 'saveData';
        if (c.effectiveType === 'slow-2g' || c.effectiveType === '2g') return 'net=' + c.effectiveType;
      }
      var m = navigator.deviceMemory;
      if (typeof m === 'number' && m <= 2) return 'mem=' + m + 'GB';
      var h = navigator.hardwareConcurrency;
      if (typeof h === 'number' && h <= 2) return 'cores=' + h;
    } catch (e) {}
    return null;
  }
  function measureFps(ms) {
    return new Promise(function (resolve) {
      var frames = 0, t0 = 0;
      function tick(now) {
        if (!t0) t0 = now;
        frames++;
        var dt = now - t0;
        if (dt >= ms) { resolve(Math.round((frames * 1000) / dt)); return; }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  var EV_TEXT = '您的设备性能不足，建议关闭液态玻璃以获得更好的阅读体验';
  function buildModal() {
    if (document.getElementById('glass-tip')) return;
    var el = document.createElement('div');
    el.id = 'glass-tip';
    el.className = 'gc-modal';
    el.innerHTML =
      '<div class="gc-mask"></div>' +
      '<div class="gc-panel" role="dialog" aria-modal="true" aria-label="性能提示">' +
        '<div class="gc-icon"><i class="solitude fas fa-gauge-high"></i></div>' +
        '<div class="gc-title">性能提示</div>' +
        '<div class="gc-text">' + EV_TEXT + '</div>' +
        '<div class="gc-actions">' +
          '<button type="button" class="gc-btn gc-btn-ghost" data-gc="later">暂不关闭</button>' +
          '<button type="button" class="gc-btn gc-btn-primary" data-gc="off">关闭液态玻璃</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('show'); });
    function close() {
      el.classList.remove('show');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 280);
    }
    el.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      if (t.closest('.gc-mask')) { close(); return; }
      var btn = t.closest('[data-gc]');
      if (!btn) return;
      if (btn.getAttribute('data-gc') === 'off') set(false);
      write(TIP_KEY, TIP_VER);
      close();
    });
  }
  function maybeTip() {
    if (!isOn()) return;
    if (read(TIP_KEY) === TIP_VER) return;
    if (read(KEY) !== null) return;
    if (strongSignal()) { buildModal(); return; }
    setTimeout(function () {
      if (document.hidden) return;
      measureFps(1200).then(function (fps) {
        if (!document.hidden && fps < 35) buildModal();
      }).catch(function () {});
    }, 2200);
  }
  if (document.readyState === 'complete') setTimeout(maybeTip, 300);
  else window.addEventListener('load', function () { setTimeout(maybeTip, 300); });
})();
