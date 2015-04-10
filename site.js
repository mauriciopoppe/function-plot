/**
 * Created by mauricio on 4/9/15.
 */
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
  '     <div id="<%= c.id %>"></div>',
  '   </div>',
  '   <div class="col-md-6">',
  '     <div class="comment"><%= c.comment %></div>',
  '     <div class="code"><pre><code><%= c.code %></code></pre></div>',
  '   </div>',
  ' </div>',
  '<% }); %>'
].join('\n');

var parsed = comments.map(function (c) {
  var id = c.code.match(/d3.select\('(.*?)'\)/)[1];
  var comment = c.description.full;

  return {
    comment: comment,
    code: c.code,
    id: id.substr(1)
  };
});

output.write(_.template(exampleTemplate)({
  comments: parsed
}));
output.end();
