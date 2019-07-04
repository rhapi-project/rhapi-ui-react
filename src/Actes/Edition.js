import React from "react";
import PropTypes from "prop-types";
import { Accordion, Button, Form, Icon, Modal, Ref } from "semantic-ui-react";

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
    open: "La modal s'ouvre si open est true. Par défaut, open = false"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    id: PropTypes.number,
    open: PropTypes.bool
  }
};

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
    showConfirmation: false,
    openLocalisation: false
  };

  componentWillMount() {
    this.props.client.Actes.read(
      this.props.id,
      {},
      acte => {
        this.setState({
          date: moment(acte.doneAt).toDate(),
          localisation: acte.localisation,
          code: acte.code,
          cotation: acte.cotation,
          description: acte.description,
          montant: acte.montant
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  componentWillReceiveProps(next) {
    this.setState({
      open: next.open
    });
  }

  reload = () => {
    this.props.client.Actes.read(
      this.props.id,
      {},
      acte => {
        this.setState({
          date: moment(acte.doneAt).toDate(),
          localisation: acte.localisation,
          code: acte.code,
          cotation: acte.cotation,
          description: acte.description,
          montant: acte.montant
        });
      },
      error => {
        console.log(error);
      }
    );
  };

  onClose = () => {
    this.setState({ open: false });
  };

  inputContentFormating = () => {
    this.setState({
      localisation: spacedLocalisation(this.state.localisation)
    });
  };

  onValider = () => {
    this.setState({
      open: false,
      showConfirmation: true
    });
  };

  onCancel = () => {
    this.setState({ showConfirmation: false });
  };

  onConfirm = () => {
    this.setState({ showConfirmation: false });
    this.update();
    this.reload();
  };

  onOpenLocalisation = () => {
    this.setState({
      openLocalisation: !this.state.openLocalisation
    });
  };

  update = () => {
    let params = {
      doneAt: this.state.date,
      localisation: this.state.localisation,
      code: this.state.code,
      cotation: this.state.cotation,
      description: this.state.description,
      montant: this.state.montant
    };

    this.props.client.Actes.update(
      this.props.id,
      params,
      result => {
        console.log(result);
      },
      error => {
        console.log(error);
      }
    );
  };

  render() {
    let date = this.state.date;
    let localisation = this.state.localisation;
    let code = this.state.code;
    let cotation = this.state.cotation;
    let montant = this.state.montant;
    let description = this.state.description;

    console.log(this.state);
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
                  error={
                    toISOLocalisation(this.state.localisation).length % 2 !== 0
                  }
                  onChange={(e, d) => this.setState({ localisation: d.value })}
                  onBlur={() => this.inputContentFormating()}
                />
                <Form.Input
                  label="Code"
                  placeholder="Code de l'acte"
                  value={code}
                />
                <Form.Input label="Cotation" value={cotation} width={1} />
                <Form.Input label="Montant" width={10}>
                  <Montant
                    montant={montant}
                    onChange={montant => {
                      console.log(montant);
                    }}
                  />
                </Form.Input>
              </Form.Group>
              <Form.Input
                label="Description"
                placeholder="Description de l'acte sélectionné"
                value={description}
              />
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
            <Button content="Valider" color="blue" onClick={this.onValider} />
          </Modal.Actions>
        </Modal>
        <Modal size="tiny" open={this.state.showConfirmation}>
          <Modal.Content>
            <p>Êtes-vous sûr de vouloir modifier cette acte ?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.onCancel}>
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
              <Button color="blue" onClick={this.onConfirm}>
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
