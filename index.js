const hydrators = require('./hydrators');
const newFile = require('./triggers/newFile');
const uploadFile = require('./creates/uploadFile');
const utils = require('./utils.js')

// We can roll up all our behaviors in an App.
const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: {
    type: 'session',
    test: (z, bundle) => z.request(`${utils.getFilesUrl(bundle)}`),
    sessionConfig: {
      perform: (z, bundle) => ({base_url: utils.tidyBaseUrl(bundle.authData.base_url)}),
    },
    fields: [{key: 'base_url', helpText: 'e.g. `https://example.ngrok.io`'}],
  },

  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [
  ],

  afterResponse: [
    (res, z, bundle) => {
      if (res.status != 200) {
        throw new Error(res.content);
      }
      return res;
    },
  ],

  // Any hydrators go here
  hydrators: hydrators,

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {
  },

  // If you want your triggers to show up, you better include it here!
  triggers: {
    [newFile.key]: newFile,
  },

  // If you want your searches to show up, you better include it here!
  searches: {
  },

  // If you want your creates to show up, you better include it here!
  creates: {
    [uploadFile.key]: uploadFile,
  }
};

// Finally, export the app.
module.exports = App;
