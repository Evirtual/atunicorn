"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Comp = Comp;
exports.create = create;
exports.devicePrefix = devicePrefix;
exports.dims = dims;
exports.fustyle = fustyle;
exports.mediaListiner = mediaListiner;
exports.set = set;
exports.setAlphedColors = setAlphedColors;
exports.setScaledSizes = setScaledSizes;
exports.state = state;
exports.themeValue = themeValue;
var _excluded = ["type", "comp", "dys", "animated", "refered", "extra", "custom"];

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return arr; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require('react');

var RN = function () {
  try {
    return require('react-native');
  } catch (error) {
    try {
      return eval('require("react-native-web")');
    } catch (err) {
      return eval('require("rnwc")');
    }
  }
}();

var styleProps = require('../styleProps');

var styleValues = require('../styleValues');

var defaultTheme = require('../theme');

var theme = defaultTheme,
    Comps = {},
    ready,
    created,
    screen,
    subscriptions = [],
    classes = {};

var debugLog = function debugLog() {
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_ACTHEME_DEBUG === 'true') {
    // Only emit logs when explicit debugging is enabled.
    console.log.apply(console, arguments);
  }
};
module.exports = {
  create: create,
  Comp: Comp,
  fustyle: fustyle,
  set: set,
  themeValue: themeValue,
  devicePrefix: devicePrefix,
  value: themeValue,
  device: devicePrefix,
  style: fustyle,
  dims: dims,
  state: state,
  media: useMedia,
  useMedia: useMedia,
  mediaRules: mediaRules
};

function set(customTheme) {
  var comps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (ready) return;
  debugLog('Actheme', 'set');
  customTheme = customTheme || {
    color: {}
  };
  Comps = comps;

  var color = _objectSpread(_objectSpread({}, defaultTheme.color), customTheme.color);

  theme = _objectSpread(_objectSpread(_objectSpread({}, defaultTheme), customTheme), {}, {
    color: color
  });
  if (theme.alphas) theme.color = setAlphedColors(theme);
  if (theme.scale) theme.size = setScaledSizes(theme);
  theme.value = themeValue;
  theme.device = devicePrefix;
  ready = true;
  return theme;
} // Medias


function useMedia() {
  var _React$useState = React.useState(screen),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      media = _React$useState2[0],
      setMedia = _React$useState2[1];

  var mediaKeys = Object.keys(theme.medias);
  React.useEffect(function () {
    var componentId = Date.now() + Math.random();
    subscriptions.push({
      componentId: componentId,
      setMedia: setMedia
    });
    !screen && !!subscriptions.length && onLayout() && mediaListiner(true);
    return function () {
      subscriptions = subscriptions.filter(function (sub) {
        return sub.componentId !== componentId;
      });
    };
  }, []);
  return mediaKeys.reduce(function (obj, key, index) {
    return theme.medias[key] <= theme.medias[screen] ? _objectSpread(_objectSpread({}, obj), {}, _defineProperty({}, key, true)) : obj;
  }, {});
}

function dims(key) {
  var dimensions = RN.Dimensions.get('window');
  if (!key) return dimensions;
  if (['height', 'width', 'scale'].includes(key)) return dimensions[key];

  if (['oriantation', 'portrait', 'landscape'].includes(key)) {
    var oriantation = dimensions.width > dimensions.height ? 'landscape' : 'portrait';
    if (['portrait', 'landscape'].includes(key)) return key === oriantation;
    return oriantation;
  }

  var index = Object.values(theme.medias).findIndex(function (item, i) {
    return dimensions.width < item;
  }) - 1;
  return !~index ? 'basic' : index < -1 ? Object.keys(theme.medias).pop() : Object.keys(theme.medias)[index];
}

function onLayout() {
  var media = dims('media');
  if (media === screen) return;
  screen = media;
  subscriptions.length && subscriptions.forEach(function (_ref) {
    var setMedia = _ref.setMedia;
    return setMedia(media);
  });
  debugLog('Actheme media', media, dims('oriantation'));
  return media;
}

function mediaListiner(listen) {
  return !listen ? RN.Dimensions.removeEventListener('change', onLayout) : (RN.Dimensions.removeEventListener('change', onLayout), RN.Dimensions.addEventListener('change', onLayout));
}

