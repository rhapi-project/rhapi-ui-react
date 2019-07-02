import React from "react";
import PropTypes from "prop-types";
import { Button, Checkbox, Modal } from "semantic-ui-react";

import _ from "lodash";
import ActesFavoris from "../../exemples/src/Actes/Favoris";

const propDefs = {
  description: "Modal Semantic de lecture et de configuration des actes favoris",
  example: "Favoris",
  propDocs: {
    open: "Ouverture de la modal",
    onClose: "Callback à la fermeture de la modal"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    open: PropTypes.bool,
    onClose: PropTypes.func
  }
};

export default class Favoris extends React.Component {
  static propTypes = propDefs.propTypes;

  state = {
    actes: [],
    configuration: false
  };

  componentWillMount() {
    // faire la requête ici pour la lecture des actes favoris
    this.props.client.Configuration.read(
      "actesFavoris",
      result => {
        console.log(result.actes);
        this.setState({ actes: result.actes });
      },
      error => {
        console.log(error);
      }
    );
  };
  componentWillReceiveProps(next) {
    // faire l'ouverture de la modal
  };
  render() {
    let open = this.props.open ? this.props.open : false;
    return(
      <React.Fragment>
        <Modal open={open} size="small">
          <Modal.Content style={{ height: "450px", overflow: "auto" }}>
            coucou
            {/*<Button 
              circular={true}
              icon="add"
              style={{ float: "bottom" }}
            />*/}
          </Modal.Content>
          <Modal.Actions>
            <Checkbox
              style={{ float: "left" }}
              label="Mode configuration"
              checked={this.state.configuration}
              onChange={() => this.setState({ configuration: !this.state.configuration })}
              toggle={true}
            />
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
                //if (this.props.onClose) {
                //  this.props.onClose();
                //}
              }}
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    )
  }
}

/*class Acte extends React.Component {
  render() {
    return (
      <React.Fragment>
        Acte
      </React.Fragment>
    )
  }
}*/