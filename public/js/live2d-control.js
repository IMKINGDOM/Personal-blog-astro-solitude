/* LIVE2D 角色挂件开关（本地自托管 l2d-widget + 本地模型，零外网依赖）
   开关 = html.no-live2d 反向类 + localStorage['live2d']，模式照搬 glass-control.js。 */
(function () {
  'use strict';
  var KEY = 'live2d';
  var root = document.documentElement;
  var BTN_IDS = ['rightsideLive2d'];
  var TOGGLE_SEL = '#rightsideLive2d';
  var RUNTIME = '/live2d/runtime/l2d-widget.min.js';
  var MODEL = '/live2d/date/model.json';
  var widget = null;
  var loading = null;

  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function write(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function isOn() { var v = read(KEY); return v === 'on' || (v === null && false); } // 默认关
  function paint(on) {
    for (var i = 0; i < BTN_IDS.length; i++) {
      var b = document.getElementById(BTN_IDS[i]);
      if (b) b.classList.toggle('on', on);
    }
  }
  function toast(text) {
    try {
      if (window.Solitude && typeof window.Solitude.snackbarShow === 'function') {
        window.Solitude.snackbarShow(text, false, 2000);
      }
    } catch (e) {}
  }
  function loadRuntime() {
    if (window.L2D_WIDGET && window.L2D_WIDGET.createWidget) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = RUNTIME;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('LIVE2D runtime load failed')); };
      document.head.appendChild(s);
    });
    return loading;
  }
  function start() {
    if (widget) return;
    loadRuntime().then(function () {
      if (!isOn()) return; // 加载期间被关闭
      widget = window.L2D_WIDGET.createWidget({
        model: { path: MODEL, scale: 0.75, tips: false },
        position: 'bottom-right',
        size: 260,
        transitionDuration: 600,
        menus: { items: [] },   // 禁用默认菜单，避免 iconify 外网请求
        primaryColor: 'rgba(66, 90, 239, 0.9)'
      });
    }).catch(function () { toast('LIVE2D 加载失败'); });
  }
  function stop() {
    if (!widget) return;
    try { var w = widget; widget = null; w.destroy(); } catch (e) { widget = null; }
  }
  function apply(on) {
    root.classList.toggle('no-live2d', !on);
    paint(on);
    if (on) start(); else stop();
  }
  function set(on, persist) {
    apply(on);
    if (persist !== false) write(KEY, on ? 'on' : 'off');
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (!t.closest(TOGGLE_SEL)) return;
    e.preventDefault();
    e.stopPropagation();
    var next = !isOn();
    set(next);
    toast(next ? '已开启 LIVE2D 角色' : '已关闭 LIVE2D 角色');
  }, true);

  function syncUI() {
    var on = isOn();
    root.classList.toggle('no-live2d', !on);
    paint(on);
  }
  document.addEventListener('pjax:complete', syncUI);
  document.addEventListener('pageshow', syncUI);
  document.addEventListener('astro:page-load', function () {
    if (isOn()) start();
  });
  window.QuiLive2D = { isOn: isOn, set: set, apply: apply, sync: syncUI };
  syncUI();
})();
