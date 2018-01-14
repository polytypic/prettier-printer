export * from 'infestines'

import * as I from 'infestines'

export const entries =
  Object.entries || (x => map(k => [k, x[k]], Object.keys(x)))

export const array = Array.from

export const name = x => x.name

export const length = x => x.length

export const map = I.curry((fn, xs) => xs.map(fn))

export const reduceRight = I.curry((fn, z, xs) => xs.reduceRight(fn, z))

export const repeat = I.curry((n, s) => s.repeat(n))

export const identical = I.curry(I.identicalU)

export const test = I.curry((re, s) => I.isString(s) && re.test(s))

export const replace = I.curry((p, r, s) => s.replace(p, r))
