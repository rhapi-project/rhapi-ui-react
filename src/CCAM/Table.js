import React from "react";
import PropTypes from "prop-types";
import { Button, Table } from "semantic-ui-react";

import _ from "lodash";

const styles = {
  coveredTableRow: {
    cursor: "pointer",
    fontWeight: "bold"
  }
};

const propDefs = {
  description:
    "Composant montrant sous forme d'un tableau les actes obtenus après une recherche par mot clé.",
  example: "SearchTable",
  propDocs: {
    actes: "actes CCAM à afficher",
    headers: "en-têtes du tableau",
    informations: "se référer à la documentation RHAPI sur la pagination",
    onSelection: "callback à la sélection d'un acte",
    onPageSelect: "callback changement de page",
    //pagination: paginationPropDefs,
    showPagination: "afficher les options de paginations",
    table: "semantic.collections"
  },
  propTypes: {
    actes: PropTypes.array,
    client: PropTypes.any.isRequired,
    headers: PropTypes.array,
    informations: PropTypes.object,
    onSelection: PropTypes.func,
    onPageSelect: PropTypes.func,
    //pagination: PropTypes.object,
    showPagination: PropTypes.bool,
    table: PropTypes.object
  }
};

const paginationPropDefs = {
  description: "Options de pagination",
  propDocs: {
    btnFirstContent: "contenu textuel du bouton (première page)",
    btnLastContent: "contenu textuel du bouton (dernière page)",
    btnMoreContent: "contenu textuel du bouton (plus de résutats)",
    btnNextContent: "contenu textuel du bouton (page suivante)",
    btnPrevContent: "contenu textuel du bouton (page précédente)",
    btnFirstIcon: "Semantic Icon",
    btnLastIcon: "Semantic Icon",
    btnMoreIcon: "Semantic Icon",
    btnNextIcon: "Semantic Icon",
    btnPrevIcon: "Semantic Icon",
    btnFirst: "Props semantic bouton",
    btnLast: "Props semantic bouton",
    btnNext: "Props semantic bouton",
    btnPrev: "Props semantic bouton",
    btnMore: "Props semantic bouton",
    mode: "mode de pagination ('pages' ou 'more')"
  },
  propTypes: {
    btnFirstContent: PropTypes.string,
    btnLastContent: PropTypes.string,
    btnMoreContent: PropTypes.string,
    btnNextContent: PropTypes.string,
    btnPrevContent: PropTypes.string,
    btnFirstIcon: PropTypes.string,
    btnLastIcon: PropTypes.string,
    btnMoreIcon: PropTypes.string,
    btnNextIcon: PropTypes.string,
    btnPrevIcon: PropTypes.string,
    btnFirst: PropTypes.object,
    btnLast: PropTypes.object,
    btnNext: PropTypes.object,
    btnPrev: PropTypes.object,
    btnMore: PropTypes.object,
    mode: PropTypes.string
  }
};

