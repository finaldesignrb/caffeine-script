let Caf = require("caffeine-script-runtime");
Caf.defMod(module, () => {
  let ArtFoundation = require("art-foundation");
  return function() {
    return this.rule(
      {
        dotAccessor: "dot identifier assignmentExtension?",
        bracketAccessor: "questionMark? openBracket_ expression _closeBracket assignmentExtension?"
      },
      { stnFactory: "AccessorStn", stnExtension: true }
    );
  };
});