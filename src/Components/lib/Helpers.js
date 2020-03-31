import _ from "lodash";
import jsPDF from "jspdf";
import html2Canvas from "html2canvas";

// Affichage du tarif au bon format
// ex : 1250.3 => 1 250,30
//      11510  => 11 510,00
const tarif = number => {
  return number.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const tarifDotNotation = tarifStr => {
  let t = _.replace(tarifStr, /,/, ".");
  return t;
};

const valideLocalisation = [
  "10",
  "01",
  "20",
  "03",
  "04",
  "05",
  "18",
  "17",
  "16",
  "15",
  "14",
  "13",
  "12",
  "11",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "55",
  "54",
  "53",
  "52",
  "51",
  "61",
  "62",
  "63",
  "64",
  "65",
  "85",
  "84",
  "83",
  "82",
  "81",
  "71",
  "72",
  "73",
  "74",
  "75",
  "48",
  "47",
  "46",
  "45",
  "44",
  "43",
  "42",
  "41",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "08",
  "07",
  "06",
  "40",
  "02",
  "30"
];

const secteur03 = ["14", "15", "16", "17", "18", "54", "55"];

const secteur04 = [
  "11",
  "12",
  "13",
  "21",
  "22",
  "23",
  "51",
  "52",
  "53",
  "61",
  "62",
  "63"
];

const secteur05 = ["24", "25", "26", "27", "28", "64", "65"];

const secteur06 = ["34", "35", "36", "37", "38", "74", "75"];

const secteur07 = [
  "31",
  "32",
  "33",
  "41",
  "42",
  "43",
  "71",
  "72",
  "73",
  "81",
  "82",
  "83"
];

const secteur08 = ["44", "45", "46", "47", "48", "84", "85"];

const codesDocs = [
  {
    mimeType: "text/plain",
    icon: "file alternate outline",
    code: "#DOC_PLAIN",
    type: "Document texte"
  },
  {
    mimeType: "application/pdf",
    icon: "file pdf outline",
    code: "#DOC_PDF",
    type: "Document PDF"
  },
  {
    mimeType: "text/html",
    icon: "file code outline",
    code: "#DOC_HTML",
    type: "Document HTML"
  },
  {
    mimeType: "text/x-html-template",
    icon: "file code outline",
    type: "Modèle"
  },
  {
    mimeType: "default",
    icon: "square outline",
    code: "default",
    type: "Document"
  }
];

const spacedLocalisation = localisationStr => {
  let l = toISOLocalisation(localisationStr);
  let s = "";
  _.forEach(l, (value, i) => {
    if (i % 2 === 0) {
      s += value;
    } else {
      s += value + " ";
    }
  });
  let arrayLocalisation = _.filter(_.split(_.trim(s), " "), str =>
    _.includes(valideLocalisation, str)
  );
  let rmDuplicates = _.sortBy(_.uniq(arrayLocalisation), str => parseInt(str));
  return rmDuplicates.join(" ");
};

const toISOLocalisation = localisation => {
  return _.replace(localisation, /[\s,?.;/:\-a-zA-Z]/g, "");
};

const downloadBinaryFile = (base64, filename) => {
  let a = document.createElement("a");
  a.href = base64;
  a.download = filename;
  a.click();
};

const downloadTextFile = (content, filename, mimeType) => {
  let a = document.createElement("a");
  let file = new Blob([content], { type: mimeType });
  a.href = URL.createObjectURL(file);
  a.download = filename;
  document.body.appendChild(a); // pour FireFox
  a.click();
};

const uploadFile = (event, onSucess, onError) => {
  if (_.get(event.target.files, "length") !== 0) {
    let file = _.get(event.target.files, "0");
    let fileReader = new FileReader();

    if (_.split(file.type, "/")[0] !== "text") {
      // conversion en base64
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        onSucess(file, fileReader);
      };
    } else {
      fileReader.readAsText(file);
      fileReader.onload = () => {
        onSucess(file, fileReader);
      };
      fileReader.onerror = () => {
        onError();
      };
    }
  }
};

// TODO : essayer une autre méthode de génération de PDF
// car le rendu de celle-ci n'est pas joli surtout quand 
// il y a des tableau dans le HTML
const downloadPDF = (content, filename) => {
  let doc = new jsPDF("p", "pt", "a4");
  doc.fromHTML(content, 15, 5, {});
  doc.save(filename + ".pdf");
};

