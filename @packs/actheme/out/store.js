"use strict";

const { React } = require('./environment');

function createState(initial = {}) {
  const store = initial;
  return [store, useState];

  function useState(value, name) {
    const state = React.useState(value);
    if (!name) return state;
    const title = name.charAt(0).toUpperCase() + name.slice(1);
    store['get' + title] = () => state[0];
    store['set' + title] = state[1];
    return state;
  }
}

module.exports = createState;
