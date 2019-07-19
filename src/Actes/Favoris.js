import React from "react";
import PropTypes from "prop-types";
import {
  Accordion,
  Button,
  Checkbox,
  Dropdown,
  Icon,
  Form,
  Modal,
  Ref,
  Table
} from "semantic-ui-react";
import ModalSearch from "./ModalSearch";
import _ from "lodash";
import moment from "moment";

import { tarif } from "../lib/Helpers";

const propDefs = {
  description:
    "Modal Semantic de lecture et de configuration des actes favoris",
  example: "Favoris",
  propDocs: {
    codActivite: "Code de l'activité, par défaut '1'",
    codDom: "Code du DOM, par défaut c'est la métropole. Code 0",
    codGrille: "Code grille, par défaut 0",
    codPhase: "Code phase, par défaut 0",
    executant:
      "Code d'une profession de santé. Exemple : D1(dentistes), SF(sages-femmes)",
    index:
      "Indice de la ligne (dans la grille de saisie des actes) à partir de laquelle le composant Actes.Favoris a été appelé.",
    specialite: "Code spécialité du praticien",
    open: "Ouverture de la modal",
    onClose: "Callback à la fermeture de la modal",
    onSelection:
      "Callback à la selection et validation d'un acte. Cette fonction prend en 1er " +
      "paramètre l'indice de la ligne et en 2ème paramètre l'objet acte sélectionné."
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    codActivite: PropTypes.string,
    codDom: PropTypes.number,
    codGrille: PropTypes.number,
    codPhase: PropTypes.number,
    executant: PropTypes.string,
    index: PropTypes.number,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSelection: PropTypes.func
  }
};

