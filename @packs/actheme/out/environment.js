"use strict";

const React = require('react');

const RN = (() => {
  try {
    return require('react-native');
  } catch (error) {
    try {
      return eval('require("react-native-web")');
    } catch (err) {
      return eval('require("rnwc")');
    }
  }
})();

module.exports = { React, RN };
