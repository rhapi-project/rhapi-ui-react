import React from "react";
import PropTypes from "prop-types";
import { Button, Message, Modal, Table } from "semantic-ui-react";
import Favoris from "./Favoris";
import SaisieDentaire from "./SaisieDentaire";
import ModalSearch from "./ModalSearch";
import Localisations from "../Shared/Localisations";
import _ from "lodash";

import moment from "moment";

import DatePicker from "react-datepicker"; // new
import fr from "date-fns/locale/fr"; // new
import "react-datepicker/dist/react-datepicker.css"; // new

import { spacedLocalisation } from "../lib/Helpers";

const propDefs = {
  description: "Tableau de saisie des actes pour les dentistes",
  example: "Tableau",
  propDocs: {
    idActe: "Identifiant de l'acte principal",
    lignes: "Nombre de lignes à afficher pour ce tableau. Par défaut 5",
    codActivite: 'Code de l\'activité, par défaut "1"',
    codDom: "Code du DOM, par défaut c'est la métropole. Code 0",
    codGrille: "Code grille, par défaut 0",
    codPhase: "Code phase, par défaut 0",
    executant:
      "Code d'une profession de santé. Exemple : D1(dentistes), SF(sages-femmes)",
    specialite: "Code spécialité du praticien", // new
    onError: "Callback en cas d'erreur",
    actions: "Liste d'actions à effectuer (en plus des actions par défaut)"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idActe: PropTypes.any.isRequired,
    lignes: PropTypes.number,
    codActivite: PropTypes.string,
    codDom: PropTypes.number,
    codGrille: PropTypes.number,
    codPhase: PropTypes.number,
    executant: PropTypes.string,
    specialite: PropTypes.number,
    onError: PropTypes.func,
    actions: PropTypes.array
  }
};

