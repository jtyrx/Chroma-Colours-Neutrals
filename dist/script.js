let hue = 200;
let saturation = 0.2;
let sMod = 70;

// Initialize sliders and update the palette on change.
noUiSlider.create(document.getElementById('hue'), {
  start: hue,
  connect: 'lower',
  step: 1,
  tooltips: true,
  range: { min: 0, max: 360 }
}).on('update', (values) => {
  hue = parseFloat(values[0]);
  previewPalette();
});

noUiSlider.create(document.getElementById('saturation'), {
  start: saturation,
  connect: 'lower',
  step: 0.01,
  tooltips: true,
  range: { min: 0, max: 1 }
}).on('update', (values) => {
  saturation = parseFloat(values[0]);
  previewPalette();
});

noUiSlider.create(document.getElementById('sMod'), {
  start: sMod,
  connect: 'lower',
  step: 1,
  tooltips: {
    to: (value) => {
      const v = 0 - Math.pow(50, 2) / value;
      return Math.round(v) + '%';
    }
  },
  range: { min: 25, '80%': [200, 100], max: [2500] }
}).on('update', (values) => {
  sMod = parseFloat(values[0]);
  previewPalette();
});

// Compute a saturation modifier based on the current sMod and lightness index.
function getSaturation2(l) {
  const o = 50;
  const p = sMod;
  return 1 + (Math.pow(l - o, 2) / p - Math.pow(o, 2) / p) / 100;
}

// Generate a neutral palette (reversed so index 0 is lightest).
function generateNeutrals({
  hue = 200,
  saturation = 0.1,
  min = 0.04,
  max = 1.01,
  distance = 0.01
} = {}) {
  const colors = [];
  let value = min;
  let step = 0;
  while (value < max) {
    const idx = parseInt(value * 100);
    const sK = getSaturation2(idx);
    const color = chroma.hsl(hue, saturation * sK, value).css('hsl');
    colors.push(color);
    step += 1;
    value = step * distance + min;
  }
  return colors.reverse();
}

// Format HSL for display.
function roundTwoDigits(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
function outputHSL(color) {
  const [h, s, l] = chroma(color).hsl();
  return `${Math.round(h)||0}deg ${Math.round(roundTwoDigits(s) * 100)}% ${Math.round(roundTwoDigits(l) * 100)}%`;
}

// Format OKLCH for display.
function outputOKLCH(color) {
  const [L, C, H] = chroma(color).oklch();  // returns [L, C, H] [oai_citation:2‡gka.github.io](https://gka.github.io/chroma.js/#:~:text=Returns%20a%20CSS%20string%20representation,color%20definition) [oai_citation:3‡gka.github.io](https://gka.github.io/chroma.js/#:~:text=color)
  const light = Math.round(L * 10000) / 100;
  const chromaVal = Math.round(C * 100) / 100;
  const hueVal = Math.round(H || 0);
  return `${light}% ${chromaVal} ${hueVal}deg`;
}

// Build markup for the full palette (HSL + OKLCH).
function getPaletteHTML(colors) {
  return colors.map((c, i) => {
    const textColor = chroma.contrast('white', c) < 2.9 ? '#1d1d1d' : '#FFF';
    return `
      <div class="color-box" style="background:${c}; color:${textColor}">
        <div class="row"><b>grey-${100 - i}</b></div>
        <div class="row"><span>hsl</span><span>${outputHSL(c)}</span></div>
        <div class="row"><span>oklch</span><span>${outputOKLCH(c)}</span></div>
      </div>
    `;
  }).join('');
}

// Build a mini preview.
function getMiniPaletteHTML(colors) {
  return colors.map((c, i) => `
    <div class="color-box" style="background:${c};" title="grey-${i}"></div>
  `).join('');
}

// Grey values to include in the filtered palette.
const showValues = [100, 99, 97, 95, 92, 90, 85, 80, 75, 70, 65, 60,
                    50, 45, 40, 35, 30, 25, 20, 15, 10, 7, 5, 0];

// Filter the palette to only the specified grey steps.
function getSelectedPaletteHTML(colors, values = showValues) {
  return colors.map((c, i) => {
    const greyValue = 100 - i;
    if (!values.includes(greyValue)) return '';
    const textColor = chroma.contrast('white', c) < 2.9 ? '#1d1d1d' : '#FFF';
    return `
      <div class="color-box" style="background:${c}; color:${textColor}">
        <div class="row"><b>grey-${greyValue}</b></div>
        <div class="row"><span>hsl</span><span>${outputHSL(c)}</span></div>
        <div class="row"><span>oklch</span><span>${outputOKLCH(c)}</span></div>
      </div>
    `;
  }).join('');
}

// Render the palettes (full, mini, and filtered).
function previewPalette() {
  const palette = generateNeutrals({
    hue: hue,
    distance: 0.01,
    max: 1.01,
    min: 0.03,
    saturation: saturation
  });
  document.getElementById('preview').innerHTML = getPaletteHTML(palette);
  document.getElementById('miniPreview').innerHTML = getMiniPaletteHTML(palette);
  document.getElementById('selectedSwatches').innerHTML = getSelectedPaletteHTML(palette);
}

// Initial render.
previewPalette();