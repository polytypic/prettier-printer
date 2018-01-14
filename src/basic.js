import * as I from './ext/infestines'

import {
  Choice,
  Delay,
  Eager,
  Nest,
  With,
  flatten,
  layout,
  output,
  padding
} from './core'

//

export const line = '\n'
export const lineBreak = '\r'
export const softLine = Choice(' ', line)
export const softBreak = Choice('', lineBreak)

//

export const prepend = I.curry((lhs, rhs) => [lhs, rhs])
export const append = I.curry((rhs, lhs) => [lhs, rhs])

//

export const intersperse = I.curry((sep, docs) => {
  const result = []
  const n = I.length(docs)
  if (n) result.push(docs[0])
  for (let i = 1; i < n; ++i) result.push(sep, docs[i])
  return result
})

export const punctuate = I.curry((sep, docs) => {
  const r = []
  const n = I.length(docs)
  const nm1 = n - 1
  for (let i = 0; i < nm1; ++i) r.push([docs[i], sep])
  if (n) r.push(docs[nm1])
  return r
})

//

export const lazy = Delay

//

const pair = (l, r) => I.freeze([l, r])
const sq = d => pair(d, d)

export const angles = pair('<', '>')
export const braces = pair('{', '}')
export const brackets = pair('[', ']')
export const dquotes = sq('"')
export const lineBreaks = sq(lineBreak)
export const lines = sq(line)
export const parens = pair('(', ')')
export const spaces = sq(' ')
export const squotes = sq("'")

export const enclose = I.curry((pair, doc) => [pair[0], doc, pair[1]])

//

export const choice = I.curry((wide, narrow) => Choice(flatten(wide), narrow))

export const group = doc => choice(doc, doc)

//

export const nest = I.curry(Nest)

//

export const column = withColumn => With((column, _) => withColumn(column))

export const nesting = withNesting =>
  With((_, prefix) => withNesting(I.length(prefix)))

export const align = doc =>
  With((column, prefix) => Nest(column - I.length(prefix), doc))

export const hang = I.curry((prefix, doc) => align(Nest(prefix, doc)))

export const indent = I.curry((prefix, doc) =>
  hang(prefix, [padding(prefix), doc])
)

//

export const renderWith = I.curry((actions, zero, maxCols, doc) =>
  output(actions, zero, Eager(layout(maxCols, 0, ['', doc, undefined])))
)

export const render = renderWith(
  {
    line: result => result + '\n',
    text: (result, text) => result + text
  },
  ''
)