export default class Saisie extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    actions: [],
    codActivite: "1",
    codDom: 0,
    codGrille: 0,
    codPhase: 0,
    executant: "",
    lignes: 5
  };

  state = {
    fse: {},
    allModificateurs: [],
    selectedDate: null, // new
    selectedIndex: null,
    selectedFavoris: null, // new
    selectedLocalisation: null // new
  };

  componentWillMount() {
    this.props.client.CCAM.contextes(
      result => {
        //console.log(result.ngap);
        //console.log(result.specialites);
        this.setState({ allModificateurs: result.tb11, ngap: result.ngap });
      },
      error => {
        console.log(error);
        this.setState({ allModificateurs: [], ngap: [] });
      }
    );
    if (this.props.idActe) {
      this.reload(this.props.idActe);
    }
  }

  componentWillReceiveProps(next) {
    if (next.idActe) {
      this.reload(next.idActe);
    }
  }

  reload = idActe => {
    this.props.client.Actes.read(
      idActe,
      {},
      result => {
        this.setState({
          fse: result,
          actes: _.get(result, "contentJO.actes", []),
          activeRow: _.get(result, "contentJO.actes", []).length,
          error: 0
        });
      },
      error => {
        console.log(error);
        this.setState({ fse: {} });
      }
    );
  };

  existActe = index => {
    return !_.isUndefined(this.state.actes[index]);
  };

  checkLockRevision = (
    onValidatedEtat,
    onModifiable,
    onNotModifiable,
    onReadError
  ) => {
    this.props.client.Actes.read(
      this.props.idActe,
      {},
      result => {
        if (result.etat === 0) {
          onValidatedEtat();
          return;
        }
        if (result.lockRevision === this.state.fse.lockRevision) {
          onModifiable();
        } else {
          onNotModifiable();
        }
      },
      error => {
        // peut-être que l'acte a été déjà supprimé
        console.log(error);
        onReadError();
      }
    );
  };

  update = actes => {
    let obj = {};
    obj.actes = actes;
    this.props.client.Actes.update(
      this.props.idActe,
      { contentJO: obj, montant: _.sumBy(actes, "montant") },
      result => {
        this.setState({
          fse: result,
          actes: _.get(result, "contentJO.actes", []),
          activeRow: _.get(result, "contentJO.actes", []).length,
          error: 0
        });
      },
      error => {
        console.log(error);
      }
    );
  };

  onValidation = (
    rowKey,
    code,
    description,
    date,
    localisation,
    cotation,
    modificateurs,
    qualificatifs,
    montant
  ) => {
    this.checkLockRevision(
      () => this.setState({ error: 1 }),
      () => {
        let obj = {};
        obj.code = code;
        obj.description = description;
        obj.date = date;
        obj.localisation = localisation;
        obj.cotation = cotation;
        obj.modificateurs = modificateurs;
        obj.qualificatifs = qualificatifs; // new
        obj.montant = montant;
        let actes = this.state.actes;
        if (rowKey === this.state.activeRow) {
          actes.push(obj);
          this.update(actes);
        } else {
          if (
            _.isEqual(code, actes[rowKey].code) &&
            _.isEqual(description, actes[rowKey].description) &&
            _.isEqual(date, actes[rowKey].date) &&
            _.isEqual(localisation, actes[rowKey].localisation) &&
            _.isEqual(modificateurs, actes[rowKey].modificateurs) &&
            _.isEqual(qualificatifs, actes[rowKey].qualificatifs) &&
            _.isEqual(montant, actes[rowKey].montant)
          ) {
            return;
          }
          actes[rowKey] = obj;
          this.update(actes);
        }
      },
      () => this.setState({ error: 2 }),
      () => this.setState({ error: 3 })
    );
  };

  onValidationMultiple = (rowKey, actes) => {
    this.checkLockRevision(
      () => this.setState({ error: 1 }),
      () => {
        let a = this.state.actes;
        if (this.existActe(rowKey)) {
          a.splice(rowKey, 1);
        }
        _.forEach(actes, (acte, i) => {
          a.splice(rowKey + i, 0, acte);
        });
        this.update(a);
      },
      () => this.setState({ error: 2 }),
      () => this.setState({ error: 1 })
    );
  };

  changeFieldValue = (field, value, index) => {
    let actes = this.state.actes;
    if (this.existActe(index)) {
      if (field === "date") {
        actes[index].date = moment(value).toISOString();
      } else {
        // localisation
        actes[index].localisation = spacedLocalisation(value);
      }
    } else {
      let obj = {
        code: "",
        cotation: 1,
        date:
          field === "date"
            ? moment(value).toISOString()
            : moment().toISOString(),
        description: "",
        localisation: field === "localisation" ? spacedLocalisation(value) : "",
        modificateurs: "",
        montant: 0,
        qualificatifs: "OP"
      };
      actes.push(obj);
    }
    this.checkLockRevision(
      () =>
        this.setState({
          error: 1,
          selectedDate: null,
          selectedLocalisation: null
        }),
      () => {
        this.update(actes);
        this.setState({ selectedDate: null, selectedLocalisation: null });
      },
      () =>
        this.setState({
          error: 2,
          selectedDate: null,
          selectedLocalisation: null
        }),
      () =>
        this.setState({
          error: 3,
          selectedDate: null,
          selectedLocalisation: null
        })
    );
  };

  onDelete = index => {
    if (!this.existActe(index)) {
      return;
    }
    this.checkLockRevision(
      () => this.setState({ error: 1 }),
      () => {
        let actes = this.state.actes;
        actes.splice(index, 1);
        this.update(actes);
      },
      () => this.setState({ error: 2 }),
      () => this.setState({ error: 3 })
    );
  };

  onDuplicate = index => {
    if (!this.existActe(index)) {
      return;
    }
    this.checkLockRevision(
      () => this.setState({ error: 1 }),
      () => {
        let actes = this.state.actes;
        let currentActe = actes[index];
        actes.splice(index + 1, 0, currentActe);
        this.update(actes);
      },
      () => this.setState({ error: 2 }),
      () => this.setState({ error: 3 })
    );
  };

  onInsertion = index => {
    if (!this.existActe(index)) {
      return;
    }
    this.checkLockRevision(
      () => this.setState({ error: 1 }),
      () => {
        let actes = this.state.actes;
        let obj = {
          code: "",
          cotation: 1,
          date: moment().toISOString(),
          description: "",
          localisation: "",
          modificateurs: "",
          montant: 0,
          qualificatifs: "OP"
        };
        actes.splice(index, 0, obj);
        this.update(actes);
      },
      () => this.setState({ error: 2 }),
      () => this.setState({ error: 3 })
    );
  };

  render() {
    if (!_.isEmpty(this.state.fse)) {
      let selectedIndex = this.state.selectedIndex;
      let selectedActe = _.isNull(this.state.selectedIndex)
        ? {}
        : this.existActe(this.state.selectedIndex)
        ? this.state.actes[selectedIndex]
        : {};
      return (
        <React.Fragment>
          <Table celled={true} striped={true} selectable={true}>
            <Table.Header>
              <Table.Row textAlign="center">
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Localisation</Table.HeaderCell>
                <Table.HeaderCell>Code</Table.HeaderCell>
                <Table.HeaderCell>Cotation</Table.HeaderCell>
                <Table.HeaderCell>Libellé</Table.HeaderCell>
                <Table.HeaderCell>Modif.</Table.HeaderCell>
                <Table.HeaderCell>Qualif.</Table.HeaderCell>
                <Table.HeaderCell>Montant</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {_.times(this.props.lignes, i => (
                <SaisieDentaire
                  key={i}
                  index={i}
                  acte={this.existActe(i) ? this.state.actes[i] : {}} // new
                  actions={this.props.actions}
                  client={this.props.client}
                  code={this.existActe(i) ? this.state.actes[i].code : ""}
                  cotation={
                    this.existActe(i) ? this.state.actes[i].cotation : 1
                  }
                  date={
                    this.existActe(i)
                      ? this.state.actes[i].date
                      : moment().toISOString()
                  }
                  description={
                    this.existActe(i) ? this.state.actes[i].description : ""
                  }
                  localisation={
                    this.existActe(i) ? this.state.actes[i].localisation : ""
                  }
                  modificateurs={
                    this.existActe(i) ? this.state.actes[i].modificateurs : ""
                  }
                  qualificatifs={
                    this.existActe(i) ? this.state.actes[i].qualificatifs : "OP"
                  }
                  montant={this.existActe(i) ? this.state.actes[i].montant : 0}
                  disabled={this.state.activeRow < i}
                  onClick={index => this.setState({ selectedIndex: index })}
                  onClickDate={index => {
                    if (index <= this.state.activeRow) {
                      this.setState({ selectedDate: index });
                    }
                  }}
                  onClickLocalisation={index => {
                    if (index <= this.state.activeRow) {
                      this.setState({ selectedLocalisation: index });
                    }
                  }}
                  onDelete={index => this.onDelete(index)}
                  onDuplicate={index => this.onDuplicate(index)}
                  onEdit={index => this.setState({ selectedIndex: index })}
                  onInsertion={index => this.onInsertion(index)}
                  onSearchFavoris={index =>
                    this.setState({ selectedFavoris: index })
                  }
                />
              ))}
            </Table.Body>
          </Table>

          <ModalSearch
            client={this.props.client}
            code={
              _.isEmpty(selectedActe)
                ? ""
                : this.state.actes[selectedIndex].code
            }
            codActivite={this.props.codActivite}
            codDom={this.props.codDom}
            codGrille={this.props.codGrille}
            codPhase={this.props.codPhase}
            executant={this.props.executant}
            specialite={this.props.specialite}
            open={!_.isNull(selectedIndex)}
            cotation={
              _.isEmpty(selectedActe)
                ? 1
                : this.state.actes[selectedIndex].cotation
            }
            date={
              _.isEmpty(selectedActe)
                ? moment().toISOString()
                : this.state.actes[selectedIndex].date
            }
            localisation={
              _.isEmpty(selectedActe)
                ? ""
                : this.state.actes[selectedIndex].localisation
            }
            localisationPicker={true}
            allModificateurs={this.state.allModificateurs}
            ngap={this.state.ngap}
            description={
              _.isEmpty(selectedActe)
                ? ""
                : this.state.actes[selectedIndex].description
            }
            modificateurs={
              _.isEmpty(selectedActe)
                ? ""
                : this.state.actes[selectedIndex].modificateurs
            }
            qualificatifs={
              _.isEmpty(selectedActe)
                ? "OP"
                : this.state.actes[selectedIndex].qualificatifs
            }
            montant={
              _.isEmpty(selectedActe)
                ? 0
                : this.state.actes[selectedIndex].montant
            }
            onClose={() => this.setState({ selectedIndex: null })}
            onValidation={this.onValidation}
            rowIndex={selectedIndex}
          />

          {/* DatePicker */}
          {!_.isNull(this.state.selectedDate) ? (
            <DatePicker
              fixedHeight={true}
              selected={
                this.existActe(this.state.selectedDate)
                  ? moment(
                      _.get(
                        this.state.actes[this.state.selectedDate],
                        "date",
                        null
                      )
                    ).toDate()
                  : moment().toDate()
              }
              withPortal={true}
              inline={true}
              onChange={date =>
                this.changeFieldValue("date", date, this.state.selectedDate)
              }
              locale={fr}
            />
          ) : null}

          {/* Localisation */}
          {!_.isNull(this.state.selectedLocalisation) ? (
            <Localisations
              dents={
                this.existActe(this.state.selectedLocalisation)
                  ? spacedLocalisation(
                      this.state.actes[this.state.selectedLocalisation]
                        .localisation
                    )
                  : ""
              }
              onSelection={dents =>
                this.changeFieldValue(
                  "localisation",
                  dents,
                  this.state.selectedLocalisation
                )
              }
              modal={{
                size: "large",
                open: true,
                onClose: () => this.setState({ selectedLocalisation: null })
              }}
            />
          ) : null}

          <Favoris
            client={this.props.client}
            index={this.state.selectedFavoris}
            codGrille={this.props.codGrille}
            executant={this.props.executant} // new
            open={!_.isNull(this.state.selectedFavoris)}
            onClose={() => this.setState({ selectedFavoris: null })}
            onSelection={(index, actes) => {
              let a = _.cloneDeep(actes);
              let date = moment().toISOString();
              if (this.existActe(index)) {
                // on garde la même date
                date = this.state.actes[index].date;
              }
              _.forEach(a, acte => {
                _.unset(acte, "acteLie");
                acte.date = date;
              });
              this.onValidationMultiple(index, a);
            }}
          />

          <Modal size="mini" open={this.state.error !== 0}>
            <Modal.Header>Mise à jour de l'acte</Modal.Header>
            <Modal.Content>
              <Message warning={true}>
                {this.state.error === 1
                  ? "Cet acte a déjà été validé. Vous ne pouvez pas faire de modifications !"
                  : this.state.error === 2
                  ? "Des modifications ont été apportées à cet acte. Voulez-vous la recharger et continuer ?"
                  : this.state.error === 3
                  ? "Une erreur est survenue au moment de la lecture de cette acte. Les modifications n'ont pas été prises en compte !"
                  : ""}
              </Message>
            </Modal.Content>
            <Modal.Actions>
              {this.state.error === 1 || this.state.error === 3 ? (
                <Button
                  content="OK"
                  onClick={() => {
                    this.setState({ error: 0, fse: {} });
                    if (!_.isUndefined(this.props.onError)) {
                      this.props.onError();
                    }
                  }}
                />
              ) : this.state.error === 2 ? (
                <Button
                  content="Recharger"
                  onClick={() => {
                    this.reload(this.state.fse.id);
                  }}
                />
              ) : null}
            </Modal.Actions>
          </Modal>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}
