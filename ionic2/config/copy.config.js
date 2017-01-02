const config = require('@ionic/app-scripts/config/copy.config');
config.copySW = {
  src: 'node_modules/sw-toolbox/sw-toolbox.js',
  dest: '{{BUILD}}/sw-toolbox.js'
};
module.exports = config;
