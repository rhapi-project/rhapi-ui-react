import React from "react";
import PropTypes from "prop-types";
import {
  Accordion,
  Button,
  Dropdown,
  Form,
  Header,
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
    onCreate:
      "Callback à la création de la nouvelle 'note' ou 'todo'. L'acte créé est passé en paramètre",
    onUpdate:
      "Callback à la mise à jour d'une 'note' ou 'todo'. L'acte modifié est passé en paramètre",
    onClose: "Callback à la fermeture de la modal."
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    id: PropTypes.number,
    idPatient: PropTypes.number,
    open: PropTypes.bool,
    type: PropTypes.string,
    onCreate: PropTypes.func,
    onUpdate: PropTypes.func,
    onClose: PropTypes.func
  }
};

const optionsTag = [
  {
    key: "",
    value: "",
    text: <Icon name="close" size="small" />
  },
  {
    key: "red",
    value: "red",
    text: <Label circular color="red" empty />
  },
  {
    key: "orange",
    value: "orange",
    text: <Label circular color="orange" empty />
  },
  {
    key: "yellow",
    value: "yellow",
    text: <Label circular color="yellow" empty />
  },
  {
    key: "green",
    value: "green",
    text: <Label circular color="green" empty />
  },
  {
    key: "blue",
    value: "blue",
    text: <Label circular color="blue" empty />
  },
  {
    key: "purple",
    value: "purple",
    text: <Label circular color="purple" empty />
  },
  {
    key: "grey",
    value: "grey",
    text: <Label circular color="grey" empty />
  }
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
      date: moment().toISOString(),
      localisation: "",
      couleurTag: "",
      description: ""
    });
  }

  componentWillReceiveProps(next) {
    if (next.open && next.open !== this.props.open) {
      this.props.client.Actes.read(
        next.id,
        {},
        result => {
          this.setState({
            id: next.id,
            idPatient: next.idPatient,
            date: result.doneAt,
            localisation: result.localisation,
            couleurTag: result.couleur,
            description: result.description
          });
        },
        error => {
          this.setState({
            id: next.id,
            idPatient: next.idPatient,
            date: moment().toISOString(),
            localisation: "",
            couleurTag: "",
            description: ""
          });
        }
      );
    }
  }

  onClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  onValider = () => {
    let code = "#" + _.upperCase(this.props.type);

    let params = {
      idPatient: this.state.idPatient,
      doneAt: this.state.date,
      localisation: this.state.localisation,
      code: code,
      couleur: this.state.couleurTag,
      description: this.state.description
    };

    this.props.client.Actes.read(
      Number(this.state.id),
      {},
      result => {
        this.props.client.Actes.update(
          this.state.id,
          params,
          acte => {
            if (this.props.onUpdate) {
              this.props.onUpdate(acte);
            }
          },
          error => {}
        );
      },
      error => {
        this.props.client.Actes.create(
          params,
          acte => {
            if (this.props.onCreate) {
              this.props.onCreate(acte);
            }
          },
          error => {}
        );
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
    let type = _.upperCase(this.props.type);
    let icon =
      type === "NOTE" ? "sticky note outline" : type === "TODO" ? "list" : "";

    let textDropdown = "";
    _.forEach(optionsTag, tag => {
      if (tag.value === this.state.couleurTag) {
        textDropdown = tag.value;
      }
    });

    return (
      <React.Fragment>
        <Modal
          dimmer="blurring"
          open={this.props.open}
          onClose={this.onClose}
          size="large"
        >
          <Header icon={icon} content={type} />
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
                  text={textDropdown}
                  width={2}
                  fluid={true}
                  label="Tags"
                  selection={true}
                  options={optionsTag}
                  onChange={(e, d) => this.setState({ couleurTag: d.value })}
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
