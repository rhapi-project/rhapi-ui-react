import React from "react";
import { Divider, Grid, Header, Icon, Menu } from "semantic-ui-react";

//import _ from "lodash";

// Les exemples
import CCAMDetailActe from "./CCAM/DetailActe";
import CCAMSearchBasic from "./CCAM/RechercheActe";
import CCAMSearchTable from "./CCAM/TableActes";
import CCAMPaginationPages from "./CCAM/TableAvecPagination";
import CCAMPaginationMore from "./CCAM/TableSansPagination";
import CCAMTarificationDynamique from "./CCAM/TarificationActeDynamique";
import CCAMTarificationStatique from "./CCAM/TarificationActeStatique";

const ghBaseUrl =
  "https://github.com/rhapi-project/rhapi-ui-react/blob/master/exemples/src";

export default class App extends React.Component {
  state = {
    group: "",
    name: ""
  };

  componentWillMount() {
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
              this.state.group === "CCAM" &&
              this.state.name === "DetailActe"
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

    let shared = (
      <Menu.Item>
        <Menu.Header>Shared</Menu.Header>
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

    return (
      <Grid style={{ minHeight: window.screen.height }}>
        <Grid.Column width={4}>
          <Menu
            pointing={true}
            vertical={true}
            inverted={true}
            style={{ height: "100vh" }}
          >
            {ccam}
            {patients}
            {plannings}
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
        return <CCAMDetailActe />
      } else {
        return "";
      }
    } else {
      return "";
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
