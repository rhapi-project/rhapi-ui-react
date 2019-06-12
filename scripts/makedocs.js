//$ npm run docs

const fs = require("fs");
const _ = require("lodash");

const src = process.cwd() + "/src/"; // ou ../src

const docClient = "https://github.com/rhapi-project/rhapi-client";

const format = "md";

const docStream = fs.createWriteStream("./docs/composants.md");

makeDocMd = propDefs => {
  docStream.write("\n## " + propDefs.component + "\n");
  docStream.write(propDefs.description + "\n");
  docStream.write("#### Props du composant" + "\n");
  docStream.write("| Props | Type | Description |\n"); // new
  docStream.write("| ---- | ----- | ------ |\n"); // new
  _.forEach(propDefs.propTypes, (v, p) => {
    let parts = v.split(".");
    parts.shift();
    let doc = _.get(propDefs, "propDocs." + p, "");
    if (doc === "" && p === "client") {
      doc = "[Documentation générale du client RHAPI](" + docClient + ")";
    } else if (_.startsWith(doc, "semantic.")) {
      doc =
        "Documentation semantic-ui-react [" +
        _.upperFirst(p) +
        "](https://react.semantic-ui.com/" +
        doc.split(".")[1] +
        "/" +
        p +
        ")";
    }
    //docStream.write("* " + p + " (" + parts.join(", ") + ") : " + doc + "\n");
    docStream.write("| " + p + " | " + parts.join(", ") + " | " + doc + " |\n");
  });
};

makeDoc = (propDefs, format) => {
  if (format === "md") {
    makeDocMd(propDefs);
  }
  //...
};

parseComponent = path => {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      throw err;
    }
    let parts = path.split("/");
    let component = parts[parts.length - 1].split(".")[0];
    parts = data.split(/propDefs\s*=\s*{/);
    if (parts.length < 2) {
      console.warn("'propDefs' non défini pour le composant " + path);
      return false;
    }
    parts = parts[1].split(/\n\s*};/);
    let defs = "{" + parts[0] + "}";
    defs = defs.replace(/(PropTypes[\.\w]*)/g, '"$1"');
    defs = defs.replace(/(\"\s*\(\s*\[\s*\")|(\]\s*\)\s*)/g, " ");
    defs = defs.replace(/\"\s*,\s*\"/g, ",");
    defs = defs.replace(/PropTypes\.oneOfType\s*/g, "");
    defs = defs.replace(/,PropTypes\./g, ".");
    //console.log(defs);
    eval("var propDefs = " + defs);
    propDefs.component = component;
    makeDoc(propDefs, format);
  });
  return true;
};

// main
parseGroup = group => {
  docStream.write("# " + group + "\n");
  fs.readdir(src + group, (err, items) => {
    if (err) {
      throw err;
      return;
    }
    _.forEach(items, item => {
      if (_.endsWith(item, ".js")) {
        parseComponent(src + group + "/" + item);
      }
    });
  });
  //
};

parseGroup("CCAM");
parseGroup("Actes");
parseGroup("Shared");
//...
