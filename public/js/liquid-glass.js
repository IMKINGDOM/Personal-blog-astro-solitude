// ============================================================
// Liquid Glass — SVG displacement filter (edge-refraction variant)
// Based on https://github.com/shuding/liquid-glass by Shu Ding
// Adapted for Solitude / Astro blog
//
// 原理：用 Canvas 基于圆角矩形 SDF 生成位移贴图，
// 通过 SVG feDisplacementMap 让元素后方内容产生透镜折射。
// 位移只集中在元素边框附近的薄带，内部保持清晰（边缘折射、中间清晰）。
// 注入后把 --glass-blur 升级为 url(#liquid-glass) + blur + saturate。
// 若 JS 未加载或浏览器不支持，CSS 回退到普通 blur+saturate 毛玻璃。
// ============================================================

(function () {
  'use strict';

  var FILTER_ID = 'liquid-glass';
  var SVG_ID = 'lg-svg-defs';
  var MAP_SIZE = 256;
  var SCALE = 0.12;
  var CORNER = 0.08;
  var BAND = 0.05;

  function smoothStep(a, b, t) {
    t = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  function vecLen(x, y) {
    return Math.sqrt(x * x + y * y);
  }

  function roundedRectSDF(x, y, w, h, r) {
    var qx = Math.abs(x) - w + r;
    var qy = Math.abs(y) - h + r;
    return Math.min(Math.max(qx, qy), 0) + vecLen(Math.max(qx, 0), Math.max(qy, 0)) - r;
  }

  function generateDisplacementMap() {
    var w = MAP_SIZE;
    var h = MAP_SIZE;
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    var data = new Uint8ClampedArray(w * h * 4);
    var raw = new Float32Array(w * h * 2);
    var maxScale = 0;

    for (var p = 0; p < w * h; p++) {
      var px = p % w;
      var py = (p - px) / w;
      var ix = px / w - 0.5;
      var iy = py / h - 0.5;

      var halfW = 0.5 - CORNER;
      var halfH = 0.5 - CORNER;
      var dist = roundedRectSDF(ix, iy, halfW, halfH, CORNER);

      var disp = smoothStep(0, -BAND, dist);
      var scaled = smoothStep(0, 1, disp);

      var newU = ix * scaled + 0.5;
      var newV = iy * scaled + 0.5;
      var dx = newU * w - px;
      var dy = newV * h - py;

      if (Math.abs(dx) > maxScale) maxScale = Math.abs(dx);
      if (Math.abs(dy) > maxScale) maxScale = Math.abs(dy);
      raw[p * 2] = dx;
      raw[p * 2 + 1] = dy;
    }

    maxScale = Math.max(maxScale, 1) * 0.5;
    for (var j = 0; j < data.length; j += 4) {
      var k = (j / 4) * 2;
      data[j] = Math.round((raw[k] / maxScale + 0.5) * 255);
      data[j + 1] = Math.round((raw[k + 1] / maxScale + 0.5) * 255);
      data[j + 2] = 0;
      data[j + 3] = 255;
    }

    ctx.putImageData(new ImageData(data, w, h), 0, 0);
    return { url: canvas.toDataURL(), maxScale: maxScale };
  }

  function activateFilter() {
    var backdrop = 'url(#' + FILTER_ID + ') blur(6px) saturate(1.5)';
    document.documentElement.style.setProperty('--glass-blur', backdrop);
  }

  function injectSVGFilter() {
    if (document.getElementById(SVG_ID)) {
      activateFilter();
      return;
    }

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.id = SVG_ID;
    svg.setAttribute('xmlns', svgNS);
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';

    var result = generateDisplacementMap();

    var filter = document.createElementNS(svgNS, 'filter');
    filter.setAttribute('id', FILTER_ID);
    filter.setAttribute('filterUnits', 'objectBoundingBox');
    filter.setAttribute('primitiveUnits', 'objectBoundingBox');
    filter.setAttribute('colorInterpolationFilters', 'sRGB');
    filter.setAttribute('x', '0%');
    filter.setAttribute('y', '0%');
    filter.setAttribute('width', '100%');
    filter.setAttribute('height', '100%');

    var feImage = document.createElementNS(svgNS, 'feImage');
    feImage.setAttribute('id', 'lg-map');
    feImage.setAttribute('x', '0%');
    feImage.setAttribute('y', '0%');
    feImage.setAttribute('width', '100%');
    feImage.setAttribute('height', '100%');
    feImage.setAttribute('preserveAspectRatio', 'none');
    feImage.setAttribute('result', 'map');
    feImage.setAttribute('href', result.url);
    feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', result.url);

    var feDisp = document.createElementNS(svgNS, 'feDisplacementMap');
    feDisp.setAttribute('in', 'SourceGraphic');
    feDisp.setAttribute('in2', 'map');
    feDisp.setAttribute('xChannelSelector', 'R');
    feDisp.setAttribute('yChannelSelector', 'G');
    feDisp.setAttribute('scale', SCALE.toString());

    filter.appendChild(feImage);
    filter.appendChild(feDisp);
    svg.appendChild(filter);
    document.body.appendChild(svg);

    activateFilter();
    if (window.console && console.log) {
      console.log('[liquid-glass] filter injected, scale=' + SCALE);
    }
  }

  function init() {
    requestAnimationFrame(injectSVGFilter);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
