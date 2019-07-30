import React from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";
import Actions from "../Shared/Actions";

import _ from "lodash";
import moment from "moment";
import "moment/locale/fr";

import DatePicker from "react-datepicker"; // new
import fr from "date-fns/locale/fr"; // new
import "react-datepicker/dist/react-datepicker.css"; // new

import { tarif } from "../lib/Helpers";

const propDefs = {
  description:
    "Composant correspondant à une ligne du tableau de saisie des actes pour les dentistes",
  example: "Tableau",
  propDocs: {
    index: "Indice de la ligne",
    type: "Type d'acte (#DEVIS ou #FSE). Par défaut c'est une #FSE",
    acte: "Acte sur la ligne courante",
    actions: "Liste d'actions à effectuer (en plus des actions par défaut)",
    code: "Code de l'Acte sélectionné",
    cotation:
      "Cotation/coefficient applicable au code (significatif uniquement en NGAP, 0 si non significatif)",
    description: "Description de l'acte",
    date: "Date effective de l'acte au format ISO. Par défaut date du jour",
    editable:
      "Définir si une ligne va être éditable ou pas. Par défaut elle est éditable si elle n'est pas désactivée. " +
      "Voir la props 'disabled'.",
    localisation:
      'Liste des dents sélectionnées, séparées par des espaces. Par défaut ""',
    modificateurs:
      'Modificateurs appliqués à l\'acte sélectionné. Par défaut ""',
    qualificatifs: "Les qualificatifs",
    disabled: "Désactivation de la ligne",
    montant: "Le moment pour cet acte",
    onClick: "Callback au clic sur une ligne",
    onClickDate: "Callback au clic sur la colonne de la date",
    onClickLocalisation: "Callback au clic sur la colonne Localisation",
    onDelete: "Callback à la suppression de la ligne",
    onDuplicate: "Callback à la duplication de la ligne",
    onEdit: "Callback action de recherche en CCAM",
    onInsertion: "Callback à l'insertion d'un nouvel acte",
    onSearchFavoris:
      "Callback au clic sur la colonne libellé (Recherche d'un acte dans les favoris)",
    onMoveToFSE: "Callback déplacement d'un acte de #DEVIS vers #FSE"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    type: PropTypes.string,
    index: PropTypes.number,
    acte: PropTypes.object,
    actions: PropTypes.array,
    code: PropTypes.string,
    cotation: PropTypes.number,
    description: PropTypes.string,
    date: PropTypes.string,
    editable: PropTypes.bool,
    localisation: PropTypes.string,
    modificateurs: PropTypes.string,
    qualificatifs: PropTypes.string,
    disabled: PropTypes.bool,
    montant: PropTypes.number,
    onClick: PropTypes.func,
    onClickDate: PropTypes.func,
    onClickLocalisation: PropTypes.func,
    onDelete: PropTypes.func,
    onDuplicate: PropTypes.func,
    onEdit: PropTypes.func,
    onInsertion: PropTypes.func,
    onSearchFavoris: PropTypes.func,
    onMoveToFSE: PropTypes.func
  }
};

export default class SaisieDentaire extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    actions: [],
    code: "",
    cotation: 0,
    description: "",
    date: moment().toISOString(),
    editable: true,
    index: 0,
    localisation: "",
    disabled: true,
    montant: 0,
    type: "#FSE"
  };

  componentWillMount() {
    this.setState({
      openDatePicker: false,
      openLocalisation: false
    });
  }

  onClickCell = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.index);
    }
  };

  render() {
    let actions = [
      {
        icon: "edit",
        text: "Editer",
        action: index => {
          if (this.props.onEdit) {
            this.props.onEdit(index);
          }
        }
      },
      {
        icon: "add",
        text: "Insérer",
        action: index => {
          if (this.props.onInsertion) {
            this.props.onInsertion(index);
          }
        }
      },
      {
        icon: "copy",
        text: "Dupliquer",
        action: index => {
          if (this.props.onDuplicate) {
            this.props.onDuplicate(index);
          }
        }
      },
      {
        icon: "trash",
        text: "Supprimer",
        action: index => {
          if (this.props.onDelete) {
            this.props.onDelete(index);
          }
        }
      }
    ];

    if (this.props.type === "#DEVIS") {
      actions.push({
        icon: "exchange",
        text: "Vers FSE",
        action: index => {
          if (this.props.onMoveToFSE) {
            this.props.onMoveToFSE(index);
          }
        }
      });
    }

    if (this.props.actions) {
      _.forEach(this.props.actions, a => {
        actions.push(a);
      });
    }

    return (
      <React.Fragment>
        <Table.Row
          disabled={this.props.disabled || !this.props.editable}
          textAlign="center"
          style={{ height: "35px" }}
        >
          {this.props.type === "#DEVIS" ? null : (
            <Table.Cell
              collapsing={true}
              style={{ minWidth: "100px" }}
              onClick={() => {
                if (this.props.onClickDate) {
                  this.props.onClickDate(this.props.index);
                }
              }}
            >
              {_.isEmpty(this.props.acte)
                ? ""
                : moment(this.props.date).format("L")}
            </Table.Cell>
          )}
          {/* <Table.Cell
            collapsing={true}
            style={{ minWidth: "100px" }}
            onClick={() => {
              if (this.props.onClickDate) {
                this.props.onClickDate(this.props.index);
              }
            }}
          >
            {_.isEmpty(this.props.acte)
              ? ""
              : moment(this.props.date).format("L")}
          </Table.Cell> */}
          <Table.Cell
            collapsing={true}
            onClick={() => {
              if (this.props.onClickLocalisation) {
                this.props.onClickLocalisation(this.props.index);
              }
            }}
          >
            {this.props.localisation}
          </Table.Cell>
          <Table.Cell
            collapsing={true}
            style={{ minWidth: "90px" }}
            onClick={this.onClickCell}
          >
            {this.props.code}
          </Table.Cell>
          <Table.Cell
            collapsing={true}
            textAlign="right"
            onClick={this.onClickCell}
          >
            {_.isEmpty(this.props.code) ? "" : this.props.cotation}
          </Table.Cell>
          <Table.Cell
            textAlign="left"
            onClick={() => {
              if (this.props.onSearchFavoris) {
                this.props.onSearchFavoris(this.props.index);
              }
            }}
          >
            {this.props.description}
          </Table.Cell>
          <Table.Cell
            textAlign="center"
            collapsing={true}
            onClick={this.onClickCell}
          >
            {this.props.modificateurs}
          </Table.Cell>
          <Table.Cell collapsing={true} onClick={this.onClickCell}>
            {_.isEmpty(this.props.code) ? "" : this.props.qualificatifs}
          </Table.Cell>
          <Table.Cell
            collapsing={true}
            textAlign="right"
            onClick={this.onClickCell}
          >
            {_.isEmpty(this.props.code) ? "" : tarif(this.props.montant)}
          </Table.Cell>
          <Table.Cell collapsing={true}>
            {this.props.disabled ? null : (
              <Actions
                actions={actions}
                id={this.props.index}
                dropdown={{ direction: "left" }}
              />
            )}
          </Table.Cell>
        </Table.Row>
      </React.Fragment>
    );
  }
}
