import type { OrthographePhrase } from "./orthographePhrases";

export const PHRASES_ETRE: OrthographePhrase[] = [
  // ── AUXILIAIRE DE BASE ───────────────────────────────────────────────────
  {
    sentence: "Hier soir, Marie ___ arrivée très tard.",
    options: ["est", "a", "sont", "ont"],
    correctIndex: 0,
    explanation: "ARRIVER → être. Marie (fém. sing.) → est arrivée. Accord du participe avec le sujet.",
  },
  {
    sentence: "Les enfants ___ sortis jouer dans le jardin.",
    options: ["ont", "sont", "a", "est"],
    correctIndex: 1,
    explanation: "SORTIR (intransitif, sans COD) → être. Les enfants (masc. plur.) → sont sortis.",
  },
  {
    sentence: "Victor Hugo ___ né en 1802.",
    options: ["a", "est", "ont", "sont"],
    correctIndex: 1,
    explanation: "NAÎTRE → toujours être. Participe : né(e). Même règle pour MOURIR : il est mort.",
  },
  {
    sentence: "Nous ___ allés au cinéma vendredi soir.",
    options: ["avons", "sommes", "ont", "sont"],
    correctIndex: 1,
    explanation: "ALLER → être. \"Nous\" masc. plur. → sommes allés. Si groupe fém. → sommes allées.",
  },
  {
    sentence: "Julie et Sophie ___ venues nous rendre visite.",
    options: ["ont", "est", "sont", "a"],
    correctIndex: 2,
    explanation: "VENIR → être. Groupe 100 % féminin plur. → sont venues. Accord féminin obligatoire.",
  },
  {
    sentence: "Elle ___ tombée dans l'escalier ce matin.",
    options: ["a", "ont", "est", "sont"],
    correctIndex: 2,
    explanation: "TOMBER → être. Elle (fém. sing.) → est tombée. Participe s'accorde avec le sujet.",
  },
  {
    sentence: "Ils ___ restés trois semaines en France.",
    options: ["ont", "sont", "avons", "sommes"],
    correctIndex: 1,
    explanation: "RESTER → être. Ils (masc. plur.) → sont restés. \"Rester\" = demeurer sur place, toujours intransitif.",
  },
  {
    sentence: "Marie ___ devenue une chercheuse reconnue.",
    options: ["a", "est", "ont", "sont"],
    correctIndex: 1,
    explanation: "DEVENIR (composé de venir) → être. Marie (fém. sing.) → est devenue. Accord féminin : devenue.",
  },
  {
    sentence: "Les touristes ___ partis très tôt le matin.",
    options: ["ont", "sont", "avons", "sommes"],
    correctIndex: 1,
    explanation: "PARTIR → être. Les touristes (masc. plur.) → sont partis. Participe accord masc. plur.",
  },
  {
    sentence: "Elle ___ revenue de voyage complètement épuisée.",
    options: ["a", "ont", "est", "sont"],
    correctIndex: 2,
    explanation: "REVENIR (composé de venir) → être. Elle (fém. sing.) → est revenue. Accord féminin : revenue.",
  },
  // ── PIÈGES TRANSITIFS ────────────────────────────────────────────────────
  {
    sentence: "Elle ___ sorti le parapluie avant de partir.",
    options: ["est", "sont", "a", "ont"],
    correctIndex: 2,
    explanation: "PIÈGE : SORTIR + COD direct (le parapluie) → avoir. \"Elle a sorti\" (transitif). Sans COD → être : \"elle est sortie\".",
  },
  {
    sentence: "Mon père ___ monté les cartons au grenier.",
    options: ["est", "sont", "ont", "a"],
    correctIndex: 3,
    explanation: "PIÈGE : MONTER + COD direct (les cartons) → avoir. \"a monté\" (transitif). Sans COD → être : \"il est monté\".",
  },
  {
    sentence: "Elle ___ descendu la poubelle avant de partir.",
    options: ["est", "sont", "ont", "a"],
    correctIndex: 3,
    explanation: "PIÈGE : DESCENDRE + COD direct (la poubelle) → avoir. \"a descendu\" (transitif). Sans COD → être : \"elle est descendue\".",
  },
  // ── ACCORD MASC / FÉM / PLURIEL ─────────────────────────────────────────
  {
    sentence: "Les deux sœurs ___ nées à Lyon.",
    options: ["ont", "est", "a", "sont"],
    correctIndex: 3,
    explanation: "NAÎTRE → être. Les deux sœurs (fém. plur.) → sont nées. Accord féminin pluriel : nées.",
  },
  {
    sentence: "Paul et Luc ___ descendus à la cave.",
    options: ["avons", "ont", "sont", "a"],
    correctIndex: 2,
    explanation: "DESCENDRE (intransitif) → être. Paul et Luc (masc. plur.) → sont descendus.",
  },
  {
    sentence: "Lucie ___ montée voir ses parents ce week-end.",
    options: ["a", "est", "ont", "sont"],
    correctIndex: 1,
    explanation: "MONTER (intransitif, sans COD) → être. Lucie (fém. sing.) → est montée. Accord féminin : montée.",
  },
  {
    sentence: "Ils ___ retournés plusieurs fois en Italie.",
    options: ["ont", "sont", "avons", "sommes"],
    correctIndex: 1,
    explanation: "RETOURNER → être. Ils (masc. plur.) → sont retournés. Retourner = retourner à un endroit visité.",
  },
  {
    sentence: "Ma mère ___ entrée sans frapper.",
    options: ["a", "est", "ont", "sont"],
    correctIndex: 1,
    explanation: "ENTRER → être. Ma mère (fém. sing.) → est entrée. Accord féminin obligatoire.",
  },
  // ── PHRASES COMPLEXES ────────────────────────────────────────────────────
  {
    sentence: "Ils ___ partis, mais elle ___ restée.",
    options: ["sont / est", "ont / a", "sont / a", "ont / est"],
    correctIndex: 0,
    explanation: "PARTIR et RESTER → être. Ils (masc. plur.) → sont partis ; elle (fém. sing.) → est restée. Double accord.",
  },
  {
    sentence: "L'entreprise ___ devenue leader du marché en moins de cinq ans.",
    options: ["a", "ont", "est", "sont"],
    correctIndex: 2,
    explanation: "DEVENIR → être. L'entreprise (fém. sing.) → est devenue. Accord féminin : devenue.",
  },
];