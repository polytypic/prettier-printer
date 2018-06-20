(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('infestines'), require('partial.lenses.validation')) :
  typeof define === 'function' && define.amd ? define(['exports', 'infestines', 'partial.lenses.validation'], factory) :
  (factory((global.PP = {}),global.I,global.V));
}(this, (function (exports,I,V) { 'use strict';

  var length = function length(x) {
    return x.length;
  };

  var reduceRight = /*#__PURE__*/I.curry(function (fn, z, xs) {
    return xs.reduceRight(fn, z);
  });

  var repeat = /*#__PURE__*/I.curry(function (n, s) {
    return s.repeat(n);
  });

  var identical = /*#__PURE__*/I.curry(I.identicalU);

  var test = /*#__PURE__*/I.curry(function (re, s) {
    return I.isString(s) && re.test(s);
  });

  var fn = function fn(args, res) {
    return V.freeFn(V.args.apply(null, args), res);
  };

  var sq = function sq(t) {
    return V.tuple(t, t);
  };

  var padding = function padding(n) {
    return I.isString(n) ? n : repeat(n, ' ');
  };

  var Delay = function lazy(thunk) {
    return { c: 0, v: thunk };
  };
  var Eager = function Eager(value) {
    return { c: 1, v: value };
  };
  function force(x) {
    if (x.c !== 0) return x.v;
    var th = x.v;
    x.v = undefined;
    x.c = 1;
    return x.v = th();
  }

  var Nest = function nest(prefix, doc) {
    return { c: 3, p: prefix, d: doc };
  };
  var Choice = function Choice(wide, narrow) {
    return { c: 5, w: wide, n: narrow };
  };
  var With = function With(fn) {
    return { c: 6, f: fn };
  };

  var conOf = function conOf(doc) {
    return typeof doc === 'object' ? I.isArray(doc) ? 2 : doc.c : 4;
  };

  function flatten(doc) {
    switch (conOf(doc)) {
      case 0:
        return Delay(function () {
          return flatten(force(doc));
        });
      case 1:
        return flatten(doc.v);
      case 2:
        {
          var loop = function loop(i) {
            switch (length(doc) - i) {
              case 0:
                return '';
              case 1:
                return flatten(doc[i]);
              default:
                return [flatten(doc[i]), Delay(function () {
                  return loop(i + 1);
                })];
            }
          };
          return loop(0);
        }
      case 3:
        return Nest(doc.p, flatten(doc.d));
      case 4:
        switch (doc) {
          case '\n':
            return ' ';
          case '\r':
            return '';
          default:
            return doc;
        }
      case 5:
        return doc.w;
      default:
        return With(I.pipe2U(doc.f, flatten));
    }
  }

  var Nil = [0];
  var Linefeed = function Linefeed(prefix, rest) {
    return [1, prefix, rest];
  };
  var Print = function Print(text, rest) {
    return [2, text, rest];
  };

  function output(_ref, state, print) {
    var text = _ref.text,
        line = _ref.line;

    for (;;) {
      print = force(print);
      switch (print[0]) {
        case 0:
          return state;
        case 1:
          state = text(line(state), print[1]);
          print = print[2];
          break;
        default:
          state = text(state, print[1]);
          print = print[2];
          break;
      }
    }
  }

  function fits(maxCols, usedCols, print) {
    for (;;) {
      if (maxCols < usedCols) return false;
      print = force(print);
      if (print[0] < 2) {
        return true;
      } else {
        usedCols += length(print[1]);
        print = print[2];
      }
    }
  }

  var layoutDelay = function layoutDelay(maxCols, usedCols, docs) {
    return Delay(function () {
      return layout(maxCols, usedCols, docs);
    });
  };

  function layout(maxCols, usedCols, docs) {
    if (undefined === docs) return Nil;
    var prefix = docs[0];
    var doc = docs[1];
    var rest = docs[2];
    switch (conOf(doc)) {
      case 0:
        return layout(maxCols, usedCols, [prefix, force(doc), rest]);
      case 1:
        return layout(maxCols, usedCols, [prefix, doc.v, rest]);
      case 2:
        return layout(maxCols, usedCols, reduceRight(function (rest, doc) {
          return [prefix, doc, rest];
        }, rest, doc));
      case 3:
        return layout(maxCols, usedCols, [prefix + padding(doc.p), doc.d, rest]);
      case 4:
        switch (doc) {
          case '\n':
          case '\r':
            return Linefeed(prefix, layoutDelay(maxCols, length(prefix), rest));
          case '':
            return layout(maxCols, usedCols, rest);
          default:
            return Print(doc, layoutDelay(maxCols, usedCols + length(doc), rest));
        }
      case 5:
        {
          var wide = layout(maxCols, usedCols, [prefix, doc.w, rest]);
          return !maxCols || fits(maxCols, usedCols, Eager(wide)) ? wide : layout(maxCols, usedCols, [prefix, doc.n, rest]);
        }
      default:
        return layout(maxCols, usedCols, [prefix, doc.f(usedCols, prefix), rest]);
    }
  }

  //

  var line = '\n';
  var lineBreak = '\r';
  var softLine = /*#__PURE__*/Choice(' ', line);
  var softBreak = /*#__PURE__*/Choice('', lineBreak);

  //

  var prepend = /*#__PURE__*/I.curry(function prepend(lhs, rhs) {
    return [lhs, rhs];
  });
  var append = /*#__PURE__*/I.curry(function append(rhs, lhs) {
    return [lhs, rhs];
  });

  //

  var intersperse = /*#__PURE__*/I.curry(function intersperse(sep, docs) {
    var result = [];
    var n = length(docs);
    if (n) result.push(docs[0]);
    for (var i = 1; i < n; ++i) {
      result.push(sep, docs[i]);
    }return result;
  });

  var punctuate = /*#__PURE__*/I.curry(function punctuate(sep, docs) {
    var r = [];
    var n = length(docs);
    var nm1 = n - 1;
    for (var i = 0; i < nm1; ++i) {
      r.push([docs[i], sep]);
    }if (n) r.push(docs[nm1]);
    return r;
  });

  //

  var lazy = Delay;

  //

  var pair = function pair(l, r) {
    return I.freeze([l, r]);
  };
  var sq$1 = function sq(d) {
    return pair(d, d);
  };

  var angles = /*#__PURE__*/pair('<', '>');
  var braces = /*#__PURE__*/pair('{', '}');
  var brackets = /*#__PURE__*/pair('[', ']');
  var dquotes = /*#__PURE__*/sq$1('"');
  var lineBreaks = /*#__PURE__*/sq$1(lineBreak);
  var lines = /*#__PURE__*/sq$1(line);
  var parens = /*#__PURE__*/pair('(', ')');
  var spaces = /*#__PURE__*/sq$1(' ');
  var squotes = /*#__PURE__*/sq$1("'");

  var enclose = /*#__PURE__*/I.curry(function enclose(pair, doc) {
    return [pair[0], doc, pair[1]];
  });

  //

  var choice = /*#__PURE__*/I.curry(function choice(wide, narrow) {
    return Choice(flatten(wide), narrow);
  });

  var group = function group(doc) {
    return choice(doc, doc);
  };

  //

  var nest = /*#__PURE__*/I.curry(Nest);

  //

  var column = function column(withColumn) {
    return With(function column(column) {
      return withColumn(column);
    });
  };

  var nesting = function nesting(withNesting) {
    return With(function nesting(_, prefix) {
      return withNesting(length(prefix));
    });
  };

  var align = function align(doc) {
    return With(function align(column, prefix) {
      return Nest(column - length(prefix), doc);
    });
  };

  var hang = /*#__PURE__*/I.curry(function hang(indent, doc) {
    return align(Nest(indent, doc));
  });

  var indent = /*#__PURE__*/I.curry(function indent(prefix, doc) {
    return hang(prefix, [padding(prefix), doc]);
  });

  //

  var renderWith = /*#__PURE__*/I.curry(function renderWith(actions, zero, maxCols, doc) {
    return output(actions, zero, Eager(layout(maxCols, 0, ['', doc, undefined])));
  });

  var render = /*#__PURE__*/renderWith({
    line: function line(result) {
      return result + '\n';
    },
    text: function text(result, _text) {
      return result + _text;
    }
  }, '');

  var doc = /*#__PURE__*/V.lazy(function (doc) {
    return V.cases([I.isString, test(/^([\n\r]|[^\n\r]*)$/)], [I.isArray, V.arrayIx(doc)], [V.or(V.props({ c: identical(0), v: I.isFunction }), V.props({ c: identical(1), v: V.accept }), V.props({
      c: identical(3),
      p: V.or(I.isString, I.isNumber),
      d: V.accept
    }), V.props({ c: identical(5), w: V.accept, n: V.accept }), V.props({ c: identical(6), f: I.isFunction }))]);
  });

  var C = function (x, c) {
    var v = V.validate(c, x);
    return I.isFunction(x) ? I.arityN(length(x), v) : v;
  };

  // Rendering documents

  var render$1 = /*#__PURE__*/C(render, /*#__PURE__*/fn([I.isNumber, doc], I.isString));
  var renderWith$1 = /*#__PURE__*/C(renderWith, /*#__PURE__*/fn([/*#__PURE__*/V.props({ text: I.isFunction, line: I.isFunction }), V.accept, I.isNumber, doc], V.accept));

  // Document constants

  var line$1 = /*#__PURE__*/C(line, doc);
  var lineBreak$1 = /*#__PURE__*/C(lineBreak, doc);
  var softLine$1 = /*#__PURE__*/C(softLine, doc);
  var softBreak$1 = /*#__PURE__*/C(softBreak, doc);

  // Concatenating documents

  var append$1 = /*#__PURE__*/C(append, /*#__PURE__*/fn([doc, doc], doc));
  var prepend$1 = /*#__PURE__*/C(prepend, /*#__PURE__*/fn([doc, doc], doc));

  // Lists of documents

  var intersperse$1 = /*#__PURE__*/C(intersperse, /*#__PURE__*/fn([doc, /*#__PURE__*/V.arrayId(doc)], /*#__PURE__*/V.arrayId(doc)));
  var punctuate$1 = /*#__PURE__*/C(punctuate, /*#__PURE__*/fn([doc, /*#__PURE__*/V.arrayId(doc)], /*#__PURE__*/V.arrayId(doc)));

  // Lazy documents

  var lazy$1 = /*#__PURE__*/C(lazy, /*#__PURE__*/fn([/*#__PURE__*/fn([], doc)], doc));

  // Enclosing documents

  var enclose$1 = /*#__PURE__*/C(enclose, /*#__PURE__*/fn([/*#__PURE__*/sq(doc), doc], doc));

  // Document pair constants

  var angles$1 = /*#__PURE__*/C(angles, /*#__PURE__*/sq(doc));
  var braces$1 = /*#__PURE__*/C(braces, /*#__PURE__*/sq(doc));
  var brackets$1 = /*#__PURE__*/C(brackets, /*#__PURE__*/sq(doc));
  var dquotes$1 = /*#__PURE__*/C(dquotes, /*#__PURE__*/sq(doc));
  var lineBreaks$1 = /*#__PURE__*/C(lineBreaks, /*#__PURE__*/sq(doc));
  var lines$1 = /*#__PURE__*/C(lines, /*#__PURE__*/sq(doc));
  var parens$1 = /*#__PURE__*/C(parens, /*#__PURE__*/sq(doc));
  var spaces$1 = /*#__PURE__*/C(spaces, /*#__PURE__*/sq(doc));
  var squotes$1 = /*#__PURE__*/C(squotes, /*#__PURE__*/sq(doc));

  // Alternative documents

  var choice$1 = /*#__PURE__*/C(choice, /*#__PURE__*/fn([doc, doc], doc));
  var group$1 = /*#__PURE__*/C(group, /*#__PURE__*/fn([doc], doc));

  // Nested documents

  var nest$1 = /*#__PURE__*/C(nest, /*#__PURE__*/fn([/*#__PURE__*/V.or(I.isString, I.isNumber), doc], doc));

  // Layout dependent documents

  var column$1 = /*#__PURE__*/C(column, /*#__PURE__*/fn([/*#__PURE__*/fn([I.isNumber], doc)], doc));
  var nesting$1 = /*#__PURE__*/C(nesting, /*#__PURE__*/fn([/*#__PURE__*/fn([I.isNumber], doc)], doc));

  // Aligned documents

  var align$1 = /*#__PURE__*/C(align, /*#__PURE__*/fn([doc], doc));
  var hang$1 = /*#__PURE__*/C(hang, /*#__PURE__*/fn([/*#__PURE__*/V.or(I.isString, I.isNumber), doc], doc));
  var indent$1 = /*#__PURE__*/C(indent, /*#__PURE__*/fn([/*#__PURE__*/V.or(I.isString, I.isNumber), doc], doc));

  exports.render = render$1;
  exports.renderWith = renderWith$1;
  exports.line = line$1;
  exports.lineBreak = lineBreak$1;
  exports.softLine = softLine$1;
  exports.softBreak = softBreak$1;
  exports.append = append$1;
  exports.prepend = prepend$1;
  exports.intersperse = intersperse$1;
  exports.punctuate = punctuate$1;
  exports.lazy = lazy$1;
  exports.enclose = enclose$1;
  exports.angles = angles$1;
  exports.braces = braces$1;
  exports.brackets = brackets$1;
  exports.dquotes = dquotes$1;
  exports.lineBreaks = lineBreaks$1;
  exports.lines = lines$1;
  exports.parens = parens$1;
  exports.spaces = spaces$1;
  exports.squotes = squotes$1;
  exports.choice = choice$1;
  exports.group = group$1;
  exports.nest = nest$1;
  exports.column = column$1;
  exports.nesting = nesting$1;
  exports.align = align$1;
  exports.hang = hang$1;
  exports.indent = indent$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
