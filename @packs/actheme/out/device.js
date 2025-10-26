"use strict";

const { RN } = require('./environment');

function devicePrefix(value) {
  const { height, width } = RN.Dimensions.get('window');
  const { OS, isPad, isTVOS } = RN.Platform;
  const device = getDevicePrefix();
  const first = value && value.charAt(0);
  return first ? first === device || (first === 'i' && device === 'x') : device;

  function getDevicePrefix() {
    if (OS === 'ios' && !isPad && !isTVOS && (height === 812 || width === 812 || height === 896 || width === 896)) return 'x';
    if (OS === 'web') return 'w';
    if (OS === 'ios') return 'i';
    if (OS === 'android') return 'a';
    return;
  }
}

module.exports = devicePrefix;
