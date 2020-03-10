import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import ListeDocument from "./ListeDocument";
import { Button } from "semantic-ui-react";

const propDefs = {
  description: "Liste des documents d'un patient (archives)",
  example: "Tableau",
  propDocs: {
    idPatient:
      "ID du patient. Si idPatient = 0, le document est partagé par tous les patients (ex. un modèle de document)"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idPatient: PropTypes.number
  }
};

export default class DocumentArchives extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    idPatient: null
  };

  state = {
    documents: []
  };

  componentDidMount() {
    this.reload();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.idPatient !== prevProps.idPatient) {
      this.reload();
    }
  }

  reload = () => {
    let params = {};

    if (!this.props.idPatient) {
      _.set(params, "q1", "AND,idPatient,Equal,0");
      _.set(params, "q2", "AND,mimeType,NotLike,text/x-html-template");
    } else {
      _.set(params, "q1", "AND,idPatient,Equal," + this.props.idPatient);
    }

    _.set(params, "exfields", "document");

    this.props.client.Documents.readAll(
      params,
      result => {
        this.setState({
          documents: result.results
        });
      },
      error => {}
    );
  };

  onDocumentClick = id => {
    // l'id du document en paramètre sur un click
  };

  onDocumentDoubleClick = id => {
    // l'id du document en paramètre sur un double click => téléchargement du document
    this.props.client.Documents.read(
      id,
      {},
      result => {
        if (!_.startsWith(result.mimeType, "text/")) {
          let a = document.createElement("a");
          a.href = result.document;
          a.download = result.fileName;
          a.click();
        }
      },
      error => {}
    );
  };

  onSelectionChange = documents => {
    // array des id des documents en paramètre sur une sélection multiple
  };

  onActionClick = (id, action) => {
    if (action === "supprimer") {
      this.props.client.Documents.destroy(
        id,
        result => {
          this.reload();
        },
        error => {}
      );
    }
  };

  createDocument = (fileName, mimeType, document) => {
    this.props.client.Documents.create(
      {
        fileName: fileName,
        idPatient: this.props.idPatient,
        mimeType: mimeType,
        document: document
      },
      result => {
        this.props.client.Actes.create(
          {
            code: "#DOC_" + _.toUpper(result.mimeType.split("/")[1]),
            etat: 0,
            idPatient: this.props.idPatient,
            description: result.fileName,
            idDocument: result.id
          },
          res => {
            this.reload();
          },
          err => {}
        );
      },
      error => {}
    );
  };

  importer = event => {
    if (_.get(event.target.files, "length") !== 0) {
      let file = _.get(event.target.files, "0");
      let fileReader = new FileReader();
      if (_.split(file.type, "/")[0] !== "text") {
        // conversion en base64
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          this.createDocument(file.name, file.type, fileReader.result);
        };
      } else {
        fileReader.readAsText(file);
        fileReader.onload = e => {
          this.createDocument(file.name, file.type, e.target.result);
        };
        fileReader.onerror = () => {
          return;
        };
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <ListeDocument
          documents={this.state.documents}
          onDocumentClick={this.onDocumentClick}
          onDocumentDoubleClick={this.onDocumentDoubleClick}
          onSelectionChange={this.onSelectionChange}
          onActionClick={this.onActionClick}
          actions={[
            {
              icon: "question circle",
              text: "Autre action",
              action: id => this.onActionClick(id, "autre action")
            }
          ]}
        />
        <Button
          content="Importer"
          onClick={() => {
            document.getElementById("file").click();
          }}
        />

        {/* upload d'un document */}
        <input id="file" type="file" hidden={true} onChange={this.importer} />
      </React.Fragment>
    );
  }
}
