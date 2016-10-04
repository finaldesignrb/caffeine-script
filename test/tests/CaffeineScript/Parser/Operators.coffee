{CaffeineScript} = Neptune
{log, formattedInspect} = Neptune.Art.Foundation
{Parser} = CaffeineScript

{parseTests} = require '../Helper'

module.exports = suite:
  binary: ->
    parseTests
      "1+2":       "1 + 2;"
      "1 +   2":   "1 + 2;"
      "1 -   2":   "1 - 2;"
      "1 *   2":   "1 * 2;"
      "1 /   2":   "1 / 2;"
      "1 %   2":   "1 % 2;"

      "1 **  2":   "Caf.pow(1, 2);"
      "1 //  2":   "Caf.div(1, 2);"
      "1 %%  2":   "Caf.mod(1, 2);"

      "1 <<  2":   "1 << 2;"
      "1 >>  2":   "1 >> 2;"
      "1 >>> 2":   "1 >>> 2;"
      "1 ==  2":   "1 === 2;"
      "1 !=  2":   "1 !== 2;"
      "1 <   2":   "1 < 2;"
      "1 >   2":   "1 > 2;"
      "1 <=  2":   "1 <= 2;"
      "1 >=  2":   "1 >= 2;"

      "1 &&   2":   "1 && 2;"
      "1 ||   2":   "1 || 2;"
      "1 &    2":   "1 & 2;"
      "1 |    2":   "1 | 2;"
      "1 ^    2":   "1 ^ 2;"

      "1 ?    2":   "Caf.existsOr(1, ()=>{return 2});"
      "1 and  2":   "1 && 2;"
      "1 or   2":   "1 || 2;"
      "1 isnt 2":   "1 !== 2;"
      "1 is   2":   "1 === 2;"
      "1 in   2":   "Caf.in(1, 2);"

  unary: ->
    parseTests
      "!true": "!true;"
      "!!true": "!!true;"

      "not true": "!true;"

      "nottrue": "nottrue;"

  multiline:

    basic: ->
      parseTests
        """
        foo
        || bar
        """: "(foo) || bar;"

        """
        foo = baz.dood
          1
          2
        || bar
        """: "(foo = baz.dood(1, 2)) || bar;"

        """
        foo
        || bar
        || baz
        """: "((foo) || bar) || baz;"

    multilineWithIndent: ->
      parseTests
        """
        foo
        || bar
        """: "(foo) || bar;"


    multilineInvocation: ->
      parseTests
        """
        foo
        (bar)
        """: "(foo)(bar);"

    multilineAccess: ->
      parseTests
        """
        foo
        .bar
        """: "(foo).bar;"

        """
        foo
        .bar = c
        """: "(foo).bar = c;"

        """
        foo
        .bar().baz = c
        """: "(foo).bar().baz = c;"

        """
        foo
        .bar 1
        """: "(foo).bar(1);"

        """
        foo = baz.dood
          1
          2
        .bar
        """: "(foo = baz.dood(1, 2)).bar;"

        """
        foo = baz.dood
          1
          2
        .then -> 123
        .catch -> 456
        """: "((foo = baz.dood(1, 2)).then((function() {return 123;}))).catch((function() {return 456;}));"


