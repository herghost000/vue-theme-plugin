const {
  generateTheme
} = require("./themeGenerator");
const path = require("path");

class VueThemePlugin {
  constructor(options) {
    const defaulOptions = {
      mainLessFile: path.join(__dirname, "../../src/styles/index.less"),
      varFile: path.join(__dirname, "../../src/styles/variables.less"),
      indexFileName: "index.html",
      generateOnce: false,
      lessUrl: "https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js",
      publicPath: ""
    };
    this.options = Object.assign(defaulOptions, options);
    this.generated = false;
  }

  apply(compiler) {
    const options = this.options;
    compiler.plugin("emit", function (compilation, callback) {
      if (options.generateOnce && this.colors) {
        compilation.assets["color.less"] = {
          source: () => this.colors,
          size: () => this.colors.length
        };
        return callback();
      }
      generateTheme(options)
        .then(css => {
          if (options.generateOnce) {
            this.colors = css;
          }
          compilation.assets["color.less"] = {
            source: () => css,
            size: () => css.length
          };
          callback();
        })
        .catch(err => {
          callback(err);
        });
    });
  }
}

module.exports = VueThemePlugin;