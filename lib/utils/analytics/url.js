'use strict';

const isInChina = require('../isInChina');

module.exports = isInChina
  ? 'https://{TODO: REPLACE WITH TENCENT URL}'
  : 'https://{TODO: REPLACE WITH AWS URL}';
