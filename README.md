# rhapi-ui-react

>

[![NPM](https://img.shields.io/npm/v/rhapi-ccam.svg)](https://www.npmjs.com/package/rhapi-ui-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Installation et test de la bibliothèque

```bash
git clone https://github.com/rhapi-project/rhapi-ui-react.git
```

Après avoir téléchargé la bibliothèque **rhapi-ui-react**, vous pouvez tester les exemples de son utilisation comme suit : 
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

## Installation dans un projet

```bash
npm install --save rhapi-ui-react
```

## Utilisation

Les composants **rhapi-ui-react** utilisent le client **rhapi-client** qui doit être préalablement installé dans le projet.

Exemple d'utilisation du composant **CCAM.Search** pour la recherche d'une acte en CCAM : 

```jsx
import React from "react";
import { Client } from "rhapi-client";
import { CCAM } from "rhapi-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class RechercheActe extends React.Component {
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
```

Autres exemples d'utilisation dans le répertoire ***rhapi-ui-react/exemples*** ou [sur ce lien](https://github.com/rhapi-project/rhapi-ui-react/tree/master/exemples).

## License

MIT © [](https://github.com/)
