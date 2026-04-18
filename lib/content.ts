/* Long-form content per language (FAQ, reform data, news).
   Non-core languages fall back to FR and display the AI-notice banner. */

import type { FullLang } from './i18n'
import { resolveLang } from './i18n'

/* ─── FAQ ────────────────────────────────────────────────────────────── */
export type FAQAnswerBlock = { type: 'p' | 'info'; html: string }
export type FAQItem = { id: string; q: string; a: FAQAnswerBlock[] }
export type FAQGroup = { id: string; icon: string; label: string; items: FAQItem[] }

type FAQDict = Record<FullLang, FAQGroup[]>

export const FAQ_CONTENT: FAQDict = {
  fr: [
    {
      id: 'eligibilite', icon: '🔍', label: 'Droits & éligibilité',
      items: [
        { id: 'e1', q: 'Quelles sont les conditions de base pour avoir droit au chômage ?', a: [
          { type: 'p',    html: 'Pour bénéficier des allocations, vous devez être <strong>involontairement sans travail</strong>, <strong>apte au travail</strong>, et avoir travaillé un <strong>nombre suffisant de jours</strong> : 312 jours pour les <36 ans, 468 jours entre 36 et 49 ans, 624 jours pour les 50+.' },
          { type: 'info', html: '💡 La période de référence a été modifiée par la réforme 2025. <a href="/reforme">Consultez la page Réforme</a> pour connaître l\'impact.' },
        ]},
        { id: 'e2', q: "Quelle est la différence entre l'ONEM et mon organisme de paiement ?", a: [
          { type: 'p', html: "L'<strong>ONEM</strong> (Office National de l'Emploi) <strong>décide</strong> si vous avez droit aux allocations. Votre <strong>organisme de paiement</strong> (CSC, CGSLB, FGTB ou Capac) <strong>verse</strong> effectivement les allocations." },
        ]},
        { id: 'e3', q: "J'ai démissionné. Puis-je quand même toucher le chômage ?", a: [
          { type: 'p', html: "En principe, une démission exclut temporairement des allocations. Exceptions : <strong>motif grave de l'employeur</strong>, raisons familiales impérieuses, ou reprise puis perte d'un nouvel emploi. L'ONEM examine chaque cas." },
        ]},
        { id: 'e4', q: "Combien de temps ai-je pour m'inscrire après la perte de mon emploi ?", a: [
          { type: 'p', html: "Inscrivez-vous auprès de <strong>Actiris, VDAB ou FOREM</strong> dans les <strong>8 jours ouvrés</strong>. Vous avez ensuite <strong>36 mois</strong> pour introduire votre demande d'allocations." },
        ]},
        { id: 'e5', q: 'Puis-je travailler à temps partiel et toucher le chômage ?', a: [
          { type: 'p', html: "Oui, sous conditions. Le statut de <strong>travailleur à temps partiel involontaire</strong> permet de cumuler travail partiel et allocations. Déclarez chaque jour travaillé sur la carte C131A." },
        ]},
      ],
    },
    {
      id: 'montants', icon: '💶', label: 'Montants & calcul',
      items: [
        { id: 'm1', q: 'Comment est calculé le montant de mes allocations ?', a: [
          { type: 'p',    html: 'Calcul sur base de votre <strong>dernier salaire brut</strong>, plafonné. En phase 1 : <strong>65 % du salaire de référence</strong>. Le pourcentage diminue selon la durée et la situation familiale.' },
          { type: 'info', html: '💡 Utilisez notre <a href="/simulation">calculateur</a> pour une estimation personnalisée.' },
        ]},
        { id: 'm2', q: 'Mes allocations sont-elles imposables ?', a: [
          { type: 'p', html: 'Oui. Précompte professionnel de <strong>10,09 %</strong> retenu à la source. À déclarer dans votre déclaration fiscale. Fiche 281.13 fournie par votre organisme.' },
        ]},
        { id: 'm3', q: 'Les allocations diminuent-elles avec le temps ?', a: [
          { type: 'p', html: 'Oui, le système belge est <strong>dégressif</strong> en trois phases. La <a href="/reforme">réforme 2025</a> a rallongé la phase 1 pour les longs parcours professionnels.' },
        ]},
        { id: 'm4', q: 'Existe-t-il des allocations majorées ?', a: [
          { type: 'p', html: "Oui. <strong>+10 %</strong> pour les <strong>chefs de ménage</strong>. Règles spécifiques pour travailleurs âgés, chômeurs avec complément d'entreprise, temps partiels involontaires." },
        ]},
      ],
    },
    {
      id: 'demarches', icon: '📋', label: 'Démarches & formulaires',
      items: [
        { id: 'd1', q: 'À quoi sert le formulaire C4 ?', a: [
          { type: 'p',    html: "<strong>Attestation de chômage complet</strong>, rempli et signé par <strong>votre employeur</strong>. Sans ce document, votre organisme ne peut traiter votre demande." },
          { type: 'info', html: '📝 Notre assistant vérifie que votre C4 est correctement complété.' },
        ]},
        { id: 'd2', q: 'Qu\'est-ce que la carte C131A ?', a: [
          { type: 'p', html: "Document mensuel sur lequel vous <strong>biffez chaque jour d'indisponibilité</strong>. Une case non biffée = une journée d'allocation. Erreur = indu à rembourser." },
        ]},
        { id: 'd3', q: 'Que faire si mon employeur refuse le C4 ?', a: [
          { type: 'p', html: "1) mettez-le en demeure par écrit, 2) contactez votre organisme, 3) portez plainte à l'<strong>Inspection du travail</strong>. Dossier ouvrable sur base d'autres documents en attendant." },
        ]},
        { id: 'd4', q: 'Puis-je faire mes démarches en ligne ?', a: [
          { type: 'p', html: 'Partiellement. Inscription en ligne (myjob.brussels, vdab.be, forem.be). Certains organismes proposent une interface numérique.' },
        ]},
      ],
    },
    {
      id: 'reforme', icon: '⚡', label: 'Réforme 2025',
      items: [
        { id: 'r1', q: 'En quoi la réforme 2025 change-t-elle mes droits ?', a: [
          { type: 'p',    html: 'Modification de la <strong>période de référence</strong>, du <strong>calcul de la dégressivité</strong>, et des <strong>obligations de disponibilité</strong>. <strong>Régime transitoire</strong> pour les dossiers en cours.' },
          { type: 'info', html: '📖 <a href="/reforme">Consultez la page Réforme 2025</a> pour l\'analyse complète.' },
        ]},
        { id: 'r2', q: 'Si mon dossier est ouvert, la réforme me concerne-t-elle ?', a: [
          { type: 'p', html: "Les droits <strong>acquis avant janvier 2025</strong> sont maintenus par un régime transitoire. Lors d'une révision, les nouvelles règles s'appliquent intégralement." },
        ]},
        { id: 'r3', q: 'Quelles sont les nouvelles obligations de disponibilité ?', a: [
          { type: 'p', html: "Suivi <strong>plus intensif</strong> : entretiens tous les 4 mois (vs 12 avant). Non-respect = <strong>suspension temporaire</strong> possible." },
        ]},
      ],
    },
    {
      id: 'docbel', icon: '💬', label: 'À propos de DocBel',
      items: [
        { id: 'db1', q: 'DocBel peut-il remplir les formulaires à ma place ?', a: [
          { type: 'p', html: "Non. DocBel est un <strong>outil d'information</strong>. Il guide et explique, mais <strong>vous soumettez</strong> les documents. Nous ne remplaçons pas les services officiels." },
        ]},
        { id: 'db2', q: 'Les informations sont-elles fiables et à jour ?', a: [
          { type: 'p', html: "DocBel s'appuie sur les <strong>textes officiels du Moniteur belge</strong> et les infos ONEM. Mis à jour à chaque modification. Consultez votre organisme pour une décision officielle." },
        ]},
      ],
    },
  ],

  nl: [
    {
      id: 'eligibilite', icon: '🔍', label: 'Rechten & voorwaarden',
      items: [
        { id: 'e1', q: 'Wat zijn de basisvoorwaarden voor een werkloosheidsuitkering?', a: [
          { type: 'p',    html: 'Om uitkeringen te krijgen moet u <strong>onvrijwillig werkloos</strong> zijn, <strong>arbeidsgeschikt</strong>, en voldoende <strong>werkdagen</strong> hebben : 312 dagen (<36), 468 dagen (36–49), 624 dagen (50+).' },
          { type: 'info', html: '💡 De referentieperiode is gewijzigd door de hervorming 2025. <a href="/reforme">Zie de pagina Hervorming</a>.' },
        ]},
        { id: 'e2', q: 'Wat is het verschil tussen de RVA en mijn uitbetalingsinstelling?', a: [
          { type: 'p', html: 'De <strong>RVA</strong> <strong>beslist</strong> of u recht heeft op uitkeringen. Uw <strong>uitbetalingsinstelling</strong> (ACV, ACLVB, ABVV of HVW) <strong>betaalt</strong> ze uit.' },
        ]},
        { id: 'e3', q: 'Ik heb ontslag genomen. Kan ik toch uitkeringen krijgen?', a: [
          { type: 'p', html: "In principe sluit ontslagname tijdelijk uit. Uitzonderingen : <strong>dringende reden van de werkgever</strong>, dwingende familiereden, of hervatting + verlies van nieuwe baan. De RVA bekijkt elk geval." },
        ]},
        { id: 'e4', q: 'Hoeveel tijd heb ik om me in te schrijven na jobverlies?', a: [
          { type: 'p', html: 'Inschrijving bij <strong>VDAB, Actiris of FOREM</strong> binnen <strong>8 werkdagen</strong>. Daarna <strong>36 maanden</strong> om uw uitkering aan te vragen.' },
        ]},
        { id: 'e5', q: 'Kan ik deeltijds werken en uitkering krijgen?', a: [
          { type: 'p', html: 'Ja, onder voorwaarden. Statuut van <strong>onvrijwillig deeltijds werkende</strong> laat cumul toe. Geef elke gewerkte dag aan op kaart C131A.' },
        ]},
      ],
    },
    {
      id: 'montants', icon: '💶', label: 'Bedragen & berekening',
      items: [
        { id: 'm1', q: 'Hoe wordt mijn uitkering berekend?', a: [
          { type: 'p',    html: 'Berekening op basis van uw <strong>laatste brutoloon</strong>, geplafonneerd. Fase 1 : <strong>65 % van het referentieloon</strong>. Daalt volgens duur en gezinssituatie.' },
          { type: 'info', html: '💡 Gebruik onze <a href="/simulation">rekenmodule</a> voor een persoonlijke schatting.' },
        ]},
        { id: 'm2', q: 'Zijn mijn uitkeringen belastbaar?', a: [
          { type: 'p', html: 'Ja. <strong>10,09 % bedrijfsvoorheffing</strong> aan de bron. Aangeven in uw belastingaangifte. Fiche 281.13 jaarlijks afgeleverd.' },
        ]},
        { id: 'm3', q: 'Dalen uitkeringen met de tijd?', a: [
          { type: 'p', html: 'Ja, het Belgische systeem is <strong>degressief</strong> in drie fasen. De <a href="/reforme">hervorming 2025</a> heeft fase 1 verlengd voor lange loopbanen.' },
        ]},
        { id: 'm4', q: 'Bestaan er verhoogde uitkeringen?', a: [
          { type: 'p', html: 'Ja. <strong>+10 %</strong> voor <strong>gezinshoofden</strong>. Specifieke regels voor oudere werknemers, SWT, onvrijwillig deeltijdse werknemers.' },
        ]},
      ],
    },
    {
      id: 'demarches', icon: '📋', label: 'Stappen & formulieren',
      items: [
        { id: 'd1', q: 'Waarvoor dient formulier C4?', a: [
          { type: 'p',    html: '<strong>Werkloosheidsattest</strong>, ingevuld en ondertekend door <strong>uw werkgever</strong>. Zonder dit kan uw dossier niet behandeld worden.' },
          { type: 'info', html: '📝 Onze assistent controleert of uw C4 correct is ingevuld.' },
        ]},
        { id: 'd2', q: 'Wat is kaart C131A?', a: [
          { type: 'p', html: "Maandelijks document waarop u <strong>elke dag van onbeschikbaarheid schrapt</strong>. Niet geschrapt vakje = één uitkeringsdag. Fout = terugvordering." },
        ]},
        { id: 'd3', q: 'Wat als mijn werkgever C4 weigert?', a: [
          { type: 'p', html: "1) schriftelijk in gebreke stellen, 2) uitbetalingsinstelling contacteren, 3) klacht bij <strong>Arbeidsinspectie</strong>. Dossier kan intussen op basis van andere stukken." },
        ]},
        { id: 'd4', q: 'Kan ik alles online regelen?', a: [
          { type: 'p', html: 'Gedeeltelijk. Inschrijving online (vdab.be, myjob.brussels, forem.be). Sommige instellingen bieden digitale interface.' },
        ]},
      ],
    },
    {
      id: 'reforme', icon: '⚡', label: 'Hervorming 2025',
      items: [
        { id: 'r1', q: 'Hoe verandert de hervorming 2025 mijn rechten?', a: [
          { type: 'p',    html: 'Wijziging van <strong>referentieperiode</strong>, <strong>degressiviteitsberekening</strong>, en <strong>beschikbaarheidsverplichtingen</strong>. <strong>Overgangsregime</strong> voor lopende dossiers.' },
          { type: 'info', html: '📖 <a href="/reforme">Zie de pagina Hervorming 2025</a> voor volledige analyse.' },
        ]},
        { id: 'r2', q: 'Bestaand dossier : raakt mij de hervorming?', a: [
          { type: 'p', html: 'Rechten <strong>verworven vóór januari 2025</strong> blijven behouden. Bij herziening gelden de nieuwe regels volledig.' },
        ]},
        { id: 'r3', q: 'Nieuwe beschikbaarheidsverplichtingen?', a: [
          { type: 'p', html: '<strong>Intensievere</strong> opvolging : gesprekken om de 4 maanden (voorheen 12). Niet-naleving = mogelijke <strong>tijdelijke schorsing</strong>.' },
        ]},
      ],
    },
    {
      id: 'docbel', icon: '💬', label: 'Over DocBel',
      items: [
        { id: 'db1', q: 'Kan DocBel formulieren voor mij invullen?', a: [
          { type: 'p', html: 'Neen. DocBel is een <strong>informatietool</strong>. Wij begeleiden, maar <strong>u dient in</strong>. Wij vervangen officiële diensten niet.' },
        ]},
        { id: 'db2', q: 'Zijn de gegevens betrouwbaar en actueel?', a: [
          { type: 'p', html: 'DocBel baseert zich op <strong>Belgisch Staatsblad</strong> en RVA-info. Actualisering bij elke wijziging. Raadpleeg uw instelling voor officiële beslissing.' },
        ]},
      ],
    },
  ],

  de: [
    {
      id: 'eligibilite', icon: '🔍', label: 'Rechte & Anspruch',
      items: [
        { id: 'e1', q: 'Welche Grundbedingungen gelten für Arbeitslosengeld?', a: [
          { type: 'p',    html: 'Sie müssen <strong>unfreiwillig arbeitslos</strong>, <strong>arbeitsfähig</strong> sein und genügend <strong>Arbeitstage</strong> haben : 312 (<36), 468 (36–49), 624 (50+).' },
          { type: 'info', html: '💡 Der Referenzzeitraum wurde durch die Reform 2025 geändert. <a href="/reforme">Siehe Reformseite</a>.' },
        ]},
        { id: 'e2', q: 'Unterschied zwischen LfA und Zahlstelle?', a: [
          { type: 'p', html: 'Das <strong>LfA</strong> <strong>entscheidet</strong> über Ihren Anspruch. Ihre <strong>Zahlstelle</strong> (CSC, CGSLB, FGTB oder HVW) <strong>zahlt</strong> die Leistungen aus.' },
        ]},
        { id: 'e3', q: 'Ich habe gekündigt. Bekomme ich trotzdem Arbeitslosengeld?', a: [
          { type: 'p', html: 'Eigene Kündigung schließt grundsätzlich aus. Ausnahmen : <strong>schwerwiegender Grund des Arbeitgebers</strong>, zwingende Familiengründe, neue Beschäftigung + Verlust.' },
        ]},
        { id: 'e4', q: 'Wie viel Zeit zur Anmeldung habe ich?', a: [
          { type: 'p', html: 'Anmeldung bei <strong>ADG, FOREM, VDAB oder Actiris</strong> innerhalb von <strong>8 Werktagen</strong>. Danach <strong>36 Monate</strong> für Antrag.' },
        ]},
        { id: 'e5', q: 'Teilzeitarbeit und Arbeitslosengeld?', a: [
          { type: 'p', html: 'Ja, unter Bedingungen. Status <strong>unfreiwillig Teilzeitbeschäftigter</strong> erlaubt Kumul. Jeden Arbeitstag auf C131A melden.' },
        ]},
      ],
    },
    {
      id: 'montants', icon: '💶', label: 'Beträge & Berechnung',
      items: [
        { id: 'm1', q: 'Wie wird mein Arbeitslosengeld berechnet?', a: [
          { type: 'p',    html: 'Berechnung auf Basis des <strong>letzten Bruttolohns</strong>, gedeckelt. Phase 1 : <strong>65 % des Referenzlohns</strong>. Abnahme nach Dauer und Familienstand.' },
          { type: 'info', html: '💡 Nutzen Sie unseren <a href="/simulation">Rechner</a> für eine persönliche Schätzung.' },
        ]},
        { id: 'm2', q: 'Sind die Leistungen steuerpflichtig?', a: [
          { type: 'p', html: 'Ja. <strong>10,09 % Lohnsteuer</strong> an der Quelle. In der Steuererklärung zu melden. Steuerbescheinigung 281.13 jährlich.' },
        ]},
        { id: 'm3', q: 'Sinken die Leistungen mit der Zeit?', a: [
          { type: 'p', html: 'Ja, das System ist <strong>degressiv</strong> in drei Phasen. Die <a href="/reforme">Reform 2025</a> hat Phase 1 verlängert für lange Laufbahnen.' },
        ]},
        { id: 'm4', q: 'Gibt es erhöhte Leistungen?', a: [
          { type: 'p', html: 'Ja. <strong>+10 %</strong> für <strong>Haushaltsvorstände</strong>. Besondere Regeln für ältere Arbeitnehmer, ergänzende Unternehmensleistung, unfreiwillige Teilzeit.' },
        ]},
      ],
    },
    {
      id: 'demarches', icon: '📋', label: 'Schritte & Formulare',
      items: [
        { id: 'd1', q: 'Wozu dient Formular C4?', a: [
          { type: 'p',    html: '<strong>Arbeitslosigkeitsbescheinigung</strong>, ausgefüllt vom <strong>Arbeitgeber</strong>. Ohne dieses Dokument keine Bearbeitung.' },
          { type: 'info', html: '📝 Unser Assistent prüft, ob Ihr C4 korrekt ausgefüllt ist.' },
        ]},
        { id: 'd2', q: 'Was ist die Karte C131A?', a: [
          { type: 'p', html: 'Monatliches Dokument, auf dem Sie <strong>jeden Tag der Nichtverfügbarkeit streichen</strong>. Nicht gestrichenes Feld = ein Leistungstag.' },
        ]},
        { id: 'd3', q: 'Was tun bei Weigerung des Arbeitgebers?', a: [
          { type: 'p', html: '1) schriftliche Inverzugsetzung, 2) Zahlstelle kontaktieren, 3) Beschwerde bei <strong>Arbeitsinspektion</strong>.' },
        ]},
        { id: 'd4', q: 'Schritte komplett online?', a: [
          { type: 'p', html: 'Teilweise. Online-Anmeldung (adg.be, forem.be, vdab.be, myjob.brussels). Manche Zahlstellen bieten digitale Oberflächen.' },
        ]},
      ],
    },
    {
      id: 'reforme', icon: '⚡', label: 'Reform 2025',
      items: [
        { id: 'r1', q: 'Wie ändert die Reform 2025 meine Rechte?', a: [
          { type: 'p',    html: 'Änderung von <strong>Referenzzeitraum</strong>, <strong>Degressivität</strong> und <strong>Verfügbarkeitspflichten</strong>. <strong>Übergangsregime</strong> für laufende Dossiers.' },
          { type: 'info', html: '📖 <a href="/reforme">Siehe Reformseite 2025</a> für die vollständige Analyse.' },
        ]},
        { id: 'r2', q: 'Betrifft mich die Reform bei laufendem Dossier?', a: [
          { type: 'p', html: 'Rechte, die <strong>vor Januar 2025</strong> erworben wurden, bleiben erhalten. Bei Revision gelten die neuen Regeln vollständig.' },
        ]},
        { id: 'r3', q: 'Neue Verfügbarkeitspflichten?', a: [
          { type: 'p', html: '<strong>Intensiveres</strong> Monitoring : Gespräche alle 4 Monate (statt 12). Nichteinhaltung = mögliche <strong>vorübergehende Aussetzung</strong>.' },
        ]},
      ],
    },
    {
      id: 'docbel', icon: '💬', label: 'Über DocBel',
      items: [
        { id: 'db1', q: 'Füllt DocBel Formulare für mich aus?', a: [
          { type: 'p', html: 'Nein. DocBel ist ein <strong>Informationsinstrument</strong>. Wir begleiten, aber <strong>Sie reichen ein</strong>. Keine Ersetzung offizieller Dienste.' },
        ]},
        { id: 'db2', q: 'Sind die Informationen zuverlässig und aktuell?', a: [
          { type: 'p', html: 'DocBel stützt sich auf den <strong>Moniteur belge</strong> und LfA-Infos. Aktualisierung bei jeder Änderung. Offizielle Entscheidung bei Ihrer Zahlstelle.' },
        ]},
      ],
    },
  ],

  en: [
    {
      id: 'eligibilite', icon: '🔍', label: 'Rights & eligibility',
      items: [
        { id: 'e1', q: 'What are the basic conditions for unemployment benefits?', a: [
          { type: 'p',    html: 'You must be <strong>involuntarily unemployed</strong>, <strong>fit for work</strong>, and have worked a <strong>sufficient number of days</strong> : 312 (<36), 468 (36–49), 624 (50+).' },
          { type: 'info', html: '💡 The reference period was changed by the 2025 reform. <a href="/reforme">See the Reform page</a>.' },
        ]},
        { id: 'e2', q: 'Difference between ONEM and my payment institution?', a: [
          { type: 'p', html: '<strong>ONEM</strong> <strong>decides</strong> whether you are entitled to benefits. Your <strong>payment institution</strong> (CSC, CGSLB, FGTB or Capac) <strong>pays</strong> them out.' },
        ]},
        { id: 'e3', q: 'I resigned. Can I still get benefits?', a: [
          { type: 'p', html: 'Resignation normally excludes benefits temporarily. Exceptions : <strong>serious fault of employer</strong>, compelling family reasons, resumed + lost new job. ONEM assesses each case.' },
        ]},
        { id: 'e4', q: 'How long to register after job loss?', a: [
          { type: 'p', html: 'Register with <strong>Actiris, VDAB or FOREM</strong> within <strong>8 business days</strong>. Then <strong>36 months</strong> to file your claim.' },
        ]},
        { id: 'e5', q: 'Can I work part-time and receive benefits?', a: [
          { type: 'p', html: 'Yes, under conditions. <strong>Involuntary part-time worker</strong> status allows cumulation. Declare each worked day on C131A.' },
        ]},
      ],
    },
    {
      id: 'montants', icon: '💶', label: 'Amounts & calculation',
      items: [
        { id: 'm1', q: 'How is my benefit calculated?', a: [
          { type: 'p',    html: 'Calculated on your <strong>last gross salary</strong>, capped. Phase 1 : <strong>65% of reference salary</strong>. Decreases with duration and family situation.' },
          { type: 'info', html: '💡 Use our <a href="/simulation">calculator</a> for a personal estimate.' },
        ]},
        { id: 'm2', q: 'Are benefits taxable?', a: [
          { type: 'p', html: 'Yes. <strong>10.09% withholding tax</strong> at source. Declare in your tax return. Form 281.13 provided annually.' },
        ]},
        { id: 'm3', q: 'Do benefits decrease over time?', a: [
          { type: 'p', html: 'Yes, the system is <strong>degressive</strong> in three phases. The <a href="/reforme">2025 reform</a> extended phase 1 for long careers.' },
        ]},
        { id: 'm4', q: 'Are there increased benefits?', a: [
          { type: 'p', html: 'Yes. <strong>+10%</strong> for <strong>heads of household</strong>. Specific rules for older workers, company supplements, involuntary part-timers.' },
        ]},
      ],
    },
    {
      id: 'demarches', icon: '📋', label: 'Procedures & forms',
      items: [
        { id: 'd1', q: 'What is form C4 for?', a: [
          { type: 'p',    html: '<strong>Unemployment certificate</strong>, completed by <strong>your employer</strong>. Without it, your claim cannot be processed.' },
          { type: 'info', html: '📝 Our assistant checks that your C4 is correctly filled in.' },
        ]},
        { id: 'd2', q: 'What is the C131A card?', a: [
          { type: 'p', html: 'Monthly document where you <strong>cross out each day of unavailability</strong>. Unmarked box = one benefit day. Error = overpayment to refund.' },
        ]},
        { id: 'd3', q: 'What if my employer refuses the C4?', a: [
          { type: 'p', html: '1) formal written notice, 2) contact your institution, 3) file a complaint with <strong>Labour Inspectorate</strong>.' },
        ]},
        { id: 'd4', q: 'Can I do everything online?', a: [
          { type: 'p', html: 'Partially. Online registration (myjob.brussels, vdab.be, forem.be). Some institutions offer digital interfaces.' },
        ]},
      ],
    },
    {
      id: 'reforme', icon: '⚡', label: '2025 reform',
      items: [
        { id: 'r1', q: 'How does the 2025 reform change my rights?', a: [
          { type: 'p',    html: 'Changes to the <strong>reference period</strong>, <strong>degressivity calculation</strong>, and <strong>availability obligations</strong>. <strong>Transitional regime</strong> for existing cases.' },
          { type: 'info', html: '📖 <a href="/reforme">See the 2025 Reform page</a> for a full analysis.' },
        ]},
        { id: 'r2', q: 'Does the reform affect my existing case?', a: [
          { type: 'p', html: 'Rights <strong>acquired before January 2025</strong> are maintained. On review, new rules apply in full.' },
        ]},
        { id: 'r3', q: 'New availability obligations?', a: [
          { type: 'p', html: '<strong>More intensive</strong> monitoring : interviews every 4 months (vs 12). Non-compliance = possible <strong>temporary suspension</strong>.' },
        ]},
      ],
    },
    {
      id: 'docbel', icon: '💬', label: 'About DocBel',
      items: [
        { id: 'db1', q: 'Can DocBel fill in forms for me?', a: [
          { type: 'p', html: 'No. DocBel is an <strong>information tool</strong>. We guide you, but <strong>you submit</strong> the documents. We do not replace official services.' },
        ]},
        { id: 'db2', q: 'Is the information reliable and up to date?', a: [
          { type: 'p', html: 'DocBel relies on <strong>Moniteur belge</strong> texts and ONEM info. Updated with each change. Consult your institution for official decisions.' },
        ]},
      ],
    },
  ],

  ar: [
    {
      id: 'eligibilite', icon: '🔍', label: 'الحقوق والأهلية',
      items: [
        { id: 'e1', q: 'ما هي الشروط الأساسية للحصول على إعانة البطالة؟', a: [
          { type: 'p',    html: 'يجب أن تكون <strong>عاطلاً عن العمل بشكل لا إرادي</strong>، <strong>قادرًا على العمل</strong>، وأن يكون لديك عدد <strong>كافٍ من أيام العمل</strong> : 312 (<36)، 468 (36–49)، 624 (50+).' },
          { type: 'info', html: '💡 تم تعديل الفترة المرجعية بإصلاح 2025. <a href="/reforme">راجع صفحة الإصلاح</a>.' },
        ]},
        { id: 'e2', q: 'ما الفرق بين ONEM وجهة الدفع الخاصة بي؟', a: [
          { type: 'p', html: 'تقرر <strong>ONEM</strong> ما إذا كنت مستحقًا للإعانات. تقوم <strong>جهة الدفع</strong> (CSC, CGSLB, FGTB أو Capac) بالدفع الفعلي.' },
        ]},
        { id: 'e3', q: 'لقد استقلت. هل يمكنني الحصول على الإعانة؟', a: [
          { type: 'p', html: 'الاستقالة تستبعد مؤقتًا. الاستثناءات : <strong>خطأ جسيم من صاحب العمل</strong>، أسباب عائلية ملحة، استئناف + فقدان عمل جديد. تدرس ONEM كل حالة.' },
        ]},
        { id: 'e4', q: 'كم من الوقت لدي للتسجيل بعد فقدان العمل؟', a: [
          { type: 'p', html: 'سجل لدى <strong>Actiris أو VDAB أو FOREM</strong> خلال <strong>8 أيام عمل</strong>. ثم <strong>36 شهرًا</strong> لتقديم طلبك.' },
        ]},
        { id: 'e5', q: 'هل يمكنني العمل بدوام جزئي وتلقي إعانة؟', a: [
          { type: 'p', html: 'نعم، بشروط. وضع <strong>العامل الجزئي اللاإرادي</strong> يسمح بالجمع. صرّح عن كل يوم عمل على بطاقة C131A.' },
        ]},
      ],
    },
    {
      id: 'montants', icon: '💶', label: 'المبالغ والحساب',
      items: [
        { id: 'm1', q: 'كيف يُحسب مبلغ إعانتي؟', a: [
          { type: 'p',    html: 'يُحسب على أساس <strong>آخر راتب إجمالي</strong> مع سقف. المرحلة 1 : <strong>65% من الراتب المرجعي</strong>. ينخفض حسب المدة والحالة العائلية.' },
          { type: 'info', html: '💡 استخدم <a href="/simulation">الآلة الحاسبة</a> لتقدير شخصي.' },
        ]},
        { id: 'm2', q: 'هل إعاناتي خاضعة للضريبة؟', a: [
          { type: 'p', html: 'نعم. <strong>خصم 10.09%</strong> من المصدر. يجب التصريح بها في إقرارك الضريبي. نموذج 281.13 سنويًا.' },
        ]},
        { id: 'm3', q: 'هل تنخفض الإعانات مع الوقت؟', a: [
          { type: 'p', html: 'نعم، النظام <strong>تنازلي</strong> على ثلاث مراحل. <a href="/reforme">إصلاح 2025</a> مدد المرحلة 1 للمسارات الطويلة.' },
        ]},
        { id: 'm4', q: 'هل توجد إعانات معززة؟', a: [
          { type: 'p', html: 'نعم. <strong>+10%</strong> لـ <strong>أرباب الأسر</strong>. قواعد خاصة للعمال كبار السن، مكملات الشركة، الجزئيين اللاإراديين.' },
        ]},
      ],
    },
    {
      id: 'demarches', icon: '📋', label: 'الإجراءات والنماذج',
      items: [
        { id: 'd1', q: 'ما الغرض من نموذج C4؟', a: [
          { type: 'p',    html: '<strong>شهادة البطالة</strong>، يُملؤها <strong>صاحب العمل</strong>. بدونها لا يمكن معالجة طلبك.' },
          { type: 'info', html: '📝 يتحقق مساعدنا من ملء C4 بشكل صحيح.' },
        ]},
        { id: 'd2', q: 'ما هي بطاقة C131A؟', a: [
          { type: 'p', html: 'وثيقة شهرية <strong>تشطب فيها كل يوم عدم توفر</strong>. مربع غير مشطوب = يوم إعانة. خطأ = استرجاع.' },
        ]},
        { id: 'd3', q: 'ماذا أفعل إذا رفض صاحب العمل تسليم C4؟', a: [
          { type: 'p', html: '1) إنذار كتابي، 2) اتصل بجهة الدفع، 3) شكوى لـ <strong>تفتيش العمل</strong>.' },
        ]},
        { id: 'd4', q: 'هل يمكنني إتمام كل شيء عبر الإنترنت؟', a: [
          { type: 'p', html: 'جزئيًا. التسجيل عبر الإنترنت (myjob.brussels, vdab.be, forem.be). بعض الجهات تقدم واجهة رقمية.' },
        ]},
      ],
    },
    {
      id: 'reforme', icon: '⚡', label: 'إصلاح 2025',
      items: [
        { id: 'r1', q: 'كيف يغير إصلاح 2025 حقوقي؟', a: [
          { type: 'p',    html: 'تعديل <strong>الفترة المرجعية</strong>، <strong>حساب التناقص</strong>، و<strong>التزامات التوفر</strong>. <strong>نظام انتقالي</strong> للملفات الجارية.' },
          { type: 'info', html: '📖 <a href="/reforme">راجع صفحة الإصلاح 2025</a> للتحليل الكامل.' },
        ]},
        { id: 'r2', q: 'هل يؤثر الإصلاح على ملفي القائم؟', a: [
          { type: 'p', html: 'الحقوق <strong>المكتسبة قبل يناير 2025</strong> محفوظة. عند المراجعة، تُطبق القواعد الجديدة بالكامل.' },
        ]},
        { id: 'r3', q: 'التزامات توفر جديدة؟', a: [
          { type: 'p', html: 'متابعة <strong>أكثر كثافة</strong> : مقابلات كل 4 أشهر (بدلاً من 12). عدم الامتثال = <strong>تعليق مؤقت</strong> محتمل.' },
        ]},
      ],
    },
    {
      id: 'docbel', icon: '💬', label: 'عن DocBel',
      items: [
        { id: 'db1', q: 'هل يملأ DocBel النماذج نيابة عني؟', a: [
          { type: 'p', html: 'لا. DocBel هو <strong>أداة معلومات</strong>. نحن نرشدك، لكن <strong>أنت تقدم</strong> الوثائق. لا نستبدل الخدمات الرسمية.' },
        ]},
        { id: 'db2', q: 'هل المعلومات موثوقة ومحدثة؟', a: [
          { type: 'p', html: 'يعتمد DocBel على <strong>Moniteur belge</strong> ومعلومات ONEM. محدَّث مع كل تغيير. استشر جهتك للقرارات الرسمية.' },
        ]},
      ],
    },
  ],
}

