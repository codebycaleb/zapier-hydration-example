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

module.exports = {tidyBaseUrl: tidyBaseUrl, getFilesUrl: getFilesUrl};
