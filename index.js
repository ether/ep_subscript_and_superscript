const eejs = require('ep_etherpad-lite/node/eejs/');
const fs = require('fs');

/** ******************
* UI
*/
exports.eejsBlock_editbarMenuLeft = function (hook_name, args, cb) {
  args.content += eejs.require('ep_subscript_and_superscript/templates/editbarButtons.ejs');
  return cb();
};

exports.eejsBlock_dd_format = function (hook_name, args, cb) {
  args.content += eejs.require('ep_subscript_and_superscript/templates/fileMenu.ejs');
  return cb();
};


/** ******************
* Editor
*/

// Allow <whatever> to be an attribute
// Register attributes that are html markup / blocks not just classes
// This should make export export properly IE <sub>helllo</sub>world
// will be the output and not <span class=sub>helllo</span>
exports.aceAttribClasses = function (hook, attr) {
  attr.sub = 'tag:sub';
  attr.sup = 'tag:sup'; // wtf? cake
  return attr;
};


// Add the props to be supported in export
exports.exportHtmlAdditionalTags = function (hook, pad, cb) {
  return cb(['sub', 'sup']);
};


exports.asyncLineHTMLForExport = function (hook, context, cb) {
  return cb(rewriteLine);
};

function rewriteLine(context) {
  return lineContent;
}
