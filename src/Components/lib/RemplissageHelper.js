import _ from "lodash";
import moment from "moment";
import Mustache from "mustache";
import { dateEnLettres, tarif } from "./Helpers";

const readPraticien = (client, onSuccess, onError) => {
  client.MonCompte.read(
    result => {
      let praticien = {};
      praticien.nom = _.get(result, "account.nom", "");
      praticien.prenom = _.get(result, "account.prenom", "");
      //praticien.specialite
      //praticien.titres
      praticien.denomination = _.get(result, "currentName", "");
      praticien.adresse1 = _.get(result, "account.adresse1", "");
      praticien.adresse2 = _.get(result, "account.adresse2", "");
      praticien.adresse3 = _.get(result, "account.adresse3", "");
      praticien.adresse =
        praticien.adresse1 +
        (praticien.adresse2 ? " - " + praticien.adresse2 : "") +
        (praticien.adresse3 ? " - " + praticien.adresse3 : "");
      praticien.codePostal = _.get(result, "account.codePostal", "");
      praticien.ville = _.get(result, "account.ville", "");
      praticien.telephone = _.get(result, "account.telBureau", "");
      praticien.telBureau = _.get(result, "account.telBureau", "");
      praticien.telDomicile = _.get(result, "account.telDomicile", "");
      praticien.telMobile = _.get(result, "account.telMobile", "");
      praticien.email = _.get(result, "account.email", "");
      praticien.organisation = _.get(result, "organisation", "");
      //praticien.adeli
      //praticien.rpps
      //praticien.siret
      //praticien.finess
      onSuccess(praticien);
    },
    error => {
      onError({});
    }
  );
};

const readPatient = (client, idPatient, onSuccess, onError) => {
  client.Patients.read(
    idPatient,
    {},
    patient => {
      let p = {};
      p.nom = patient.nom;
      p.nomMinus = _.toLower(patient.nom);
      p.prenom = patient.prenom;
      p.prenomMinus = _.toLower(patient.prenom);
      p.denomination = patient.nom + " " + patient.prenom;
      p.civilite = patient.civilite;
      p.adresse1 = patient.adresse1;
      p.adresse2 = patient.adresse2;
      p.adresse3 = patient.adresse3;
      p.adresse =
        patient.adresse1 +
        (patient.adresse2 ? " - " + patient.adresse2 : "") +
        (patient.adresse3 ? " - " + patient.adresse3 : "");
      p.codePostal = patient.codePostal;
      p.ville = patient.ville;
      p.ipp1 = patient.id;
      p.ipp2 = patient.ipp2;
      p.nir = patient.nir;
      p.naissance = _.isEmpty(patient.naissance)
        ? ""
        : moment(patient.naissance).format("L");
      p.telBureau = patient.telBureau;
      p.telDomicile = patient.telDomicile;
      p.telMobile = patient.telMobile;
      // TODO : rajouter les champs qui ne sont pas encore traités
      // se référer sur l'Aide des modèles
      // p.solde
      // p.dernierActe
      // p.dernierActeEnLettres
      onSuccess(p);
    },
    () => {
      onError({});
    }
  );
};

// TODO : voir les champs qui ne sont pas encore
// gérés en commentaire
const readActes = (client, arrayIdActes, callback) => {
  let actes = [];
  let montantTotal = 0;
  let readActe = arrayIdActes => {
    if (_.isEmpty(arrayIdActes)) {
      // finir et faire appel au callback
      let result = {};
      result.actes = actes;
      result.montantTotal = montantTotal;
      callback(result);
    } else {
      client.Actes.read(
        arrayIdActes.shift(),
        {},
        acte => {
          if (!_.startsWith(acte.code, "#")) {
            let a = {};
            a.date = moment(acte.doneAt).format("L");
            a.localisation = acte.localisation;
            a.lettre = acte.code;
            a.cotation = acte.cotation;
            a.description = acte.description;
            a.montant = tarif(acte.montant);
            montantTotal += acte.montant;
            // a.tarif
            // a.remboursement
            // + les sous-totaux
            actes.push(a);
          }
          readActe(arrayIdActes);
        },
        error => {
          readActe(arrayIdActes);
        }
      );
    }
  };
  readActe(arrayIdActes);
};

const readRdv = (client, idPatient, callback) => {
  let rdv = {};
  client.RendezVous.readAll(
    {
      limit: 1000, // tous les rendez-vous
      q1: "idPatient,Equal," + idPatient
    },
    result => {
      let precRdv = [];
      let precedentsRdvEnLettres = [];
      let prochRdv = [];
      let prochainsRdvEnLettres = [];
      rdv.precedentRdv = result.results[0].startAt;
      // tri des rendez-vous sur le champ startAt
      let sortedRdv = _.orderBy(
        result.results,
        r => {
          return moment(r.startAt);
        },
        ["asc"]
      );

      _.forEach(sortedRdv, r => {
        if (moment(r.startAt).isBefore(moment())) {
          precRdv.push(moment(r.startAt).format("DD/MM/YYYY à HH:mm"));
          precedentsRdvEnLettres.push(dateEnLettres(r.startAt));
        }
        if (moment(r.startAt).isSameOrAfter(moment())) {
          prochRdv.push(moment(r.startAt).format("DD/MM/YYYY à HH:mm"));
          prochainsRdvEnLettres.push(dateEnLettres(r.startAt));
        }
      });
      rdv.precedentRdv = _.isEmpty(precRdv) ? "" : precRdv[precRdv.length - 1];
      rdv.precedentRdvEnLettres = _.isEmpty(precedentsRdvEnLettres)
        ? ""
        : precedentsRdvEnLettres[precedentsRdvEnLettres.length - 1];
      rdv.prochainRdv = _.isEmpty(prochRdv) ? "" : prochRdv[0];
      rdv.prochainRdvEnLettres = _.isEmpty(prochainsRdvEnLettres)
        ? ""
        : prochainsRdvEnLettres[prochainsRdvEnLettres.length - 1];
      rdv.precedentsRdv = precRdv;
      rdv.prochainsRdv = prochRdv;
      rdv.precedentsRdvEnLettres = precedentsRdvEnLettres;
      rdv.prochainsRdvEnLettres = prochainsRdvEnLettres;
      callback(rdv);
    },
    error => {
      console.log(error);
      callback(rdv);
    }
  );
};

