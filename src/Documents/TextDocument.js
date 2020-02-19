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
    autoFilling: "remplissage automatique des champs dynamiques",
    document: "contenu d'un document au format texte",
    mode: "mode d'édition du document : html|plain",
    onEdit: "Callback à la modification du texte"
  },
  propTypes: {
    autoFilling: PropTypes.bool,
    document: PropTypes.string,
    mode: PropTypes.string,
    onEdit: PropTypes.func
  }
};

// custom CKEditor toolbar
// https://ckeditor.com/latest/samples/toolbarconfigurator/index.html#advanced

/*const toolbarConfig = [
    { name: 'document', items: [ 'Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates' ] },
		{ name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
		{ name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
		{ name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
		'/',
		{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
		{ name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
		{ name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
		{ name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
		'/',
		{ name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
		{ name: 'colors', items: [ 'TextColor', 'BGColor' ] },
		{ name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
		{ name: 'about', items: [ 'About' ] }
];*/

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
                data={
                  this.props.autoFilling
                    ? Mustache.render(this.props.document, {})
                    : this.props.document
                }
                onChange={e => {
                  if (this.props.onEdit) {
                    this.props.onEdit(e.editor.getData());
                  }
                }}
                /*config={{
                  toolbar: toolbarConfig
                }}*/
              />
            : null
        }
        
      </React.Fragment>
    );
  }
}
