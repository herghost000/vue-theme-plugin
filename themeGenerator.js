const fs = require("fs");
const bundle = require("less-bundle-promise");
const hash = require("hash.js");

let hashCache = "";
let cssCache = "";


function generateTheme({
  mainLessFile,
  varFile,
}) {
  return new Promise((resolve, reject) => {

    let content = ”“;
    if (mainLessFile) {
      const customStyles = fs.readFileSync(mainLessFile).toString();
      content += `${customStyles}`;
    }
    const hashCode = hash.sha256().update(content).digest('hex');
    if (hashCode === hashCache) {
      resolve(cssCache);
      return;
    }
    hashCache = hashCode;
    return bundle({
        src: varFile
      }).then(colorsLess => {
        content = `${colorsLess}\n${content}`.replace(/@import.*;/igm,'');
        cssCache = content;
        return resolve(content);
      }).catch(err => {
      console.log("Error", err);
      reject(err);
    });
  });
}

module.exports = {
  generateTheme
};
