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
  {
    id: "fd-09",
    section: "A",
    title: "Cambriolage à la bijouterie",
    consigne: "Continuez ce fait divers de presse locale.",
    amorce:
      "Une bijouterie du centre-ville a été cambriolée dans la nuit de samedi à dimanche. Les auteurs auraient agi en moins de quatre minutes, selon les premières constatations des enquêteurs...",
    contexteHints: [
      "Décrivez le mode opératoire des cambrioleurs.",
      "Donnez la valeur estimée du butin.",
      "Évoquez les caméras de surveillance et l'enquête en cours.",
    ],
    expectedTense: "passé composé / conditionnel",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
  {
    id: "fd-10",
    section: "A",
    title: "Effondrement d'un balcon",
    consigne: "Poursuivez l'article en gardant un ton neutre et factuel.",
    amorce:
      "Un balcon s'est partiellement effondré jeudi en fin d'après-midi dans un immeuble du quartier historique. Plusieurs personnes se trouvaient à proximité au moment des faits...",
    contexteHints: [
      "Précisez le bilan humain et matériel.",
      "Mentionnez l'intervention des secours.",
      "Évoquez l'enquête sur la vétusté du bâtiment.",
    ],
    expectedTense: "passé composé / imparfait",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
  {
    id: "fd-11",
    section: "A",
    title: "Inondation dans un village",
    consigne: "Continuez ce reportage sur les intempéries.",
    amorce:
      "Le village de Saint-Léonard a été partiellement inondé samedi matin à la suite de pluies torrentielles. Plusieurs foyers ont été évacués par les autorités...",
    contexteHints: [
      "Décrivez l'ampleur des dégâts matériels.",
      "Mentionnez le nombre de personnes relogées.",
      "Citez le maire ou un sinistré.",
    ],
    expectedTense: "passé composé / présent",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
  {
    id: "fd-12",
    section: "A",
    title: "Disparition résolue",
    consigne: "Poursuivez l'article qui clôt une affaire de disparition.",
    amorce:
      "Disparue depuis trois jours, une adolescente de 15 ans a été retrouvée saine et sauve mardi soir dans une commune voisine. Sa famille avait lancé un appel à témoins largement relayé sur les réseaux sociaux...",
    contexteHints: [
      "Décrivez les circonstances de sa découverte.",
      "Mentionnez la mobilisation citoyenne.",
      "Citez la déclaration des proches ou des gendarmes.",
    ],
    expectedTense: "passé composé / plus-que-parfait",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
  {
    id: "fd-13",
    section: "A",
    title: "Accident sur l'autoroute",
    consigne: "Continuez l'article en respectant le style journalistique.",
    amorce:
      "Une collision impliquant trois véhicules s'est produite vendredi matin sur l'autoroute A6, peu après le péage de Fleury. La circulation a été interrompue dans les deux sens pendant plus de deux heures...",
    contexteHints: [
      "Donnez le bilan humain (blessés, état).",
      "Décrivez l'intervention des secours et de la gendarmerie.",
      "Évoquez les conditions météorologiques ou de visibilité.",
    ],
    expectedTense: "passé composé / imparfait",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
  {
    id: "fd-14",
    section: "A",
    title: "Panne géante d'électricité",
    consigne: "Poursuivez ce fait divers urbain.",
    amorce:
      "Une panne de courant a plongé dans le noir une grande partie de l'agglomération lyonnaise mercredi soir, vers 19 h. Plusieurs milliers de foyers ont été touchés...",
    contexteHints: [
      "Décrivez les conséquences sur les transports et les commerces.",
      "Mentionnez l'origine probable de la panne.",
      "Précisez la durée et le rétablissement.",
    ],
    expectedTense: "passé composé / imparfait",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
  {
    id: "fd-15",
    section: "A",
    title: "Manifestation pacifique",
    consigne: "Continuez l'article sur la mobilisation citoyenne.",
    amorce:
      "Près de 5 000 personnes ont défilé samedi après-midi dans les rues de Bordeaux pour réclamer une meilleure prise en charge des transports publics. La marche, organisée par un collectif d'usagers, s'est déroulée dans le calme...",
    contexteHints: [
      "Décrivez le parcours et l'ambiance.",
      "Citez un porte-parole et un manifestant.",
      "Évoquez la réaction des autorités.",
    ],
    expectedTense: "passé composé / présent",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
  {
    id: "fd-16",
    section: "A",
    title: "Vol de vélos en série",
    consigne: "Poursuivez ce fait divers sur une affaire en cours.",
    amorce:
      "Plus de 30 vélos ont été dérobés en l'espace d'une semaine dans le quartier universitaire. Les victimes, en majorité des étudiants, ont déposé plainte au commissariat...",
    contexteHints: [
      "Décrivez le mode opératoire (lieux, horaires).",
      "Mentionnez l'enquête et les pistes envisagées.",
      "Donnez des conseils de prévention citoyens.",
    ],
    expectedTense: "passé composé / présent",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
  {
    id: "fd-17",
    section: "A",
    title: "Chute spectaculaire d'un arbre",
    consigne: "Continuez ce fait divers urbain.",
    amorce:
      "Un platane centenaire s'est effondré sur la chaussée mardi en début de matinée, dans une avenue très fréquentée du centre-ville. Aucun blessé n'est à déplorer, mais plusieurs voitures ont été endommagées...",
    contexteHints: [
      "Décrivez les dégâts sur les véhicules et la chaussée.",
      "Mentionnez l'intervention des services techniques.",
      "Évoquez l'origine de la chute (vétusté, intempéries).",
    ],
    expectedTense: "passé composé / imparfait",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
  {
    id: "fd-18",
    section: "A",
    title: "Découverte d'un colis suspect",
    consigne: "Poursuivez l'article sur l'incident sécuritaire.",
    amorce:
      "Un colis suspect a été repéré jeudi matin devant l'entrée d'une école primaire du 15ᵉ arrondissement. Le quartier a été immédiatement bouclé par les forces de l'ordre...",
    contexteHints: [
      "Décrivez l'évacuation et les mesures de sécurité.",
      "Précisez la durée du périmètre et la levée du dispositif.",
      "Citez les autorités sur l'origine du colis.",
    ],
    expectedTense: "passé composé / imparfait",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
  {
    id: "fd-19",
    section: "A",
    title: "Concert improvisé devenu viral",
    consigne: "Continuez ce fait divers culturel.",
    amorce:
      "Un musicien de rue a réuni spontanément plus de 200 personnes dimanche après-midi sur la place du marché. La vidéo de la performance, publiée sur les réseaux sociaux, a dépassé le million de vues en moins de 24 heures...",
    contexteHints: [
      "Décrivez l'ambiance et la réaction du public.",
      "Citez le musicien et un spectateur.",
      "Évoquez les retombées (médiatisation, propositions de concerts).",
    ],
    expectedTense: "passé composé / présent",
    registre: "neutre journalistique",
    minWords: 80,
    durationSeconds: SEC_A_DURATION,
  },
  {
    id: "fd-20",
    section: "A",
    title: "Restaurant fermé pour insalubrité",
    consigne: "Poursuivez l'article sur cette affaire sanitaire.",
    amorce:
      "Un restaurant réputé du centre-ville a été fermé administrativement vendredi matin à la suite d'un contrôle sanitaire jugé alarmant. Plusieurs manquements graves ont été relevés par les inspecteurs...",
    contexteHints: [
      "Détaillez les manquements constatés.",
      "Mentionnez la réaction du gérant.",
      "Précisez la durée de fermeture et les conditions de réouverture.",
    ],
    expectedTense: "passé composé / présent",
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
  {
    id: "ar-09",
    section: "B",
    title: "Intelligence artificielle à l'école",
    consigne:
      "« Les outils d'intelligence artificielle devraient être autorisés en classe pour aider les élèves dans leur apprentissage. » Donnez votre opinion argumentée.",
    contexteHints: [
      "Pesez les bénéfices pédagogiques contre les risques (triche, dépendance).",
      "Évoquez l'égalité d'accès aux outils.",
      "Proposez un cadre d'utilisation raisonnable.",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
  {
    id: "ar-10",
    section: "B",
    title: "Publicité interdite pour les enfants",
    consigne:
      "« Toute publicité destinée aux enfants de moins de 12 ans devrait être interdite à la télévision. » Êtes-vous d'accord ?",
    contexteHints: [
      "Considérez les enjeux de santé et de consommation.",
      "Évoquez la liberté commerciale et le rôle des parents.",
      "Citez des pays ayant adopté ce type de mesure (Suède, Québec).",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
  {
    id: "ar-11",
    section: "B",
    title: "Travail des seniors",
    consigne:
      "« Les entreprises devraient être obligées d'embaucher un pourcentage minimum de personnes de plus de 55 ans. » Donnez votre point de vue.",
    contexteHints: [
      "Évoquez la lutte contre la discrimination par l'âge.",
      "Considérez l'impact économique pour les entreprises.",
      "Proposez des incitations alternatives (allègements fiscaux).",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
  {
    id: "ar-12",
    section: "B",
    title: "Cours de cuisine obligatoire",
    consigne:
      "« Les cours de cuisine et d'éducation alimentaire devraient être obligatoires dans les écoles secondaires. » Quelle est votre position ?",
    contexteHints: [
      "Argumentez sur la santé publique et l'autonomie des jeunes.",
      "Considérez les contraintes pratiques (temps, équipement).",
      "Évoquez le rôle traditionnel de la famille.",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
  {
    id: "ar-13",
    section: "B",
    title: "Quotas féminins en politique",
    consigne:
      "« Les partis politiques devraient présenter autant de femmes que d'hommes aux élections. » Justifiez votre opinion.",
    contexteHints: [
      "Évoquez la sous-représentation actuelle.",
      "Considérez les arguments contre (mérite, choix libre).",
      "Citez des exemples de pays ayant adopté la parité.",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
  {
    id: "ar-14",
    section: "B",
    title: "Sport quotidien obligatoire",
    consigne:
      "« Une heure de sport par jour devrait être obligatoire dans toutes les écoles primaires. » Donnez votre avis argumenté.",
    contexteHints: [
      "Argumentez sur la santé et la lutte contre la sédentarité.",
      "Évoquez l'impact sur le programme académique.",
      "Pensez aux infrastructures nécessaires.",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
  {
    id: "ar-15",
    section: "B",
    title: "Limitation des voyages en avion",
    consigne:
      "« Chaque citoyen devrait être limité à un certain nombre de voyages en avion par an pour préserver le climat. » Êtes-vous favorable à cette mesure ?",
    contexteHints: [
      "Évoquez l'urgence climatique et l'impact du transport aérien.",
      "Considérez la liberté individuelle et l'économie touristique.",
      "Proposez des alternatives (train, taxes carbone).",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
  {
    id: "ar-16",
    section: "B",
    title: "Bénévolat pour étudiants",
    consigne:
      "« Tout étudiant devrait effectuer un minimum de 50 heures de bénévolat par an pour valider son année. » Quelle est votre position ?",
    contexteHints: [
      "Argumentez sur les bénéfices sociaux et personnels.",
      "Considérez la charge de travail des étudiants.",
      "Évoquez la nature volontaire du bénévolat.",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
  {
    id: "ar-17",
    section: "B",
    title: "Caméras de surveillance",
    consigne:
      "« Les villes devraient installer des caméras de surveillance dans tous les espaces publics pour assurer la sécurité. » Donnez votre opinion.",
    contexteHints: [
      "Évoquez la sécurité et la prévention de la criminalité.",
      "Considérez le respect de la vie privée.",
      "Citez des études sur l'efficacité réelle des caméras.",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
  {
    id: "ar-18",
    section: "B",
    title: "Logements vacants",
    consigne:
      "« Les propriétaires de logements vacants depuis plus de deux ans devraient être obligés de les louer. » Justifiez votre point de vue.",
    contexteHints: [
      "Évoquez la crise du logement et l'accès au logement abordable.",
      "Considérez le droit de propriété.",
      "Proposez des solutions alternatives (taxe, incitations).",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
  {
    id: "ar-19",
    section: "B",
    title: "Cours du soir gratuits pour adultes",
    consigne:
      "« L'État devrait financer des cours du soir gratuits pour permettre aux adultes de se former tout au long de leur vie. » Êtes-vous d'accord ?",
    contexteHints: [
      "Argumentez sur la formation continue et l'employabilité.",
      "Évoquez le coût pour les finances publiques.",
      "Citez des exemples internationaux (modèle scandinave).",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
  {
    id: "ar-20",
    section: "B",
    title: "Animaux domestiques en ville",
    consigne:
      "« La possession d'animaux de grande taille (chiens) devrait être interdite dans les appartements en ville. » Quelle est votre position ?",
    contexteHints: [
      "Évoquez le bien-être animal en milieu urbain.",
      "Considérez le droit de chacun de choisir son mode de vie.",
      "Pensez aux conditions concrètes (espace, exercice).",
    ],
    expectedTense: "présent / conditionnel",
    registre: "formel argumentatif",
    minWords: 200,
    durationSeconds: SEC_B_DURATION,
  },
];

export const ALL_PROMPTS: SimulatorPrompt[] = [...FAITS_DIVERS_PROMPTS, ...ARGUMENTATION_PROMPTS];
