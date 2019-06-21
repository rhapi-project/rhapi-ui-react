import React from "react";
import { Shared } from "rhapi-ui-react";
import { Button, Divider } from "semantic-ui-react";

import moment from "moment";

export default class SharedDateRange extends React.Component {
  componentWillMount() {
    this.setState({
      startAt: undefined,
      endAt: undefined,
      periode: false
    });
  };
  render() {
    let datepickerlink = (
      <a
        href="https://reactdatepicker.com/#example-24"
        target="_blank"
        rel="noopener noreferrer"
      >
        exemple
      </a>
    );
    return(
      <React.Fragment>
        <p>
          Ce composant peut être utilisé pour déterminer une période, une date de début et une date de fin. 
        </p>
        <p>
          Le <b>react-datepicker</b> est utilisé ici à la manière de cet {datepickerlink}
        </p>
        <Divider hidden={true} />
        <Button 
          content="Changer la période"
          onClick={() => this.setState({ periode: true })}
        />
        <Shared.DateRange
          open={this.state.periode}
          startAt={this.state.startAt}
          endAt={this.state.endAt}
          onRangeChange={(startAt, endAt) => {
            this.setState({
              startAt: startAt,
              endAt: endAt
            });
          }}
          onClose={() => this.setState({ periode: false })}
        />
        <Divider hidden={true} />
        {!this.state.startAt || !this.state.endAt
          ? <p>
              Du &nbsp;. . / . . / . . . .&nbsp; au &nbsp;. . / . . / . . . .
            </p>
          : <p>
              Du {moment(this.state.startAt).format("DD/MM/YYYY")} au {moment(this.state.endAt).format("DD/MM/YYYY")}
            </p>
        }
      </React.Fragment>
    );
  }
}