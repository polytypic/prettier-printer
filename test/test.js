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

function testEq(expect, thunk) {
  const expr = thunk
    .toString()
    .replace(/[ \n]+/g, ' ')
    .replace(/^\s*function\s*\(\s*\)\s*{\s*(return\s*)?/, '')
    .replace(/\s*;?\s*}\s*$/, '')

  it(`${expr} => ${show(expect)}`, () => {
    const actual = thunk()
    if (!I.acyclicEqualsU(actual, expect))
      throw new Error(`Expected: ${show(expect)}, actual: ${show(actual)}`)
  })
}

describe('prettier-printer', () => {
  testEq('foo', () => I.seq('foo', PP.render(10)))

  testEq('foobar', () => I.seq('bar', PP.prepend('foo'), PP.render(10)))

  testEq('foobar', () => I.seq('foo', PP.append('bar'), PP.render(10)))

  testEq('foobar', () => I.seq(['foo', '', 'bar'], PP.render(10)))

  testEq('', () => I.seq([], PP.render(10)))

  testEq('foo-bar', () =>
    I.seq(PP.intersperse('-', ['foo', 'bar']), PP.render(10))
  )
  testEq('foo', () => I.seq(PP.intersperse('-', ['foo']), PP.render(10)))
  testEq('', () => I.seq(PP.intersperse('-', []), PP.render(10)))

  testEq('foo', () => I.seq(PP.lazy(() => 'foo'), PP.render(10)))

  testEq('"foo"', () => I.seq('foo', PP.enclose(PP.dquotes), PP.render(10)))

  testEq('foo,\nbar,\nbaz', () =>
    I.seq(
      ['foo', 'bar', 'baz'],
      PP.punctuate(','),
      PP.intersperse(PP.line),
      PP.render(10)
    )
  )
  testEq([], () => PP.punctuate(',', []))
  testEq(['x'], () => PP.punctuate(',', ['x']))
  testEq([['x', ','], 'y'], () => PP.punctuate(',', ['x', 'y']))

  testEq('wide', () => I.seq(PP.choice('wide', 'narrow'), PP.render(10)))

  testEq('narrow', () => I.seq(PP.choice('wide', 'narrow'), PP.render(2)))

  testEq('foo bar', () =>
    I.seq(PP.intersperse(PP.line, ['foo', 'bar']), PP.group, PP.render(10))
  )

  testEq('foo\n--bar', () =>
    I.seq(PP.intersperse(PP.line, ['foo', 'bar']), PP.nest('--'), PP.render(10))
  )

  testEq('foo\n  bar', () =>
    I.seq(PP.intersperse(PP.line, ['foo', 'bar']), PP.nest(2), PP.render(10))
  )

  testEq('foo bar', () =>
    I.seq(
      PP.intersperse(PP.line, ['foo', 'bar']),
      PP.nest(2),
      PP.group,
      PP.render(10)
    )
  )

  testEq('foobar', () =>
    I.seq(
      PP.intersperse(PP.lineBreak, [PP.lazy(() => 'foo'), 'bar']),
      PP.group,
      PP.group,
      PP.nest(2),
      PP.render(10)
    )
  )

  testEq(' // a\n // b\n // c', () =>
    I.seq(
      PP.lazy(() =>
        I.seq(
          ['a', 'b', 'c'],
          PP.intersperse(PP.line),
          PP.indent('// '),
          PP.prepend(' ')
        )
      ),
      PP.group,
      PP.render(5)
    )
  )

  testEq(' // a b c', () =>
    I.seq(
      PP.lazy(() =>
        I.seq(
          ['a', 'b', 'c'],
          PP.intersperse(PP.line),
          PP.indent('// '),
          PP.prepend(' ')
        )
      ),
      PP.group,
      PP.render(15)
    )
  )

  testEq('column: 8', () =>
    I.seq(['column: ', PP.column(c => c.toString())], PP.group, PP.render(9))
  )

  testEq('nesting:\n  2', () =>
    I.seq(
      ['nesting:', PP.line, PP.nesting(c => c.toString())],
      PP.group,
      PP.nest(2),
      PP.render(9)
    )
  )

  testEq('foofoo', () => {
    const d = PP.lazy(() => 'foo')
    return PP.render(10, PP.group([d, PP.render(10, d)]))
  })

  testEq('', () => PP.render(10, PP.group([])))
})
