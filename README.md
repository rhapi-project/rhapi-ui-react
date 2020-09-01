# rhapi-ui-react

>

[![NPM](https://img.shields.io/npm/v/rhapi-ui-react?color=brightgreen&logo=npm)](https://www.npmjs.com/package/rhapi-ui-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


Les composants de cette bibliothèque sont documentés [ici](https://github.com/rhapi-project/rhapi-ui-react/blob/master/docs/composants.md).

## Installation pour développement et tests sur les exemples

```bash
git clone https://github.com/rhapi-project/rhapi-ui-react.git
```

Pour tester les exemples :

```bash
cd rhapi-ui-react
npm install
npm start
```
Les composants sont distribués dans le répertoire *`rhapi-ui-react/dist`* et leur code source se trouve dans le répertoire *`rhapi-ui-react/src/Components`*.

Vous pouvez consulter le [README-DEV.md](https://github.com/rhapi-project/rhapi-ui-react/blob/master/README.md) une compréhension beaucoup plus approfondie sur la structure du projet. 

## Utilisation dans un projet React

Les librairies [semantic-ui-react](https://react.semantic-ui.com/) et le [client RHAPI](https://github.com/rhapi-project/rhapi-client) sont requis pour ce projet.

A titre d'exemple, nous allons partir sur un projet React créé en utilisant l'outil [create-react-app](https://www.npmjs.com/package/create-react-app). Voir ici le [guide de création d'une application React](https://github.com/facebook/create-react-app#quick-overview).

```bash
npx create-react-app monapplication
cd monapplication
npm install --save semantic-ui-react
npm install --save semantic-ui-css
npm install --save rhapi-client
npm install --save rhapi-ui-react
```

Dans le fichier *`src/App.js`* de notre projet **monapplication** nous allons utiliser les composants **rhapi-ui-react**.

```jsx
import React from 'react';
import { Client } from "rhapi-client";
import { CCAM } from "rhapi-ui-react"; // Importation du groupe de composants CCAM
import "semantic-ui-css/semantic.css";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        {/* Utilisation du composant Search appartenant au groupe CCAM */}
        <CCAM.Search
          client={client}
          onLoadActes={results => console.log(results)}
        />
      </React.Fragment>
    );
  }
}

export default App;
```

Cet exemple montre une utilisation simple du composant **CCAM.Search** pour la recherche d'un acte en CCAM.

Ci-dessous un exemple de recherche d'actes en CCAM et affichage du résultat à l'aide du composant **CCAM.Table** :
```jsx
import React from "react";
import { Client } from "rhapi-client";
import { CCAM } from "rhapi-ui-react";
import { Divider } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

class App extends React.Component {
  state = {
    actes: [],
    informations: {}
  };

  onClearSearch = () => {
    this.setState({ actes: [], informations: {} });
  };

  onLoadActes = obj => {
    this.setState({ actes: obj.results, informations: obj.informations });
  };

  onPageSelect = result => {
    this.setState({
      actes: result.actes,
      informations: result.informations
    });
  };

  render() {
    return (
      <React.Fragment>
        <CCAM.Search
          client={client}
          onClear={this.onClearSearch}
          onLoadActes={this.onLoadActes}
        />
        <Divider hidden={true} />
        <CCAM.Table
          client={client}
          actes={this.state.actes}
          informations={this.state.informations}
          onPageSelect={result => this.onPageSelect(result)}
          showPagination={true}
        />
      </React.Fragment>
    );
  }
}

export default App;
```

Voir plus d'exemples d'utilisation [rhapi-ui-react/exemples](https://github.com/rhapi-project/rhapi-ui-react/tree/master/src/exemples).

## Édition d'un modèle de document

Les modèles utilisés sont des documents `HTML` avec des champs dynamiques qui sont remplis par le moteur de template [Mustache](https://mustache.github.io/). Quelques exemples de l'utilisation de Mustache sont fournis avec sa [documentation](https://github.com/janl/mustache.js/blob/master/README.md).

Une liste des champs qui sont pris en compte dans l'édition d'un modèle :
- Praticien :
    - {{praticien.nom}}
    - {{praticien.prenom}}
    - {{praticien.denomination}}
    - {{praticien.adresse1}}
    - {{praticien.adresse2}}
    - {{praticien.adresse3}}
    - {{praticien.adresse}} : adresses du praticien séparées par des `-` (traits d'union)
    - {{praticien.codePostal}}
    - {{praticien.ville}}
    - {{praticien.telephone}} : un numéro de téléphone de bureau
    - {{praticien.telBureau}}
    - {{praticien.telDomicile}}
    - {{praticien.telMobile}}
    - {{praticien.email}}
    - {{praticien.organisation}}
    - {{praticien.specialite}} : `non traité`
    - {{praticien.titres}} : `non traité`
    - {{praticien.adeli}} : `non traité`
    - {{praticien.rpps}} : `non traité`
    - {{praticien.siret}} : `non traité`
    - {{praticien.finess}} : `non traité`

- Patient :
    - {{patient.nom}}
    - {{patient.nomMinus}} : nom du patient écrit en minuscule
    - {{patient.prenom}}
    - {{patient.prenomMinus}} : prénom du patient écrit en minuscule
    - {{patient.denomination}} : nom et prénom du patient
    - {{patient.civilite}}
    - {{patient.adresse1}}
    - {{patient.adresse2}}
    - {{patient.adresse3}}
    - {{patient.adresse}} : adresses du patient séparées par des `-` (traits d'union)
    - {{patient.codePostal}}
    - {{patient.ville}}
    - {{patient.ipp1}}
    - {{patient.ipp2}}
    - {{patient.nir}}
    - {{patient.naissance}}
    - {{patient.telBureau}}
    - {{patient.telDomicile}}
    - {{patient.telMobile}}
    - {{patient.solde}} : `non traité`
    - {{patient.dernierActe}} : `non traité`
    - {{patient.dernierActeEnLettres}} : `non traité`

- Actes : Une liste d'actes est entourée comme suit {{#actes}} `<LA_LISTE_ICI>` {{/actes}}. Ci-dessous, la description de chaque acte :
    - {{acte.date}}
    - {{acte.localisation}}
    - {{acte.lettre}}
    - {{acte.cotation}}
    - {{acte.description}}
    - {{acte.montant}}

- Rendez-vous d'un patient
    - {{patientRdv.precedentRdv}}
    - {{patientRdv.precedentRdvEnLettres}}
    - {{patientRdv.prochainRdv}}
    - {{patientRdv.prochainRdvEnLettres}}
    - {{patientRdv.precedentsRdv}}
    - {{patientRdv.prochainsRdv}}
    - {{patientRdv.precedentsRdvEnLettres}}
    - {{patientRdv.prochainsRdvEnLettres}}

- Nombre de saisies (pour un devis) maximum par page :
    - {{saisiesMaxLignesParPage_`N`}} : N est un nombre entier

- Les blocs de saisies paginables sur un devis sont entourés comme suit {{#blocTraitements}}{{/blocTraitements}}

- Bloc des saisies d'un devis {{#saisies}}`<LISTE_DES_SAISIES_ICI>`{{/saisies}}. Ci-dessous, la description de chaque saisie :
    - {{localisation}}
    - {{code}}
    - {{description}}
    - les autres champs possibles ne sont pas encore traités

## License

[Licence MIT ©](https://github.com/rhapi-project/rhapi-ui-react/blob/master/LICENSE)
