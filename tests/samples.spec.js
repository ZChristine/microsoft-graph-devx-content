const samples = require('../sample-queries/sample-queries.json');
const { includesAllowedVersions, validateJson, validateLink, hasWhiteSpace } = require("./validator");

const sampleQueries = samples.SampleQueries;
for (const query of sampleQueries) {
  describe(`${query.humanName}:`, function () {

    it('id should be unique', function () {
      const count = sampleQueries.filter(samp => samp.id === query.id).length;
      expect(count).toEqual(1);
    });

    it('id should be a valid GUID', function () {
      const regexPattern = /^[{|\(]?[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}[\)|}]?$/i;
      expect(regexPattern.test(query.id)).toEqual(true);
    });

    it('humanName first word should be lower cased', function () {
      const firstWord = query.humanName.split(' ')[0];
      const lowerCasedHumanName = firstWord.toLowerCase();
      expect(lowerCasedHumanName).toEqual(firstWord);
    });

    it('version should be v1.0 or beta', function () {
      const allowedVersions = ['v1.0', 'beta'];
      const includes = includesAllowedVersions(allowedVersions, query.requestUrl);
      expect(includes).toEqual(true);
    });

    if (query.postBody) {
      it (`sample with postBody property should have corresponding headers property`, function () {
        expect(query.headers).toBeDefined();
      });

      it(`postbody should be a valid json string`, function () {
        let isValidJson = true;
        if (query.headers) {
          isValidJson = validateJson(query, isValidJson);
        }
        expect(isValidJson).toEqual(true);
      });
    }

    it('docLink should be valid', async function() {
      const isValidLink = await validateLink(query.docLink);
      expect(isValidLink).toBe(true);
    });

    it('requestUrl should start with a leading /', function () {
      expect(query.requestUrl.startsWith('/')).toBe(true);
    });

    it('requestUrl should not have whitespace before parameters', function () {
      expect(hasWhiteSpace(query.requestUrl)).toBe(false);
    })
  });
}
