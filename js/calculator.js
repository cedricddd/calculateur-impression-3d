// Calculateur de prix d'impression 3D
// Gère tous les calculs et mises à jour de l'interface

// ============================================================
// DONNÉES ENTREPRISE – identiques au module devis Ced-IT
// ============================================================
const COMPANY = {
    name:         'CED-IT',
    address:      'Rue Thier May 42',
    city:         '4910 Theux',
    phone:        '0495 20 92 78',
    email:        'cedric@ced-it.be',
    website:      'www.ced-it.com',
    vat:          'BE 1019.855.327',
    iban:         'BE84 7320 8002 5859',
    bank:         'CBC',
    manager:      'Cédric',
    managerTitle: 'Gérant CED-IT',
};

// ============================================================
// SSO – Token SaaS + profil entreprise dynamique
// ============================================================
const SAAS_URL = 'https://saas.ced-it.be';
const APP_SLUG  = 'calculateur-3d';
const TOKEN_KEY = 'ced-app-token';

/**
 * Capture le token SSO depuis l'URL (?token=…) et le stocke en localStorage.
 * Nettoie l'URL immédiatement pour éviter qu'il reste visible.
 */
function captureSsoToken() {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get('token');
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        params.delete('token');
        const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState({}, '', newUrl);
    }
}

/**
 * Récupère le profil entreprise depuis le SaaS.
 * Retourne les données du profil si disponibles, sinon le fallback COMPANY.
 */
const EMPTY_PROFILE = {
    name: '', address: '', city: '', phone: '', email: '',
    website: '', vat: '', iban: '', bank: '',
    manager: '', managerTitle: '', logoUrl: null,
};
const PROFILE_CACHE_KEY = 'ced-company-profile-cache';

