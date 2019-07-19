import React from "react";
import PropTypes from "prop-types";
import {
  Accordion,
  Button,
  Form,
  Icon,
  Label,
  Modal,
  Ref
} from "semantic-ui-react";

import Montant from "../Shared/Montant";
import Localisations from "../Shared/Localisations";

import _ from "lodash";
import moment from "moment";

import DatePicker from "react-datepicker";
import fr from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";

import { spacedLocalisation, toISOLocalisation } from "../lib/Helpers";

const propDefs = {
  description: "Edition d'un acte validé pour un patient",
  example: "Modal",
  propDocs: {
    id: "Id de l'acte à éditer. Par défaut id = 0",
    open:
      "La modale s'ouvre si la valeur de 'open' est égale à true. Par défaut, open = false",
    onClose: "Callback à la fermeture de la modal",
    onUpdate:
      "Callback à la modification de l'acte sélectionné. Elle prend en paramètre l'acte modifié"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    id: PropTypes.number,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onUpdate: PropTypes.func
  }
};

const tags = [
  { text: <Icon name="close" size="small" />, value: 0 },
  { text: <Label circular color="red" empty />, value: 1 },
  { text: <Label circular color="orange" empty />, value: 2 },
  { text: <Label circular color="yellow" empty />, value: 3 },
  { text: <Label circular color="green" empty />, value: 4 },
  { text: <Label circular color="blue" empty />, value: 5 },
  { text: <Label circular color="purple" empty />, value: 6 },
  { text: <Label circular color="grey" empty />, value: 7 }
];

