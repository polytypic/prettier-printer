import * as PP from './basic'

import * as C from './contract'

// Rendering documents

export const render =
  process.env.NODE_ENV === 'production' ? PP.render : C.render(PP.render)
export const renderWith =
  process.env.NODE_ENV === 'production'
    ? PP.renderWith
    : C.renderWith(PP.renderWith)

// Document constants

export {line} from './basic'
export {lineBreak} from './basic'
export {softLine} from './basic'
export {softBreak} from './basic'

// Concatenating documents

export const prepend =
  process.env.NODE_ENV === 'production' ? PP.prepend : C.prepend(PP.prepend)
export const append =
  process.env.NODE_ENV === 'production' ? PP.append : C.append(PP.append)

// Lists of documents

export const intersperse =
  process.env.NODE_ENV === 'production'
    ? PP.intersperse
    : C.intersperse(PP.intersperse)
export const punctuate =
  process.env.NODE_ENV === 'production'
    ? PP.punctuate
    : C.punctuate(PP.punctuate)

// Lazy documents

export const lazy =
  process.env.NODE_ENV === 'production' ? PP.lazy : C.lazy(PP.lazy)

// Enclosing documents

export const enclose =
  process.env.NODE_ENV === 'production' ? PP.enclose : C.enclose(PP.enclose)

// Document pair constants

export {angles} from './basic'
export {braces} from './basic'
export {brackets} from './basic'
export {dquotes} from './basic'
export {lineBreaks} from './basic'
export {lines} from './basic'
export {parens} from './basic'
export {spaces} from './basic'
export {squotes} from './basic'

// Alternative documents

export const choice =
  process.env.NODE_ENV === 'production' ? PP.choice : C.choice(PP.choice)
export const group =
  process.env.NODE_ENV === 'production' ? PP.group : C.group(PP.group)

// Nested documents

export const nest =
  process.env.NODE_ENV === 'production' ? PP.nest : C.nest(PP.nest)

// Layout dependent documents

export const column =
  process.env.NODE_ENV === 'production' ? PP.column : C.column(PP.column)
export const nesting =
  process.env.NODE_ENV === 'production' ? PP.nesting : C.nesting(PP.nesting)

// Aligned documents

export const align =
  process.env.NODE_ENV === 'production' ? PP.align : C.align(PP.align)
export const hang =
  process.env.NODE_ENV === 'production' ? PP.hang : C.hang(PP.hang)
export const indent =
  process.env.NODE_ENV === 'production' ? PP.indent : C.indent(PP.indent)
