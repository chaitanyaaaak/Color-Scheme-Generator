const getSchemeBtn = document.getElementById('get-scheme-btn');
const randomBtn = document.getElementById('random-btn');
const colorInput = document.getElementById('seed-color-input');
const modeSelector = document.getElementById('mode-selector');
const colorPalette = document.getElementById('color-palette');
const copyNotification = document.getElementById('copy-notification');

const API_URL = 'https://www.thecolorapi.com/scheme';
let copyTimeout;

getSchemeBtn.addEventListener('click', fetchAndRenderColorScheme);
randomBtn.addEventListener('click', handleRandomColor);
colorPalette.addEventListener('click', handlePaletteClick);

async function fetchAndRenderColorScheme() {
    const seedColor = colorInput.value.substring(1);
    const mode = modeSelector.value;
    const count = 5;

    showLoadingState();

    try {
        const response = await fetch(`${API_URL}?hex=${seedColor}&mode=${mode}&count=${count}`);
        if (!response.ok) {
            throw new Error(`Network error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        // console.log(data);
        renderColorScheme(data.colors);

    }   catch (error) {
        console.error("Failed to fetch color scheme:", error);
        renderErrorState(error.message);
    }
};

function renderColorScheme(colors) {

    const colorColumns = colors.map(color => {
        const hex = color.hex.value;
        const rgb = color.rgb.value;
        const hsl = color.hsl.value;

        return `
            <div class="color-column" data-hex="${hex}">
                <div class="color-swatch" style="background-color: ${hex};"></div>
                <div class="color-info">
                    <p class="hex-code">${hex}</p>
                    <div class="color-info-extra">
                        <p>${rgb}</p>
                        <p>${hsl}</p>
                    </div>
                </div>
            </div>`;
    }).join('');
    
    colorPalette.innerHTML = colorColumns;
}

function showLoadingState() {
    colorPalette.innerHTML = `
        <div class="status-container">
            <div class="loader"></div>
        </div>`;
    }
    
function renderErrorState(message) {
    colorPalette.innerHTML = `
        <div class="status-container">
            <p>Sorry, something went wrong. <br> 
            Please try again. <br>
            <small>(${message})</small>
            </p>
        </div>`;
    }

function handleRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    colorInput.value = `#${randomColor}`;
    fetchAndRenderColorScheme();
}

function handlePaletteClick(e) {
    const colorColumn = e.target.closest('.color-column');
    if (!colorColumn) return;
    
    const hexCode = colorColumn.dataset.hex;
    navigator.clipboard.writeText(hexCode)
    .then(() => showCopyNotification(`Copied ${hexCode}`))
    .catch(err => {
        console.error('Failed to copy text: ', err);
        showCopyNotification('Could not copy color');
    });    
}

function showCopyNotification(message) {
    if (copyTimeout) clearTimeout(copyTimeout);
    copyNotification.textContent = message;
    copyNotification.classList.add('show');
    copyTimeout = setTimeout(() => copyNotification.classList.remove('show'), 2000);
}

document.addEventListener('DOMContentLoaded', fetchAndRenderColorScheme);