export default class Favoris extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    codActivite: "1",
    codDom: 0,
    codGrille: 0,
    codPhase: 0,
    executant: ""
  };
  state = {
    actes: [],
    configuration: false,
    edition: false,
    favoris: {},
    modalDelete: null,
    modalChapitre: false,
    chapitreTitre: null,
    modifiedChapitreTitle: null,
    selectedActe: {},
    selectedActes: [], // les index
    selectedChapitre: {}
  };

  componentWillMount() {
    this.props.client.Configuration.read(
      "actesFavoris",
      result => {
        //console.log(result);
        result.active = true;
        this.setState({ favoris: result });
      },
      error => {
        console.log(error);
      }
    );
    this.props.client.CCAM.contextes(
      result => {
        this.setState({ allModificateurs: result.tb11, ngap: result.ngap });
      },
      error => {
        console.log(error);
        this.setState({ allModificateurs: [], ngap: [] });
      }
    );
  }
  componentWillReceiveProps() {
    this.setState({
      chapitreTitre: null,
      configuration: false,
      selectedActes: []
    });
  }

  onEdition = (
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
    let acte = {};
    acte.code = code;
    acte.description = description;
    acte.date = date;
    acte.localisation = localisation;
    acte.cotation = cotation;
    acte.modificateurs = modificateurs;
    acte.qualificatifs = qualificatifs;
    acte.montant = montant;

    let chapitre = this.state.favoris;

    this.updateActe(
      chapitre,
      this.state.chapitreTitre,
      acte,
      this.state.selectedActes[0]
    );
    this.updateFavoris(chapitre);
  };

  updateActe = (chapitre, titre, acte, index) => {
    if (chapitre.titre === titre) {
      chapitre.actes[index] = acte;
      return;
    } else {
      _.forEach(chapitre.chapitres, chap => {
        this.updateActe(chap, titre, acte, index);
      });
    }
  };

  updateFavoris = chapitre => {
    let clone = _.cloneDeep(chapitre);
    let unsetActive = chapitre => {
      _.unset(chapitre, "active");
      _.forEach(chapitre.chapitres, chap => {
        unsetActive(chap);
      });
    };

    unsetActive(chapitre);

    this.props.client.Configuration.update(
      "actesFavoris",
      chapitre,
      result => {
        this.setState({
          favoris: clone,
          chapitreTitre: null,
          selectedActes: []
        });
      },
      error => {
        console.log(error);
      }
    );
  };

  delete = (type, chapitreTitre, actesIndex) => {
    let deleteActes = chapitre => {
      if (chapitre.titre === chapitreTitre) {
        chapitre.actes = _.filter(
          chapitre.actes,
          (acte, index) => !_.includes(actesIndex, index)
        );
      } else {
        _.forEach(chapitre.chapitres, chap => deleteActes(chap));
      }
    };
    let deleteChapitre = chapitre => {
      let chapIndex = _.findIndex(
        chapitre.chapitres,
        ch => ch.titre === chapitreTitre
      );
      if (chapIndex !== -1) {
        chapitre.chapitres.splice(chapIndex, 1);
      } else {
        _.forEach(chapitre.chapitres, chap => deleteChapitre(chap));
      }
    };
    let chapitre = this.state.favoris;
    if (type === "acte" && !_.isNull(actesIndex)) {
      deleteActes(chapitre);
    }
    if (type === "chapitre") {
      deleteChapitre(chapitre);
    }
    this.updateFavoris(chapitre);
    this.setState({ modalDelete: null });
  };

  create = (type, chapitreTitre, titre) => {
    let addChap = (chapitre, ch) => {
      if (chapitre.titre === chapitreTitre) {
        chapitre.chapitres.push(ch);
        this.setState({
          chapitreTitre: titre,
          modalChapitre: true,
          modifiedChapitreTitle: titre
        });
      } else {
        _.forEach(chapitre.chapitres, chap => addChap(chap, ch));
      }
    };
    let addActe = (chapitre, acte) => {
      if (chapitre.titre === chapitreTitre) {
        chapitre.actes.push(acte);
        this.setState({
          chapitreTitre: chapitreTitre,
          selectedActes: [chapitre.actes.length - 1],
          edition: true
        });
      } else {
        _.forEach(chapitre.chapitres, chap => addActe(chap, acte));
      }
    };

    let chapitre = this.state.favoris;
    if (type === "chapitre" && !_.isUndefined(titre)) {
      let ch = {};
      ch.titre = titre;
      ch.actes = [];
      ch.chapitres = [];
      addChap(chapitre, ch);
    }
    if (type === "acte") {
      let acte = {};
      acte.code = "";
      acte.description = "";
      acte.date = moment().toISOString();
      acte.localisation = "";
      acte.cotation = 1;
      acte.modificateurs = "";
      acte.qualificatifs = "OP";
      acte.montant = 0;
      addActe(chapitre, acte);
    }
  };

  moveChapitre = (chapitreToMove, direction) => {
    let chapitre = this.state.favoris;
    let move = chapitre => {
      let chapIndex = _.findIndex(
        chapitre.chapitres,
        chap => chap.titre === chapitreToMove.titre
      );
      if (chapIndex !== -1) {
        if (chapitre.chapitres.length > 1) {
          if (chapIndex > 0 && direction === "up") {
            let tmp = chapitre.chapitres[chapIndex];
            chapitre.chapitres[chapIndex] = chapitre.chapitres[chapIndex - 1];
            chapitre.chapitres[chapIndex - 1] = tmp;
          }
          if (
            chapIndex < chapitre.chapitres.length - 1 &&
            direction === "down"
          ) {
            let tmp = chapitre.chapitres[chapIndex];
            chapitre.chapitres[chapIndex] = chapitre.chapitres[chapIndex + 1];
            chapitre.chapitres[chapIndex + 1] = tmp;
          }
        }
      } else {
        _.forEach(chapitre.chapitres, chap => {
          move(chap);
        });
      }
    };
    move(chapitre);
    this.updateFavoris(chapitre);
  };

  moveActes = (arrayIndex, chapitreTitre, direction) => {
    let move = chapitre => {
      if (chapitre.titre === chapitreTitre) {
        if (!_.includes(arrayIndex, 0) && direction === "up") {
          _.forEach(arrayIndex.sort(), index => {
            let tmp = chapitre.actes[index];
            chapitre.actes[index] = chapitre.actes[index - 1];
            chapitre.actes[index - 1] = tmp;
          });
        }
        if (
          !_.includes(arrayIndex, chapitre.actes.length - 1) &&
          direction === "down"
        ) {
          _.forEach(arrayIndex.sort(), index => {
            let tmp = chapitre.actes[index];
            chapitre.actes[index] = chapitre.actes[index + 1];
            chapitre.actes[index + 1] = tmp;
          });
        }
      } else {
        _.forEach(chapitre.chapitres, chap => {
          move(chap);
        });
      }
    };
    let chapitre = this.state.favoris;
    move(chapitre);
    this.updateFavoris(chapitre);
  };

  getMoveOptions = chap => {
    let options = [];
    let chapitre = this.state.favoris;
    let getOptions = chapitre => {
      let chapitreTitre = _.isString(chap) ? chap : chap.titre;
      if (chapitre.titre !== chapitreTitre) {
        let obj = {};
        obj.text = _.isEmpty(chapitre.titre)
          ? "Chapitre principal"
          : chapitre.titre;
        obj.value = chapitre.titre;
        options.push(obj);
        if (!_.isString(chap)) {
          _.forEach(chapitre.chapitres, chap => getOptions(chap));
        }
      }
      if (_.isString(chap)) {
        _.forEach(chapitre.chapitres, chap => getOptions(chap));
      }
    };
    if (!_.isNull(chap)) {
      getOptions(chapitre);
    }
    return options;
  };

  // element : c'est l'element à déplacer
  // si c'est un chapitre : obj chapitre
  // si c'est un acte l'index de cet acte
  moveInto = (type, target, element) => {
    let chapitrePrincipale = this.state.favoris;
    let add = (chapitre, type, element) => {
      if (chapitre.titre === target) {
        if (type === "chapitre") {
          chapitre.chapitres.push(element);
        }
        if (type === "acte") {
          chapitre.actes.push(element);
        }
      } else {
        _.forEach(chapitre.chapitres, chap => {
          add(chap, type, element);
        });
      }
    };
    let moveChapitre = chapitre => {
      let chapIndex = _.findIndex(
        chapitre.chapitres,
        chap => chap.titre === element.titre
      );
      if (chapIndex !== -1) {
        let ch = chapitre.chapitres[chapIndex];
        chapitre.chapitres.splice(chapIndex, 1);
        add(chapitrePrincipale, "chapitre", ch);
      } else {
        _.forEach(chapitre.chapitres, chap => {
          moveChapitre(chap);
        });
      }
    };
    let moveActe = chapitre => {
      if (chapitre.titre === this.state.chapitreTitre) {
        _.forEach(element, acteIndex => {
          let acte = chapitre.actes[acteIndex];
          add(chapitrePrincipale, "acte", acte);
        });
        chapitre.actes = _.filter(
          chapitre.actes,
          (acte, index) => !_.includes(element, index)
        );
      } else {
        _.forEach(chapitre.chapitres, chap => {
          moveActe(chap);
        });
      }
    };

    if (type === "chapitre") {
      moveChapitre(chapitrePrincipale);
    }
    if (type === "acte") {
      moveActe(chapitrePrincipale);
    }
    this.updateFavoris(chapitrePrincipale);
  };

  validation = acte => {
    if (this.props.onSelection) {
      this.props.onSelection(this.props.index, acte);
    }
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  selection = (e, index) => {
    let selectedActes = this.state.selectedActes;
    if (e.ctrlKey || e.metaKey) {
      if (_.includes(selectedActes, index)) {
        selectedActes.splice(_.findIndex(selectedActes, i => i === index), 1);
      } else {
        selectedActes.push(index);
      }
    } else if (e.shiftKey) {
      if (_.isEmpty(selectedActes)) {
        selectedActes.push(index);
      } else {
        let repere = selectedActes[selectedActes.length - 1];
        selectedActes = [];
        if (index > repere) {
          for (let i = repere + 1; i <= index; i++) {
            selectedActes.push(i);
          }
          selectedActes.push(repere);
        } else if (index < repere) {
          for (let i = index; i < repere; i++) {
            selectedActes.push(i);
          }
          selectedActes.push(repere);
        } else {
          selectedActes = [index];
        }
      }
    } else {
      selectedActes = [index];
    }
    this.setState({ selectedActes: selectedActes });
  };

  getActe = index => {
    let acte = {};
    let chapitre = this.state.favoris;
    let get = chapitre => {
      if (chapitre.titre === this.state.chapitreTitre) {
        acte = chapitre.actes[index];
      } else {
        _.forEach(chapitre.chapitres, chap => {
          get(chap);
        });
      }
    };
    get(chapitre);
    return acte;
  };

  renderChapitre = (chapitre, level) => {
    let active = chapitre.active;
    let isSelected =
      !_.isEmpty(this.state.selectedChapitre) &&
      this.state.selectedChapitre.titre === chapitre.titre;
    return (
      <Accordion
        key={chapitre.titre + Math.random()}
        style={{
          marginLeft: level,
          marginTop: 0,
          marginBottom: 0
        }}
      >
        <Accordion.Title
          active={active}
          onClick={(e, d) => {
            if (level !== 0) {
              chapitre.active = !active;
              this.setState({}); // force a new render
            }
          }}
          style={{
            backgroundColor: isSelected ? "#E88615" : "inherit",
            color: isSelected ? "white" : "black"
          }}
        >
          <Icon name="dropdown" />
          <b>{chapitre.titre ? chapitre.titre : "FAVORIS"}</b>
          {this.state.configuration ? (
            <Dropdown
              icon="caret down"
              style={{ float: "right" }}
              direction="left"
              text="Action"
            >
              <Dropdown.Menu>
                {level !== 0 ? (
                  <Dropdown.Item
                    icon="hand pointer"
                    text="Sélectionner"
                    onClick={() => {
                      this.setState({
                        selectedChapitre: chapitre,
                        selectedActes: []
                      });
                    }}
                  />
                ) : null}
                <Dropdown.Item
                  icon="book"
                  text="Ajouter un chapitre"
                  onClick={() => {
                    let titre =
                      "Nouveau chapitre" +
                      (_.isEmpty(chapitre.titre)
                        ? ""
                        : " dans " + chapitre.titre);
                    this.create("chapitre", chapitre.titre, titre);
                  }}
                />
                <Dropdown.Item
                  icon="add"
                  text="Ajouter un acte"
                  onClick={() => {
                    this.setState({ selectedActes: [] });
                    this.create("acte", chapitre.titre);
                  }}
                />
                <Dropdown.Item
                  icon="edit"
                  text="Modifier le titre"
                  onClick={() => {
                    this.setState({
                      chapitreTitre: chapitre.titre,
                      modalChapitre: true,
                      modifiedChapitreTitle: chapitre.titre
                    });
                  }}
                />
                {level !== 0 ? (
                  <Dropdown.Item
                    icon="trash"
                    text="Supprimer le chapitre"
                    onClick={() => {
                      this.setState({
                        chapitreTitre: chapitre.titre,
                        modalDelete: "chapitre"
                      });
                    }}
                  />
                ) : null}
              </Dropdown.Menu>
            </Dropdown>
          ) : null}
        </Accordion.Title>
        <Accordion.Content active={active}>
          {_.map(chapitre.chapitres, chapitre => {
            return this.renderChapitre(chapitre, level + 10); // indentation de 10 px
          })}
          <Table
            basic="very"
            style={{ cursor: "pointer", marginLeft: 22 }} // alignement du texte (largeur de l'icône dropdown du titre)
            size="small"
          >
            <Table.Body>
              {_.map(chapitre.actes, (acte, key) => (
                <Acte
                  key={key}
                  index={key}
                  code={acte.code}
                  cotation={acte.cotation}
                  configuration={this.state.configuration}
                  description={acte.description}
                  montant={acte.montant}
                  onDoubleClick={index => {
                    if (this.state.configuration) {
                      this.setState({
                        chapitreTitre: chapitre.titre,
                        selectedActes: [index],
                        selectedChapitre: {},
                        edition: true
                      });
                    }
                  }}
                  onSelection={(e, index) => {
                    if (this.state.configuration) {
                      this.setState({
                        chapitreTitre: chapitre.titre,
                        selectedChapitre: {}
                      });
                      this.selection(e, index);
                    } else {
                      this.validation(acte);
                    }
                  }}
                  selected={
                    chapitre.titre === this.state.chapitreTitre &&
                    _.includes(this.state.selectedActes, key)
                  }
                />
              ))}
            </Table.Body>
          </Table>
        </Accordion.Content>
      </Accordion>
    );
  };

  render() {
    let open = this.props.open ? this.props.open : false;
    let selectedActe =
      this.state.selectedActes.length !== 1
        ? {}
        : this.getActe(this.state.selectedActes[0]);
    let moveOptions = !_.isEmpty(this.state.selectedActes)
      ? this.getMoveOptions(this.state.chapitreTitre)
      : !_.isEmpty(this.state.selectedChapitre)
      ? this.getMoveOptions(this.state.selectedChapitre)
      : null;
    return (
      <React.Fragment>
        <Modal open={open} size="large">
          <Modal.Content style={{ height: "450px", overflow: "auto" }}>
            {!_.isEmpty(this.state.favoris) ? (
              <div style={{ marginRight: 20 }}>
                {this.renderChapitre(this.state.favoris, 0)}
              </div>
            ) : null}
          </Modal.Content>
          {this.state.configuration ? (
            <Modal.Actions>
              <Dropdown text="Déplacer vers" direction="left" scrolling={true}>
                <Dropdown.Menu>
                  {_.map(moveOptions, opt => (
                    <Dropdown.Item
                      key={opt.text}
                      text={opt.text}
                      onClick={() => {
                        if (!_.isEmpty(this.state.selectedChapitre)) {
                          this.moveInto(
                            "chapitre",
                            opt.value,
                            this.state.selectedChapitre
                          );
                        }
                        if (!_.isEmpty(this.state.selectedActes)) {
                          this.moveInto("acte", opt.value, selectedActes);
                        }
                      }}
                    />
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Modal.Actions>
          ) : null}
          <Modal.Actions>
            <Checkbox
              style={{ float: "left" }}
              label="Mode configuration"
              checked={this.state.configuration}
              onChange={() =>
                this.setState({ configuration: !this.state.configuration })
              }
              toggle={true}
            />
            <Button
              content="Désélectionner"
              disabled={
                _.isEmpty(this.state.selectedActes) &&
                _.isEmpty(this.state.selectedChapitre)
              }
              onClick={() => {
                this.setState({
                  selectedChapitre: {},
                  selectedActes: []
                });
              }}
            />
            {this.state.configuration ? (
              <React.Fragment>
                <Button
                  icon="arrow up"
                  onClick={() => {
                    if (!_.isEmpty(this.state.selectedChapitre)) {
                      this.moveChapitre(this.state.selectedChapitre, "up");
                    }
                    if (!_.isEmpty(this.state.selectedActes)) {
                      this.moveActes(
                        this.state.selectedActes,
                        this.state.chapitreTitre,
                        "up"
                      );
                    }
                    /*if (!_.isEmpty(selectedActe)) {
                      this.moveActe(
                        this.state.selectedActes[0],
                        this.state.chapitreTitre,
                        "up"
                      );
                    }*/
                  }}
                />
                <Button
                  icon="arrow down"
                  onClick={() => {
                    if (!_.isEmpty(this.state.selectedChapitre)) {
                      this.moveChapitre(this.state.selectedChapitre, "down");
                    }
                    /*if (!_.isEmpty(selectedActe)) {
                      this.moveActe(
                        this.state.selectedActes[0],
                        this.state.chapitreTitre,
                        "down"
                      );
                    }*/
                    if (!_.isEmpty(this.state.selectedActes)) {
                      this.moveActes(
                        this.state.selectedActes,
                        this.state.chapitreTitre,
                        "down"
                      );
                    }
                  }}
                />

                {!_.isEmpty(this.state.selectedActes) ? (
                  <React.Fragment>
                    <Button
                      content="Editer"
                      disabled={this.state.selectedActes.length > 1}
                      onClick={() => this.setState({ edition: true })}
                    />
                    <Button
                      negative={true}
                      content="Supprimer"
                      onClick={() => this.setState({ modalDelete: "acte" })}
                    />
                  </React.Fragment>
                ) : null}
              </React.Fragment>
            ) : null}

            <Button
              content="Annuler"
              onClick={() => {
                if (this.props.onClose) {
                  this.props.onClose();
                }
              }}
            />
            <Button
              content="Valider"
              onClick={() => {
                this.validation(selectedActe);
              }}
            />
          </Modal.Actions>
        </Modal>

        {this.state.edition ? (
          <ModalSearch
            client={this.props.client}
            code={_.isEmpty(selectedActe) ? "" : selectedActe.code}
            codActivite={this.props.codActivite}
            codDom={this.props.codDom}
            codGrille={this.props.codGrille}
            codPhase={this.props.codPhase}
            executant={this.props.executant}
            specialite={this.props.specialite}
            open={this.state.edition}
            cotation={_.isEmpty(selectedActe) ? 1 : selectedActe.cotation}
            date={moment().toISOString()}
            localisation={
              _.isEmpty(selectedActe) ? "" : selectedActe.localisation
            }
            localisationPicker={true}
            allModificateurs={this.state.allModificateurs}
            ngap={this.state.ngap}
            description={
              _.isEmpty(selectedActe) ? "" : selectedActe.description
            }
            modificateurs={
              _.isEmpty(selectedActe) ? "" : selectedActe.modificateurs
            }
            qualificatifs={
              _.isEmpty(selectedActe) ? "OP" : selectedActe.qualificatifs
            }
            montant={_.isEmpty(selectedActe) ? 0 : selectedActe.montant}
            onClose={() => this.setState({ edition: false })}
            onValidation={this.onEdition}
            rowIndex={undefined}
          />
        ) : null}

        {/* Message de confirmation de la suppression d'un acte */}
        <Modal open={!_.isNull(this.state.modalDelete)} size="tiny">
          <Modal.Content>
            {this.state.modalDelete === "acte" ? (
              <span>
                {!_.isEmpty(selectedActe) ? (
                  <span>
                    Voulez-vous supprimer l'acte{" "}
                    <strong>"{selectedActe.description}"</strong> de vos favoris
                    ?
                  </span>
                ) : (
                  <span>
                    Voulez-vous supprimer de vos favoris les{" "}
                    <strong>{this.state.selectedActes.length}</strong> actes
                    sélectionnés ?
                  </span>
                )}
              </span>
            ) : this.state.modalDelete === "chapitre" ? (
              <span>
                Voulez-vous supprimer le chapitre{" "}
                <strong>"{this.state.chapitreTitre}"</strong> de vos favoris ?{" "}
                <br />
                Attention : Cela entraînera la suppression de tout le contenu de
                ce chapitre !
              </span>
            ) : null}
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Annuler"
              onClick={() => this.setState({ modalDelete: null })}
            />
            <Button
              content="Supprimer"
              negative={true}
              onClick={() => {
                this.delete(
                  this.state.modalDelete,
                  this.state.chapitreTitre,
                  this.state.selectedActes
                );
              }}
            />
          </Modal.Actions>
        </Modal>

        {/* Modal chapitre titre (modification) */}
        <Modal open={this.state.modalChapitre} size="small">
          <Modal.Content>
            <Form>
              <Form.Input
                label="Titre du chapitre"
                value={this.state.modifiedChapitreTitle}
                onChange={(e, d) =>
                  this.setState({ modifiedChapitreTitle: d.value })
                }
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Annuler"
              onClick={() =>
                this.setState({
                  modalChapitre: false,
                  chapitreTitre: null,
                  modifiedChapitreTitle: null
                })
              }
            />
            <Button
              content="Modifier"
              onClick={() => {
                if (!_.isEmpty(this.state.modifiedChapitreTitle)) {
                  // faire la modification ICI et fermer la modal
                  let chapitre = this.state.favoris;
                  let changeTitle = chapitre => {
                    if (chapitre.titre === this.state.chapitreTitre) {
                      chapitre.titre = this.state.modifiedChapitreTitle;
                      return;
                    } else {
                      _.forEach(chapitre.chapitres, chap => {
                        changeTitle(chap);
                      });
                    }
                  };
                  changeTitle(chapitre);
                  this.setState({
                    modalChapitre: false,
                    chapitreTitre: null,
                    modifiedChapitreTitle: null
                  });
                  this.updateFavoris(chapitre);
                }
              }}
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

class Acte extends React.Component {
  static defaultProps = {
    code: "",
    cotation: 1,
    description: "",
    index: 0,
    montant: 0,
    selected: false,
    configuration: false
  };
  render() {
    return (
      <Ref
        innerRef={node => {
          node.ondblclick = () => {
            if (this.props.onDoubleClick) {
              this.props.onDoubleClick(this.props.index);
            }
          };
        }}
      >
        <Table.Row
          onClick={(e, d) => {
            if (this.props.onSelection) {
              this.props.onSelection(e, this.props.index);
            }
          }}
          style={{
            backgroundColor: this.props.selected ? "#E88615" : "inherit",
            color: this.props.selected ? "white" : "black"
          }}
        >
          <Table.Cell>{this.props.description}</Table.Cell>
          <Table.Cell
            collapsing={true}
            textAlign="center"
            style={{ minWidth: "90px" }}
          >
            {this.props.code}
          </Table.Cell>
          <Table.Cell collapsing={true} textAlign="center">
            {this.props.cotation}
          </Table.Cell>
          <Table.Cell
            collapsing={true}
            textAlign="right"
            style={{ minWidth: "80px" }}
          >
            {tarif(this.props.montant)}
          </Table.Cell>
        </Table.Row>
      </Ref>
    );
  }
}
