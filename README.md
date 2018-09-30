# <a id="prettier-printer"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#) [Prettier Printer](#prettier-printer) &middot; [![GitHub stars](https://img.shields.io/github/stars/polytypic/prettier-printer.svg?style=social)](https://github.com/polytypic/prettier-printer) [![npm](https://img.shields.io/npm/dm/prettier-printer.svg)](https://www.npmjs.com/package/prettier-printer)

A pretty printing library for text documents that can be rendered to a desired
maximum width.  Basic features:

* Interactive documentation (the [▶ links](https://polytypic.github.io/prettier-printer/index.html))
* Functional API:
  * [Referentially transparent functions](https://en.wikipedia.org/wiki/Referential_transparency)
  * [Curried functions](http://fr.umio.us/favoring-curry/)
* [Supports tree-shaking](https://webpack.js.org/guides/tree-shaking/)
* [TypeScript typings](./src/prettier-printer.d.ts)
* [Contract checking in non-production builds](./src/prettier-printer.js)
* [MIT license](./LICENSE.md)

As an example, the evaluation output in this live
[CodeSandbox](https://codesandbox.io/s/8zo3ko95p2) example is formatted using
this library.

[![npm version](https://badge.fury.io/js/prettier-printer.svg)](http://badge.fury.io/js/prettier-printer)
[![Bower version](https://badge.fury.io/bo/prettier-printer.svg)](https://badge.fury.io/bo/prettier-printer)
[![Build Status](https://travis-ci.org/polytypic/prettier-printer.svg?branch=master)](https://travis-ci.org/polytypic/prettier-printer)
[![Code Coverage](https://img.shields.io/codecov/c/github/polytypic/prettier-printer/master.svg)](https://codecov.io/github/polytypic/prettier-printer?branch=master)
[![](https://david-dm.org/polytypic/prettier-printer.svg)](https://david-dm.org/polytypic/prettier-printer) [![](https://david-dm.org/polytypic/prettier-printer/dev-status.svg)](https://david-dm.org/polytypic/prettier-printer?type=dev)

## <a id="contents"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#contents) [Contents](#contents)

* [Tutorial](#tutorial)
* [Reference](#reference)
  * [Rendering documents](#rendering-documents)
    * [`PP.render(maxCols, doc) ~> string`](#PP-render) <small><sup>v1.0.0</sup></small>
    * [`PP.renderWith({text: (state, string) => state, line: state => state}, state, maxCols, doc) ~> state`](#PP-renderWith) <small><sup>v1.0.0</sup></small>
  * [Document constants](#document-constants)
    * [`PP.line ~> doc`](#PP-line) <small><sup>v1.0.0</sup></small>
    * [`PP.lineBreak ~> doc`](#PP-lineBreak) <small><sup>v1.0.0</sup></small>
    * [`PP.softLine ~> doc`](#PP-softLine) <small><sup>v1.0.0</sup></small>
    * [`PP.softBreak ~> doc`](#PP-softBreak) <small><sup>v1.0.0</sup></small>
  * [Concatenating documents](#concatenating-documents)
    * [`PP.append(rhsDoc, lhsDoc) ~> doc`](#PP-append) <small><sup>v1.0.0</sup></small>
    * [`PP.prepend(lhsDoc, rhsDoc) ~> doc`](#PP-prepend) <small><sup>v1.0.0</sup></small>
  * [Lists of documents](#lists-of-documents)
    * [`PP.intersperse(doc, [...docs]) ~> [...docs]`](#PP-intersperse) <small><sup>v1.0.0</sup></small>
    * [`PP.punctuate(sepDoc, [...docs]) ~> [...docs]`](#PP-punctuate) <small><sup>v1.0.0</sup></small>
  * [Lazy documents](#lazy-documents)
    * [`PP.lazy(() => doc) ~> doc`](#PP-lazy) <small><sup>v1.0.0</sup></small>
  * [Enclosing documents](#enclosing-documents)
    * [`PP.enclose([lhsDoc, rhsDoc], doc) ~> doc`](#PP-enclose) <small><sup>v1.0.0</sup></small>
    * [Document pair constants](#document-pair-constants)
      * [`PP.angles ~> ['<', '>']`](#PP-angles) <small><sup>v1.0.0</sup></small>
      * [`PP.braces ~> ['{', '}']`](#PP-braces) <small><sup>v1.0.0</sup></small>
      * <a href="#PP-brackets"><code>PP.brackets ~&gt; ['[', ']']</code></a> <small><sup>v1.0.0</sup></small>
      * [`PP.dquotes ~> ['"', '"']`](#PP-dquotes) <small><sup>v1.0.0</sup></small>
      * [`PP.lineBreaks ~> [PP.lineBreak, PP.lineBreak]`](#PP-lineBreaks) <small><sup>v1.1.0</sup></small>
      * [`PP.lines ~> [PP.line, PP.line]`](#PP-lines) <small><sup>v1.1.0</sup></small>
      * [`PP.parens ~> ['(', ')']`](#PP-parens) <small><sup>v1.0.0</sup></small>
      * [`PP.spaces ~> [' ', ' ']`](#PP-spaces) <small><sup>v1.0.0</sup></small>
      * [`PP.squotes ~> ["'", "'"]`](#PP-squotes) <small><sup>v1.0.0</sup></small>
  * [Alternative documents](#alternative-documents)
    * [`PP.choice(wideDoc, narrowDoc) ~> doc`](#PP-choice) <small><sup>v1.0.0</sup></small>
    * [`PP.group(doc) ~> doc`](#PP-group) <small><sup>v1.0.0</sup></small>
  * [Nested documents](#nested-documents)
    * [`PP.nest(string | number, doc) ~> doc`](#PP-nest) <small><sup>v1.0.0</sup></small>
  * [Layout dependent documents](#layout-dependent-documents)
    * [`PP.column(column => doc) ~> doc`](#PP-column) <small><sup>v1.0.0</sup></small>
    * [`PP.nesting(nesting => doc) ~> doc`](#PP-nesting) <small><sup>v1.0.0</sup></small>
  * [Aligned documents](#aligned-documents)
    * [`PP.align(doc) ~> doc`](#PP-align) <small><sup>v1.0.0</sup></small>
    * [`PP.hang(string | number, doc) ~> doc`](#PP-hang) <small><sup>v1.0.0</sup></small>
    * [`PP.indent(string | number, doc) ~> doc`](#PP-indent) <small><sup>v1.0.0</sup></small>
* [Related Work](#related-work)

## <a id="tutorial"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#tutorial) [Tutorial](#tutorial)

To be done.

In the meanwhile, read Philip Wadler's paper [A prettier
printer](https://homepages.inf.ed.ac.uk/wadler/papers/prettier/prettier.pdf).

## <a id="reference"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#reference) [Reference](#reference)

Typically one imports the library as:

```jsx
import * as PP from 'prettier-printer'
```

The examples also utilize [Ramda](http://ramdajs.com/), bound as `R`.

### <a id="rendering-documents"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#rendering-documents) [Rendering documents](#rendering-documents)

#### <a id="PP-render"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-render) [`PP.render(maxCols, doc) ~> string`](#PP-render) <small><sup>v1.0.0</sup></small>

`PP.render` renders the document to a string trying to keep the width of the
document within the specified maximum.  A width of `0` means that there is no
maximum.  See also [`PP.renderWith`](#PP-renderWith).

For example:

```js
PP.render(
  10,
  PP.indent('-- ', PP.group(PP.intersperse(PP.line, ['Hello,', 'world!'])))
)
// -- Hello,
// -- world!
```

#### <a id="PP-renderWith"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-renderWith) [`PP.renderWith({text: (state, string) => state, line: state => state}, state, maxCols, doc) ~> state`](#PP-renderWith) <small><sup>v1.0.0</sup></small>

`PP.renderWith` renders the document with the given actions `text` and `line`.
You can use this function to output the document without creating an
intermediate string of the whole document.  See also [`PP.render`](#PP-render).

### <a id="document-constants"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#document-constants) [Document constants](#document-constants)

Any string that doesn't contain `'\n'` or `'\r'` characters is considered as an
atomic document.  For example, `''` is an empty document and `' '` is a space.

#### <a id="PP-line"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-line) [`PP.line ~> doc`](#PP-line) <small><sup>v1.0.0</sup></small>

`PP.line` renders as a new line unless undone by [`PP.group`](#PP-group) in
which case `PP.line` renders as a space.

For example:

```js
PP.render(20, ['Hello,', PP.line, 'world!'])
// Hello,
// world!
```

```js
PP.render(20, PP.group(['Hello,', PP.line, 'world!']))
// Hello, world!
```

#### <a id="PP-lineBreak"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-lineBreak) [`PP.lineBreak ~> doc`](#PP-lineBreak) <small><sup>v1.0.0</sup></small>

`PP.lineBreak` renders as a new line unless undone by [`PP.group`](#PP-group) in
which case `PP.lineBreak` renders as empty.

For example:

```js
PP.render(20, ['Lol', PP.lineBreak, 'Bal'])
// Lol
// Bal
```

```js
PP.render(20, PP.group(['Lol', PP.lineBreak, 'Bal']))
// LolBal
```

#### <a id="PP-softLine"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-softLine) [`PP.softLine ~> doc`](#PP-softLine) <small><sup>v1.0.0</sup></small>

`PP.softLine` renders as a space if the output fits and otherwise as a new line.

For example:

```js
PP.render(
  20,
  PP.intersperse(
    PP.softLine,
    R.split(
      /\s+/,
      'Here is a paragraph of text that we will format to a desired width.'
    )
  )
)
// Here is a paragraph
// of text that we will
// format to a desired
// width.
```

#### <a id="PP-softBreak"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-softBreak) [`PP.softBreak ~> doc`](#PP-softBreak) <small><sup>v1.0.0</sup></small>

`PP.softBreak` renders as empty if the output fits and otherwise as a new line.

For example:

```js
PP.render(10, PP.intersperse(PP.softBreak, R.split(/\b/, 'this.method(rocks)')))
// this.
// method(
// rocks)
```

### <a id="concatenating-documents"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#concatenating-documents) [Concatenating documents](#concatenating-documents)

An array of documents is considered as a concatenation of documents.  For
example, `[]` is an empty document and `['foo', 'bar']` is equivalent to
`'foobar'`.

#### <a id="PP-append"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-append) [`PP.append(rhsDoc, lhsDoc) ~> doc`](#PP-append) <small><sup>v1.0.0</sup></small>

`PP.append` reverse concatenates the documents.

For example:

```js
PP.render(0, PP.append('bar', 'foo'))
// foobar
```

#### <a id="PP-prepend"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-prepend) [`PP.prepend(lhsDoc, rhsDoc) ~> doc`](#PP-prepend) <small><sup>v1.0.0</sup></small>

`PP.prepend` concatenates the documents.

For example:

```js
PP.render(0, PP.prepend('foo', 'bar'))
// foobar
```

### <a id="lists-of-documents"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#lists-of-documents) [Lists of documents](#lists-of-documents)

#### <a id="PP-intersperse"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-intersperse) [`PP.intersperse(doc, [...docs]) ~> [...docs]`](#PP-intersperse) <small><sup>v1.0.0</sup></small>

`PP.intersperse` puts the given separator document between each document in the
given list of documents.

For example:

```js
PP.intersperse(',', ['a', 'b', 'c'])
// ['a', ',', 'b', ',', 'c']
```

#### <a id="PP-punctuate"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-punctuate) [`PP.punctuate(sepDoc, [...docs]) ~> [...docs]`](#PP-punctuate) <small><sup>v1.0.0</sup></small>

`PP.punctuate` concatenates the given separator after each document in the given
list of documents except the last.

For example:

```js
PP.punctuate(',', ['a', 'b', 'c'])
// [ [ 'a', ',' ], [ 'b', ',' ], 'c' ]
```

### <a id="lazy-documents"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#lazy-documents) [Lazy documents](#lazy-documents)

#### <a id="PP-lazy"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-lazy) [`PP.lazy(() => doc) ~> doc`](#PP-lazy) <small><sup>v1.0.0</sup></small>

`PP.lazy` creates a lazy document.  The given thunk is only invoked as needed to
compute the document.

### <a id="enclosing-documents"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#enclosing-documents) [Enclosing documents](#enclosing-documents)

#### <a id="PP-enclose"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-enclose) [`PP.enclose([lhsDoc, rhsDoc], doc) ~> doc`](#PP-enclose) <small><sup>v1.0.0</sup></small>

`PP.enclose` encloses the given document between the given pair of documents.

For example:

```js
PP.render(0, PP.enclose(PP.parens, 'foo'))
// (foo)
```

#### <a id="document-pair-constants"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#document-pair-constants) [Document pair constants](#document-pair-constants)

##### <a id="PP-angles"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-angles) [`PP.angles ~> ['<', '>']`](#PP-angles) <small><sup>v1.0.0</sup></small>

##### <a id="PP-braces"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-braces) [`PP.braces ~> ['{', '}']`](#PP-braces) <small><sup>v1.0.0</sup></small>

##### <a id="PP-brackets"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-brackets) <a href="#PP-brackets"><code>PP.brackets ~&gt; ['[', ']']</code></a> <small><sup>v1.0.0</sup></small>

##### <a id="PP-dquotes"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-dquotes) [`PP.dquotes ~> ['"', '"']`](#PP-dquotes) <small><sup>v1.0.0</sup></small>

##### <a id="PP-lineBreaks"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-lineBreaks) [`PP.lineBreaks ~> [PP.lineBreak, PP.lineBreak]`](#PP-lineBreaks) <small><sup>v1.1.0</sup></small>

##### <a id="PP-lines"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-lines) [`PP.lines ~> [PP.line, PP.line]`](#PP-lines) <small><sup>v1.1.0</sup></small>

##### <a id="PP-parens"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-parens) [`PP.parens ~> ['(', ')']`](#PP-parens) <small><sup>v1.0.0</sup></small>

##### <a id="PP-spaces"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-spaces) [`PP.spaces ~> [' ', ' ']`](#PP-spaces) <small><sup>v1.0.0</sup></small>

##### <a id="PP-squotes"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-squotes) [`PP.squotes ~> ["'", "'"]`](#PP-squotes) <small><sup>v1.0.0</sup></small>

### <a id="alternative-documents"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#alternative-documents) [Alternative documents](#alternative-documents)

#### <a id="PP-choice"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-choice) [`PP.choice(wideDoc, narrowDoc) ~> doc`](#PP-choice) <small><sup>v1.0.0</sup></small>

`PP.choice(wideDoc, narrowDoc)` renders as the given `wideDoc` on a line if it
fits within the maximum width and otherwise as the `narrowDoc`.
[`PP.line`](#PP-line)s and [`PP.lineBreak`](#PP-lineBreak)s within the `wideDoc`
are undone like with [`PP.group`](#PP-group).

For example:

```js
PP.render(5, PP.choice('wide', 'narrow'))
// 'wide'
```

```js
PP.render(3, PP.choice('wide', 'narrow'))
// 'narrow'
```

Note that usually the idea is that the narrow version can indeed be rendered
more narrowly.

For example:

```js
const hyphen = PP.choice('', ['-', PP.lineBreak])

PP.render(5, PP.intersperse(hyphen, ['hy', 'phen', 'at', 'ed']))
// hy-
// phen-
// ated
```

#### <a id="PP-group"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-group) [`PP.group(doc) ~> doc`](#PP-group) <small><sup>v1.0.0</sup></small>

`PP.group` allows [`PP.line`](#PP-line)s and [`PP.lineBreak`](#PP-lineBreak)s
within the given document to be undone if the result fits within the maximum
width.  `PP.group(doc)` is equivalent to [`PP.choice(doc, doc)`](#PP-choice).

### <a id="nested-documents"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#nested-documents) [Nested documents](#nested-documents)

#### <a id="PP-nest"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-nest) [`PP.nest(string | number, doc) ~> doc`](#PP-nest) <small><sup>v1.0.0</sup></small>

`PP.nest` increases the nesting after next new line by the given string or by
the given number of spaces.

For example:

```js
PP.render(6, PP.nest(2, PP.group(PP.intersperse(PP.line, ['foo', 'bar']))))
// foo
//   bar
```

### <a id="layout-dependent-documents"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#layout-dependent-documents) [Layout dependent documents](#layout-dependent-documents)

#### <a id="PP-column"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-column) [`PP.column(column => doc) ~> doc`](#PP-column) <small><sup>v1.0.0</sup></small>

`PP.column` allows a document to depend on the column at which the document
starts.

#### <a id="PP-nesting"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-nesting) [`PP.nesting(nesting => doc) ~> doc`](#PP-nesting) <small><sup>v1.0.0</sup></small>

`PP.nesting` allows a document to depend on the nesting after the next new line.

### <a id="aligned-documents"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#aligned-documents) [Aligned documents](#aligned-documents)

#### <a id="PP-align"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-align) [`PP.align(doc) ~> doc`](#PP-align) <small><sup>v1.0.0</sup></small>

`PP.align` creates a document such that the nesting of the document is aligned
to the current column.

For example:

```js
PP.render(10, PP.group(['foo(', PP.align(['bar,', PP.line, 'baz']), ')']))
// foo(bar,
//     baz)
```

#### <a id="PP-hang"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-hang) [`PP.hang(string | number, doc) ~> doc`](#PP-hang) <small><sup>v1.0.0</sup></small>

`PP.hang` creates a document such that the document is nested by the given
string or number of spaces starting from the current column.

For example:

```js
PP.render(10, PP.group(['foo(', PP.hang(2, ['bar,', PP.line, 'baz']), ')']))
// foo(bar,
//       baz)
```

#### <a id="PP-indent"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#PP-indent) [`PP.indent(string | number, doc) ~> doc`](#PP-indent) <small><sup>v1.0.0</sup></small>

`PP.indent` creates a document such that the document is indented by the given
prefix or number of spaces starting from the current column.

```js
PP.render(
  20,
  PP.nest(
    2,
    PP.group([
      'A comment:',
      PP.line,
      PP.line,
      PP.indent(
        '-- ',
        PP.intersperse(
          PP.softLine,
          R.split(/\s+/, 'This is the comment that you are looking for.')
        )
      )
    ])
  )
)
// A comment:
// 
//   -- This is the
//   -- comment that
//   -- you are looking
//   -- for.
```

## <a id="related-work"></a> [≡](#contents) [▶](https://polytypic.github.io/prettier-printer/index.html#related-work) [Related Work](#related-work)

* Philip Wadler's paper [A prettier
  printer](https://homepages.inf.ed.ac.uk/wadler/papers/prettier/prettier.pdf)
  describes the basic ideas and implementation.
* [Text.PrettyPrint.Leijen](https://hackage.haskell.org/package/wl-pprint-1.2/docs/Text-PrettyPrint-Leijen.html)
  is Daan Leijen's implementation with some extensions.
* Other prettier printer implementations by the author of this library:
  * [prettier](https://github.com/MLton/mltonlib/tree/master/com/ssh/prettier/unstable)
  * [PPrint](https://github.com/polytypic/PPrint)
* [text.pretty-printing](https://github.com/folktale/text.pretty-printing)
  another JS implementation based on Wadler's paper.  Marked as
  "[Unmaintained]".
* [Prettier](https://prettier.io/) uses a similar pretty printing library
  underneath.
