/**
 * Created by mauricio on 4/9/15.
 */
'use strict';
var fs = require('fs');
var dox = require('dox');
var _ = require('lodash');
var jade = require('jade');

var file = fs.readFileSync('./site/js/index.js', { encoding: 'utf-8' });
var comments = dox.parseComments(file);

var parsed = comments.map(function (c) {
  var ids = c.code.match(/target:\s*'(.*)'/g);
  if (ids) {
    ids = ids
      .map(function (str) {
        return /#[0-9a-zA-Z\-]*/.exec(str)[0].substr(1);
      });
  }

  var comment = c.description.full;
  var experimental;
  if (_.find(c.tags, {type: 'experimental'})) {
    experimental = true;
  }
  comment = comment.replace(/<br\s*\/>/g, ' ');
  return {
    comment: comment,
    experimental: experimental,
    code: c.code,
    ids: ids
  };
}).filter(function (entry) {
  return entry.ids;
});

var output = fs.createWriteStream('./site/partials/all.html');
output.write(jade.compileFile('./site/jade/examples.jade')({comments: parsed}));
output.end();
