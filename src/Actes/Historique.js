import React from "react";
import PropTypes from "prop-types";
import { Button, Icon, Table } from "semantic-ui-react";
import _ from "lodash";

import moment from "moment";

// TODO : mettre les props nécessaires
//        => dont l'id du patient, le nbre max de lignes par page (si pagination)...
//        documenter le Component
const propDefs = {
  description: "Composant correspondant à l'historique des actes d'un patient",
  example: "Tableau",
  propDocs: {
    idPatient: "Id du patient (0 si inconnu en bdd)"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idPatient: PropTypes.number
  }
};

export default class Historique extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    idPatient: 0
  };

  componentWillMount() {
    this.setState({
      actes: [],
      sorted: null
    });
  }

  componentWillReceiveProps(next) {
    this.props.client.Actes.readAll(
      {
        _idPatient: next.idPatient,
        limit: 20,
        offset: 0,
        sort: "doneAt",
        order: "DESC"
      }, // TODO : Introduire des filtres (dont le principal est celui du patient),
      // de la pagination, ordonner... Exclure le champ patientJO du résultat...
      result => {
        // console.log(result);
        this.setState({
          actes: result.results,
          sorted: "descending"
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  onHandleSort = () => {
    this.setState({
      actes: this.state.actes.reverse(),
      sorted: this.state.sorted === "descending" ? "ascending" : "descending"
    });
  };

  onHandleRow = (e,id) => {
    console.log(id);

    if(e.type === 'click') {
      console.log("Left click");
    } else if (e.type === 'contextmenu') {
      console.log("Right click")
    }
  }

  render() {
    return (
      <Table 
        celled={true} 
        striped={true} 
        selectable={true} 
        sortable={true}
      >
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell
              sorted={this.state.sorted}
              onClick={() => this.onHandleSort()}
              collapsing={true}
            >
              Date
            </Table.HeaderCell>
            <Table.HeaderCell collapsing={true}>Localisation</Table.HeaderCell>
            <Table.HeaderCell collapsing={true}>Code/Type</Table.HeaderCell>
            <Table.HeaderCell collapsing={true}>Cotation</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell collapsing={true}>Montant</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(this.state.actes, acte => {
            // Ne pas afficher les codes en # mais colorer la ligne
            // => ex. vert pour #FSE, jaune pour #note, etc...
            // Revoir le rendu de chaque champ (avec moment pour la date, un montant avec ','...)
            let backColor = "";
            let textColor = "";
            let code = "";
            let icon = "";
            if (_.isEqual(acte.code, "#NOTE")) {
              backColor = "#1C5D83"; //jaune
              textColor = "white";
              icon = "calculator";
            } else if (_.isEqual(acte.code, "#TODO")) {
              backColor = "#CC0000"; //rouge
              textColor = "white";
              icon = "list ul";
            } else if (_.isEqual(acte.code, "#FSE")) {
              backColor = "#1C874B"; //vert
              textColor = "white";
              icon = "check";
            } else {
              backColor = "";
              code = acte.code;
            }

            return (
              <Table.Row 
                key={acte.id}
                onClick={(e) => this.onHandleRow(e,acte.id)}
                onContextMenu={(e) => this.onHandleRow(e,acte.id)}
                style={{ 
                  color: textColor
                }}
              >
                <Table.Cell style={{ backgroundColor: backColor }}>
                  {moment(acte.doneAt).format("L")}
                </Table.Cell>
                <Table.Cell style={{ backgroundColor: backColor }}>
                  {acte.localisation}
                </Table.Cell>
                <Table.Cell style={{ backgroundColor: backColor }}>
                  {code}
                </Table.Cell>
                <Table.Cell style={{ backgroundColor: backColor }}>
                  {acte.cotation}
                </Table.Cell>
                <Table.Cell style={{ backgroundColor: backColor }}>
                  {_.isEmpty(icon)?'':<Icon name={icon} />}
                  {acte.description}
                </Table.Cell>
                <Table.Cell
                  style={{ backgroundColor: backColor }}
                  textAlign="right"
                >
                  {acte.montant.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}
