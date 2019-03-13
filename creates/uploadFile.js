const request = require('request');
const FormData = require('form-data');
const hydrators = require('../hydrators');
const utils = require('../utils.js')

const uploadFile = (z, bundle) => {
  const formData = new FormData();

  // file will in fact be an url where the file data can be downloaded from
  // which we do via a stream created by NPM's request package
  // (form-data doesn't play nicely with z.request)
  formData.append('file', request(bundle.inputData.file));

  return z.request({
      url: utils.getFilesUrl(bundle),
      method: 'POST',
      body: formData,
    })
    .then(res => res.json)
    .then(res => {
      // Make it possible to use the actual uploaded (or online converted)
      // file in a subsequent action. No need to download it now, so again
      // dehydrating like in ../triggers/newFile.js
      const filePointer = z.dehydrateFile(hydrators.downloadFile, {
        filename: res.filename,
      });

      return {id: res.filename, file: filePointer};
    });
};

module.exports = {
  key: 'uploadFile',
  noun: 'File',
  display: {
    label: 'Upload File',
    description: 'Uploads a file.'
  },
  operation: {
    inputFields: [
      {key: 'file', required: true, type: 'file', label: 'File'},
    ],
    perform: uploadFile,
    sample: {
      id: 'E52F6A0A-0C99-4150-A53D-DD994880F4B1.txt',
    },
    outputFields: [
      {key: 'id', type: 'string', label: 'Filename'},
    ],
  }
};
