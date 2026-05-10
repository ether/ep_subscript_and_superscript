'use strict';

const {template} = require('ep_plugin_helpers');

const eejs = require('ep_etherpad-lite/node/eejs/');

/** ******************
* UI
*/
exports.eejsBlock_editbarMenuLeft =
    template('ep_subscript_and_superscript/templates/editbarButtons.ejs');

exports.eejsBlock_dd_format =
    template('ep_subscript_and_superscript/templates/fileMenu.ejs');


/** ******************
* Editor
*/

// Allow <whatever> to be an attribute
// Register attributes that are html markup / blocks not just classes
// This should make export export properly IE <sub>helllo</sub>world
// will be the output and not <span class=sub>helllo</span>
exports.aceAttribClasses = (hook, attr) => {
  attr.sub = 'tag:sub';
  attr.sup = 'tag:sup'; // wtf? cake
  return attr;
};


const rewriteLine = (context) => context.lineContent;

// Add the props to be supported in export
exports.exportHtmlAdditionalTags = (hook, pad, cb) => cb(['sub', 'sup']);
exports.asyncLineHTMLForExport = (hook, context, cb) => cb(rewriteLine);

exports.padInitToolbar = (hookName, args, cb) => {
  const toolbar = args.toolbar;

  const superscriptButton = toolbar.button({
    command: 'sup',
    localizationId: 'ep_subscript_and_superscript.superscript',
    class: 'buttonicon buttonicon-superscript',
  });

  const subscriptButton = toolbar.button({
    command: 'sub',
    localizationId: 'ep_subscript_and_superscript.subscript',
    class: 'buttonicon buttonicon-subscript',
  });

  toolbar.registerButton('sup', superscriptButton);
  toolbar.registerButton('sub', subscriptButton);

  return cb();
};
