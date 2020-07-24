import React from "react";
import { Divider, Grid, Header, Icon, Menu } from "semantic-ui-react";

//import _ from "lodash";

// Exemples CCAM
import CCAMDetailActe from "./CCAM/DetailActe";
import CCAMSearchBasic from "./CCAM/RechercheActe";
import CCAMSearchTable from "./CCAM/TableActes";
import CCAMPaginationPages from "./CCAM/TableAvecPagination";
import CCAMPaginationMore from "./CCAM/TableSansPagination";
import CCAMTarificationDynamique from "./CCAM/TarificationActeDynamique";
import CCAMTarificationStatique from "./CCAM/TarificationActeStatique";

// Exemples Shared
import SharedLocalisations from "./Shared/Localisations";
import SharedMontant from "./Shared/Montant";
import SharedDateRange from "./Shared/DateRange";
import SharedPeriode from "./Shared/Periode";

// Exemples Actes
import ActesHistorique from "./Actes/Historique";
import ActesFavoris from "./Actes/Favoris";
import ActesSaisieValidation from "./Actes/SaisieValidation";
import ActesEdition from "./Actes/Edition";
import ActesNote from "./Actes/Note";

// Exemples Documents
import DocumentsTextDocument from "./Documents/TextDocument";
import DocumentsListeDocument from "./Documents/ListeDocument";
import DocumentsDocumentModeles from "./Documents/DocumentModeles";
import DocumentsDocumentArchives from "./Documents/DocumentArchives";

// Exemples Images
import ImagesImportation from "./Images/Importation";
import ImagesGallerie from "./Images/Gallerie";

// CSS
//import "rhapi-ui-react/dist/index.css";

const ghBaseUrl =
  "https://github.com/rhapi-project/rhapi-ui-react/blob/master/src/exemples";

export default class App extends React.Component {
  state = {
    group: "",
    name: ""
  };

  componentDidMount() {
    let parts = window.location.hash.split("/");
    if (parts.length === 2) {
      this.setState({
        group: parts[0].substring(1),
        name: parts[1]
      });
    }
  }

  handleClickItem = (group, name) => {
    let originPath = window.location.pathname;
    window.location = originPath + "#" + group + "/" + name;
    this.setState({
      group: group,
      name: name
    });
  };

