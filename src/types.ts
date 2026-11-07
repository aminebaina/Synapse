export type ConceptCategory = 
  | 'math-logic'
  | 'systems-memory'
  | 'linear-structures'
  | 'algorithms-more';

export type ConceptId = 
  // Mathématiques & Logique Symbolique
  | 'logic-gates'
  | 'modulo-arithmetic'
  | 'sets-venn'
  // Systèmes & Modèle Mémoire
  | 'memory-model'
  | 'binary-hex'
  | 'sequential-exec'
  | 'loop-control'
  | 'call-stack'
  // Structures Linéaires & Algorithmique de Base
  | 'linear-search'
  | 'find-extrema'
  | 'linked-list'
  | 'stack'
  | 'queue'
  // Notions Complémentaires
  | 'binary-search'
  | 'bubble-sort'
  | 'big-o';

export interface Concept {
  id: ConceptId;
  title: string;
  category: ConceptCategory;
  categoryName: string;
  difficulty: 'Niveau 1 · Débutant' | 'Niveau 1 · Fondamental' | 'Niveau 2 · Intermédiaire';
  timeEstimate: string;
  description: string;
  iconName: string;
  tagline: string;
  badge?: string;
}

export const CONCEPTS: Concept[] = [
  // ----------------------------------------------------
  // CATÉGORIE 1 : Mathématiques & Logique Symbolique
  // ----------------------------------------------------
  {
    id: 'logic-gates',
    title: 'Algèbre de Boole & Tables de Vérité',
    category: 'math-logic',
    categoryName: '1. Mathématiques & Logique Symbolique',
    difficulty: 'Niveau 1 · Fondamental',
    timeEstimate: '4 min',
    description: 'Propositions vraies/fausses (1/0), connecteurs ET (conjonction), OU (disjonction), NON (négation) et XOR.',
    iconName: 'ToggleRight',
    tagline: 'Logique exacte · Vrai/Faux & Tables de vérité',
    badge: 'Commencer ici',
  },
  {
    id: 'modulo-arithmetic',
    title: 'Arithmétique Modulo & Ensembles Finis',
    category: 'math-logic',
    categoryName: '1. Mathématiques & Logique Symbolique',
    difficulty: 'Niveau 1 · Fondamental',
    timeEstimate: '5 min',
    description: 'L’analogie de l’horloge circulaire : le reste de la division euclidienne (a mod n) et les domaines finis.',
    iconName: 'Clock',
    tagline: 'Mathématiques · Horloge & Reste euclidien',
    badge: 'Niveau 1',
  },
  {
    id: 'sets-venn',
    title: 'Ensembles & Diagrammes de Venn',
    category: 'math-logic',
    categoryName: '1. Mathématiques & Logique Symbolique',
    difficulty: 'Niveau 1 · Fondamental',
    timeEstimate: '4 min',
    description: 'Les opérations sur les ensembles finis : Union (A ∪ B), Intersection (A ∩ B), Complémentaire et appartenance (∈).',
    iconName: 'CircleDot',
    tagline: 'Mathématiques · Union, Intersection & Venn',
    badge: 'Niveau 1',
  },

  // ----------------------------------------------------
  // CATÉGORIE 2 : Systèmes & Modèle Mémoire
  // ----------------------------------------------------
  {
    id: 'memory-model',
    title: 'Variables, Adresses & Pointeurs',
    category: 'systems-memory',
    categoryName: '2. Systèmes & Modèle Mémoire',
    difficulty: 'Niveau 1 · Fondamental',
    timeEstimate: '6 min',
    description: 'Une variable n’est pas magique : c’est une boîte avec un nom, un type, une adresse mémoire (ex: 0x04) et une valeur.',
    iconName: 'Cpu',
    tagline: 'Systèmes · RAM, Adresses physiques & Pointeurs',
    badge: 'Niveau 1',
  },
  {
    id: 'binary-hex',
    title: 'Codage Binaire & Hexadécimal',
    category: 'systems-memory',
    categoryName: '2. Systèmes & Modèle Mémoire',
    difficulty: 'Niveau 1 · Fondamental',
    timeEstimate: '5 min',
    description: 'Comment la RAM stocke concrètement les nombres : les 8 bits d’un octet (128 à 1) et leur correspondance directe en hexadécimal (0x..).',
    iconName: 'Binary',
    tagline: 'Codage · 8 bits, Puissances de 2 & Base 16',
    badge: 'Niveau 1',
  },
  {
    id: 'sequential-exec',
    title: 'Exécution Séquentielle & if / else',
    category: 'systems-memory',
    categoryName: '2. Systèmes & Modèle Mémoire',
    difficulty: 'Niveau 1 · Fondamental',
    timeEstimate: '5 min',
    description: 'Le Pont Pédagogique : la mise à jour séquentielle de l’état mémoire et l’évaluation booléenne des conditions.',
    iconName: 'GitCommit',
    tagline: 'Le Pont · État mémoire & Branchements',
    badge: 'Le Pont',
  },
  {
    id: 'loop-control',
    title: 'Les Boucles (while / for) & Accumulateur',
    category: 'systems-memory',
    categoryName: '2. Systèmes & Modèle Mémoire',
    difficulty: 'Niveau 1 · Fondamental',
    timeEstimate: '5 min',
    description: 'La trilogie de Böhm-Jacopini complète : répéter un bloc avec un compteur d’itérations (i) et un accumulateur de somme.',
    iconName: 'Repeat',
    tagline: 'Böhm-Jacopini · Itérations & Invariant de boucle',
    badge: 'Niveau 1',
  },
  {
    id: 'call-stack',
    title: 'Fonctions & Pile d’Appels (Call Stack)',
    category: 'systems-memory',
    categoryName: '2. Systèmes & Modèle Mémoire',
    difficulty: 'Niveau 1 · Fondamental',
    timeEstimate: '6 min',
    description: 'Comment le processeur exécute les fonctions : empiler un cadre (Stack Frame) avec ses paramètres, puis le détruire au return.',
    iconName: 'Workflow',
    tagline: 'Systèmes · Cadres mémoire & Portée (Scope)',
    badge: 'Niveau 1',
  },

  // ----------------------------------------------------
  // CATÉGORIE 3 : Structures Linéaires & Algorithmique de Base
  // ----------------------------------------------------
  {
    id: 'linear-search',
    title: 'Recherche Linéaire',
    category: 'linear-structures',
    categoryName: '3. Structures Linéaires & Algorithmique',
    difficulty: 'Niveau 1 · Débutant',
    timeEstimate: '5 min',
    description: 'Parcours séquentiel case par case du tableau de gauche à droite jusqu’à trouver la cible.',
    iconName: 'Search',
    tagline: 'O(n) · Inspection séquentielle pas-à-pas',
    badge: 'Niveau 1',
  },
  {
    id: 'find-extrema',
    title: 'Recherche du Maximum / Minimum',
    category: 'linear-structures',
    categoryName: '3. Structures Linéaires & Algorithmique',
    difficulty: 'Niveau 1 · Débutant',
    timeEstimate: '5 min',
    description: 'Trouver le plus grand ou plus petit élément : le trophée du maximum conservé et mis à jour lors du parcours.',
    iconName: 'Trophy',
    tagline: 'Algorithmique · Extrema & Comparaisons',
    badge: 'Niveau 1',
  },
  {
    id: 'linked-list',
    title: 'Liste Chaînée vs Tableau',
    category: 'linear-structures',
    categoryName: '3. Structures Linéaires & Algorithmique',
    difficulty: 'Niveau 1 · Fondamental',
    timeEstimate: '6 min',
    description: 'Tableau (cases mémoires contiguës) versus Liste chaînée (nœuds éparpillés reliés par un pointeur next).',
    iconName: 'Link',
    tagline: 'Structure · Nœuds & Pointeur next',
    badge: 'Niveau 1',
  },
  {
    id: 'stack',
    title: 'Pile (Stack - LIFO)',
    category: 'linear-structures',
    categoryName: '3. Structures Linéaires & Algorithmique',
    difficulty: 'Niveau 1 · Débutant',
    timeEstimate: '5 min',
    description: 'Dernier Entré, Premier Sorti (LIFO). Les opérations Empiler (push) et Dépiler (pop) agissent au sommet.',
    iconName: 'Layers3',
    tagline: 'LIFO · Push & Pop au sommet',
    badge: 'Niveau 1',
  },
  {
    id: 'queue',
    title: 'File (Queue - FIFO)',
    category: 'linear-structures',
    categoryName: '3. Structures Linéaires & Algorithmique',
    difficulty: 'Niveau 1 · Débutant',
    timeEstimate: '5 min',
    description: 'Premier Entré, Premier Sorti (FIFO). Comme une file d’attente : on entre à l’arrière, on sort à l’avant.',
    iconName: 'Users',
    tagline: 'FIFO · Enfiler à la fin, Défiler au début',
    badge: 'Niveau 1',
  },

  // ----------------------------------------------------
  // CATÉGORIE 4 : Approfondissements
  // ----------------------------------------------------
  {
    id: 'binary-search',
    title: 'Recherche Binaire',
    category: 'algorithms-more',
    categoryName: '4. Pour aller plus loin (Niveau 2)',
    difficulty: 'Niveau 2 · Intermédiaire',
    timeEstimate: '8 min',
    description: 'Recherche dichotomique sur tableau trié en divisant l’espace de recherche par deux à chaque étape.',
    iconName: 'GitFork',
    tagline: 'O(log n) · Division par deux (dichotomie)',
  },
  {
    id: 'bubble-sort',
    title: 'Tri à Bulles',
    category: 'algorithms-more',
    categoryName: '4. Pour aller plus loin (Niveau 2)',
    difficulty: 'Niveau 2 · Intermédiaire',
    timeEstimate: '7 min',
    description: 'Compare et permute les éléments adjacents consécutifs pour faire remonter le plus grand à la fin.',
    iconName: 'ArrowUpDown',
    tagline: 'O(n²) · Permutation de paires adjacentes',
  },
  {
    id: 'big-o',
    title: 'Complexité Grand-O',
    category: 'algorithms-more',
    categoryName: '4. Pour aller plus loin (Niveau 2)',
    difficulty: 'Niveau 2 · Intermédiaire',
    timeEstimate: '10 min',
    description: 'Comparateur visuel des ordres de grandeur : O(1), O(log n), O(n), O(n log n) et O(n²).',
    iconName: 'TrendingUp',
    tagline: 'Analyse asymptotique du temps de calcul',
  },
];
