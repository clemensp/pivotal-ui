global.$ = global.jQuery = require('jquery');
global._ = require('lodash');
require('bootstrap');
require('modernizr');
require('prism');

require('./scale')();
require('./back-to-top')();

global.React = require('react');

global.UI = require('./components.js');