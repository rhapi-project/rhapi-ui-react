import React from "react";
import { Divider, Grid, Header, Icon, Menu } from "semantic-ui-react";

import _ from "lodash";

// Les exemples
import SearchBasic from "./CCAM/SearchBasic";
import SearchList from "./CCAM/SearchTable";
import SearchPagination from "./CCAM/SearchPagination";

const ghBaseUrl =
  "https://github.com/rhapi-project/rhapi-ui-react/blob/master/examples/src";

export default class App extends React.Component {
  state = {
    component: null,
    name: ""
  };

  handleClickItem = (group, name, component) => {
    this.setState({
      group: group,
      name: name,
      component: component
    });
  };

  render() {
    let ccam = (
      <Menu.Item>
        <Menu.Header>CCAM</Menu.Header>
        <Menu.Menu>
          <Menu.Item
            name="SearchBasic"
            active={this.state.component === "SearchBasic"}
            onClick={(e, d) =>
              this.handleClickItem("CCAM", d.name, <SearchBasic />)
            }
          />
          <Menu.Item
            name="SearchTable"
            active={this.state.component === "Table"}
            onClick={(e, d) =>
              this.handleClickItem("CCAM", d.name, <SearchList />)
            }
          />
        <Menu.Item 
            name="SearchPagination"
            active={this.state.component === "Pagination"}
            onClick={(e, d) => 
              this.handleClickItem("CCAM", d.name, <SearchPagination />)
            }
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
      <Grid style={{minHeight : window.screen.height }}>
        <Grid.Column width={4}>
          <Menu pointing={true} vertical={true} inverted={true} style={{ height: "100vh" }}>
            {ccam}
            {patients}
            {plannings}
            {shared}
          </Menu>
        </Grid.Column>
        <Grid.Column width={10}>
          <Divider hidden={true} />
          {_.isNull(this.state.component) ? (
            <Description />
          ) : (
            <ViewExample
              name={this.state.name}
              component={this.state.component}
              group={this.state.group}
            />
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
  render() {
    let url =
      ghBaseUrl + "/" + this.props.group + "/" + this.props.name + ".js";
    return (
      <div style={{ minHeight: "100%" }}>
        <Header as="h2">{this.props.group}.{this.props.name}</Header>
        <Icon name="github" />
        <a
          href={url}
          target="_blank"
          title="Ce lien fera référence au code source de cet exemple sur Github"
          rel="noopener noreferrer"
        >
          Code source de l'exemple
        </a>
        <Divider hidden={true} />
        {this.props.component}
      </div>
    );
  }
}
