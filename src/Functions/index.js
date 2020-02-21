import jsPDF from "jspdf";

class Functions {
  PDF = {
    download: string => {
      let doc = new jsPDF();
      doc.fromHTML(string, 15, 5, {});
      doc.save("test.pdf");
    }
  }
}

export default Functions;