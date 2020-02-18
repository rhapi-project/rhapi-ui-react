import React from "react";
import PropTypes from "prop-types";
import {
  Form,
  TextArea
} from "semantic-ui-react";

import _ from "lodash";
//import moment from "moment";

import Mustache from "mustache"; // moteur de template

// CKeditor 4
import CKEditor from "ckeditor4-react";

const propDefs = {
  description: "Manupulation d'un document sous format texte",
  example: "",
  propDocs: {
    document: "Contenu d'un document au format texte",
    mode: "mode d'édition du document : html|plain",
    onEdit: "Callback à la modification du texte"
  },
  propTypes: {
    document: PropTypes.string,
    mode: PropTypes.string,
    onEdit: PropTypes.func
  }
}

export default class TextDocument extends React.Component {
  static propTypes = propDefs.propTypes;
  //static defaultProps = {};
  
  /*state = {
    document: ""
  };*/

  /*componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data) {
      this.setState({ data: this.props.data });
    }
  };*/

  componentDidMount() {
    this.setState({ document: this.props.document });
  }

  render() {
    //console.log(this.props.patient);
    /*console.log(this.props.devis);
    let dataObject = {
      praticien: this.props.praticien,
      patient: {
        nom: this.props.patient.nom,
        prenom: this.props.patient.prenom,
        naissance: _.isEmpty(this.props.patient.naissance) ? "" : moment(this.props.patient.naissance).format("DD/MM/YYYY"),
        nir: this.props.patient.nir
      },
      devis: this.props.devis
    };*/
    return (
      <React.Fragment>
        {this.props.mode === "plain"
          ? <Form>
              <TextArea
                value={this.props.document}
                rows={6}
                onChange={(e, d) => {
                  if (this.props.onEdit) {
                    this.props.onEdit(d.value);
                  }
                }}
              />
            </Form>
          : this.props.mode === "html"
            ? <CKEditor
                onBeforeLoad={editor => {
                  // https://github.com/ckeditor/ckeditor4-react/issues/57#issuecomment-520377696
                  editor.disableAutoInline = true 
                }}
                data={Mustache.render(this.props.document, {})}
                onChange={e => {
                  if (this.props.onEdit) {
                    this.props.onEdit(e.editor.getData());
                  }
                }}
              />
            : null
        }
        
      </React.Fragment>
    );
  }
}
