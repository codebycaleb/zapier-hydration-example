const contentDisposition = require('content-disposition')

const tidyBaseUrl = (url) => {
  url = url.replace('http://', 'https://'); // ensure https
  if (!url.startsWith('https://')) { // more "insurance"
    url = 'https://' + url;
  }
  if (url.endsWith('/')) {
    url = url.substring(0, url.length - 1); // trim '/' from the end
  }
  return url;
}

const getFilesUrl = (bundle) => {
  return `${tidyBaseUrl(bundle.authData.base_url)}/files`
}

const getFilenameFromContentDisposition = header => {
  let filename = '';

  if (!header) {
    return filename;
  }

  try {
    filename = contentDisposition.parse(header).parameters.filename;
  } catch (e) {
    const match = /^.*filename="(.*)".*/.exec(header);
    if (match) {
      filename = match[1];
    }
  }

  return filename;
}

const retrieveFile = async (z, url) => {
  const fileObj = {};

  try {
    const response = await z.request(url, { raw: true });
    const header = response.getHeader('content-disposition');
    fileObj.filename = getFilenameFromContentDisposition(header);
    fileObj.file = await response.body;
  } catch (e) {
    throw e;
  }
  return fileObj;
}

module.exports = {tidyBaseUrl, getFilesUrl, retrieveFile};