  render() {
    /*let originPath = window.location.pathname;
    let subApp = window.location.hash.split("/")[0];
    console.log(subApp);*/
    let ccam = (
      <Menu.Item>
        <Menu.Header>CCAM</Menu.Header>
        <Menu.Menu>
          <Menu.Item
            name="RechercheActe"
            active={
              this.state.group === "CCAM" && this.state.name === "RechercheActe"
            }
            onClick={(e, d) => this.handleClickItem("CCAM", d.name)}
          />
          <Menu.Item
            name="TableActes"
            active={
              this.state.group === "CCAM" && this.state.name === "TableActes"
            }
            onClick={(e, d) => this.handleClickItem("CCAM", d.name)}
          />
          <Menu.Item
            name="TableAvecPagination"
            active={
              this.state.group === "CCAM" &&
              this.state.name === "TableAvecPagination"
            }
            onClick={(e, d) => this.handleClickItem("CCAM", d.name)}
          />
          <Menu.Item
            name="TableSansPagination"
            active={
              this.state.group === "CCAM" &&
              this.state.name === "TableSansPagination"
            }
            onClick={(e, d) => this.handleClickItem("CCAM", d.name)}
          />
          <Menu.Item
            name="TarificationActeStatique"
            active={
              this.state.group === "CCAM" &&
              this.state.name === "TarificationActeStatique"
            }
            onClick={(e, d) => this.handleClickItem("CCAM", d.name)}
          />
          <Menu.Item
            name="TarificationActeDynamique"
            active={
              this.state.group === "CCAM" &&
              this.state.name === "TarificationActeDynamique"
            }
            onClick={(e, d) => this.handleClickItem("CCAM", d.name)}
          />
          <Menu.Item
            name="DetailActe"
            active={
              this.state.group === "CCAM" && this.state.name === "DetailActe"
            }
            onClick={(e, d) => this.handleClickItem("CCAM", d.name)}
          />
        </Menu.Menu>
      </Menu.Item>
    );

    let patients = (
      <Menu.Item>
        <Menu.Header>Patients</Menu.Header>
        <Menu.Menu>
          <Menu.Item
            name="Composant 1"
            //active
            //onClick
          />
          <Menu.Item
            name="Composant 2"
            //active
            //onClick
          />
        </Menu.Menu>
      </Menu.Item>
    );

    let plannings = (
      <Menu.Item>
        <Menu.Header>Plannings</Menu.Header>
        <Menu.Menu>
          <Menu.Item
            name="Composant 1"
            //active
            //onClick
          />
          <Menu.Item
            name="Composant 2"
            //active
            //onClick
          />
        </Menu.Menu>
      </Menu.Item>
    );

    let actes = (
      <Menu.Item>
        <Menu.Header>Actes</Menu.Header>
        <Menu.Menu>
          <Menu.Item
            name="Historique"
            active={
              this.state.group === "Actes" && this.state.name === "Historique"
            }
            onClick={(e, d) => this.handleClickItem("Actes", d.name)}
          />
          <Menu.Item
            name="Favoris"
            active={
              this.state.group === "Actes" && this.state.name === "Favoris"
            }
            onClick={(e, d) => this.handleClickItem("Actes", d.name)}
          />
          <Menu.Item
            name="SaisieValidation"
            active={
              this.state.group === "Actes" &&
              this.state.name === "SaisieValidation"
            }
            onClick={(e, d) => this.handleClickItem("Actes", d.name)}
          />
          <Menu.Item
            name="Edition"
            active={
              this.state.group === "Actes" && this.state.name === "Edition"
            }
            onClick={(e, d) => this.handleClickItem("Actes", d.name)}
          />
          <Menu.Item
            name="Note"
            active={this.state.group === "Actes" && this.state.name === "Note"}
            onClick={(e, d) => this.handleClickItem("Actes", d.name)}
          />
          {/*<Menu.Item
            name="Document"
            active={this.state.group === "Actes" && this.state.name === "Document"}
            onClick={(e, d) => this.handleClickItem("Actes", d.name)}
          />*/}
        </Menu.Menu>
      </Menu.Item>
    );

    let documents = (
      <Menu.Item>
        <Menu.Header>Documents</Menu.Header>
        <Menu.Menu>
          <Menu.Item
            name="TextDocument"
            active={
              this.state.group === "Documents" &&
              this.state.name === "TextDocument"
            }
            onClick={(e, d) => this.handleClickItem("Documents", d.name)}
          />
          <Menu.Item
            name="ListeDocument"
            active={
              this.state.group === "Documents" &&
              this.state.name === "ListeDocument"
            }
            onClick={(e, d) => this.handleClickItem("Documents", d.name)}
          />
          <Menu.Item
            name="DocumentArchives"
            active={
              this.state.group === "Documents" &&
              this.state.name === "DocumentArchives"
            }
            onClick={(e, d) => this.handleClickItem("Documents", d.name)}
          />
          <Menu.Item
            name="DocumentModeles"
            active={
              this.state.group === "Documents" &&
              this.state.name === "DocumentModeles"
            }
            onClick={(e, d) => this.handleClickItem("Documents", d.name)}
          />
        </Menu.Menu>
      </Menu.Item>
    );

    let images = (
      <Menu.Item>
        <Menu.Header>Images</Menu.Header>
        <Menu.Menu>
          <Menu.Item
            name="Importation"
            active={
              this.state.group === "Images" && this.state.name === "Importation"
            }
            onClick={(e, d) => this.handleClickItem("Images", d.name)}
          />
          <Menu.Item
            name="Gallerie"
            active={
              this.state.group === "Images" && this.state.name === "Gallerie"
            }
            onClick={(e, d) => this.handleClickItem("Images", d.name)}
          />
        </Menu.Menu>
      </Menu.Item>
    );

    let shared = (
      <Menu.Item>
        <Menu.Header>Shared</Menu.Header>
        <Menu.Menu>
          <Menu.Item
            name="Localisations"
            active={
              this.state.group === "Shared" &&
              this.state.name === "Localisations"
            }
            onClick={(e, d) => this.handleClickItem("Shared", d.name)}
          />
          <Menu.Item
            name="Montant"
            active={
              this.state.group === "Shared" && this.state.name === "Montant"
            }
            onClick={(e, d) => this.handleClickItem("Shared", d.name)}
          />
          <Menu.Item
            name="DateRange"
            active={
              this.state.group === "Shared" && this.state.name === "DateRange"
            }
            onClick={(e, d) => this.handleClickItem("Shared", d.name)}
          />
          <Menu.Item
            name="Periode"
            active={
              this.state.group === "Shared" && this.state.name === "Periode"
            }
            onClick={(e, d) => this.handleClickItem("Shared", d.name)}
          />
        </Menu.Menu>
      </Menu.Item>
    );

    return (
      <Grid style={{ minHeight: window.screen.height }}>
        <Grid.Column width={4}>
          <Menu
            pointing={true}
            vertical={true}
            inverted={true}
            // style={{ height: "100vh" }}
          >
            {ccam}
            {patients}
            {plannings}
            {actes}
            {documents}
            {images}
            {shared}
          </Menu>
        </Grid.Column>
        <Grid.Column width={10}>
          <Divider hidden={true} />
          {this.state.group !== "" && this.state.name !== "" ? (
            <ViewExample name={this.state.name} group={this.state.group} />
          ) : (
            <Description />
          )}
        </Grid.Column>
      </Grid>
    );
  }
}

