async page => {
  const from = Number(new URL(page.url()).searchParams.get('auditFrom') ?? 0);
  const to = Math.min(19, from + 7);
  const result = { from, to: to - 1, sections: 0, examples: 0, drills: 0, failures: [] };
  for (let n = from; n < to; n++) {
    const id = String(n).padStart(2, '0');
    await page.locator(n < 13 ? '#basic-track' : '#advanced-track').click();
    await page.locator(`#lessons button[data-id="${id}"]`).click();
    const count = await page.locator('#lesson-step-picker option').count();
    for (let step = 0; step < count; step++) {
      await page.locator('#lesson-step-picker').selectOption(String(step)); result.sections++;
      const examples = page.locator('.lesson-step-body > .lesson-content .lesson-code[data-language="js"]');
      for (let i = 0; i < await examples.count(); i++) {
        const box = examples.nth(i);
        await box.getByRole('button', { name: '运行这个例子', exact: true }).click();
        await box.locator('pre[role="status"][aria-busy="false"]').waitFor();
        if (await box.locator('pre[role="status"]').getAttribute('data-state') === 'error') {
          result.failures.push({ id, step, example: i, text: await box.locator('pre[role="status"]').textContent() });
        }
        result.examples++;
      }
      if (await page.locator('#drill-actions').isVisible()) {
        const answer = await page.evaluate(() => learningDrills.find(x => x.id === document.querySelector('#drill-picker').value).answer);
        await page.locator('#drill-code').fill(answer);
        await page.locator('#drill-check').click();
        await page.waitForFunction(() => !document.querySelector('#drill-check').disabled);
        if (await page.locator('#drill-output').getAttribute('data-state') !== 'passed') result.failures.push({ id, step, drill: await page.locator('#drill-output').textContent() });
        result.drills++;
      }
    }
    await page.locator('#drill-next').click();
    if (await page.evaluate(() => document.activeElement.id) !== 'final-exercise') result.failures.push({ id, finalFocus: false });
    await page.locator('#review-lesson').click();
    if (await page.locator('#lesson-step-picker').inputValue() !== String(count - 1)) result.failures.push({ id, returnStep: false });
  }
  return result;
}
