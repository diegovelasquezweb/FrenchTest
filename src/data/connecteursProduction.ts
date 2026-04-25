export type ConnecteurRelation =
  | "opposition"
  | "cause"
  | "consequence"
  | "addition"
  | "but"
  | "temps"
  | "condition"
  | "illustration";

export type ConnecteurRegistre = "formel" | "courant" | "neutre";

export type ConnecteurProductionItem = {
  id: string;
  phrase1: string;
  phrase2: string;
  relation: ConnecteurRelation;
  registreCible?: ConnecteurRegistre;
  exempleSolution: string;
  connecteursValides: string[];
  requiertSubjonctif?: boolean;
};

export const RELATION_META: Record<
  ConnecteurRelation,
  { label: string; description: string; emoji: string }
> = {
  opposition: {
    label: "Opposition / Concession",
    description: "Les deux idées s'opposent ou se contredisent.",
    emoji: "⚖️",
  },
  cause: {
    label: "Cause",
    description: "La deuxième phrase explique pourquoi la première arrive.",
    emoji: "🔍",
  },
  consequence: {
    label: "Conséquence",
    description: "La deuxième phrase est le résultat de la première.",
    emoji: "➡️",
  },
  addition: {
    label: "Addition",
    description: "On ajoute une idée qui va dans le même sens.",
    emoji: "➕",
  },
  but: {
    label: "But",
    description: "La deuxième phrase exprime l'objectif visé.",
    emoji: "🎯",
  },
  temps: {
    label: "Temps",
    description: "Les deux actions sont liées par une relation temporelle.",
    emoji: "⏱️",
  },
  condition: {
    label: "Condition",
    description: "La deuxième phrase dépend d'une condition.",
    emoji: "❓",
  },
  illustration: {
    label: "Illustration",
    description: "La deuxième phrase illustre ou précise la première.",
    emoji: "💡",
  },
};

export const CONNECTEURS_BY_RELATION: Record<
  ConnecteurRelation,
  { connecteur: string; registre: ConnecteurRegistre; subjonctif?: boolean }[]
> = {
  opposition: [
    { connecteur: "mais", registre: "courant" },
    { connecteur: "cependant", registre: "formel" },
    { connecteur: "pourtant", registre: "neutre" },
    { connecteur: "néanmoins", registre: "formel" },
    { connecteur: "toutefois", registre: "formel" },
    { connecteur: "en revanche", registre: "formel" },
    { connecteur: "par contre", registre: "courant" },
    { connecteur: "alors que", registre: "neutre" },
    { connecteur: "tandis que", registre: "neutre" },
    { connecteur: "bien que", registre: "formel", subjonctif: true },
    { connecteur: "quoique", registre: "formel", subjonctif: true },
    { connecteur: "malgré", registre: "neutre" },
  ],
  cause: [
    { connecteur: "car", registre: "neutre" },
    { connecteur: "parce que", registre: "courant" },
    { connecteur: "puisque", registre: "neutre" },
    { connecteur: "comme", registre: "neutre" },
    { connecteur: "étant donné que", registre: "formel" },
    { connecteur: "vu que", registre: "courant" },
    { connecteur: "en raison de", registre: "formel" },
    { connecteur: "grâce à", registre: "neutre" },
    { connecteur: "à cause de", registre: "neutre" },
  ],
  consequence: [
    { connecteur: "donc", registre: "neutre" },
    { connecteur: "alors", registre: "courant" },
    { connecteur: "ainsi", registre: "formel" },
    { connecteur: "par conséquent", registre: "formel" },
    { connecteur: "c'est pourquoi", registre: "neutre" },
    { connecteur: "de sorte que", registre: "formel" },
    { connecteur: "si bien que", registre: "neutre" },
    { connecteur: "en conséquence", registre: "formel" },
  ],
  addition: [
    { connecteur: "et", registre: "courant" },
    { connecteur: "de plus", registre: "neutre" },
    { connecteur: "en outre", registre: "formel" },
    { connecteur: "par ailleurs", registre: "formel" },
    { connecteur: "également", registre: "neutre" },
    { connecteur: "qui plus est", registre: "formel" },
    { connecteur: "d'ailleurs", registre: "neutre" },
    { connecteur: "non seulement", registre: "neutre" },
  ],
  but: [
    { connecteur: "pour", registre: "neutre" },
    { connecteur: "afin de", registre: "formel" },
    { connecteur: "afin que", registre: "formel", subjonctif: true },
    { connecteur: "pour que", registre: "neutre", subjonctif: true },
    { connecteur: "de manière à", registre: "formel" },
    { connecteur: "de façon à", registre: "neutre" },
    { connecteur: "dans le but de", registre: "formel" },
  ],
  temps: [
    { connecteur: "quand", registre: "courant" },
    { connecteur: "lorsque", registre: "formel" },
    { connecteur: "dès que", registre: "neutre" },
    { connecteur: "aussitôt que", registre: "formel" },
    { connecteur: "pendant que", registre: "neutre" },
    { connecteur: "tandis que", registre: "neutre" },
    { connecteur: "avant que", registre: "formel", subjonctif: true },
    { connecteur: "après que", registre: "neutre" },
    { connecteur: "depuis que", registre: "neutre" },
  ],
  condition: [
    { connecteur: "si", registre: "courant" },
    { connecteur: "à condition que", registre: "formel", subjonctif: true },
    { connecteur: "à condition de", registre: "formel" },
    { connecteur: "pourvu que", registre: "formel", subjonctif: true },
    { connecteur: "à moins que", registre: "formel", subjonctif: true },
    { connecteur: "au cas où", registre: "neutre" },
  ],
  illustration: [
    { connecteur: "par exemple", registre: "neutre" },
    { connecteur: "notamment", registre: "formel" },
    { connecteur: "ainsi", registre: "formel" },
    { connecteur: "en effet", registre: "formel" },
    { connecteur: "c'est-à-dire", registre: "neutre" },
    { connecteur: "à savoir", registre: "formel" },
  ],
};

