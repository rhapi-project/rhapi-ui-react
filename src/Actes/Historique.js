import React from "react";
import PropTypes from "prop-types";
import { Button, Icon, Table } from "semantic-ui-react";
import _ from "lodash";
import { tarif } from "../lib/Helpers";
import moment from "moment";

const propDefs = {
  description: "Historique des actes d'un patient",
  example: "Tableau",
  propDocs: {
    idPatient: "Id du patient",
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
    idPatient: PropTypes.number,
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

export default class Historique extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    idPatient: 0,
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

  componentWillMount() {
    this.setState({
      idPatient: this.props.idPatient,
      actes: [],
      informations: {},
      limit: 5,
      sorted: null
    });

    setInterval(this.reload, 30000);
  }

  componentWillReceiveProps(next) {
    this.props.client.Actes.readAll(
      {
        _idPatient: next.idPatient,
        limit: this.state.limit,
        offset: 0,
        sort: "doneAt",
        order: "DESC"
      },
      result => {
        // console.log(result);
        this.setState({
          idPatient: next.idPatient,
          actes: result.results,
          informations: result.informations,
          sorted: "descending"
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  reload = () => {
    console.log("reload");
    this.props.client.Actes.readAll(
      {
        _idPatient: this.state.idPatient,
        limit: this.state.limit,
        offset: 0,
        sort: "doneAt",
        order: "DESC"
      },
      result => {
        // console.log(result);
        this.setState({
          actes: result.results,
          informations: result.informations,
          sorted: "descending"
        });
      },
      error => {
        console.log(error);
      }
    );
  };

  onHandleSort = () => {
    this.setState({
      actes: this.state.actes.reverse(),
      sorted: this.state.sorted === "descending" ? "ascending" : "descending"
    });
  };

  decoration = code => {
    let deco = {};
    deco.color = "";
    deco.icon = "";
    deco.code = "";

    if (_.startsWith(code, "#")) {
      if (_.isEqual(code, "#NOTE")) {
        deco.color = "yellow";
        deco.icon = "sticky note outline";
      } else if (_.isEqual(code, "#TODO")) {
        deco.color = "lightgrey";
        deco.icon = "check";
      } else if (_.isEqual(code, "#FSE")) {
        deco.color = "lightgreen";
        deco.icon = "list";
      }

      return deco;
    } else {
      deco.code = code;
      return deco;
    }
  };

  onHandleRow = (e, id) => {
    console.log(id);

    if (e.type === "click") {
      console.log("Left click");
    } else if (e.type === "contextmenu") {
      console.log("Right click");
    }
  };

  onPageSelect = query => {
    this.props.client.Actes.readAll(
      query,
      result => {
        this.setState({
          actes: result.results,
          informations: result.informations,
          sorted: "descending"
        });
      },
      error => {
        console.log(error);
      }
    );
  };

  render() {
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
      mode: this.props.mode
    };

    return (
      <React.Fragment>
        <Table celled={true} striped={true} selectable={true} sortable={true}>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell
                sorted={this.state.sorted}
                onClick={() => this.onHandleSort()}
                collapsing={true}
              >
                Date
              </Table.HeaderCell>
              <Table.HeaderCell collapsing={true}>
                Localisation
              </Table.HeaderCell>
              <Table.HeaderCell collapsing={true}>Code/Type</Table.HeaderCell>
              <Table.HeaderCell collapsing={true}>Cotation</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell collapsing={true}>Montant</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(this.state.actes, acte => {
              let deco = this.decoration(acte.code);

              return (
                <Table.Row
                  key={acte.id}
                  onClick={e => this.onHandleRow(e, acte.id)}
                  onContextMenu={e => this.onHandleRow(e, acte.id)}
                  style={{ backgroundColor: deco.color }}
                >
                  <Table.Cell>{moment(acte.doneAt).format("L")}</Table.Cell>
                  <Table.Cell>{acte.localisation}</Table.Cell>
                  <Table.Cell>{deco.code}</Table.Cell>
                  <Table.Cell>
                    {_.isEqual(acte.cotation, 0) ? "" : acte.cotation}
                  </Table.Cell>
                  <Table.Cell>
                    {_.isEmpty(deco.icon) ? "" : <Icon name={deco.icon} />}
                    {acte.description}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {tarif(acte.montant)}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <div style={{ textAlign: "center" }}>
          {showPagination ? (
            <Pagination
              informations={this.state.informations}
              onPageSelect={this.onPageSelect}
              {...pagination}
            />
          ) : (
            ""
          )}
        </div>
      </React.Fragment>
    );
  }
}

class Pagination extends React.Component {
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
