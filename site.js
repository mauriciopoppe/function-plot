/**
 * Created by mauricio on 4/9/15.
 */
'use strict'
var fs = require('fs')
var dox = require('dox')
var _ = require('lodash')
var jade = require('jade')
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
})

function renderExamples() {
  var file = fs.readFileSync('./site/js/site.js', { encoding: 'utf-8' })
  var comments = dox.parseComments(file)

  var parsed = comments.map(function (c) {
    var ids = c.code.match(/target:\s*'(.*)'/g)
    if (ids) {
      ids = ids
        .map(function (str) {
          return /#[0-9a-zA-Z-]*/.exec(str)[0].substr(1)
        })
    }

    var comment = c.description.full
    var experimental
    if (_.find(c.tags, { type: 'experimental' })) {
      experimental = true
    }
    var additionalDOM = _.find(c.tags, { type: 'additionalDOM' })
    if (additionalDOM) {
      additionalDOM = additionalDOM.string
    }
    comment = comment.replace(/<br\s*\/>/g, ' ')
    return {
      comment: comment,
      experimental: experimental,
      code: c.code,
      additionalDOM: additionalDOM,
      ids: ids
    }
  }).filter(function (entry) {
    return entry.ids
  })

  var output = fs.createWriteStream('./site/partials/examples.html')
  output.write(jade.compileFile('./site/tpl/examples.jade')({ comments: parsed }))
  output.end()
}

function renderRecipes() {
  const file = fs.readFileSync('./site/tpl/recipes.md', { encoding: 'utf-8' })
  const result = md.render(file)

  const output = fs.createWriteStream('./site/partials/recipes.html')
  output.write(result)
  output.end()
}

renderExamples()
renderRecipes()