function setAlphedColors(theme) {
  return Object.keys(theme.color).reduce(function (obj, name) {
    var color = theme.color[name];
    obj[name] = color || '';
    if (color.includes('rgba') && color.includes('1)')) Object.keys(theme.alphas).forEach(function (key) {
      obj[name + key] = color.replace('1)', theme.alphas[key] + ')');
    });
    return obj;
  }, {});
}

function setScaledSizes(theme) {
  var _toConsumableArray$ma;

  return _toConsumableArray(Array(200)).map(function (n, i) {
    return i + 1;
  }).reduce(function (obj, n) {
    var _Object$assign;

    return Object.assign(obj, (_Object$assign = {}, _defineProperty(_Object$assign, 's' + n, n * theme.scale), _defineProperty(_Object$assign, 's' + (n + 0.25), (n + 0.25) * theme.scale), _defineProperty(_Object$assign, 's' + (n + 0.5), (n + 0.5) * theme.scale), _defineProperty(_Object$assign, 's' + (n + 0.75), (n + 0.75) * theme.scale), _Object$assign));
  }, (_toConsumableArray$ma = {}, _defineProperty(_toConsumableArray$ma, 's0.25', theme.scale * 0.25), _defineProperty(_toConsumableArray$ma, 's0.5', theme.scale * 0.5), _defineProperty(_toConsumableArray$ma, 's0.5', theme.scale * 0.75), _toConsumableArray$ma));
}

function create(comps, compType) {
  if (!created) {
    created = true;
    debugLog('Actheme create', 'ready', ready);
  } // Creates StyleSheet


  var _getStyles = getStyles(comps),
      styles = _getStyles.styles,
      dynamics = _getStyles.dynamics,
      extras = _getStyles.extras; // console.log({ styles, dynamics, extras })
  // Creates Elements


  return Object.keys(comps).reduce(function (obj, key) {
    var _getProps = getProps(comps[key], 'comp'),
        type = _getProps.type,
        comp = _getProps.comp,
        dys = _getProps.dys,
        animated = _getProps.animated,
        refered = _getProps.refered,
        extra = _getProps.extra,
        custom = _getProps.custom,
        compProps = _objectWithoutProperties(_getProps, _excluded); // Sets Node
    // console.log({ type, comp, dys, animated, refered, extra, compProps })


    var Node = type ? animated ? RN['Animated'][type] : Comp(type) : comp;

    if (!Object.keys(compProps).length && !dys) {
      obj[key] = type ? Node : comp;
      return obj;
    }

    var mediaKeys = dys && Object.keys(dys).filter(function (key) {
      return Object.keys(theme.medias).reduce(function (arr, media) {
        return arr.concat([media, media + 'x']);
      }, []).includes(key);
    }) || []; // Stores Element to the object with styling

    obj[key] = refered ? React.forwardRef(function (props, ref) {
      return /*#__PURE__*/React.createElement(Node, _extends({
        ref: ref
      }, props, getStyledProps(props, styles, extra, key, dys, dynamics, extras, custom)));
    }) : !mediaKeys.length ? function (props) {
      return /*#__PURE__*/React.createElement(Node, _extends({}, props, getStyledProps(props, styles, extra, key, dys, dynamics, extras, custom)));
    } : function (props) {
      var mediaList = useMedia();
      var rest = getStyledProps(props, styles, _objectSpread(_objectSpread({}, extra), mediaList), key, dys, dynamics, extras, custom);
      var mediaData = getMediaData(mediaKeys, dys);
      return /*#__PURE__*/React.createElement(Node, _extends({}, props, rest, {
        dataSet: _objectSpread(_objectSpread({}, mediaData), props.dataSet || {})
      }));
    };
    return obj;
  }, {});
} // Returns media mediaData and sets rule to classes global object


function getMediaData(mediaKeys, dys) {
  return devicePrefix('web') && mediaKeys.reduce(function (obj, key) {
    if (Array.isArray(dys[key])) return;
    var rules = fustyle(dys[key], 'px');
    var name = dys[key].replace(/\W/g, '');
    if (!classes[key]) classes[key] = {};
    if (!classes[key][name]) classes[key][name] = Object.keys(rules).map(function (prop) {
      return "".concat(getCssProp(prop), ": ").concat(rules[prop], ";");
    }).join(' ');
    return _objectSpread(_objectSpread({}, obj), {}, _defineProperty({}, 'media-' + key, name));
  }, {});
}

