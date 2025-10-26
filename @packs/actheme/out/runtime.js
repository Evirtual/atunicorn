"use strict";

const defaultTheme = require('../theme');

const runtime = {
  defaultTheme,
  theme: defaultTheme,
  Comps: {},
  ready: false,
  created: false,
  screen: undefined,
  subscriptions: [],
  classes: {}
};

module.exports = runtime;