export function getFaqContent(code: string): FAQGroup[] {
  return FAQ_CONTENT[resolveLang(code)]
}

/* ─── RÉFORME content ────────────────────────────────────────────────── */
export type Change = {
  icon: string; tag: 'modified'|'stricter'|'new';
  title: string; desc: string;
  beforeLabel: string; beforeVal: string; afterLabel: string; afterVal: string;
}
export type Profile = { id: string; label: string; title: string; rows: { label: string; val: string; cls: ''|'good'|'warn' }[] }
export type TLItem = { status: 'done'|'active'|'upcoming'; date: string; title: string; desc: string; chip: 'done'|'published'|'active'|'soon'|'planned' }

type RefDict<T> = Record<FullLang, T>

export const REFORM_CHANGES: RefDict<Change[]> = {
  fr: [
    { icon: '⏱️', tag: 'modified', title: 'Période de référence',                desc: "La période pendant laquelle vous devez avoir travaillé a été révisée. Les calculs tiennent davantage compte de votre parcours global.", beforeLabel: 'Avant', beforeVal: '21 mois pour <36 ans', afterLabel: 'Après', afterVal: '27 mois pour <36 ans' },
    { icon: '💶', tag: 'modified', title: 'Calcul de la dégressivité',           desc: "Le rythme de diminution des allocations a été ajusté. La phase 1 est rallongée pour les longs parcours.", beforeLabel: 'Phase 1 (avant)', beforeVal: '3–12 mois', afterLabel: 'Phase 1 (après)', afterVal: '3–18 mois' },
    { icon: '📋', tag: 'stricter', title: 'Obligations de disponibilité',        desc: "Le suivi des recherches actives est plus intensif. Entretiens obligatoires dès le début.", beforeLabel: 'Suivi (avant)', beforeVal: 'Tous les 12 mois', afterLabel: 'Suivi (après)', afterVal: 'Tous les 4 mois' },
    { icon: '🏠', tag: 'new',      title: 'Catégories de situation familiale',   desc: "Les critères (chef de ménage, isolé, cohabitant) sont précisés. Mieux encadrés.", beforeLabel: 'Catégories (avant)', beforeVal: '3 situations', afterLabel: 'Catégories (après)', afterVal: '5 situations' },
    { icon: '💰', tag: 'modified', title: 'Plafonds et montants minimaux',       desc: "Minima revus à la hausse pour les chômeurs de longue durée. Plafonds ajustés à l'index.", beforeLabel: 'Minimum (avant)', beforeVal: '43,95 €/jour', afterLabel: 'Minimum (après)', afterVal: '47,20 €/jour' },
    { icon: '🔄', tag: 'new',      title: 'Régime transitoire',                  desc: "Droits acquis avant janvier 2025 maintenus par régime transitoire.", beforeLabel: 'Dossiers en cours', beforeVal: 'Anciens droits', afterLabel: 'Nouvelles demandes', afterVal: 'Nouvelles règles' },
  ],
  nl: [
    { icon: '⏱️', tag: 'modified', title: 'Referentieperiode',                   desc: 'De periode waarin u moet hebben gewerkt werd herzien. Berekening houdt meer rekening met uw volledige loopbaan.', beforeLabel: 'Voor', beforeVal: '21 mnd voor <36', afterLabel: 'Na', afterVal: '27 mnd voor <36' },
    { icon: '💶', tag: 'modified', title: 'Degressiviteitsberekening',           desc: 'Het tempo waarmee uitkeringen dalen werd bijgesteld. Fase 1 verlengd voor lange loopbanen.', beforeLabel: 'Fase 1 (voor)', beforeVal: '3–12 mnd', afterLabel: 'Fase 1 (na)', afterVal: '3–18 mnd' },
    { icon: '📋', tag: 'stricter', title: 'Beschikbaarheidsverplichtingen',      desc: 'Intensievere opvolging. Verplichte gesprekken vanaf de start.', beforeLabel: 'Opvolging (voor)', beforeVal: 'Elke 12 mnd', afterLabel: 'Opvolging (na)', afterVal: 'Elke 4 mnd' },
    { icon: '🏠', tag: 'new',      title: 'Categorieën gezinssituatie',          desc: 'Criteria (gezinshoofd, alleenstaand, samenwonend) verduidelijkt. Beter omkaderd.', beforeLabel: 'Categorieën (voor)', beforeVal: '3', afterLabel: 'Categorieën (na)', afterVal: '5' },
    { icon: '💰', tag: 'modified', title: 'Plafonds en minima',                  desc: 'Minima verhoogd voor langdurig werklozen. Plafonds aan index.', beforeLabel: 'Minimum (voor)', beforeVal: '€43,95/d', afterLabel: 'Minimum (na)', afterVal: '€47,20/d' },
    { icon: '🔄', tag: 'new',      title: 'Overgangsregime',                     desc: 'Rechten verworven vóór jan. 2025 behouden.', beforeLabel: 'Lopende dossiers', beforeVal: 'Oude rechten', afterLabel: 'Nieuwe aanvragen', afterVal: 'Nieuwe regels' },
  ],
  de: [
    { icon: '⏱️', tag: 'modified', title: 'Referenzzeitraum',                    desc: 'Zeitraum der erforderlichen Arbeit überarbeitet. Berücksichtigt Gesamtlaufbahn stärker.', beforeLabel: 'Vorher', beforeVal: '21 Mon. für <36', afterLabel: 'Nachher', afterVal: '27 Mon. für <36' },
    { icon: '💶', tag: 'modified', title: 'Degressivitätsberechnung',            desc: 'Rhythmus angepasst. Phase 1 verlängert bei langer Laufbahn.', beforeLabel: 'Phase 1 (vor)', beforeVal: '3–12 Mon.', afterLabel: 'Phase 1 (nach)', afterVal: '3–18 Mon.' },
    { icon: '📋', tag: 'stricter', title: 'Verfügbarkeitspflichten',             desc: 'Intensiveres Monitoring. Pflichtgespräche ab Beginn.', beforeLabel: 'Kontrolle (vor)', beforeVal: 'Alle 12 Mon.', afterLabel: 'Kontrolle (nach)', afterVal: 'Alle 4 Mon.' },
    { icon: '🏠', tag: 'new',      title: 'Kategorien Familienstand',            desc: 'Kriterien präzisiert, besser abgedeckt.', beforeLabel: 'Kategorien (vor)', beforeVal: '3', afterLabel: 'Kategorien (nach)', afterVal: '5' },
    { icon: '💰', tag: 'modified', title: 'Obergrenzen und Mindestbeträge',      desc: 'Mindestbeträge erhöht für Langzeitarbeitslose. Obergrenzen an Index.', beforeLabel: 'Mindest (vor)', beforeVal: '43,95 €/T', afterLabel: 'Mindest (nach)', afterVal: '47,20 €/T' },
    { icon: '🔄', tag: 'new',      title: 'Übergangsregime',                     desc: 'Vor Jan. 2025 erworbene Rechte bleiben erhalten.', beforeLabel: 'Laufende Dossiers', beforeVal: 'Alte Rechte', afterLabel: 'Neue Anträge', afterVal: 'Neue Regeln' },
  ],
  en: [
    { icon: '⏱️', tag: 'modified', title: 'Reference period',                    desc: 'The period during which you must have worked has been revised. Calculations now weigh your overall career more heavily.', beforeLabel: 'Before', beforeVal: '21 months for <36', afterLabel: 'After', afterVal: '27 months for <36' },
    { icon: '💶', tag: 'modified', title: 'Degressivity calculation',            desc: 'The pace at which benefits decrease has been adjusted. Phase 1 extended for long careers.', beforeLabel: 'Phase 1 (before)', beforeVal: '3–12 months', afterLabel: 'Phase 1 (after)', afterVal: '3–18 months' },
    { icon: '📋', tag: 'stricter', title: 'Availability obligations',            desc: 'More intensive follow-up of active job search. Mandatory interviews from the start.', beforeLabel: 'Monitoring (before)', beforeVal: 'Every 12 months', afterLabel: 'Monitoring (after)', afterVal: 'Every 4 months' },
    { icon: '🏠', tag: 'new',      title: 'Family situation categories',         desc: 'Criteria refined — better framed.', beforeLabel: 'Categories (before)', beforeVal: '3', afterLabel: 'Categories (after)', afterVal: '5' },
    { icon: '💰', tag: 'modified', title: 'Ceilings and minimum amounts',        desc: 'Minimums increased for long-term unemployed. Ceilings indexed.', beforeLabel: 'Minimum (before)', beforeVal: '€43.95/day', afterLabel: 'Minimum (after)', afterVal: '€47.20/day' },
    { icon: '🔄', tag: 'new',      title: 'Transitional regime',                 desc: 'Rights acquired before January 2025 are maintained.', beforeLabel: 'Existing cases', beforeVal: 'Old rights', afterLabel: 'New claims', afterVal: 'New rules' },
  ],
  ar: [
    { icon: '⏱️', tag: 'modified', title: 'الفترة المرجعية',                    desc: 'تمت مراجعة الفترة التي يجب أن تكون قد عملت خلالها. الحسابات تأخذ مسارك بشكل أشمل.', beforeLabel: 'قبل', beforeVal: '21 شهرًا (أقل من 36)', afterLabel: 'بعد', afterVal: '27 شهرًا (أقل من 36)' },
    { icon: '💶', tag: 'modified', title: 'حساب التناقص',                        desc: 'تم ضبط وتيرة انخفاض الإعانات. تمديد المرحلة 1 للمسارات الطويلة.', beforeLabel: 'المرحلة 1 (قبل)', beforeVal: '3–12 شهرًا', afterLabel: 'المرحلة 1 (بعد)', afterVal: '3–18 شهرًا' },
    { icon: '📋', tag: 'stricter', title: 'التزامات التوفر',                     desc: 'متابعة أكثر كثافة. مقابلات إلزامية منذ البداية.', beforeLabel: 'المتابعة (قبل)', beforeVal: 'كل 12 شهرًا', afterLabel: 'المتابعة (بعد)', afterVal: 'كل 4 أشهر' },
    { icon: '🏠', tag: 'new',      title: 'فئات الحالة العائلية',                desc: 'تم توضيح المعايير. تأطير أفضل.', beforeLabel: 'الفئات (قبل)', beforeVal: '3', afterLabel: 'الفئات (بعد)', afterVal: '5' },
    { icon: '💰', tag: 'modified', title: 'الحد الأقصى والمبالغ الدنيا',         desc: 'رفع الحد الأدنى لعاطلي المدى الطويل. ضبط الحدود القصوى على المؤشر.', beforeLabel: 'الأدنى (قبل)', beforeVal: '43.95 €/يوم', afterLabel: 'الأدنى (بعد)', afterVal: '47.20 €/يوم' },
    { icon: '🔄', tag: 'new',      title: 'النظام الانتقالي',                    desc: 'الحقوق المكتسبة قبل يناير 2025 محفوظة.', beforeLabel: 'الملفات الجارية', beforeVal: 'الحقوق القديمة', afterLabel: 'الطلبات الجديدة', afterVal: 'القواعد الجديدة' },
  ],
}

