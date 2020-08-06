import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
//import { uploadFile } from "../lib/Helpers";

const propDefs = {
  description: "Importation d'une image",
  example: "",
  propDocs: {
    idPatient: "identifiant du patient à qui appartient l'image",
    onImportation: "callback à la fin de l'importation d'une image"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idPatient: PropTypes.number,
    onImportation: PropTypes.func
  }
};

export default class Importation extends React.Component {
  static propTypes = propDefs.propTypes;

  state = {
    isDragging: false
  };

  // La création des images avec la l'option base64 ne fonctionne pas,
  // une erreur est retournée systématiquement par le serveur
  // - le fichier ne correspond pas à un fichier image
  // - la taille de l'image dépasse 1 Mo.

  /*uploadImage = () => {
    uploadFile(
      event,
      (file, fileReader) => {
        console.log(file);
        console.log(fileReader.result);
        this.props.client.Images.create(
          {
            //idPatient: this.props.idPatient,
            image: fileReader.result,
            fileName: file.name,
            //mimeType: file.type
          },
          result => {
            console.log(result);
          },
          error => {
            console.log(error);
          }
        );
      },
      () => {
        return;
      }
    );
  };*/

  handleDrop = event => {
    event.preventDefault();
    event.stopPropagation();
    console.log("test drop file");
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
  /*handleDrop2 = event => {
    console.log("drop handler");
    event.stopPropagation();
    event.preventDefault();
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === 'file') {
          let file = event.dataTransfer.items[i].getAsFile();
          console.log('... file[' + i + '].name = ' + file.name);
          console.log(file);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < event.dataTransfer.files.length; i++) {
        console.log('... file[' + i + '].name = ' + event.dataTransfer.files[i].name);
      }
    }
  };*/

  render() {
    return (
      <React.Fragment>
        <Segment
          placeholder={true}
          onDragOver={e => {
            e.preventDefault();
            e.stopPropagation();
            this.setState({ isDragging: true });
          }}
          onDragLeave={e => {
            e.preventDefault();
            e.stopPropagation();
            this.setState({ isDragging: false });
          }}
          onDrop={this.handleDrop}
        >
          <Header icon={true}>
            <Icon name={this.state.isDragging ? "upload" : "photo"} />
            Déposez une image ici ou utilisez le bouton "Ajouter"
          </Header>
          <Button
            disabled={
              !_.isNumber(this.props.idPatient) || this.state.isDragging
            }
            content="Ajouter"
            onClick={() => document.getElementById("imageToUpload").click()}
            //onClick={this.uploadImage}
          />
        </Segment>

        {/* TODO :  gérer le cas où on a une erreur au submit du formulaire */}
        {/* implémenter le DRAG & DROP dans la zone du Segment */}

        <form
          id="formulaire-image"
          action={this.props.client.baseUrl + "/Images"}
          method="post"
          encType="multipart/form-data"
          target="result-frame"
        >
          <input
            id="imageToUpload"
            name="image"
            type="file"
            hidden={true}
            onChange={e => {
              if (e.target.files.length !== 0) {
                document.getElementById("formulaire-image").submit();
              }
            }}
          />
          <input
            name="idPatient"
            type="number"
            value={this.props.idPatient}
            readOnly={true}
            style={{ display: "none" }}
          />
        </form>

        <iframe
          id="result-frame"
          name="result-frame"
          title="resultat"
          style={{ display: "none" }}
          onLoad={() => {
            //console.log(event);
            if (!_.isEmpty(document.getElementById("imageToUpload").value)) {
              document.getElementById("imageToUpload").value = null;
              if (this.props.onImportation) {
                this.props.onImportation();
              }
            }
          }}
        />
      </React.Fragment>
    );
  }
}