function getCachedProfile() {
    try {
        const raw = localStorage.getItem(PROFILE_CACHE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
}

async function fetchCompanyProfile() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
        return getCachedProfile() || EMPTY_PROFILE;
    }

    try {
        const res = await fetch(`${SAAS_URL}/api/apps/${APP_SLUG}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
            // Token expiré – on le supprime, on utilise le cache
            localStorage.removeItem(TOKEN_KEY);
            return getCachedProfile() || EMPTY_PROFILE;
        }

        if (!res.ok) return getCachedProfile() || EMPTY_PROFILE;

        const { profile } = await res.json();

        if (!profile) return getCachedProfile() || EMPTY_PROFILE;

        const result = {
            name:         profile.companyName  || '',
            address:      profile.address      || '',
            city:         (profile.postalCode && profile.city)
                            ? `${profile.postalCode} ${profile.city}`
                            : (profile.city || ''),
            phone:        profile.phone        || '',
            email:        profile.companyEmail || '',
            website:      profile.website      || '',
            vat:          profile.vatNumber    || '',
            iban:         profile.iban         || '',
            bank:         profile.bank         || '',
            manager:      profile.manager      || '',
            managerTitle: profile.managerTitle || '',
            logoUrl:      profile.logoPath ? `${SAAS_URL}${profile.logoPath}` : null,
        };

        // Mettre en cache pour les prochaines utilisations (token expiré, hors-ligne, etc.)
        localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(result));
        return result;
    } catch (_) {
        return getCachedProfile() || EMPTY_PROFILE;
    }
}

// Capturer le token SSO dès le chargement du script
captureSsoToken();

/**
 * Met à jour le bouton de connexion SSO selon l'état du token.
 */
function updateSsoButton() {
    const btn = document.getElementById('btnSsoLogin');
    const txt = document.getElementById('btnSsoText');
    if (!btn || !txt) return;
    const token = localStorage.getItem(TOKEN_KEY);
    const cached = getCachedProfile();
    if (token || cached?.name) {
        btn.classList.add('connected');
        txt.textContent = cached?.name ? cached.name : 'Connecté';
    } else {
        btn.classList.remove('connected');
        txt.textContent = 'Connexion';
    }
}

/**
 * Déclenche le flux SSO ou déconnecte si déjà connecté.
 */
function handleSsoLogin() {
    const token = localStorage.getItem(TOKEN_KEY);
    const cached = getCachedProfile();
    if (token || cached?.name) {
        // Déconnexion : supprimer token et cache
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(PROFILE_CACHE_KEY);
        updateSsoButton();
        return;
    }
    const redirectUrl = window.location.origin + window.location.pathname;
    window.location.href = `${SAAS_URL}/auth/app-login?appSlug=${APP_SLUG}&redirectUrl=${encodeURIComponent(redirectUrl)}`;
}

document.addEventListener('DOMContentLoaded', updateSsoButton);

// Valeurs par défaut pour la densité selon le type de filament
const filamentDensities = {
    'PLA': 1.24,
    'ABS': 1.04,
    'PETG': 1.27,
    'TPU': 1.21,
    'Nylon': 1.14,
    'PC': 1.20,
    'ASA': 1.07,
    'autre': 1.24
};

// Présets d'imprimantes populaires
const printerPresets = {
    'bambu-a1': {
        name: 'Bambu Lab A1',
        printerCost: 299,
        powerConsumption: 100,
        printerLifespan: 5000,
        maintenanceCost: 0.08
    }
};

// Variable globale pour le graphique
let costChart = null;

// Clé de stockage pour la comparaison de matériaux
const COMPARISON_STORAGE_KEY = '3dprintComparisonMaterials';

// ============================================================
// SYSTÈME DE TRADUCTION (i18n)
// ============================================================
const TRANSLATIONS = {
    fr: {
        'app.title':"Calculateur d'Impression 3D",'app.subtitle':'Calculez précisément le coût de vos impressions 3D',
        'stat.formats':'STL & 3MF supportés','stat.calc':'Calcul précis','stat.export':'Export PDF',
        'sec.params':"Paramètres de l'impression",'sec.import':'Import STL / 3MF (Optionnel)','sec.filament':'Filament',
        'sec.duration':'Durée','sec.operations':"Coûts d'exploitation",'sec.advanced':'Paramètres avancés',
        'sec.printer':'Imprimante','sec.results':'Résultats','sec.chartTitle':'Répartition des coûts',
        'lbl.filamentType':'Type de filament','lbl.filamentPrice':'Prix du filament (€/kg)',
        'lbl.filamentWeight':'Poids utilisé (g)','lbl.filamentDensity':'Densité (g/cm³)',
        'lbl.hours':'Heures','lbl.minutes':'Minutes','lbl.totalTime':'Temps total',
        'lbl.power':'Consommation imprimante (W)','lbl.electricity':'Prix électricité (€/kWh)',
        'lbl.printerCost':'Coût imprimante (€)','lbl.printerLifespan':'Durée de vie (heures)',
        'lbl.maintenance':'Maintenance (€/heure)','lbl.failureRate':"Taux d'échec (%)",
        'lbl.profitMargin':'Marge bénéficiaire (%)','lbl.laborHours':"Durée main-d'œuvre (heures)",
        'lbl.laborCost':"Taux horaire main-d'œuvre (€/h)",
        'btn.loadPreset':'Charger les paramètres Bambu Lab A1','btn.save':'Sauvegarder',
        'btn.load':'Charger','btn.reset':'Réinitialiser','btn.pdf':'PDF',
        'btn.calculate':'Calculer le coût','btn.addMaterial':'Ajouter un matériau','btn.browse':'Parcourir les fichiers',
        'upload.dropzone':'Glissez-déposez vos fichiers ici',
        'upload.formats':'Formats acceptés : STL, 3MF (plusieurs fichiers possibles)',
        'res.totalCost':'Coût Total','res.withoutMargin':'Hors marge bénéficiaire',
        'res.costDetails':'Détails des coûts','res.file':'Fichier','res.filament':'Filament',
        'res.electricity':'Électricité','res.depreciation':'Amortissement',
        'res.maintenance':'Maintenance','res.failures':'Échecs','res.labor':"Main-d'œuvre",
        'res.sellingPrice':'PRIX DE VENTE SUGGÉRÉ','res.withMargin':'avec marge bénéficiaire',
        'tbl.compTitle':'Comparaison de Matériaux','tbl.use':'Utiliser','tbl.material':'Matériau',
        'tbl.color':'Couleur',
        'tbl.filamentCost':'Coût filament','tbl.totalCost':'Coût total','tbl.sellingPrice':'Prix vente',
        'tbl.empty':'Cliquez sur "Ajouter un matériau" pour comparer différents filaments',
        'lbl.filamentColor':'Couleur du filament',
        'hist.title':'Historique des calculs','hist.clear':"Effacer l'historique",'hist.close':'Fermer',
        'calc.calculating':'Calcul en cours...',
        'pdf.title':"DEVIS D'IMPRESSION 3D",'pdf.reference':'Référence','pdf.emitter':'ÉMETTEUR','pdf.client':'CLIENT',
        'pdf.sellingPrice':'PRIX DE VENTE','pdf.details':'DÉTAILS DU PROJET','pdf.printTime':"Temps d'impression",
        'pdf.piece':'Pièce','pdf.pieces':'Pièces ({n} fichiers)',
        'pdf.noteTitle':'Ce prix comprend :',
        'pdf.noteBody':"la main-d'œuvre ({h}h à {r} €/h), le filament, la consommation électrique, l'amortissement machine, la maintenance et une provision pour les éventuels échecs d'impression. Il n'inclut pas les frais d'envoi.",
        'pdf.preview3d':'APERÇU 3D',
        'pdf.footer':"Ce devis est établi à titre indicatif. Les prix peuvent varier selon la complexité réelle du projet.",
    },
    en: {
        'app.title':'3D Printing Cost Calculator','app.subtitle':'Precisely calculate your 3D printing costs',
        'stat.formats':'STL & 3MF supported','stat.calc':'Precise calculation','stat.export':'PDF Export',
        'sec.params':'Print Parameters','sec.import':'Import STL / 3MF (Optional)','sec.filament':'Filament',
        'sec.duration':'Duration','sec.operations':'Operating Costs','sec.advanced':'Advanced Parameters',
        'sec.printer':'Printer','sec.results':'Results','sec.chartTitle':'Cost breakdown',
        'lbl.filamentType':'Filament Type','lbl.filamentPrice':'Filament Price (€/kg)',
        'lbl.filamentWeight':'Weight used (g)','lbl.filamentDensity':'Density (g/cm³)',
        'lbl.hours':'Hours','lbl.minutes':'Minutes','lbl.totalTime':'Total time',
        'lbl.power':'Printer consumption (W)','lbl.electricity':'Electricity price (€/kWh)',
        'lbl.printerCost':'Printer cost (€)','lbl.printerLifespan':'Lifespan (hours)',
        'lbl.maintenance':'Maintenance (€/hour)','lbl.failureRate':'Failure rate (%)',
        'lbl.profitMargin':'Profit margin (%)','lbl.laborHours':'Labor hours',
        'lbl.laborCost':'Labor rate (€/h)',
        'btn.loadPreset':'Load Bambu Lab A1 presets','btn.save':'Save',
        'btn.load':'Load','btn.reset':'Reset','btn.pdf':'PDF',
        'btn.calculate':'Calculate cost','btn.addMaterial':'Add material','btn.browse':'Browse files',
        'upload.dropzone':'Drag and drop your files here',
        'upload.formats':'Accepted formats: STL, 3MF (multiple files allowed)',
        'res.totalCost':'Total Cost','res.withoutMargin':'Excluding profit margin',
        'res.costDetails':'Cost Details','res.file':'File','res.filament':'Filament',
        'res.electricity':'Electricity','res.depreciation':'Depreciation',
        'res.maintenance':'Maintenance','res.failures':'Failures','res.labor':'Labor',
        'res.sellingPrice':'SUGGESTED SELLING PRICE','res.withMargin':'with profit margin',
        'tbl.compTitle':'Material Comparison','tbl.use':'Use','tbl.material':'Material',
        'tbl.color':'Color',
        'tbl.filamentCost':'Filament cost','tbl.totalCost':'Total cost','tbl.sellingPrice':'Sale price',
        'tbl.empty':'Click "Add material" to compare different filaments',
        'lbl.filamentColor':'Filament color',
        'hist.title':'Calculation History','hist.clear':'Clear history','hist.close':'Close',
        'calc.calculating':'Calculating...',
        'pdf.title':'3D PRINTING QUOTE','pdf.reference':'Reference','pdf.emitter':'FROM','pdf.client':'CLIENT',
        'pdf.sellingPrice':'SELLING PRICE','pdf.details':'PROJECT DETAILS','pdf.printTime':'Print time',
        'pdf.piece':'Part','pdf.pieces':'Parts ({n} files)',
        'pdf.noteTitle':'This price includes:',
        'pdf.noteBody':'labor ({h}h at {r} €/h), filament, electricity consumption, machine depreciation, maintenance, and a provision for potential print failures. Shipping costs are not included.',
        'pdf.preview3d':'3D PREVIEW',
        'pdf.footer':'This quote is provided for information purposes only. Prices may vary depending on the actual complexity of the project.',
    },
    nl: {
        'app.title':'3D-printprijscalculator','app.subtitle':'Bereken nauwkeurig de kosten van uw 3D-prints',
        'stat.formats':'STL & 3MF ondersteund','stat.calc':'Nauwkeurige berekening','stat.export':'PDF exporteren',
        'sec.params':'Afdrukparameters','sec.import':'STL / 3MF importeren (Optioneel)','sec.filament':'Filament',
        'sec.duration':'Duur','sec.operations':'Exploitatiekosten','sec.advanced':'Geavanceerde parameters',
        'sec.printer':'Printer','sec.results':'Resultaten','sec.chartTitle':'Kostenverdeling',
        'lbl.filamentType':'Filamenttype','lbl.filamentPrice':'Filamentprijs (€/kg)',
        'lbl.filamentWeight':'Gebruikt gewicht (g)','lbl.filamentDensity':'Dichtheid (g/cm³)',
        'lbl.hours':'Uren','lbl.minutes':'Minuten','lbl.totalTime':'Totale tijd',
        'lbl.power':'Printerverbruik (W)','lbl.electricity':'Elektriciteitsprijs (€/kWh)',
        'lbl.printerCost':'Printerkosten (€)','lbl.printerLifespan':'Levensduur (uren)',
        'lbl.maintenance':'Onderhoud (€/uur)','lbl.failureRate':'Uitvalpercentage (%)',
        'lbl.profitMargin':'Winstmarge (%)','lbl.laborHours':'Arbeidsuren',
        'lbl.laborCost':'Arbeidstarief (€/h)',
        'btn.loadPreset':'Bambu Lab A1-instellingen laden','btn.save':'Opslaan',
        'btn.load':'Laden','btn.reset':'Resetten','btn.pdf':'PDF',
        'btn.calculate':'Kosten berekenen','btn.addMaterial':'Materiaal toevoegen','btn.browse':'Bestanden bladeren',
        'upload.dropzone':'Sleep uw bestanden hier naartoe',
        'upload.formats':'Geaccepteerde formaten: STL, 3MF (meerdere bestanden mogelijk)',
        'res.totalCost':'Totale kosten','res.withoutMargin':'Exclusief winstmarge',
        'res.costDetails':'Kostenoverzicht','res.file':'Bestand','res.filament':'Filament',
        'res.electricity':'Elektriciteit','res.depreciation':'Afschrijving',
        'res.maintenance':'Onderhoud','res.failures':'Uitval','res.labor':'Arbeid',
        'res.sellingPrice':'AANBEVOLEN VERKOOPPRIJS','res.withMargin':'met winstmarge',
        'tbl.compTitle':'Materiaalvergelijking','tbl.use':'Gebruiken','tbl.material':'Materiaal',
        'tbl.color':'Kleur',
        'tbl.filamentCost':'Filamentkosten','tbl.totalCost':'Totale kosten','tbl.sellingPrice':'Verkoopprijs',
        'tbl.empty':'Klik op "Materiaal toevoegen" om verschillende filamenten te vergelijken',
        'lbl.filamentColor':'Kleur van filament',
        'hist.title':'Berekeningsgeschiedenis','hist.clear':'Geschiedenis wissen','hist.close':'Sluiten',
        'calc.calculating':'Berekening...',
        'pdf.title':'OFFERTE 3D-AFDRUKKEN','pdf.reference':'Referentie','pdf.emitter':'VAN','pdf.client':'KLANT',
        'pdf.sellingPrice':'VERKOOPPRIJS','pdf.details':'PROJECTDETAILS','pdf.printTime':'Afdruktijd',
        'pdf.piece':'Onderdeel','pdf.pieces':'Onderdelen ({n} bestanden)',
        'pdf.noteTitle':'Deze prijs omvat:',
        'pdf.noteBody':'arbeid ({h}u aan {r} €/u), filament, elektriciteitsverbruik, machineafschrijving, onderhoud en een voorziening voor mogelijke mislukte afdrukken. Verzendkosten zijn niet inbegrepen.',
        'pdf.preview3d':'3D-VOORBEELD',
        'pdf.footer':'Deze offerte is uitsluitend informatief. Prijzen kunnen variëren naargelang de werkelijke complexiteit van het project.',
    },
    de: {
        'app.title':'3D-Druckkostenrechner','app.subtitle':'Berechnen Sie genau die Kosten Ihrer 3D-Drucke',
        'stat.formats':'STL & 3MF unterstützt','stat.calc':'Präzise Berechnung','stat.export':'PDF-Export',
        'sec.params':'Druckparameter','sec.import':'STL / 3MF importieren (Optional)','sec.filament':'Filament',
        'sec.duration':'Dauer','sec.operations':'Betriebskosten','sec.advanced':'Erweiterte Parameter',
        'sec.printer':'Drucker','sec.results':'Ergebnisse','sec.chartTitle':'Kostenverteilung',
        'lbl.filamentType':'Filamenttyp','lbl.filamentPrice':'Filamentpreis (€/kg)',
        'lbl.filamentWeight':'Verwendetes Gewicht (g)','lbl.filamentDensity':'Dichte (g/cm³)',
        'lbl.hours':'Stunden','lbl.minutes':'Minuten','lbl.totalTime':'Gesamtzeit',
        'lbl.power':'Druckerverbrauch (W)','lbl.electricity':'Strompreis (€/kWh)',
        'lbl.printerCost':'Druckerkosten (€)','lbl.printerLifespan':'Lebensdauer (Stunden)',
        'lbl.maintenance':'Wartung (€/Stunde)','lbl.failureRate':'Ausfallrate (%)',
        'lbl.profitMargin':'Gewinnmarge (%)','lbl.laborHours':'Arbeitsstunden',
        'lbl.laborCost':'Arbeitslohn (€/h)',
        'btn.loadPreset':'Bambu Lab A1-Einstellungen laden','btn.save':'Speichern',
        'btn.load':'Laden','btn.reset':'Zurücksetzen','btn.pdf':'PDF',
        'btn.calculate':'Kosten berechnen','btn.addMaterial':'Material hinzufügen','btn.browse':'Dateien durchsuchen',
        'upload.dropzone':'Dateien hier ablegen',
        'upload.formats':'Akzeptierte Formate: STL, 3MF (mehrere Dateien möglich)',
        'res.totalCost':'Gesamtkosten','res.withoutMargin':'Ohne Gewinnmarge',
        'res.costDetails':'Kostendetails','res.file':'Datei','res.filament':'Filament',
        'res.electricity':'Strom','res.depreciation':'Abschreibung',
        'res.maintenance':'Wartung','res.failures':'Ausfälle','res.labor':'Arbeit',
        'res.sellingPrice':'EMPFOHLENER VERKAUFSPREIS','res.withMargin':'mit Gewinnmarge',
        'tbl.compTitle':'Materialvergleich','tbl.use':'Verwenden','tbl.material':'Material',
        'tbl.color':'Farbe',
        'tbl.filamentCost':'Filamentkosten','tbl.totalCost':'Gesamtkosten','tbl.sellingPrice':'Verkaufspreis',
        'tbl.empty':'Klicken Sie auf "Material hinzufügen" um verschiedene Filamente zu vergleichen',
        'lbl.filamentColor':'Filamentfarbe',
        'hist.title':'Berechnungshistorie','hist.clear':'Verlauf löschen','hist.close':'Schließen',
        'calc.calculating':'Berechnung...',
        'pdf.title':'3D-DRUCK ANGEBOT','pdf.reference':'Referenz','pdf.emitter':'VON','pdf.client':'KUNDE',
        'pdf.sellingPrice':'VERKAUFSPREIS','pdf.details':'PROJEKTDETAILS','pdf.printTime':'Druckzeit',
        'pdf.piece':'Teil','pdf.pieces':'Teile ({n} Dateien)',
        'pdf.noteTitle':'Dieser Preis beinhaltet:',
        'pdf.noteBody':'Arbeitszeit ({h}h à {r} €/h), Filament, Stromverbrauch, Maschinenabschreibung, Wartung und eine Rückstellung für mögliche Druckfehler. Versandkosten sind nicht enthalten.',
        'pdf.preview3d':'3D-VORSCHAU',
        'pdf.footer':'Dieses Angebot ist unverbindlich. Die Preise können je nach tatsächlicher Projektkomplexität variieren.',
    },
    es: {
        'app.title':'Calculadora de Impresión 3D','app.subtitle':'Calcule con precisión el costo de sus impresiones 3D',
        'stat.formats':'STL & 3MF compatibles','stat.calc':'Cálculo preciso','stat.export':'Exportar PDF',
        'sec.params':'Parámetros de impresión','sec.import':'Importar STL / 3MF (Opcional)','sec.filament':'Filamento',
        'sec.duration':'Duración','sec.operations':'Costos de operación','sec.advanced':'Parámetros avanzados',
        'sec.printer':'Impresora','sec.results':'Resultados','sec.chartTitle':'Distribución de costos',
        'lbl.filamentType':'Tipo de filamento','lbl.filamentPrice':'Precio del filamento (€/kg)',
        'lbl.filamentWeight':'Peso utilizado (g)','lbl.filamentDensity':'Densidad (g/cm³)',
        'lbl.hours':'Horas','lbl.minutes':'Minutos','lbl.totalTime':'Tiempo total',
        'lbl.power':'Consumo impresora (W)','lbl.electricity':'Precio electricidad (€/kWh)',
        'lbl.printerCost':'Costo impresora (€)','lbl.printerLifespan':'Vida útil (horas)',
        'lbl.maintenance':'Mantenimiento (€/hora)','lbl.failureRate':'Tasa de fallos (%)',
        'lbl.profitMargin':'Margen de beneficio (%)','lbl.laborHours':'Horas de mano de obra',
        'lbl.laborCost':'Tarifa laboral (€/h)',
        'btn.loadPreset':'Cargar ajustes Bambu Lab A1','btn.save':'Guardar',
        'btn.load':'Cargar','btn.reset':'Restablecer','btn.pdf':'PDF',
        'btn.calculate':'Calcular costo','btn.addMaterial':'Agregar material','btn.browse':'Examinar archivos',
        'upload.dropzone':'Arrastre y suelte sus archivos aquí',
        'upload.formats':'Formatos aceptados: STL, 3MF (varios archivos posibles)',
        'res.totalCost':'Costo Total','res.withoutMargin':'Sin margen de beneficio',
        'res.costDetails':'Detalles de costos','res.file':'Archivo','res.filament':'Filamento',
        'res.electricity':'Electricidad','res.depreciation':'Amortización',
        'res.maintenance':'Mantenimiento','res.failures':'Fallos','res.labor':'Mano de obra',
        'res.sellingPrice':'PRECIO DE VENTA SUGERIDO','res.withMargin':'con margen de beneficio',
        'tbl.compTitle':'Comparación de Materiales','tbl.use':'Usar','tbl.material':'Material',
        'tbl.color':'Color',
        'tbl.filamentCost':'Costo filamento','tbl.totalCost':'Costo total','tbl.sellingPrice':'Precio venta',
        'tbl.empty':'Haga clic en "Agregar material" para comparar diferentes filamentos',
        'lbl.filamentColor':'Color del filamento',
        'hist.title':'Historial de cálculos','hist.clear':'Borrar historial','hist.close':'Cerrar',
        'calc.calculating':'Calculando...',
        'pdf.title':'PRESUPUESTO IMPRESIÓN 3D','pdf.reference':'Referencia','pdf.emitter':'DE','pdf.client':'CLIENTE',
        'pdf.sellingPrice':'PRECIO DE VENTA','pdf.details':'DETALLES DEL PROYECTO','pdf.printTime':'Tiempo de impresión',
        'pdf.piece':'Pieza','pdf.pieces':'Piezas ({n} archivos)',
        'pdf.noteTitle':'Este precio incluye:',
        'pdf.noteBody':'mano de obra ({h}h a {r} €/h), filamento, consumo eléctrico, amortización de la máquina, mantenimiento y una provisión para posibles fallos de impresión. No incluye gastos de envío.',
        'pdf.preview3d':'VISTA PREVIA 3D',
        'pdf.footer':'Este presupuesto es orientativo. Los precios pueden variar según la complejidad real del proyecto.',
    },
    hi: {
        'app.title':'3D प्रिंट लागत कैलकुलेटर','app.subtitle':'अपने 3D प्रिंट की लागत की सटीक गणना करें',
        'stat.formats':'STL & 3MF समर्थित','stat.calc':'सटीक गणना','stat.export':'PDF निर्यात',
        'sec.params':'प्रिंट पैरामीटर','sec.import':'STL / 3MF आयात (वैकल्पिक)','sec.filament':'फिलामेंट',
        'sec.duration':'अवधि','sec.operations':'परिचालन लागत','sec.advanced':'उन्नत पैरामीटर',
        'sec.printer':'प्रिंटर','sec.results':'परिणाम','sec.chartTitle':'लागत वितरण',
        'lbl.filamentType':'फिलामेंट प्रकार','lbl.filamentPrice':'फिलामेंट मूल्य (€/kg)',
        'lbl.filamentWeight':'उपयोग किया गया वजन (g)','lbl.filamentDensity':'घनत्व (g/cm³)',
        'lbl.hours':'घंटे','lbl.minutes':'मिनट','lbl.totalTime':'कुल समय',
        'lbl.power':'प्रिंटर खपत (W)','lbl.electricity':'बिजली की कीमत (€/kWh)',
        'lbl.printerCost':'प्रिंटर लागत (€)','lbl.printerLifespan':'जीवनकाल (घंटे)',
        'lbl.maintenance':'रखरखाव (€/घंटा)','lbl.failureRate':'विफलता दर (%)',
        'lbl.profitMargin':'लाभ मार्जिन (%)','lbl.laborHours':'श्रम घंटे',
        'lbl.laborCost':'श्रम दर (€/h)',
        'btn.loadPreset':'Bambu Lab A1 सेटिंग लोड करें','btn.save':'सहेजें',
        'btn.load':'लोड करें','btn.reset':'रीसेट','btn.pdf':'PDF',
        'btn.calculate':'लागत गणना करें','btn.addMaterial':'सामग्री जोड़ें','btn.browse':'फ़ाइलें ब्राउज़ करें',
        'upload.dropzone':'अपनी फ़ाइलें यहाँ खींचें और छोड़ें',
        'upload.formats':'स्वीकृत प्रारूप: STL, 3MF (कई फ़ाइलें संभव)',
        'res.totalCost':'कुल लागत','res.withoutMargin':'लाभ मार्जिन के बिना',
        'res.costDetails':'लागत विवरण','res.file':'फ़ाइल','res.filament':'फिलामेंट',
        'res.electricity':'बिजली','res.depreciation':'मूल्यह्रास',
        'res.maintenance':'रखरखाव','res.failures':'विफलता','res.labor':'श्रम',
        'res.sellingPrice':'सुझाया गया बिक्री मूल्य','res.withMargin':'लाभ मार्जिन के साथ',
        'tbl.compTitle':'सामग्री तुलना','tbl.use':'उपयोग','tbl.material':'सामग्री',
        'tbl.color':'रंग',
        'tbl.filamentCost':'फिलामेंट लागत','tbl.totalCost':'कुल लागत','tbl.sellingPrice':'बिक्री मूल्य',
        'tbl.empty':'विभिन्न फिलामेंट की तुलना करने के लिए "सामग्री जोड़ें" पर क्लिक करें',
        'lbl.filamentColor':'फिलामेंट का रंग',
        'hist.title':'गणना इतिहास','hist.clear':'इतिहास मिटाएं','hist.close':'बंद करें',
        'calc.calculating':'गणना हो रही है...',
        'pdf.title':'3D प्रिंट कोटेशन','pdf.reference':'संदर्भ','pdf.emitter':'प्रेषक','pdf.client':'ग्राहक',
        'pdf.sellingPrice':'बिक्री मूल्य','pdf.details':'परियोजना विवरण','pdf.printTime':'प्रिंट समय',
        'pdf.piece':'भाग','pdf.pieces':'भाग ({n} फ़ाइलें)',
        'pdf.noteTitle':'इस मूल्य में शामिल है:',
        'pdf.noteBody':'श्रम ({h}h पर {r} €/h), फिलामेंट, बिजली की खपत, मशीन का मूल्यह्रास, रखरखाव और संभावित प्रिंट विफलताओं के लिए प्रावधान। शिपिंग लागत शामिल नहीं है।',
        'pdf.preview3d':'3D पूर्वावलोकन',
        'pdf.footer':'यह कोटेशन केवल सूचनात्मक है। परियोजना की वास्तविक जटिलता के आधार पर कीमतें भिन्न हो सकती हैं।',
    },
};

function applyTranslations(lang) {
    const t = TRANSLATIONS[lang] || TRANSLATIONS['fr'];
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) el.textContent = t[key];
    });
}

// Utilitaire debounce pour l'auto-sauvegarde
function debounce(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Auto-sauvegarde silencieuse de la configuration
const autoSaveConfig = debounce(function() {
    const config = {
        filamentType: document.getElementById('filamentType').value,
        filamentPrice: document.getElementById('filamentPrice').value,
        filamentWeight: document.getElementById('filamentWeight').value,
        filamentDensity: document.getElementById('filamentDensity').value,
        printHours: document.getElementById('printHours').value,
        printMinutes: document.getElementById('printMinutes').value,
        powerConsumption: document.getElementById('powerConsumption').value,
        electricityPrice: document.getElementById('electricityPrice').value,
        printerCost: document.getElementById('printerCost').value,
        printerLifespan: document.getElementById('printerLifespan').value,
        maintenanceCost: document.getElementById('maintenanceCost').value,
        failureRate: document.getElementById('failureRate').value,
        profitMargin: document.getElementById('profitMargin').value,
        laborHours: document.getElementById('laborHours').value,
        laborCost: document.getElementById('laborCost').value
    };
    localStorage.setItem('3dprintCalculatorConfig', JSON.stringify(config));
}, 800);

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Mise à jour de la densité selon le type de filament
    document.getElementById('filamentType').addEventListener('change', function() {
        const type = this.value;
        if (filamentDensities[type]) {
            document.getElementById('filamentDensity').value = filamentDensities[type];
        }
    });

    // Mise à jour du temps total
    function updateTotalTime() {
        const hours = parseInt(document.getElementById('printHours').value) || 0;
        const minutes = parseInt(document.getElementById('printMinutes').value) || 0;
        const totalMinutes = (hours * 60) + minutes;
        const displayHours = Math.floor(totalMinutes / 60);
        const displayMinutes = totalMinutes % 60;
        document.getElementById('totalTime').value = `${displayHours}h ${displayMinutes}min`;
    }

    document.getElementById('printHours').addEventListener('input', updateTotalTime);
    document.getElementById('printMinutes').addEventListener('input', updateTotalTime);

    // Restaurer la configuration sauvegardée (silencieusement)
    loadConfigSilent();

    // Calcul automatique au chargement et lors de changements
    updateTotalTime();
    calculateCost();
    updateHistoryCount();

    // Charger les matériaux de comparaison sauvegardés
    loadComparisonMaterials();

    // Initialiser la liste de clients
    renderClientSelect();

    // Appliquer la langue sauvegardée
    const savedLocale = localStorage.getItem('ced-locale') || 'fr';
    applyTranslations(savedLocale);

    // Calcul automatique + auto-sauvegarde lors de la modification de n'importe quel champ
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', calculateCost);
        input.addEventListener('input', autoSaveConfig);
        input.addEventListener('change', autoSaveConfig);
    });

    // Sauvegarde immédiate à la fermeture de page (couvre le cas debounce non déclenché)
    window.addEventListener('beforeunload', function() {
        const config = {
            filamentType: document.getElementById('filamentType').value,
            filamentPrice: document.getElementById('filamentPrice').value,
            filamentWeight: document.getElementById('filamentWeight').value,
            filamentDensity: document.getElementById('filamentDensity').value,
            printHours: document.getElementById('printHours').value,
            printMinutes: document.getElementById('printMinutes').value,
            powerConsumption: document.getElementById('powerConsumption').value,
            electricityPrice: document.getElementById('electricityPrice').value,
            printerCost: document.getElementById('printerCost').value,
            printerLifespan: document.getElementById('printerLifespan').value,
            maintenanceCost: document.getElementById('maintenanceCost').value,
            failureRate: document.getElementById('failureRate').value,
            profitMargin: document.getElementById('profitMargin').value,
            laborHours: document.getElementById('laborHours').value,
            laborCost: document.getElementById('laborCost').value
        };
        localStorage.setItem('3dprintCalculatorConfig', JSON.stringify(config));
    });

    // Initialiser le graphique
    initChart();
});

// Fonction principale de calcul
function calculateCost() {
    // Récupération des valeurs
    const filamentPrice = parseFloat(document.getElementById('filamentPrice').value) || 0;
    const filamentWeight = parseFloat(document.getElementById('filamentWeight').value) || 0;
    const filamentDensity = parseFloat(document.getElementById('filamentDensity').value) || 1.24;
    
    const hours = parseInt(document.getElementById('printHours').value) || 0;
    const minutes = parseInt(document.getElementById('printMinutes').value) || 0;
    const totalHours = hours + (minutes / 60);
    
    const powerConsumption = parseFloat(document.getElementById('powerConsumption').value) || 0;
    const electricityPrice = parseFloat(document.getElementById('electricityPrice').value) || 0;
    
    const printerCost = parseFloat(document.getElementById('printerCost').value) || 0;
    const printerLifespan = parseFloat(document.getElementById('printerLifespan').value) || 1;
    const maintenanceCost = parseFloat(document.getElementById('maintenanceCost').value) || 0;
    const failureRate = parseFloat(document.getElementById('failureRate').value) || 0;
    const profitMargin = parseFloat(document.getElementById('profitMargin').value) || 0;
    const laborHours = parseFloat(document.getElementById('laborHours').value) || 0;
    const laborRate = parseFloat(document.getElementById('laborCost').value) || 0;

    // Calculs détaillés
    
    // 1. Coût du filament
    const filamentCostTotal = (filamentWeight / 1000) * filamentPrice;
    
    // 2. Coût de l'électricité
    const energyConsumption = (powerConsumption / 1000) * totalHours; // kWh
    const electricityCostTotal = energyConsumption * electricityPrice;
    
    // 3. Amortissement de l'imprimante
    const depreciationCostTotal = (printerCost / printerLifespan) * totalHours;
    
    // 4. Coût de maintenance
    const maintenanceCostTotal = maintenanceCost * totalHours;
    
    // 5. Coût de la main-d'œuvre (durée définie par l'utilisateur)
    const laborCostTotal = laborHours * laborRate;
    
    // Coût de base (sans échecs)
    const baseCost = filamentCostTotal + electricityCostTotal + depreciationCostTotal + maintenanceCostTotal + laborCostTotal;
    
    // 6. Coût des échecs
    const failureCostTotal = baseCost * (failureRate / 100);
    
    // Coût total
    const totalCost = baseCost + failureCostTotal;
    
    // Prix de vente suggéré (avec marge)
    const sellingPrice = totalCost * (1 + profitMargin / 100);

    // Calculs supplémentaires
    const volume = filamentWeight / filamentDensity;
    const costPerGram = totalCost / filamentWeight;
    const costPerHour = totalCost / totalHours;

    // Mise à jour de l'affichage
    updateDisplay({
        totalCost: totalCost,
        filamentCost: filamentCostTotal,
        electricityCost: electricityCostTotal,
        depreciationCost: depreciationCostTotal,
        maintenanceCost: maintenanceCostTotal,
        laborCost: laborCostTotal,
        failureCost: failureCostTotal,
        sellingPrice: sellingPrice,
        volume: volume,
        costPerGram: costPerGram,
        costPerHour: costPerHour
    });

    // Mettre à jour le graphique
    updateChart({
        filament: filamentCostTotal,
        electricity: electricityCostTotal,
        depreciation: depreciationCostTotal,
        maintenance: maintenanceCostTotal,
        labor: laborCostTotal,
        failure: failureCostTotal
    });
}

// Fonction de mise à jour de l'affichage
function updateDisplay(costs) {
    // Formatage des valeurs
    document.getElementById('totalCost').textContent = formatCurrency(costs.totalCost);
    document.getElementById('filamentCost').textContent = formatCurrency(costs.filamentCost);
    document.getElementById('electricityCost').textContent = formatCurrency(costs.electricityCost);
    document.getElementById('depreciationCost').textContent = formatCurrency(costs.depreciationCost);
    document.getElementById('maintenanceCostDisplay').textContent = formatCurrency(costs.maintenanceCost);
    document.getElementById('laborCostDisplay').textContent = formatCurrency(costs.laborCost);
    document.getElementById('failureCost').textContent = formatCurrency(costs.failureCost);
    document.getElementById('sellingPrice').textContent = formatCurrency(costs.sellingPrice);
    
    // Statistiques
    document.getElementById('costPerGram').textContent = formatCurrency(costs.costPerGram);
    document.getElementById('costPerHour').textContent = formatCurrency(costs.costPerHour);
    document.getElementById('volume').textContent = costs.volume.toFixed(2) + ' cm³';
    
    // Afficher les détails de la main-d'œuvre
    const laborHours = parseFloat(document.getElementById('laborHours').value) || 0;
    const laborRate = parseFloat(document.getElementById('laborCost').value) || 0;
    document.getElementById('laborCostDisplay').textContent = formatCurrency(costs.laborCost) + ` (${laborHours}h × ${laborRate}€/h)`;

    // Animation du coût total
    animateValue('totalCost', costs.totalCost);
}

// Fonction de formatage des devises
function formatCurrency(value) {
    if (isNaN(value) || !isFinite(value)) {
        return '0.00 €';
    }
    return value.toFixed(2) + ' €';
}

// Animation des valeurs
function animateValue(elementId, endValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 500; // durée en ms
    const startValue = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Fonction d'easing (ease-out)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (endValue - startValue) * easeProgress;
        
        element.textContent = formatCurrency(currentValue);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Fonction pour exporter les résultats en JSON
function exportResults() {
    const results = {
        timestamp: new Date().toISOString(),
        parameters: {
            filamentType: document.getElementById('filamentType').value,
            filamentPrice: parseFloat(document.getElementById('filamentPrice').value),
            filamentWeight: parseFloat(document.getElementById('filamentWeight').value),
            printTime: {
                hours: parseInt(document.getElementById('printHours').value),
                minutes: parseInt(document.getElementById('printMinutes').value)
            },
            powerConsumption: parseFloat(document.getElementById('powerConsumption').value),
            electricityPrice: parseFloat(document.getElementById('electricityPrice').value)
        },
        costs: {
            filament: parseFloat(document.getElementById('filamentCost').textContent),
            electricity: parseFloat(document.getElementById('electricityCost').textContent),
            depreciation: parseFloat(document.getElementById('depreciationCost').textContent),
            maintenance: parseFloat(document.getElementById('maintenanceCostDisplay').textContent),
            labor: parseFloat(document.getElementById('laborCostDisplay').textContent),
            failure: parseFloat(document.getElementById('failureCost').textContent),
            total: parseFloat(document.getElementById('totalCost').textContent)
        },
        sellingPrice: parseFloat(document.getElementById('sellingPrice').textContent)
    };
    
    return JSON.stringify(results, null, 2);
}

// Fonction pour sauvegarder la configuration
function saveConfig() {
    const config = {
        filamentType: document.getElementById('filamentType').value,
        filamentPrice: document.getElementById('filamentPrice').value,
        filamentWeight: document.getElementById('filamentWeight').value,
        filamentDensity: document.getElementById('filamentDensity').value,
        printHours: document.getElementById('printHours').value,
        printMinutes: document.getElementById('printMinutes').value,
        powerConsumption: document.getElementById('powerConsumption').value,
        electricityPrice: document.getElementById('electricityPrice').value,
        printerCost: document.getElementById('printerCost').value,
        printerLifespan: document.getElementById('printerLifespan').value,
        maintenanceCost: document.getElementById('maintenanceCost').value,
        failureRate: document.getElementById('failureRate').value,
        profitMargin: document.getElementById('profitMargin').value,
        laborHours: document.getElementById('laborHours').value,
        laborCost: document.getElementById('laborCost').value
    };
    
    localStorage.setItem('3dprintCalculatorConfig', JSON.stringify(config));
    showNotification('Configuration sauvegardée avec succès!', 'success');
}

// Fonction pour charger la configuration
function loadConfig() {
    const savedConfig = localStorage.getItem('3dprintCalculatorConfig');
    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        Object.keys(config).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = config[key];
            }
        });
        calculateCost();
        showNotification('Configuration chargée avec succès!', 'success');
    } else {
        showNotification('Aucune configuration sauvegardée trouvée', 'warning');
    }
}

// Chargement silencieux au démarrage (sans notification)
function loadConfigSilent() {
    const savedConfig = localStorage.getItem('3dprintCalculatorConfig');
    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        Object.keys(config).forEach(key => {
            const element = document.getElementById(key);
            if (element) element.value = config[key];
        });
    }
}

// Fonction pour réinitialiser aux valeurs par défaut
function resetToDefaults() {
    document.getElementById('filamentType').value = 'PLA';
    document.getElementById('filamentPrice').value = '20';
    document.getElementById('filamentWeight').value = '100';
    document.getElementById('filamentDensity').value = '1.24';
    document.getElementById('printHours').value = '5';
    document.getElementById('printMinutes').value = '30';
    document.getElementById('powerConsumption').value = '120';
    document.getElementById('electricityPrice').value = '0.19';
    document.getElementById('printerCost').value = '500';
    document.getElementById('printerLifespan').value = '5000';
    document.getElementById('maintenanceCost').value = '0.1';
    document.getElementById('failureRate').value = '5';
    document.getElementById('profitMargin').value = '30';
    document.getElementById('laborHours').value = '0.5';
    document.getElementById('laborCost').value = '50';
    
    calculateCost();
    showNotification('Réinitialisé aux valeurs par défaut', 'info');
}

// Fonction pour charger un preset d'imprimante
function loadPreset(presetName) {
    const preset = printerPresets[presetName];
    if (preset) {
        document.getElementById('printerCost').value = preset.printerCost;
        document.getElementById('powerConsumption').value = preset.powerConsumption;
        document.getElementById('printerLifespan').value = preset.printerLifespan;
        document.getElementById('maintenanceCost').value = preset.maintenanceCost;
        
        calculateCost();
        showNotification(`Preset "${preset.name}" chargé avec succès!`, 'success');
    }
}

// Initialiser le graphique Chart.js
function initChart() {
    const ctx = document.getElementById('costChart');
    if (!ctx) return;
    
    costChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Filament', 'Électricité', 'Amortissement', 'Maintenance', 'Main-d\'œuvre', 'Échecs'],
            datasets: [{
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: [
                    '#8b5cf6', // purple
                    '#fbbf24', // yellow
                    '#3b82f6', // blue
                    '#f97316', // orange
                    '#10b981', // green
                    '#ef4444'  // red
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 10
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return label + ': ' + value.toFixed(2) + ' €';
                        }
                    }
                }
            }
        }
    });
}

// Mettre à jour le graphique
function updateChart(costs) {
    if (!costChart) return;
    
    costChart.data.datasets[0].data = [
        costs.filament,
        costs.electricity,
        costs.depreciation,
        costs.maintenance,
        costs.labor,
        costs.failure
    ];
    costChart.update();
}

// Gestion de l'historique
function saveToHistory() {
    const history = getHistory();
    const entry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        filamentType: document.getElementById('filamentType').value,
        filamentWeight: parseFloat(document.getElementById('filamentWeight').value),
        printTime: document.getElementById('totalTime').value,
        totalCost: document.getElementById('totalCost').textContent,
        sellingPrice: document.getElementById('sellingPrice').textContent,
        costs: {
            filament: document.getElementById('filamentCost').textContent,
            electricity: document.getElementById('electricityCost').textContent,
            depreciation: document.getElementById('depreciationCost').textContent,
            maintenance: document.getElementById('maintenanceCostDisplay').textContent,
            labor: document.getElementById('laborCostDisplay').textContent,
            failure: document.getElementById('failureCost').textContent
        }
    };
    
    history.unshift(entry);
    
    // Garder seulement les 50 dernières entrées
    if (history.length > 50) {
        history.pop();
    }
    
    localStorage.setItem('3dprintCalculatorHistory', JSON.stringify(history));
    updateHistoryCount();
}

function getHistory() {
    const historyStr = localStorage.getItem('3dprintCalculatorHistory');
    return historyStr ? JSON.parse(historyStr) : [];
}

function updateHistoryCount() {
    const history = getHistory();
    const countElement = document.getElementById('historyCount');
    if (countElement) {
        countElement.textContent = history.length;
    }
}

function toggleHistory() {
    const modal = document.getElementById('historyModal');
    const isHidden = modal.classList.contains('hidden');
    
    if (isHidden) {
        displayHistory();
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

function displayHistory() {
    const history = getHistory();
    const container = document.getElementById('historyContent');
    
    if (history.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-500 py-8">Aucun calcul dans l\'historique</div>';
        return;
    }
    
    container.innerHTML = history.map((entry, index) => {
        const date = new Date(entry.timestamp);
        const formattedDate = date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="bg-white rounded-lg p-4 shadow">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <div class="font-semibold text-gray-800">${entry.filamentType} - ${entry.filamentWeight}g</div>
                        <div class="text-sm text-gray-500">${formattedDate} • ${entry.printTime}</div>
                    </div>
                    <button onclick="deleteHistoryEntry(${entry.id})" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="grid grid-cols-2 gap-2 text-sm">
                    <div class="flex justify-between border-b pb-1">
                        <span class="text-gray-600">Coût total:</span>
                        <span class="font-semibold">${entry.totalCost}</span>
                    </div>
                    <div class="flex justify-between border-b pb-1">
                        <span class="text-gray-600">Prix vente:</span>
                        <span class="font-semibold text-green-600">${entry.sellingPrice}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function deleteHistoryEntry(id) {
    let history = getHistory();
    history = history.filter(entry => entry.id !== id);
    localStorage.setItem('3dprintCalculatorHistory', JSON.stringify(history));
    displayHistory();
    updateHistoryCount();
    showNotification('Entrée supprimée', 'info');
}

function clearHistory() {
    if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
        localStorage.removeItem('3dprintCalculatorHistory');
        displayHistory();
        updateHistoryCount();
        showNotification('Historique effacé', 'success');
    }
}

// Fonction pour charger une image en base64
async function loadImageAsBase64(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = url;
    });
}

// Export PDF - Design Ced-IT Professionnel
async function exportPDF() {
    showNotification('Génération du devis PDF en cours...', 'info');

    try {
        // Langue active (Hindi replié sur EN : Devanagari non supporté par les polices PDF par défaut)
        const lang = localStorage.getItem('ced-locale') || 'fr';
        const pdfLang = lang === 'hi' ? 'en' : lang;
        const t = TRANSLATIONS[pdfLang] || TRANSLATIONS['fr'];
        const p = (key) => t[key] || TRANSLATIONS['fr'][key] || key;

        // Récupérer les données entreprise depuis le SaaS (ou fallback local)
        const company = await fetchCompanyProfile();

        // Sauvegarder dans l'historique avant l'export
        saveToHistory();

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Charger le logo : priorité au logo utilisateur, fallback logo Ced-IT
        let logoBase64 = null;
        if (company.logoUrl) {
            try {
                logoBase64 = await loadImageAsBase64(company.logoUrl);
            } catch (_) {
                // Logo utilisateur inaccessible – on tente le logo Ced-IT
            }
        }
        if (!logoBase64) {
            try {
                logoBase64 = await loadImageAsBase64('images/Ced-it-No background.png');
            } catch (_) {
                // Pas de logo du tout → fallback texte
            }
        }

        // Couleurs Ced-IT
        const cedCyan = [0, 212, 255];
        const cedDarkBlue = [10, 22, 40];
        const cedSecondary = [13, 31, 53];
        const cedCard = [15, 37, 65];
        const white = [255, 255, 255];
        const lightGray = [148, 163, 184];
        const darkGray = [100, 116, 139];

        // Dimensions
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;

        // ==========================================
        // EN-TÊTE AVEC LOGO ET BANDE COLORÉE
        // ==========================================

        // Bande d'en-tête bleu foncé
        doc.setFillColor(...cedDarkBlue);
        doc.rect(0, 0, pageWidth, 45, 'F');

        // Ligne accent cyan
        doc.setFillColor(...cedCyan);
        doc.rect(0, 45, pageWidth, 2, 'F');

        // Logo Ced-IT
        if (logoBase64) {
            // Ajouter le logo image
            doc.addImage(logoBase64, 'PNG', margin, 5, 50, 35);
        } else {
            // Fallback: texte stylisé
            doc.setFontSize(28);
            doc.setTextColor(...cedCyan);
            doc.setFont('helvetica', 'bold');
            doc.text(company.name, margin, 25);

            // Sous-titre (seulement avec le texte)
            doc.setFontSize(10);
            doc.setTextColor(...lightGray);
            doc.setFont('helvetica', 'normal');
            doc.text('Services d\'impression 3D professionnels', margin, 33);
        }

        // Informations contact à droite (seulement si renseignées)
        doc.setFontSize(9);
        doc.setTextColor(...white);
        doc.setFont('helvetica', 'normal');
        let contactY = 14;
        if (company.website)  { doc.text(company.website,  pageWidth - margin, contactY, { align: 'right' }); contactY += 7; }
        if (company.email)    { doc.text(company.email,    pageWidth - margin, contactY, { align: 'right' }); contactY += 7; }
        if (company.phone)    { doc.text(company.phone,    pageWidth - margin, contactY, { align: 'right' }); }
        doc.setTextColor(...cedCyan);
        doc.setFont('helvetica', 'bold');

        // Date du devis (formatée selon la langue active)
        const localeMap = { fr:'fr-FR', en:'en-GB', nl:'nl-NL', de:'de-DE', es:'es-ES', hi:'en-GB' };
        const date = new Date().toLocaleDateString(localeMap[lang] || 'fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        doc.text(date, pageWidth - margin, 38, { align: 'right' });

        // ==========================================
        // TITRE DU DOCUMENT
        // ==========================================

        let y = 60;

        doc.setFontSize(22);
        doc.setTextColor(...cedDarkBlue);
        doc.setFont('helvetica', 'bold');
        doc.text(p('pdf.title'), pageWidth / 2, y, { align: 'center' });

        // Numéro de devis
        y += 10;
        doc.setFontSize(10);
        doc.setTextColor(...darkGray);
        doc.setFont('helvetica', 'normal');
        const devisNum = 'DEV-' + Date.now().toString().slice(-8);
        doc.text(`${p('pdf.reference')} : ${devisNum}`, pageWidth / 2, y, { align: 'center' });

        // ==========================================
        // BLOC ÉMETTEUR | CLIENT (deux colonnes)
        // ==========================================

        y += 10;

        const colW = (pageWidth - margin * 2 - 5) / 2;
        const clientX = margin + colW + 5;
        const blockH = 28;

        // --- Émetteur (gauche) ---
        doc.setFillColor(240, 248, 255);
        doc.setDrawColor(...cedCyan);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, y - 4, colW, blockH, 2, 2, 'FD');

        doc.setFontSize(7.5);
        doc.setTextColor(...cedCyan);
        doc.setFont('helvetica', 'bold');
        doc.text(p('pdf.emitter'), margin + 4, y + 1);

        doc.setFontSize(9);
        doc.setTextColor(...cedDarkBlue);
        doc.setFont('helvetica', 'bold');
        if (company.name)    doc.text(company.name,    margin + 4, y + 8);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 80, 100);
        const addrLine = [company.address, company.city].filter(Boolean).join(' – ');
        if (addrLine)        doc.text(addrLine,         margin + 4, y + 14);
        if (company.vat)     doc.text('TVA : ' + company.vat, margin + 4, y + 19);
        if (!addrLine && company.website) doc.text(company.website, margin + 4, y + 14);

        // --- Client (droite) ---
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(210, 220, 230);
        doc.setLineWidth(0.3);
        doc.roundedRect(clientX, y - 4, colW, blockH, 2, 2, 'FD');

        doc.setFontSize(7.5);
        doc.setTextColor(...darkGray);
        doc.setFont('helvetica', 'bold');
        doc.text(p('pdf.client'), clientX + 4, y + 1);

        // Données client sélectionné
        const client = getCurrentClient();
        if (client) {
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...cedDarkBlue);
            doc.text(client.name, clientX + 4, y + 8);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 80, 100);
            if (client.company) doc.text(client.company, clientX + 4, y + 14);
            const addrLine = [client.address, [client.postalCode, client.city].filter(Boolean).join(' ')].filter(Boolean).join(', ');
            if (addrLine) doc.text(addrLine, clientX + 4, client.company ? y + 19 : y + 14);
        } else {
            doc.setFontSize(8.5);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(190, 200, 210);
            doc.text('—', clientX + 4, y + 10);
        }

        y += blockH + 10;

        // ==========================================
        // PRIX DE VENTE - Mise en valeur principale
        // ==========================================

        doc.setFillColor(...cedCyan);
        doc.roundedRect(margin, y - 6, pageWidth - (margin * 2), 14, 3, 3, 'F');

        doc.setFontSize(11);
        doc.setTextColor(...white);
        doc.setFont('helvetica', 'bold');
        doc.text(p('pdf.sellingPrice'), margin + 5, y + 2);

        doc.setFontSize(18);
        doc.text(document.getElementById('sellingPrice').textContent, pageWidth - margin - 5, y + 2, { align: 'right' });

        y += 16;

        // ==========================================
        // DÉTAILS DU PROJET
        // ==========================================

        doc.setFillColor(...cedSecondary);
        doc.roundedRect(margin, y - 6, pageWidth - (margin * 2), 12, 2, 2, 'F');
        doc.setFontSize(12);
        doc.setTextColor(...white);
        doc.setFont('helvetica', 'bold');
        doc.text(p('pdf.details'), margin + 5, y + 2);

        y += 15;

        // Temps depuis le span récapitulatif (évite le conflit d'IDs avec l'input des paramètres)
        const timeSpan = Array.from(document.querySelectorAll('#totalTime')).find(el => el.tagName === 'SPAN');
        const printTimeStr = (timeSpan && timeSpan.textContent && timeSpan.textContent !== '-') ? timeSpan.textContent : '-';

        doc.setFontSize(10);
        let detailIndex = 0;

        const drawDetailRow = (label, value) => {
            if (detailIndex % 2 === 0) {
                doc.setFillColor(245, 247, 250);
                doc.rect(margin, y - 4, pageWidth - (margin * 2), 8, 'F');
            }
            doc.setTextColor(...darkGray);
            doc.setFont('helvetica', 'normal');
            doc.text(label, margin + 5, y);
            doc.setTextColor(...cedDarkBlue);
            doc.setFont('helvetica', 'bold');
            doc.text(value, pageWidth - margin - 5, y, { align: 'right' });
            y += 8;
            detailIndex++;
        };

        drawDetailRow(p('pdf.printTime'), printTimeStr);
        drawDetailRow(p('res.filament'), document.getElementById('filamentType').value);

        // Couleur du filament (si renseignée)
        const filamentColorHex = document.getElementById('filamentColor')?.value || '#ffffff';
        const filamentColorName = document.getElementById('filamentColorName')?.value?.trim() || '';
        const hasFilamentColor = filamentColorName || (filamentColorHex.toLowerCase() !== '#ffffff');
        if (hasFilamentColor) {
            if (detailIndex % 2 === 0) {
                doc.setFillColor(245, 247, 250);
                doc.rect(margin, y - 4, pageWidth - (margin * 2), 8, 'F');
            }
            doc.setTextColor(...darkGray);
            doc.setFont('helvetica', 'normal');
            doc.text(p('lbl.filamentColor'), margin + 5, y);

            const hexToRgb = (hex) => [
                parseInt(hex.slice(1, 3), 16),
                parseInt(hex.slice(3, 5), 16),
                parseInt(hex.slice(5, 7), 16)
            ];
            const colorLabel = filamentColorName || filamentColorHex;
            const [cr, cg, cb] = hexToRgb(filamentColorHex);
            const colorTextX = pageWidth - margin - 5;
            doc.setFont('helvetica', 'bold');
            const colorTextWidth = doc.getTextWidth(colorLabel);
            const swatchX = colorTextX - colorTextWidth - 7;
            doc.setFillColor(cr, cg, cb);
            doc.setDrawColor(150, 150, 150);
            doc.setLineWidth(0.3);
            doc.circle(swatchX, y - 2, 2.5, 'FD');
            doc.setTextColor(...cedDarkBlue);
            doc.text(colorLabel, colorTextX, y, { align: 'right' });

            y += 8;
            detailIndex++;
        }

        // Pièces : toujours affichées si des fichiers sont chargés
        const parts = window.importedParts || [];
        if (parts.length > 0) {
            const label = parts.length > 1 ? p('pdf.pieces').replace('{n}', parts.length) : p('pdf.piece');
            const partsSummary = parts.map(p => p.name + (p.quantity > 1 ? ' ×' + p.quantity : '')).join(', ');
            const maxWidth = pageWidth - margin * 2 - 90;
            const split = doc.splitTextToSize(partsSummary, maxWidth);
            const display = split[0] + (split.length > 1 ? '…' : '');
            drawDetailRow(label, display);
        }

        y += 6;

        // ==========================================
        // NOTE SUR LA COMPOSITION DU PRIX
        // ==========================================

        doc.setFontSize(9);
        const laborHoursVal = document.getElementById('laborHours').value;
        const laborRateVal = document.getElementById('laborCost').value;
        const noteText = p('pdf.noteBody').replace('{h}', laborHoursVal).replace('{r}', laborRateVal);
        const noteLines = doc.splitTextToSize(noteText, pageWidth - (margin * 2) - 10);
        const noteLineH = 4.5;
        const noteBoxH = 6 + noteLines.length * noteLineH + 3;

        doc.setFillColor(240, 248, 255);
        doc.setDrawColor(...cedCyan);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, y - 3, pageWidth - (margin * 2), noteBoxH, 2, 2, 'FD');

        doc.setTextColor(...cedDarkBlue);
        doc.setFont('helvetica', 'bolditalic');
        doc.text(p('pdf.noteTitle'), margin + 5, y + 2);

        doc.setFont('helvetica', 'italic');
        doc.setTextColor(60, 80, 100);
        doc.text(noteLines, margin + 5, y + 8);

        y += noteBoxH + 4;

        // ==========================================
        // APERÇU 3D DE LA PIÈCE
        // ==========================================

        try {
            // Priorité 1 : vignette extraite du .3mf (plate_1.png)
            // Priorité 2 : capture du canvas Three.js (avec preserveDrawingBuffer)
            let previewImage = null;

            if (window._3mfThumbnail) {
                previewImage = window._3mfThumbnail;
            } else {
                const preview3DCanvas = document.getElementById('stl3DCanvas');
                if (preview3DCanvas && preview3DCanvas.width > 0) {
                    if (window._3dRenderer && window._3dScene && window._3dCamera) {
                        window._3dRenderer.render(window._3dScene, window._3dCamera);
                    }
                    previewImage = preview3DCanvas.toDataURL('image/png', 1.0);
                }
            }

            if (previewImage) {
                doc.setFillColor(...cedSecondary);
                doc.roundedRect(margin, y - 6, pageWidth - (margin * 2), 12, 2, 2, 'F');
                doc.setFontSize(12);
                doc.setTextColor(...white);
                doc.setFont('helvetica', 'bold');
                doc.text(p('pdf.preview3d'), margin + 5, y + 2);

                y += 14;

                const previewWidth = 70;
                const previewHeight = 44;
                const previewX = (pageWidth - previewWidth) / 2;

                doc.setFillColor(...cedDarkBlue);
                doc.roundedRect(previewX - 3, y - 2, previewWidth + 6, previewHeight + 4, 3, 3, 'F');

                doc.addImage(previewImage, 'PNG', previewX, y, previewWidth, previewHeight);

                y += previewHeight + 8;
            }
        } catch (previewError) {
            console.log('Aperçu 3D non disponible pour le PDF:', previewError);
        }

        // ==========================================
        // PIED DE PAGE
        // ==========================================

        // Bande de pied de page
        doc.setFillColor(...cedDarkBlue);
        doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');

        // Ligne accent
        doc.setFillColor(...cedCyan);
        doc.rect(0, pageHeight - 25, pageWidth, 1, 'F');

        // Texte du pied de page
        doc.setFontSize(8);
        doc.setTextColor(...lightGray);
        doc.setFont('helvetica', 'normal');
        doc.text(p('pdf.footer'), pageWidth / 2, pageHeight - 18, { align: 'center' });

        doc.setFontSize(7.5);
        doc.text(
            company.address + ' – ' + company.city + '  |  ' + company.phone + '  |  ' + company.email + '  |  TVA ' + company.vat,
            pageWidth / 2, pageHeight - 12, { align: 'center' }
        );

        doc.setTextColor(...cedCyan);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(company.name + ' © ' + new Date().getFullYear() + ' – ' + company.website, pageWidth / 2, pageHeight - 5, { align: 'center' });

        // ==========================================
        // SAUVEGARDE DU PDF
        // ==========================================

        const fileName = `Devis-CedIT-${devisNum}.pdf`;
        doc.save(fileName);
        showNotification('Devis PDF généré avec succès !', 'success');

    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        showNotification('Erreur lors de la génération du PDF', 'error');
    }
}

// Système de notifications
function showNotification(message, type = 'info') {
    // Supprimer les anciennes notifications
    const oldNotif = document.querySelector('.custom-notification');
    if (oldNotif) {
        oldNotif.remove();
    }
    
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const notif = document.createElement('div');
    notif.className = `custom-notification fixed top-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-slide-in`;
    notif.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateX(400px)';
        notif.style.transition = 'all 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Ajouter le style pour l'animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    .animate-slide-in {
        animation: slide-in 0.3s ease;
    }
`;
document.head.appendChild(style);

// ===========================================
// MODE SOMBRE
// ===========================================

// Fonction pour basculer le thème
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Mettre à jour le bouton
    const icon = document.getElementById('themeIcon');
    const text = document.getElementById('themeText');
    
    if (newTheme === 'dark') {
        icon.className = 'fas fa-sun';
        text.textContent = 'Mode Clair';
    } else {
        icon.className = 'fas fa-moon';
        text.textContent = 'Mode Sombre';
    }
    
    showNotification(`Mode ${newTheme === 'dark' ? 'sombre' : 'clair'} activé`, 'info');
}

// Charger le thème sauvegardé au démarrage
function loadSavedTheme() {
    try {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const icon = document.getElementById('themeIcon');
        const text = document.getElementById('themeText');
        
        if (icon && text) {
            if (savedTheme === 'dark') {
                icon.className = 'fas fa-sun';
                text.textContent = 'Mode Clair';
            } else {
                icon.className = 'fas fa-moon';
                text.textContent = 'Mode Sombre';
            }
        }
    } catch (error) {
        console.error('Erreur lors du chargement du thème:', error);
    }
}

// Charger le thème au démarrage - appeler dès que le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSavedTheme);
} else {
    loadSavedTheme();
}

// ===========================================
// IMPORT STL
// ===========================================

let stlData = null;

// Fonction pour gérer l'upload du fichier STL ou 3MF
async function handleSTLUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isSTL = fileName.endsWith('.stl');
    const is3MF = fileName.endsWith('.3mf');

    if (!isSTL && !is3MF) {
        showNotification('Veuillez sélectionner un fichier STL ou 3MF', 'error');
        return;
    }

    // Si c'est un fichier 3MF, utiliser la fonction dédiée dans index.html
    if (is3MF) {
        showNotification('Analyse du fichier 3MF en cours...', 'info');
        try {
            if (typeof window.handle3MFFile === 'function') {
                await window.handle3MFFile(file);
                showNotification('Fichier 3MF analysé avec succès !', 'success');
            } else {
                showNotification('Fonction handle3MFFile non disponible', 'error');
            }
        } catch (error) {
            console.error('Erreur lors du chargement du fichier 3MF:', error);
            showNotification('Erreur lors de l\'analyse du fichier 3MF: ' + error.message, 'error');
        }
        return;
    }

    // Traitement des fichiers STL
    showNotification('Analyse du fichier STL en cours...', 'info');

    try {
        const reader = new FileReader();

        reader.onload = function(e) {
            const contents = e.target.result;
            analyzeSTL(contents, file.name);
        };

        reader.readAsArrayBuffer(file);

    } catch (error) {
        console.error('Erreur lors du chargement du fichier STL:', error);
        showNotification('Erreur lors de l\'analyse du fichier STL', 'error');
    }
}

