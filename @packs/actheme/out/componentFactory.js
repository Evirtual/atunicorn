"use strict";

const { React, RN } = require('./environment');
const runtime = require('./runtime');
const debugLog = require('./debug');
const { getProps, getStyles, getStyledProps } = require('./styles');
const { useMedia, getMediaData } = require('./media');

function create(comps) {
  if (!runtime.created) {
    runtime.created = true;
    debugLog('Actheme create', 'ready', runtime.ready);
  }

  const themeMedias = runtime.theme.medias || {};
  const { styles, dynamics, extras } = getStyles(comps);

  return Object.keys(comps).reduce((obj, key) => {
    const { type, comp, dys, animated, refered, extra, custom, ...compProps } = getProps(comps[key], 'comp');
    const Node = type ? (animated ? RN.Animated[type] : Comp(type)) : comp;

    if (!Object.keys(compProps).length && !dys) {
      obj[key] = type ? Node : comp;
      return obj;
    }

    const mediaKeys = dys
      ? Object.keys(dys).filter((mediaKey) => {
          const mediaNames = Object.keys(themeMedias).reduce((arr, media) => {
            arr.push(media, media + 'x');
            return arr;
          }, []);
          return mediaNames.includes(mediaKey);
        })
      : [];

    if (refered) {
      obj[key] = React.forwardRef((props, ref) => React.createElement(
        Node,
        Object.assign({ ref }, props, getStyledProps(props, styles, extra, key, dys, dynamics, extras, custom))
      ));
      return obj;
    }

    if (!mediaKeys.length) {
      obj[key] = (props) => React.createElement(
        Node,
        Object.assign({}, props, getStyledProps(props, styles, extra, key, dys, dynamics, extras, custom))
      );
      return obj;
    }

    obj[key] = (props) => {
      const mediaList = useMedia();
      const rest = getStyledProps(props, styles, Object.assign({}, extra, mediaList), key, dys, dynamics, extras, custom);
      const mediaData = getMediaData(mediaKeys, dys);
      return React.createElement(
        Node,
        Object.assign({}, props, rest, {
          dataSet: Object.assign({}, mediaData, props.dataSet || {})
        })
      );
    };

    return obj;
  }, {});
}

function Comp(name, alt = 'View') {
  return (runtime.Comps && runtime.Comps[name]) || RN[name] || RN[alt];
}

module.exports = {
  create,
  Comp
};