class Description extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Header as="h1">RHAPI-UI-REACT</Header>
        </div>
        <Divider hidden={true} />
        <div>
          Mettre ici une description de <strong>rhapi-ui-react</strong>, et
          comment l'utiliser par exemple
          <Divider hidden={true} />
          Aucun composant selectionné.{" "}
          <strong>
            Cliquer sur un composant pour voir un exemple de son utilisation.
          </strong>
        </div>
      </div>
    );
  }
}

class ViewExample extends React.Component {
  component = (group, name) => {
    if (group === "CCAM") {
      if (name === "RechercheActe") {
        return <CCAMSearchBasic />;
      } else if (name === "TableActes") {
        return <CCAMSearchTable />;
      } else if (name === "TableAvecPagination") {
        return <CCAMPaginationPages />;
      } else if (name === "TableSansPagination") {
        return <CCAMPaginationMore />;
      } else if (name === "TarificationActeDynamique") {
        return <CCAMTarificationDynamique />;
      } else if (name === "TarificationActeStatique") {
        return <CCAMTarificationStatique />;
      } else if (name === "DetailActe") {
        return <CCAMDetailActe />;
      } else {
        return "";
      }
    }

    if (group === "Shared") {
      if (name === "Localisations") {
        return <SharedLocalisations />;
      } else if (name === "Montant") {
        return <SharedMontant />;
      } else if (name === "Periode") {
        return <SharedPeriode />;
      } else if (name === "DateRange") {
        return <SharedDateRange />;
      } else {
        return "";
      }
    }

    if (group === "Actes") {
      if (name === "Historique") {
        return <ActesHistorique />;
      } else if (name === "SaisieValidation") {
        return <ActesSaisieValidation />;
      } else if (name === "Favoris") {
        return <ActesFavoris />;
      } else if (name === "Edition") {
        return <ActesEdition />;
      } else if (name === "Note") {
        return <ActesNote />;
      }
    }

    if (group === "Documents") {
      if (name === "TextDocument") {
        return <DocumentsTextDocument />;
      } else if (name === "ListeDocument") {
        return <DocumentsListeDocument />;
      } else if (name === "DocumentModeles") {
        return <DocumentsDocumentModeles />;
      } else if (name === "DocumentArchives") {
        return <DocumentsDocumentArchives />;
      }
    }

    if (group === "Images") {
      if (name === "Importation") {
        return <ImagesImportation />;
      } else if (name === "Gallerie") {
        return <ImagesGallerie />
      }
    }
  };

  render() {
    return (
      <div style={{ minHeight: "100%" }}>
        <Header as="h2">
          {this.props.group} - {this.props.name}
        </Header>
        <Icon name="github" />
        <a
          href={
            ghBaseUrl + "/" + this.props.group + "/" + this.props.name + ".js"
          }
          target="_blank"
          title="Ce lien fera référence au code source de cet exemple sur Github"
          rel="noopener noreferrer"
        >
          Code source de l'exemple
        </a>
        <Divider hidden={true} />
        {this.component(this.props.group, this.props.name)}
      </div>
    );
  }
}