export const REFORM_PROFILES: RefDict<Profile[]> = {
  fr: [
    { id: 'p1', label: 'Jeune (<36 ans)',      title: '👤 Profil : Jeune travailleur, moins de 36 ans, isolé',         rows: [
      { label: 'Jours requis', val: '312 jours', cls: 'warn' },
      { label: 'Période de référence', val: '27 mois', cls: '' },
      { label: 'Durée phase 1', val: '3 mois', cls: 'good' },
      { label: 'Taux phase 1', val: '65 % du salaire de réf.', cls: '' },
      { label: 'Montant minimum', val: '47,20 €/jour', cls: 'good' },
      { label: 'Suivi disponibilité', val: 'Tous les 4 mois', cls: 'warn' },
    ]},
    { id: 'p2', label: 'Adulte (36–49 ans)',   title: '👤 Profil : Adulte, 36–49 ans, cohabitant',                     rows: [
      { label: 'Jours requis', val: '468 jours', cls: '' },
      { label: 'Période de référence', val: '36 mois', cls: '' },
      { label: 'Durée phase 1', val: '6–12 mois', cls: 'good' },
      { label: 'Taux phase 1', val: '60 % du salaire de réf.', cls: '' },
      { label: 'Montant minimum', val: '43,50 €/jour', cls: 'good' },
      { label: 'Suivi disponibilité', val: 'Tous les 4 mois', cls: 'warn' },
    ]},
    { id: 'p3', label: 'Senior (50+ ans)',     title: '👤 Profil : Senior, 50 ans et plus, long passé professionnel',  rows: [
      { label: 'Jours requis', val: '624 jours', cls: '' },
      { label: 'Période de référence', val: '42 mois', cls: '' },
      { label: 'Durée phase 1', val: "Jusqu'à 18 mois", cls: 'good' },
      { label: 'Taux phase 1', val: '65 % du salaire de réf.', cls: '' },
      { label: 'Montant minimum', val: '47,20 €/jour', cls: 'good' },
      { label: 'Suivi disponibilité', val: 'Tous les 6 mois', cls: 'good' },
    ]},
    { id: 'p4', label: 'Chef de ménage',       title: '👤 Profil : Chef de ménage, personne à charge',                 rows: [
      { label: 'Supplément chef de ménage', val: '+ 10 %', cls: 'good' },
      { label: 'Taux phase 1', val: '65 % + supplément', cls: 'good' },
      { label: 'Montant minimum garanti', val: '55,40 €/jour', cls: 'good' },
      { label: 'Durée maximale', val: 'Illimitée (sous conditions)', cls: 'good' },
      { label: 'Nouvelle catégorie 2025', val: 'Mieux encadrée', cls: 'good' },
      { label: 'Suivi disponibilité', val: 'Tous les 4 mois', cls: '' },
    ]},
  ],
  nl: [
    { id: 'p1', label: 'Jong (<36)',           title: '👤 Profiel : Jonge werknemer, jonger dan 36, alleenstaand',     rows: [
      { label: 'Vereiste dagen', val: '312 dagen', cls: 'warn' },
      { label: 'Referentieperiode', val: '27 maanden', cls: '' },
      { label: 'Duur fase 1', val: '3 maanden', cls: 'good' },
      { label: 'Tarief fase 1', val: '65% ref. loon', cls: '' },
      { label: 'Minimum', val: '€47,20/dag', cls: 'good' },
      { label: 'Opvolging', val: 'Elke 4 maanden', cls: 'warn' },
    ]},
    { id: 'p2', label: 'Volwassene (36–49)',   title: '👤 Profiel : Volwassene, 36–49, samenwonend',                   rows: [
      { label: 'Vereiste dagen', val: '468 dagen', cls: '' },
      { label: 'Referentieperiode', val: '36 maanden', cls: '' },
      { label: 'Duur fase 1', val: '6–12 maanden', cls: 'good' },
      { label: 'Tarief fase 1', val: '60% ref. loon', cls: '' },
      { label: 'Minimum', val: '€43,50/dag', cls: 'good' },
      { label: 'Opvolging', val: 'Elke 4 maanden', cls: 'warn' },
    ]},
    { id: 'p3', label: 'Senior (50+)',         title: '👤 Profiel : Senior, 50+, lange loopbaan',                      rows: [
      { label: 'Vereiste dagen', val: '624 dagen', cls: '' },
      { label: 'Referentieperiode', val: '42 maanden', cls: '' },
      { label: 'Duur fase 1', val: 'Tot 18 maanden', cls: 'good' },
      { label: 'Tarief fase 1', val: '65% ref. loon', cls: '' },
      { label: 'Minimum', val: '€47,20/dag', cls: 'good' },
      { label: 'Opvolging', val: 'Elke 6 maanden', cls: 'good' },
    ]},
    { id: 'p4', label: 'Gezinshoofd',          title: '👤 Profiel : Gezinshoofd, persoon ten laste',                   rows: [
      { label: 'Toeslag gezinshoofd', val: '+ 10%', cls: 'good' },
      { label: 'Tarief fase 1', val: '65% + toeslag', cls: 'good' },
      { label: 'Gegarandeerd minimum', val: '€55,40/dag', cls: 'good' },
      { label: 'Max. duur', val: 'Onbeperkt (voorwaarden)', cls: 'good' },
      { label: 'Nieuwe categorie 2025', val: 'Beter omkaderd', cls: 'good' },
      { label: 'Opvolging', val: 'Elke 4 maanden', cls: '' },
    ]},
  ],
  de: [
    { id: 'p1', label: 'Jung (<36)',           title: '👤 Profil : Junger Arbeitnehmer, unter 36, alleinstehend',      rows: [
      { label: 'Erforderliche Tage', val: '312 Tage', cls: 'warn' },
      { label: 'Referenzzeitraum', val: '27 Monate', cls: '' },
      { label: 'Dauer Phase 1', val: '3 Monate', cls: 'good' },
      { label: 'Satz Phase 1', val: '65 % Referenzlohn', cls: '' },
      { label: 'Mindestbetrag', val: '47,20 €/Tag', cls: 'good' },
      { label: 'Kontrolle', val: 'Alle 4 Monate', cls: 'warn' },
    ]},
    { id: 'p2', label: 'Erwachsen (36–49)',    title: '👤 Profil : Erwachsener, 36–49, zusammenlebend',                rows: [
      { label: 'Erforderliche Tage', val: '468 Tage', cls: '' },
      { label: 'Referenzzeitraum', val: '36 Monate', cls: '' },
      { label: 'Dauer Phase 1', val: '6–12 Monate', cls: 'good' },
      { label: 'Satz Phase 1', val: '60 % Referenzlohn', cls: '' },
      { label: 'Mindestbetrag', val: '43,50 €/Tag', cls: 'good' },
      { label: 'Kontrolle', val: 'Alle 4 Monate', cls: 'warn' },
    ]},
    { id: 'p3', label: 'Senior (50+)',         title: '👤 Profil : Senior, 50+, lange Laufbahn',                       rows: [
      { label: 'Erforderliche Tage', val: '624 Tage', cls: '' },
      { label: 'Referenzzeitraum', val: '42 Monate', cls: '' },
      { label: 'Dauer Phase 1', val: 'Bis 18 Monate', cls: 'good' },
      { label: 'Satz Phase 1', val: '65 % Referenzlohn', cls: '' },
      { label: 'Mindestbetrag', val: '47,20 €/Tag', cls: 'good' },
      { label: 'Kontrolle', val: 'Alle 6 Monate', cls: 'good' },
    ]},
    { id: 'p4', label: 'Haushaltsvorstand',    title: '👤 Profil : Haushaltsvorstand, unterhaltsberechtigte Person',   rows: [
      { label: 'Zuschlag HV', val: '+ 10 %', cls: 'good' },
      { label: 'Satz Phase 1', val: '65 % + Zuschlag', cls: 'good' },
      { label: 'Garantiertes Min.', val: '55,40 €/Tag', cls: 'good' },
      { label: 'Max. Dauer', val: 'Unbegrenzt (unter Bed.)', cls: 'good' },
      { label: 'Neue Kategorie 2025', val: 'Besser gefasst', cls: 'good' },
      { label: 'Kontrolle', val: 'Alle 4 Monate', cls: '' },
    ]},
  ],
  en: [
    { id: 'p1', label: 'Young (<36)',          title: '👤 Profile : Young worker, under 36, single',                   rows: [
      { label: 'Required days', val: '312 days', cls: 'warn' },
      { label: 'Reference period', val: '27 months', cls: '' },
      { label: 'Phase 1 duration', val: '3 months', cls: 'good' },
      { label: 'Phase 1 rate', val: '65% ref. salary', cls: '' },
      { label: 'Minimum amount', val: '€47.20/day', cls: 'good' },
      { label: 'Monitoring', val: 'Every 4 months', cls: 'warn' },
    ]},
    { id: 'p2', label: 'Adult (36–49)',        title: '👤 Profile : Adult, 36–49, cohabiting',                         rows: [
      { label: 'Required days', val: '468 days', cls: '' },
      { label: 'Reference period', val: '36 months', cls: '' },
      { label: 'Phase 1 duration', val: '6–12 months', cls: 'good' },
      { label: 'Phase 1 rate', val: '60% ref. salary', cls: '' },
      { label: 'Minimum amount', val: '€43.50/day', cls: 'good' },
      { label: 'Monitoring', val: 'Every 4 months', cls: 'warn' },
    ]},
    { id: 'p3', label: 'Senior (50+)',         title: '👤 Profile : Senior, 50+, long career',                         rows: [
      { label: 'Required days', val: '624 days', cls: '' },
      { label: 'Reference period', val: '42 months', cls: '' },
      { label: 'Phase 1 duration', val: 'Up to 18 months', cls: 'good' },
      { label: 'Phase 1 rate', val: '65% ref. salary', cls: '' },
      { label: 'Minimum amount', val: '€47.20/day', cls: 'good' },
      { label: 'Monitoring', val: 'Every 6 months', cls: 'good' },
    ]},
    { id: 'p4', label: 'Head of household',    title: '👤 Profile : Head of household, with dependant',                rows: [
      { label: 'Head supplement', val: '+ 10%', cls: 'good' },
      { label: 'Phase 1 rate', val: '65% + supplement', cls: 'good' },
      { label: 'Guaranteed minimum', val: '€55.40/day', cls: 'good' },
      { label: 'Max duration', val: 'Unlimited (conditions)', cls: 'good' },
      { label: 'New 2025 category', val: 'Better framed', cls: 'good' },
      { label: 'Monitoring', val: 'Every 4 months', cls: '' },
    ]},
  ],
  ar: [
    { id: 'p1', label: 'شاب (<36)',             title: '👤 الملف : عامل شاب، أقل من 36، أعزب',                          rows: [
      { label: 'الأيام المطلوبة', val: '312 يومًا', cls: 'warn' },
      { label: 'الفترة المرجعية', val: '27 شهرًا', cls: '' },
      { label: 'مدة المرحلة 1', val: '3 أشهر', cls: 'good' },
      { label: 'نسبة المرحلة 1', val: '65% من الراتب المرجعي', cls: '' },
      { label: 'الحد الأدنى', val: '47.20 €/يوم', cls: 'good' },
      { label: 'المتابعة', val: 'كل 4 أشهر', cls: 'warn' },
    ]},
    { id: 'p2', label: 'بالغ (36–49)',          title: '👤 الملف : بالغ، 36–49، مُساكن',                                 rows: [
      { label: 'الأيام المطلوبة', val: '468 يومًا', cls: '' },
      { label: 'الفترة المرجعية', val: '36 شهرًا', cls: '' },
      { label: 'مدة المرحلة 1', val: '6–12 شهرًا', cls: 'good' },
      { label: 'نسبة المرحلة 1', val: '60% من الراتب المرجعي', cls: '' },
      { label: 'الحد الأدنى', val: '43.50 €/يوم', cls: 'good' },
      { label: 'المتابعة', val: 'كل 4 أشهر', cls: 'warn' },
    ]},
    { id: 'p3', label: 'كبير (50+)',            title: '👤 الملف : كبير، 50+، مسار طويل',                                rows: [
      { label: 'الأيام المطلوبة', val: '624 يومًا', cls: '' },
      { label: 'الفترة المرجعية', val: '42 شهرًا', cls: '' },
      { label: 'مدة المرحلة 1', val: 'حتى 18 شهرًا', cls: 'good' },
      { label: 'نسبة المرحلة 1', val: '65% من الراتب المرجعي', cls: '' },
      { label: 'الحد الأدنى', val: '47.20 €/يوم', cls: 'good' },
      { label: 'المتابعة', val: 'كل 6 أشهر', cls: 'good' },
    ]},
    { id: 'p4', label: 'رب أسرة',               title: '👤 الملف : رب أسرة، شخص مُعال',                                   rows: [
      { label: 'زيادة رب الأسرة', val: '+ 10%', cls: 'good' },
      { label: 'نسبة المرحلة 1', val: '65% + زيادة', cls: 'good' },
      { label: 'الحد الأدنى المضمون', val: '55.40 €/يوم', cls: 'good' },
      { label: 'المدة القصوى', val: 'غير محدودة (بشروط)', cls: 'good' },
      { label: 'فئة 2025 الجديدة', val: 'أفضل تأطيرًا', cls: 'good' },
      { label: 'المتابعة', val: 'كل 4 أشهر', cls: '' },
    ]},
  ],
}