// Fonction pour analyser le fichier STL
function analyzeSTL(arrayBuffer, fileName) {
    try {
        const view = new DataView(arrayBuffer);
        let volume = 0;
        let triangleCount = 0;
        
        // Vérifier si c'est un STL binaire (plus de 84 octets et pas de texte "solid" au début)
        const header = new Uint8Array(arrayBuffer.slice(0, 80));
        const headerText = String.fromCharCode.apply(null, header);
        const isBinary = arrayBuffer.byteLength > 84 && !headerText.toLowerCase().includes('solid');
        
        if (isBinary) {
            // STL binaire
            triangleCount = view.getUint32(80, true);
            
            // Estimation du volume basée sur le nombre de triangles
            // Formule approximative : plus de triangles = plus grand objet
            volume = Math.pow(triangleCount / 100, 0.8) * 2;
            
        } else {
            // STL ASCII
            const text = new TextDecoder().decode(arrayBuffer);
            const vertices = text.match(/vertex\s+[\d\.\-e]+\s+[\d\.\-e]+\s+[\d\.\-e]+/gi);
            
            if (vertices) {
                triangleCount = vertices.length / 3;
                volume = Math.pow(triangleCount / 100, 0.8) * 2;
            } else {
                // Estimation basée sur la taille du fichier si parsing échoue
                volume = (arrayBuffer.byteLength / 10000) * 0.5;
            }
        }
        
        // S'assurer que le volume est dans une plage raisonnable
        volume = Math.max(0.5, Math.min(volume, 1000));
        
        // Calculer le poids estimé
        const density = parseFloat(document.getElementById('filamentDensity').value) || 1.24;
        const weight = volume * density;
        
        // Sauvegarder les données
        stlData = {
            fileName: fileName,
            volume: volume,
            weight: weight,
            triangles: triangleCount
        };
        
        // Afficher les informations
        const stlInfo = document.getElementById('stlInfo');
        if (stlInfo) {
            stlInfo.classList.remove('hidden');
            
            const fileNameEl = document.getElementById('stlFileName');
            const volumeEl = document.getElementById('stlVolume');
            const weightEl = document.getElementById('stlWeight');
            
            if (fileNameEl) fileNameEl.textContent = fileName;
            if (volumeEl) volumeEl.textContent = volume.toFixed(2);
            if (weightEl) weightEl.textContent = weight.toFixed(2);
        }
        
        // Mettre à jour automatiquement le poids dans le formulaire
        const weightInput = document.getElementById('filamentWeight');
        if (weightInput) {
            weightInput.value = weight.toFixed(1);
        }
        
        // Recalculer les coûts
        calculateCost();
        
        showNotification('Fichier STL analysé avec succès!', 'success');
        
    } catch (error) {
        console.error('Erreur lors de l\'analyse du STL:', error);
        showNotification('Erreur lors de l\'analyse du fichier STL: ' + error.message, 'error');
    }
}

