import {expect, test} from '@playwright/test';
import {clearPadContent, getPadBody, goToNewPad, selectAllText, writeToPad}
    from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

// https://github.com/ether/ep_subscript_and_superscript/issues/17
test.describe('ep_subscript_and_superscript file menu', () => {
  for (const [style, spanClass] of [
    ['superscript', 'sup'],
    ['subscript', 'sub'],
  ] as const) {
    test(`Applies ${style} from the Format menu`, async ({page}) => {
      test.skip(await page.locator('.dropdown-menu').count() === 0,
          'ep_file_menu_toolbar is not installed');

      const padBody = await getPadBody(page);
      await padBody.click();
      await clearPadContent(page);
      await writeToPad(page, 'First Line!');
      await selectAllText(page);

      // The entry lives in the collapsed "Format" submenu, which the
      // jquery-css dropdown plugin only expands on hover. dispatchEvent
      // fires the click straight at the element regardless of visibility.
      await page.locator(`.dropdown-menu li.${style} > a`).dispatchEvent('click');

      await expect(padBody.locator('div').first().locator('span').first())
          .toHaveClass(new RegExp(`\\b${spanClass}\\b`));
    });
  }
});
