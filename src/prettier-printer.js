import * as I from 'infestines'

const padding = n => (I.isString(n) ? n : ' '.repeat(n))

const Delay = thunk => ({ c: 0, v: thunk })
const Eager = value => ({ c: 1, v: value })
function force(x) {
  if (x.c !== 0) return x.v
  const th = x.v
  x.v = undefined
  x.c = 1
  return (x.v = th())
}

const Nest = (prefix, doc) => ({ c: 3, p: prefix, d: doc })
const Choice = (wide, narrow) => ({ c: 5, w: wide, n: narrow })
const With = fn => ({ c: 6, f: fn })

const conOf = doc =>
  typeof doc === 'object' ? (I.isArray(doc) ? 2 : doc.c) : 4

function flatten(doc) {
  switch (conOf(doc)) {
    case 0:
      return Delay(() => flatten(force(doc)))
    case 1:
      return flatten(doc.v)
    case 2: {
      const loop = i => {
        switch (doc.length - i) {
          case 0:
            return ''
          case 1:
            return flatten(doc[i])
          default:
            return [flatten(doc[i]), Delay(() => loop(i + 1))]
        }
      }
      return loop(0)
    }
    case 3:
      return Nest(doc.p, flatten(doc.d))
    case 4:
      switch (doc) {
        case '\n':
          return ' '
        case '\r':
          return ''
        default:
          return doc
      }
    case 5:
      return doc.w
    default:
      return With(I.pipe2U(doc.f, flatten))
  }
}

const Nil = [0]
const Linefeed = (prefix, rest) => [1, prefix, rest]
const Print = (text, rest) => [2, text, rest]

function output({ text, line }, state, print) {
  for (;;) {
    print = force(print)
    switch (print[0]) {
      case 0:
        return state
      case 1:
        state = text(line(state), print[1])
        print = print[2]
        break
      default:
        state = text(state, print[1])
        print = print[2]
        break
    }
  }
}

function fits(maxCols, usedCols, print) {
  for (;;) {
    if (maxCols < usedCols) return false
    print = force(print)
    if (print[0] < 2) {
      return true
    } else {
      usedCols += print[1].length
      print = print[2]
    }
  }
}

function layout(maxCols, usedCols, docs) {
  if (undefined === docs) return Nil
  const prefix = docs[0]
  const doc = docs[1]
  const rest = docs[2]
  switch (conOf(doc)) {
    case 0:
      return layout(maxCols, usedCols, [prefix, force(doc), rest])
    case 1:
      return layout(maxCols, usedCols, [prefix, doc.v, rest])
    case 2:
      return layout(
        maxCols,
        usedCols,
        doc.reduceRight((rest, doc) => [prefix, doc, rest], rest)
      )
    case 3:
      return layout(maxCols, usedCols, [prefix + padding(doc.p), doc.d, rest])
    case 4:
      switch (doc) {
        case '\n':
        case '\r':
          return Linefeed(
            prefix,
            Delay(() => layout(maxCols, prefix.length, rest))
          )
        case '':
          return layout(maxCols, usedCols, rest)
        default:
          return Print(
            doc,
            Delay(() => layout(maxCols, usedCols + doc.length, rest))
          )
      }
    case 5: {
      const wide = layout(maxCols, usedCols, [prefix, doc.w, rest])
      if (!maxCols || fits(maxCols, usedCols, Eager(wide))) return wide
      else return layout(maxCols, usedCols, [prefix, doc.n, rest])
    }
    default:
      return layout(maxCols, usedCols, [prefix, doc.f(usedCols, prefix), rest])
  }
}

//

export const line = '\n'
export const lineBreak = '\r'
export const softLine = /*#__PURE__*/ Choice(' ', line)
export const softBreak = /*#__PURE__*/ Choice('', lineBreak)

//

export const prepend = /*#__PURE__*/ I.curry((lhs, rhs) => [lhs, rhs])
export const append = /*#__PURE__*/ I.curry((rhs, lhs) => [lhs, rhs])

//

export const intersperse = /*#__PURE__*/ I.curry((sep, docs) => {
  const result = []
  const n = docs.length
  for (let i = 0; i < n; ++i) {
    if (i) result.push(sep)
    result.push(docs[i])
  }
  return result
})

export const punctuate = /*#__PURE__*/ I.curry((sep, docs) => {
  const last = docs.length - 1
  return docs.map((doc, i) => (i !== last ? [doc, sep] : doc))
})

//

export const lazy = Delay

//

export const parens = /*#__PURE__*/ I.freeze(['(', ')'])
export const angles = /*#__PURE__*/ I.freeze(['<', '>'])
export const braces = /*#__PURE__*/ I.freeze(['{', '}'])
export const brackets = /*#__PURE__*/ I.freeze(['[', ']'])
export const squotes = /*#__PURE__*/ I.freeze(["'", "'"])
export const dquotes = /*#__PURE__*/ I.freeze(['"', '"'])
export const spaces = /*#__PURE__*/ I.freeze([' ', ' '])

export const enclose = /*#__PURE__*/ I.curry((pair, doc) => [
  pair[0],
  doc,
  pair[1]
])

//

export const choice = /*#__PURE__*/ I.curry((wide, narrow) =>
  Choice(flatten(wide), narrow)
)

export const group = doc => choice(doc, doc)

//

export const nest = /*#__PURE__*/ I.curry(Nest)

//

export const column = withColumn => With((column, _) => withColumn(column))

export const nesting = withNesting =>
  With((_, prefix) => withNesting(prefix.length))

export const align = doc =>
  With((column, prefix) => Nest(column - prefix.length, doc))

export const hang = /*#__PURE__*/ I.curry((prefix, doc) =>
  align(Nest(prefix, doc))
)

export const indent = /*#__PURE__*/ I.curry((prefix, doc) =>
  hang(prefix, [padding(prefix), doc])
)

//

export const renderWith = /*#__PURE__*/ I.curry((actions, zero, maxCols, doc) =>
  output(actions, zero, Eager(layout(maxCols, 0, ['', doc, undefined])))
)

export const render = /*#__PURE__*/ renderWith(
  {
    line: result => result + '\n',
    text: (result, text) => result + text
  },
  ''
)