// Fonction pour supprimer le fichier STL
function clearSTL() {
    stlData = null;
    document.getElementById('stlInfo').classList.add('hidden');
    document.getElementById('stlFileInput').value = '';
    showNotification('Fichier STL supprimé', 'info');
}

// ===========================================
// COMPARAISON DE MATÉRIAUX
// ===========================================

let comparisonMaterials = [];
let selectedComparisonId = null;

// Fonction pour ajouter un matériau à la comparaison
function addComparisonMaterial() {
    const currentFilament = {
        type: document.getElementById('filamentType').value,
        price: parseFloat(document.getElementById('filamentPrice').value),
        density: parseFloat(document.getElementById('filamentDensity').value),
        weight: parseFloat(document.getElementById('filamentWeight').value),
        color: document.getElementById('filamentColor')?.value || '#ffffff',
        colorName: document.getElementById('filamentColorName')?.value.trim() || ''
    };
    
    // Calculer les coûts pour ce matériau
    const hours = parseInt(document.getElementById('printHours').value) || 0;
    const minutes = parseInt(document.getElementById('printMinutes').value) || 0;
    const totalHours = hours + (minutes / 60);
    
    const powerConsumption = parseFloat(document.getElementById('powerConsumption').value) || 0;
    const electricityPrice = parseFloat(document.getElementById('electricityPrice').value) || 0;
    const printerCost = parseFloat(document.getElementById('printerCost').value) || 0;
    const printerLifespan = parseFloat(document.getElementById('printerLifespan').value) || 1;
    const maintenanceCost = parseFloat(document.getElementById('maintenanceCost').value) || 0;
    const failureRate = parseFloat(document.getElementById('failureRate').value) || 0;
    const profitMargin = parseFloat(document.getElementById('profitMargin').value) || 0;
    const laborHours = parseFloat(document.getElementById('laborHours').value) || 0;
    const laborRate = parseFloat(document.getElementById('laborCost').value) || 0;
    
    // Calculs
    const filamentCostTotal = (currentFilament.weight / 1000) * currentFilament.price;
    const energyConsumption = (powerConsumption / 1000) * totalHours;
    const electricityCostTotal = energyConsumption * electricityPrice;
    const depreciationCostTotal = (printerCost / printerLifespan) * totalHours;
    const maintenanceCostTotal = maintenanceCost * totalHours;
    const laborCostTotal = laborHours * laborRate;
    const baseCost = filamentCostTotal + electricityCostTotal + depreciationCostTotal + maintenanceCostTotal + laborCostTotal;
    const failureCostTotal = baseCost * (failureRate / 100);
    const totalCost = baseCost + failureCostTotal;
    const sellingPrice = totalCost * (1 + profitMargin / 100);
    
    // Ajouter à la liste
    comparisonMaterials.push({
        ...currentFilament,
        filamentCost: filamentCostTotal,
        totalCost: totalCost,
        sellingPrice: sellingPrice,
        id: Date.now()
    });
    
    saveComparisonMaterials();
    updateComparisonTable();
    showNotification(`${currentFilament.type} ajouté à la comparaison`, 'success');
}

