"use strict";

const runtime = require('./runtime');
const debugLog = require('./debug');
const devicePrefix = require('./device');

function set(customTheme, comps = {}) {
  if (runtime.ready) return runtime.theme;
  debugLog('Actheme', 'set');
  customTheme = customTheme || { color: {} };
  runtime.Comps = comps;

  const color = Object.assign({}, runtime.defaultTheme.color, customTheme.color);
  const theme = Object.assign({}, runtime.defaultTheme, customTheme, { color });

  if (theme.alphas) {
    theme.color = setAlphedColors(theme);
  }
  if (theme.scale) {
    theme.size = setScaledSizes(theme);
  }

  theme.value = themeValue;
  theme.device = devicePrefix;

  runtime.theme = theme;
  runtime.ready = true;
  return theme;
}

function setAlphedColors(theme) {
  return Object.keys(theme.color).reduce((obj, name) => {
    const color = theme.color[name];
    obj[name] = color || '';
    if (color && color.includes('rgba') && color.includes('1)')) {
      Object.keys(theme.alphas).forEach((key) => {
        obj[name + key] = color.replace('1)', theme.alphas[key] + ')');
      });
    }
    return obj;
  }, {});
}

function setScaledSizes(theme) {
  const values = Array.from({ length: 200 }, (_, i) => i + 1);
  return values.reduce((obj, n) => {
    obj['s' + n] = n * theme.scale;
    obj['s' + (n + 0.25)] = (n + 0.25) * theme.scale;
    obj['s' + (n + 0.5)] = (n + 0.5) * theme.scale;
    obj['s' + (n + 0.75)] = (n + 0.75) * theme.scale;
    return obj;
  }, {
    's0.25': theme.scale * 0.25,
    's0.5': theme.scale * 0.75
  });
}

function themeValue(value, prop, scale = 4) {
  if (/^-?s\d*\.?\d{1,2}$/.test(value)) {
    const size = runtime.theme.size && (value && value.includes('-')
      ? runtime.theme.size[value.replace('-', '')] * -1
      : runtime.theme.size[value]);
    return !size ? Number(value.replace('s', '')) * (scale || runtime.theme.scale) : size;
  }

  const lowerProp = prop ? prop.toLowerCase() : '';
  const themeKey = lowerProp.includes('color') ? 'color' : prop;
  const themeValues = runtime.theme[prop] || runtime.theme[themeKey];
  return themeValues && themeValues[value] || value;
}

module.exports = {
  set,
  setAlphedColors,
  setScaledSizes,
  themeValue
};