export const REFORM_TIMELINE: RefDict<TLItem[]> = {
  fr: [
    { status: 'done',     date: 'Septembre 2023', title: 'Accord de gouvernement',              desc: "La réforme est inscrite dans l'accord de coalition.",                         chip: 'done' },
    { status: 'done',     date: 'Mars 2024',       title: 'Consultation des partenaires sociaux', desc: 'CNT et syndicats consultés. Amendements intégrés.',                          chip: 'done' },
    { status: 'done',     date: 'Juillet 2024',    title: 'Publication au Moniteur belge',        desc: "L'arrêté royal est publié officiellement.",                                  chip: 'published' },
    { status: 'active',   date: 'Janvier 2025',    title: 'Entrée en vigueur complète',           desc: "Toutes les dispositions s'appliquent. Régime transitoire en place.",        chip: 'active' },
    { status: 'upcoming', date: 'Juillet 2025',    title: 'Fin du régime transitoire (phase 1)',  desc: 'Les dossiers ouverts avant 2025 passent sous le nouveau régime.',            chip: 'soon' },
    { status: 'upcoming', date: 'Fin 2025',        title: 'Bilan et ajustements éventuels',       desc: 'ONEM et partenaires sociaux évalueront les effets.',                          chip: 'planned' },
  ],
  nl: [
    { status: 'done',     date: 'September 2023', title: 'Regeerakkoord',                         desc: 'Hervorming opgenomen in coalitieakkoord.',                                    chip: 'done' },
    { status: 'done',     date: 'Maart 2024',      title: 'Overleg sociale partners',             desc: 'NAR en vakbonden geconsulteerd. Amendementen opgenomen.',                     chip: 'done' },
    { status: 'done',     date: 'Juli 2024',       title: 'Bekendmaking in het Belgisch Staatsblad', desc: 'Koninklijk besluit officieel gepubliceerd.',                              chip: 'published' },
    { status: 'active',   date: 'Januari 2025',    title: 'Volledige inwerkingtreding',           desc: 'Alle bepalingen van toepassing. Overgangsregime.',                            chip: 'active' },
    { status: 'upcoming', date: 'Juli 2025',       title: 'Einde overgangsregime (fase 1)',       desc: 'Lopende dossiers gaan over naar nieuwe regime.',                              chip: 'soon' },
    { status: 'upcoming', date: 'Einde 2025',      title: 'Evaluatie en mogelijke bijsturing',    desc: 'RVA en sociale partners evalueren de effecten.',                             chip: 'planned' },
  ],
  de: [
    { status: 'done',     date: 'September 2023', title: 'Regierungsvereinbarung',                desc: 'Reform in Koalitionsvertrag aufgenommen.',                                    chip: 'done' },
    { status: 'done',     date: 'März 2024',       title: 'Anhörung Sozialpartner',               desc: 'Nationaler Arbeitsrat und Gewerkschaften angehört.',                          chip: 'done' },
    { status: 'done',     date: 'Juli 2024',       title: 'Veröffentlichung im Moniteur belge',   desc: 'Königlicher Erlass offiziell veröffentlicht.',                                chip: 'published' },
    { status: 'active',   date: 'Januar 2025',     title: 'Vollständiges Inkrafttreten',          desc: 'Alle Bestimmungen anwendbar. Übergangsregime.',                               chip: 'active' },
    { status: 'upcoming', date: 'Juli 2025',       title: 'Ende Übergangsregime (Phase 1)',       desc: 'Laufende Dossiers wechseln zum neuen Regime.',                                chip: 'soon' },
    { status: 'upcoming', date: 'Ende 2025',       title: 'Bilanz und evtl. Anpassungen',         desc: 'LfA und Sozialpartner werten Effekte aus.',                                   chip: 'planned' },
  ],
  en: [
    { status: 'done',     date: 'September 2023', title: 'Government agreement',                  desc: 'Reform enshrined in the coalition agreement.',                                chip: 'done' },
    { status: 'done',     date: 'March 2024',      title: 'Social partners consultation',         desc: 'NLC and unions consulted. Amendments integrated.',                            chip: 'done' },
    { status: 'done',     date: 'July 2024',       title: 'Published in Moniteur belge',          desc: 'Royal decree officially published.',                                          chip: 'published' },
    { status: 'active',   date: 'January 2025',    title: 'Full entry into force',                desc: 'All provisions apply. Transitional regime in place.',                         chip: 'active' },
    { status: 'upcoming', date: 'July 2025',       title: 'End of transitional regime (phase 1)', desc: 'Pre-2025 cases migrate to the new regime.',                                   chip: 'soon' },
    { status: 'upcoming', date: 'End of 2025',     title: 'Assessment and possible adjustments',  desc: 'ONEM and social partners will evaluate the effects.',                         chip: 'planned' },
  ],
  ar: [
    { status: 'done',     date: 'سبتمبر 2023',    title: 'اتفاقية الحكومة',                        desc: 'تم إدراج الإصلاح في اتفاقية الائتلاف.',                                       chip: 'done' },
    { status: 'done',     date: 'مارس 2024',       title: 'استشارة الشركاء الاجتماعيين',           desc: 'استشارة المجلس الوطني للعمل والنقابات. تضمين التعديلات.',                    chip: 'done' },
    { status: 'done',     date: 'يوليو 2024',      title: 'النشر في Moniteur belge',               desc: 'نُشر المرسوم الملكي رسميًا.',                                                  chip: 'published' },
    { status: 'active',   date: 'يناير 2025',      title: 'الدخول الكامل حيز التنفيذ',             desc: 'جميع الأحكام قابلة للتطبيق. نظام انتقالي قائم.',                              chip: 'active' },
    { status: 'upcoming', date: 'يوليو 2025',      title: 'نهاية النظام الانتقالي (المرحلة 1)',   desc: 'الملفات السابقة لعام 2025 تنتقل إلى النظام الجديد.',                           chip: 'soon' },
    { status: 'upcoming', date: 'نهاية 2025',      title: 'التقييم والتعديلات المحتملة',          desc: 'ستقيّم ONEM والشركاء الاجتماعيون الآثار.',                                     chip: 'planned' },
  ],
}

