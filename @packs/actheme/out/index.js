"use strict";

const { create, Comp } = require('./componentFactory');
const { fustyle } = require('./styles');
const devicePrefix = require('./device');
const { dims, useMedia, mediaListiner, mediaRules } = require('./media');
const { set, setAlphedColors, setScaledSizes, themeValue } = require('./themeManager');
const createState = require('./store');

module.exports = {
	create,
	Comp,
	fustyle,
	style: fustyle,
	set,
	setAlphedColors,
	setScaledSizes,
	themeValue,
	value: themeValue,
	devicePrefix,
	device: devicePrefix,
	dims,
	state: createState,
	media: useMedia,
	useMedia,
	mediaListiner,
	mediaRules
};
