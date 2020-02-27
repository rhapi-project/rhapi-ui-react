import React from "react";
import { Client } from "rhapi-client";
import { CCAM } from "../../Components";
import { Divider } from "semantic-ui-react";

import _ from "lodash";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class CCAMFicheActe extends React.Component {
  state = {
    actes: []
  };

  onSelection = acte => {
    this.setState({ codActe: acte.codActe, actes: [] });
  };

  onLoadActes = obj => {
    this.setState({ actes: obj.results, codActe: "" });
  };

  onSuccess = result => {
    if (
      this.state.codActivite !== result.activite.value ||
      this.state.codDom !==
        (_.isUndefined(result.dom) ? 0 : result.dom.value) ||
      this.state.codGrille !== result.grille.value ||
      this.state.codPhase !== result.phase.value ||
      this.state.date !== result.date ||
      this.state.modificateurs !== result.modificateurs
    ) {
      this.setState({
        codActivite: result.activite.value,
        codDom: _.isUndefined(result.dom) ? 0 : result.dom.value,
        codGrille: result.grille.value,
        codPhase: result.phase.value,
        date: result.date,
        modificateurs: result.modificateurs
      });
    }
  };
  render() {
    return (
      <React.Fragment>
        <p>
          Utilisation de <b>CCAM.Fiche</b> pour la fiche d'un acte.
        </p>
        <Divider hidden={true} />
        <CCAM.Search client={client} onLoadActes={this.onLoadActes} />
        <Divider hidden={true} />
        <CCAM.Table
          client={client}
          actes={this.state.actes}
          onSelection={acte => this.onSelection(acte)}
        />
        <Divider hidden={true} />
        <CCAM.Tarification
          client={client}
          codActe={this.state.codActe}
          codActivite={this.state.codActivite}
          codDom={this.state.codDom}
          codGrille={this.state.codGrille}
          codPhase={this.state.codPhase}
          date={this.state.date}
          modificateurs={this.state.modificateurs}
          success={result => this.onSuccess(result)}
          dynamic={true}
        />
        <Divider hidden={true} />
        <CCAM.Fiche
          client={client}
          codActe={this.state.codActe}
          codActivite={this.state.codActivite}
          codDom={this.state.codDom}
          codGrille={this.state.codGrille}
          codPhase={this.state.codPhase}
          date={this.state.date}
          modificateurs={this.state.modificateurs}
        />
      </React.Fragment>
    );
  }
}
