//$ npm run docs

const fs = require("fs");
const _ = require("lodash");

const src = process.cwd() + "/src/"; // ou ../src

const docClient = "Documentation générale pour la prop client...";

const format = "md";

const docStream = fs.createWriteStream("./docs/readme.md");

makeDocMd = propDefs => {
  docStream.write("\n## " + propDefs.component + "\n");
  docStream.write(propDefs.description + "\n");
  docStream.write("#### Props du composant" + "\n");
  _.forEach(propDefs.propTypes, (v, p) => {
    let parts = v.split(".");
    parts.shift();
    let doc = _.get(propDefs, "propDocs." + p, "");
    if (doc === "" && p === "client") {
      doc = docClient;
    } else if (_.startsWith(doc, "semantic.")) {
      doc =
        "documentation semantic-ui-react [" +
        _.upperFirst(p) +
        "](https://react.semantic-ui.com/" +
        doc.split(".")[1] +
        "/" +
        p +
        ")";
    }
    docStream.write("* " + p + " (" + parts.join(", ") + ") : " + doc + "\n");
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
//...
