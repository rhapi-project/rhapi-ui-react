import React from "react";
import PropTypes from "prop-types";
import { Button, Table } from "semantic-ui-react";

import _ from "lodash";

const propDefs = {
  description:
    "Composant montrant sous forme d'un tableau les actes obtenus après une recherche par mot clé.",
  example: "SearchTable",
  propDocs: {
    actes: "Actes CCAM à afficher",
    headers: "En-têtes du tableau",
    informations: "Se référer à la documentation RHAPI sur la pagination",
    onSelection: "Callback à la sélection d'un acte",
    onPageSelect: "Callback changement de page",
    showPagination: 'Afficher les options de paginations, par défaut "false"',
    table: "semantic.collections",
    btnFirstContent:
      'Texte du bouton pour aller à la première page, par défaut ""',
    btnLastContent:
      'Texte du bouton pour aller à la dernière page, par défaut ""',
    btnMoreContent:
      'Texte du bouton pour afficher plus de résutats, par défaut "Plus de résultats"',
    btnNextContent:
      'Texte du bouton pour aller à la page suivante, par défaut ""',
    btnPrevContent:
      'Texte du bouton pour aller à la page précédente, par défaut ""',
    btnFirstIcon:
      'Icon semantic du bouton pour aller à la première page, par défaut "fast backward"',
    btnLastIcon:
      'Icon semantic du bouton pour aller à la dernière page, par défaut "fast forward"',
    btnMoreIcon:
      'Icon semantic du bouton pour afficher plus de résultats, par défaut ""',
    btnNextIcon:
      'Icon semantic du bouton pour aller à la page suivante, par défaut "step forward"',
    btnPrevIcon:
      'Icon semantic du bouton pour aller à la page précédente, par défaut "step backward"',
    btnFirst:
      'Props semantic du bouton pour aller à la première page, par défaut un objet vide "{}"',
    btnLast:
      'Props semantic du bouton pour aller à la dernière page, par défaut un objet vide "{}"',
    btnNext:
      'Props semantic du bouton pour aller à la page suivante, par défaut un objet vide "{}"',
    btnPrev:
      'Props semantic du bouton pour aller à la page précédente, par défaut un objet vide "{}"',
    btnMore:
      'Props semantic du bouton pour afficher plus de résultats, par défaut un objet vide "{}"',
    mode: "mode de pagination 'pages' ou 'more', par défaut \"pages\""
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    actes: PropTypes.array,
    headers: PropTypes.array,
    informations: PropTypes.object,
    onSelection: PropTypes.func,
    onPageSelect: PropTypes.func,
    showPagination: PropTypes.bool,
    table: PropTypes.object,
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
    pagination: {},
    showPagination: false,
    table: {},
    // props pour le composant de pagination
    btnFirstContent: "",
    btnLastContent: "",
    btnMoreContent: "Plus de résultats",
    btnNextContent: "",
    btnPrevContent: "",
    btnFirstIcon: "angle double left",
    btnLastIcon: "angle double right",
    btnMoreIcon: "",
    btnNextIcon: "angle right",
    btnPrevIcon: "angle left",
    btnFirst: {},
    btnLast: {},
    btnNext: {},
    btnPrev: {},
    btnMore: {},
    informations: {},
    mode: "pages"
  };

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
    let pagination = {
      btnFirstContent: this.props.btnFirstContent,
      btnLastContent: this.props.btnLastContent,
      btnMoreContent: this.props.btnMoreContent,
      btnNextContent: this.props.btnNextContent,
      btnPrevContent: this.props.btnPrevContent,
      btnFirstIcon: this.props.btnFirstIcon,
      btnLastIcon: this.props.btnLastIcon,
      btnMoreIcon: this.props.btnMoreIcon,
      btnNextIcon: this.props.btnNextIcon,
      btnPrevIcon: this.props.btnPrevIcon,
      btnFirst: this.props.btnFirst,
      btnLast: this.props.btnLast,
      btnNext: this.props.btnNext,
      btnPrev: this.props.btnPrev,
      btnMore: this.props.btnMore,
      informations: this.props.informations,
      mode: this.props.mode
    };

    if (!_.isEmpty(this.props.actes)) {
      return (
        <React.Fragment>
          <Table {...this.props.table} selectable={true}>
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
                    >
                      <Table.Cell>{acte.codActe}</Table.Cell>
                      <Table.Cell>{acte.nomLong}</Table.Cell>
                    </Table.Row>
                  ))
                : _.map(this.props.actes, acte => (
                    <Table.Row
                      key={acte.codActe}
                      onClick={(e, d) => this.onSelection(acte)}
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
                informations={this.props.informations}
                onPageSelect={query => this.onPageSelect(query)}
                {...pagination}
              />
            ) : null}
          </div>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

class Pagination extends React.Component {
  state = {
    loadingMore: false // affichage du loader dans le cas de la recherche "more"
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.informations.pageSize !== prevProps.informations.pageSize) {
      this.setState({ loadingMore: false });
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
      return null;
    }
  }
}