function getCssProp(prop) {
  return prop.split('').reduce(function (str, letter) {
    return str + (/[A-Z]/.test(letter) ? '-' + letter.toLowerCase() : letter);
  }, '');
}

function mediaRules() {
  return Object.keys(classes).map(function (media) {
    var rule = media.charAt(2) === 'x' ? "max-width: ".concat(theme.medias[media.slice(0, -1)] - 1, "px") : "min-width: ".concat(theme.medias[media], "px");
    return ["@media only screen and (".concat(rule, ") {\n"), Object.keys(classes[media]).reduce(function (str, name) {
      return str + "\n[data-media-".concat(media, "*=\"").concat(name.replace('.', '\\.'), "\"] { ").concat(classes[media][name], " }");
    }, ''), "\n}"].join('');
  }).join('\n');
} // Returns modified styles and props


function getStyledProps(props, styles, extra, key, dys, dynamics, extras, custom) {
  var style = styles[key];

  var exProps = _objectSpread({}, extra || {}); // Sets dynamic styling and properties


  if (dys) {
    var activeProps = Object.keys(_objectSpread(_objectSpread({}, exProps), props)).filter(function (prop) {
      return !['children'].includes(prop) && !prop.includes('style') && (Boolean(props[prop]) || Boolean(exProps[prop]));
    });
    style = [style, activeProps.slice().map(function (prop) {
      return dynamics[key][prop];
    })]; //RN.StyleSheet.flatten()

    extras[key] && activeProps.reduce(function (obj, prop) {
      return Object.assign(obj, extras[key][prop]);
    }, exProps);
  } // Sets fustyle and style


  if (props.fustyle || props.actstyle || props.style || exProps.style) {
    style = [style, (props.fustyle || props.actstyle) && fustyle(props.fustyle || props.actstyle), exProps.style, props.style]; //RN.StyleSheet.flatten()
  }

  return _objectSpread(_objectSpread({}, exProps), {}, {
    style: custom ? RN.StyleSheet.flatten(style) : style
  });
} // Creates Stylesheets for static and dynamic styles


function getStyles(rules) {
  var dynamics = {};
  var extras = {};
  var styles = RN.StyleSheet.create(Object.keys(rules).reduce(function (obj, key) {
    var _getProps2 = getProps(rules[key]),
        style = _getProps2.style,
        dys = _getProps2.dys;

    if (dys) {
      dynamics[key] = RN.StyleSheet.create(Object.keys(dys).reduce(function (dy, prop) {
        var value = dys[prop];

        switch (_typeof(value)) {
          case 'string':
            return Object.assign(dy, _defineProperty({}, prop, fustyle(value)));

          case 'object':
            var _value = _slicedToArray(value, 2),
                stl = _value[0],
                props = _value[1];

            if (!props) {
              props = stl;
              stl = null;
            }

            extras[key] = Object.assign(extras[key] || {}, _defineProperty({}, prop, props));
            return stl ? Object.assign(dy, _defineProperty({}, prop, fustyle(stl))) : dy;
        }
      }, {}));
    }

    return style ? Object.assign(obj, _defineProperty({}, key, fustyle(style))) : obj;
  }, {}));
  return {
    styles: styles,
    dynamics: !!Object.keys(dynamics).length && dynamics,
    extras: !!Object.keys(extras).length && extras
  };
} // Extracts props from passed themed item arguments


