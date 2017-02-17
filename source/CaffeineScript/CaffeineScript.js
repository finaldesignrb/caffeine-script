let Caf = require("caffeine-script-runtime");
Caf.defMod(module, () => {
  return {
    compile: function(source) {
      let Parser = require("./Parser");
      return {
        compiled: { js: Parser.parse(source).getStn().transform().toJsModule() }
      };
    }
  };
});