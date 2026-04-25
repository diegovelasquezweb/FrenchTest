export type TefTestId = "ce" | "co" | "ee" | "eo";

export type TefSection = {
  label: string;
  duration: string;
  task: string;
  details?: string[];
};

export type TefTest = {
  id: TefTestId;
  shortLabel: string;
  fullLabel: string;
  duration: string;
  questions?: string;
  scoreMax: string;
  format: string;
  sections?: TefSection[];
  tips: string[];
};

export const TEF_TESTS: TefTest[] = [
  {
    id: "ce",
    shortLabel: "Compréhension écrite",
    fullLabel: "Compréhension écrite (lecture)",
    duration: "60 minutes",
    questions: "40 questions",
    scoreMax: "0 à 300 points",
    format: "QCM (questions à choix multiple)",
    tips: [
      "Lisez d'abord les questions, puis le texte : vous saurez quoi chercher.",
      "Une mauvaise réponse vaut 0 ; ne laissez aucune question sans réponse.",
      "Gérez votre temps : 1 minute 30 par question en moyenne.",
      "Repérez les mots-clés et les connecteurs logiques (cependant, par conséquent, en effet).",
    ],
  },
  {
    id: "co",
    shortLabel: "Compréhension orale",
    fullLabel: "Compréhension orale (écoute)",
    duration: "40 minutes",
    questions: "40 questions",
    scoreMax: "0 à 360 points",
    format: "QCM — chaque audio n'est joué qu'une seule fois",
    tips: [
      "Lisez les questions AVANT que l'audio ne commence : c'est votre seul avantage.",
      "L'audio ne se répète pas. Concentrez-vous immédiatement.",
      "Notez les chiffres, lieux et noms : ce sont souvent des pièges.",
      "Si vous ratez une question, passez à la suivante. Ne perdez pas le fil.",
    ],
  },
  {
    id: "ee",
    shortLabel: "Expression écrite",
    fullLabel: "Expression écrite (rédaction)",
    duration: "60 minutes",
    scoreMax: "0 à 450 points",
    format: "Deux sections évaluées par des correcteurs formés",
    sections: [
      {
        label: "Section A — Fait divers",
        duration: "25 minutes",
        task: "Écrire la suite d'un article de presse (minimum 80 mots).",
        details: [
          "Respectez le style journalistique : phrases factuelles, ton neutre.",
          "Conservez les temps du récit (passé composé / imparfait).",
          "Répondez aux questions implicites : qui, quoi, où, quand, comment, pourquoi.",
        ],
      },
      {
        label: "Section B — Argumentation",
        duration: "35 minutes",
        task: "Exprimer et justifier un point de vue (minimum 200 mots).",
        details: [
          "Structure claire : introduction, arguments avec exemples, conclusion.",
          "Registre formel : vouvoiement, pas de contractions familières.",
          "Variez les connecteurs (cependant, par ailleurs, en revanche, par conséquent).",
        ],
      },
    ],
    tips: [
      "Le minimum de mots est OBLIGATOIRE : écrire moins est lourdement pénalisé.",
      "Relisez 3 minutes à la fin pour les accords et les temps verbaux.",
      "Évitez les répétitions : variez le vocabulaire.",
      "À partir de juin 2026, l'examen se passe sur ordinateur dans tous les centres.",
    ],
  },
  {
    id: "eo",
    shortLabel: "Expression orale",
    fullLabel: "Expression orale (production parlée)",
    duration: "15 minutes",
    scoreMax: "0 à 450 points",
    format: "En face d'un examinateur — systématiquement enregistré pour double évaluation",
    sections: [
      {
        label: "Section A — Obtenir des informations",
        duration: "5 minutes",
        task: "Poser des questions à partir d'une annonce (cours, emploi, logement, etc.).",
        details: [
          "Posez au moins 8 à 10 questions variées.",
          "Utilisez le vouvoiement et le conditionnel de politesse.",
          "Variez les structures : « Pourriez-vous… ? », « Est-ce que… ? », « Quand est-ce que… ? »",
        ],
      },
      {
        label: "Section B — Convaincre",
        duration: "10 minutes",
        task: "Convaincre un proche (ami, membre de la famille) de faire ou ne pas faire quelque chose.",
        details: [
          "Registre courant (tutoiement accepté avec un proche).",
          "Donnez 3 arguments minimum avec des exemples concrets.",
          "Anticipez les objections et répondez-y.",
        ],
      },
    ],
    tips: [
      "Parlez clairement et à un rythme naturel — ne vous précipitez pas.",
      "Les hésitations longues sont pénalisées : utilisez des transitions (« d'ailleurs », « en fait »).",
      "Préparez mentalement 30 secondes avant de parler.",
      "L'enregistrement permet une double correction : soyez constant du début à la fin.",
    ],
  },
];

export type ClbThreshold = {
  level: string;
  ce: string;
  co: string;
  ee: string;
  eo: string;
  usage: string;
};

export const CLB_THRESHOLDS: ClbThreshold[] = [
  {
    level: "NCLC 7 / CLB 7",
    ce: "207–232",
    co: "249–279",
    ee: "310–348",
    eo: "310–348",
    usage: "Minimum requis pour Entrée Express (Express Entry).",
  },
  {
    level: "NCLC 8 / CLB 8",
    ce: "233–247",
    co: "280–297",
    ee: "349–370",
    eo: "349–370",
    usage: "Bonus de points en immigration francophone.",
  },
  {
    level: "NCLC 9 / CLB 9",
    ce: "248–262",
    co: "298–315",
    ee: "371–392",
    eo: "371–392",
    usage: "Maximum de points CRS pour le français (50 points).",
  },
  {
    level: "NCLC 10 / CLB 10",
    ce: "263–300",
    co: "316–360",
    ee: "393–450",
    eo: "393–450",
    usage: "Niveau avancé — pas de points supplémentaires au-delà de NCLC 9.",
  },
];

export const GENERAL_FACTS: { label: string; value: string }[] = [
  { label: "Conçu par", value: "CCI Paris Île-de-France · Le Français des Affaires" },
  { label: "Reconnu par", value: "IRCC (immigration fédérale canadienne)" },
  { label: "Validité du certificat", value: "2 ans à partir de la date du test" },
  { label: "Durée totale (4 épreuves)", value: "≈ 2 h 55" },
  { label: "Variante de français", value: "Français standard (hexagonal)" },
  { label: "Format 2026", value: "Numérique généralisé à partir de juin 2026" },
  { label: "Tests le même jour", value: "Obligatoire pour la reconnaissance par IRCC" },
];

export const GENERAL_TIPS: string[] = [
  "Le TEF Canada utilise le français standard, pas le français québécois. Préparez-vous en français hexagonal.",
  "Aucun « score global » n'existe : IRCC évalue chaque épreuve séparément contre le seuil NCLC visé.",
  "Pour Entrée Express : NCLC 7 minimum dans les 4 épreuves. NCLC 9 = maximum de points CRS.",
  "Les 4 épreuves doivent être passées le même jour pour que le certificat soit accepté par IRCC.",
  "Résultats disponibles en 4 à 6 semaines (format papier) ou 3 jours ouvrés (format numérique 2026).",
];
