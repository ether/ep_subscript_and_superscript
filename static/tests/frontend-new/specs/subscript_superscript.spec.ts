import {expect, test} from '@playwright/test';
import {clearPadContent, getPadBody, goToNewPad, selectAllText, writeToPad}
    from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

test.describe('ep_subscript_and_superscript', () => {
  for (const [label, btnClass, spanClass] of [
    ['superscript', 'buttonicon-superscript', 'sup'],
    ['subscript', 'buttonicon-subscript', 'sub'],
  ] as const) {
    test(`Applies ${label} formatting`, async ({page}) => {
      const padBody = await getPadBody(page);
      await padBody.click();
      await clearPadContent(page);
      await writeToPad(page, 'First Line!');
      await selectAllText(page);

      await page.locator(`.${btnClass}`).click();

      await expect(
        padBody.locator('div').first().locator('span').first()
      ).toHaveClass(new RegExp(`\\b${spanClass}\\b`));
    });
  }
});
