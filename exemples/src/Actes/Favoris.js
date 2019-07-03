import React from "react";
import { Client } from "rhapi-client";
import { Actes } from "rhapi-ui-react";
import { Button, Divider } from "semantic-ui-react";

import _ from "lodash";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class ActesFavoris extends React.Component {
  componentWillMount() {
    this.setState({
      openFavoris: false,
      selectedActe: {}
    });
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
          onSelection={(index, acte) => this.setState({ selectedActe: acte })}
        />
        <Divider hidden={true} />
        {!_.isEmpty(this.state.selectedActe)
          ? <div>
              Acte sélectionné à partir des actes en Favoris : <br />
              Description : {this.state.selectedActe.description} <br />
              Code : {this.state.selectedActe.code} <br />
              Cotation : {this.state.selectedActe.cotation} <br />
              Montant : {this.state.selectedActe.montant} <br />
            </div>
          : null
        }
      </React.Fragment>
    )
  }
}