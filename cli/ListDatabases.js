'use strict';

const Riker = require('riker');
const Command = Riker.Command;
const AMO = require('..');
const yaml = require('js-yaml');
const fs = require('js-yaml');

const AcquiaApiClient = AMO.AcquiaApiClient;

class ConvergeConfiguration extends Command {

  configure(config, done) {
    if (!config.userName || !config.userApiKey) {
      throw Error('userName and userApiKey must be specified');
    }
    this.userName = config.userName;
    this.userApiKey = config.userApiKey;
    done();
  }

  run(done) {
    let self = this;
    self.bufferInputYaml(self.input, (error, conf) => {
      this.client = new AcquiaApiClient(self.userName, self.userApiKey, conf.site);
      this.client.listDatbases(conf.site, (error, databases) => {
        if (databases.length) {
          databases.map(db => self.output.writeLine(db));
        }
        else {
          self.output.writeLine('No databases found.');
        }
      });
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
