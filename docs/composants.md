# CCAM
# Actes
# Shared

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
La recherche n'est pas effectuée si la date ou la localisation sont NULL.
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| date | string | Date effective de l'acte au format ISO. Par défaut date du jour |
| executant | string | Limiter la recherche aux seuls actes d'une profession de santé. Exemple : D1(dentistes), SF(sages-femmes) |
| limit | number | Valeur de pagination |
| localisation | string | Limiter la recherche aux actes concernant les dents renseignées selon la norme internationale ISO-3950, sans séparateur entre les numéros des dents (par exemple localisation=1121 pour les deux incisives centrales maxillaires ou localisation=18 pour la dent de sagesse maxillaire droite) |
| onClear | func | Callback d'une ràz |
| onLoadActes | func | Callback résultat de la recherche |
| onSelectionChange | func | Callback pour retourner l'acte sélectionné |
| search | object | Documentation semantic-ui-react [Search](https://react.semantic-ui.com/modules/search) |
| searchInputLength | number | Nombre minimum de caractères pour déclencher la recherche d'actes |

## SaisieDentaire
Composant correspondant à une ligne du tableau de saisie des actes pour les dentistes
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| index | number | Indice de la ligne |
| actions | array | Liste d'actions à effectuer (en plus des actions par défaut) |
| code | string | Code de l'Acte sélectionné |
| cotation | number | Cotation/coefficient applicable au code (significatif uniquement en NGAP, 0 si non significatif) |
| description | string | Description de l'acte |
| date | string | Date effective de l'acte au format ISO. Par défaut date du jour |
| localisation | string | Liste des dents sélectionnées, séparées par des espaces. Par défaut "" |
| modificateurs | string | Modificateurs appliqués à l'acte sélectionné. Par défaut "" |
| qualificatifs | string | Les qualificatifs |
| disabled | bool | Désactivation de la ligne |
| montant | number | Le moment pour cet acte |
| onClick | func | Callback au clic sur une ligne |
| onDelete | func | Callback à la suppression de la ligne |
| onDuplicate | func | Callback à la duplication de la ligne |
| onEdit | func | Callback action de recherche en CCAM |
| onInsertion | func | Callback à l'insertion d'un nouvel acte |

## Actions
Menu d'actions à effectuer
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| actions | array | Tableau contenant une liste d'actions |
| dropdown | object | Documentation semantic-ui-react [Dropdown](https://react.semantic-ui.com/modules/dropdown) |
| id | any | Identifiant de la ligne sur laquelle une action est effectuée |

## DateRange
Période, début et fin d'une période
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| open | bool | Ouverture de la modal |
| startAt | string | Date de début de la période. Par défaut la date du jour. |
| endAt | string | Date de fin de la période. Par défaut une semaine après la date du jour. |
| onRangeChange | func | Callback au changement de la période |
| onClose | func | Callback à la fermeture de la modal |

## Montant
Input de saisie d'un montant au format français
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| input | object | Documentation semantic-ui-react [Input](https://react.semantic-ui.com/elements/input) |
| montant | number | Montant affiché |
| onChange | func | Callback au changement du montant |

## Periode
Période, début et fin d'une période
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| startYear | number | La première année qui sera affichée. Par défaut l'année en cours |
| onPeriodeChange | func | Callback au changement de la période. C'est une fonction qui prend 2 paramètres, début et fin de la période (inclus).
Les valeurs de ces paramètres sont NULL si la durée est indéterminée. |

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

## Saisie
Tableau de saisie des actes pour les dentistes
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| idActe | any, isRequired | Identifiant de l'acte principal |
| lignes | number | Nombre de lignes à afficher pour ce tableau. Par défaut 5 |
| codActivite | string | Code de l'activité, par défaut "1" |
| codDom | number | Code du DOM, par défaut c'est la métropole. Code 0 |
| codGrille | number | Code grille, par défaut 0 |
| codPhase | number | Code phase, par défaut 0 |
| executant | string | Code d'une profession de santé. Exemple : D1(dentistes), SF(sages-femmes) |
| specialite | number | Code spécialité du praticien |
| onError | func | Callback en cas d'erreur |
| actions | array | Liste d'actions à effectuer (en plus des actions par défaut) |

## Localisations
Grille de saisie des localisations dentaires
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| dents | string | Liste des dents sélectionnées, séparées par des espaces. Par défaut "" |
| modal | object | Documentation semantic-ui-react [Modal](https://react.semantic-ui.com/modules/modal) |
| onSelection | func | Callback à la selection d'une liste de dents |

## ModalSearch
Ce composant est une modal Semantic de recherche d'un acte. Il intègre un date picker, les composants CCAM.Search, CCAM.Table et Shared.Localisations
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| code | string | Code de l'acte CCAM sélectionné. Par défaut "" |
| codActivite | string | Code de l'activité, par défaut "1" |
| codDom | number | Code du DOM, par défaut c'est la métropole. Code 0 |
| codGrille | number | Code grille, par défaut 0 |
| codPhase | number | Code phase, par défaut 0 |
| cotation | number | Cotation/coefficient applicable au code (significatif uniquement en NGAP, 0 si non significatif) |
| date | string | Date effective de l'acte au format ISO. Par défaut date du jour |
| description | string | Description de l'acte sélectionné. Par défaut "" |
| localisation | string | Liste des dents sélectionnées, séparées par des espaces. Par défaut "" |
| executant | string | Limiter la recherche aux seuls actes d'une profession de santé. Exemple : D1(dentistes), SF(sages-femmes) |
| specialite | number | Code spécialité du praticien |
| localisationPicker | bool | Affichage de la grille de saisie des localisations dentaires |
| open | bool | Ouverture de la modal |
| onClose | func | Callback à la fermeture de la modal |
| rowIndex | number | Indice de la ligne sur laquelle on a cliqué dans le tableau de saisie des actes |
| ngap | array | Liste des codes NGAP |
| allModificateurs | array | Tous les modificateurs (obtenus avec une requête CCAM contextes) |
| modificateurs | string | Modificateurs appliqués à l'acte sélectionné. Par défaut "" |
| qualificatifs | string | Qualificatifs |
| montant | number | Montant de l'acte sélectionné |
| onValidation | func | Callback à la validation |

## Historique
Historique des actes d'un patient
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| idPatient | number | Id du patient, par défaut 0 (Aucun patient) |
| onActeClick | func | Retourne en paramètre l'id de l'acte sélectionné sur un click |
| onActeDoubleClick | func | Retourne en paramètre l'id l'acte sélectionné sur un double click |
| onSelectionChange | func | Retourne en paramètre la liste des id des actes sélectionnés (multi-sélection possible par CTRL+click) |
| actions | array | Tableau d'objet contenant des actions à effectuer (en plus des actions par défaut). Exemple [{icon:"add",text:"Ajouter",action:fonction de l'action ajouter}] |
| startAt | string | Filtre sur le début d'une période (incluse). Par défaut "" |
| endAt | string | Filtre sur la fin d'une période (incluse). Par défaut "" |
| localisation | string | Filtre sur une liste de dents sélectionnées, séparées par des espaces. Par défaut "" |
| table | object | Documentation semantic-ui-react [Table](https://react.semantic-ui.com/collections/table) |
| limit | number | Valeur de pagination, par défaut 5 |
| sort | string | Le champs sur lequel le tri va être effectué. Par défaut, le tri se fait sur la date (doneAt) |
| order | string | Le tri est ascendant (ASC) ou descendant (DESC). Par défaut, le tri est descendant (DESC) |
| showPagination | bool | Affiche les options de paginations, par défaut "true" |
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
| mode | string | Mode de pagination "pages" ou "more", par défaut "pages" |
