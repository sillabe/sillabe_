#!/usr/bin/env node

const cli = require('@sillabe/cli');
const commander = require('commander');

cli.installOptions(commander.arguments('[name]')).parse();
