"use strict";

const { React, RN } = require('./environment');
const runtime = require('./runtime');
const debugLog = require('./debug');
const devicePrefix = require('./device');
const { fustyle } = require('./styles');

function useMedia() {
  const [, setMedia] = React.useState(runtime.screen);
  const medias = runtime.theme.medias || {};
  const mediaKeys = Object.keys(medias);

  React.useEffect(() => {
    const componentId = Date.now() + Math.random();
    runtime.subscriptions.push({ componentId, setMedia });

    if (!runtime.screen && runtime.subscriptions.length) {
      onLayout();
      mediaListiner(true);
    }

    return () => {
      runtime.subscriptions = runtime.subscriptions.filter((sub) => sub.componentId !== componentId);
    };
  }, []);

  return mediaKeys.reduce((obj, key) => {
    const current = medias[runtime.screen];
    return current !== undefined && medias[key] <= current
      ? Object.assign(obj, { [key]: true })
      : obj;
  }, {});
}

function dims(key) {
  const dimensions = RN.Dimensions.get('window');
  if (!key) return dimensions;
  if (['height', 'width', 'scale'].includes(key)) return dimensions[key];

  if (['oriantation', 'portrait', 'landscape'].includes(key)) {
    const oriantation = dimensions.width > dimensions.height ? 'landscape' : 'portrait';
    if (['portrait', 'landscape'].includes(key)) return key === oriantation;
    return oriantation;
  }

  const medias = runtime.theme.medias || {};
  const mediaValues = Object.values(medias);
  const mediaKeys = Object.keys(medias);
  const index = mediaValues.findIndex((item) => dimensions.width < item) - 1;

  if (index === -1) return 'basic';
  if (index < -1) return mediaKeys[mediaKeys.length - 1];
  return mediaKeys[index];
}

function onLayout() {
  const media = dims('media');
  if (media === runtime.screen) return media;
  runtime.screen = media;
  if (runtime.subscriptions.length) {
    runtime.subscriptions.forEach(({ setMedia }) => setMedia(media));
  }
  debugLog('Actheme media', media, dims('oriantation'));
  return media;
}

function mediaListiner(listen) {
  if (!listen) {
    RN.Dimensions.removeEventListener('change', onLayout);
    return false;
  }
  RN.Dimensions.removeEventListener('change', onLayout);
  RN.Dimensions.addEventListener('change', onLayout);
  return true;
}

function getMediaData(mediaKeys, dys) {
  if (!devicePrefix('web')) return {};
  return mediaKeys.reduce((obj, key) => {
    if (Array.isArray(dys[key])) return obj;
    const rules = fustyle(dys[key], 'px');
    const name = dys[key].replace(/\W/g, '');
    if (!runtime.classes[key]) runtime.classes[key] = {};
    if (!runtime.classes[key][name]) {
      runtime.classes[key][name] = Object.keys(rules)
        .map((prop) => `${getCssProp(prop)}: ${rules[prop]};`)
        .join(' ');
    }
    return Object.assign({}, obj, { ['media-' + key]: name });
  }, {});
}

function getCssProp(prop) {
  return prop.split('').reduce((str, letter) => {
    return str + (/[A-Z]/.test(letter) ? '-' + letter.toLowerCase() : letter);
  }, '');
}

function mediaRules() {
  const medias = runtime.theme.medias || {};
  return Object.keys(runtime.classes).map((media) => {
    const rule = media.charAt(2) === 'x'
      ? `max-width: ${medias[media.slice(0, -1)] - 1}px`
      : `min-width: ${medias[media]}px`;
    const selectors = Object.keys(runtime.classes[media]).reduce((str, name) => {
      return str + `\n[data-media-${media}*="${name.replace('.', '\\.')}"] { ${runtime.classes[media][name]} }`;
    }, '');
    return `@media only screen and (${rule}) {\n${selectors}\n}`;
  }).join('\n');
}

module.exports = {
  dims,
  useMedia,
  mediaListiner,
  mediaRules,
  getMediaData
};
