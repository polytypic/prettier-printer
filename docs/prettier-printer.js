(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('infestines')) :
	typeof define === 'function' && define.amd ? define(['exports', 'infestines'], factory) :
	(factory((global.PP = {}),global.I));
}(this, (function (exports,I) { 'use strict';

var padding = function padding(n) {
  return I.isString(n) ? n : ' '.repeat(n);
};

var Delay = function Delay(thunk) {
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

var Nest = function Nest(prefix, doc) {
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
          switch (doc.length - i) {
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
      usedCols += print[1].length;
      print = print[2];
    }
  }
}

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
      return layout(maxCols, usedCols, doc.reduceRight(function (rest, doc) {
        return [prefix, doc, rest];
      }, rest));
    case 3:
      return layout(maxCols, usedCols, [prefix + padding(doc.p), doc.d, rest]);
    case 4:
      switch (doc) {
        case '\n':
        case '\r':
          return Linefeed(prefix, Delay(function () {
            return layout(maxCols, prefix.length, rest);
          }));
        case '':
          return layout(maxCols, usedCols, rest);
        default:
          return Print(doc, Delay(function () {
            return layout(maxCols, usedCols + doc.length, rest);
          }));
      }
    case 5:
      {
        var wide = layout(maxCols, usedCols, [prefix, doc.w, rest]);
        if (!maxCols || fits(maxCols, usedCols, Eager(wide))) return wide;else return layout(maxCols, usedCols, [prefix, doc.n, rest]);
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

var prepend = /*#__PURE__*/I.curry(function (lhs, rhs) {
  return [lhs, rhs];
});
var append = /*#__PURE__*/I.curry(function (rhs, lhs) {
  return [lhs, rhs];
});

//

var intersperse = /*#__PURE__*/I.curry(function (sep, docs) {
  var result = [];
  var n = docs.length;
  for (var i = 0; i < n; ++i) {
    if (i) result.push(sep);
    result.push(docs[i]);
  }
  return result;
});

var punctuate = /*#__PURE__*/I.curry(function (sep, docs) {
  var last = docs.length - 1;
  return docs.map(function (doc, i) {
    return i !== last ? [doc, sep] : doc;
  });
});

//

var lazy = Delay;

//

var parens = /*#__PURE__*/I.freeze(['(', ')']);
var angles = /*#__PURE__*/I.freeze(['<', '>']);
var braces = /*#__PURE__*/I.freeze(['{', '}']);
var brackets = /*#__PURE__*/I.freeze(['[', ']']);
var squotes = /*#__PURE__*/I.freeze(["'", "'"]);
var dquotes = /*#__PURE__*/I.freeze(['"', '"']);
var spaces = /*#__PURE__*/I.freeze([' ', ' ']);

var enclose = /*#__PURE__*/I.curry(function (pair, doc) {
  return [pair[0], doc, pair[1]];
});

//

var choice = /*#__PURE__*/I.curry(function (wide, narrow) {
  return Choice(flatten(wide), narrow);
});

var group = function group(doc) {
  return choice(doc, doc);
};

//

var nest = /*#__PURE__*/I.curry(Nest);

//

var column = function column(withColumn) {
  return With(function (column, _) {
    return withColumn(column);
  });
};

var nesting = function nesting(withNesting) {
  return With(function (_, prefix) {
    return withNesting(prefix.length);
  });
};

var align = function align(doc) {
  return With(function (column, prefix) {
    return Nest(column - prefix.length, doc);
  });
};

var hang = /*#__PURE__*/I.curry(function (prefix, doc) {
  return align(Nest(prefix, doc));
});

var indent = /*#__PURE__*/I.curry(function (prefix, doc) {
  return hang(prefix, [padding(prefix), doc]);
});

//

var renderWith = /*#__PURE__*/I.curry(function (actions, zero, maxCols, doc) {
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

exports.line = line;
exports.lineBreak = lineBreak;
exports.softLine = softLine;
exports.softBreak = softBreak;
exports.prepend = prepend;
exports.append = append;
exports.intersperse = intersperse;
exports.punctuate = punctuate;
exports.lazy = lazy;
exports.parens = parens;
exports.angles = angles;
exports.braces = braces;
exports.brackets = brackets;
exports.squotes = squotes;
exports.dquotes = dquotes;
exports.spaces = spaces;
exports.enclose = enclose;
exports.choice = choice;
exports.group = group;
exports.nest = nest;
exports.column = column;
exports.nesting = nesting;
exports.align = align;
exports.hang = hang;
exports.indent = indent;
exports.renderWith = renderWith;
exports.render = render;

Object.defineProperty(exports, '__esModule', { value: true });

})));