// Fonction pour mettre à jour le tableau de comparaison
function updateComparisonTable() {
    const tbody = document.getElementById('comparisonTableBody');
    const emptyMsg = document.getElementById('comparisonEmpty');
    
    if (comparisonMaterials.length === 0) {
        tbody.innerHTML = '';
        emptyMsg.classList.remove('hidden');
        return;
    }
    
    emptyMsg.classList.add('hidden');
    
    tbody.innerHTML = comparisonMaterials.map(material => {
        const isSelected = selectedComparisonId === material.id;
        return `
        <tr class="border-b border-gray-200 hover:bg-gray-50 transition${isSelected ? ' comparison-selected' : ''}">
            <td class="py-3 px-2 text-center">
                <input type="checkbox"
                       ${isSelected ? 'checked' : ''}
                       onchange="selectComparisonMaterial(${material.id})"
                       title="Utiliser pour le devis"
                       style="width:16px;height:16px;cursor:pointer;accent-color:var(--accent-cyan);">
            </td>
            <td class="py-3 px-2 text-gray-700 font-semibold">${material.type}</td>
            <td class="py-3 px-2 text-center">
                <div class="flex items-center justify-center gap-2" title="${material.colorName || ''}">
                    <span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:${material.color || '#ffffff'};border:1px solid rgba(128,128,128,0.35);flex-shrink:0;"></span>
                    ${material.colorName ? `<span class="text-xs text-gray-500">${material.colorName}</span>` : ''}
                </div>
            </td>
            <td class="py-3 px-2 text-right text-gray-600">${material.price.toFixed(2)} €</td>
            <td class="py-3 px-2 text-right text-gray-600">${material.density.toFixed(2)}</td>
            <td class="py-3 px-2 text-right text-gray-700 font-semibold">${material.filamentCost.toFixed(2)} €</td>
            <td class="py-3 px-2 text-right text-gray-800 font-bold">${material.totalCost.toFixed(2)} €</td>
            <td class="py-3 px-2 text-right text-green-600 font-bold">${material.sellingPrice.toFixed(2)} €</td>
            <td class="py-3 px-2 text-center">
                <button onclick="removeComparisonMaterial(${material.id})" class="text-red-500 hover:text-red-700 transition">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>`;
    }).join('');
}

