import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { Button, Icon, Modal, Ref, Table } from "semantic-ui-react";

import _ from "lodash";
import moment from "moment";

import {
  tarif,
  secteur03,
  secteur04,
  secteur05,
  secteur06,
  secteur07,
  secteur08
} from "../lib/Helpers";
import Actions from "../Shared/Actions";
import Edition from "./Edition";

const propDefs = {
  description: "Historique des actes d'un patient",
  example: "Tableau",
  propDocs: {
    idPatient: "Id du patient, par défaut 0 (Aucun patient)",
    onActeClick:
      "Retourne en paramètre l'id de l'acte sélectionné sur un click",
    onActeDoubleClick:
      "Retourne en paramètre l'id l'acte sélectionné sur un double click",
    onSelectionChange:
      "Retourne en paramètre la liste des id des actes sélectionnés (multi-sélection possible par CTRL+click)",
    actions:
      'Tableau d\'objet contenant des actions à effectuer (en plus des actions par défaut). Exemple [{icon:"add",text:"Ajouter",action:fonction de l\'action ajouter}]',
    startAt: 'Filtre sur le début d\'une période (incluse). Par défaut ""',
    endAt: 'Filtre sur la fin d\'une période (incluse). Par défaut ""',
    localisation:
      'Filtre sur une liste de dents sélectionnées, séparées par des espaces. Par défaut ""',
    table: "semantic.collections",
    limit: "Valeur de pagination, par défaut 5",
    sort:
      "Le champs sur lequel le tri va être effectué. Par défaut, le tri se fait sur la date (doneAt)",
    order:
      "Le tri est ascendant (ASC) ou descendant (DESC). Par défaut, le tri est descendant (DESC)",
    showPagination: 'Affiche les options de paginations, par défaut "true"',
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
    mode: 'Mode de pagination "pages" ou "more", par défaut "pages"'
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idPatient: PropTypes.number,
    onActeClick: PropTypes.func,
    onActeDoubleClick: PropTypes.func,
    onSelectionChange: PropTypes.func,
    actions: PropTypes.array,
    startAt: PropTypes.string,
    endAt: PropTypes.string,
    localisation: PropTypes.string,
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
  // variables utilisées pour la multi-sélection avec la touche 'shift'
  firstClick = "";
  secondClick = "";
  // variables utilisées pour la suppresion des actes
  id = ""; // id de l'acte sélectionné
  idDocument = ""; // idDocument de l'acte sélectionné
  reponseCancel = false;
  reponseConfirm = false;
  isFSE = false;
  // Props
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    idPatient: 0,
    table: {},
    limit: 5,
    sort: "doneAt",
    order: "DESC",
    actions: [],
    startAt: "",
    endAt: "",
    localisation: "",
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
    this.setState({
      idPatient: this.props.idPatient,
      limit: this.props.limit,
      actes: [],
      actesSelected: [],
      informations: {},
      offset: 0,
      sort: this.props.sort,
      order: this.props.order,
      sorted: _.isEqual(this.props.order, "DESC") ? "descending" : "ascending",
      lockRevision: "",
      startAt: this.props.startAt,
      endAt: this.props.endAt,
      localisation: this.props.localisation,
      showConfirm: false,
      message: "",
      idEditer: 0,
      showEdit: false
    });

    this.reload(
      this.props.idPatient,
      this.props.limit,
      0,
      this.props.sort,
      this.props.order,
      this.props.startAt,
      this.props.endAt,
      this.props.localisation
    );
  }

  componentWillReceiveProps(next) {
    if (_.isEqual(this.state.idPatient, next.idPatient)) {
      this.reload(
        next.idPatient,
        this.state.limit,
        this.state.offset,
        this.state.sort,
        this.state.order,
        next.startAt,
        next.endAt,
        next.localisation.trim()
      );
    } else {
      this.reload(
        next.idPatient,
        this.state.limit,
        0,
        this.state.sort,
        this.state.order,
        this.state.startAt,
        this.state.endAt,
        this.state.localisation
      );
    }
  }

  componentDidMount() {
    document.addEventListener("click", this.onClickOutside); // Outside click du composant
    this.interval = setInterval(() => {
      // Reload des données toutes les 15 secondes
      this.reload(
        this.state.idPatient,
        this.state.limit,
        this.state.offset,
        this.state.sort,
        this.state.order,
        this.state.startAt,
        this.state.endAt,
        this.state.localisation
      );
    }, 15000);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.onClickOutside);
    clearInterval(this.interval);
  }

  onClickOutside = event => {
    const domNode = ReactDOM.findDOMNode(this);

    if (!event.ctrlKey) {
      if (!domNode.contains(event.target)) {
        this.setState({
          actesSelected: []
        });
      }
    }
  };

  query = (
    idPatient,
    limit,
    offset,
    sort,
    order,
    startAt,
    endAt,
    localisation
  ) => {
    let n = 0; // pour incrémenter les champs q1,q2,...
    let params = {};

    if (localisation) {
      let dents = localisation.split(" ");

      _.forEach(dents, dent => {
        if (dent === "01") {
          _.set(params, "q" + ++n, "OR,localisation,Like,1*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 1*");
          _.set(params, "q" + ++n, "OR,localisation,Like,5*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 5*");
          _.set(params, "q" + ++n, "OR,localisation,Like,2*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 2*");
          _.set(params, "q" + ++n, "OR,localisation,Like,6*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 6*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*03*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*04*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*05*");
        } else if (dent === "02") {
          _.set(params, "q" + ++n, "OR,localisation,Like,3*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 3*");
          _.set(params, "q" + ++n, "OR,localisation,Like,7*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 7*");
          _.set(params, "q" + ++n, "OR,localisation,Like,4*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 4*");
          _.set(params, "q" + ++n, "OR,localisation,Like,8*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 8*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*06*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*07*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*08*");
        } else if (dent === "03") {
          _.forEach(secteur03, dent03 => {
            _.set(params, "q" + ++n, "OR,localisation,Like,*" + dent03 + "*");
          });
          _.set(params, "q" + ++n, "OR,localisation,Like,*03*");
        } else if (dent === "04") {
          _.forEach(secteur04, dent04 => {
            _.set(params, "q" + ++n, "OR,localisation,Like,*" + dent04 + "*");
          });
          _.set(params, "q" + ++n, "OR,localisation,Like,*04*");
        } else if (dent === "05") {
          _.forEach(secteur05, dent05 => {
            _.set(params, "q" + ++n, "OR,localisation,Like,*" + dent05 + "*");
          });
          _.set(params, "q" + ++n, "OR,localisation,Like,*05*");
        } else if (dent === "06") {
          _.forEach(secteur06, dent06 => {
            _.set(params, "q" + ++n, "OR,localisation,Like,*" + dent06 + "*");
          });
          _.set(params, "q" + ++n, "OR,localisation,Like,*06*");
        } else if (dent === "07") {
          _.forEach(secteur07, dent07 => {
            _.set(params, "q" + ++n, "OR,localisation,Like,*" + dent07 + "*");
          });
          _.set(params, "q" + ++n, "OR,localisation,Like,*07*");
        } else if (dent === "08") {
          _.forEach(secteur08, dent08 => {
            _.set(params, "q" + ++n, "OR,localisation,Like,*" + dent08 + "*");
          });
          _.set(params, "q" + ++n, "OR,localisation,Like,*08*");
        } else if (dent === "10") {
          _.set(params, "q" + ++n, "OR,localisation,Like,1*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 1*");
          _.set(params, "q" + ++n, "OR,localisation,Like,5*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 5*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*03*");
        } else if (dent === "20") {
          _.set(params, "q" + ++n, "OR,localisation,Like,2*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 2*");
          _.set(params, "q" + ++n, "OR,localisation,Like,6*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 6*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*05*");
        } else if (dent === "30") {
          _.set(params, "q" + ++n, "OR,localisation,Like,3*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 3*");
          _.set(params, "q" + ++n, "OR,localisation,Like,7*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 7*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*06*");
        } else if (dent === "40") {
          _.set(params, "q" + ++n, "OR,localisation,Like,4*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 4*");
          _.set(params, "q" + ++n, "OR,localisation,Like,8*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 8*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*08*");
        } else {
          _.set(params, "q" + ++n, "OR,localisation,Like,*" + dent + "*");
        }
      });
    }

    if (startAt && endAt) {
      _.set(params, "q" + ++n, "AND,doneAt,Between," + startAt + "," + endAt);
    }

    _.set(params, "q" + ++n, "AND,idPatient,Equal," + idPatient);
    _.set(params, "q" + ++n, "AND,etat,Equal,0");
    _.set(params, "limit", limit);
    _.set(params, "offset", offset);
    _.set(params, "sort", sort);
    _.set(params, "order", order);

    return params;
  };

  reload = (
    idPatient,
    limit,
    offset,
    sort,
    order,
    startAt,
    endAt,
    localisation
  ) => {
    let params = this.query(
      idPatient,
      limit,
      offset,
      sort,
      order,
      startAt,
      endAt,
      localisation
    );

    this.props.client.Actes.readAll(
      params,
      result => {
        if (
          !_.isEqual(this.state.lockRevision, result.informations.lockRevision)
        ) {
          this.setState({
            idPatient: Number(idPatient),
            limit: limit,
            actes: result.results,
            informations: result.informations,
            offset: offset,
            sort: sort,
            order: order,
            sorted: _.isEqual(order, "DESC") ? "descending" : "ascending",
            lockRevision: result.informations.lockRevision,
            startAt: startAt,
            endAt: endAt,
            localisation: localisation
          });
        }
      },
      error => {
        console.log(`Erreur readAll`);
      }
    );
  };

  // Callbacks de la pagination
  onPageSelect = query => {
    this.reload(
      this.state.idPatient,
      query.limit,
      query.offset,
      query.sort,
      query.order,
      this.state.startAt,
      this.state.endAt,
      this.state.localisation
    );
  };

  onSort = () => {
    // trier l'historique
    if (_.isEqual(this.state.order, "DESC")) {
      this.reload(
        this.state.idPatient,
        this.state.limit,
        this.state.offset,
        this.state.sort,
        "ASC",
        this.state.startAt,
        this.state.endAt,
        this.state.localisation
      );
    } else {
      this.reload(
        this.state.idPatient,
        this.state.limit,
        this.state.offset,
        this.state.sort,
        "DESC",
        this.state.startAt,
        this.state.endAt,
        this.state.localisation
      );
    }
  };

  decoration = code => {
    // code de l'acte passé en paramètre
    let deco = {
      color: "",
      icon: "",
      code: ""
    };

    // Un acte CCAM ou NGAP : fond par défaut sans icône, le code est affiché
    if (!_.startsWith(code, "#")) {
      deco.code = code;
      return deco;
    }

    // Une ligne autre qu'un acte : fond coloré et icône, le code n'est pas affiché
    if (code === "#NOTE") {
      deco.color = "yellow";
      deco.icon = "sticky note outline";
    } else if (code === "#TODO") {
      deco.color = "lightgrey";
      deco.icon = "list";
    } else if (code === "#FSE") {
      deco.color = "lightgreen";
      deco.icon = "check";
    }

    return deco;
  };

  onActeClick = (e, id) => {
    let actesSelected = [];

    if (e.ctrlKey || e.metaKey) {
      actesSelected = this.state.actesSelected;
      if (_.includes(actesSelected, id)) {
        actesSelected.splice(_.indexOf(actesSelected, id), 1);
      } else {
        actesSelected.push(id);
      }
    } else if (e.shiftKey) {
      this.secondClick = id;
      let first = _.findIndex(
        this.state.actes,
        acte => acte.id === this.firstClick
      );
      let last = _.findIndex(
        this.state.actes,
        acte => acte.id === this.secondClick
      );

      // Permutation entre first et last si le "secondClick" est situé au-dessus du "firstClick"
      if (first > last) {
        let tmp = first;
        first = last;
        last = tmp;
      }

      for (let i = first; i <= last; i++) {
        actesSelected.push(this.state.actes[i].id);
      }
    } else {
      actesSelected.push(id);
      this.firstClick = id;
    }

    this.setState({ actesSelected: actesSelected });
    this.props.onActeClick(id);
    this.props.onSelectionChange(actesSelected);
  };

  onActeDoubleClick = id => {
    let actesSelected = [];
    actesSelected.push(id);
    this.setState({ actesSelected: actesSelected });
    this.props.onActeDoubleClick(id);
    this.props.onSelectionChange(actesSelected);
  };

  onEdit = id => {
    // l'id de l'acte passé en paramètre
    this.setState({
      idEditer: id,
      showEdit: true
    });
  };

  onClose = close => {
    this.setState({ showEdit: close });
  };

  onUpdate = acte => {
    this.setState({
      showEdit: false
    });

    this.reload(
      acte.idPatient,
      this.state.limit,
      this.state.offset,
      this.state.sort,
      this.state.order,
      this.state.startAt,
      this.state.endAt,
      this.state.localisation
    );
  };

  onDelete = (id, code) => {
    // l'id et le code de l'acte sélectionné passés en paramètres
    this.reponseCancel = false;
    this.reponseConfirm = true;
    this.id = id;
    _.map(this.state.actes, acte => {
      if (this.id === acte.id) {
        this.idDocument = acte.idDocument;
        return false;
      }
    });
    this.isFSE = false;

    // Suppression des actes sans #
    if (!_.startsWith(code, "#")) {
      this.setState({
        showConfirm: true,
        message:
          "Souhaitez-vous également supprimer l'ensemble des actes associés ainsi que la FSE correspondante ?"
      });
      return false;
    }

    // Suppression des actes avec #
    if (code === "#FSE") {
      this.isFSE = true;
      this.setState({
        showConfirm: true,
        message:
          "Souhaitez-vous également supprimer les actes associés à cette FSE ?"
      });
    } else {
      this.destroy(this.id);
    }
  };

  destroy = id => {
    // Suppression d'un acte dont l'id de l'acte est passé en paramètre
    this.props.client.Actes.destroy(
      id,
      result => {
        this.reload(
          this.state.idPatient,
          this.state.limit,
          this.state.offset,
          this.state.sort,
          this.state.order,
          this.state.startAt,
          this.state.endAt,
          this.state.localisation
        );
      },
      error => {
        console.log(`Erreur destroy`);
      }
    );
  };

  onCancel = () => {
    if (!this.reponseCancel && this.reponseConfirm) {
      this.setState({
        message: this.isFSE
          ? "Souhaitez-vous supprimer uniquement la FSE sélectionnée ?"
          : "Souhaitez-vous supprimer uniquement l'acte sélectionné ?"
      });
    } else {
      this.setState({ showConfirm: false });
    }

    this.reponseCancel = true;
    this.reponseConfirm = false;
  };

  onConfirm = () => {
    if (this.reponseCancel && !this.reponseConfirm) {
      this.setState({ showConfirm: false, message: "" });
      this.destroy(this.id);
    } else if (!this.reponseCancel && this.reponseConfirm) {
      this.setState({
        message: this.isFSE
          ? "Vous confirmez la suppression de cette FSE ainsi que les actes associés ?"
          : "Vous confirmez la suppression des actes associés ainsi que la FSE correspondante ?"
      });

      this.reponseConfirm = true;
    } else {
      this.setState({ showConfirm: false });

      if (!this.isFSE) {
        _.map(this.state.actes, acte => {
          if (this.idDocument === acte.idDocument) {
            this.destroy(acte.id);
          }

          if (this.idDocument === acte.id) {
            this.destroy(acte.id);
          }
        });
      } else {
        _.map(this.state.actes, acte => {
          if (this.id === acte.idDocument) {
            this.destroy(acte.id);
          }
        });
        this.destroy(this.id);
        this.isFSE = false;
      }
    }

    this.reponseCancel = true;
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

    let dropdown = {
      direction: "left"
    };

    return (
      <React.Fragment>
        {/* la maj de l'affichage de la sélection ne sera pas gérée par semantic */}
        <Table celled={true} striped={false} selectable={false} sortable={true}>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell
                sorted={this.state.sorted}
                onClick={() => this.onSort()}
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
              // actions du composant par défaut ["Editer","Supprimer"]
              let actions = [
                {
                  icon: "edit",
                  text: "Editer",
                  action: id => this.onEdit(id)
                },
                {
                  icon: "trash",
                  text: "Supprimer",
                  action: id => this.onDelete(id, acte.code)
                }
              ];

              if (!_.isEmpty(this.props.actions)) {
                actions = _.concat(actions, this.props.actions); // J'ajoute les actions (props) de l'utilisateur
              }

              return (
                <React.Fragment key={acte.id}>
                  <Table.Row
                    key={acte.id}
                    onClick={e => {
                      if (
                        this.props.onActeClick &&
                        this.props.onSelectionChange
                      ) {
                        this.onActeClick(e, acte.id);
                      }
                    }}
                    onDoubleClick={() => {
                      if (this.props.onActeDoubleClick) {
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
                        actions={actions}
                        id={acte.id}
                        dropdown={dropdown}
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
        <Modal size="tiny" open={this.state.showConfirm}>
          <Modal.Content>
            <p>{this.state.message}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.onCancel}>
              <Icon name="ban" color="red" />
              Non
            </Button>
            <Ref
              innerRef={node => {
                if (this.state.showConfirm) {
                  node.focus();
                }
              }}
            >
              <Button color="blue" onClick={this.onConfirm}>
                <Icon name="check" color="green" />
                Oui
              </Button>
            </Ref>
          </Modal.Actions>
        </Modal>
        {!_.isEqual(this.state.idEditer, 0) ? (
          <Edition
            client={this.props.client}
            id={this.state.idEditer}
            open={this.state.showEdit}
            onClose={this.onClose}
            onUpdate={this.onUpdate}
          />
        ) : (
          ""
        )}
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