// TODO : gérér les sous-totaux
const readSaisies = (
  client,
  saisiesMaxLignesParPage,
  arrayIdActes,
  callback
) => {
  let result = {};
  if (_.isEmpty(arrayIdActes)) {
    callback(result);
  }
  let blocTraitements = [];
  let saisies = [];
  result.saisiesExpiration = "";
  result.saisiesTotalPages = "";

  client.Actes.read(
    arrayIdActes[0],
    {},
    devis => {
      result.saisiesDescription = devis.description;
      if (_.startsWith(devis.code, "#")) {
        let currentPageItems = 0;
        let obj = {};
        obj.saisies = [];
        _.forEach(devis.contentJO.actes, acte => {
          saisies.push(acte);
          obj.saisies.push(acte);
          currentPageItems += 1;
          if (currentPageItems === saisiesMaxLignesParPage) {
            blocTraitements.push(_.cloneDeepWith(obj));
            obj.saisies = [];
            currentPageItems = 0;
          }
        });
        blocTraitements.push(_.cloneDeepWith(obj));
        result.blocTraitements = blocTraitements;
        result.saisies = saisies;
      }
      callback(result);
    },
    error => {
      callback(result);
    }
  );
};

// TODO : gérer le traitement des champs
// "correspondant"
// champs "idDocument"
const remplissage = (client, modeleObj, idPatient, arrayIdActes, callback) => {
  let data = {};
  let lecturePraticien = false;
  let lecturePatient = false;
  let lectureDate = false;
  let lectureActes = false;
  let lectureSaisies = false;
  let lectureRdv = false;

  let saisiesMaxLignesParPage = 8;

  let regex = /{{(#)?[a-zA-Z0-9_]+(\.[a-zA-Z0-9]+)*}}/g;
  let champs = modeleObj.document.match(regex);

  let traitementChamps = champs => {
    if (_.isEmpty(champs)) {
      let filledDocument = Mustache.render(modeleObj.document, data);
      callback(filledDocument);
    } else {
      let champ = champs.shift();
      // pour le cas des saisies (devis), on peur récupérer le nombre de
      // lignes d'actes qu'il faut avoir au maximum par page
      if (_.startsWith(champ, "{{saisiesMaxLignesParPage_")) {
        let c = _.replace(champ, /{+|}+/g, ""); // suppression des accolades
        let splitChamp = _.split(c, "_");
        let newMaxLignes = parseInt(splitChamp[splitChamp.length - 1]);
        saisiesMaxLignesParPage = !_.isNaN(newMaxLignes)
          ? newMaxLignes
          : saisiesMaxLignesParPage;
        traitementChamps(champs);
      }
      // Gestion des champs praticien
      else if (_.startsWith(champ, "{{praticien") && !lecturePraticien) {
        lecturePraticien = true;
        readPraticien(
          client,
          praticien => {
            data.praticien = praticien;
            traitementChamps(champs);
          },
          () => {
            data.praticien = {};
            traitementChamps(champs);
          }
        );
        traitementChamps(champs);
      }
      // Gestion des champs
      else if (_.startsWith(champ, "{{patient") && !lecturePatient) {
        lecturePatient = true;
        readPatient(
          client,
          idPatient,
          patient => {
            data.patient = patient;
            traitementChamps(champs);
          },
          () => {
            data.patient = {};
            traitementChamps(champs);
          }
        );
      }
      // Gestion des champs dates
      else if (_.startsWith(champ, "{{date") && !lectureDate) {
        lectureDate = true;
        let dateObj = {};
        dateObj.jour = moment().format("L");
        dateObj.jourLettres = moment().format("dddd D MMMM YYYY");
        data.date = dateObj;
        traitementChamps(champs);
      }
      // Gestion des champs actes
      else if (_.startsWith(champ, "{{#actes") && !lectureActes) {
        // boucle sur les lignes d'actes de l'historique (arrayIdActes)
        lectureActes = true;
        readActes(client, arrayIdActes, result => {
          data.actes = result.actes;
          data.actesTotal = result.montantTotal;
          traitementChamps(champs);
        });
      }
      // Gestion des champs saisies
      else if (_.startsWith(champ, "{{#saisies") && !lectureSaisies) {
        // lignes d'actes (devis)
        lectureSaisies = true;
        readSaisies(client, saisiesMaxLignesParPage, arrayIdActes, result => {
          data.saisies = _.get(result, "saisies", []);
          data.blocTraitements = _.get(result, "blocTraitements", []);
          data.saisiesDescription = _.get(result, "saisiesDescription", "");
          data.saisiesExpiration = _.get(result, "saisiesExpiration", "");
          data.saisiesTotalPages = _.get(result, "saisiesTotalPages", "");
          traitementChamps(champs);
        });
      }
      // Gestion des champs des rendez-vous
      else if (_.startsWith(champ, "{{patientRdv") && !lectureRdv) {
        lectureRdv = true;
        readRdv(client, idPatient, result => {
          data.patientRdv = result;
          traitementChamps(champs);
        });
      }
      // pas de traitement particulier pour les autres champs
      else {
        traitementChamps(champs);
      }
    }
  };
  traitementChamps(champs);
};

export { remplissage };
