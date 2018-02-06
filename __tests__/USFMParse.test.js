/* eslint-env jest */
import usfmToJSON from '../src/USFMParse';
import fs from 'fs-extra';
const titus_usfm_file = '__tests__/fixtures/project/57-TIT.usfm';

describe('USFMParse Tests', () => {
  it('Test usfmToJSON', () => {
    const usfm = fs.readFileSync(titus_usfm_file, 'utf8');
    const json = usfmToJSON(usfm);
    expect(json).toMatchSnapshot();
  });
});