const getSchemeBtn = document.getElementById('get-scheme-btn');
const randomBtn = document.getElementById('random-btn');
const colorInput = document.getElementById('seed-color-input');
const modeSelector = document.getElementById('mode-selector');
const colorPalette = document.getElementById('color-palette');
const copyNotification = document.getElementById('copy-notification');

const API_URL = 'https://www.thecolorapi.com/scheme';
let copyTimeout;

async function fetchAndRenderColorScheme() {
    const seedColor = colorInput.value.substring(1);
    const mode = modeSelector.value;
    const count = 5;

    // showLoadingState();
    // updateUrl(seedColor, mode);

    try {
        const response = await fetch(`${API_URL}?hex=${seedColor}&mode=${mode}&count=${count}`);
        if (!response.ok) {
            throw new Error(`Network error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        renderColorScheme(data.colors);

    }   catch (error) {
        console.error("Failed to fetch color scheme:", error);
        // renderErrorState(error.message);
    }
};
fetchAndRenderColorScheme();

function renderColorScheme(colors) {

    const colorColumns = colors.map(color => {
        const hex = color.hex.value;
        const rgb = color.rgb.value;
        const hsl = color.hsl.value;

        return `
            <div class="color-column" data-hex="${hex}">
                <div class="color=swatch" style="background-color: ${hex};"></div>
                <div class="color-info">
                    <p class="hex-code">${hex}</p>
                    <div>
                        <p>${rgb}</p>
                        <p>${hsl}</p>
                    </div>
                </div>
            </div>`;
    }).join('');
    
    colorPalette.innerHTML = colorColumns;
}






