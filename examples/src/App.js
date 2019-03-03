import React from "react";
import { Divider, Grid, Header, Icon, Menu } from "semantic-ui-react";

import _ from "lodash";

// Les exemples
import ExampleCcamSearch from "./CCAM/ExampleCcamSearch";
import ExampleCcamList from "./CCAM/ExampleCcamList";

const githubBaseUrl = "https://google.fr";

export default class App extends React.Component {
  state = {
    component: null,
    link: "", // à concatener avec githubBaseUrl
    name: ""
  };

  handleClickItem = (name, link, component) => {
    this.setState({
      component: component,
      link: link,
      name: name
    });
  };

  render() {
    let ccam = (
      <Menu.Item>
        <Menu.Header>CCAM</Menu.Header>
        <Menu.Menu>
          <Menu.Item
            name="CcamDetailFact"
            active={this.state.component === "CcamDetailFact"}
            onClick={() => {}}
          />
          <Menu.Item
            name="CcamList"
            active={this.state.component === "CcamList"}
            onClick={(e, d) => this.handleClickItem(d.name, "", <ExampleCcamList />)}
          />
          <Menu.Item
            name="CcamSaisie"
            active={this.state.component === "CcamSaisie"}
            onClick={() => {}}
          />
          <Menu.Item
            name="CcamSearch"
            active={this.state.component === "CcamSearch"}
            onClick={(e, d) => this.handleClickItem(d.name, "", <ExampleCcamSearch />)}
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
      <div>
        <Grid>
          <Grid.Column width={2}>
            <div style={{ position: "fixed" }}>
              <Menu
                pointing={true}
                secondary={true}
                vertical={true}
              >
                {ccam}
                {patients}
                {plannings}
                {shared}
              </Menu>
            </div>
          </Grid.Column>
          <Grid.Column stretched={true} width={14}>
            <div style={{ paddingLeft: "20px", paddingRight: "20px", paddingTop: "15px" }}>
              {_.isNull(this.state.component)
                ? <Description />
                : <ViewExample
                    name={this.state.name}
                    component={this.state.component}
                    link={this.state.link}
                  />
              }
            </div>
          </Grid.Column>
        </Grid>
      </div>
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
          Mettre ici une description de <strong>rhapi-ui-react</strong>, et comment l'utiliser par exemple 
          <Divider hidden={true} />
          Aucun composant séléctionné. <strong>Cliquer sur un composant pour voir un exemple de son utilisation.</strong>
        </div>
      </div>
    );
  }
}

class ViewExample extends React.Component {
  state = {
    name: "Composant"
  }
  render() {
    let url = githubBaseUrl + "";
    return(
      <div>
        <div style={{ display: "flex" }}>
          <div style={{ flexGrow: "1" }}>
            <Header as="h2">{this.props.name}</Header>
          </div>
          <div style={{ verticalAlign: "center" }}>
            <Icon name="github"/>
            <a href={url} 
              target="_blank"
              title="Ce lien fera référence au code source de cet exemple sur Github"
              rel="noopener noreferrer"
            >
              Code source de l'exemple
            </a>
          </div>
        </div>
        <Divider hidden={true} />
        <div>
          {this.props.component}
        </div>
      </div>
    );
  }
}