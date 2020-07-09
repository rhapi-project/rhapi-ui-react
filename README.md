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

## License

[Licence MIT ©](https://github.com/rhapi-project/rhapi-ui-react/blob/master/LICENSE)
