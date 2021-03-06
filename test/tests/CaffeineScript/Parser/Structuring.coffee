{CaffeineScript} = Neptune
{log, formattedInspect} = Neptune.Art.StandardLib
{Parser} = CaffeineScript

{parseTestSuite} = require '../Helper'

module.exports = suite: parseTestSuite
  ObjectLiterals:
    bracketed:
      "{a}":    "({a});"
      "{a, b}": "({a, b});"

    toEol:
      "{} a":    "({a});"
      "{} a, b": "({a, b});"

    block:
      "{}\n a":     "({a});"
      "{}\n a, b":  "({a, b});"
      "{}\n a\n b": "({a, b});"

    smart:
      "{a: a}":     "({a});"
      "{} a: a":    "({a});"
      "{}\n a: a":  "({a});"

    this:
      "{@a}": "({a: this.a});"

    pathing:
      "{a.b}": "({b: a.b});"

    reservedWords:
      "{true}":       "({true: true});"
      "{true: true}": "({true: true});"
      "{false}":      "({false: false});"

    complex:
      """
      {}
        @a
        b.c
        d
        e: f
      """: "({a: this.a, c: b.c, d, e: f});"

      """
      {}
        (array v from a when a > 10).length
      """: "({length: Caf.each(a, [], (v, cafK, cafInto) => {if (a > 10) {cafInto.push(v);};}).length});"
