import React from "react";
import { Shared } from "../../Components";
import { Divider, Form } from "semantic-ui-react";

import moment from "moment";
import "moment/locale/fr";

export default class SharedPeriode extends React.Component {
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
    return (
      <React.Fragment>
        <p>
          Ce composant peut être utilisé pour déterminer les périodes, une date
          de début et une date de fin.
        </p>
        <p>
          Le <b>react-datepicker</b> est utilisé ici à la manière de cet{" "}
          {datepickerlink}
        </p>
        <Divider hidden={true} />
        <Form>
          <Form.Group>
            <Shared.Periode
              startYear={2015}
              onPeriodeChange={(startAt, endAt) => {
                if (startAt && endAt) {
                  console.log("Du : " + moment(startAt).format("LLL"));
                  console.log("Au : " + moment(endAt).format("LLL"));
                } else {
                  console.log("Durée indéterminée");
                }
              }}
            />
          </Form.Group>
        </Form>
      </React.Fragment>
    );
  }
}
