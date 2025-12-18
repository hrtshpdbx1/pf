// main.js - Système de Personnalisation (Version Corrigée)

// --- 1. Variables Globales et Valeurs par Défaut ---
let currentFontSize = 22;
let currentLineHeight = 1.2;
let currentFontType = 'bbbreadme';
let currentBlockMode = 0; // 0 = mode normal, 1 = mode bloc
let currentBgColor = '#ffffff';
let currentTextColor = '#000000';

// Déclaration de variables globales pour les éléments DOM (initialement null)
let mainContent = null;
let sidebar = null;

// --- 2. Fonction d'Application des Styles ---
// Applique toutes les préférences stockées à la page.
function applyStyles() {

    // Sécurité : si le conteneur principal n'est pas encore trouvé (devrait être chargé via DOMContentLoaded)
    if (!mainContent) return;

    // A. APPLIQUER LA TAILLE ET L'INTERLIGNAGE
    mainContent.style.fontSize = currentFontSize + 'px';
    mainContent.style.lineHeight = currentLineHeight;

    // B. APPLIQUER LE CONTRASTE (via les variables CSS)
    document.documentElement.style.setProperty('--main-background', currentBgColor);
    document.documentElement.style.setProperty('--main-text', currentTextColor);

    // C. APPLIQUER LA POLICE (en changeant la classe sur la balise <body>)
    // 1. On retire toutes les classes de police existantes
    document.body.className = document.body.className.replace(/\barial\b|\btimes\b|\bbbbreadme\b|\beido\b|\baccessibledfa\b|\bopendyslexic\b/g, '');
    // 2. On ajoute la classe correspondant à la police choisie
    document.body.classList.add(currentFontType);

    // D. APPLIQUER LE MODE BLOC
    if (currentBlockMode === 1) {
        mainContent.classList.add('block');
    } else {
        mainContent.classList.remove('block');
    }
// E. MISE À JOUR DES BOUTONS DE FOND
    // Pour que les boutons "Fond" changent de police en temps réel
    document.querySelectorAll('.block-control').forEach(btn => {
        btn.style.fontFamily = getComputedStyle(document.body).fontFamily;
    });

    // F. METTRE À JOUR LES AFFICHAGES DANS LE MENU (les petites valeurs "prompt")
    if (document.getElementById('size-prompt')) {
        document.getElementById('size-prompt').textContent = currentFontSize;
    }
    if (document.getElementById('line-height-prompt')) {
        document.getElementById('line-height-prompt').textContent = currentLineHeight.toFixed(1);
    }
    if (document.getElementById('font-prompt')) {
        document.getElementById('font-prompt').textContent = currentFontType.charAt(0).toUpperCase() + currentFontType.slice(1);
    }
}

// --- 3. Fonction pour Marquer le Bouton Actif (Visuel) ---
function updateSelectedButton(groupSelector, activeValue) {
    const buttons = document.querySelectorAll(groupSelector);
    buttons.forEach(btn => {
        // Supprime la classe 'selected' et remet aria-pressed à false (si applicable)
        btn.classList.remove('customSelected', 'selected');
        btn.setAttribute('aria-pressed', false);

        // On vérifie la correspondance avec la valeur
        const isMatch = btn.dataset.value === activeValue ||
            btn.dataset.font === activeValue ||
            (btn.dataset.bg === activeValue && btn.dataset.type === 'contrast');

        if (isMatch) {
            // Utiliser 'customSelected' ou 'selected' selon votre CSS, j'utilise les deux pour la compatibilité
            btn.classList.add('customSelected', 'selected');
            btn.setAttribute('aria-pressed', true);
        }
    });
}

// --- 4. Fonction pour Charger les Préférences depuis le Navigateur (localStorage) ---
function loadPreferences() {
    currentFontSize = parseInt(localStorage.getItem('fontSize')) || currentFontSize;
    currentLineHeight = parseFloat(localStorage.getItem('lineHeight')) || currentLineHeight;
    currentFontType = localStorage.getItem('fontType') || currentFontType;
    currentBlockMode = parseInt(localStorage.getItem('blockMode')) || currentBlockMode;

    currentBgColor = localStorage.getItem('bgColor') || currentBgColor;
    currentTextColor = localStorage.getItem('textColor') || currentTextColor;
}


// --- 5. Lancement des Fonctions et Événements ---

