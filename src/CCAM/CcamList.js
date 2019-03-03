import React from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";

import _ from "lodash";

const styles = {
  coveredTableRow: {
    fontWeight: "bold"
  }
}

export default class CcamList extends React.Component {
  static propTypes = {
    actes: PropTypes.array,
    headers: PropTypes.array,
    selectActe: PropTypes.func,
    table: PropTypes.object // les props semantic de TABLE
  };

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

  selectActe = acte => {
    if (!_.isUndefined(this.props.selectActe)) {
      this.props.selectActe(acte);
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
                    onClick={(e, d) => this.selectActe(acte)}
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
                    onClick={(e, d) => this.selectActe(acte)}
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
