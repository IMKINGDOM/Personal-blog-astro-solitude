// 页脚区域悬浮元素显隐：仅当页脚底栏进入视口时，左侧（天气/音乐/版权）与
// 右侧（协议标识/设置）两组元素默认隐藏，鼠标移到对应侧才显现，离开后隐藏。
// 监听器只注册一次，ClientRouter 换页后通过重新观察底栏节点保持有效。
let observer: IntersectionObserver | null = null;
let observed: Element | null = null;

function watchFooterBar() {
  const bar = document.querySelector('#footer-bar');
  if (!bar || bar === observed) return;
  observed = bar;
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      document.documentElement.classList.toggle('footer-bar-in-view', Boolean(entry?.isIntersecting));
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  observer.observe(bar);
}

function onMove(event: MouseEvent) {
  const root = document.documentElement;
  if (!root.classList.contains('footer-bar-in-view')) return;
  const bar = document.querySelector('#footer-bar');
  if (!bar) return;
  const rect = bar.getBoundingClientRect();
  const withinX = event.clientX >= rect.left && event.clientX <= rect.right;
  const withinY = event.clientY >= rect.top - 120 && event.clientY <= rect.bottom + 30;
  if (!withinX || !withinY) {
    root.classList.remove('footer-show-left', 'footer-show-right');
    return;
  }
  const mid = rect.left + rect.width / 2;
  root.classList.toggle('footer-show-left', event.clientX < mid);
  root.classList.toggle('footer-show-right', event.clientX >= mid);
}

function reset() {
  document.documentElement.classList.remove(
    'footer-bar-in-view',
    'footer-show-left',
    'footer-show-right',
  );
}

document.addEventListener('mousemove', onMove, { passive: true });
document.addEventListener('astro:page-load', watchFooterBar);
document.addEventListener('astro:before-swap', reset);
watchFooterBar();
