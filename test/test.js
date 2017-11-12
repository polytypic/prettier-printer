import * as I from 'infestines'

import * as PP from '../dist/prettier-printer.cjs'

function show(x) {
  switch (typeof x) {
    case 'string':
    case 'object':
      return JSON.stringify(x)
    default:
      return `${x}`
  }
}

function testEq(exprIn, expect) {
  const expr = exprIn.replace(/[ \n]+/g, ' ')

  it(`${expr} => ${show(expect)}`, () => {
    const actual = eval(`() => ${expr}`)(PP, I)
    if (!I.acyclicEqualsU(actual, expect))
      throw new Error(`Expected: ${show(expect)}, actual: ${show(actual)}`)
  })
}

describe('prettier-printer', () => {
  testEq(`I.seq('foo', PP.render(10))`, 'foo')

  testEq(`I.seq('bar', PP.prepend('foo'), PP.render(10))`, 'foobar')

  testEq(`I.seq('foo', PP.append('bar'), PP.render(10))`, 'foobar')

  testEq(`I.seq(['foo', '', 'bar'], PP.render(10))`, 'foobar')

  testEq(`I.seq([], PP.render(10))`, '')

  testEq(`I.seq(PP.intersperse('-', ['foo', 'bar']), PP.render(10))`, 'foo-bar')

  testEq(`I.seq(PP.lazy(() => 'foo'), PP.render(10))`, 'foo')

  testEq(`I.seq('foo', PP.enclose(PP.dquotes), PP.render(10))`, '"foo"')

  testEq(
    `I.seq(['foo', 'bar', 'baz'],
           PP.punctuate(','),
           PP.intersperse(PP.line),
           PP.render(10))`,
    'foo,\nbar,\nbaz'
  )

  testEq(`I.seq(PP.choice('wide', 'narrow'), PP.render(10))`, 'wide')

  testEq(`I.seq(PP.choice('wide', 'narrow'), PP.render(2))`, 'narrow')

  testEq(
    `I.seq(PP.intersperse(PP.line, ['foo', 'bar']),
           PP.group,
           PP.render(10))`,
    'foo bar'
  )

  testEq(
    `I.seq(PP.intersperse(PP.line, ['foo', 'bar']),
           PP.nest('--'),
           PP.render(10))`,
    'foo\n--bar'
  )

  testEq(
    `I.seq(PP.intersperse(PP.line, ['foo', 'bar']),
           PP.nest(2),
           PP.render(10))`,
    'foo\n  bar'
  )

  testEq(
    `I.seq(PP.intersperse(PP.line, ['foo', 'bar']),
           PP.nest(2),
           PP.group,
           PP.render(10))`,
    'foo bar'
  )

  testEq(
    `I.seq(PP.intersperse(PP.lineBreak, [PP.lazy(() => 'foo'), 'bar']),
           PP.group,
           PP.group,
           PP.nest(2),
           PP.render(10))`,
    'foobar'
  )

  testEq(
    `I.seq(PP.lazy(() => I.seq(
             ['a', 'b', 'c'],
             PP.intersperse(PP.line),
             PP.indent('// '),
             PP.prepend(' '))),
           PP.group,
           PP.render(5))`,
    ' // a\n // b\n // c'
  )

  testEq(
    `I.seq(PP.lazy(() => I.seq(
             ['a', 'b', 'c'],
             PP.intersperse(PP.line),
             PP.indent('// '),
             PP.prepend(' '))),
           PP.group,
           PP.render(15))`,
    ' // a b c'
  )

  testEq(
    `I.seq(['column: ', PP.column(c => c.toString())],
           PP.group,
           PP.render(9))`,
    'column: 8'
  )

  testEq(
    `I.seq(['nesting:', PP.line, PP.nesting(c => c.toString())],
           PP.group,
           PP.nest(2),
           PP.render(9))`,
    'nesting:\n  2'
  )

  testEq(
    `{ const d = PP.lazy(() => 'foo')
     ; return PP.render(10, PP.group([d, PP.render(10, d)]))
     }`,
    'foofoo'
  )

  testEq(`PP.render(10, PP.group([]))`, '')
})
