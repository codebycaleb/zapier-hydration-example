const _ = require('lodash')
const utils = require('./utils.js')

const hydrators = {
  downloadFile: (z, bundle) => {
    // use standard auth to request the file
    const filePromise = z.request({
      url: `${utils.getFilesUrl(bundle)}/${bundle.inputData.filename}`,
      raw: true
    });

    // and swap it for a stashed URL
    return z.stashFile(filePromise)
      .then((url) => {
        z.console.log(`Stashed URL = ${url}`);
        return url;
      });
  },
  fileMeta: async (z, bundle) => {
    const fileData = await z.request({ // retrieves the metadata for the file
      url: `${utils.getFilesUrl(bundle)}/${bundle.inputData.filename}/meta`,
    }).then(res => res.json);
    return _.merge(
      fileData, // combine file data with the file contents
      {file: z.dehydrateFile(hydrators.downloadFile, {filename: bundle.inputData.filename}
    )});
  },
};

module.exports = hydrators;