// Fonction pour supprimer un matériau de la comparaison
function removeComparisonMaterial(id) {
    comparisonMaterials = comparisonMaterials.filter(m => m.id !== id);
    if (selectedComparisonId === id) selectedComparisonId = null;
    saveComparisonMaterials();
    updateComparisonTable();
    showNotification('Matériau supprimé de la comparaison', 'info');
}

// Sauvegarde la liste de comparaison dans localStorage
function saveComparisonMaterials() {
    localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(comparisonMaterials));
}

// Charge la liste de comparaison depuis localStorage
function loadComparisonMaterials() {
    const saved = localStorage.getItem(COMPARISON_STORAGE_KEY);
    if (saved) {
        comparisonMaterials = JSON.parse(saved);
        updateComparisonTable();
    }
}

// Sélectionne un matériau de comparaison pour l'appliquer au calculateur
function selectComparisonMaterial(id) {
    if (selectedComparisonId === id) {
        // Décocher : désélectionner
        selectedComparisonId = null;
    } else {
        selectedComparisonId = id;
        const material = comparisonMaterials.find(m => m.id === id);
        if (material) {
            document.getElementById('filamentType').value = material.type;
            document.getElementById('filamentPrice').value = material.price;
            document.getElementById('filamentDensity').value = material.density;
            if (document.getElementById('filamentColor')) document.getElementById('filamentColor').value = material.color || '#ffffff';
            if (document.getElementById('filamentColorName')) document.getElementById('filamentColorName').value = material.colorName || '';
            calculateCost();
            autoSaveConfig();
            showNotification(`Matériau ${material.type} appliqué au calculateur`, 'success');
        }
    }
    updateComparisonTable();
}

