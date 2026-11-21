import { test, expect } from '@playwright/test';

test('footprints world map: seed 30, chips, dashed lines, theme switch', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/footprints/', { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.removeItem('step-footprints-v5'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  expect(await page.evaluate(() => typeof (window as any).echarts !== 'undefined')).toBe(true);
  expect(await page.evaluate(() => typeof (window as any).WORLD_GEOJSON !== 'undefined')).toBe(true);
  // 省界地图：216 国 + 34 中国省级 = 250
  expect(await page.evaluate(() => (window as any).WORLD_GEOJSON.features.length)).toBe(250);
  const hasProvinces = await page.evaluate(() =>
    ['台湾', '江苏', '四川', '香港', '澳门'].every((n) =>
      (window as any).WORLD_GEOJSON.features.some((f: any) => f.properties.name === n)));
  expect(hasProvinces, 'China province features present').toBe(true);
  expect(await page.locator('#fp-map canvas').count()).toBeGreaterThan(0);
  await expect(page.locator('#fp-map-tip')).toBeHidden();

  // 初始 30 个坐标 + 30 个胶囊
  await expect(page.locator('.fp-desc')).toHaveText('一路山河远阔 四海星光偕行');
  await expect(page.locator('.fp-list-head h2')).toHaveText('已点亮的城市');
  // 统计：3 个国家（中国/越南/印度尼西亚）、多个省、30 座城
  await expect(page.locator('#fp-stats')).toContainText('3个国家');
  await expect(page.locator('#fp-stats')).toContainText('30座城');
  await expect(page.locator('.fp-chip')).toHaveCount(30);

  // 胶囊格式：中国China·常州Changzhou
  await expect(page.locator('.fp-chip').first()).toHaveText('中国China·常州Changzhou');
  await expect(page.locator('.fp-chip').filter({ hasText: '越南Vietnam·河内Hanoi' })).toHaveCount(1);
  await expect(page.locator('.fp-chip').filter({ hasText: '中国China·包头Baotou' })).toHaveCount(1);
  await expect(page.locator('.fp-chip').filter({ hasText: '印度尼西亚Indonesia·雅加达Jakarta' })).toHaveCount(1);

  // 补齐逻辑：写入缺包头的旧数据，刷新后应自动补上
  await page.evaluate(() => localStorage.setItem('step-footprints-v5', JSON.stringify([
    { n: '常州', e: 'Changzhou', c: '中国', p: [119.97, 31.81] }
  ])));
  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('.fp-chip').filter({ hasText: '中国China·包头Baotou' })).toHaveCount(1);
  await expect(page.locator('#fp-stats')).toContainText('30座城');

  // 胶囊样式生效（主题色背景）
  const chipBg = await page.locator('.fp-chip').first().evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(chipBg).not.toBe('rgba(0, 0, 0, 0)');

  // 删除项已移除
  await expect(page.locator('.fp-toolbar')).toHaveCount(0);
  await expect(page.locator('.fp-kicker')).toHaveCount(0);
  await expect(page.locator('#fp-results')).toHaveCount(0);
  await expect(page.locator('.fp-del')).toHaveCount(0);
  await expect(page.locator('#fp-clear')).toHaveCount(0);
  await expect(page.locator('.fp-map-caption')).toHaveCount(0);

  // 胶囊布局：一行 6 个、等宽、居中
  const gridCols = await page.locator('#fp-list').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  expect(gridCols).toBe(6);
  const chipStyle = await page.locator('.fp-chip').first().evaluate((el) => {
    const cs = getComputedStyle(el);
    return { justify: cs.justifyContent, fontSize: cs.fontSize };
  });
  expect(chipStyle.justify).toBe('center');
  expect(parseFloat(chipStyle.fontSize)).toBeLessThanOrEqual(10);

  // 主题切换重绘
  const before = await page.locator('#fp-map canvas').first().screenshot();
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.waitForTimeout(500);
  const after = await page.locator('#fp-map canvas').first().screenshot();
  expect(Buffer.compare(before, after) !== 0, 'theme switch repaints map').toBe(true);

  const fpErrors = errors.filter((m) => /echarts|WORLD_GEOJSON|fp-/.test(m));
  expect(fpErrors, `footprint errors: ${fpErrors.join(' | ')}`).toEqual([]);
});
