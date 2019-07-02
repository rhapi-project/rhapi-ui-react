import React from "react";
import { Client } from "rhapi-client";
import { Actes } from "rhapi-ui-react";
import { Button, Divider } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class ActesFavoris extends React.Component {
  componentWillMount() {
    this.setState({ openFavoris: false });
  };
  render() {
    return (
      <React.Fragment>
        <p>
          Lecture et configuration des actes stockés dans les favoris
        </p>
        <Divider hidden={true} />
        <Button 
          content="Ouvrir les favoris"
          onClick={() => this.setState({ openFavoris: true })}
        />
        <Actes.Favoris
          client={client}
          open={this.state.openFavoris}
          onClose={() => this.setState({ openFavoris: false })}
        />
      </React.Fragment>
    )
  }
}