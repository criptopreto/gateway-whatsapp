'use strict';
const express = require('express');
const router = express.Router();
const routes = require('require-all')({
  dirname: __dirname,
  filter: function (file) {
    let part = file.split('.');
    if (part[0] === 'index') return;
    return part[0];
  },
});

for (var name in routes) {
  router.use(`/${name}`, routes[name]);
}

module.exports = router;