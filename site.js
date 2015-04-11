/**
 * Created by mauricio on 4/9/15.
 */
'use strict';
var fs = require('fs');
var dox = require('dox');
var _ = require('lodash');

var file = fs.readFileSync('./site/js/index.js', { encoding: 'utf-8' });
var comments = dox.parseComments(file);

var output = fs.createWriteStream('./site/partials/all.html');

var exampleTemplate = [
  '<% _.forEach(comments, function (c) { %>',
  ' <div class="example row">',
  '   <div class="col-md-6">',
  '     <% _.forEach(c.ids, function (id) { %>',
  '     <span class="graph" id="<%= id %>"></span>',
  '     <% }) %>',
  '   </div>',
  '   <div class="col-md-6">',
  '     <div class="comment"><%= c.comment %></div>',
  '     <div class="code"><pre><code><%= c.code %></code></pre></div>',
  '   </div>',
  ' </div>',
  '<% }); %>'
].join('\n');

var parsed = comments.map(function (c) {
  var ids = c.code.match(/target:\s*'(.*)'/g);
  if (ids) {
    ids = ids
      .map(function (str) {
        return /#[0-9a-zA-Z\-]*/.exec(str)[0].substr(1);
      });
  }
  var comment = c.description.full;
  return {
    comment: comment,
    code: c.code,
    ids: ids
  };
}).filter(function (entry) {
  return entry.ids;
});

output.write(_.template(exampleTemplate)({
  comments: parsed
}));
output.end();
