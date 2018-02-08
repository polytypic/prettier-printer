import * as I from './ext/infestines'
import * as V from 'partial.lenses.validation'

const docRec = V.lazy(doc =>
  V.cases(
    [I.isString, I.test(/^([\n\r]|[^\n\r]*)$/)],
    [I.isArray, V.arrayIx(doc)],
    [
      V.or(
        V.props({c: I.identical(0), v: I.isFunction}),
        V.props({c: I.identical(1), v: V.accept}),
        V.props({
          c: I.identical(3),
          p: V.or(I.isString, I.isNumber),
          d: V.accept
        }),
        V.props({c: I.identical(5), w: V.accept, n: V.accept}),
        V.props({c: I.identical(6), f: I.isFunction})
      )
    ]
  )
)

const doc = V.choose(doc => V.and(docRec, V.acceptAs(doc)))

const fn = (args, res) => fn =>
  I.arityN(
    I.length(args),
    V.validate(V.freeFn(V.tuple.apply(null, args), res), fn)
  )

// Rendering documents

export const renderWith = fn(
  [
    V.props({text: I.isFunction, line: I.isFunction}),
    V.accept,
    I.isNumber,
    doc
  ],
  V.accept
)

export const render = fn([I.isNumber, doc], I.isString)

// Concatenating documents

export const prepend = fn([doc, doc], doc)
export const append = fn([doc, doc], doc)

// List of documents

export const intersperse = fn([doc, V.arrayId(doc)], V.arrayId(doc))
export const punctuate = fn([doc, V.arrayId(doc)], V.arrayId(doc))

// Lazy documents

export const lazy = fn([fn([], doc)], doc)

// Enclosing documents

export const enclose = fn([V.tuple(doc, doc), doc], doc)

// Alternative documents

export const choice = fn([doc, doc], doc)
export const group = fn([doc], doc)

// Nested documents

export const nest = fn([V.or(I.isString, I.isNumber), doc], doc)

// Layout dependent documents

export const column = fn([fn([I.isNumber], doc)], doc)
export const nesting = fn([fn([I.isNumber], doc)], doc)

// Aligned documents

export const align = fn([doc], doc)
export const hang = fn([V.or(I.isString, I.isNumber), doc], doc)
export const indent = fn([V.or(I.isString, I.isNumber), doc], doc)
