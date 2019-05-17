# rhapi-ui-react

>

[![NPM](https://img.shields.io/npm/v/rhapi-ccam.svg)](https://www.npmjs.com/package/rhapi-ui-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


Tous les composant de cette bibliothèque sont documentés [ici](https://github.com/rhapi-project/rhapi-ui-react/blob/master/docs/composants.md)

## Installation pour développement et tests sur les exemples

```bash
git clone https://github.com/rhapi-project/rhapi-ui-react.git
```

Pour tester les exemples :

```bash
cd rhapi-ui-react/exemples
npm install
npm start
```
Les composants sont distribués dans le répertoire ***rhapi-ui-react/dist*** et leur code source se trouve dans le répertoire ***rhapi-ui-react/src***.
Pour activer, à chaque modification, la mise à jour automatique des fichiers dans ***rhapi-ui-react/dist*** : 
```bash
cd rhapi-ui-react
npm install
npm start
```

## Utilisation dans un projet React

Les librairies [semantic-ui-react](https://react.semantic-ui.com/) et le [client RHAPI](https://github.com/rhapi-project/rhapi-client) sont requis pour ce projet.

A titre d'exemple, nous allons partir sur un projet React créé en utilisant l'outil [create-react-app](https://www.npmjs.com/package/create-react-app).

```bash
create-react-app reactapp
cd reactapp
npm install --save semantic-ui-react
npm install --save semantic-ui-css
npm install --save rhapi-client
npm install --save rhapi-ui-react
```

Dans le fichier ***src/App.js*** de notre projet **reactapp** nous allons utiliser les composants **rhapi-ui-react**.

```jsx
import React from 'react';
import { Client } from "rhapi-client";
import { CCAM } from "rhapi-ui-react";
import "semantic-ui-css/semantic.css";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
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

Cet exemple montre une utilisation simple du composant **CCAM.Search** pour la recherche d'une acte en CCAM.

Voir plus d'exemples d'utilisation [rhapi-ui-react/exemples](https://github.com/rhapi-project/rhapi-ui-react/tree/master/exemples).

## License

MIT © [](https://github.com/)
