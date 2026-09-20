'use strict';

const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const ejs = require('ep_etherpad-lite/node_modules/ejs');

const root = path.resolve(__dirname, '..', '..', '..', '..');
const readTemplate = (name) => fs.readFileSync(path.join(root, 'templates', name), 'utf8');
const render = (name) => ejs.render(readTemplate(name), {});
const locales = JSON.parse(fs.readFileSync(path.join(root, 'locales', 'en.json'), 'utf8'));
const epJson = JSON.parse(fs.readFileSync(path.join(root, 'ep.json'), 'utf8'));

describe(__filename, function () {
  let html;

  before(async function () {
    html = render('fileMenu.ejs');
  });

  // https://github.com/ether/ep_subscript_and_superscript/issues/17
  for (const style of ['subscript', 'superscript']) {
    it(`file menu offers ${style}`, async function () {
      // The class is what postAceInit binds the click handler to.
      assert.match(html, new RegExp(`<li[^>]*class="[^"]*\\b${style}\\b`),
          `no <li class="${style}"> entry in the file menu:\n${html}`);
    });

    it(`the ${style} entry is localized`, async function () {
      const id = `ep_subscript_and_superscript.${style}.title`;
      assert(html.includes(`data-l10n-id="${id}"`),
          `the ${style} entry should be labelled with ${id}:\n${html}`);
      assert(locales[id], `${id} is missing from locales/en.json`);
    });
  }

  it('registers the entries in the character formatting group', async function () {
    // dd_format_text is the block right below Strikethrough in
    // ep_file_menu_toolbar's Format menu.
    const hooks = epJson.parts[0].hooks;
    assert.equal(hooks.eejsBlock_dd_format_text, 'ep_subscript_and_superscript/index');
    assert.equal(typeof require(root).eejsBlock_dd_format_text, 'function');
  });
});