export default class Edition extends React.Component {
  // Props
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    id: 0,
    open: false
  };

  state = {
    id: this.props.id,
    open: this.props.open,
    date: null,
    localisation: "",
    code: "",
    cotation: -1,
    description: "",
    montant: -1,
    tag: "",
    lockRevision: -1,
    showConfirmation: false,
    openLocalisation: false,
    showReload: false
  };

  componentWillMount() {
    this.props.client.Actes.read(
      this.state.id,
      {},
      acte => {
        this.setState({
          date: moment(acte.doneAt).toDate(),
          localisation: acte.localisation,
          code: acte.code,
          cotation: acte.cotation,
          description: acte.description,
          montant: acte.montant,
          lockRevision: acte.lockRevision
        });
      },
      error => {}
    );
  }

  componentWillReceiveProps(next) {
    if (next.id !== this.state.id) {
      this.props.client.Actes.read(
        next.id,
        {},
        acte => {
          this.setState({
            id: next.id,
            open: next.open,
            date: moment(acte.doneAt).toDate(),
            localisation: acte.localisation,
            code: acte.code,
            cotation: acte.cotation,
            description: acte.description,
            montant: acte.montant,
            lockRevision: acte.lockRevision
          });
        },
        error => {}
      );
    } else {
      this.setState({
        id: next.id,
        open: next.open
      });
    }
  }

  onClose = () => {
    if (this.props.onClose) {
      this.props.onClose(false);
    }
  };

  inputContentFormating = () => {
    this.setState({
      localisation: spacedLocalisation(this.state.localisation)
    });
  };

  onValider = () => {
    this.setState({
      showConfirmation: true
    });
  };

  onCancelConfirmation = () => {
    this.setState({
      open: false,
      showConfirmation: false
    });
  };

  onConfirmConfirmation = () => {
    this.setState({
      open: false,
      showConfirmation: false
    });

    this.onUpdate();
  };

  onCancelReload = () => {
    this.setState({ showReload: false });
  };

  onConfirmReload = () => {
    this.setState({ showReload: false });

    this.props.client.Actes.read(
      this.state.id,
      {},
      acte => {
        this.setState({
          id: acte.id,
          date: moment(acte.doneAt).toDate(),
          localisation: acte.localisation,
          code: acte.code,
          cotation: acte.cotation,
          description: acte.description,
          montant: acte.montant,
          lockRevision: acte.lockRevision
        });
      },
      error => {}
    );
  };

  onOpenLocalisation = () => {
    this.setState({
      openLocalisation: !this.state.openLocalisation
    });
  };

  onUpdate = () => {
    this.props.client.Actes.read(
      this.state.id,
      {},
      acte => {
        if (acte.lockRevision === this.state.lockRevision) {
          let params = {
            doneAt: this.state.date,
            localisation: this.state.localisation,
            code: this.state.code,
            cotation: this.state.cotation,
            description: this.state.description,
            montant: this.state.montant
          };

          this.props.client.Actes.update(
            this.state.id,
            params,
            acte => {
              this.setState({
                date: moment(acte.doneAt).toDate(),
                localisation: acte.localisation,
                code: acte.code,
                cotation: acte.cotation,
                description: acte.description,
                montant: acte.montant,
                lockRevision: acte.lockRevision
              });

              if (this.props.onUpdate) {
                this.props.onUpdate(acte);
              }
            },
            error => {
              console.log(error);
            }
          );
        } else {
          this.setState({ showReload: true });
        }
      },
      error => {}
    );
  };

  render() {
    let date = this.state.date;
    let localisation = this.state.localisation;
    let code = this.state.code;
    let cotation = this.state.cotation;
    let montant = this.state.montant;
    let description = this.state.description;

    return (
      <React.Fragment>
        <Modal
          dimmer="blurring"
          open={this.state.open}
          onClose={this.onClose}
          size="large"
        >
          <Modal.Content>
            <Form unstackable>
              <Form.Group widths="equal">
                <Form.Input label="Date" width={9}>
                  <Ref
                    innerRef={node => {
                      let input = node.firstChild.firstChild;
                      input.style.width = "100%";
                    }}
                  >
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={_.isNull(date) ? moment().toDate() : date}
                      onChange={date => {
                        if (date) {
                          this.setState({ date: moment(date).toDate() });
                        }
                      }}
                      locale={fr}
                    />
                  </Ref>
                </Form.Input>
                <Form.Input
                  label="Localisation"
                  placeholder="Num. des dents"
                  value={localisation}
                  error={toISOLocalisation(localisation).length % 2 !== 0}
                  onChange={(e, d) => this.setState({ localisation: d.value })}
                  onBlur={() => this.inputContentFormating()}
                />
                <Form.Input
                  label="Code"
                  placeholder="Code de l'acte"
                  value={code}
                  onChange={(e, d) => this.setState({ code: d.value })}
                />
                <Form.Input
                  label="Cotation"
                  value={cotation}
                  width={1}
                  onChange={(e, d) => this.setState({ cotation: d.value })}
                />
                <Form.Input label="Montant" width={10}>
                  <Montant
                    montant={montant}
                    onChange={montant => {
                      this.setState({ montant: montant });
                    }}
                  />
                </Form.Input>
              </Form.Group>
              <Form.Group>
                <Form.Input
                  width={16}
                  label="Description"
                  placeholder="Description de l'acte sélectionné"
                  value={description}
                  onChange={(e, d) => this.setState({ description: d.value })}
                />
                <Form.Dropdown
                  width={1}
                  fluid={true}
                  label="Tags"
                  selection={true}
                  options={tags}
                  onChange={(e, d) => this.setState({ tag: d.value })}
                />
              </Form.Group>
              <div style={{ height: "320px", overflow: "auto" }}>
                <Accordion styled={true} fluid={true}>
                  <Accordion.Title
                    active={this.state.openLocalisation}
                    onClick={this.onOpenLocalisation}
                  >
                    <Icon name="dropdown" />
                    Localisation
                  </Accordion.Title>
                  <Accordion.Content active={this.state.openLocalisation}>
                    <Localisations
                      dents={
                        toISOLocalisation(localisation).length % 2 !== 0
                          ? ""
                          : spacedLocalisation(localisation)
                      }
                      onSelection={dents =>
                        this.setState({ localisation: dents })
                      }
                    />
                  </Accordion.Content>
                </Accordion>
              </div>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button content="Annuler" color="red" onClick={this.onClose} />
            <Button content="Valider" color="blue" onClick={this.onValider} />
          </Modal.Actions>
        </Modal>
        <Modal size="tiny" open={this.state.showConfirmation}>
          <Modal.Content>
            <p>Êtes-vous sûr de vouloir modifier cette acte ?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.onCancelConfirmation}>
              <Icon name="ban" color="red" />
              Non
            </Button>
            <Ref
              innerRef={node => {
                if (this.state.showConfirmation) {
                  node.focus();
                }
              }}
            >
              <Button color="blue" onClick={this.onConfirmConfirmation}>
                <Icon name="check" color="green" />
                Oui
              </Button>
            </Ref>
          </Modal.Actions>
        </Modal>
        <Modal size="tiny" open={this.state.showReload}>
          <Modal.Content>
            <p>
              L'acte sélectionné a été déjà modifié. Voulez-vous recharger ?
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.onCancelReload}>
              <Icon name="ban" color="red" />
              Non
            </Button>
            <Ref
              innerRef={node => {
                if (this.state.showReload) {
                  node.focus();
                }
              }}
            >
              <Button color="blue" onClick={this.onConfirmReload}>
                <Icon name="check" color="green" />
                Oui
              </Button>
            </Ref>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}
