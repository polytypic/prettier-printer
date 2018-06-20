import * as I from './ext/infestines'
import {
  braces,
  brackets,
  group,
  intersperse,
  lazy,
  line,
  lineBreak,
  nest,
  parens
} from './basic'

const IS_ON_STACK = 1
const IS_RECURSIVE = 2
const IS_SHARED = 4

function enter({known, noSharing}, object) {
  const before = known.get(object)
  if (undefined === before) {
    known.set(object, (known.size << 3) | IS_ON_STACK)
  } else {
    const isOnStack = before & IS_ON_STACK
    const isRecursive = isOnStack << 1
    const isShared = !isOnStack << 2
    const after = before | noSharing | isRecursive | isShared
    if (before !== after) known.set(object, after)
    return after & IS_ON_STACK && !isRecursive ? undefined : after >> 3
  }
}

function exit({known}, object) {
  known.set(object, known.get(object) ^ IS_ON_STACK)
}

const commaLine = [',', line]

const prettyString = s =>
  I.replace(
    /^"|"$/g,
    `'`,
    I.replace(/\\"/g, `"`, I.replace(/'/g, `\\'`, JSON.stringify(s)))
  )

const prettyNumber = (context, n) =>
  context.negative0 && I.identicalU(-0, n) ? '-0' : `${n}`

const egyptian = (context, pair, doc) =>
  group([nest(context.indent, [pair[0], lineBreak, doc]), lineBreak, pair[1]])

const prettyAggregate = (context, delimiters, elems) =>
  I.length(elems)
    ? egyptian(context, delimiters, intersperse(commaLine, elems))
    : delimiters

const prettyKey = key =>
  /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : prettyString(key)

const prettyEntry = context => entry =>
  nest(
    context.indent,
    group([prettyKey(entry[0]), ':', line, prettyRec(context, entry[1])])
  )

const prettyObject = (context, delimiters, object) =>
  prettyAggregate(
    context,
    delimiters,
    I.map(prettyEntry(context), I.entries(object))
  )

const wrapRec = (context, object, doc) => {
  exit(context, object)
  return lazy(() => {
    const info = context.known.get(object)
    return info & IS_RECURSIVE || (info & IS_SHARED && !context.noSharing)
      ? [`#${info >> 3} `, doc]
      : doc
  })
}

function prettyFunction(context, fn) {
  const index = enter(context, fn)
  const name = I.name(fn)
  const head = name ? ['[Function: ', name, ']'] : '[Function]'
  if (I.isDefined(index)) {
    return [head, ` #${index}`]
  } else {
    const entries = I.entries(fn)
    return wrapRec(
      context,
      fn,
      I.length(entries)
        ? [
            head,
            ' ',
            prettyAggregate(
              context,
              braces,
              I.map(prettyEntry(context), entries)
            )
          ]
        : head
    )
  }
}

const arraylikes = new Set([
  Array,
  Map,
  Set,
  Int8Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array
])

function prettyRec(context, any) {
  switch (typeof any) {
    case 'string':
      return prettyString(any)
    case 'number':
      return prettyNumber(context, any)
    case 'object':
      if (null === any) {
        return 'null'
      } else {
        const index = enter(context, any)
        if (I.isDefined(index)) {
          return `#${index}`
        } else {
          const ctor = I.constructorOf(any) || Object
          if (arraylikes.has(ctor)) {
            const isArray = I.isArray(any)
            const body = prettyAggregate(
              context,
              brackets,
              I.map(any => prettyRec(context, any), I.array(any))
            )
            return wrapRec(
              context,
              any,
              isArray
                ? body
                : ['new ', I.name(ctor), egyptian(context, parens, body)]
            )
          } else {
            const body = prettyObject(context, braces, any)
            return wrapRec(
              context,
              any,
              ctor === Object ? body : [I.name(ctor), ' ', body]
            )
          }
        }
      }
    case 'function':
      return prettyFunction(context, any)
    default:
      return `${any}`
  }
}

export const prettyWith = I.curry(
  ({indent = 2, negative0 = false, sharing = false}, any) =>
    prettyRec(
      {
        known: new Map(),
        indent,
        negative0,
        noSharing: sharing ? 0 : IS_ON_STACK
      },
      any
    )
)

export const pretty = prettyWith(I.object0)