export const REFORM_FAQ_ITEMS: RefDict<{ q: string; p: string }[]> = {
  fr: [
    { q: "En quoi la réforme change-t-elle mes droits actuels ?",          p: "Période de référence, dégressivité, disponibilité — tout ce qui change concrètement." },
    { q: "Mon dossier en cours est-il impacté immédiatement ?",             p: "Le régime transitoire préserve vos droits acquis. Voici comment cela fonctionne." },
    { q: "Quelles sont les nouvelles obligations de disponibilité ?",      p: "Des entretiens plus fréquents, des sanctions plus strictes — ce qu'il faut savoir." },
    { q: "Toutes les questions sur la réforme →",                          p: "18 questions répondues dans notre FAQ complète, organisées par catégories." },
  ],
  nl: [
    { q: 'Hoe verandert de hervorming mijn huidige rechten?',              p: 'Referentieperiode, degressiviteit, beschikbaarheid — alles wat concreet verandert.' },
    { q: 'Wordt mijn lopend dossier onmiddellijk beïnvloed?',              p: 'Het overgangsregime beschermt verworven rechten. Zo werkt het.' },
    { q: 'Wat zijn de nieuwe beschikbaarheidsverplichtingen?',             p: 'Frequentere gesprekken, strengere sancties — wat u moet weten.' },
    { q: 'Alle vragen over de hervorming →',                               p: '18 vragen beantwoord in onze volledige FAQ, per categorie.' },
  ],
  de: [
    { q: 'Wie ändert die Reform meine aktuellen Rechte?',                  p: 'Referenzzeitraum, Degressivität, Verfügbarkeit — alles, was sich ändert.' },
    { q: 'Wird mein laufendes Dossier sofort betroffen?',                  p: 'Das Übergangsregime schützt erworbene Rechte. So funktioniert es.' },
    { q: 'Was sind die neuen Verfügbarkeitspflichten?',                    p: 'Häufigere Gespräche, strengere Sanktionen — was Sie wissen müssen.' },
    { q: 'Alle Fragen zur Reform →',                                       p: '18 Fragen in unserem vollständigen FAQ beantwortet.' },
  ],
  en: [
    { q: 'How does the reform change my current rights?',                  p: 'Reference period, degressivity, availability — everything that concretely changes.' },
    { q: 'Is my existing case immediately impacted?',                      p: 'The transitional regime preserves your acquired rights. How it works.' },
    { q: 'What are the new availability obligations?',                     p: 'More frequent interviews, stricter sanctions — what you need to know.' },
    { q: 'All questions about the reform →',                               p: '18 questions answered in our full FAQ, organised by category.' },
  ],
  ar: [
    { q: 'كيف يغير الإصلاح حقوقي الحالية؟',                                 p: 'الفترة المرجعية، التناقص، التوفر — كل ما يتغير ملموسًا.' },
    { q: 'هل يتأثر ملفي الجاري فورًا؟',                                     p: 'النظام الانتقالي يحافظ على حقوقك المكتسبة. كيف يعمل.' },
    { q: 'ما هي التزامات التوفر الجديدة؟',                                  p: 'مقابلات أكثر تواترًا، عقوبات أكثر صرامة — ما تحتاج معرفته.' },
    { q: 'جميع الأسئلة حول الإصلاح ←',                                     p: '18 سؤالًا تم الإجابة عليها في أسئلتنا الشائعة الكاملة.' },
  ],
}