// Exposer les fonctions nécessaires globalement
window.calculateCost = calculateCost;
window.exportResults = exportResults;
// ============================================================
// GESTION DES CLIENTS
// ============================================================
const CLIENTS_STORAGE_KEY = '3dprintClients';
let currentClientId = null;

function loadClients() {
    const saved = localStorage.getItem(CLIENTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
}

function saveClients(clients) {
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
}

function renderClientSelect() {
    const select = document.getElementById('clientSelect');
    if (!select) return;
    const clients = loadClients();
    select.innerHTML = '<option value="">— Aucun client —</option>';
    clients.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.company ? `${c.name} (${c.company})` : c.name;
        if (c.id === currentClientId) opt.selected = true;
        select.appendChild(opt);
    });
    updateClientPreview();
}

function selectClientFromDropdown(id) {
    currentClientId = id || null;
    updateClientPreview();
}

function updateClientPreview() {
    const preview = document.getElementById('clientPreview');
    const editBtn = document.getElementById('editClientBtn');
    const deleteBtn = document.getElementById('deleteClientBtn');

    if (!currentClientId) {
        preview?.classList.add('hidden');
        editBtn?.classList.add('hidden');
        deleteBtn?.classList.add('hidden');
        return;
    }

    const client = loadClients().find(c => c.id === currentClientId);
    if (!client) {
        currentClientId = null;
        updateClientPreview();
        return;
    }

    preview?.classList.remove('hidden');
    editBtn?.classList.remove('hidden');
    deleteBtn?.classList.remove('hidden');

    document.getElementById('clientPreviewName').textContent = client.name;
    document.getElementById('clientPreviewCompany').textContent = client.company || '';
    const addr = [client.address, [client.postalCode, client.city].filter(Boolean).join(' ')].filter(Boolean).join(', ');
    document.getElementById('clientPreviewAddress').textContent = addr;
    const contact = [client.email, client.phone].filter(Boolean).join(' • ');
    document.getElementById('clientPreviewContact').textContent = contact;
}

