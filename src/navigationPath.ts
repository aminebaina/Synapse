import { ConceptId } from './types';

export interface ProgressionStep {
  currentId: ConceptId;
  order: number;
  prevId: ConceptId | null;
  nextId: ConceptId | null;
  whyNext: string;
  keyTakeaway: string;
}

// Parcours pédagogique linéaire optimal pour un débutant absolu (Niveau 1)
export const LEVEL_1_PATH: ProgressionStep[] = [
  {
    currentId: 'logic-gates',
    order: 1,
    prevId: null,
    nextId: 'binary-hex',
    whyNext: 'Vous maîtrisez le Vrai (1) et le Faux (0) ? Découvrez maintenant comment 8 bits forment concrètement un octet en mémoire et se convertissent en hexadécimal.',
    keyTakeaway: 'Les propositions logiques forment le socle binaire de tout ordinateur.',
  },
  {
    currentId: 'binary-hex',
    order: 2,
    prevId: 'logic-gates',
    nextId: 'memory-model',
    whyNext: 'Maintenant que vous comprenez les octets physiques, explorez la RAM : comment ces octets stockent des variables avec des adresses et des pointeurs.',
    keyTakeaway: 'Tout nombre ou caractère se décompose en 8 bits de puissances de 2.',
  },
  {
    currentId: 'memory-model',
    order: 3,
    prevId: 'binary-hex',
    nextId: 'sequential-exec',
    whyNext: 'Le Pont Pédagogique : voyez comment le processeur exécute le code ligne par ligne et modifie l’état de cette mémoire en évaluant vos conditions booléennes.',
    keyTakeaway: 'Une variable n’est pas magique : c’est une boîte à une adresse mémoire précise.',
  },
  {
    currentId: 'sequential-exec',
    order: 4,
    prevId: 'memory-model',
    nextId: 'loop-control',
    whyNext: 'Vous savez brancher le code avec if/else ? Complétez la trilogie de Böhm-Jacopini en apprenant à répéter des actions grâce aux boucles while/for et à l’accumulateur.',
    keyTakeaway: 'L’exécution séquentielle met à jour l’état mémoire pas-à-pas.',
  },
  {
    currentId: 'loop-control',
    order: 5,
    prevId: 'sequential-exec',
    nextId: 'call-stack',
    whyNext: 'Découvrez comment le processeur orchestre les fonctions et sous-programmes en empilant et dépilant leurs variables dans la Call Stack.',
    keyTakeaway: 'Une boucle repose sur un compteur d’itération et une condition d’arrêt.',
  },
  {
    currentId: 'call-stack',
    order: 6,
    prevId: 'loop-control',
    nextId: 'modulo-arithmetic',
    whyNext: 'Avant d’aborder les conteneurs de données, maîtrisez l’arithmétique modulo : l’outil mathématique universel pour créer des cycles et des index circulaires.',
    keyTakeaway: 'Chaque appel de fonction empile un cadre mémoire libéré dès le return.',
  },
  {
    currentId: 'modulo-arithmetic',
    order: 7,
    prevId: 'call-stack',
    nextId: 'sets-venn',
    whyNext: 'Explorez la théorie des ensembles finis (Union, Intersection, Différence) : la fondation de tout filtrage et tri de données.',
    keyTakeaway: 'Le modulo n ramène tout nombre infini dans un cadran fini [0, n-1].',
  },
  {
    currentId: 'sets-venn',
    order: 8,
    prevId: 'modulo-arithmetic',
    nextId: 'linear-search',
    whyNext: 'Plongez dans l’algorithmique linéaire : commencez par la recherche séquentielle case par case dans un tableau indexé.',
    keyTakeaway: 'Les opérations d’ensembles (A ∪ B, A ∩ B) dictent le filtrage des collections.',
  },
  {
    currentId: 'linear-search',
    order: 9,
    prevId: 'sets-venn',
    nextId: 'find-extrema',
    whyNext: 'Même balayage séquentiel, mais avec un nouveau super-pouvoir : garder en mémoire un champion pour trouver le Maximum ou Minimum.',
    keyTakeaway: 'La recherche linéaire inspecte chaque élément sans rien présumer.',
  },
  {
    currentId: 'find-extrema',
    order: 10,
    prevId: 'linear-search',
    nextId: 'linked-list',
    whyNext: 'Les tableaux occupent des cases mémoires contiguës. Que se passe-t-il si les nœuds sont éparpillés ? Découvrez les Listes Chaînées et leurs pointeurs !',
    keyTakeaway: 'Trouver un extremum nécessite de mettre à jour un champion à chaque pas.',
  },
  {
    currentId: 'linked-list',
    order: 11,
    prevId: 'find-extrema',
    nextId: 'stack',
    whyNext: 'Découvrez la structure LIFO par excellence : la Pile (Stack), cousine directe de la Call Stack avec Push et Pop au sommet.',
    keyTakeaway: 'Les listes chaînées sacrifient l’accès immédiat par indice pour une flexibilité d’insertion.',
  },
  {
    currentId: 'stack',
    order: 12,
    prevId: 'linked-list',
    nextId: 'queue',
    whyNext: 'Après le Dernier Entré Premier Sorti (LIFO), découvrez le Premier Entré Premier Sorti (FIFO) avec la File d’attente (Queue).',
    keyTakeaway: 'La pile impose une discipline stricte : on ne touche qu’au sommet.',
  },
  {
    currentId: 'queue',
    order: 13,
    prevId: 'stack',
    nextId: 'binary-search',
    whyNext: '🎉 FÉLICITATIONS ! Vous avez terminé toutes les briques fondamentales du Niveau 1. Préparez-vous à entrer dans le Niveau 2 avec la Recherche Binaire et la Récursion !',
    keyTakeaway: 'La file garantit l’équité temporelle : premier arrivé, premier servi.',
  },
  // Extension Niveau 2
  {
    currentId: 'binary-search',
    order: 14,
    prevId: 'queue',
    nextId: 'bubble-sort',
    whyNext: 'La recherche binaire exige un tableau trié ! Découvrez comment ordonner les données avec le Tri à Bulles.',
    keyTakeaway: 'Diviser par 2 à chaque étape réduit drastiquement le coût en O(log n).',
  },
  {
    currentId: 'bubble-sort',
    order: 15,
    prevId: 'binary-search',
    nextId: 'big-o',
    whyNext: 'Prenez de la hauteur : mesurez mathématiquement la performance comparée de tous ces algorithmes avec la notation Grand-O.',
    keyTakeaway: 'Comparer et permuter les paires adjacentes permet de faire remonter le plus grand.',
  },
  {
    currentId: 'big-o',
    order: 16,
    prevId: 'bubble-sort',
    nextId: null,
    whyNext: 'Vous avez complété le parcours d’initiation complet !',
    keyTakeaway: 'Le Grand-O décrit comment le temps de calcul grandit quand la taille n explose.',
  },
];

export function getProgression(conceptId: ConceptId): ProgressionStep {
  const found = LEVEL_1_PATH.find((p) => p.currentId === conceptId);
  if (found) return found;

  return {
    currentId: conceptId,
    order: 1,
    prevId: null,
    nextId: 'linear-search',
    whyNext: 'Continuez votre exploration sur les structures linéaires.',
    keyTakeaway: 'Chaque notion s’emboîte dans la suivante.',
  };
}
