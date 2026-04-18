import type { FullLang } from './i18n'
import { resolveLang } from './i18n'

export type GlossaryCategory = 'institution' | 'form' | 'concept' | 'union'

export type GlossaryEntry = {
  id: string
  term: string
  category: GlossaryCategory
  short: string
  long: string
}

type GlossaryMeta = { id: string; term: string; category: GlossaryCategory }

const META: GlossaryMeta[] = [
  { id: 'onem',        term: 'ONEM / RVA',            category: 'institution' },
  { id: 'actiris',     term: 'Actiris',               category: 'institution' },
  { id: 'vdab',        term: 'VDAB',                  category: 'institution' },
  { id: 'forem',       term: 'FOREM',                 category: 'institution' },
  { id: 'adg',         term: 'ADG',                   category: 'institution' },
  { id: 'capac',       term: 'Capac / HVW',           category: 'institution' },
  { id: 'csc',         term: 'CSC / ACV',             category: 'union'       },
  { id: 'fgtb',        term: 'FGTB / ABVV',           category: 'union'       },
  { id: 'cgslb',       term: 'CGSLB / ACLVB',         category: 'union'       },
  { id: 'c1',          term: 'C1',                    category: 'form'        },
  { id: 'c4',          term: 'C4',                    category: 'form'        },
  { id: 'c131a',       term: 'C131A',                 category: 'form'        },
  { id: 'c3',          term: 'C3',                    category: 'form'        },
  { id: 'degressivite',term: 'Dégressivité',          category: 'concept'     },
  { id: 'stage',       term: "Stage d'insertion",     category: 'concept'     },
  { id: 'chef',        term: 'Chef de ménage',        category: 'concept'     },
  { id: 'isole',       term: 'Isolé',                 category: 'concept'     },
  { id: 'cohab',       term: 'Cohabitant',            category: 'concept'     },
  { id: 'refperiod',   term: 'Période de référence',  category: 'concept'     },
  { id: 'dispo',       term: 'Disponibilité active',  category: 'concept'     },
]

type Defs = Record<string, { short: string; long: string }>