export default class Table2 extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    actes: [],
    headers: [],
    informations: {},
    pagination: {},
    showPagination: false,
    table: {}
  };
  componentWillMount() {
    this.setState({
      actes: this.props.actes,
      informations: this.props.informations,
      mouseOverItem: {}
    });
  }

  componentWillReceiveProps(next) {
    this.setState({
      actes: next.actes,
      informations: next.informations
    });
  }

  displayValue = (champ, value) => {
    if (_.isNull(value)) {
      return "";
    }

    let dates = [
      "dtArrete",
      "dtCreatio",
      "dtEffet",
      "dtFin",
      "dtJo",
      "dtModif"
    ];
    if (_.includes(dates, champ)) {
      let d = new Date(value);
      return d.toLocaleDateString("fr-FR");
    } else {
      return value;
    }
  };

  onSelection = acte => {
    if (!_.isUndefined(this.props.onSelection)) {
      this.props.onSelection(acte);
    }
  };

  onPageSelect = query => {
    this.props.client.CCAM.readAll(
      query,
      results => {
        if (!_.isUndefined(this.props.onPageSelect)) {
          let obj = {};
          obj.actes = results.results;
          obj.informations = results.informations;
          this.props.onPageSelect(obj);
        } else {
          console.log("Callback onPageSelect non défini");
          console.log(results);
        }
      },
      error => {
        console.log(error);
      }
    );
  };

  render() {
    let noHeaders = _.isEmpty(this.props.headers);
    let showPagination = this.props.showPagination;
    if (!_.isEmpty(this.props.actes)) {
      return (
        <React.Fragment>
          <Table {...this.props.table}>
            {noHeaders ? (
              <Table.Header />
            ) : (
              <Table.Header>
                <Table.Row>
                  {_.map(this.props.headers, header => (
                    <Table.HeaderCell key={header.champ}>
                      {header.title}
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
            )}

            <Table.Body>
              {noHeaders
                ? _.map(this.props.actes, acte => (
                    <Table.Row
                      key={acte.codActe}
                      onClick={(e, d) => this.onSelection(acte)}
                      onMouseOver={e => {
                        this.setState({ mouseOverItem: acte });
                      }}
                      onMouseOut={e => {
                        this.setState({ mouseOverItem: {} });
                      }}
                      style={
                        acte === this.state.mouseOverItem
                          ? styles.coveredTableRow
                          : {}
                      }
                    >
                      <Table.Cell>{acte.codActe}</Table.Cell>
                      <Table.Cell>{acte.nomLong}</Table.Cell>
                    </Table.Row>
                  ))
                : _.map(this.props.actes, acte => (
                    <Table.Row
                      key={acte.codActe}
                      onClick={(e, d) => this.onSelection(acte)}
                      onMouseOver={e => {
                        this.setState({ mouseOverItem: acte });
                      }}
                      onMouseOut={e => {
                        this.setState({ mouseOverItem: {} });
                      }}
                      style={
                        acte === this.state.mouseOverItem
                          ? styles.coveredTableRow
                          : {}
                      }
                    >
                      {_.map(this.props.headers, header => (
                        <Table.Cell key={header.champ}>
                          {this.displayValue(
                            header.champ,
                            _.get(acte, [header.champ])
                          )}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))}
            </Table.Body>
          </Table>
          <div style={{ textAlign: "center" }}>
            {showPagination ? (
              <Pagination
                informations={this.state.informations}
                onPageSelect={this.onPageSelect}
                {...this.props.pagination}
              />
            ) : (
              ""
            )}
          </div>
        </React.Fragment>
      );
    } else {
      return "";
    }
  }
}

class Pagination extends React.Component {
  static propTypes = paginationPropDefs.propTypes;
  static defaultProps = {
    btnFirstContent: "",
    btnLastContent: "",
    btnMoreContent: "Plus de résultats",
    btnNextContent: "",
    btnPrevContent: "",
    btnFirstIcon: "fast backward",
    btnLastIcon: "fast forward",
    btnMoreIcon: "",
    btnNextIcon: "arrow right",
    btnPrevIcon: "arrow left",
    btnFirst: {},
    btnLast: {},
    btnNext: {},
    btnPrev: {},
    btnMore: {},
    informations: {},
    mode: "pages"
  };

  state = {
    loadingMore: false
  };

  componentWillReceiveProps() {
    if (this.props.mode === "more") {
      this.setState({
        loadingMore: false
      });
    }
  }

  handleClick = query => {
    this.props.onPageSelect(query);
  };

  loadMoreQuery = query => {
    let pageSize = this.props.informations.pageSize;
    let limit = 10;
    let q = query;
    q.offset = 0; // recommencer au début pour l'affichage
    if (_.isUndefined(q.limit)) {
      q.limit = pageSize;
    }
    q.limit += limit;
    return q;
  };

  btnSemanticProps = propsObj => {
    let obj = propsObj;
    _.unset(obj, "disabled");
    _.unset(obj, "icon");
    _.unset(obj, "content");
    _.unset(obj, "labelPosition");
    _.unset(obj, "onClick");
    return obj;
  };

  render() {
    let informations = this.props.informations;
    let show = !_.isUndefined(informations.queries);
    let btnFirst = this.btnSemanticProps(this.props.btnFirst);
    let btnLast = this.btnSemanticProps(this.props.btnLast);
    let btnNext = this.btnSemanticProps(this.props.btnNext);
    let btnPrev = this.btnSemanticProps(this.props.btnPrev);
    let btnMore = this.btnSemanticProps(this.props.btnMore);
    if (show && this.props.mode === "pages") {
      return (
        <React.Fragment>
          <Button
            disabled={_.isUndefined(informations.queries.prev)}
            icon={
              this.props.btnFirstIcon !== "" ? this.props.btnFirstIcon : null
            }
            content={
              this.props.btnFirstContent !== ""
                ? this.props.btnFirstContent
                : null
            }
            labelPosition={
              this.props.btnFirstContent !== "" &&
              this.props.btnFirstIcon !== ""
                ? "left"
                : null
            }
            onClick={() => this.handleClick(informations.queries.first)}
            {...btnFirst}
          />
          <Button
            disabled={_.isUndefined(informations.queries.prev)}
            icon={this.props.btnPrevIcon !== "" ? this.props.btnPrevIcon : null}
            content={
              this.props.btnPrevContent !== ""
                ? this.props.btnPrevContent
                : null
            }
            labelPosition={
              this.props.btnPrevContent !== "" && this.props.btnPrevIcon !== ""
                ? "left"
                : null
            }
            onClick={() => this.handleClick(informations.queries.prev)}
            {...btnPrev}
          />
          <Button
            disabled={_.isUndefined(informations.queries.next)}
            icon={this.props.btnNextIcon !== "" ? this.props.btnNextIcon : null}
            content={
              this.props.btnNextContent !== ""
                ? this.props.btnNextContent
                : null
            }
            labelPosition={
              this.props.btnNextContent !== "" && this.props.btnNextIcon !== ""
                ? "right"
                : null
            }
            onClick={() => this.handleClick(informations.queries.next)}
            {...btnNext}
          />
          <Button
            disabled={_.isUndefined(informations.queries.next)}
            icon={this.props.btnLastIcon !== "" ? this.props.btnLastIcon : null}
            content={
              this.props.btnLastContent !== ""
                ? this.props.btnLastContent
                : null
            }
            labelPosition={
              this.props.btnLastContent !== "" && this.props.btnLastIcon !== ""
                ? "right"
                : null
            }
            onClick={() => this.handleClick(informations.queries.last)}
            {...btnLast}
          />
        </React.Fragment>
      );
    } else if (show && this.props.mode === "more") {
      return (
        <React.Fragment>
          <Button
            disabled={_.isUndefined(informations.queries.next)}
            icon={this.props.btnMoreIcon !== "" ? this.props.btnMoreIcon : null}
            content={
              this.props.btnMoreContent !== ""
                ? this.props.btnMoreContent
                : null
            }
            labelPosition={
              this.props.btnMoreContent !== "" && this.props.btnMoreIcon !== ""
                ? "right"
                : null
            }
            loading={this.state.loadingMore}
            onClick={() => {
              this.setState({ loadingMore: true });
              let query = this.loadMoreQuery(informations.queries.next);
              this.handleClick(query);
            }}
            {...btnMore}
          />
        </React.Fragment>
      );
    } else {
      return "";
    }
  }
}