export const PRODUCTION_ITEMS: ConnecteurProductionItem[] = [
  // ── OPPOSITION ───────────────────────────────────────────────────────────
  {
    id: "opp-01",
    phrase1: "Je voulais sortir.",
    phrase2: "Il pleuvait beaucoup.",
    relation: "opposition",
    registreCible: "neutre",
    exempleSolution: "Je voulais sortir, cependant il pleuvait beaucoup.",
    connecteursValides: ["mais", "cependant", "pourtant", "néanmoins", "toutefois"],
  },
  {
    id: "opp-02",
    phrase1: "Cette formation est coûteuse.",
    phrase2: "Elle offre de réelles perspectives professionnelles.",
    relation: "opposition",
    registreCible: "formel",
    exempleSolution: "Cette formation est coûteuse ; en revanche, elle offre de réelles perspectives professionnelles.",
    connecteursValides: ["cependant", "néanmoins", "toutefois", "en revanche", "pourtant"],
  },
  {
    id: "opp-03",
    phrase1: "Il travaille beaucoup.",
    phrase2: "Il n'obtient pas les résultats attendus.",
    relation: "opposition",
    exempleSolution: "Il travaille beaucoup, pourtant il n'obtient pas les résultats attendus.",
    connecteursValides: ["mais", "cependant", "pourtant", "néanmoins"],
  },
  {
    id: "opp-04",
    phrase1: "Il a tous les diplômes nécessaires.",
    phrase2: "Il ne trouve pas d'emploi.",
    relation: "opposition",
    registreCible: "formel",
    exempleSolution: "Bien qu'il ait tous les diplômes nécessaires, il ne trouve pas d'emploi.",
    connecteursValides: ["bien que", "quoique", "malgré"],
    requiertSubjonctif: true,
  },
  {
    id: "opp-05",
    phrase1: "Mon frère adore les sports collectifs.",
    phrase2: "Ma sœur préfère les activités individuelles.",
    relation: "opposition",
    exempleSolution: "Mon frère adore les sports collectifs, alors que ma sœur préfère les activités individuelles.",
    connecteursValides: ["alors que", "tandis que", "mais", "en revanche", "par contre"],
  },

  // ── CAUSE ────────────────────────────────────────────────────────────────
  {
    id: "cau-01",
    phrase1: "Je n'ai pas pu venir à la réunion.",
    phrase2: "Mon train était en retard.",
    relation: "cause",
    registreCible: "neutre",
    exempleSolution: "Je n'ai pas pu venir à la réunion car mon train était en retard.",
    connecteursValides: ["car", "parce que", "puisque", "comme"],
  },
  {
    id: "cau-02",
    phrase1: "La réunion a été annulée.",
    phrase2: "Plusieurs participants étaient absents.",
    relation: "cause",
    registreCible: "formel",
    exempleSolution: "La réunion a été annulée étant donné que plusieurs participants étaient absents.",
    connecteursValides: ["car", "parce que", "étant donné que", "vu que", "en raison de", "puisque"],
  },
  {
    id: "cau-03",
    phrase1: "Tu connais déjà la réponse.",
    phrase2: "Je ne vais pas la répéter.",
    relation: "cause",
    exempleSolution: "Puisque tu connais déjà la réponse, je ne vais pas la répéter.",
    connecteursValides: ["puisque", "comme", "étant donné que", "vu que"],
  },
  {
    id: "cau-04",
    phrase1: "Le projet a réussi.",
    phrase2: "Toute l'équipe s'est investie.",
    relation: "cause",
    exempleSolution: "Le projet a réussi grâce à l'investissement de toute l'équipe.",
    connecteursValides: ["car", "parce que", "grâce à", "puisque"],
  },
  {
    id: "cau-05",
    phrase1: "Les ventes ont chuté.",
    phrase2: "La crise économique mondiale a frappé le secteur.",
    relation: "cause",
    registreCible: "formel",
    exempleSolution: "Les ventes ont chuté en raison de la crise économique mondiale qui a frappé le secteur.",
    connecteursValides: ["en raison de", "à cause de", "étant donné que", "car", "parce que"],
  },

  // ── CONSEQUENCE ──────────────────────────────────────────────────────────
  {
    id: "con-01",
    phrase1: "Il a beaucoup étudié.",
    phrase2: "Il a réussi son examen.",
    relation: "consequence",
    registreCible: "neutre",
    exempleSolution: "Il a beaucoup étudié, donc il a réussi son examen.",
    connecteursValides: ["donc", "alors", "ainsi", "par conséquent", "c'est pourquoi"],
  },
  {
    id: "con-02",
    phrase1: "Le coût de la vie augmente chaque année.",
    phrase2: "Le pouvoir d'achat des familles diminue.",
    relation: "consequence",
    registreCible: "formel",
    exempleSolution: "Le coût de la vie augmente chaque année ; par conséquent, le pouvoir d'achat des familles diminue.",
    connecteursValides: ["par conséquent", "c'est pourquoi", "ainsi", "en conséquence", "donc"],
  },
  {
    id: "con-03",
    phrase1: "Le métro était en panne.",
    phrase2: "J'ai dû prendre un taxi.",
    relation: "consequence",
    exempleSolution: "Le métro était en panne, c'est pourquoi j'ai dû prendre un taxi.",
    connecteursValides: ["donc", "alors", "ainsi", "c'est pourquoi", "par conséquent"],
  },
  {
    id: "con-04",
    phrase1: "Il pleuvait des cordes.",
    phrase2: "Personne n'est sorti de chez soi.",
    relation: "consequence",
    exempleSolution: "Il pleuvait tellement que personne n'est sorti de chez soi.",
    connecteursValides: ["donc", "alors", "si bien que", "de sorte que", "ainsi"],
  },

  // ── ADDITION ─────────────────────────────────────────────────────────────
  {
    id: "add-01",
    phrase1: "Cette voiture est économique.",
    phrase2: "Elle est respectueuse de l'environnement.",
    relation: "addition",
    registreCible: "formel",
    exempleSolution: "Cette voiture est économique ; de plus, elle est respectueuse de l'environnement.",
    connecteursValides: ["et", "de plus", "en outre", "par ailleurs", "également", "qui plus est"],
  },
  {
    id: "add-02",
    phrase1: "Le candidat parle trois langues.",
    phrase2: "Il a une grande expérience à l'international.",
    relation: "addition",
    registreCible: "formel",
    exempleSolution: "Le candidat parle trois langues ; par ailleurs, il a une grande expérience à l'international.",
    connecteursValides: ["de plus", "en outre", "par ailleurs", "également", "qui plus est"],
  },
  {
    id: "add-03",
    phrase1: "Ce restaurant propose une cuisine raffinée.",
    phrase2: "Le service est impeccable.",
    relation: "addition",
    exempleSolution: "Ce restaurant propose une cuisine raffinée et le service est impeccable.",
    connecteursValides: ["et", "de plus", "en outre", "également", "par ailleurs"],
  },
  {
    id: "add-04",
    phrase1: "Le télétravail réduit les déplacements.",
    phrase2: "Il améliore la qualité de vie des salariés.",
    relation: "addition",
    exempleSolution: "Le télétravail réduit les déplacements ; d'ailleurs, il améliore la qualité de vie des salariés.",
    connecteursValides: ["de plus", "en outre", "par ailleurs", "d'ailleurs", "également", "et"],
  },

  // ── BUT ──────────────────────────────────────────────────────────────────
  {
    id: "but-01",
    phrase1: "J'apprends le français.",
    phrase2: "Je veux immigrer au Canada.",
    relation: "but",
    registreCible: "neutre",
    exempleSolution: "J'apprends le français afin d'immigrer au Canada.",
    connecteursValides: ["pour", "afin de", "dans le but de"],
  },
  {
    id: "but-02",
    phrase1: "Le gouvernement a augmenté les impôts.",
    phrase2: "Il veut financer les services publics.",
    relation: "but",
    registreCible: "formel",
    exempleSolution: "Le gouvernement a augmenté les impôts afin de financer les services publics.",
    connecteursValides: ["pour", "afin de", "dans le but de", "de manière à", "de façon à"],
  },
  {
    id: "but-03",
    phrase1: "Mes parents travaillent dur.",
    phrase2: "Ils veulent que leurs enfants réussissent.",
    relation: "but",
    registreCible: "formel",
    exempleSolution: "Mes parents travaillent dur pour que leurs enfants réussissent.",
    connecteursValides: ["pour que", "afin que"],
    requiertSubjonctif: true,
  },

  // ── TEMPS ────────────────────────────────────────────────────────────────
  {
    id: "tem-01",
    phrase1: "J'arrive à la maison.",
    phrase2: "Je me prépare un café.",
    relation: "temps",
    exempleSolution: "Dès que j'arrive à la maison, je me prépare un café.",
    connecteursValides: ["quand", "lorsque", "dès que", "aussitôt que"],
  },
  {
    id: "tem-02",
    phrase1: "J'écoutais de la musique.",
    phrase2: "Ma sœur faisait ses devoirs.",
    relation: "temps",
    exempleSolution: "J'écoutais de la musique pendant que ma sœur faisait ses devoirs.",
    connecteursValides: ["pendant que", "tandis que", "alors que"],
  },
  {
    id: "tem-03",
    phrase1: "Tu pars en voyage.",
    phrase2: "Préviens-moi.",
    relation: "temps",
    registreCible: "formel",
    exempleSolution: "Avant que tu partes en voyage, préviens-moi.",
    connecteursValides: ["avant que"],
    requiertSubjonctif: true,
  },

  // ── CONDITION ────────────────────────────────────────────────────────────
  {
    id: "cnd-01",
    phrase1: "Tu étudies tous les jours.",
    phrase2: "Tu réussiras le TEF.",
    relation: "condition",
    exempleSolution: "Si tu étudies tous les jours, tu réussiras le TEF.",
    connecteursValides: ["si"],
  },
  {
    id: "cnd-02",
    phrase1: "Vous obtenez un score satisfaisant.",
    phrase2: "Nous validerons votre candidature.",
    relation: "condition",
    registreCible: "formel",
    exempleSolution: "À condition que vous obteniez un score satisfaisant, nous validerons votre candidature.",
    connecteursValides: ["à condition que", "pourvu que"],
    requiertSubjonctif: true,
  },
  {
    id: "cnd-03",
    phrase1: "Il pleut demain.",
    phrase2: "On reportera le pique-nique.",
    relation: "condition",
    exempleSolution: "Au cas où il pleuvrait demain, on reportera le pique-nique.",
    connecteursValides: ["si", "au cas où"],
  },

  // ── ILLUSTRATION ─────────────────────────────────────────────────────────
  {
    id: "ill-01",
    phrase1: "Plusieurs villes ont adopté des politiques écologiques.",
    phrase2: "Paris, Lyon et Bordeaux limitent désormais les voitures.",
    relation: "illustration",
    registreCible: "formel",
    exempleSolution: "Plusieurs villes ont adopté des politiques écologiques ; notamment Paris, Lyon et Bordeaux limitent désormais les voitures.",
    connecteursValides: ["par exemple", "notamment", "ainsi", "à savoir"],
  },
  {
    id: "ill-02",
    phrase1: "Le télétravail présente des avantages.",
    phrase2: "Il permet d'économiser du temps de transport.",
    relation: "illustration",
    exempleSolution: "Le télétravail présente des avantages ; en effet, il permet d'économiser du temps de transport.",
    connecteursValides: ["par exemple", "en effet", "notamment", "ainsi"],
  },
];
