import { test, expect } from '@playwright/test';

test('gallery filter works on direct load and after PJAX navigation', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));

  // 直开画廊
  await page.goto('/gallery/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await expect(page.locator('.gallery-item:not([hidden])')).toHaveCount(9);

  // 点击「旅行」→ 3 张
  await page.locator('.jelly-radio__chip[data-filter="旅行"]').click();
  await expect(page.locator('.gallery-item:not([hidden])')).toHaveCount(3);
  await expect(page.locator('.jelly-radio__chip[data-filter="旅行"]')).toHaveAttribute('data-on', 'true');

  // 经 PJAX 导航到足迹页再返回画廊
  await page.goto('/footprints/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  // 用站点内链接触发 ClientRouter（若有）；否则用浏览器返回模拟 SPA 回退
  await page.goBack({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 返回后应重置为「全部」且点击仍生效
  await expect(page.locator('.jelly-radio__chip[data-filter="全部"]').first()).toHaveAttribute('data-on', 'true');
  await page.locator('.jelly-radio__chip[data-filter="创作"]').first().click();
  await expect(page.locator('.gallery-item:not([hidden])')).toHaveCount(2);

  const fpErrors = errors.filter((m) => /gallery|jelly/i.test(m));
  expect(fpErrors).toEqual([]);
});
