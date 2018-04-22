import * as I from './ext/infestines'
import * as V from './ext/partial.lenses.validation'

import * as PP from './basic'

const doc = V.lazy(doc =>
  V.cases(
    [V.string, I.test(/^([\n\r]|[^\n\r]*)$/)],
    [V.array, V.arrayIx(doc)],
    [
      V.or(
        V.props({c: I.identical(0), v: V.fun}),
        V.props({c: I.identical(1), v: V.any}),
        V.props({
          c: I.identical(3),
          p: V.or(V.string, V.number),
          d: V.any
        }),
        V.props({c: I.identical(5), w: V.any, n: V.any}),
        V.props({c: I.identical(6), f: V.fun})
      )
    ]
  )
)

const C =
  process.env.NODE_ENV === 'production'
    ? x => x
    : (x, c) => {
        const v = V.validate(c, x)
        return V.fun(x) ? I.arityN(I.length(x), v) : v
      }

// Rendering documents

export const render = C(PP.render, V.fn([V.number, doc], V.string))
export const renderWith = C(
  PP.renderWith,
  V.fn([V.props({text: V.fun, line: V.fun}), V.any, V.number, doc], V.any)
)

// Document constants

export const line = C(PP.line, doc)
export const lineBreak = C(PP.lineBreak, doc)
export const softLine = C(PP.softLine, doc)
export const softBreak = C(PP.softBreak, doc)

// Concatenating documents

export const append = C(PP.append, V.fn([doc, doc], doc))
export const prepend = C(PP.prepend, V.fn([doc, doc], doc))

// Lists of documents

export const intersperse = C(
  PP.intersperse,
  V.fn([doc, V.arrayId(doc)], V.arrayId(doc))
)
export const punctuate = C(
  PP.punctuate,
  V.fn([doc, V.arrayId(doc)], V.arrayId(doc))
)

// Lazy documents

export const lazy = C(PP.lazy, V.fn([V.fn([], doc)], doc))

// Enclosing documents

export const enclose = C(PP.enclose, V.fn([V.sq(doc), doc], doc))

// Document pair constants

export const angles = C(PP.angles, V.sq(doc))
export const braces = C(PP.braces, V.sq(doc))
export const brackets = C(PP.brackets, V.sq(doc))
export const dquotes = C(PP.dquotes, V.sq(doc))
export const lineBreaks = C(PP.lineBreaks, V.sq(doc))
export const lines = C(PP.lines, V.sq(doc))
export const parens = C(PP.parens, V.sq(doc))
export const spaces = C(PP.spaces, V.sq(doc))
export const squotes = C(PP.squotes, V.sq(doc))

// Alternative documents

export const choice = C(PP.choice, V.fn([doc, doc], doc))
export const group = C(PP.group, V.fn([doc], doc))

// Nested documents

export const nest = C(PP.nest, V.fn([V.or(V.string, V.number), doc], doc))

// Layout dependent documents

export const column = C(PP.column, V.fn([V.fn([V.number], doc)], doc))
export const nesting = C(PP.nesting, V.fn([V.fn([V.number], doc)], doc))

// Aligned documents

export const align = C(PP.align, V.fn([doc], doc))
export const hang = C(PP.hang, V.fn([V.or(V.string, V.number), doc], doc))
export const indent = C(PP.indent, V.fn([V.or(V.string, V.number), doc], doc))