/* ─── NEWS ────────────────────────────────────────────────────────────── */
export type NewsItem = {
  date: string; tag: 'reform'|'info'|'alert';
  title: string; excerpt: string; href: string; featured?: boolean;
}
export const NEWS_ITEMS: RefDict<NewsItem[]> = {
  fr: [
    { date: '2025-01-01', tag: 'reform', featured: true, title: 'Réforme 2025 du chômage : ce qui change réellement', excerpt: "Dégressivité accélérée, durée maximale réduite, nouvelles conditions d'accès : l'ensemble des changements expliqués simplement.", href: '/reforme' },
    { date: '2025-02-14', tag: 'info',  title: 'Formulaire C4 : erreurs fréquentes à éviter',                          excerpt: 'La plupart des rejets viennent de 3 erreurs évitables. Notre guide rapide.', href: '#' },
    { date: '2025-03-02', tag: 'alert', title: "Nouveaux délais d'inscription auprès des services régionaux",          excerpt: "Depuis mars 2025, le délai d'inscription à Actiris, VDAB ou FOREM est strictement encadré.", href: '#' },
    { date: '2025-03-20', tag: 'info',  title: 'Cohabitants : la nouvelle grille de calcul expliquée',                 excerpt: 'Le taux applicable aux cohabitants a été revu. Comment estimer votre nouvelle allocation.', href: '#' },
    { date: '2025-04-05', tag: 'info',  title: "Jeunes de moins de 25 ans : stage d'insertion actualisé",              excerpt: "La durée du stage d'insertion évolue. Synthèse pour les primo-demandeurs.", href: '#' },
  ],
  nl: [
    { date: '2025-01-01', tag: 'reform', featured: true, title: 'Hervorming 2025 van de werkloosheid: wat er werkelijk verandert', excerpt: 'Versnelde degressiviteit, ingekorte maximumduur, nieuwe toegangsvoorwaarden: alle wijzigingen eenvoudig uitgelegd.', href: '/reforme' },
    { date: '2025-02-14', tag: 'info',  title: 'Formulier C4: veelvoorkomende fouten om te vermijden',                        excerpt: 'De meeste afwijzingen komen van 3 vermijdbare fouten. Onze snelle gids.', href: '#' },
    { date: '2025-03-02', tag: 'alert', title: 'Nieuwe inschrijvingstermijnen bij regionale diensten',                        excerpt: 'Sinds maart 2025 zijn de termijnen voor VDAB, Actiris en FOREM strikt geregeld.', href: '#' },
    { date: '2025-03-20', tag: 'info',  title: 'Samenwonenden: de nieuwe berekeningsrooster uitgelegd',                       excerpt: 'Het tarief voor samenwonenden werd herzien. Hoe uw nieuwe uitkering in te schatten.', href: '#' },
    { date: '2025-04-05', tag: 'info',  title: 'Jongeren onder 25: bijgewerkte inschakelingsperiode',                         excerpt: 'De duur van de inschakelingsperiode evolueert. Samenvatting voor eerste aanvragers.', href: '#' },
  ],
  de: [
    { date: '2025-01-01', tag: 'reform', featured: true, title: 'Arbeitslosenreform 2025: was wirklich ändert',  excerpt: 'Beschleunigte Degressivität, verkürzte Höchstdauer, neue Zugangsbedingungen: alle Änderungen einfach erklärt.', href: '/reforme' },
    { date: '2025-02-14', tag: 'info',  title: 'Formular C4: häufige Fehler vermeiden',                           excerpt: 'Die meisten Ablehnungen entstehen aus 3 vermeidbaren Fehlern. Unser Kurzführer.', href: '#' },
    { date: '2025-03-02', tag: 'alert', title: 'Neue Anmeldefristen bei regionalen Stellen',                      excerpt: 'Seit März 2025 sind die Fristen für ADG, FOREM, VDAB und Actiris strikt geregelt.', href: '#' },
    { date: '2025-03-20', tag: 'info',  title: 'Zusammenlebende: das neue Berechnungsschema erklärt',             excerpt: 'Der Satz für Zusammenlebende wurde überarbeitet. So schätzen Sie Ihre neue Leistung ein.', href: '#' },
    { date: '2025-04-05', tag: 'info',  title: 'Jugendliche unter 25: aktualisierte Eingliederungsphase',         excerpt: 'Die Dauer der Eingliederungsphase entwickelt sich. Zusammenfassung für Erstantragsteller.', href: '#' },
  ],
  en: [
    { date: '2025-01-01', tag: 'reform', featured: true, title: '2025 unemployment reform: what really changes', excerpt: 'Accelerated degressivity, reduced maximum duration, new access conditions: all changes explained simply.', href: '/reforme' },
    { date: '2025-02-14', tag: 'info',  title: 'Form C4: common mistakes to avoid',                               excerpt: 'Most rejections come from 3 avoidable mistakes. Our quick guide.', href: '#' },
    { date: '2025-03-02', tag: 'alert', title: 'New registration deadlines with regional services',              excerpt: 'Since March 2025, deadlines for Actiris, VDAB or FOREM are strictly regulated.', href: '#' },
    { date: '2025-03-20', tag: 'info',  title: 'Cohabitants: the new calculation grid explained',                excerpt: 'The rate for cohabitants has been revised. How to estimate your new benefit.', href: '#' },
    { date: '2025-04-05', tag: 'info',  title: 'Under 25s: updated integration internship',                       excerpt: 'The duration of the integration internship evolves. Summary for first-time claimants.', href: '#' },
  ],
  ar: [
    { date: '2025-01-01', tag: 'reform', featured: true, title: 'إصلاح البطالة 2025: ما الذي يتغير حقًا', excerpt: 'تناقص متسارع، مدة قصوى مخفضة، شروط دخول جديدة: جميع التغييرات موضحة ببساطة.', href: '/reforme' },
    { date: '2025-02-14', tag: 'info',  title: 'نموذج C4: الأخطاء الشائعة الواجب تجنبها',                                  excerpt: 'معظم حالات الرفض تأتي من 3 أخطاء يمكن تجنبها. دليلنا السريع.', href: '#' },
    { date: '2025-03-02', tag: 'alert', title: 'آجال تسجيل جديدة لدى الخدمات الإقليمية',                                   excerpt: 'منذ مارس 2025، أصبحت آجال Actiris و VDAB و FOREM منظمة بشكل صارم.', href: '#' },
    { date: '2025-03-20', tag: 'info',  title: 'المتساكنون: شرح شبكة الحساب الجديدة',                                      excerpt: 'تمت مراجعة النسبة المطبقة على المتساكنين. كيفية تقدير إعانتك الجديدة.', href: '#' },
    { date: '2025-04-05', tag: 'info',  title: 'أقل من 25: تحديث فترة الإدماج',                                            excerpt: 'تتطور مدة فترة الإدماج. ملخص لطالبي التعويض لأول مرة.', href: '#' },
  ],
}

