"use strict";

const runtime = require('./runtime');
const debugLog = require('./debug');
const devicePrefix = require('./device');
const { RN } = require('./environment');
const styleProps = require('../styleProps');
const styleValues = require('../styleValues');
const { themeValue } = require('./themeManager');

function fustyle(obj, units) {
  if (obj === '' || !obj) return {};

  let classes;
  switch (typeof obj) {
    case 'string':
      classes = obj.split(' ');
      break;
    case 'object':
      classes = Object.entries(obj).reduce((arr, [key, show]) => {
        return show && key.length ? arr.concat(key.split(' ')) : arr;
      }, []);
      break;
    default:
      debugLog('Actheme', 'incorrect fustyle type', typeof obj);
      return {};
  }

  const styles = classes.reduce((acc, item) => {
    const [props, value] = item.split(':');
    let resolvedValue = value;
    let targetProps = props;
    let prefix;

    if (targetProps && targetProps.includes('@')) {
      const prefixProps = targetProps.split('@');
      prefix = prefixProps.shift();
      if (!devicePrefix(prefix)) return acc;
      targetProps = prefixProps.shift();
    }

    if (!targetProps) return acc;

    targetProps.split(',').forEach((prop) => {
      const mappedProp = styleProps[prop] || prop;
      let mappedValue = styleValues[resolvedValue] || resolvedValue;

      if (typeof mappedValue === 'string' && mappedValue.includes('_')) {
        mappedValue = mappedValue.replace(/\_/g, ' ');
      }

      acc[mappedProp] = isNaN(mappedValue) && mappedProp !== 'fb'
        ? themeValue(mappedValue, mappedProp)
        : parseFloat(mappedValue);

      if (units && /^[0-9]+$/.test(String(acc[mappedProp]))) {
        acc[mappedProp] = acc[mappedProp] + units;
      }
    });
    return acc;
  }, {});

  return styles;
}

function getProps(item) {
  switch (typeof item) {
    case 'function':
      return { comp: item };
    case 'string':
      if (!item.includes(':')) return { type: item };
      const compType = item.includes('ff') || item.includes('fs') || item.includes('fb') ? 'Text' : 'View';
      return { style: item, type: compType };
    case 'object':
      if (!Array.isArray(item)) {
        return item && item.$$typeof ? { comp: item } : { dys: item, type: 'View' };
      }
      let isDys;
      let extra;
      const [comp, style, dys] = item;
      let localStyle = style;
      isDys = typeof localStyle === 'object' && !Array.isArray(localStyle);

      if (Array.isArray(localStyle)) {
        extra = localStyle[1] || localStyle[0];
        localStyle = localStyle[1] ? localStyle[0] : null;
      }

      switch (typeof comp) {
        case 'string': {
          const animated = comp.includes('Animated');
          const refered = comp.includes('Ref');
          const type = comp.replace('Animated', '').replace('Ref', '');
          return {
            type,
            animated,
            refered,
            style: !isDys && localStyle,
            dys: (isDys && localStyle) || dys,
            extra,
            custom: runtime.Comps && runtime.Comps[comp]
          };
        }
        case 'function':
          return {
            comp,
            style: !isDys && localStyle,
            dys: (isDys && localStyle) || dys,
            extra,
            custom: true
          };
        default:
          break;
      }
      break;
    default:
      break;
  }
  debugLog('Actheme', 'incorrect item', item);
  return { type: 'View' };
}

function getStyles(rules) {
  const dynamics = {};
  const extras = {};

  const styles = RN.StyleSheet.create(Object.keys(rules).reduce((obj, key) => {
    const { style, dys } = getProps(rules[key]);

    if (dys) {
      dynamics[key] = RN.StyleSheet.create(Object.keys(dys).reduce((dy, prop) => {
        const value = dys[prop];
        switch (typeof value) {
          case 'string':
            return Object.assign(dy, { [prop]: fustyle(value) });
          case 'object': {
            const [stl, props] = value;
            let localProps = props;
            let localStyle = stl;

            if (!localProps) {
              localProps = localStyle;
              localStyle = null;
            }

            extras[key] = Object.assign(extras[key] || {}, { [prop]: localProps });
            return localStyle ? Object.assign(dy, { [prop]: fustyle(localStyle) }) : dy;
          }
          default:
            return dy;
        }
      }, {}));
    }

    return style ? Object.assign(obj, { [key]: fustyle(style) }) : obj;
  }, {}));

  return {
    styles,
    dynamics: Object.keys(dynamics).length ? dynamics : undefined,
    extras: Object.keys(extras).length ? extras : undefined
  };
}

function getStyledProps(props, styles, extra, key, dys, dynamics, extras, custom) {
  let style = styles[key];
  const exProps = Object.assign({}, extra || {});

  if (dys) {
    const activeProps = Object.keys(Object.assign({}, exProps, props)).filter((prop) => {
      return !['children'].includes(prop) && !prop.includes('style') && (Boolean(props[prop]) || Boolean(exProps[prop]));
    });

    style = [style, activeProps.slice().map((prop) => dynamics && dynamics[key] && dynamics[key][prop])];

    if (extras && extras[key]) {
      activeProps.reduce((obj, prop) => Object.assign(obj, extras[key][prop]), exProps);
    }
  }

  if (props.fustyle || props.actstyle || props.style || exProps.style) {
    style = [
      style,
      (props.fustyle || props.actstyle) && fustyle(props.fustyle || props.actstyle),
      exProps.style,
      props.style
    ];
  }

  return Object.assign({}, exProps, {
    style: custom ? RN.StyleSheet.flatten(style) : style
  });
}

module.exports = {
  fustyle,
  getProps,
  getStyles,
  getStyledProps
};
