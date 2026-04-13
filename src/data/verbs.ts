import type { ParticipleEnding, Verb } from "../types";

export const VERBS: Verb[] = [
  // -é group
  { infinitive: "parler", participle: "parlé", translation: "to speak", ending: "-é", auxiliary: "avoir", irregular: false },
  { infinitive: "manger", participle: "mangé", translation: "to eat", ending: "-é", auxiliary: "avoir", irregular: false },
  { infinitive: "aimer", participle: "aimé", translation: "to love", ending: "-é", auxiliary: "avoir", irregular: false },
  { infinitive: "donner", participle: "donné", translation: "to give", ending: "-é", auxiliary: "avoir", irregular: false },
  { infinitive: "trouver", participle: "trouvé", translation: "to find", ending: "-é", auxiliary: "avoir", irregular: false },
  { infinitive: "passer", participle: "passé", translation: "to pass", ending: "-é", auxiliary: "avoir", irregular: false },
  { infinitive: "regarder", participle: "regardé", translation: "to watch", ending: "-é", auxiliary: "avoir", irregular: false },
  { infinitive: "chanter", participle: "chanté", translation: "to sing", ending: "-é", auxiliary: "avoir", irregular: false },
  { infinitive: "jouer", participle: "joué", translation: "to play", ending: "-é", auxiliary: "avoir", irregular: false },
  { infinitive: "travailler", participle: "travaillé", translation: "to work", ending: "-é", auxiliary: "avoir", irregular: false },
  { infinitive: "commencer", participle: "commencé", translation: "to begin", ending: "-é", auxiliary: "avoir", irregular: false },
  { infinitive: "arriver", participle: "arrivé", translation: "to arrive", ending: "-é", auxiliary: "être", irregular: false },
  { infinitive: "tomber", participle: "tombé", translation: "to fall", ending: "-é", auxiliary: "être", irregular: false },
  { infinitive: "naître", participle: "né", translation: "to be born", ending: "-é", auxiliary: "être", irregular: true },

  // -i group
  { infinitive: "finir", participle: "fini", translation: "to finish", ending: "-i", auxiliary: "avoir", irregular: false },
  { infinitive: "choisir", participle: "choisi", translation: "to choose", ending: "-i", auxiliary: "avoir", irregular: false },
  { infinitive: "grandir", participle: "grandi", translation: "to grow up", ending: "-i", auxiliary: "avoir", irregular: false },
  { infinitive: "réussir", participle: "réussi", translation: "to succeed", ending: "-i", auxiliary: "avoir", irregular: false },
  { infinitive: "dormir", participle: "dormi", translation: "to sleep", ending: "-i", auxiliary: "avoir", irregular: false },
  { infinitive: "partir", participle: "parti", translation: "to leave", ending: "-i", auxiliary: "être", irregular: false },
  { infinitive: "sortir", participle: "sorti", translation: "to go out", ending: "-i", auxiliary: "être", irregular: false },

  // -u group
  { infinitive: "vendre", participle: "vendu", translation: "to sell", ending: "-u", auxiliary: "avoir", irregular: false },
  { infinitive: "attendre", participle: "attendu", translation: "to wait", ending: "-u", auxiliary: "avoir", irregular: false },
  { infinitive: "entendre", participle: "entendu", translation: "to hear", ending: "-u", auxiliary: "avoir", irregular: false },
  { infinitive: "répondre", participle: "répondu", translation: "to answer", ending: "-u", auxiliary: "avoir", irregular: false },
  { infinitive: "perdre", participle: "perdu", translation: "to lose", ending: "-u", auxiliary: "avoir", irregular: false },
  { infinitive: "boire", participle: "bu", translation: "to drink", ending: "-u", auxiliary: "avoir", irregular: true },
  { infinitive: "savoir", participle: "su", translation: "to know", ending: "-u", auxiliary: "avoir", irregular: true },
  { infinitive: "pouvoir", participle: "pu", translation: "to be able to", ending: "-u", auxiliary: "avoir", irregular: true },
  { infinitive: "vouloir", participle: "voulu", translation: "to want", ending: "-u", auxiliary: "avoir", irregular: true },
  { infinitive: "devoir", participle: "dû", translation: "to have to", ending: "-u", auxiliary: "avoir", irregular: true },
  { infinitive: "connaître", participle: "connu", translation: "to know (person)", ending: "-u", auxiliary: "avoir", irregular: true },
  { infinitive: "voir", participle: "vu", translation: "to see", ending: "-u", auxiliary: "avoir", irregular: true },
  { infinitive: "lire", participle: "lu", translation: "to read", ending: "-u", auxiliary: "avoir", irregular: true },
  { infinitive: "recevoir", participle: "reçu", translation: "to receive", ending: "-u", auxiliary: "avoir", irregular: true },
  { infinitive: "venir", participle: "venu", translation: "to come", ending: "-u", auxiliary: "être", irregular: true },
  { infinitive: "tenir", participle: "tenu", translation: "to hold", ending: "-u", auxiliary: "avoir", irregular: true },

  // -is group
  { infinitive: "mettre", participle: "mis", translation: "to put", ending: "-is", auxiliary: "avoir", irregular: true },
  { infinitive: "prendre", participle: "pris", translation: "to take", ending: "-is", auxiliary: "avoir", irregular: true },

  // -it group
  { infinitive: "dire", participle: "dit", translation: "to say", ending: "-it", auxiliary: "avoir", irregular: true },
  { infinitive: "écrire", participle: "écrit", translation: "to write", ending: "-it", auxiliary: "avoir", irregular: true },

  // -ert group
  { infinitive: "ouvrir", participle: "ouvert", translation: "to open", ending: "-ert", auxiliary: "avoir", irregular: true },
  { infinitive: "offrir", participle: "offert", translation: "to offer", ending: "-ert", auxiliary: "avoir", irregular: true },
  { infinitive: "souffrir", participle: "souffert", translation: "to suffer", ending: "-ert", auxiliary: "avoir", irregular: true },
  { infinitive: "couvrir", participle: "couvert", translation: "to cover", ending: "-ert", auxiliary: "avoir", irregular: true },

  // -int group
  { infinitive: "peindre", participle: "peint", translation: "to paint", ending: "-int", auxiliary: "avoir", irregular: true },
  { infinitive: "joindre", participle: "joint", translation: "to join", ending: "-int", auxiliary: "avoir", irregular: true },
  { infinitive: "craindre", participle: "craint", translation: "to fear", ending: "-int", auxiliary: "avoir", irregular: true },

  // other/irregular
  { infinitive: "être", participle: "été", translation: "to be", ending: "other", auxiliary: "avoir", irregular: true },
  { infinitive: "avoir", participle: "eu", translation: "to have", ending: "-u", auxiliary: "avoir", irregular: true },
  { infinitive: "faire", participle: "fait", translation: "to do/make", ending: "other", auxiliary: "avoir", irregular: true },
  { infinitive: "aller", participle: "allé", translation: "to go", ending: "-é", auxiliary: "être", irregular: false },
  { infinitive: "mourir", participle: "mort", translation: "to die", ending: "other", auxiliary: "être", irregular: true },
];

export function getEndingGroups(verbs: Verb[]): Record<ParticipleEnding, string[]> {
  const groups: Record<ParticipleEnding, string[]> = {
    "-é": [],
    "-i": [],
    "-u": [],
    "-is": [],
    "-it": [],
    "-ert": [],
    "-int": [],
    "other": [],
  };
  for (const verb of verbs) {
    groups[verb.ending].push(verb.participle);
  }
  return groups;
}
