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

const toExpr = thunk =>
  thunk
    .toString()
    .replace(/\s+/g, ' ')
    .replace(/^\s*function\s*\(\s*\)\s*{\s*(return\s*)?/, '')
    .replace(/\s*;?\s*}\s*$/, '')
    .replace(/function\s*(\([a-zA-Z]*\))\s*/g, '$1 => ')
    .replace(/{\s*return\s*([^{;]+)\s*;\s*}/g, '$1')
    .replace(/{\s*return\s*([^{;]+)\s*;\s*}/g, '$1')

const testEq = (expect, thunk) =>
  it(`${toExpr(thunk)} => ${show(expect)}`, () => {
    const actual = thunk()
    if (!I.acyclicEqualsU(actual, expect))
      throw new Error(`Expected: ${show(expect)}, actual: ${show(actual)}`)
  })

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

describe('pretty', () => {
  testEq("[0, [], {}, {'foo bar': 'ab\\nba'}, null, undefined]", () =>
    PP.render(
      60,
      PP.pretty([-0, [], {}, { 'foo bar': 'ab\nba' }, null, undefined])
    )
  )

  testEq(
    `[
  -0,
  {
    foobar:
      'ab\\nba'
  },
  null,
  undefined
]`,
    () =>
      PP.render(
        18,
        PP.prettyWith({ negative0: true }, [
          -0,
          { foobar: 'ab\nba' },
          null,
          undefined
        ])
      )
  )

  testEq(
    `new Set(
  [3, 1, 4]
)`,
    () => PP.render(12, PP.pretty(new Set([3, 1, 4, 1])))
  )

  testEq(
    `new Map(
   [
      ['b', 3],
      ['a', 1],
      ['c', 4]
   ]
)`,
    () =>
      PP.render(
        15,
        PP.prettyWith({ indent: 3 }, new Map([['b', 3], ['a', 1], ['c', 4]]))
      )
  )

  function Foo(bar, baz) {
    this.bar = bar
    this.baz = baz
  }

  Foo.static = 'property'

  testEq(
    `Foo {
  bar: 101,
  baz: [3, 1, 4, 1, 5]
}`,
    () => PP.render(22, PP.pretty(new Foo(101, [3, 1, 4, 1, 5])))
  )

  testEq(
    `[Function: Foo] {
  static: 'property'
}`,
    () => PP.render(20, PP.pretty(Foo))
  )
  testEq('[Function]', () => PP.render(20, PP.pretty(() => {})))

  testEq(
    `new Int8Array(
  [3, 1, 4]
)`,
    () => PP.render(20, PP.pretty(Int8Array.from([3, 1, 4])))
  )

  testEq('Promise {}', () => PP.render(20, PP.pretty(Promise.resolve(42))))

  testEq('{x: 1}', () =>
    PP.render(20, PP.pretty(Object.assign(Object.create(null), { x: 1 })))
  )

  const shared = { x: 101 }
  testEq('[{x: 101}, {x: 101}]', () =>
    PP.render(0, PP.pretty([shared, shared]))
  )
  testEq('[#1 {x: 101}, #1]', () =>
    PP.render(0, PP.prettyWith({ sharing: true }, [shared, shared]))
  )

  const cyclic = { x: 42 }
  cyclic.rec = cyclic
  testEq('[#1 {x: 42, rec: #1}, #1 {x: 42, rec: #1}]', () =>
    PP.render(0, PP.pretty([cyclic, cyclic]))
  )
  testEq('[#1 {x: 42, rec: #1}, #1]', () =>
    PP.render(0, PP.prettyWith({ sharing: true }, [cyclic, cyclic]))
  )

  const Bar = () => {}
  testEq('[[Function: Bar], [Function: Bar]]', () =>
    PP.render(0, PP.pretty([Bar, Bar]))
  )
  testEq('[#1 [Function: Bar], [Function: Bar] #1]', () =>
    PP.render(0, PP.prettyWith({ sharing: true }, [Bar, Bar]))
  )
})