document.addEventListener('DOMContentLoaded', () => {

    // CORRECTION CRITIQUE : On récupère les éléments DOM ici, après le chargement du HTML.
    mainContent = document.getElementById('main-content');
    sidebar = document.getElementById('sidebar');

    // Étape 1 : Chargement initial et application
    loadPreferences();
    applyStyles();

    // Étape 2 : Mettre à jour l'état visuel des boutons au démarrage
    updateSelectedButton('.font-control', currentFontType);
    updateSelectedButton('.block-control', currentBlockMode.toString());
    updateSelectedButton('.contrast-control', currentBgColor);


    // --- A. Gestion du menu de Personnalisation (Ouverture/Fermeture) ---

    const triggerBtn = document.getElementById('logo_trigger_menu');
    const closeBtn = document.getElementById('closeCustomBlock');

    if (triggerBtn && sidebar) {
        triggerBtn.addEventListener('click', function () {
            sidebar.classList.add('sticky');
        });
    }

    if (closeBtn && sidebar) {
        closeBtn.addEventListener('click', function () {
            sidebar.classList.remove('sticky');
        });
    }

    // --- B. Événements pour la Police (Font Control) ---
    document.querySelectorAll('.font-control').forEach(btn => {
        btn.addEventListener('click', function () {
            currentFontType = this.dataset.value;
            localStorage.setItem('fontType', currentFontType);
            applyStyles();
            updateSelectedButton('.font-control', currentFontType);
        });
    });


    // --- C. Événements pour la Taille et l'Interlignage ---
    document.querySelectorAll('.size-control, .line-control').forEach(btn => {
        btn.addEventListener('click', function () {
            const change = parseFloat(this.dataset.change);

            if (this.dataset.type === 'size') {
                currentFontSize += change;
                currentFontSize = Math.max(14, Math.min(38, currentFontSize));
                localStorage.setItem('fontSize', currentFontSize);
            }

            if (this.dataset.type === 'line') {
                currentLineHeight += change;
                currentLineHeight = Math.max(1.0, Math.min(2.5, currentLineHeight));
                localStorage.setItem('lineHeight', currentLineHeight.toFixed(1));
            }

            applyStyles();
        });
    });

    // --- D. Événements pour le Contraste (Contrast Control) ---
    document.querySelectorAll('.contrast-control').forEach(btn => {
        btn.addEventListener('click', function () {
            currentBgColor = this.dataset.bg;
            currentTextColor = this.dataset.text;

            localStorage.setItem('bgColor', currentBgColor);
            localStorage.setItem('textColor', currentTextColor);

            applyStyles();
            updateSelectedButton('.contrast-control', currentBgColor);
        });
    });

    // --- E. Événements pour le Mode Bloc ---
    document.querySelectorAll('.block-control').forEach(btn => {
        btn.addEventListener('click', function () {
            currentBlockMode = parseInt(this.dataset.value);

            localStorage.setItem('blockMode', currentBlockMode);

            applyStyles();
            updateSelectedButton('.block-control', this.dataset.value);
        });
    });

    // --- F. Événements pour les Dropdowns ---
    document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
        trigger.addEventListener('click', function () {
            const targetId = this.dataset.target;
            const targetContent = document.getElementById(targetId);
            const arrow = this.querySelector('.dropdown-arrow');

            if (targetContent) {
                // Bascule la classe 'open' pour afficher/cacher
                const isOpen = targetContent.classList.toggle('open');

                // Gère la rotation de la flèche
                if (arrow) {
                    if (isOpen) {
                        arrow.style.transform = 'rotate(180deg)';
                    } else {
                        arrow.style.transform = 'rotate(0deg)';
                    }
                }
            }
        });
    });

    // ** -------------- CONTACT FORM  ----------------- ** 
    const form = document.getElementById('contactForm');
    const statusMessage = document.getElementById('statusMessage');
    const submitBtn = document.getElementById('submitBtn');

    if (form) { // S'assurer que le formulaire existe
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Désactiver le bouton pendant l'envoi
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            if (statusMessage) statusMessage.textContent = '';

            // Récupérer les données du formulaire
            const formData = {
                forname: document.getElementById('forname').value,
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            try {
                const response = await fetch('http://localhost:3000/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    if (statusMessage) {
                        statusMessage.textContent = '✅ Message sent successfully!';
                        statusMessage.style.color = 'green';
                    }
                    form.reset();
                } else {
                    if (statusMessage) {
                        statusMessage.textContent = '❌ Error: ' + data.error;
                        statusMessage.style.color = 'red';
                    }
                }
            } catch (error) {
                if (statusMessage) {
                    statusMessage.textContent = '❌ Connection error. Please try again.';
                    statusMessage.style.color = 'red';
                }
            } finally {
                // Réactiver le bouton
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }

});


