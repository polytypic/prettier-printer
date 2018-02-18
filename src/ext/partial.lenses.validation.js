import * as V from 'partial.lenses.validation'

export * from 'partial.lenses.validation'

export const fn = (args, res) => V.freeFn(V.args.apply(null, args), res)

export const sq = t => V.tuple(t, t)

export {accept as any} from 'partial.lenses.validation'

export {
  isArray as array,
  isFunction as fun,
  isNumber as number,
  isString as string
} from './infestines'
