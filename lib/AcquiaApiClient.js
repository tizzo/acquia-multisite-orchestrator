'use strict';

const request = require('request');

class AcquiaApiClient {

  /**
   *
   */
  constructor(user, apiKey, site) {
    this.user = user;
    this.apiKey = apiKey;
    this.site = site;
    this.baseUrl = 'https://cloudapi.acquia.com/v1'
  }

  prepareOptions(resource) {
    return {
      url: `${this.baseUrl}/${resource}`, 
      json: true,
      auth: {
        user: this.user,
        pass: this.apiKey,
      }
    };
  }

  listDatbases(site, done) {
    request(this.prepareOptions(`sites/${site}/dbs.json`), function(error, response, databases) {
      if (!error) {
        databases = databases.map(item => item.name);
        // TODO: Validate that a tenant may not have the same name as the site itself.
        // We do not want to manage the default site datbase, remove it from the list.
        databases = databases.filter(name => `prod:${name}` != site)
      }
      done(error, databases);
    });
  }

  createDatabase(dbName, done) {
    let options = this.prepareOptions(`sites/${site}/dbs.json`);
    options.body = {db: dbName};
    request.post(options, function(error, response, body) {
      console.log(body);
      done(error);
    });
  }

}

module.exports = AcquiaApiClient;
