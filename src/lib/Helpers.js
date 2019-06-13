import _ from "lodash";

// Affichage du tarif au bon format
// ex : 1250.3 => 1 250,30
//      11510  => 11 510,00
const tarif = number => {
  return number.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const tarifDotNotation = tarifStr => {
  let t = _.replace(tarifStr, /,/, ".");
  return t;
};

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
  return _.trim(s);
};

const toISOLocalisation = localisation => {
  return _.replace(localisation, /[\s,\?.;\/:-]/g, "");
};

export { spacedLocalisation, tarif, tarifDotNotation, toISOLocalisation };