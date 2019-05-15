import React from "react";
import { Client } from "rhapi-client";
import { CCAM, Shared } from "rhapi-ui-react";
import { Divider, Grid, Input } from "semantic-ui-react";
import moment from "moment";
import DayPickerInput from 'react-day-picker/DayPickerInput';

import MomentLocaleUtils, {
  formatDate,
  parseDate
} from "react-day-picker/moment";
import "moment/locale/fr";
import 'react-day-picker/lib/style.css';


// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class CCAMTarificationDentaire extends React.Component {
  componentWillMount() {
    this.setState({
      acte: {},
      date: moment(),
      dents: "",
      openLocalisations: false
    })
  };

  close = () => {
    this.setState({ openLocalisations: false });
  };

  onSelection = acte => {
    this.setState({ acte: acte });
  };

  render() {
    let daypickerlink = (
      <a
        href="http://react-day-picker.js.org/"
        target="_blank"
        rel="noopener noreferrer"
        title="Documentation du composant REACT-DAY-PICKER"
      >
        DayPicker
      </a>
    );
    
    return (
      <React.Fragment>
        <p>
          Limitation de la recherche aux actes des dentistes. <br />Dans cet exemple,&nbsp;
          les composants <b>{daypickerlink}</b>, <b>Shared.Localisations</b>, <b>CCAM.Search</b>, <b>CCAM.Table</b>&nbsp;
          et <b>CCAM.Tarification</b> sont respectivement utilisés pour la date effective de l'acte,&nbsp;
          la grille des localisations dentaires, la recherche et la sélection d'un&nbsp;
          acte ainsi que la tarification.
        </p>
        <Divider hidden={true} />
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
              <Input>
                <DayPickerInput
                  dayPickerProps={{
                    fixedWeeks: true,
                    locale: "fr",
                    localeUtils: MomentLocaleUtils,
                    showOutsideDays: true
                  }}
                  format="L"
                  formatDate={formatDate}
                  parseDate={parseDate}
                  placeholder="JJ/MM/AAAA"
                  value={this.state.date.toDate()}
                  onDayChange={day => {
                    if (day) {
                      this.setState({ date: moment(day) })
                    }
                  }}
                />
              </Input>
            </Grid.Column>
            <Grid.Column width={4}>
              <CCAM.Code
                client={client}
                executant="D1"
                date={this.state.date.toISOString()}
                localisation={this.state.dents.replace(/\s/g,"")}
                onSelection={this.onSelection}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Input
                onClick={(e, d) => this.setState({ openLocalisations: true })}
                value={this.state.dents}
              />
              <Shared.Localisations
                dents={this.state.dents}
                onSelection={dents => {
                  this.setState({ dents: dents });
                }}
                modal={{
                  size: "large",
                  open: this.state.openLocalisations,
                  onClose: this.close
                }}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider hidden={true} />
        <CCAM.Tarification
          client={client}
          codActe={this.state.acte.codActe}
          date={this.state.date.toISOString()}
          dynamic={true}
          error="Acte non tarifé à cette date"
        />
      </React.Fragment>
    );
  }
}