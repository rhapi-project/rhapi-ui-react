import _ from "lodash";
import { Icon, Label } from "semantic-ui-react";

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
  return _.replace(localisation, /[\s,\?.;\/:\-a-zA-Z]/g, "");
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
  secteur08
};
