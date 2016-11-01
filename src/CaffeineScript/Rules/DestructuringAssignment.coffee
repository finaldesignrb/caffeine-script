{a, m, w, log, formattedInspect, escapeJavascriptString} = require "art-foundation"
{SimpleLiteralStn} =  require '../SemanticTree'

module.exports = ->
  @rule
    destructuringAssignment: "structure:destructuringTarget _? '=' _? value:expression"
  , stnFactory: "DestructuringAssignmentStn"

  @rule
    destructuringTarget: w "objectDestructuring arrayDestructuring"

  @rule
    objectDestructuring: "'{' _? objectDestructuringElement* _? '}'"
    implicitObjectDestructuring: /TODO/

    objectDestructuringElement: "objectDestructuringElementPart spaceOrComma"
    spaceOrComma: ["_? ',' _?", "_"]

    objectDestructuringElementPart: w "identifier destructuringProperty"

    destructuringProperty: "identifier _? ':' _?"
  # , stnFactory: "ObjectDestructuringStn"

  @rule
    arrayDestructuring: "'[' _? identifier _? ']'"
  , stnFactory: "ArrayDestructuringStn"

  @rule
    arrayDestructuringElement: w "identifier objectDestructuring arrayDestructuring implicitObjectDestructuring"

