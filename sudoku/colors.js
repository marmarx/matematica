export default function getRandomHslColor() {
  const h = Math.floor(Math.random() * 360); // Hue: 0-360
  const s = Math.floor(Math.random() * 50) + 30; // Saturation: 30-80
  const l = Math.floor(Math.random() * 40) + 30; // Lightness: 30-70

  document.documentElement.style.setProperty('--button', `hsl(${h}, ${s}%, ${l+5}%)`)
  document.documentElement.style.setProperty('--button-hover', `hsl(${h}, ${s}%, ${l-5}%)`)
}