const DEFS: Record<FullLang, Defs> = {
  fr: {
    onem:        { short: "Office national de l'emploi — autorité fédérale qui décide de vos droits.", long: "L'ONEM décide si vous avez droit aux allocations, contrôle la disponibilité des chômeurs et applique les sanctions éventuelles. Ce sont ensuite les organismes de paiement (CSC, FGTB, CGSLB ou Capac) qui versent effectivement les montants." },
    actiris:     { short: "Service public bruxellois de l'emploi et de la formation professionnelle.", long: "Actiris gère l'inscription des demandeurs d'emploi en Région bruxelloise, leur accompagnement et le suivi de la disponibilité. Tout chômeur domicilié à Bruxelles doit s'y inscrire dans les 8 jours ouvrés suivant la fin de son contrat." },
    vdab:        { short: "Service flamand de l'emploi et de la formation professionnelle.", long: "La VDAB gère l'inscription et le suivi des demandeurs d'emploi en Région flamande. Elle assure le contrôle de la disponibilité active et propose des formations pour faciliter le retour à l'emploi." },
    forem:       { short: "Office wallon de la formation professionnelle et de l'emploi.", long: "Le FOREM gère l'inscription et le suivi des demandeurs d'emploi en Région wallonne. L'inscription est obligatoire dans les 8 jours ouvrés suivant la fin du contrat pour les résidents wallons." },
    adg:         { short: "Service régional pour les résidents de la Communauté germanophone.", long: "L'ADG (Arbeitsamt der Deutschsprachigen Gemeinschaft) remplit les mêmes fonctions qu'Actiris, le VDAB ou le FOREM pour les résidents des Cantons de l'Est. Les chômeurs germanophones s'y inscrivent dans les 8 jours ouvrés." },
    capac:       { short: "Caisse auxiliaire de paiement — organisme public, sans affiliation syndicale.", long: "La Capac est l'organisme de paiement public belge non lié à un syndicat. Tout chômeur non affilié à une caisse syndicale peut choisir la Capac pour recevoir ses allocations. Le dossier est traité de la même manière que chez les autres organismes." },
    csc:         { short: "Confédération des syndicats chrétiens — plus grande caisse de paiement belge.", long: "La CSC (ACV en néerlandais) est le plus grand syndicat belge. Sa caisse de paiement verse les allocations aux membres affiliés. L'affiliation à la caisse est possible indépendamment de l'appartenance syndicale." },
    fgtb:        { short: "Fédération générale du travail de Belgique — deuxième caisse de paiement.", long: "La FGTB (ABVV en néerlandais) est le deuxième syndicat belge. Sa caisse verse les allocations aux affiliés ayant choisi cet organisme. Traditionnellement présente dans l'industrie et les services publics." },
    cgslb:       { short: "Centrale générale des syndicats libéraux — troisième caisse de paiement.", long: "La CGSLB (ACLVB en néerlandais) est le troisième syndicat belge reconnu. Sa caisse de paiement est ouverte aux chômeurs affiliés. Elle se distingue par son positionnement libéral et sa taille plus modeste." },
    c1:          { short: "Formulaire de demande d'allocations de chômage.", long: "Le C1 est introduit auprès de votre organisme de paiement avec votre C4, carte d'identité et preuve d'inscription au service régional. Délai : 36 mois après la fin du contrat." },
    c4:          { short: "Attestation de chômage complet délivrée obligatoirement par l'employeur.", long: "Le C4 mentionne la nature et les motifs de la fin du contrat. Sans ce document, votre organisme ne peut traiter votre demande. L'employeur est légalement obligé de vous le remettre ; en cas de refus, l'ONEM peut intervenir." },
    c131a:       { short: "Carte de contrôle mensuelle — à tenir à jour pour chaque journée d'indisponibilité.", long: "Chaque jour d'indisponibilité (travail, maladie, vacances…) doit être biffé sur cette carte. Une case non biffée équivaut à une journée d'allocation perçue. Toute erreur peut entraîner un indu à rembourser." },
    c3:          { short: "Formulaire de déclaration de situation familiale.", long: "Le C3 détermine votre catégorie (chef de ménage, isolé ou cohabitant) et donc le taux de vos allocations. Il doit être mis à jour dès que votre situation change (mariage, séparation, naissance…)." },
    degressivite:{ short: "Diminution progressive des allocations dans le temps.", long: "La dégressivité divise le chômage en trois phases : phase 1 (taux élevé, en général 65 % du salaire de référence), phase 2 (taux intermédiaire) et phase 3 (forfait minimal). La réforme 2025 a rallongé la phase 1 pour les travailleurs avec une longue carrière." },
    stage:       { short: "Période d'attente après les études avant l'accès aux allocations d'insertion.", long: "Sa durée est de 310 jours. Le jeune doit s'inscrire comme demandeur d'emploi et effectuer des démarches actives. À l'issue du stage, s'il est toujours sans emploi, il peut introduire une demande d'allocations d'insertion." },
    chef:        { short: "Catégorie familiale — personne à charge sous son toit, taux le plus élevé.", long: "Le chef de ménage a droit au taux de 65 % en phase 1, majoré de 10 %. Cette catégorie couvre les situations où un conjoint sans revenus suffisants ou des enfants à charge vivent sous le même toit. Les critères ont été affinés par la réforme 2025." },
    isole:       { short: "Chômeur vivant seul, sans personne à charge.", long: "L'isolé bénéficie d'un taux de 65 % en phase 1, sans le supplément de chef de ménage. La distinction entre isolé et cohabitant est déterminante pour le calcul du montant des allocations." },
    cohab:       { short: "Chômeur vivant avec d'autres personnes dont les revenus dépassent un seuil.", long: "Le cohabitant bénéficie du taux le plus bas : 60 % en phase 1. La réforme 2025 a précisé les critères de revenus permettant de déterminer si la cohabitation entraîne cette classification." },
    refperiod:   { short: "Fenêtre temporelle dans laquelle vous devez avoir travaillé suffisamment.", long: "Elle varie selon l'âge : 27 mois pour les moins de 36 ans (312 jours requis), 36 mois pour les 36–49 ans (468 jours), 42 mois pour les 50 ans et plus (624 jours). Ces valeurs résultent de la réforme 2025." },
    dispo:       { short: "Obligation de rechercher activement un emploi pour conserver ses droits.", long: "Elle se traduit par des candidatures régulières, des formations et des entretiens de suivi obligatoires avec le service régional. Depuis la réforme 2025, ces entretiens ont lieu tous les 4 mois (contre 12 auparavant). Le non-respect peut entraîner une suspension temporaire des allocations." },
  },

  nl: {
    onem:        { short: 'Rijksdienst voor Arbeidsvoorziening — federale instantie die uw uitkeringsrecht beslist.', long: 'De RVA beslist over uw recht op uitkering, controleert de beschikbaarheid van werklozen en legt sancties op. De uitbetalingsinstellingen (ACV, ABVV, ACLVB of HVW) betalen de uitkeringen effectief uit.' },
    actiris:     { short: 'Gewestelijke dienst voor arbeidsbemiddeling in het Brussels Hoofdstedelijk Gewest.', long: 'Werklozen met woonplaats in Brussel moeten zich binnen 8 werkdagen na het einde van hun contract inschrijven. Actiris begeleidt werkzoekenden en volgt de actieve beschikbaarheid op.' },
    vdab:        { short: 'Vlaamse Dienst voor Arbeidsbemiddeling en Beroepsopleiding.', long: 'Werklozen in het Vlaamse Gewest zijn verplicht zich aan te melden. De VDAB controleert de actieve beschikbaarheid via verplichte gesprekken en biedt een breed aanbod aan opleidingen en vacatures.' },
    forem:       { short: 'Waals agentschap voor beroepsopleiding en arbeidsbemiddeling.', long: 'Werklozen in het Waals Gewest schrijven zich verplicht in binnen 8 werkdagen na het einde van hun contract. Het FOREM begeleidt werkzoekenden en helpt bij terugkeer naar de arbeidsmarkt.' },
    adg:         { short: 'Regionaal arbeidsagentschap voor de Duitstalige Gemeenschap (Oostkantons).', long: 'Het ADG vervult dezelfde rol als Actiris, VDAB of FOREM voor inwoners van de Duitstalige Gemeenschap. Werklozen melden zich aan binnen 8 werkdagen na het verlies van hun baan.' },
    capac:       { short: 'Hulpkas voor Werkloosheidsuitkeringen — openbare, niet-vakbondsgebonden uitbetalingsinstelling.', long: 'Elke werkloze die niet bij een vakbondskassa is aangesloten, kan terecht bij de HVW. De procedure is identiek aan die van vakbondskassen.' },
    csc:         { short: 'Algemeen Christelijk Vakverbond — grootste vakbond met uitbetalingskassa.', long: 'Het ACV is de grootste vakbond van België. Zijn kassa betaalt werkloosheidsuitkeringen uit aan aangesloten leden. Aansluiting bij de kassa is mogelijk ongeacht de vakbondslidmaatschap.' },
    fgtb:        { short: 'Algemeen Belgisch Vakverbond — tweede vakbond met uitbetalingskassa.', long: 'Het ABVV is de tweede vakbond van het land. Zijn kassa betaalt uitkeringen uit aan aangesloten werklozen. Traditioneel sterk aanwezig in de industrie en de openbare sector.' },
    cgslb:       { short: 'Algemene Centrale der Liberale Vakbonden — derde erkende vakbond.', long: 'De ACLVB is de derde Belgische vakbond. Zijn uitbetalingskassa staat open voor werklozen die voor dit organisme kiezen. Kleinere en liberaler dan het ACV en ABVV.' },
    c1:          { short: 'Aanvraagformulier voor werkloosheidsuitkering.', long: 'Het C1-formulier wordt ingediend bij uw uitbetalingsinstelling samen met uw C4, identiteitskaart en bewijs van inschrijving bij de gewestelijke dienst. Uiterste termijn: 36 maanden na het einde van het contract.' },
    c4:          { short: 'Attest van volledige werkloosheid — verplicht te overhandigen door de werkgever.', long: 'Het C4 vermeldt de aard en de redenen van de beëindiging. Zonder dit document kan uw uitbetalingsinstelling uw aanvraag niet behandelen. Bij weigering van de werkgever kan de RVA tussenkomen.' },
    c131a:       { short: 'Maandelijkse controlekaart — verplicht bij te houden voor elke dag van onbeschikbaarheid.', long: 'Elke dag van onbeschikbaarheid (werk, ziekte, vakantie...) moet worden doorgestreept. Een niet doorgestreept vakje staat gelijk aan een ontvangen uitkeringsdag. Vergissingen leiden tot een bedrag dat terugbetaald moet worden.' },
    c3:          { short: 'Verklaring van gezinssituatie — bepaalt uw uitkeringscategorie.', long: 'Het C3-formulier bepaalt uw categorie (gezinshoofd, alleenstaande of samenwonende) en dus uw uitkeringspercentage. U werkt het bij telkens uw situatie verandert.' },
    degressivite:{ short: 'Progressieve vermindering van uitkeringen naarmate de werkloosheid langer duurt.', long: 'Het systeem omvat drie fasen: fase 1 (hoogste percentage, doorgaans 65%), fase 2 (tussenliggende) en fase 3 (minimumforfait). De hervorming 2025 verlengde fase 1 voor werknemers met een lange carrière.' },
    stage:       { short: 'Verplichte wachttijd na de studies voor toegang tot inschakelingsuitkering.', long: 'De inschakelingsperiode duurt 310 dagen en vereist actieve inschrijving als werkzoekende. Na afloop kunnen jongeren die nog werkloos zijn een uitkeringsaanvraag indienen.' },
    chef:        { short: 'Gezinssituatie met persoon ten laste — geeft recht op het hoogste uitkeringspercentage.', long: 'Gezinshoofden ontvangen 65% in fase 1 plus een toeslag van 10%. De precieze criteria werden verfijnd door de hervorming van 2025.' },
    isole:       { short: 'Werkloze die alleen woont zonder personen ten laste.', long: 'Alleenstaanden ontvangen 65% in fase 1, zonder de toeslag voor gezinshoofden. Het onderscheid met de samenwonende categorie bepaalt rechtstreeks het uitkeringsbedrag.' },
    cohab:       { short: 'Werkloze die samenwoont met personen met voldoende inkomen.', long: 'Samenwonenden ontvangen het laagste percentage: 60% in fase 1. De hervorming 2025 preciseerde de inkomenscriteria om te bepalen of samenwoning leidt tot deze classificatie.' },
    refperiod:   { short: 'Tijdvenster waarbinnen u voldoende werkdagen moet aantonen voor uw rechten.', long: 'Varieert per leeftijd: 27 maanden voor min-36-jarigen (312 dagen), 36 maanden voor 36–49-jarigen (468 dagen), 42 maanden voor 50-plussers (624 dagen). Resultaat van de hervorming 2025.' },
    dispo:       { short: 'Verplichting om actief werk te zoeken als voorwaarde voor het behoud van uitkering.', long: 'Omvat regelmatige sollicitaties, opleidingen en verplichte opvolgingsgesprekken. Sinds de hervorming 2025 vinden deze gesprekken elke 4 maanden plaats (vroeger elk 12 maanden). Niet-naleving kan tijdelijke schorsing veroorzaken.' },
  },

  de: {
    onem:        { short: 'Landesamt für Arbeitsbeschaffung — Bundesbehörde, die über Ihren Leistungsanspruch entscheidet.', long: 'Das LfA entscheidet über den Leistungsanspruch, kontrolliert die aktive Verfügbarkeit der Arbeitslosen und verhängt Sanktionen. Die Zahlstellen (ACV, ABVV, ACLVB oder Hilfskasse) zahlen die Leistungen tatsächlich aus.' },
    actiris:     { short: 'Regionaler Beschäftigungsdienst der Brüsseler Hauptstadtregion.', long: 'Arbeitslose mit Wohnsitz in Brüssel müssen sich innerhalb von 8 Werktagen nach Vertragsende anmelden. Actiris überwacht die aktive Verfügbarkeit und bietet Berufsausbildungen an.' },
    vdab:        { short: 'Flämischer Dienst für Arbeitsvermittlung und Berufsausbildung.', long: 'Die VDAB ist für alle Arbeitslosen in der Flämischen Region zuständig. Sie überwacht die aktive Verfügbarkeit durch Pflichtgespräche und bietet ein breites Aus- und Weiterbildungsangebot.' },
    forem:       { short: 'Wallonische Agentur für Berufsausbildung und Beschäftigung.', long: 'Arbeitslose in der Wallonischen Region melden sich innerhalb von 8 Werktagen nach Vertragsende an. Das FOREM begleitet Arbeitssuchende und fördert ihre Rückkehr in den Arbeitsmarkt.' },
    adg:         { short: 'Arbeitsamt der Deutschsprachigen Gemeinschaft — zuständig für die Ostkantons.', long: 'Das ADG erfüllt dieselben Aufgaben wie Actiris, VDAB oder FOREM für die Deutschsprachige Gemeinschaft Belgiens. Arbeitslose melden sich innerhalb von 8 Werktagen nach Stellenverlust an.' },
    capac:       { short: 'Hilfskasse für Arbeitslosenunterstützung — öffentliche, gewerkschaftsunabhängige Zahlstelle.', long: 'Jeder Arbeitslose ohne Gewerkschaftsanschluss kann die Hilfskasse wählen. Das Verfahren unterscheidet sich nicht von dem der Gewerkschaftskassen.' },
    csc:         { short: 'Christlicher Gewerkschaftsbund — größte Gewerkschaft mit Zahlstelle.', long: 'Der CSC/ACV ist die größte Gewerkschaft Belgiens. Seine Kasse zahlt Leistungen an Mitglieder aus. Ein Beitritt ist unabhängig von der Gewerkschaftsmitgliedschaft möglich.' },
    fgtb:        { short: 'Allgemeiner Belgischer Gewerkschaftsbund — zweitgrößte Gewerkschaft.', long: 'Die FGTB/ABVV ist die zweitgrößte belgische Gewerkschaft. Ihre Kasse zahlt Leistungen an angeschlossene Arbeitslose. Traditionell stark in der Industrie und im öffentlichen Dienst.' },
    cgslb:       { short: 'Zentralverband liberaler Gewerkschaften — drittgrößte Gewerkschaft.', long: 'Die CGSLB/ACLVB ist die dritte anerkannte belgische Gewerkschaft mit eigener Zahlstelle. Liberal ausgerichtet und kleiner als CSC und FGTB.' },
    c1:          { short: 'Antrag auf Arbeitslosenleistungen — einzureichen bei der Zahlstelle.', long: 'Das C1-Formular wird mit C4, Personalausweis und Anmeldebeleg beim regionalen Dienst eingereicht. Frist: 36 Monate nach Vertragsende.' },
    c4:          { short: 'Bescheinigung vollständiger Arbeitslosigkeit — vom Arbeitgeber auszustellen.', long: 'Das C4 gibt Art und Gründe der Vertragsbeendigung an. Ohne C4 kann die Zahlstelle den Antrag nicht bearbeiten. Bei Verweigerung des Arbeitgebers kann das LfA eingreifen.' },
    c131a:       { short: 'Monatliche Kontrollkarte — tägliche Verfügbarkeitsmeldung.', long: 'Jeder Tag der Nichtverfügbarkeit ist zu durchstreichen. Ein nicht durchgestrichenes Kästchen gilt als bezogene Leistung. Fehler können zu einer Rückforderung führen.' },
    c3:          { short: 'Erklärung zur Familiensituation — bestimmt die Leistungskategorie.', long: 'Das C3-Formular legt die Kategorie (Haushaltsvorstand, Alleinstehend oder Zusammenlebend) und den Leistungssatz fest. Bei Änderungen der Familiensituation ist es zu aktualisieren.' },
    degressivite:{ short: 'Schrittweise Verringerung der Leistungen im Laufe der Arbeitslosigkeit.', long: 'Drei Phasen: Phase 1 (höchster Satz, i.d.R. 65 %), Phase 2 (mittlerer Satz), Phase 3 (Mindestpauschale). Die Reform 2025 verlängerte Phase 1 für Arbeitnehmer mit langer Laufbahn.' },
    stage:       { short: 'Wartezeit nach dem Studienabschluss vor dem Zugang zu Eingliederungsleistungen.', long: 'Die Eingliederungszeit dauert 310 Tage und setzt aktive Anmeldung als Arbeitsuchender voraus. Danach können Berufsanfänger, die noch keine Stelle haben, Leistungen beantragen.' },
    chef:        { short: 'Haushaltsvorstand — unterhaltsberechtigte Person im Haushalt, höchster Leistungssatz.', long: 'Haushaltsvorstände erhalten 65 % in Phase 1 zuzüglich 10 % Zuschlag. Die genauen Kriterien wurden durch die Reform 2025 präzisiert.' },
    isole:       { short: 'Alleinstehender Arbeitsloser ohne unterhaltsberechtigte Personen.', long: 'Alleinstehende erhalten 65 % in Phase 1 ohne den Haushaltsvorstandszuschlag. Die Abgrenzung zum Zusammenlebenden beeinflusst direkt die Leistungshöhe.' },
    cohab:       { short: 'Arbeitsloser, der mit Personen mit ausreichendem Einkommen zusammenlebt.', long: 'Zusammenlebende haben den niedrigsten Satz: 60 % in Phase 1. Die Reform 2025 präzisierte die Einkommensgrenzen für diese Einstufung.' },
    refperiod:   { short: 'Zeitfenster, in dem ausreichend Arbeitstage nachgewiesen werden müssen.', long: '27 Monate für unter 36-Jährige (312 Tage), 36 Monate für 36–49-Jährige (468 Tage), 42 Monate für 50-Jährige und Ältere (624 Tage). Ergebnis der Reform 2025.' },
    dispo:       { short: 'Pflicht zur aktiven Arbeitsuche als Voraussetzung für den Leistungsbezug.', long: 'Umfasst regelmäßige Bewerbungen, Weiterbildungen und Pflichtgespräche beim regionalen Dienst. Seit der Reform 2025 alle 4 Monate (vorher alle 12 Monate). Nichteinhaltung kann zu vorübergehender Aussetzung führen.' },
  },

  en: {
    onem:        { short: 'National Employment Office — federal authority deciding your benefit entitlement.', long: 'ONEM/RVA decides whether you are entitled to benefits, monitors job-seekers availability and applies sanctions where necessary. Payment institutions (CSC, FGTB, CGSLB or Capac) handle the actual disbursement.' },
    actiris:     { short: 'Regional public employment service for the Brussels-Capital Region.', long: 'Unemployed people living in Brussels must register within 8 working days of their contract ending. Actiris monitors active availability and provides job-search support and vocational training.' },
    vdab:        { short: 'Flemish public employment and vocational training service.', long: 'Registration is mandatory for unemployed people living in the Flemish Region. VDAB monitors active availability through compulsory interviews and offers a wide range of training programmes.' },
    forem:       { short: 'Walloon agency for vocational training and employment.', long: 'Unemployed people in the Walloon Region must register within 8 working days of their contract ending. FOREM supports job-seekers and helps facilitate their return to the labour market.' },
    adg:         { short: 'Labour office for the German-speaking Community (Eastern Cantons).', long: 'ADG fulfils the same role as Actiris, VDAB or FOREM for the German-speaking Community. Unemployed residents must register within 8 working days of losing their job.' },
    capac:       { short: 'Auxiliary Fund for Unemployment Benefits — public institution with no union affiliation.', long: 'Any unemployed person not affiliated with a union fund can choose Capac to receive their benefits. The procedure is identical to that of union funds.' },
    csc:         { short: 'Confederation of Christian Trade Unions — largest union with a payment fund.', long: 'CSC/ACV is Belgium largest trade union. Its payment fund disburses unemployment benefits to affiliated members. Joining the fund is possible independently of union membership.' },
    fgtb:        { short: 'General Federation of Belgian Labour — second-largest union with a payment fund.', long: 'FGTB/ABVV is Belgium second-largest trade union. Its fund disburses benefits to affiliated members. Traditionally strong in industry and the public sector.' },
    cgslb:       { short: 'General Federation of Liberal Trade Unions — third recognised union.', long: 'CGSLB/ACLVB has its own payment fund open to unemployed people regardless of union membership. Known for its liberal orientation and smaller size than CSC and FGTB.' },
    c1:          { short: 'Application form for unemployment benefits — filed with your payment institution.', long: 'Form C1 is filed together with your C4, identity card and proof of registration with the regional employment service. Deadline: 36 months after the contract ends.' },
    c4:          { short: 'Full unemployment certificate — mandatory document issued by the employer.', long: 'The C4 states the nature and reasons for the contract termination. Without a C4, your payment institution cannot process your claim. If your employer refuses, ONEM/RVA can intervene.' },
    c131a:       { short: 'Monthly control card — daily availability and activity declaration.', long: 'Each day of unavailability (work, illness, holidays…) must be crossed out. An uncrossed box equals one benefit day received. Errors can result in an overpayment to be repaid.' },
    c3:          { short: 'Family situation declaration — determines your benefit category.', long: 'Form C3 determines your category (household head, single or cohabitant) and your benefit rate. It must be updated whenever your situation changes (marriage, separation, birth…).' },
    degressivite:{ short: 'Progressive reduction of benefits the longer unemployment lasts.', long: 'Three phases: phase 1 (highest rate, generally 65% of the reference wage), phase 2 (intermediate) and phase 3 (minimum flat rate). The 2025 reform extended phase 1 for workers with long careers.' },
    stage:       { short: 'Waiting period after studies before access to insertion benefits.', long: 'The insertion period lasts 310 days and requires active registration as a job-seeker. After this period, those still unemployed may apply for benefits.' },
    chef:        { short: 'Household head — dependant in the home, entitles you to the highest benefit rate.', long: 'Household heads receive 65% in phase 1 plus a 10% supplement. The exact criteria were refined by the 2025 reform.' },
    isole:       { short: 'Unemployed person living alone with no dependants.', long: 'Single people receive 65% in phase 1 without the household-head supplement. The distinction from the cohabitant category directly affects the benefit amount.' },
    cohab:       { short: 'Unemployed person living with others whose income exceeds a threshold.', long: 'Cohabitants receive the lowest rate: 60% in phase 1. The 2025 reform clarified the income criteria used to determine whether cohabitation triggers this classification.' },
    refperiod:   { short: 'Time window in which you must prove sufficient working days to qualify.', long: '27 months for under-36s (312 days required), 36 months for 36–49-year-olds (468 days), 42 months for those aged 50 and over (624 days). These figures stem from the 2025 reform.' },
    dispo:       { short: 'Obligation to actively seek work as a condition for receiving benefits.', long: 'Involves regular applications, training and compulsory follow-up interviews with the regional service. Since the 2025 reform, interviews take place every 4 months (previously every 12 months). Non-compliance can trigger temporary suspension.' },
  },

  ar: {
    onem:        { short: 'المكتب الوطني للتشغيل — الهيئة الفيدرالية التي تقرر حقك في التعويض.', long: 'يقرر ONEM منح التعويضات، ويراقب التوفر الفعلي للعاطلين، ويفرض العقوبات عند الاقتضاء. تتولى هيئات الدفع (صناديق النقابات أو Capac) صرف المبالغ فعلياً.' },
    actiris:     { short: 'خدمة التشغيل الإقليمية العامة في منطقة بروكسل العاصمة.', long: 'يجب على العاطلين المقيمين في بروكسل التسجيل خلال 8 أيام عمل من انتهاء عقدهم. يتابع Actiris التوفر الفعلي ويوفر دعم البحث عن عمل والتدريب المهني.' },
    vdab:        { short: 'خدمة التشغيل والتدريب المهني الفلمنكية.', long: 'يُلزم العاطلون المقيمون في فلاندر بالتسجيل إلزامياً. تراقب VDAB التوفر الفعلي عبر مقابلات إلزامية وتقدم برامج تدريبية متنوعة.' },
    forem:       { short: 'الوكالة الوالونية للتدريب المهني والتشغيل.', long: 'يتعين على العاطلين في إقليم والوني التسجيل خلال 8 أيام عمل من انتهاء العقد. يدعم FOREM الباحثين عن عمل ويعزز عودتهم إلى سوق العمل.' },
    adg:         { short: 'مكتب العمل للمجتمع الناطق بالألمانية في الكانتونات الشرقية.', long: 'يضطلع ADG بنفس مهام Actiris وVDAB وFOREM في منطقته. يجب على العاطلين التسجيل خلال 8 أيام عمل من فقدان وظيفتهم.' },
    capac:       { short: 'صندوق مساعدة لتعويضات البطالة — هيئة دفع عامة غير نقابية.', long: 'يمكن لأي عاطل غير منتسب إلى صندوق نقابي اختيار Capac. الإجراء مطابق لإجراءات الصناديق النقابية.' },
    csc:         { short: 'الاتحاد العام للنقابات المسيحية — أكبر نقابة مع صندوق دفع.', long: 'CSC/ACV هو أكبر نقابة في بلجيكا. يصرف صندوقه تعويضات البطالة للأعضاء المنتسبين. الانضمام إلى الصندوق ممكن بصرف النظر عن العضوية النقابية.' },
    fgtb:        { short: 'الاتحاد العام للعمال البلجيكيين — ثاني أكبر نقابة مع صندوق دفع.', long: 'FGTB/ABVV هو ثاني أكبر نقابة بلجيكية. يصرف صندوقه التعويضات للأعضاء المنتسبين. حضور تقليدي قوي في قطاعي الصناعة والخدمات العامة.' },
    cgslb:       { short: 'الاتحاد العام للنقابات الليبرالية — ثالث نقابة معترف بها.', long: 'CGSLB/ACLVB لديها صندوق دفع خاص. يمكن للعاطلين اختياره بغض النظر عن الانتساب النقابي. أصغر من CSC وFGTB وذات توجه ليبرالي.' },
    c1:          { short: 'استمارة طلب تعويض البطالة — تُقدَّم إلى هيئة الدفع.', long: 'تُرفق بها C4 وبطاقة الهوية وإثبات التسجيل لدى خدمة التشغيل الإقليمية. الأجل: 36 شهراً من انتهاء العقد.' },
    c4:          { short: 'شهادة البطالة الكاملة — وثيقة إلزامية يسلمها صاحب العمل.', long: 'تتضمن طبيعة وأسباب إنهاء العقد. بدون C4 لا تستطيع هيئة الدفع معالجة طلبك. في حالة الرفض يمكن لـ ONEM التدخل.' },
    c131a:       { short: 'بطاقة التحكم الشهرية — تُشطب فيها كل أيام عدم التوفر.', long: 'كل يوم عدم توفر (عمل، مرض، إجازة...) يُشطب. خانة غير مشطوبة تعادل يوم تعويض مستلَم. الأخطاء قد تؤدي إلى استرداد مبالغ.' },
    c3:          { short: 'إعلان الوضع العائلي — يحدد فئة تعويضك.', long: 'يحدد فئتك (ربّ أسرة، منفرد، أو مشارك في السكن) ونسبة تعويضك. يجب تحديثه عند أي تغيير في وضعك.' },
    degressivite:{ short: 'التخفيض التدريجي للتعويضات كلما طال أمد البطالة.', long: 'ثلاث مراحل: المرحلة 1 (أعلى نسبة، عادةً 65٪)، ثم المرحلة 2 (متوسطة)، فالمرحلة 3 (حد أدنى ثابت). مدّد إصلاح 2025 مدة المرحلة 1 للعمال ذوي المسيرة الطويلة.' },
    stage:       { short: 'فترة الانتظار بعد الدراسة قبل الحصول على تعويضات الإدماج.', long: 'مدتها 310 أيام وتستوجب التسجيل النشط بوصفهم باحثين عن عمل. بعد انقضائها يمكن للشباب الخريجين العاطلين تقديم طلب التعويض.' },
    chef:        { short: 'ربّ أسرة — شخص في عهدته تحت سقف واحد، أعلى نسبة تعويض.', long: 'يستفيد ربّ الأسرة من 65٪ في المرحلة 1 مع علاوة 10٪. دُقِّقَت المعايير بموجب إصلاح 2025.' },
    isole:       { short: 'عاطل يعيش منفرداً بدون أشخاص في عهدته.', long: 'يستفيد المنفرد من 65٪ في المرحلة 1 دون علاوة ربّ الأسرة. التمييز عن فئة المشارك في السكن يؤثر مباشرة على مبلغ التعويض.' },
    cohab:       { short: 'عاطل يتشارك السكن مع أشخاص ذوي دخل يتجاوز عتبة محددة.', long: 'أدنى نسبة تعويض: 60٪ في المرحلة 1. وضّح إصلاح 2025 معايير الدخل المستخدمة لتحديد ما إذا كانت المشاركة تؤدي إلى هذا التصنيف.' },
    refperiod:   { short: 'النافذة الزمنية التي يجب خلالها إثبات أيام عمل كافية للحصول على الحقوق.', long: '27 شهراً لمن هم دون 36 عاماً (312 يوماً)، 36 شهراً للفئة 36-49 (468 يوماً)، 42 شهراً للذين يبلغون 50 فأكثر (624 يوماً). نتاج إصلاح 2025.' },
    dispo:       { short: 'إلزامية البحث الفعّال عن عمل كشرط للحفاظ على التعويض.', long: 'تقديم طلبات منتظمة وتدريب ومقابلات متابعة إلزامية مع خدمة التشغيل. منذ إصلاح 2025، كل 4 أشهر (مقابل كل 12 شهراً سابقاً). عدم الامتثال قد يؤدي إلى تعليق مؤقت.' },
  },
}

export function getGlossary(code: string): GlossaryEntry[] {
  const lang = resolveLang(code)
  const defs = DEFS[lang]
  return META.map(m => ({ ...m, ...defs[m.id] }))
}
