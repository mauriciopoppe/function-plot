/**
 * Performs a build time transformation of the examples
 * written as JavaScript
 */

const fs = require('fs')
const dox = require('dox')
const _ = require('lodash')
const pug = require('pug')
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
})

function renderExamples() {
  const file = fs.readFileSync('./site/js/examples.js', { encoding: 'utf-8' })
  const comments = dox.parseComments(file)

  const parsed = comments
    .map(function (c) {
      let ids = c.code.match(/target:\s*'(.*)'/g)
      if (ids) {
        ids = ids.map(function (str) {
          return /#[0-9a-zA-Z-]*/.exec(str)[0].substr(1)
        })
      }

      let comment = c.description.full
      let experimental
      if (_.find(c.tags, { type: 'experimental' })) {
        experimental = true
      }
      let additionalDOM = _.find(c.tags, { type: 'additionalDOM' })
      if (additionalDOM) {
        additionalDOM = additionalDOM.string
      }
      comment = comment.replace(/<br\s*\/>/g, ' ')
      return {
        comment,
        experimental,
        code: c.code,
        additionalDOM,
        ids
      }
    })
    .filter(function (entry) {
      return entry.ids
    })

  const output = fs.createWriteStream('./site/partials/examples.auto.html')
  output.write(pug.compileFile('./site/partials/examples.pug')({ comments: parsed }))
  output.end()
}

function renderRecipes() {
  const file = fs.readFileSync('./site/partials/recipes.md', { encoding: 'utf-8' })
  const result = md.render(file)

  const output = fs.createWriteStream('./site/partials/recipes.auto.html')
  output.write(result)
  output.end()
}

renderExamples()
renderRecipes()
