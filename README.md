# <a id="prettier-printer"></a> [≡](#contents) Prettier Printer &middot; [![GitHub stars](https://img.shields.io/github/stars/polytypic/prettier-printer.svg?style=social)](https://github.com/polytypic/prettier-printer) [![npm](https://img.shields.io/npm/dm/prettier-printer.svg)](https://www.npmjs.com/package/prettier-printer)

A pretty printing library for text documents that can be rendered to a desired
maximum width.

[![npm version](https://badge.fury.io/js/prettier-printer.svg)](http://badge.fury.io/js/prettier-printer)
[![Bower version](https://badge.fury.io/bo/prettier-printer.svg)](https://badge.fury.io/bo/prettier-printer)
[![Build Status](https://travis-ci.org/polytypic/prettier-printer.svg?branch=master)](https://travis-ci.org/polytypic/prettier-printer)
[![Code Coverage](https://img.shields.io/codecov/c/github/polytypic/prettier-printer/master.svg)](https://codecov.io/github/polytypic/prettier-printer?branch=master)
[![](https://david-dm.org/polytypic/prettier-printer.svg)](https://david-dm.org/polytypic/prettier-printer) [![](https://david-dm.org/polytypic/prettier-printer/dev-status.svg)](https://david-dm.org/polytypic/prettier-printer?type=dev)

## <a id="contents"></a> [≡](#contents) Contents

* [Tutorial](#tutorial)
* [Reference](#reference)
  * [Rendering documents](#rendering-documents)
    * [`PP.render(maxCols, doc) ~> string`](#PP-render) <small><sup>v0.1.0</sup></small>
    * [`PP.renderWith({text: (state, string) => state, line: state => state}, state, maxCols, doc) ~> state`](#PP-renderWith) <small><sup>v0.1.0</sup></small>
  * [Constant documents](#constant-documents)
    * [`PP.line ~> doc`](#PP-line) <small><sup>v0.1.0</sup></small>
    * [`PP.lineBreak ~> doc`](#PP-lineBreak) <small><sup>v0.1.0</sup></small>
    * [`PP.softLine ~> doc`](#PP-softLine) <small><sup>v0.1.0</sup></small>
    * [`PP.softBreak ~> doc`](#PP-softBreak) <small><sup>v0.1.0</sup></small>
  * [Concatenating documents](#concatenating-documents)
    * [`PP.prepend(lhsDoc, rhsDoc) ~> doc`](#PP-prepend) <small><sup>v0.1.0</sup></small>
    * [`PP.append(rhsDoc, lhsDoc) ~> doc`](#PP-append) <small><sup>v0.1.0</sup></small>
  * [Lists of documents](#lists-of-documents)
    * [`PP.intersperse(doc, [...docs]) ~> [...docs]`](#PP-intersperse) <small><sup>v0.1.0</sup></small>
    * [`PP.punctuate(sepDoc, [...docs]) ~> [...docs]`](#PP-punctuate) <small><sup>v0.1.0</sup></small>
  * [Lazy documents](#lazy-documents)
    * [`PP.lazy(() => doc) ~> doc`](#PP-lazy) <small><sup>v0.1.0</sup></small>
  * [Enclosing documents](#enclosing-documents)
    * [`PP.enclose([lhsDoc, rhsDoc], doc) ~> doc`](#PP-enclose) <small><sup>v0.1.0</sup></small>
    * [Document pairs](#document-pairs)
      * [`PP.angles ~> ['<', '>']`](#PP-angles) <small><sup>v0.1.0</sup></small>
      * [`PP.braces ~> ['{', '}']`](#PP-braces) <small><sup>v0.1.0</sup></small>
      * [`PP.brackets ~> ['[', ']']`](#PP-brackets) <small><sup>v0.1.0</sup></small>
      * [`PP.dquotes ~> ['"', '"']`](#PP-dquotes) <small><sup>v0.1.0</sup></small>
      * [`PP.parens ~> ['(', ')']`](#PP-parens) <small><sup>v0.1.0</sup></small>
      * [`PP.spaces ~> [' ', ' ']`](#PP-spaces) <small><sup>v0.1.0</sup></small>
      * [`PP.squotes ~> ["'", "'"]`](#PP-squotes) <small><sup>v0.1.0</sup></small>
  * [Alternative documents](#alternative-documents)
    * [`PP.choice(wideDoc, narrowDoc) ~> doc`](#PP-choice) <small><sup>v0.1.0</sup></small>
    * [`PP.group(doc) ~> doc`](#PP-group) <small><sup>v0.1.0</sup></small>
  * [Nested documents](#nested-documents)
    * [`PP.nest(string | number, doc) ~> doc`](#PP-nest) <small><sup>v0.1.0</sup></small>
  * [Layout dependent documents](#layout-dependent-documents)
    * [`PP.column(column => doc) ~> doc`](#PP-column) <small><sup>v0.1.0</sup></small>
    * [`PP.nesting(nesting => doc) ~> doc`](#PP-nesting) <small><sup>v0.1.0</sup></small>
  * [Aligned documents](#aligned-documents)
    * [`PP.align(doc) ~> doc`](#PP-align) <small><sup>v0.1.0</sup></small>
    * [`PP.hang(string | number, doc) ~> doc`](#PP-hang) <small><sup>v0.1.0</sup></small>
    * [`PP.indent(string | number, doc) ~> doc`](#PP-indent) <small><sup>v0.1.0</sup></small>
* [Related Work](#related-work)

## <a id="tutorial"></a> [≡](#contents) Tutorial

To be done.

In the meanwhile, read Philip Wadler's paper [A prettier
printer](https://homepages.inf.ed.ac.uk/wadler/papers/prettier/prettier.pdf).

## <a id="reference"></a> [≡](#contents) Reference

Typically one imports the library as:

```jsx
import * as PP from 'prettier-printer'
```

### <a id="rendering-documents"></a> [≡](#contents) [Rendering documents](#rendering-documents)

#### <a id="PP-render"></a> [≡](#contents) [`PP.render(maxCols, doc) ~> string`](#PP-render) <small><sup>v0.1.0</sup></small>

`PP.render` renders the document to a string trying to keep the width of the
document within the specified maximum.  A width of `0` means that there is no
maximum.  See also [`PP.renderWith`](#PP-renderWith).

#### <a id="PP-renderWith"></a> [≡](#contents) [`PP.renderWith({text: (state, string) => state, line: state => state}, state, maxCols, doc) ~> state`](#PP-renderWith) <small><sup>v0.1.0</sup></small>

`PP.renderWith` renders the document with the given actions `text` and `line`.
You can use this function to output the document without creating a string of
the document.  See also [`PP.render`](#PP-render).

### <a id="constant-documents"></a> [≡](#contents) [Constant documents](#constant-documents)

Any string that doesn't contain `'\n'` or `'\r'` characters is considered as an
atomic document.  For example, `''` is an empty document and `' '` is a space.

#### <a id="PP-line"></a> [≡](#contents) [`PP.line ~> doc`](#PP-line) <small><sup>v0.1.0</sup></small>

`PP.line` renders as a new line unless undone by [`PP.group`](#PP-group) in
which case `PP.line` renders as a space.

#### <a id="PP-lineBreak"></a> [≡](#contents) [`PP.lineBreak ~> doc`](#PP-lineBreak) <small><sup>v0.1.0</sup></small>

`PP.lineBreak` renders as a new line unless undone by [`PP.group`](#PP-group) in
which case `PP.lineBreak` renders as empty.

#### <a id="PP-softLine"></a> [≡](#contents) [`PP.softLine ~> doc`](#PP-softLine) <small><sup>v0.1.0</sup></small>

`PP.softLine` renders as a space if the output fits and otherwise as a new line.

#### <a id="PP-softBreak"></a> [≡](#contents) [`PP.softBreak ~> doc`](#PP-softBreak) <small><sup>v0.1.0</sup></small>

`PP.softBreak` renders as empty if the output fits and otherwise as a new line.

### <a id="concatenating-documents"></a> [≡](#contents) [Concatenating documents](#concatenating-documents)

An array of documents is considered as a concatenation of documents.  For
example, `[]` is an empty document and `['foo', 'bar']` is equivalent to
`'foobar'`.

#### <a id="PP-prepend"></a> [≡](#contents) [`PP.prepend(lhsDoc, rhsDoc) ~> doc`](#PP-prepend) <small><sup>v0.1.0</sup></small>

`PP.prepend` concatenates the documents.

#### <a id="PP-append"></a> [≡](#contents) [`PP.append(rhsDoc, lhsDoc) ~> doc`](#PP-append) <small><sup>v0.1.0</sup></small>

`PP.append` reverse concatenates the documents.

### <a id="lists-of-documents"></a> [≡](#contents) [Lists of documents](#lists-of-documents)

#### <a id="PP-intersperse"></a> [≡](#contents) [`PP.intersperse(doc, [...docs]) ~> [...docs]`](#PP-intersperse) <small><sup>v0.1.0</sup></small>

`PP.intersperse` puts the given separator document between each document in the
given list of documents.

For example:

```js
PP.intersperse(',', ['a', 'b', 'c'])
// ['a', ',', 'b', ',', 'c']
```

#### <a id="PP-punctuate"></a> [≡](#contents) [`PP.punctuate(sepDoc, [...docs]) ~> [...docs]`](#PP-punctuate) <small><sup>v0.1.0</sup></small>

`PP.punctuate` concatenates the given separator after each document in the given
list of documents except the last.

For example:

```js
PP.punctuate(',', ['a', 'b', 'c'])
// [ [ 'a', ',' ], [ 'b', ',' ], 'c' ]
```

### <a id="lazy-documents"></a> [≡](#contents) [Lazy documents](#lazy-documents)

#### <a id="PP-lazy"></a> [≡](#contents) [`PP.lazy(() => doc) ~> doc`](#PP-lazy) <small><sup>v0.1.0</sup></small>

`PP.lazy` creates a lazy document.

### <a id="enclosing-documents"></a> [≡](#contents) [Enclosing documents](#enclosing-documents)

#### <a id="PP-enclose"></a> [≡](#contents) [`PP.enclose([lhsDoc, rhsDoc], doc) ~> doc`](#PP-enclose) <small><sup>v0.1.0</sup></small>

`PP.enclose` encloses the given document between the given pair of documents.

#### <a id="document-pairs"></a> [≡](#contents) [Document pairs](#document-pairs)

##### <a id="PP-angles"></a> [≡](#contents) [`PP.angles ~> ['<', '>']`](#PP-angles) <small><sup>v0.1.0</sup></small>

##### <a id="PP-braces"></a> [≡](#contents) [`PP.braces ~> ['{', '}']`](#PP-braces) <small><sup>v0.1.0</sup></small>

##### <a id="PP-brackets"></a> [≡](#contents) [`PP.brackets ~> ['[', ']']`](#PP-brackets) <small><sup>v0.1.0</sup></small>

##### <a id="PP-dquotes"></a> [≡](#contents) [`PP.dquotes ~> ['"', '"']`](#PP-dquotes) <small><sup>v0.1.0</sup></small>

##### <a id="PP-parens"></a> [≡](#contents) [`PP.parens ~> ['(', ')']`](#PP-parens) <small><sup>v0.1.0</sup></small>

##### <a id="PP-spaces"></a> [≡](#contents) [`PP.spaces ~> [' ', ' ']`](#PP-spaces) <small><sup>v0.1.0</sup></small>

##### <a id="PP-squotes"></a> [≡](#contents) [`PP.squotes ~> ["'", "'"]`](#PP-squotes) <small><sup>v0.1.0</sup></small>

### <a id="alternative-documents"></a> [≡](#contents) [Alternative documents](#alternative-documents)

#### <a id="PP-choice"></a> [≡](#contents) [`PP.choice(wideDoc, narrowDoc) ~> doc`](#PP-choice) <small><sup>v0.1.0</sup></small>

`PP.choice(wideDoc, narrowDoc)` renders as the given `wideDoc` on a line if it
fits within the maximum width and otherwise as the `narrowDoc`.

#### <a id="PP-group"></a> [≡](#contents) [`PP.group(doc) ~> doc`](#PP-group) <small><sup>v0.1.0</sup></small>

`PP.group` allows [`PP.line`](#PP-line)s and [`PP.lineBreak`](#PP-lineBreak)s
within the given document to be undone if the result fits within the maximum
width.

### <a id="nested-documents"></a> [≡](#contents) [Nested documents](#nested-documents)

#### <a id="PP-nest"></a> [≡](#contents) [`PP.nest(string | number, doc) ~> doc`](#PP-nest) <small><sup>v0.1.0</sup></small>

`PP.nest` increases the nesting after next new line by the given string or by
the given number of spaces.

### <a id="layout-dependent-documents"></a> [≡](#contents) [Layout dependent documents](#layout-dependent-documents)

#### <a id="PP-column"></a> [≡](#contents) [`PP.column(column => doc) ~> doc`](#PP-column) <small><sup>v0.1.0</sup></small>

`PP.column` allows a document to depend on the column at which the document
starts.

#### <a id="PP-nesting"></a> [≡](#contents) [`PP.nesting(nesting => doc) ~> doc`](#PP-nesting) <small><sup>v0.1.0</sup></small>

`PP.nesting` allows a document to depend on the nesting after the next new line.

### <a id="aligned-documents"></a> [≡](#contents) [Aligned documents](#aligned-documents)

#### <a id="PP-align"></a> [≡](#contents) [`PP.align(doc) ~> doc`](#PP-align) <small><sup>v0.1.0</sup></small>

`PP.align` creates a document such that the nesting of the document is aligned
to the current column.

#### <a id="PP-hang"></a> [≡](#contents) [`PP.hang(string | number, doc) ~> doc`](#PP-hang) <small><sup>v0.1.0</sup></small>

`PP.hang` creates a document such that the document is nested by the given
string or number of spaces starting from the current column.

#### <a id="PP-indent"></a> [≡](#contents) [`PP.indent(string | number, doc) ~> doc`](#PP-indent) <small><sup>v0.1.0</sup></small>

`PP.indent` creates a document such that the document is intended by the given
prefix or number of spaces starting from the current column.

## <a id="related-work"></a> [≡](#contents) Related Work

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
