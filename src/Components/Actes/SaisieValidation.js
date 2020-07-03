import React from "react";
import PropTypes from "prop-types";
import { Button } from "semantic-ui-react";
import DocumentEditor from "../Documents/DocumentEditor";
import DocumentFromActes from "../Documents/DocumentFromActes";
import ValidationActes from "./ValidationActes";
import Saisie from "./Saisie";
import _ from "lodash";
import moment from "moment";

const propDefs = {
  description: "Composant de saisie et validation des actes",
  example: "",
  propDocs: {
    idPatient: "Identifiant du patient",
    idActe: "Identifiant de l'acte à lire. Par défaut cette valeur est à NULL.",
    acteCopy: "Si cette propriété est à TRUE, une copie de l'acte d'identifiant 'idActe' sera créée.",
    editable: "Ouverture de la saisie des actes en écriture",
    typeActe: "Type d'acte à saisir ou à valider : #FSE ou #DEVIS",
    acteTitre: "Titre de l'acte qui sera créé",
    codActivite: 'Code de l\'activité, par défaut "1"',
    codDom: "Code du DOM, par défaut c'est la métropole. Code 0",
    codGrille: "Code grille, par défaut 0",
    codPhase: "Code phase, par défaut 0",
    executant:
      "Code d'une profession de santé. Exemple : D1(dentistes), SF(sages-femmes)",
    specialite: "Code spécialité du praticien",
    actions: "Liste d'actions à effectuer (en plus des actions par défaut)",
    lignes: "Nombre de lignes à afficher pour ce tableau. Par défaut 5",
    user: "identifiant du praticien"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    editable: PropTypes.bool,
    idPatient: PropTypes.number,
    idActe: PropTypes.number,
    acteCopy: PropTypes.bool,
    typeActe: PropTypes.string,
    acteTitre: PropTypes.string,
    codActivite: PropTypes.string,
    codDom: PropTypes.number,
    codGrille: PropTypes.number,
    codPhase: PropTypes.number,
    executant: PropTypes.string,
    specialite: PropTypes.number,
    actions: PropTypes.array,
    lignes: PropTypes.number,
    user: PropTypes.string
  }
};

export default class SaisieValidation extends React.Component {
  static propTypes = propDefs.propTypes;

  static defaultProps = {
    acteCopy: false,
    acteTitre: "",
    actions: [],
    codActivite: "1",
    codDom: 0,
    codGrille: 0,
    codPhase: 0,
    executant: "",
    idActe: null,
    lignes: 5,
    editable: true,
    user: ""
  };

