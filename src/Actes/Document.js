import React from "react";
import _ from "lodash";
import moment from "moment";

import Mustache from "mustache"; // moteur de template

// CKeditor 4
import CKEditor from "ckeditor4-react";

export default class Document extends React.Component {
  state = {
    data: ""
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data) {
      this.setState({ data: this.props.data });
    }
  };

  render() {
    //console.log(this.props.patient);
    console.log(this.props.devis);
    let dataObject = {
      praticien: this.props.praticien,
      patient: {
        nom: this.props.patient.nom,
        prenom: this.props.patient.prenom,
        naissance: _.isEmpty(this.props.patient.naissance) ? "" : moment(this.props.patient.naissance).format("DD/MM/YYYY"),
        nir: this.props.patient.nir
      },
      devis: this.props.devis
    };
    return (
      <React.Fragment>
        {_.isEmpty(this.state.data) || _.isEmpty(this.props.patient)
          ? null
          : <CKEditor
              onBeforeLoad={editor => {
                // https://github.com/ckeditor/ckeditor4-react/issues/57#issuecomment-520377696
                editor.disableAutoInline = true 
              }}
              //data={this.state.data}
              data={Mustache.render(this.state.data, dataObject)}
              onChange={e => {
                this.setState({ data: e.editor.getData() });
              }}
            />
        }
      </React.Fragment>
    );
  }
}
