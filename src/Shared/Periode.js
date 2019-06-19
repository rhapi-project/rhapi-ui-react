import React from "react";
import PropTypes from "prop-types";
import { Button, Form, Modal, Ref } from "semantic-ui-react";


import DatePicker from "react-datepicker";
import fr from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";

import moment from "moment";

const propDefs = {
  description: "Période, début et fin d'une période",
  example: "Periode",
  propDocs: {
    open: "Ouverture de la modal",
    startAt: "Date de début de la période. Par défaut la date du jour.",
    endAt: "Date de fin de la période. Par défaut une semaine après la date du jour.",
    onPeriodeChange: "Callback au changement de la période",
    onClose: "Callback à la fermeture de la modal"
  },
  propTypes: {
    open: PropTypes.bool,
    startAt: PropTypes.string,
    endAt: PropTypes.string,
    onPeriodeChange: PropTypes.func,
    onClose: PropTypes.func
  }
};

export default class Periode extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    open: false,
    startAt: moment().toISOString(),
    endAt: moment().add(1, "week").toISOString()
  }

  componentWillMount() {
    this.setState({
      startAt: this.props.startAt,
      endAt: this.props.endAt
    });
  };

  componentWillReceiveProps(next) {
    if (next.open) {
      this.setState({
        startAt: next.startAt,
        endAt: next.endAt
      });
    }
  };

  handleChangeStart = date => {
    if (date) {
      let d = moment(date);
      if (!d.isAfter(moment(this.state.endAt))) {
        this.setState({ startAt: d.toISOString() });
      }
    }
  };

  handleChangeEnd = date => {
    if (date) {
      let d = moment(date);
      if (!d.isBefore(moment(this.state.startAt))) {
        this.setState({ endAt: d.toISOString() });
      }
    }
  };

  close = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  validation = () => {
    if (this.props.onPeriodeChange) {
      this.props.onPeriodeChange(this.state.startAt, this.state.endAt);
    }
    this.close();
  };
  render() {
    return (
      <React.Fragment>
        <Modal
          open={this.props.open}
          size="mini"
          //onClose={this.close}
        >
          <Modal.Content>
            <Form>
              <Form.Group widths="equal">
                <Form.Input label="Du" fluid={true}>
                  <Ref innerRef={node => {
                      node.firstChild.firstChild.style.width = "100%";
                    }}>
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={moment(this.state.startAt).toDate()}
                      selectsStart={true}
                      startDate={moment(this.state.startAt).toDate()}
                      endDate={moment(this.state.endAt).toDate()}
                      onChange={this.handleChangeStart}
                      locale={fr}
                    />
                  </Ref>
                </Form.Input>
                <Form.Input label="Au" fluid={true}>
                  <Ref innerRef={node => { node.firstChild.firstChild.style.width = "100%" }}>
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={moment(this.state.endAt).toDate()}
                      selectsEnd={true}
                      startDate={moment(this.state.startAt).toDate()}
                      endDate={moment(this.state.endAt).toDate()}
                      minDate={moment(this.state.startAt).toDate()}
                      onChange={this.handleChangeEnd}
                      locale={fr}
                    />
                  </Ref>
                </Form.Input>
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Annuler"
              onClick={this.close}
            />
            <Button
              content="OK"
              onClick={this.validation}
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}