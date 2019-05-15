# CCAM

## Code
Composant pour la recherche des actes en CCAM. Retourne la liste des actes sous forme d'un tableau d'objets JSON.
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| executant | string | Limiter la recherche aux seuls actes d'une profession de santé. Exemple : D1(dentistes), SF(sages-femmes) |
| limit | number | Valeur de pagination |
| localisation | string | Limiter la recherche aux actes concernant les dents renseignées selon la norme internationale ISO-3950, sans séparateur entre les numéros des dents (par exemple localisation=1121 pour les deux incisives centrales maxillaires ou localisation=18 pour la dent de sagesse maxillaire droite) |
| onSelection | func | Callback à la sélection d'un acte |

## Detail
Détail d'un acte tarifé
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| detail | object | Objet contenant le détail d'un acte. Toutes les informations sur un acte tarifé, la date, l'activité, la grille de tarification, les modificateurs appliqués, la phase et le tarif. |

## Fiche
Composant de présentation d'une fiche d'un acte. Celui-ci utilise le composant de Tarification
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| codActe | string | Code de l'acte CCAM, par défaut "" |
| codActivite | string | Code de l'activité, par défaut "1" |
| codDom | number | Code du DOM, par défaut c'est la métropole. Code 0 |
| codGrille | number | Code grille, par défaut 0 |
| codPhase | number | Code phase, par défaut 0 |
| date | string | Date de la tarification de l'acte, au format ISO. Par défaut la date du jour |
| modificateurs | string | Modificateurs appliqués à l'acte, par défaut une chaîne de caractères vide |

## Search
Composant pour la recherche des actes en CCAM (par code CCAM ou mot-clé). Retourne la liste des actes sous forme d'un tableau d'objets JSON.
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| executant | string | Limiter la recherche aux seuls actes d'une profession de santé. Exemple : D1(dentistes), SF(sages-femmes) |
| limit | number | Valeur de pagination |
| localisation | string | Limiter la recherche aux actes concernant les dents renseignées selon la norme internationale ISO-3950, sans séparateur entre les numéros des dents (par exemple localisation=1121 pour les deux incisives centrales maxillaires ou localisation=18 pour la dent de sagesse maxillaire droite) |
| onClear | func | Callback d'une ràz |
| onLoadActes | func | Callback résultat de la recherche |
| onSelectionChange | func | Callback pour retourner l'acte sélectionné |
| search | object | Documentation semantic-ui-react [Search](https://react.semantic-ui.com/modules/search) |
| searchInputLength | number | Nombre minimum de caractères pour déclencher la recherche d'actes |

## Table
Composant montrant sous forme d'un tableau les actes obtenus après une recherche par mot clé.
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| actes | array | Actes CCAM à afficher |
| headers | array | En-têtes du tableau |
| informations | object | Se référer à la documentation RHAPI sur la pagination |
| onSelection | func | Callback à la sélection d'un acte |
| onPageSelect | func | Callback changement de page |
| showPagination | bool | Afficher les options de paginations, par défaut "false" |
| table | object | Documentation semantic-ui-react [Table](https://react.semantic-ui.com/collections/table) |
| btnFirstContent | string | Texte du bouton pour aller à la première page, par défaut "" |
| btnLastContent | string | Texte du bouton pour aller à la dernière page, par défaut "" |
| btnMoreContent | string | Texte du bouton pour afficher plus de résutats, par défaut "Plus de résultats" |
| btnNextContent | string | Texte du bouton pour aller à la page suivante, par défaut "" |
| btnPrevContent | string | Texte du bouton pour aller à la page précédente, par défaut "" |
| btnFirstIcon | string | Icon semantic du bouton pour aller à la première page, par défaut "fast backward" |
| btnLastIcon | string | Icon semantic du bouton pour aller à la dernière page, par défaut "fast forward" |
| btnMoreIcon | string | Icon semantic du bouton pour afficher plus de résultats, par défaut "" |
| btnNextIcon | string | Icon semantic du bouton pour aller à la page suivante, par défaut "step forward" |
| btnPrevIcon | string | Icon semantic du bouton pour aller à la page précédente, par défaut "step backward" |
| btnFirst | object | Props semantic du bouton pour aller à la première page, par défaut un objet vide "{}" |
| btnLast | object | Props semantic du bouton pour aller à la dernière page, par défaut un objet vide "{}" |
| btnNext | object | Props semantic du bouton pour aller à la page suivante, par défaut un objet vide "{}" |
| btnPrev | object | Props semantic du bouton pour aller à la page précédente, par défaut un objet vide "{}" |
| btnMore | object | Props semantic du bouton pour afficher plus de résultats, par défaut un objet vide "{}" |
| mode | string | mode de pagination 'pages' ou 'more', par défaut "pages" |

## Tarification
Composant de facturation d'un acte CCAM
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| codActe | string | Code de l'acte CCAM |
| codActivite | string | Code de l'activité, par défaut "1" |
| codDom | number | Code du DOM, par défaut c'est la métropole. Code 0 |
| codGrille | number | Code grille, par défaut 0 |
| codPhase | number | Code phase, par défaut 0 |
| date | string | Date de la tarification de l'acte, au format ISO. Par défaut la date du jour |
| dynamic | bool | Affichage de l'interface dynamique de tarification, par défaut "false" |
| error | string, func | Message d'erreur ou Callback acte non tarifé à la date donnée |
| hidden | bool | Cacher l'interface du composant de tarification |
| modificateurs | string | Modificateurs appliqués à l'acte, par défaut une chaîne de caractères vide |
| success | func | Callback succès de la tarification |
