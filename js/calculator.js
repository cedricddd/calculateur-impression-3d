// Calculateur de prix d'impression 3D
// Gère tous les calculs et mises à jour de l'interface

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

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Gestion du panneau des paramètres avancés
    const toggleBtn = document.getElementById('toggleAdvanced');
    const advancedParams = document.getElementById('advancedParams');
    const advancedIcon = document.getElementById('advancedIcon');

    toggleBtn.addEventListener('click', function() {
        advancedParams.classList.toggle('hidden');
        advancedIcon.classList.toggle('rotate-180');
    });

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

    // Calcul automatique au chargement et lors de changements
    updateTotalTime();
    calculateCost();
    updateHistoryCount();

    // Calcul automatique lors de la modification de n'importe quel champ
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', calculateCost);
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
        // Sauvegarder dans l'historique avant l'export
        saveToHistory();

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Charger le logo Ced-IT
        let logoBase64 = null;
        try {
            logoBase64 = await loadImageAsBase64('images/Ced-it-No background.png');
        } catch (logoError) {
            console.log('Logo non disponible, utilisation du texte');
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
            doc.text('CED-IT', margin, 25);

            // Sous-titre (seulement avec le texte)
            doc.setFontSize(10);
            doc.setTextColor(...lightGray);
            doc.setFont('helvetica', 'normal');
            doc.text('Services d\'impression 3D professionnels', margin, 33);
        }

        // Informations contact à droite
        doc.setFontSize(9);
        doc.setTextColor(...white);
        doc.text('www.ced-it.fr', pageWidth - margin, 18, { align: 'right' });
        doc.text('contact@ced-it.fr', pageWidth - margin, 25, { align: 'right' });
        doc.setTextColor(...cedCyan);
        doc.setFont('helvetica', 'bold');

        // Date du devis
        const date = new Date().toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        doc.text(date, pageWidth - margin, 33, { align: 'right' });

        // ==========================================
        // TITRE DU DOCUMENT
        // ==========================================

        let y = 60;

        doc.setFontSize(22);
        doc.setTextColor(...cedDarkBlue);
        doc.setFont('helvetica', 'bold');
        doc.text('DEVIS D\'IMPRESSION 3D', pageWidth / 2, y, { align: 'center' });

        // Numéro de devis
        y += 10;
        doc.setFontSize(10);
        doc.setTextColor(...darkGray);
        doc.setFont('helvetica', 'normal');
        const devisNum = 'DEV-' + Date.now().toString().slice(-8);
        doc.text(`Référence : ${devisNum}`, pageWidth / 2, y, { align: 'center' });

        // ==========================================
        // SECTION PARAMÈTRES DU PROJET
        // ==========================================

        y += 20;

        // Titre de section avec fond
        doc.setFillColor(...cedSecondary);
        doc.roundedRect(margin, y - 6, pageWidth - (margin * 2), 12, 2, 2, 'F');
        doc.setFontSize(12);
        doc.setTextColor(...white);
        doc.setFont('helvetica', 'bold');
        doc.text('PARAMÈTRES DU PROJET', margin + 5, y + 2);

        y += 18;

        // Tableau des paramètres
        const params = [
            ['Type de matériau', document.getElementById('filamentType').value],
            ['Prix du filament', document.getElementById('filamentPrice').value + ' €/kg'],
            ['Poids de filament', document.getElementById('filamentWeight').value + ' g'],
            ['Temps d\'impression', document.getElementById('totalTime').value],
            ['Consommation électrique', document.getElementById('powerConsumption').value + ' W'],
            ['Tarif électricité', document.getElementById('electricityPrice').value + ' €/kWh']
        ];

        doc.setFontSize(10);
        const colWidth = (pageWidth - (margin * 2)) / 2;

        params.forEach((param, index) => {
            // Fond alterné
            if (index % 2 === 0) {
                doc.setFillColor(245, 247, 250);
                doc.rect(margin, y - 4, pageWidth - (margin * 2), 8, 'F');
            }

            doc.setTextColor(...darkGray);
            doc.setFont('helvetica', 'normal');
            doc.text(param[0], margin + 5, y);

            doc.setTextColor(...cedDarkBlue);
            doc.setFont('helvetica', 'bold');
            doc.text(param[1], pageWidth - margin - 5, y, { align: 'right' });

            y += 8;
        });

        // ==========================================
        // SECTION DÉCOMPOSITION DES COÛTS
        // ==========================================

        y += 12;

        // Titre de section
        doc.setFillColor(...cedSecondary);
        doc.roundedRect(margin, y - 6, pageWidth - (margin * 2), 12, 2, 2, 'F');
        doc.setFontSize(12);
        doc.setTextColor(...white);
        doc.setFont('helvetica', 'bold');
        doc.text('DÉCOMPOSITION DES COÛTS', margin + 5, y + 2);

        y += 18;

        // En-tête du tableau des coûts
        doc.setFillColor(...cedCard);
        doc.rect(margin, y - 5, pageWidth - (margin * 2), 8, 'F');
        doc.setFontSize(9);
        doc.setTextColor(...white);
        doc.setFont('helvetica', 'bold');
        doc.text('POSTE DE COÛT', margin + 5, y);
        doc.text('MONTANT HT', pageWidth - margin - 5, y, { align: 'right' });

        y += 10;

        const costs = [
            ['Matière première (filament)', document.getElementById('filamentCost').textContent],
            ['Énergie électrique', document.getElementById('electricityCost').textContent],
            ['Amortissement machine', document.getElementById('depreciationCost').textContent],
            ['Maintenance équipement', document.getElementById('maintenanceCostDisplay').textContent],
            ['Main-d\'œuvre', document.getElementById('laborCostDisplay').textContent.split('(')[0].trim()],
            ['Provision pour échecs', document.getElementById('failureCost').textContent]
        ];

        doc.setFontSize(10);
        costs.forEach((cost, index) => {
            // Fond alterné
            if (index % 2 === 0) {
                doc.setFillColor(250, 251, 252);
                doc.rect(margin, y - 4, pageWidth - (margin * 2), 8, 'F');
            }

            doc.setTextColor(60, 60, 60);
            doc.setFont('helvetica', 'normal');
            doc.text(cost[0], margin + 5, y);

            doc.setTextColor(...cedDarkBlue);
            doc.text(cost[1], pageWidth - margin - 5, y, { align: 'right' });

            y += 8;
        });

        // ==========================================
        // TOTAUX AVEC MISE EN VALEUR
        // ==========================================

        y += 5;

        // Ligne de séparation
        doc.setDrawColor(...cedCyan);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);

        y += 12;

        // Coût de revient
        doc.setFillColor(240, 253, 255);
        doc.roundedRect(margin, y - 6, pageWidth - (margin * 2), 14, 2, 2, 'F');
        doc.setDrawColor(...cedCyan);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, y - 6, pageWidth - (margin * 2), 14, 2, 2, 'S');

        doc.setFontSize(12);
        doc.setTextColor(...cedDarkBlue);
        doc.setFont('helvetica', 'bold');
        doc.text('COÛT DE REVIENT', margin + 5, y + 2);

        doc.setFontSize(14);
        doc.setTextColor(...cedCyan);
        doc.text(document.getElementById('totalCost').textContent, pageWidth - margin - 5, y + 2, { align: 'right' });

        y += 22;

        // Prix de vente suggéré (mise en valeur forte)
        doc.setFillColor(...cedCyan);
        doc.roundedRect(margin, y - 6, pageWidth - (margin * 2), 18, 3, 3, 'F');

        doc.setFontSize(13);
        doc.setTextColor(...white);
        doc.setFont('helvetica', 'bold');
        doc.text('PRIX DE VENTE CONSEILLÉ', margin + 5, y + 4);

        doc.setFontSize(18);
        doc.text(document.getElementById('sellingPrice').textContent, pageWidth - margin - 5, y + 4, { align: 'right' });

        // ==========================================
        // STATISTIQUES COMPLÉMENTAIRES
        // ==========================================

        y += 30;

        // Titre de section
        doc.setFillColor(...cedSecondary);
        doc.roundedRect(margin, y - 6, pageWidth - (margin * 2), 12, 2, 2, 'F');
        doc.setFontSize(12);
        doc.setTextColor(...white);
        doc.setFont('helvetica', 'bold');
        doc.text('INDICATEURS', margin + 5, y + 2);

        y += 18;

        // Statistiques en colonnes
        const stats = [
            ['Coût / gramme', document.getElementById('costPerGram').textContent],
            ['Coût / heure', document.getElementById('costPerHour').textContent],
            ['Volume estimé', document.getElementById('volume').textContent]
        ];

        const statWidth = (pageWidth - (margin * 2) - 20) / 3;

        stats.forEach((stat, index) => {
            const x = margin + (index * (statWidth + 10));

            // Boîte de statistique
            doc.setFillColor(248, 250, 252);
            doc.setDrawColor(226, 232, 240);
            doc.roundedRect(x, y - 4, statWidth, 25, 2, 2, 'FD');

            doc.setFontSize(8);
            doc.setTextColor(...darkGray);
            doc.setFont('helvetica', 'normal');
            doc.text(stat[0], x + statWidth / 2, y + 3, { align: 'center' });

            doc.setFontSize(12);
            doc.setTextColor(...cedDarkBlue);
            doc.setFont('helvetica', 'bold');
            doc.text(stat[1], x + statWidth / 2, y + 14, { align: 'center' });
        });

        // ==========================================
        // CAPTURE DU GRAPHIQUE
        // ==========================================

        try {
            const chartCanvas = document.getElementById('costChart');
            if (chartCanvas && costChart) {
                const chartImage = chartCanvas.toDataURL('image/png', 1.0);

                y += 40;

                // Titre section graphique
                doc.setFillColor(...cedSecondary);
                doc.roundedRect(margin, y - 6, pageWidth - (margin * 2), 12, 2, 2, 'F');
                doc.setFontSize(12);
                doc.setTextColor(...white);
                doc.setFont('helvetica', 'bold');
                doc.text('RÉPARTITION DES COÛTS', margin + 5, y + 2);

                y += 15;

                // Ajouter le graphique centré
                const chartWidth = 80;
                const chartHeight = 80;
                const chartX = (pageWidth - chartWidth) / 2;

                doc.addImage(chartImage, 'PNG', chartX, y, chartWidth, chartHeight);
            }
        } catch (chartError) {
            console.log('Graphique non disponible pour le PDF:', chartError);
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
        doc.text('Ce devis est établi à titre indicatif. Les prix peuvent varier selon la complexité réelle du projet.', pageWidth / 2, pageHeight - 16, { align: 'center' });

        doc.setTextColor(...cedCyan);
        doc.setFont('helvetica', 'bold');
        doc.text('Ced-IT © ' + new Date().getFullYear() + ' - Impression 3D sur mesure', pageWidth / 2, pageHeight - 8, { align: 'center' });

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

// Fonction pour ajouter un matériau à la comparaison
function addComparisonMaterial() {
    const currentFilament = {
        type: document.getElementById('filamentType').value,
        price: parseFloat(document.getElementById('filamentPrice').value),
        density: parseFloat(document.getElementById('filamentDensity').value),
        weight: parseFloat(document.getElementById('filamentWeight').value)
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
    
    tbody.innerHTML = comparisonMaterials.map(material => `
        <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
            <td class="py-3 px-2 text-gray-700 font-semibold">${material.type}</td>
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
        </tr>
    `).join('');
}

// Fonction pour supprimer un matériau de la comparaison
function removeComparisonMaterial(id) {
    comparisonMaterials = comparisonMaterials.filter(m => m.id !== id);
    updateComparisonTable();
    showNotification('Matériau supprimé de la comparaison', 'info');
}

// Exposer les fonctions nécessaires globalement
window.calculateCost = calculateCost;
window.exportResults = exportResults;
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