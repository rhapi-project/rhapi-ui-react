import React from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";

import _ from "lodash";

const styles = {
  coveredTableRow: {
    fontWeight: "bold"
  }
};

const propDefs = {
  description: "Composant montrant sous forme d'un tableau les actes obtenus après une recherche par mot clé.",
  propDocs: {
    actes: "Tableau d'actes CCAM",
    headers: "Tableau décrivant les champs à retourner dans le résultat",
    onSelectionItem: "callback à la sélection d'un acte",
    table: "semantic.modules"
  },
  propTypes: {
    actes: PropTypes.array,
    headers: PropTypes.array,
    onSelectionItem: PropTypes.func,
    table: PropTypes.object
  }
};

export default class CTable extends React.Component {
  static propTypes = propDefs.propTypes;

  componentWillMount() {
    this.setState({
      actes: _.isUndefined(this.props.actes) ? [] : this.props.actes,
      mouseOverItem: {}
    });
  };

  displayValue = (champ, value) => {
    if (_.isNull(value)) {
      return "";
    }

    let dates = ["dtArrete", "dtCreatio", "dtEffet", "dtFin", "dtJo", "dtModif"];
    if (_.includes(dates, champ)) {
      let d = new Date(value);
      return d.toLocaleDateString("fr-FR");
    } else {
      return value;
    }
  };

  onSelectionItem = acte => {
    if (!_.isUndefined(this.props.onSelectionItem)) {
      this.props.onSelectionItem(acte);
    }
  };

  render() {
    //console.log(this.props.actes);
    let noHeaders = _.isUndefined(this.props.headers) || _.isEmpty(this.props.headers);
    if (!_.isEmpty(this.props.actes)) {
      return(
        <Table {...this.props.table}>
          {noHeaders
            ? <Table.Header />
            : <Table.Header>
                <Table.Row>
                  {_.map(this.props.headers, header =>
                    <Table.HeaderCell key={header.champ}>
                      {header.title}
                    </Table.HeaderCell>
                  )}
                </Table.Row>
              </Table.Header>
          }

          <Table.Body>
            {noHeaders
              ? _.map(this.props.actes, acte =>
                  <Table.Row
                    key={acte.codActe}
                    onClick={(e, d) => this.onSelectionItem(acte)}
                    onMouseOver={(e) => {this.setState({ mouseOverItem: acte })}}
                    onMouseOut={(e) => {this.setState({ mouseOverItem: {} })}}
                    style={acte === this.state.mouseOverItem ? styles.coveredTableRow : {}}
                  >
                    <Table.Cell>{acte.codActe}</Table.Cell>
                    <Table.Cell>{acte.nomLong}</Table.Cell>
                  </Table.Row>
                )
              : _.map(this.props.actes, acte =>
                  <Table.Row
                    key={acte.codActe}
                    onClick={(e, d) => this.onSelectionItem(acte)}
                    onMouseOver={(e) => {this.setState({ mouseOverItem: acte })}}
                    onMouseOut={(e) => {this.setState({ mouseOverItem: {} })}}
                    style={acte === this.state.mouseOverItem ? styles.coveredTableRow : {}}  
                  >
                    {_.map(this.props.headers, header =>
                      <Table.Cell key={header.champ}>
                        {this.displayValue(header.champ, _.get(acte, [header.champ]))}
                      </Table.Cell>
                    )}
                  </Table.Row>
                )
            }
          </Table.Body>
        </Table>
      );
    } else {
      return "";
    }
  }
}
