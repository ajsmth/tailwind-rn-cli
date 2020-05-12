import React from "react";
import PropTypes from "prop-types";
import { Text } from "ink";
import fs from "fs";
import path from "path";
import util from "util";

import buildCss from "../scripts/build-css";
import buildJson from "../scripts/build-json";

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

function copyTailwind(output) {
  return readFile(path.resolve(__dirname, "../../tailwind.js")).then((data) => {
    return writeFile(output, data);
  });
}

const cssPath = path.resolve(__dirname, "../../tailwind.css");

/// scaffold out react-native styles based on your tailwind.config.js
const GenerateTailwind = ({ config, output }) => {
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    setText("Starting build");
    const cwd = process.cwd();
    const dir = path.resolve(cwd, output);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    setText("Building css");
    buildCss(cssPath, config).then(({ css }) => {
      const json = buildJson(css);

      const writeCss = writeFile(path.resolve(dir, "styles.css"), css);
      const writeJson = writeFile(
        path.resolve(dir, "styles.json"),
        JSON.stringify(json, null, "\t")
      );
      const writeTailwindRn = copyTailwind(path.resolve(dir, "tailwind.js"));

      setText("Writing files...");

      Promise.all([writeCss, writeJson, writeTailwindRn])
        .then(() => {
          setText(`Done! Files are located in ${dir}`);
        })
        .catch((err) => {
          setText("Something went wrong: ", err.toString());
        });
    });
  }, [config, output]);

  return <Text>{text}</Text>;
};

GenerateTailwind.propTypes = {
  /// path to the tailwind.config.js file
  config: PropTypes.string.isRequired,
  /// path to the output directory - e.g ./src/styles
  output: PropTypes.string.isRequired,
};

export default GenerateTailwind;
