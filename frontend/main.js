

// ** CUSTOM TOOLS
// VALEURS PAR DÉFAUT 
const DEFAULTS = {
    // ! Theme par défaut 
    fontSize: 14,
    lineHeight: 1.8,
    fontType: 'bbbreadme',
    bgColor: 'rgb(84.699% 96.254% 83.914%)',
    textColor: 'rgb(13.81% 13.179% 9.5057%)',
    lang: 'fr'
};

//2. DECLARATION VARIABLES
let currentFontSize, currentLineHeight, currentFontType, currentBgColor, currentTextColor;

let mainContent, sidebar;

// 3. FONCTIONS 
function applyStyles() {
    if (!mainContent) return;

    // Appliquer Taille 
    mainContent.style.fontSize = currentFontSize + 'px';

    // Appliquer interligne via variables CSS
    //  uniquement les <p> et <li> définis dans le CSS
    document.documentElement.style.setProperty('--dynamic-line-height', currentLineHeight);
    // old : mainContent.style.lineHeight = currentLineHeight;

    // Appliquer Couleurs via variables CSS
    document.documentElement.style.setProperty('--main-background', currentBgColor);
    document.documentElement.style.setProperty('--main-text', currentTextColor);

    // Police et UI
    document.body.className = '';
    document.body.classList.add(currentFontType);

    // Mettre à jour les indicateurs visuels de l'interface
    if (document.getElementById('size-prompt'))
        document.getElementById('size-prompt').textContent = currentFontSize;

    if (document.getElementById('line-height-prompt'))
        document.getElementById('line-height-prompt').textContent = currentLineHeight.toFixed(1);

    document.getElementById('font-select').value = currentFontType;
}

function loadPreferences() {
    // POUR chaque paramètre (Taille, Police, Couleurs, etc.) :
    // LIRE la valeur stockée dans la mémoire du navigateur (localStorage)
    // SI une valeur existe : l'utiliser
    // SINON : utiliser la valeur par défaut définie au début
    currentFontSize = parseInt(localStorage.getItem('fontSize')) || DEFAULTS.fontSize;
    currentLineHeight = parseFloat(localStorage.getItem('lineHeight')) || DEFAULTS.lineHeight;
    currentFontType = localStorage.getItem('fontType') || DEFAULTS.fontType;
    currentBgColor = localStorage.getItem('bgColor') || DEFAULTS.bgColor;
    currentTextColor = localStorage.getItem('textColor') || DEFAULTS.textColor;
}

// 4. ÉVÉNEMENTS 
document.addEventListener('DOMContentLoaded', () => {
    mainContent = document.getElementById('main-content');
    sidebar = document.getElementById('sidebar');

    loadPreferences();
    applyStyles();

    // -- OUVERTURE / FERMETURE DU MENU --
    document.getElementById('logo_trigger_menu').addEventListener('click', () => sidebar.classList.add('sticky'));
    document.getElementById('closeCustomBlock').addEventListener('click', () => sidebar.classList.remove('sticky'));

    // -- POLICE --
    // QUAND la liste déroulante change, ENREGISTRER la nouvelle police, METTRE À JOUR l'affichage
    document.getElementById('font-select').addEventListener('change', function () {
        currentFontType = this.value;
        localStorage.setItem('fontType', currentFontType);
        applyStyles();
    });

    // -- TAILLE / INTERLIGNE --
    document.querySelectorAll('.size-control, .line-control').forEach(btn => {
        btn.addEventListener('click', function () {
            const change = parseFloat(this.dataset.change);
            if (this.classList.contains('size-control')) {
                // limite le résultat (entre 10 et 24)
                currentFontSize = Math.max(10, Math.min(24, currentFontSize + change));
                localStorage.setItem('fontSize', currentFontSize);
            } else {
                currentLineHeight = Math.max(1.0, Math.min(2.5, currentLineHeight + change));
                localStorage.setItem('lineHeight', currentLineHeight.toFixed(1));
            }
            applyStyles();
        });
    });

    // -- CONTRASTES (CERCLES) --
    // POUR CHAQUE pastille de couleur :
    //  APPLIQUER les couleurs au clic
    // SAUVEGARDER et APPLIQUER
    document.querySelectorAll('.contrast-control').forEach(btn => {
        btn.style.setProperty('--btn-bg', btn.dataset.bg);
        btn.style.setProperty('--btn-text', btn.dataset.text);

        btn.addEventListener('click', function () {
            currentBgColor = this.dataset.bg;
            currentTextColor = this.dataset.text;
            localStorage.setItem('bgColor', currentBgColor);
            localStorage.setItem('textColor', currentTextColor);
            applyStyles();
        });
    });

    // -- INVERSION 
    document.getElementById('invert-toggle').addEventListener('change', function () {
        // Inverse les couleurs text / bg
        [currentBgColor, currentTextColor] = [currentTextColor, currentBgColor];

        // Sauvegarde des nouvelles valeurs
        localStorage.setItem('bgColor', currentBgColor);
        localStorage.setItem('textColor', currentTextColor);

        // On applique le changement
        applyStyles();
    });

    // -- BOUTON RESET  --
    document.getElementById('reset-theme').addEventListener('click', function () {
        // cf objet DEFAULTS
        currentFontSize = DEFAULTS.fontSize;
        currentLineHeight = DEFAULTS.lineHeight;
        currentFontType = DEFAULTS.fontType;
        currentBgColor = DEFAULTS.bgColor;
        currentTextColor = DEFAULTS.textColor;

        localStorage.clear();
        // Décocher le switch d'inversion
        document.getElementById('invert-toggle').checked = false;
        // Appliquer visuellement
        applyStyles();
        // console.log("Interface remise à zéro.");
    });
});


// Back to top 
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    //Le bouton s'affiche après 400px de scroll
    if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

