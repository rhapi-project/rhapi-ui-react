import React from "react";

import { Documents } from "rhapi-ui-react";

export default class DocumentsPDFDocument extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Documents.PDFDocument />
      </React.Fragment>
    )
  }
}