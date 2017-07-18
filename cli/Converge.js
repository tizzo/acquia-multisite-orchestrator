'use strict';

const Riker = require('riker');
const Command = Riker.Command;
const AMO = require('..');
const yaml = require('js-yaml');
const fs = require('js-yaml');

const AcquiaApiClient = AMO.AcquiaApiClient;

class ConvergeConfiguration extends Command {

  constructor() {
    super();
    this.shortDescription = 'Apply a configuration file to an Acquia Cloud Environment.';
    this.help = 'This process runs the server application.';
    this.addParameter('user-name')
      .describe('The user name to use for api requests.')
      // TODO: Support parameter requirements satisfied by conf files.
      // .require()
      .alias('u');
    this.addParameter('user-api-key')
      .describe('The api key to use for .')
      // TODO: Support parameter requirements satisfied by conf files.
      // .require()
      .alias('k');
  }

  configure(config, done) {
    if (!config.userName || !config.userApiKey) {
      throw Error('userName and userApiKey must be specified');
    }
    this.client = new AcquiaApiClient(config.userName, config.userApiKey);
    done();
  }

  run(done) {
    let self = this;
    self.bufferInputYaml(self.input, (error, conf) => {
      /*
      let jobs = {};
      jobs.listDatbases = this.client.listDatbases.bind(this.client, conf.site);
      async.parallel(jobs, (error, results) => {
        console.log(results);
        done();
      });
      /*/
      //*
      this.client.listDatbases(conf.site, (error, databases) => {
        if (error) {
          this.error.writeLine(error.message);
          return done();
        }
        console.log(databases);
      });
      //*/
    });
  }

  bufferInputYaml(input, done) {
    let chunks = [];
    input.setEncoding('utf8');
    input.on('data', chunk => {
      chunks.push(chunk);
    });
    input.on('end', () => {
      try {
          let conf = yaml.safeLoad(chunks.join());
          done(null, conf);
      } catch (e) {
        done(e);
      }
    });
  }
}

module.exports = ConvergeConfiguration;
