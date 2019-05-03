import React from "react";
import { Shared } from "rhapi-ui-react";
import { Divider, Input, Modal } from "semantic-ui-react";

export default class SharedLocalisations extends React.Component {
  componentWillMount() {
    this.setState({
      dents: "",
      openLocalisations: false
    });
  };

  close = () => {
    this.setState({ openLocalisations: false });
  };
  render() {
    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>Shared.Localisations</b> pour la grille de saisie des localisations dentaires.
        </p>
        <Divider hidden={true} />
        Liste des dents sélectionnées : &nbsp;
        <Input
          onClick={(e, d) => this.setState({ openLocalisations: true })}
          value={this.state.dents}
        />
        <Modal size="large" open={this.state.openLocalisations} onClose={this.close}>
          <Modal.Header>Sélectionner une ou plusieurs dents</Modal.Header>
          <Modal.Content>
            <Shared.Localisations
              dents={this.state.dents}
              onSelection={dents => {
                this.setState({ dents: dents });
                this.close();
              }}
            />
          </Modal.Content>
        </Modal>
      </React.Fragment>
    );
  }
}