
> rhapi-ui-react@0.1.0 docs /Users/zumatec/Desktop/rhapi-ui-react
> node scripts/makedocs.js

##CcamSearch
Composant pour la recherche des actes en CCAM retourne la liste des actes au format etc...
####Liste des props :
* client (PropTypes, any, isRequired) : Documentation générale pour la prop client...
* onClearSearch (PropTypes, func) : callback d'une ràz
* onSelectionChange (PropTypes, func, isRequired) : callback pour retourner les actes sélectionnés
* search (PropTypes, object) : semantic-ui-react [Search](https://react.semantic-ui.com/modules/search)
* searchInputLength (PropTypes, number) : nombre minimum de caractères pour déclencher une requête
