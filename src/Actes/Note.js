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

import Localisations from "../Shared/Localisations";

import _ from "lodash";
import moment from "moment";

import DatePicker from "react-datepicker";
import fr from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";

import { spacedLocalisation, toISOLocalisation } from "../lib/Helpers";

const propDefs = {
  description: "Nouvelle << Note >> ou << Todo >>",
  example: "Modal",
  propDocs: {
    id: "id de l'acte sélectionné. Par défaut, id = 0",
    idPatient: "Id du patient. Par défaut, idPatient = 0",
    open:
      "La modale s'ouvre si la valeur de 'open' est égale à true. Par défaut, open = false",
    type: "Type de l'acte ('NOTE' ou 'TODO'). Par défaut, type = ''",
    onCreate: "Callback à la création de la nouvelle 'note' ou 'todo'",
    onUpdate: "Callback à la mise à jour d'une 'note' ou 'todo'"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    id: PropTypes.number,
    idPatient: PropTypes.number,
    open: PropTypes.bool,
    type: PropTypes.string,
    onCreate: PropTypes.func,
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

export default class Note extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    id: 0,
    idPatient: 0,
    open: false,
    type: ""
  };

  componentWillMount() {
    this.setState({
      id: this.props.id,
      idPatient: this.props.idPatient,
      open: this.props.open,
      type: this.props.type,
      date: moment().toISOString(),
      localisation: "",
      tag: "",
      description: ""
    });
  }

  componentWillReceiveProps(next) {
    this.setState({
      id: next.id,
      idPatient: next.idPatient,
      open: next.open,
      type: next.type
    });
  }

  onClose = () => {
    this.setState({
      open: false,
      type: "",
      date: moment().toISOString(),
      localisation: "",
      tag: "",
      description: ""
    });
  };

  onValider = () => {
    this.setState({
      open: false
    });

    let code = "";

    if (this.state.type === "note") {
      code = "#NOTE";
    } else if (this.state.type === "todo") {
      code = "#TODO";
    } else {
      code = "";
    }

    let params = {
      idPatient: this.state.idPatient,
      doneAt: this.state.date,
      localisation: this.state.localisation,
      code: code,
      description: this.state.tag + " " + this.state.description
    };

    this.props.client.Actes.readAll(
      {
        _id: Number(this.state.id)
      },
      result => {
        if (result.results.length === 0) {
          this.props.client.Actes.create(
            params,
            acte => {
              if (this.props.onCreate) {
                this.props.onCreate(acte);
              }
            },
            error => {
              console.log(error);
            }
          );
        } else {
          this.props.client.Actes.update(
            this.state.id,
            params,
            acte => {
              if (this.props.onUpdate) {
                this.props.onUpdate(acte);
              }
            },
            error => {
              console.log(error);
            }
          );
        }
      },
      error => {
        console.log(error);
      }
    );
  };

  inputContentFormating = () => {
    this.setState({
      localisation: spacedLocalisation(this.state.localisation)
    });
  };

  render() {
    let date = this.state.date;
    let localisation = this.state.localisation;
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
                <Form.Input label="Date" width={4}>
                  <Ref
                    innerRef={node => {
                      let input = node.firstChild.firstChild;
                      input.style.width = "100%";
                    }}
                  >
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={moment(date).toDate()}
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
                  fluid={true}
                  label="Localisation"
                  placeholder="Num. des dents"
                  value={localisation}
                  error={toISOLocalisation(localisation).length % 2 !== 0}
                  onChange={(e, d) => this.setState({ localisation: d.value })}
                  onBlur={() => this.inputContentFormating()}
                />
                <Form.Dropdown
                  width={2}
                  fluid={true}
                  label="Tags"
                  selection={true}
                  options={tags}
                  onChange={(e, d) => this.setState({ tag: d.value })}
                />
              </Form.Group>
              <div style={{ height: "320px", overflow: "auto" }}>
                <Accordion styled={true} fluid={true}>
                  <Accordion.Title active={true}>Localisation</Accordion.Title>
                  <Accordion.Content active={true}>
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
              <Form.TextArea
                value={description}
                rows={5}
                onChange={(e, d) => this.setState({ description: d.value })}
                style={{ backgroundColor: "#e8e8e4" }}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button content="Annuler" color="red" onClick={this.onClose} />
            <Button content="Valider" color="blue" onClick={this.onValider} />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}
