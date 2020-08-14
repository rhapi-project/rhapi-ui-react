import _ from "lodash";

import {
  secteur03,
  secteur04,
  secteur05,
  secteur06,
  secteur07,
  secteur08
} from "./Helpers";

const queriesLocalisation = localisation => {
  let result = [];
  let dents = localisation.split(" ");

  _.forEach(dents, dent => {
    if (dent === "01") {
      result.push("OR,localisation,Like,1*");
      result.push("OR,localisation,Like,* 1*");
      result.push("OR,localisation,Like,5*");
      result.push("OR,localisation,Like,* 5*");
      result.push("OR,localisation,Like,2*");
      result.push("OR,localisation,Like,* 2*");
      result.push("OR,localisation,Like,6*");
      result.push("OR,localisation,Like,* 6*");
      result.push("OR,localisation,Like,*03*");
      result.push("OR,localisation,Like,*04*");
      result.push("OR,localisation,Like,*05*");
    } else if (dent === "02") {
      result.push("OR,localisation,Like,3*");
      result.push("OR,localisation,Like,* 3*");
      result.push("OR,localisation,Like,7*");
      result.push("OR,localisation,Like,* 7*");
      result.push("OR,localisation,Like,4*");
      result.push("OR,localisation,Like,* 4*");
      result.push("OR,localisation,Like,8*");
      result.push("OR,localisation,Like,* 8*");
      result.push("OR,localisation,Like,*06*");
      result.push("OR,localisation,Like,*07*");
      result.push("OR,localisation,Like,*08*");
    } else if (dent === "03") {
      _.forEach(secteur03, dent03 => {
        result.push("OR,localisation,Like,*" + dent03 + "*");
      });
      result.push("OR,localisation,Like,*03*");
    } else if (dent === "04") {
      _.forEach(secteur04, dent04 => {
        result.push("OR,localisation,Like,*" + dent04 + "*");
      });
      result.push("OR,localisation,Like,*04*");
    } else if (dent === "05") {
      _.forEach(secteur05, dent05 => {
        result.push("OR,localisation,Like,*" + dent05 + "*");
      });
      result.push("OR,localisation,Like,*05*");
    } else if (dent === "06") {
      _.forEach(secteur06, dent06 => {
        result.push("OR,localisation,Like,*" + dent06 + "*");
      });
      result.push("OR,localisation,Like,*06*");
    } else if (dent === "07") {
      _.forEach(secteur07, dent07 => {
        result.push("OR,localisation,Like,*" + dent07 + "*");
      });
      result.push("OR,localisation,Like,*07*");
    } else if (dent === "08") {
      _.forEach(secteur08, dent08 => {
        result.push("OR,localisation,Like,*" + dent08 + "*");
      });
      result.push("OR,localisation,Like,*08*");
    } else if (dent === "10") {
      result.push("OR,localisation,Like,1*");
      result.push("OR,localisation,Like,* 1*");
      result.push("OR,localisation,Like,5*");
      result.push("OR,localisation,Like,* 5*");
      result.push("OR,localisation,Like,*03*");
    } else if (dent === "20") {
      result.push("OR,localisation,Like,2*");
      result.push("OR,localisation,Like,* 2*");
      result.push("OR,localisation,Like,6*");
      result.push("OR,localisation,Like,* 6*");
      result.push("OR,localisation,Like,*05*");
    } else if (dent === "30") {
      result.push("OR,localisation,Like,3*");
      result.push("OR,localisation,Like,* 3*");
      result.push("OR,localisation,Like,7*");
      result.push("OR,localisation,Like,* 7*");
      result.push("OR,localisation,Like,*06*");
    } else if (dent === "40") {
      result.push("OR,localisation,Like,4*");
      result.push("OR,localisation,Like,* 4*");
      result.push("OR,localisation,Like,8*");
      result.push("OR,localisation,Like,* 8*");
      result.push("OR,localisation,Like,*08*");
    } else {
      result.push("OR,localisation,Like,*" + dent + "*");
    }
  });

  return result;
};

export { queriesLocalisation };
