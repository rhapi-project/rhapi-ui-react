import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Button, Input, Modal } from "semantic-ui-react";

const propDefs = {
  description: "Modal de changement de titre d'un devis avant sa validation",
  example: "",
  propDocs: {
    open: "Ouverture de la modal",
    titre: "Titre de l'acte",
    onClose: "Callback à la fermeture de la modal",
    onChangeTitre:
      "Callback au changement du titre. Ce callback prend en paramètre le nouveau titre."
  },
  propTypes: {
    open: PropTypes.bool,
    titre: PropTypes.string,
    onClose: PropTypes.func,
    onChangeTitre: PropTypes.func
  }
};

export default class ModalActeTitre extends React.Component {
  static propTypes = propDefs.propTypes;

  state = {
    titre: ""
  };

  componentDidUpdate(prevProps) {
    if (this.props.open && prevProps.open !== this.props.open) {
      this.setState({ titre: this.props.titre });
    }
  }

  render() {
    return (
      <React.Fragment>
        <Modal size="mini" open={this.props.open}>
          <Modal.Header>Modification du titre</Modal.Header>
          <Modal.Content>
            <Input
              placeholder="Titre"
              fluid={true}
              value={this.state.titre}
              onChange={(e, d) => this.setState({ titre: d.value })}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Annuler"
              onClick={() => {
                if (this.props.onClose) {
                  this.props.onClose();
                }
              }}
            />
            <Button
              disabled={_.isEmpty(this.state.titre)}
              content="Valider"
              onClick={() => {
                if (this.props.onChangeTitre) {
                  this.props.onChangeTitre(this.state.titre);
                }
              }}
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}
