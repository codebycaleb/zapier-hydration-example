require('should');
const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('creates', () => {

  describe('uploadFile', () => {
    it('should upload file without name', (done) => {
      const bundle = {
        inputData: {
          filename: 'foo.html',

          // in production, this will be a hydration URL to the selected file's data
          file: 'http://test.greenbytes.de/tech/tc2231/inlwithasciifilename.asis',
        }
      };

      appTester(App.creates.uploadFile.operation.perform, bundle)
        .then((result) => {
          result.should.have.property('id');
          result.name.should.containEql('foo.html');
          result.filename.should.eql('sample.pdf');
          result.file.should.containEql('hydrate|||');

          done();
        })
        .catch(done);
    });

    it('should upload file with name', (done) => {
      const bundle = {
        inputData: {
          name: 'Foo',
          filename: 'foo.html',

          // in production, this will be a hydration URL to the selected file's data
          file: 'http://test.greenbytes.de/tech/tc2231/inlwithasciifilename.asis',
        }
      };

      appTester(App.creates.uploadFile.operation.perform, bundle)
        .then((result) => {
          result.should.have.property('id');
          result.name.should.eql('Foo');
          result.filename.should.eql('foo.html');
          result.file.should.containEql('hydrate|||');

          done();
        })
        .catch(done);
    });
  });

});
