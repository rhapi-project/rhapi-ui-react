//$ npm run docs

const fs = require("fs");
const _ = require("lodash");

const format = "md"; // à récupérer en param
const src = process.cwd() + "/src/"; // ou ../src

const docClient = "Documentation générale pour la prop client...";

makeDocMd = propDefs => {
  console.log("## " + propDefs.component);
  console.log(propDefs.description);
  console.log("#### Props du composant");
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
    console.log("* " + p + " (" + parts.join(", ") + ") : " + doc);
  });
};

makeDoc = propDefs => {
  if (format === "md") {
    makeDocMd(propDefs);
  }
  //...
};

parseComponent = (path, format) => {
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
    makeDoc(propDefs);
  });
  return true;
};

// main
parseGroup = group => {
  fs.readdir(src + group, (err, items) => {
    if (err) {
      throw err;
    }
    _.forEach(items, item => {
      if (_.endsWith(item, ".js")) {
        console.log("# " + group);
        parseComponent(src + group + "/" + item);
      }
    });
  });
  //
};

parseGroup("CCAM");
//...