  state = {
    fse: {},
    acteToAdd: {},
    createdActes: [],
    modalCreationDocument: false,
    modalValidationActes: false,
    generatedDocument: {}
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.idPatient !== this.props.idPatient ||
      prevProps.typeActe !== this.props.typeActe ||
      prevProps.idActe !== this.props.idActe || //
      prevProps.acteCopy !== this.props.acteCopy //
    ) {
      //this.reload(this.props.typeActe, {});
      if (!_.isNull(this.props.idActe) && !this.props.acteCopy) {
        this.readActe(
          this.props.idActe,
          result => {
            this.setState({ fse: result });
          },
          error => {
            this.setState({ fse: {} });
          }
        );
      } else if (!_.isNull(this.props.idActe) && this.props.acteCopy) {
        this.copyActe(this.props.idActe);
      } else {
        this.reload(this.props.typeActe, {});
      }
    }
  }

  reload = (typeActe, acteToAdd) => {
    this.setState({
      modalCreationDocument: false,
      modalValidationActes: false,
      createdActes: [],
      generatedDocument: {}
    });
    if (_.isNull(this.props.idPatient)) {
      this.setState({ fse: {}, acteToAdd: {} });
      return;
    }
    this.props.client.Actes.readAll(
      {
        _code: typeActe,
        _etat: 1,
        _idPatient: this.props.idPatient
      },
      result => {
        let actes = result.results;
        if (_.isEmpty(actes)) {
          this.createFSE(typeActe, acteToAdd);
        } else if (actes.length > 1) {
          let recent = _.maxBy(actes, a => moment.max(moment(a.modifiedAt)));
          this.setState({ fse: recent, acteToAdd: acteToAdd });
        } else {
          this.setState({ fse: actes[0], acteToAdd: acteToAdd });
        }
      },
      error => {
        console.log(error);
        this.setState({ fse: {}, acteToAdd: {} });
      }
    );
  };

  createFSE = (typeActe, acteToAdd) => {
    this.props.client.Actes.create(
      {
        code: typeActe,
        etat: 1,
        idPatient: this.props.idPatient,
        description: _.isEmpty(this.props.acteTitre)
          ? "Nouvel acte du patient d'id " + this.props.idPatient
          : this.props.acteTitre
      },
      result => {
        this.setState({ fse: result, acteToAdd: acteToAdd });
      },
      error => {
        this.setState({ fse: {}, acteToAdd: {} });
      }
    );
  };

  readActe = (idActe, onSuccess, onError) => {
    this.props.client.Actes.read(
      idActe,
      {},
      result => {
        onSuccess(result);
      },
      error => {
        onError(error);
      }
    );
  };

  destroy = () => {
    this.props.client.Actes.destroy(
      this.state.fse.id,
      result => {
        this.reload(this.props.typeActe, {});
      },
      error => {
        console.log(error);
      }
    );
  };

  copyActe = idActe => {
    this.readActe(
      idActe,
      result => {
        this.props.client.Actes.create(
          this.props.idPatient,
          result.code,
          res => {
            let params = { ...result };
            _.unset(params, "etat");
            _.unset(params, "lockRevision");
            _.set(params, "doneAt", moment().toISOString());
            this.props.client.Actes.update(
              res.id,
              params,
              r => {
                this.setState({ fse: r });
              },
              e => {
                console.log(e);
                this.setState({ fse: {} });
              }
            );
          },
          err => {
            console.log(err);
            this.setState({ fse: {} });
          }
        );
      },
      error => {
        console.log(error);
        this.setState({ fse: {} });
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        {!_.isEmpty(this.state.generatedDocument) ? (
          <DocumentEditor
            client={this.props.client}
            document={this.state.generatedDocument}
            onClose={() => this.reload(this.props.typeActe, {})}
            onEditDocument={content => {
              let gd = this.state.generatedDocument;
              gd.document = content;
              this.setState({ generatedDocument: gd });
            }}
          />
        ) : !_.isEmpty(this.state.fse) ? (
          <React.Fragment>
            <Saisie
              client={this.props.client}
              idActe={this.state.fse.id}
              editable={this.props.editable}
              codGrille={this.props.codGrille}
              codActivite={this.props.codActivite}
              codDom={this.props.codDom}
              codPhase={this.props.codPhase}
              executant={this.props.executant}
              actions={this.props.actions}
              onError={() => this.setState({ fse: {} })}
              lignes={this.props.lignes}
              acteToAdd={this.state.acteToAdd}
              addToFSE={acte => {
                this.reload("#FSE", acte);
                if (this.props.onForceChangeType) {
                  this.props.onForceChangeType("#FSE");
                }
              }}
              onForceReload={() => this.reload(this.props.typeActe, {})}
            />
            <div>
              <Button
                disabled={!this.props.editable}
                content="Valider"
                onClick={() => {
                  if (_.isEmpty(this.state.fse.contentJO.actes)) {
                    return;
                  }
                  this.setState({ modalValidationActes: true });
                }}
              />
              <Button
                disabled={!this.props.editable}
                content="Supprimer"
                negative={true}
                onClick={this.destroy}
              />
            </div>
          </React.Fragment>
        ) : null}

        {/* modal de validation d'un acte */}
        <ValidationActes
          client={this.props.client}
          modeleDocument={
            this.props.typeActe === "#FSE"
              ? "FACTURE"
              : this.props.typeActe === "#DEVIS"
              ? "DEVIS"
              : ""
          }
          idActe={this.state.fse.id}
          open={this.state.modalValidationActes}
          onClose={() => this.reload(this.props.typeActe, {})}
          onDocumentGeneration={createdActes => {
            this.setState({
              modalCreationDocument: true,
              createdActes: createdActes
            });
          }}
        />

        {/* modal de chargement - création des documents */}
        <DocumentFromActes
          client={this.props.client}
          open={this.state.modalCreationDocument}
          idPatient={this.props.idPatient}
          arrayIdActes={this.state.createdActes}
          user={this.props.user}
          typeDocument={
            this.props.typeActe === "#FSE"
              ? "FACTURE"
              : this.props.typeActe === "#DEVIS"
              ? "DEVIS"
              : ""
          }
          visualisation={true}
          onClose={() => this.reload(this.props.typeActe, {})}
          onDocumentGeneration={document => {
            this.setState({
              modalCreationDocument: false,
              modalValidationActes: false,
              generatedDocument: document
            });
          }}
        />
      </React.Fragment>
    );
  }
}
