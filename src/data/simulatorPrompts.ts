export type SimulatorSection = "A" | "B";

export type SimulatorPrompt = {
  id: string;
  section: SimulatorSection;
  title: string;
  consigne: string;
  amorce?: string;
  contexteHints?: string[];
  expectedTense?: string;
  registre: "neutre journalistique" | "formel argumentatif";
  minWords: number;
  durationSeconds: number;
};

const SEC_A_DURATION = 25 * 60;
const SEC_B_DURATION = 35 * 60;

export const FAITS_DIVERS_PROMPTS: SimulatorPrompt[] = [
  {
    id: "fd-01",
    section: "A",
    title: "Incendie dans un immeuble",
    consigne: "Vous êtes journaliste. Continuez l'article suivant en respectant le style journalistique.",
    amorce:
      "Hier soir, vers 22 h 30, un incendie s'est déclaré dans un immeuble du 12ᵉ arrondissement de Paris. Les pompiers, alertés par les voisins, sont rapidement intervenus...",
    contexteHints: [
      "Décrivez les circonstances et les conséquences (blessés, dégâts).",
      "Mentionnez l'origine probable du sinistre.",
      "Citez une déclaration des autorités.",
    ],
    expectedTense: "passé composé / imparfait",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
  {
    id: "fd-02",
    section: "A",
    title: "Vol au musée municipal",
    consigne: "Continuez le fait divers en restant fidèle au style de presse écrite.",
    amorce:
      "Dimanche dernier, en pleine journée, un tableau de grande valeur a été dérobé au musée municipal de Lyon. Les caméras de surveillance auraient pourtant filmé toute la scène...",
    contexteHints: [
      "Précisez le déroulement du vol.",
      "Donnez la valeur de l'objet et l'enquête en cours.",
      "Mentionnez la réaction du conservateur.",
    ],
    expectedTense: "passé composé / conditionnel",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
  {
    id: "fd-03",
    section: "A",
    title: "Sauvetage en mer",
    consigne: "Poursuivez ce fait divers sur un sauvetage maritime.",
    amorce:
      "Une opération de sauvetage spectaculaire a eu lieu samedi matin au large de Marseille. Trois plaisanciers en difficulté ont été secourus par hélicoptère après plusieurs heures de dérive...",
    contexteHints: [
      "Décrivez l'état des naufragés et leur prise en charge.",
      "Précisez les causes de l'incident.",
      "Citez le commandant de la mission.",
    ],
    expectedTense: "passé composé / plus-que-parfait",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
  {
    id: "fd-04",
    section: "A",
    title: "Découverte archéologique",
    consigne: "Complétez l'article en gardant le ton informatif d'un journal généraliste.",
    amorce:
      "Une équipe d'archéologues a fait une découverte exceptionnelle la semaine dernière, lors de fouilles menées dans le sud de la France. Plusieurs objets datant de l'Antiquité ont été mis au jour...",
    contexteHints: [
      "Décrivez les objets trouvés et leur état.",
      "Expliquez l'importance de la découverte.",
      "Citez le responsable des fouilles.",
    ],
    expectedTense: "passé composé / imparfait",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
  {
    id: "fd-05",
    section: "A",
    title: "Tempête sur la côte atlantique",
    consigne: "Continuez l'article météo en gardant un ton neutre et factuel.",
    amorce:
      "Une violente tempête a balayé la côte atlantique pendant toute la nuit de jeudi à vendredi. Plusieurs communes restent privées d'électricité ce matin...",
    contexteHints: [
      "Donnez l'ampleur des dégâts matériels.",
      "Mentionnez les actions des services de secours.",
      "Citez un témoignage d'habitant.",
    ],
    expectedTense: "passé composé / présent",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
  {
    id: "fd-06",
    section: "A",
    title: "Festival annulé",
    consigne: "Poursuivez l'article en expliquant les circonstances de l'annulation.",
    amorce:
      "Le festival de musique électronique « ÉlectroNuit », attendu par plus de 30 000 spectateurs, a été annulé à la dernière minute samedi soir. Les organisateurs ont invoqué des raisons de sécurité...",
    contexteHints: [
      "Précisez les motifs de l'annulation.",
      "Mentionnez la réaction du public.",
      "Évoquez le remboursement et les suites.",
    ],
    expectedTense: "passé composé / futur",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
  {
    id: "fd-07",
    section: "A",
    title: "Inauguration d'une ligne de tramway",
    consigne: "Continuez ce reportage local sur l'inauguration.",
    amorce:
      "La nouvelle ligne de tramway reliant la gare centrale à l'université a été inaugurée lundi matin en présence des autorités municipales. Les premiers passagers se sont montrés enthousiastes...",
    contexteHints: [
      "Décrivez la cérémonie et les invités.",
      "Donnez les chiffres clés (longueur, fréquence, coût).",
      "Citez le maire et un usager.",
    ],
    expectedTense: "passé composé / présent",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
  {
    id: "fd-08",
    section: "A",
    title: "Animal sauvé en pleine ville",
    consigne: "Poursuivez ce fait divers original.",
    amorce:
      "Les pompiers ont été appelés mercredi après-midi en plein centre-ville pour secourir un jeune chevreuil qui s'était égaré dans une rue piétonne. La scène a attiré de nombreux curieux...",
    contexteHints: [
      "Racontez l'opération de capture.",
      "Décrivez l'état de l'animal.",
      "Précisez où il a été relâché.",
    ],
    expectedTense: "passé composé / imparfait",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
];

export const ARGUMENTATION_PROMPTS: SimulatorPrompt[] = [
  {
    id: "ar-01",
    section: "B",
    title: "Télétravail obligatoire",
    consigne:
      "« Le télétravail devrait être obligatoire au moins deux jours par semaine pour réduire la pollution. » Exprimez votre point de vue et justifiez-le par des arguments précis.",
    contexteHints: [
      "Prenez position clairement dès l'introduction.",
      "Donnez 2 à 3 arguments avec des exemples.",
      "Anticipez l'argument adverse et nuancez.",
      "Concluez en réaffirmant votre position.",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
  {
    id: "ar-02",
    section: "B",
    title: "Téléphones portables à l'école",
    consigne:
      "« Les téléphones portables devraient être totalement interdits dans les écoles secondaires. » Êtes-vous d'accord ? Justifiez votre opinion.",
    contexteHints: [
      "Définissez clairement votre position.",
      "Argumentez avec des exemples concrets (concentration, harcèlement, etc.).",
      "Variez les connecteurs logiques.",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
  {
    id: "ar-03",
    section: "B",
    title: "Voiture électrique obligatoire",
    consigne:
      "« D'ici 2035, seules les voitures électriques devraient être autorisées à la vente. » Donnez votre avis argumenté.",
    contexteHints: [
      "Considérez les arguments écologiques et économiques.",
      "Évoquez les limites (autonomie, infrastructure).",
      "Proposez éventuellement une alternative.",
    ],
    expectedTense: "présent / futur",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
  {
    id: "ar-04",
    section: "B",
    title: "Service civique obligatoire",
    consigne:
      "« Tous les jeunes devraient effectuer un service civique d'un an avant 25 ans. » Que pensez-vous de cette proposition ?",
    contexteHints: [
      "Argumentez sur les bénéfices (cohésion, expérience).",
      "Considérez les contraintes (emploi, études).",
      "Donnez des exemples internationaux.",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
  {
    id: "ar-05",
    section: "B",
    title: "Réseaux sociaux et adolescents",
    consigne:
      "« L'inscription aux réseaux sociaux devrait être interdite avant 16 ans. » Êtes-vous favorable à une telle mesure ?",
    contexteHints: [
      "Considérez les impacts sur la santé mentale.",
      "Évoquez la question du contrôle parental.",
      "Argumentez sur la liberté individuelle.",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
  {
    id: "ar-06",
    section: "B",
    title: "Tourisme de masse",
    consigne:
      "« Certains sites touristiques devraient limiter le nombre de visiteurs par jour. » Donnez votre opinion argumentée.",
    contexteHints: [
      "Pensez aux conséquences environnementales.",
      "Considérez l'impact économique local.",
      "Citez des exemples connus (Venise, Machu Picchu).",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
  {
    id: "ar-07",
    section: "B",
    title: "Semaine de quatre jours",
    consigne:
      "« Toutes les entreprises devraient adopter la semaine de travail de quatre jours. » Quelle est votre position ?",
    contexteHints: [
      "Argumentez sur la productivité et le bien-être.",
      "Considérez les secteurs où c'est difficile.",
      "Évoquez les expérimentations existantes.",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
  {
    id: "ar-08",
    section: "B",
    title: "Gratuité des transports en commun",
    consigne:
      "« Les transports en commun devraient être gratuits dans toutes les grandes villes. » Justifiez votre point de vue.",
    contexteHints: [
      "Considérez l'impact environnemental.",
      "Évoquez le financement et les conséquences fiscales.",
      "Donnez des exemples de villes ayant testé la mesure.",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
];

export const ALL_PROMPTS: SimulatorPrompt[] = [...FAITS_DIVERS_PROMPTS, ...ARGUMENTATION_PROMPTS];
