const { resolve } = require('path');
const express = require('express');
const app = express();
const router = require('./routing');

// CONFIGURATION DE L'APP
app.use( express.static(resolve('public')) );
app.use( router );
app.use(express.json());

module.exports = app;