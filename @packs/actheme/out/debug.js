"use strict";

function debugLog() {
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_ACTHEME_DEBUG === 'true') {
    console.log.apply(console, arguments);
  }
}

module.exports = debugLog;
