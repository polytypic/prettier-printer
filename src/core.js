import * as I from './ext/infestines'

export const padding = n => (I.isString(n) ? n : I.repeat(n, ' '))

export const Delay = function lazy(thunk) {
  return {c: 0, v: thunk}
}
export const Eager = value => ({c: 1, v: value})
function force(x) {
  if (x.c !== 0) return x.v
  const th = x.v
  x.v = undefined
  x.c = 1
  return (x.v = th())
}

export const Nest = function nest(prefix, doc) {
  return {c: 3, p: prefix, d: doc}
}
export const Choice = (wide, narrow) => ({c: 5, w: wide, n: narrow})
export const With = fn => ({c: 6, f: fn})

const conOf = doc =>
  typeof doc === 'object' ? (I.isArray(doc) ? 2 : doc.c) : 4

export function flatten(doc) {
  switch (conOf(doc)) {
    case 0:
      return Delay(() => flatten(force(doc)))
    case 1:
      return flatten(doc.v)
    case 2: {
      const loop = i => {
        switch (I.length(doc) - i) {
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

export function output({text, line}, state, print) {
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
      usedCols += I.length(print[1])
      print = print[2]
    }
  }
}

const layoutDelay = (maxCols, usedCols, docs) =>
  Delay(() => layout(maxCols, usedCols, docs))

export function layout(maxCols, usedCols, docs) {
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
        I.reduceRight((rest, doc) => [prefix, doc, rest], rest, doc)
      )
    case 3:
      return layout(maxCols, usedCols, [prefix + padding(doc.p), doc.d, rest])
    case 4:
      switch (doc) {
        case '\n':
        case '\r':
          return Linefeed(prefix, layoutDelay(maxCols, I.length(prefix), rest))
        case '':
          return layout(maxCols, usedCols, rest)
        default:
          return Print(
            doc,
            layoutDelay(maxCols, usedCols + I.length(doc), rest)
          )
      }
    case 5: {
      const wide = layout(maxCols, usedCols, [prefix, doc.w, rest])
      return !maxCols || fits(maxCols, usedCols, Eager(wide))
        ? wide
        : layout(maxCols, usedCols, [prefix, doc.n, rest])
    }
    default:
      return layout(maxCols, usedCols, [prefix, doc.f(usedCols, prefix), rest])
  }
}
