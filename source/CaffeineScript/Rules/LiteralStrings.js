let Caf = require("caffeine-script-runtime");
Caf.defMod(module, () => {
  let ArtFoundation = require("art-foundation"),
    SemanticTree = require("../SemanticTree"),
    Lib = require("../Lib"),
    dqStringStartRegexp,
    normalizeString,
    normalizeHereDoc,
    escapeJavascriptString,
    StringStn,
    InterpolatedStringStn,
    deescapeSpaces,
    escapeUnEscapedQuotes;
  ({
    escapeJavascriptString,
    StringStn,
    InterpolatedStringStn,
    deescapeSpaces,
    escapeUnEscapedQuotes
  } = Caf.i(
    [
      "escapeJavascriptString",
      "StringStn",
      "InterpolatedStringStn",
      "deescapeSpaces",
      "escapeUnEscapedQuotes"
    ],
    [ArtFoundation, SemanticTree, Lib, global]
  ));
  dqStringStartRegexp = /"([^\\"\#]|\\[\s\S]|\#(?!\{))*/;
  normalizeString = function(string) {
    string = escapeJavascriptString(string.toString().trim());
    string = string.replace(/\\\\/g, "\\");
    return string = string.replace(/\\ /g, " ");
  };
  normalizeHereDoc = function(hereDoc) {
    let all, firstLine, rest, indents, minIndent;
    [all, firstLine, rest] = hereDoc.match(/^([^\n]*)(?=\n|$)((?:.|\n)*)/);
    return !rest || rest.length === 0
      ? firstLine
      : (indents = rest.match(/\n *(?=[^ \n])/g), (indents != null &&
          indents.length) > 0
          ? (minIndent = null, Caf.e(indents, undefined, (i, k, into) => {
              let len;
              len = i.length - 1;
              return !(minIndent != null) || len < minIndent
                ? minIndent = len
                : undefined;
            }), rest = rest.replace(RegExp(`\n {${minIndent}}`, "g"), "\n"))
          : undefined, rest = rest.replace(/^\n/, ""), !(!firstLine ||
          firstLine != null && firstLine.match(/\ */))
          ? rest = firstLine + "\\n" + rest
          : undefined, rest);
  };
  return function() {
    this.rule({
      stringLiteral: {
        pattern: '/"" */ unparsedBlock',
        getStn: function() {
          return StringStn({ value: this.unparsedBlock.toString().trim() });
        }
      }
    });
    this.rule(
      {
        stringLiteral: [
          "hereDocDqStringStart mid:hereDocDqStringMiddle interpolation:hereDocDqStringInterpolation? hereDoc:hereDocDqStringEnd",
          "hereDocSqStringStart mid:hereDocSqStringMiddle interpolation:hereDocSqStringInterpolation? hereDoc:hereDocSqStringEnd",
          "eolStringStart mid:eolStringMiddle interpolation:eolStringInterpolation? eolStringEnd",
          "dqStringStart mid:dqStringMiddle interpolation:dqStringInterpolation? dqStringEnd"
        ]
      },
      {
        getStnChildren: function(appendTo = []) {
          if (this.mid.matchLength > 0) {
            appendTo.push(StringStn({ value: this.mid.toString() }));
          }
          this.interpolation != null &&
            this.interpolation.getStnChildren(appendTo);
          return appendTo;
        },
        getStn: function() {
          return this.hereDoc
            ? StringStn({ value: normalizeHereDoc(this.mid.toString()) })
            : this.interpolation
                ? InterpolatedStringStn(this.getStnChildren())
                : StringStn({ value: this.mid.toString() });
        }
      }
    );
    this.rule(
      {
        stringLiteral: [
          "/'/ string:/([^\\']|\\.)*/ /'/",
          "':' string:unquotedString"
        ]
      },
      {
        getStn: function() {
          return StringStn({ value: this.string.toString() });
        }
      }
    );
    this.rule({
      hereDocDqStringStart: /"""( *(?=\n))?/,
      hereDocSqStringStart: /'''( *(?=\n))?/,
      eolStringStart: /"" +/,
      dqStringStart: /"/,
      interpolationStart: /\#\{/,
      interpolationEnd: /\}/
    });
    this.rule(
      {
        eolStringMiddle: /(([ ]*(?=\S))|[^ \n\\#]|\\[^\n]|\#(?!\{))*/,
        dqStringMiddle: /([^"\\#]|\\.|\#(?!\{))*/,
        hereDocDqStringMiddle: /((?!(\n *)?""")([^\\#]|\\.|\#(?!\{)))*/,
        hereDocSqStringMiddle: /((?!(\n *)?''')([^\\#]|\\.|\#(?!\{)))*/
      },
      {
        toEscapedQuotes: function(quote) {
          return deescapeSpaces(escapeUnEscapedQuotes(this.toString(), quote));
        },
        toEscapedBackTicks: function() {
          return deescapeSpaces(escapeUnEscapedQuotes(this.toString(), "`"));
        },
        toEscapedDoubleQuotes: function() {
          return deescapeSpaces(escapeUnEscapedQuotes(this.toString(), '"'));
        }
      }
    );
    this.rule(
      {
        dqStringInterpolation: "interpolationStart expression interpolationEnd mid:dqStringMiddle interpolation:dqStringInterpolation?",
        eolStringInterpolation: "interpolationStart expression interpolationEnd mid:eolStringMiddle interpolation:eolStringInterpolation?",
        hereDocDqStringInterpolation: "interpolationStart expression interpolationEnd mid:hearDocDqStringMiddle interpolation:hearDocDqStringInterpolation?",
        hereDocSqStringInterpolation: "interpolationStart expression interpolationEnd mid:hearDocDqStringMiddle interpolation:hearDocDqStringInterpolation?"
      },
      {
        getStnChildren: function(appendTo = []) {
          appendTo.push(this.expression.getStn());
          if (this.mid.matchLength > 0) {
            appendTo.push(StringStn({ value: this.mid.toString() }));
          }
          this.interpolation != null &&
            this.interpolation.getStnChildren(appendTo);
          return appendTo;
        }
      }
    );
    return this.rule({
      hereDocDqStringEnd: /(\n *)?"""/,
      hereDocSqStringEnd: /(\n *)?'''/,
      dqStringEnd: /"/,
      eolStringEnd: /\ *(?=\n|$)/
    });
  };
});