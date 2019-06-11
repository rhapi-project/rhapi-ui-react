import React from "react";
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import { Button, Icon, Table } from "semantic-ui-react";
import _ from "lodash";
import { tarif } from "../lib/Helpers";
import Actions from "../Shared/Actions";
import moment from "moment";

const propDefs = {
  description: 'Historique des actes d\'un patient',
  example: 'Tableau',
  propDocs: {
    idPatient: 'ID du patient, par défaut 0 (Aucun patient)',
    onActeClick: 
      'Callback pour retourner l\'acte sélectionné sur un click',
    onActeDoubleClick: 
      'Callback pour retourner l\'acte sélectionné sur un double click',
    onSelectionChange: 
      'Callback pour retourner la liste des actes sélectionnés sur une multi-sélection (CTRL+click)',
    table: 'semantic.collections',
    limit: 'Valeur de pagination, par défaut 5',
    sort:
      'Le champs sur lequel le tri va être effectué. Par défaut, le tri se fait sur la date (doneAt)',
    order:
      'Un tri ascendant ou descendant [ASC,DESC]. Par défaut, le tri est descendant (DESC)',
    showPagination: 
      'Afficher les options de paginations, par défaut "true"',
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
    mode: 'Mode de pagination \'pages\' ou \'more\', par défaut "pages"'
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idPatient: PropTypes.number,
    onActeClick: PropTypes.func,
    onActeDoubleClick: PropTypes.func,
    onSelectionChange: PropTypes.func,
    table: PropTypes.object,
    limit: PropTypes.number,
    sort: PropTypes.string,
    order: PropTypes.string,
    showPagination: PropTypes.bool,
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
    table: {},
    limit: 5,
    sort: "doneAt",
    order: "DESC",
    // props pour le composant de pagination
    showPagination: true,
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
    document.addEventListener('click',this.onClickOutside, true);
    this.setState({
      idPatient: this.props.idPatient,
      actes: [],
      actesSelected: [],
      informations: {},
      offset: 0,
      sort: this.props.sort,
      order: this.props.order,
      sorted: _.isEqual(this.props.order, "DESC") ? "descending" : "ascending",
      lockRevision: ""
    });

    this.loadActe(this.props.idPatient, 0, this.props.sort, this.props.order);
  }

  componentWillReceiveProps(next) {
    if (_.isEqual(this.state.idPatient, next.idPatient)) {
      this.loadActe(
        next.idPatient,
        this.state.offset,
        this.state.sort,
        this.state.order
      );
    } else {
      this.loadActe(next.idPatient, 0, this.state.sort, this.state.order);
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.loadActe(
        this.state.idPatient,
        this.state.offset,
        this.state.sort,
        this.state.order
      );
    }, 15000);
  }

  componentWillUnmount() {
    document.removeEventListener('click',this.onClickOutside, true);
    clearInterval(this.interval);
  }

  onClickOutside = (event) => {
    const domNode = ReactDOM.findDOMNode(this);

    if (!event.ctrlKey) {
      if (!domNode.contains(event.target)) {
        this.setState({
          actesSelected: []
        });
      }
    }
  }

  loadActe = (idPatient, offset, sort, order) => {
    let params = {
      _idPatient: idPatient,
      _etat: 0,
      limit: this.props.limit,
      offset: offset,
      sort: sort,
      order: order
    };

    this.props.client.Actes.readAll(
      params,
      result => {
        if (
          !_.isEqual(this.state.lockRevision, result.informations.lockRevision)
        ) {
          this.setState({
            idPatient: Number(idPatient),
            actes: result.results,
            informations: result.informations,
            offset: offset,
            sort: sort,
            order: order,
            sorted: _.isEqual(order, "DESC") ? "descending" : "ascending",
            lockRevision: result.informations.lockRevision
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  };

  onPageSelect = query => {
    this.loadActe(query._idPatient, query.offset, query.sort, query.order);
  };

  onHandleSort = () => {
    if (_.isEqual(this.state.order, "DESC")) {
      this.loadActe(
        this.state.idPatient,
        this.state.offset,
        this.state.sort,
        "ASC"
      );
    } else {
      this.loadActe(
        this.state.idPatient,
        this.state.offset,
        this.state.sort,
        "DESC"
      );
    }
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

  onActeClick = (e, id) => {
    if (e.ctrlKey) {
      let multiActes = _.isEmpty(this.state.actesSelected)?[]:this.state.actesSelected;

      if (_.includes(multiActes, id)) {
        multiActes.splice(_.indexOf(multiActes, id), 1);
      } else {
        multiActes.push(id);
      }
      this.setState({ actesSelected: multiActes });
      this.props.onSelectionChange(multiActes);
    } else {
      let actesSelected = [];
      actesSelected.push(id);
      this.setState({ actesSelected: actesSelected });
      this.props.onActeClick(id);
    }
  };

  onActeDoubleClick = id => {
    let actesSelected = [];
    actesSelected.push(id);
    this.setState({ actesSelected: actesSelected });
    this.props.onActeDoubleClick(id);
  };

  render() {
    console.log(this.state);
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
        <Table celled={true} striped={false} selectable={false} sortable={true}>
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
              <Table.HeaderCell collapsing={true}>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(this.state.actes, acte => {
              let deco = this.decoration(acte.code);
              let rowSelected = _.includes(this.state.actesSelected, acte.id);

              return (
                <React.Fragment key={acte.id}>
                  <Table.Row
                    key={acte.id}
                    onClick={e => {
                      if (!_.isUndefined(this.props.onActeClick) && !_.isUndefined(this.props.onSelectionChange)) {
                        this.onActeClick(e, acte.id);
                      }
                    }}
                    onDoubleClick={() => {
                      if (!_.isUndefined(this.props.onActeDoubleClick)) {
                        this.onActeDoubleClick(acte.id);
                      }
                    }}
                    style={{
                      backgroundColor: rowSelected ? "#E88615" : deco.color,
                      color: rowSelected ? "white" : "black"
                    }}
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
                    <Table.Cell>
                      <Actions
                        actions={this.props.actions}
                      />
                    </Table.Cell>
                  </Table.Row>
                </React.Fragment>
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
    q.offset = 0;
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
