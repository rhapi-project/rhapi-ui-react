import React from "react";
import { Shared } from "../../Components";
import { Divider, Input } from "semantic-ui-react";

export default class SharedLocalisations extends React.Component {
  state = {
    dents: "",
    openLocalisations: false
  };

  close = () => {
    this.setState({ openLocalisations: false });
  };

  render() {
    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>Shared.Localisations</b> pour la grille de
          saisie des localisations dentaires.
        </p>
        <Divider hidden={true} />
        Liste des dents sélectionnées : &nbsp;
        <Input
          onClick={(e, d) => this.setState({ openLocalisations: true })}
          value={this.state.dents}
        />
        <Divider hidden={true} />
        <Shared.Localisations
          dents={this.state.dents}
          onSelection={dents => {
            this.setState({ dents: dents });
          }}
          modal={{
            size: "large",
            open: this.state.openLocalisations,
            onClose: this.close
          }}
        />
      </React.Fragment>
    );
  }
}
