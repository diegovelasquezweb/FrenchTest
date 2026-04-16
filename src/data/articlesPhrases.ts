export interface ArticlePhrase {
  sentence: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export const ARTICLES_PHRASES: ArticlePhrase[] = [
  {
    sentence: "Je vais ___ marché ce matin.",
    options: ["au", "à le", "aux", "du"],
    correctIndex: 0,
    explanation: "Avec « aller à + le marché », on contracte : « au marché ».",
  },
  {
    sentence: "Elle revient ___ bureau à 18 h.",
    options: ["du", "de le", "des", "de la"],
    correctIndex: 0,
    explanation: "Avec « revenir de + le bureau », on fait la contraction « du ».",
  },
  {
    sentence: "Nous parlons ___ projets de la semaine.",
    options: ["des", "de les", "du", "aux"],
    correctIndex: 0,
    explanation: "« de + les projets » devient « des projets ».",
  },
  {
    sentence: "Ils vont ___ États-Unis en été.",
    options: ["aux", "à les", "au", "des"],
    correctIndex: 0,
    explanation: "Pays pluriel : on dit « aux États-Unis ».",
  },
  {
    sentence: "Je bois ___ eau pendant le cours.",
    options: ["de l'", "du", "de la", "des"],
    correctIndex: 0,
    explanation: "Devant voyelle/h muet avec partitif : « de l'eau ».",
  },
  {
    sentence: "Tu prends ___ café le matin ?",
    options: ["du", "de", "le", "des"],
    correctIndex: 0,
    explanation: "Pour une quantité non comptée : « du café ».",
  },
  {
    sentence: "Nous mangeons ___ soupe ce soir.",
    options: ["de la", "du", "des", "de"],
    correctIndex: 0,
    explanation: "Nom féminin singulier non compté : « de la soupe ».",
  },
  {
    sentence: "Il n'a pas ___ voiture.",
    options: ["de", "une", "des", "du"],
    correctIndex: 0,
    explanation: "À la négation, « un/une/des » devient généralement « de ».",
  },
  {
    sentence: "Vous avez beaucoup ___ travail aujourd'hui.",
    options: ["de", "du", "des", "de la"],
    correctIndex: 0,
    explanation: "Après une expression de quantité : « beaucoup de ».",
  },
  {
    sentence: "Je parle ___ professeur après le cours.",
    options: ["au", "à le", "du", "des"],
    correctIndex: 0,
    explanation: "« à + le professeur » se contracte en « au professeur ».",
  },
  {
    sentence: "Elle habite près ___ gare.",
    options: ["de la", "du", "des", "de l'"],
    correctIndex: 0,
    explanation: "Nom féminin singulier : « près de la gare ».",
  },
  {
    sentence: "On rentre ___ cinéma vers minuit.",
    options: ["du", "de le", "des", "de la"],
    correctIndex: 0,
    explanation: "« de + le cinéma » devient « du cinéma ».",
  },
];

