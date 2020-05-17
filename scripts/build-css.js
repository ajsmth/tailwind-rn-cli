const tailwind = require("tailwindcss");
const fs = require("fs");
const util = require("util");
const postcss = require("postcss");
const readFile = util.promisify(fs.readFile);

function buildCss(tailwindCss, configPath) {
  return readFile(tailwindCss).then((css) => {
    return postcss([tailwind(configPath)]).process(css, {
      // hide postcss warning
      from: undefined,
    });
  });
}

module.exports = buildCss;
