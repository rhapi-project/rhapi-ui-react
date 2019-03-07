import React from "react";
import { Divider, Grid, Header, Icon, Menu } from "semantic-ui-react";

//import _ from "lodash";

// Les exemples
import CCAMSearchBasic from "./CCAM/SearchBasic";
import CCAMSearchTable from "./CCAM/SearchTable";
import CCAMPaginationPages from "./CCAM/PaginationPages";
import CCAMPaginationMore from "./CCAM/PaginationMore";
import CCAMTarification from "./CCAM/Tarification";

const ghBaseUrl =
  "https://github.com/rhapi-project/rhapi-ui-react/blob/master/examples/src";

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
            name="SearchBasic"
            active={
              this.state.group === "CCAM" && this.state.name === "SearchBasic"
            }
            onClick={(e, d) => this.handleClickItem("CCAM", d.name)}
          />
          <Menu.Item
            name="SearchTable"
            active={
              this.state.group === "CCAM" && this.state.name === "SearchTable"
            }
            onClick={(e, d) => this.handleClickItem("CCAM", d.name)}
          />
          <Menu.Item
            name="PaginationPages"
            active={
              this.state.group === "CCAM" &&
              this.state.name === "PaginationPages"
            }
            onClick={(e, d) => this.handleClickItem("CCAM", d.name)}
          />
          <Menu.Item
            name="PaginationMore"
            active={
              this.state.group === "CCAM" &&
              this.state.name === "PaginationMore"
            }
            onClick={(e, d) => this.handleClickItem("CCAM", d.name)}
          />
          <Menu.Item
            name="Tarification"
            active={
              this.state.group === "CCAM" && this.state.name === "Tarification"
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
      if (name === "SearchBasic") {
        return <CCAMSearchBasic />;
      } else if (name === "SearchTable") {
        return <CCAMSearchTable />;
      } else if (name === "PaginationPages") {
        return <CCAMPaginationPages />;
      } else if (name === "PaginationMore") {
        return <CCAMPaginationMore />;
      } else if (name === "Tarification") {
        return <CCAMTarification />;
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