/* ─── TOOLS (outils page) ────────────────────────────────────────────── */
export type ToolItem = { icon: string; title: string; desc: string; href: string; cta: 'start'|'calc'|'compare'|'browse'|'soon'; tag?: string }
export const TOOLS_ITEMS: RefDict<ToolItem[]> = {
  fr: [
    { icon: '🔍', title: 'Vérifier mon éligibilité',     desc: "5 questions pour savoir si vous remplissez les conditions d'accès aux allocations.",    href: '/simulation', cta: 'start' },
    { icon: '🧮', title: 'Calculer mes allocations',     desc: 'Estimez votre montant selon votre âge, ancienneté et situation familiale.',             href: '/simulation', cta: 'calc' },
    { icon: '⚡', title: 'Impact de la réforme 2025',    desc: 'Comparez votre situation avant et après la réforme — tout ce qui change pour vous.',    href: '/reforme',    cta: 'compare', tag: 'MAJ' },
    { icon: '❓', title: 'FAQ',                          desc: 'Les réponses claires aux 18 questions les plus posées sur le chômage belge.',           href: '/faq',        cta: 'browse' },
    { icon: '📋', title: 'Formulaires assistés',         desc: 'Remplissez C1, C4, C131A, C3 avec un guide champ par champ. (bientôt)',                 href: '#',           cta: 'soon' },
    { icon: '📖', title: 'Lexique juridique',            desc: "Comprenez le vocabulaire administratif : carence, stage, dégressivité, etc.", href: '/lexique',    cta: 'browse' },
    { icon: '🏛️', title: 'Trouver un organisme',         desc: 'Localisez votre bureau ONEM, Actiris, VDAB ou FOREM le plus proche. (bientôt)',         href: '#',           cta: 'soon' },
    { icon: '📅', title: 'Calendrier des délais',        desc: 'Les échéances à ne pas manquer : inscription, dépôt de C4, déclarations. (bientôt)',   href: '#',           cta: 'soon' },
  ],
  nl: [
    { icon: '🔍', title: 'Mijn recht controleren',       desc: '5 vragen om te weten of u aan de toegangsvoorwaarden voldoet.',                          href: '/simulation', cta: 'start' },
    { icon: '🧮', title: 'Mijn uitkering berekenen',     desc: 'Schat uw bedrag op basis van leeftijd, anciënniteit en gezinssituatie.',                 href: '/simulation', cta: 'calc' },
    { icon: '⚡', title: 'Impact hervorming 2025',       desc: 'Vergelijk uw situatie voor en na de hervorming — alles wat voor u verandert.',           href: '/reforme',    cta: 'compare', tag: 'UPD' },
    { icon: '❓', title: 'FAQ',                          desc: 'Duidelijke antwoorden op de 18 meest gestelde vragen over Belgische werkloosheid.',      href: '/faq',        cta: 'browse' },
    { icon: '📋', title: 'Geleide formulieren',          desc: 'Vul C1, C4, C131A, C3 in met een gids veld per veld. (binnenkort)',                      href: '#',           cta: 'soon' },
    { icon: '📖', title: 'Juridische woordenlijst',      desc: 'Begrijp de administratieve vocabulaire: wachttijd, beroepsloopbaan, degressiviteit.', href: '/lexique', cta: 'browse' },
    { icon: '🏛️', title: 'Een instelling vinden',        desc: 'Vind het dichtstbijzijnde RVA, Actiris, VDAB of FOREM kantoor. (binnenkort)',            href: '#',           cta: 'soon' },
    { icon: '📅', title: 'Termijnkalender',              desc: 'Termijnen om niet te missen: inschrijving, C4 indienen, aangiften. (binnenkort)',       href: '#',           cta: 'soon' },
  ],
  de: [
    { icon: '🔍', title: 'Anspruch prüfen',              desc: '5 Fragen, um zu wissen, ob Sie die Zugangsbedingungen erfüllen.',                         href: '/simulation', cta: 'start' },
    { icon: '🧮', title: 'Leistungen berechnen',         desc: 'Schätzen Sie Ihren Betrag nach Alter, Betriebszugehörigkeit, Familienstand.',           href: '/simulation', cta: 'calc' },
    { icon: '⚡', title: 'Auswirkung Reform 2025',       desc: 'Vergleichen Sie Ihre Situation vor und nach der Reform — alles, was sich ändert.',       href: '/reforme',    cta: 'compare', tag: 'NEU' },
    { icon: '❓', title: 'FAQ',                          desc: 'Klare Antworten auf die 18 häufigsten Fragen zur belgischen Arbeitslosigkeit.',          href: '/faq',        cta: 'browse' },
    { icon: '📋', title: 'Geführte Formulare',           desc: 'Füllen Sie C1, C4, C131A, C3 mit einem Feld-für-Feld-Leitfaden aus. (demnächst)',        href: '#',           cta: 'soon' },
    { icon: '📖', title: 'Juristisches Glossar',         desc: 'Verstehen Sie das Verwaltungsvokabular: Wartezeit, Stage, Degressivität.', href: '/lexique',    cta: 'browse' },
    { icon: '🏛️', title: 'Eine Stelle finden',           desc: 'Nächstes LfA-, Actiris-, VDAB- oder FOREM-Büro finden. (demnächst)',                     href: '#',           cta: 'soon' },
    { icon: '📅', title: 'Fristenkalender',              desc: 'Wichtige Fristen: Anmeldung, C4-Einreichung, Meldungen. (demnächst)',                    href: '#',           cta: 'soon' },
  ],
  en: [
    { icon: '🔍', title: 'Check my eligibility',         desc: '5 questions to know if you meet the conditions for benefits.',                            href: '/simulation', cta: 'start' },
    { icon: '🧮', title: 'Calculate my benefits',        desc: 'Estimate your amount based on age, seniority and family situation.',                     href: '/simulation', cta: 'calc' },
    { icon: '⚡', title: '2025 reform impact',           desc: 'Compare your situation before and after the reform — everything that changes for you.',  href: '/reforme',    cta: 'compare', tag: 'NEW' },
    { icon: '❓', title: 'FAQ',                          desc: 'Clear answers to the 18 most-asked questions about Belgian unemployment.',                href: '/faq',        cta: 'browse' },
    { icon: '📋', title: 'Form assistant',               desc: 'Fill in C1, C4, C131A, C3 with a field-by-field guide. (coming soon)',                    href: '#',           cta: 'soon' },
    { icon: '📖', title: 'Legal glossary',               desc: 'Understand the administrative vocabulary: waiting period, stage, degressivity.', href: '/lexique',    cta: 'browse' },
    { icon: '🏛️', title: 'Find an organisation',         desc: 'Locate your nearest ONEM, Actiris, VDAB or FOREM office. (coming soon)',                  href: '#',           cta: 'soon' },
    { icon: '📅', title: 'Deadlines calendar',           desc: "Don't miss deadlines: registration, C4 filing, declarations. (coming soon)",              href: '#',           cta: 'soon' },
  ],
  ar: [
    { icon: '🔍', title: 'تحقق من أهليتي',                desc: '5 أسئلة لمعرفة ما إذا كنت تستوفي شروط الاستفادة.',                                          href: '/simulation', cta: 'start' },
    { icon: '🧮', title: 'احسب تعويضاتي',                 desc: 'قدّر مبلغك حسب العمر والأقدمية والحالة العائلية.',                                          href: '/simulation', cta: 'calc' },
    { icon: '⚡', title: 'تأثير إصلاح 2025',              desc: 'قارن وضعك قبل وبعد الإصلاح — كل ما يتغير بالنسبة لك.',                                     href: '/reforme',    cta: 'compare', tag: 'جديد' },
    { icon: '❓', title: 'الأسئلة الشائعة',              desc: 'إجابات واضحة للأسئلة الـ 18 الأكثر طرحًا حول البطالة البلجيكية.',                            href: '/faq',        cta: 'browse' },
    { icon: '📋', title: 'النماذج الموجهة',              desc: 'املأ C1 و C4 و C131A و C3 بدليل حقلًا بحقل. (قريبًا)',                                         href: '#',           cta: 'soon' },
    { icon: '📖', title: 'معجم قانوني',                   desc: 'افهم المفردات الإدارية: فترة الانتظار، المسار، التناقص.',                               href: '/lexique',    cta: 'browse' },
    { icon: '🏛️', title: 'ابحث عن هيئة',                 desc: 'حدد أقرب مكتب ONEM أو Actiris أو VDAB أو FOREM. (قريبًا)',                                 href: '#',           cta: 'soon' },
    { icon: '📅', title: 'تقويم الآجال',                  desc: 'الآجال التي لا يجب تفويتها: التسجيل، تقديم C4، التصريحات. (قريبًا)',                         href: '#',           cta: 'soon' },
  ],
}

/* helpers */
export function getReformChanges(code: string) { return REFORM_CHANGES[resolveLang(code)] }
export function getReformProfiles(code: string) { return REFORM_PROFILES[resolveLang(code)] }
export function getReformTimeline(code: string) { return REFORM_TIMELINE[resolveLang(code)] }
export function getReformFaqItems(code: string) { return REFORM_FAQ_ITEMS[resolveLang(code)] }
export function getNewsItems(code: string) { return NEWS_ITEMS[resolveLang(code)] }
export function getToolsItems(code: string) { return TOOLS_ITEMS[resolveLang(code)] }