/*const outputPDF = content => {
  let doc = new jsPDF();
  doc.fromHTML(content, 15, 5, {});
  let base64 = doc.output("datauristring", { filename: "output.pdf" });
  let pdfWindow = window.open("#", "_blank");
  pdfWindow.document.write(
    "<iframe width='100%' height='100%' src='" + base64 + "'></iframe>"
  );
};*/

/*const contentToBase64PDF = content => {
  let doc = new jsPDF();
  doc.fromHTML(content, 15, 5, {});
  return doc.output("datauristring");
};*/

// Ici, utilisation de Html2Canvas avec jsPDF car
// le rendu avec jsPDF seulement ne prend pas en compte
// le CSS.
// https://stackoverflow.com/questions/25946275/exporting-pdf-with-jspdf-not-rendering-css
// TODO : tester ce code sur plusieurs types de documents
const htmlToPDF = (html, onSuccess, onError) => {
  let win = window.open("", "Document", "width=300,height=300");
  win.document.write(html);
  html2Canvas(win.document.getElementsByTagName("html")[0], { logging: false }).then(canvas => {
    let img = canvas.toDataURL("image/png");
    let doc = new jsPDF();
    doc.addImage(img, "JPEG", 10, 10);
    win.close();
    onSuccess(doc.output("datauristring"))
  }).catch(onError);
}

// TODO : définir un comportement dans le cas où le résultat
// du readAll des documents (modèles) contient plusieurs
// pages.
// TODO : définir les codes d'erreur à renvoyer en paramètre du 
// callback 'onError'
const modeleDocument = (client, origine, usage, onSuccess, onError) => {
  client.Documents.readAll(
    {
      _mimeType: "text/x-html-template",
      origine: origine,
      exfields: "document" // comment extraire plusieurs champs ?
    },
    result => {
      let modelesUsage = [];
      _.forEach(result.results, modele => {
        if (_.get(modele.infosJO, "modele.usage", "") === usage) {
          modelesUsage.push(modele);
        }
      });
      if (_.isEmpty(modelesUsage)) {
        onError(undefined);
        return;
      }

      let idModeleDefaut = 
        _.findIndex(modelesUsage, modele => modele.infosJO.modele.defaut);
      
      client.Documents.read(
        idModeleDefaut === -1 ? modelesUsage[0].id : modelesUsage[idModeleDefaut].id,
        {},
        modele => {
          onSuccess(modele);
        },
        error => {
          //console.log(error);
          onError(error);
        }
      );
    },
    error => {
      //console.log(error);
      onError(error);
    }
  );
};

const setModeleDocument = (
  client,
  origine,
  id,
  nom,
  usage,
  defaut,
  onSuccess,
  onError
) => {
  client.Documents.read(
    id,
    {},
    result => {
      if (result.origine !== origine) {
        onError(undefined);
        return;
      }
      if (defaut) {
        client.Documents.readAll(
          {
            _mimeType: "text/x-html-template",
            _origine: origine,
            exfields: "document"
          },
          res => {
            _.forEach(res.results, modele => {
              if (
                modele.id !== id &&
                modele.origine === origine &&
                _.get(modele.infosJO.modele, "usage", "") === usage &&
                _.get(modele.infosJO.modele, "defaut", false)
              ) {
                client.Documents.update(
                  modele.id,
                  {
                    infosJO: {
                      modele: {
                        defaut: false,
                        nom: _.get(modele.infosJO.modele, "nom", ""),
                        usage: _.get(modele.infosJO.modele, "usage", "")
                      }
                    }
                  },
                  r => {
                    //console.log("màj du modèle terminé");
                  },
                  e => {
                    //console.log(e);
                  }
                );
              }
            });
          },
          err => {
            onError(err);
            return;
          }
        );
      }

      // màj du modèle courant
      client.Documents.update(
        id,
        {
          infosJO: {
            modele: {
              nom: nom, // vérifier (utilisation des caractères acceptables pour la nomenclature des fichiers)
              usage: usage,
              defaut: defaut
            }
          }
        },
        res => {
          onSuccess(res);
        },
        err => {
          onError(err);
        }
      );
    },
    error => {
      onError(error);
    }
  );
};

export {
  spacedLocalisation,
  tarif,
  tarifDotNotation,
  toISOLocalisation,
  secteur03,
  secteur04,
  secteur05,
  secteur06,
  secteur07,
  secteur08,
  codesDocs,
  downloadBinaryFile,
  downloadTextFile,
  uploadFile,
  modeleDocument,
  setModeleDocument,
  downloadPDF,
  htmlToPDF
};
