"use strict";
let Caf = require("caffeine-script-runtime");
Caf.defMod(module, () => {
  return Caf.importInvoke(
    ["log"],
    [global, require("art-standard-lib")],
    log => {
      return (
        require("./SemanticTree"),
        {
          version: require("../../package.json").version,
          compile: function(source, options = {}) {
            let transformedStn, stn, parseTree, e, cafError;
            return (() => {
              try {
                transformedStn = (stn = (parseTree = require("./CaffeineScriptParser").parse(
                  source,
                  options
                )).getStn())
                  .validateAll()
                  .transform();
                return {
                  compiled: {
                    js: options.bare
                      ? transformedStn.toBareJs()
                      : transformedStn.toJsModule()
                  }
                };
              } catch (cafError) {
                e = cafError;
                if (
                  !(
                    e.location != null ||
                    e.sourceFile != null ||
                    e.message.match(/parse|expect/i)
                  )
                ) {
                  log.error({
                    CaffeineScriptBETA: {
                      message:
                        "Uh-oh! There was an internal error compiling your file. We'd love to fix it. Could you submit an issue with a copy of the code that won't compile?\n\nSubmit issues here: https://github.com/caffeine-suite/caffeine-script/issues\n\nSorry for the inconvenience. Thank you so much for trying CaffeineScript!",
                      options,
                      parseTree,
                      stn,
                      transformedStn
                    }
                  });
                }
                return (() => {
                  throw e;
                })();
              }
            })();
          }
        }
      );
    }
  );
});
