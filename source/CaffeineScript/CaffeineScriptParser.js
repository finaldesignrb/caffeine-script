"use strict";
let Caf = require("caffeine-script-runtime");
Caf.defMod(module, () => {
  return Caf.importInvoke(
    ["Parser", "isFunction"],
    [
      global,
      require("./StandardImport"),
      require("caffeine-eight"),
      require("./CafParseNodeBaseClass")
    ],
    (Parser, isFunction) => {
      let CaffeineScriptParser;
      return (CaffeineScriptParser = Caf.defClass(
        class CaffeineScriptParser extends Parser {},
        function(CaffeineScriptParser, classSuper, instanceSuper) {
          this.nodeBaseClass = require("./CafParseNodeBaseClass");
          Caf.each(require("./Rules").modules, undefined, mod => {
            if (isFunction(mod)) {
              mod.call(this);
            } else {
              this.rule(mod);
            }
          });
          this.prototype.parse = function(source, options) {
            return instanceSuper.parse.call(
              this,
              require("./Preprocessors").preprocess(source),
              options
            );
          };
        }
      ));
    }
  );
});
