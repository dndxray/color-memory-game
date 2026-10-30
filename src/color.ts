export type ColorHSB = {
  hue: number;     
  saturation: number; 
  brightness: number; 
};

export type ColorRGB = { r: number; g: number; b: number }; 

// batas min dan max
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toByte(value: number): number {
  return Math.round(clamp(value * 255, 0, 255));
}
function toHexByte(value: number): string {
  return Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0');
}

export function hsbToRgb(c: ColorHSB): ColorRGB {
  const hue = ((c.hue % 360) + 360) % 360;
  const s = clamp(c.saturation, 0, 100) / 100;
  const v = clamp(c.brightness, 0, 100) / 100;
  const chroma = v * s;
  const sector = hue / 60;
  const x = chroma * (1 - Math.abs((sector % 2) - 1));
  const m = v - chroma;

  let r = 0;
  let g = 0;
  let b = 0;

  // rumus sesuai posisi hue ada di bagian ke berapa
  if (sector < 1) {
    r = chroma;
    g = x;
  } 
  else if (sector < 2) {
    r = x;
    g = chroma;
  } 
  else if (sector < 3) {
    g = chroma;
    b = x;
  } 
  else if (sector < 4) {
    g = x;
    b = chroma;
  } 
  else if (sector < 5) {
    r = x;
    b = chroma;
  } 
  else {
    r = chroma;
    b = x;
  }
  return { 
    r: toByte(r + m), g: toByte(g + m), b: toByte(b + m) 
  };
}

//ubah RGB jadi string hex
export function rgbToHex(c: ColorRGB): string {
  return `#${toHexByte(c.r)}${toHexByte(c.g)}${toHexByte(c.b)}`;
}

export function hsbToHex(c: ColorHSB): string {
  return rgbToHex(hsbToRgb(c));
}