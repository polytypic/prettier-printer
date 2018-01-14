export * from 'infestines'

import * as I from 'infestines'

export const length = x => x.length
export const reduceRight = I.curry((fn, z, xs) => xs.reduceRight(fn, z))
export const repeat = I.curry((n, s) => s.repeat(n))