function getProps(item) {
  switch (_typeof(item)) {
    case 'function':
      return {
        comp: item
      };

    case 'string':
      if (!item.includes(':')) return {
        type: item
      };
      var compType = item.includes('ff') || item.includes('fs') || item.includes('fb') ? 'Text' : 'View';
      return {
        style: item,
        type: compType
      };

    case 'object':
      if (!Array.isArray(item)) return item.$$typeof ? {
        comp: item
      } : {
        dys: item,
        type: 'View'
      };
      var isDys;
      var extra;

      var _item = _slicedToArray(item, 3),
          comp = _item[0],
          style = _item[1],
          dys = _item[2];

      isDys = _typeof(style) === 'object' && !Array.isArray(style);

      if (Array.isArray(style)) {
        extra = style[1] || style[0];
        style = style[1] ? style[0] : null;
      }

      switch (_typeof(comp)) {
        case 'string':
          var animated = comp.includes('Animated');
          var refered = comp.includes('Ref');
          var type = comp.replace('Animated', '').replace('Ref', '');
          return {
            type: type,
            animated: animated,
            refered: refered,
            style: !isDys && style,
            dys: isDys && style || dys,
            extra: extra,
            custom: Comps && Comps[comp]
          };

        case 'function':
          return {
            comp: comp,
            style: !isDys && style,
            dys: isDys && style || dys,
            extra: extra,
            custom: true
          };
      }

    default:
  debugLog('Actheme', 'incorrect item', item);
      return {
        type: 'View'
      };
  }
}

function Comp(name) {
  var alt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'View';
  return Comps && Comps[name] || RN[name] || RN[alt];
}

function fustyle(obj, units) {
  if (obj === '' || !obj) return {};
  var classes;

  switch (_typeof(obj)) {
    case 'string':
      classes = obj.split(' ');
      break;

    case 'object':
      classes = Object.entries(obj).reduce(function (arr, _ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            key = _ref3[0],
            show = _ref3[1];

        return show && key.length ? arr.concat(key.split(' ')) : arr;
      }, []);
      break;

    default:
  debugLog('Actheme', 'incorrect fustyle type', _typeof(obj));
      return {};
  }

  var styles = classes.reduce(function (obj, item) {
    var _item$split = item.split(':'),
        _item$split2 = _slicedToArray(_item$split, 2),
        props = _item$split2[0],
        value = _item$split2[1];

    var prefix;

    if (!!props.includes('@')) {
      var prefixProps = props.split('@');
      prefix = prefixProps.shift();
      if (!devicePrefix(prefix)) return obj;
      props = prefixProps.shift();
    }

    props && props.split(',').map(function (prop) {
      prop = styleProps[prop] || prop;
      value = styleValues[value] || value;

      if (typeof value === 'string' && value.includes('_')) {
        value = value.replace(/\_/g, ' ');
      }

      obj[prop] = isNaN(value) && prop !== 'fb' ? themeValue(value, prop) : parseFloat(value);
      if (units && /^[0-9]+$/.test(obj[prop])) obj[prop] = obj[prop] + units;
      return prop;
    });
    return obj;
  }, {});
  return styles;
} // finds theme value


function themeValue(value, prop) {
  var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  if (/^-?s\d*\.?\d{1,2}$/.test(value)) {
    var size = theme.size && (value && value.includes('-') ? theme.size[value.replace('-', '')] * -1 : theme.size[value]);
    return !size ? Number(value.replace('s', '')) * (scale || theme.scale) : size;
  }

  var lowerProp = prop.toLowerCase() || '';
  var themeKey = lowerProp.includes('color') ? 'color' : prop;
  var themeValues = theme[prop] || theme[themeKey];
  return themeValues && themeValues[value] || value;
} // Device prefix


function devicePrefix(value) {
  var _RN$Dimensions$get = RN.Dimensions.get('window'),
      height = _RN$Dimensions$get.height,
      width = _RN$Dimensions$get.width;

  var _RN$Platform = RN.Platform,
      OS = _RN$Platform.OS,
      isPad = _RN$Platform.isPad,
      isTVOS = _RN$Platform.isTVOS;
  var device = getDevicePrefix();
  var first = value && value.charAt(0);
  return first ? first === device || first === 'i' && device === 'x' : device;

  function getDevicePrefix() {
    if (OS === 'ios' && !isPad && !isTVOS && (height === 812 || width === 812 || height === 896 || width === 896)) return 'x'; // if(DeviceInfo.hasNotch()) return 'n'

    if (OS === 'web') return 'w';
    if (OS === 'ios') return 'i';
    if (OS === 'android') return 'a';
    return;
  }
}

function state() {
  var initial = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var store = initial;
  return [store, useState];

  function useState(value, name) {
    var state = React.useState(value);
    if (!name) return state;
    var title = name.charAt(0).toUpperCase() + name.slice(1);

    store['get' + title] = function () {
      return state[0];
    };

    store['set' + title] = state[1];
    return state;
  }
}