function openClientModal(clientId) {
    const modal = document.getElementById('clientModal');
    const title = document.getElementById('clientModalTitle');
    const fields = ['clientModalName','clientModalCompany','clientModalEmail','clientModalPhone',
                    'clientModalAddress','clientModalPostal','clientModalCity','clientModalVat','clientModalNotes'];

    if (clientId) {
        const client = loadClients().find(c => c.id === clientId);
        if (!client) return;
        title.textContent = 'Modifier le client';
        document.getElementById('clientModalId').value = client.id;
        document.getElementById('clientModalName').value = client.name || '';
        document.getElementById('clientModalCompany').value = client.company || '';
        document.getElementById('clientModalEmail').value = client.email || '';
        document.getElementById('clientModalPhone').value = client.phone || '';
        document.getElementById('clientModalAddress').value = client.address || '';
        document.getElementById('clientModalPostal').value = client.postalCode || '';
        document.getElementById('clientModalCity').value = client.city || '';
        document.getElementById('clientModalVat').value = client.vat || '';
        document.getElementById('clientModalNotes').value = client.notes || '';
    } else {
        title.textContent = 'Nouveau client';
        document.getElementById('clientModalId').value = '';
        fields.forEach(id => { document.getElementById(id).value = ''; });
    }

    modal?.classList.remove('hidden');
    document.getElementById('clientModalName').focus();
}

function closeClientModal() {
    document.getElementById('clientModal')?.classList.add('hidden');
}

function saveClientModal() {
    const name = document.getElementById('clientModalName').value.trim();
    if (!name) {
        showNotification('Le nom du client est obligatoire.', 'error');
        return;
    }

    const existingId = document.getElementById('clientModalId').value;
    const clients = loadClients();

    const clientData = {
        id: existingId || 'client-' + Date.now(),
        name,
        company:    document.getElementById('clientModalCompany').value.trim(),
        email:      document.getElementById('clientModalEmail').value.trim(),
        phone:      document.getElementById('clientModalPhone').value.trim(),
        address:    document.getElementById('clientModalAddress').value.trim(),
        postalCode: document.getElementById('clientModalPostal').value.trim(),
        city:       document.getElementById('clientModalCity').value.trim(),
        vat:        document.getElementById('clientModalVat').value.trim(),
        notes:      document.getElementById('clientModalNotes').value.trim(),
    };

    if (existingId) {
        const idx = clients.findIndex(c => c.id === existingId);
        if (idx >= 0) clients[idx] = clientData;
    } else {
        clients.push(clientData);
    }

    saveClients(clients);
    currentClientId = clientData.id;
    renderClientSelect();
    closeClientModal();
    showNotification('Client enregistré.', 'success');
}

function editSelectedClient() {
    if (currentClientId) openClientModal(currentClientId);
}

function deleteSelectedClient() {
    if (!currentClientId) return;
    if (!confirm('Supprimer ce client ?')) return;
    const clients = loadClients().filter(c => c.id !== currentClientId);
    saveClients(clients);
    currentClientId = null;
    renderClientSelect();
    showNotification('Client supprimé.', 'info');
}

function getCurrentClient() {
    if (!currentClientId) return null;
    return loadClients().find(c => c.id === currentClientId) || null;
}

window.saveConfig = saveConfig;
window.loadConfig = loadConfig;
window.resetToDefaults = resetToDefaults;
window.loadPreset = loadPreset;
window.exportPDF = exportPDF;
window.toggleHistory = toggleHistory;
window.deleteHistoryEntry = deleteHistoryEntry;
window.clearHistory = clearHistory;
window.toggleTheme = toggleTheme;
window.handleSTLUpload = handleSTLUpload;
window.clearSTL = clearSTL;
window.addComparisonMaterial = addComparisonMaterial;
window.removeComparisonMaterial = removeComparisonMaterial;
window.selectComparisonMaterial = selectComparisonMaterial;
window.applyTranslations = applyTranslations;
window.openClientModal = openClientModal;
window.closeClientModal = closeClientModal;
window.saveClientModal = saveClientModal;
window.selectClientFromDropdown = selectClientFromDropdown;
window.editSelectedClient = editSelectedClient;
window.deleteSelectedClient = deleteSelectedClient;