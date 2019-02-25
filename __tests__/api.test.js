import Api from '../src/Api';
jest.mock('../src/helpers/validationHelpers', () => ({
  ...require.requireActual('../src/helpers/validationHelpers'),
  getSelectionsFromChapterAndVerseCombo: () => require('./__fixtures__/selectionObject.json')
}));
jest.mock('fs-extra', () => ({
  outputJSONSync: jest.fn()
}));
import path from 'path-extra';
import fs from 'fs-extra';

describe('api.validateBook', () => {
  const projectPath = 'users/john/translationCore/projects/my_en_project';
  it('should find that a verse has invalidated checks', () => {
    const props = {
      tool: {
        name: 'translationWords',
        translate: key => key
      },
      tc: {
        targetBook: {
          '2': {
            '12': "It trains us, so that, rejecting asjfdas and worldly passions, we might live in a self-controlled and righteous and godly way in the present age, "
          }
        },
        contextId: {reference: {bookId: 'tit'}},
        username: 'royalsix',
        actions: {
          changeSelections: jest.fn(() => {})
        },
        project: {
          _projectPath: projectPath,
          getGroupData: jest.fn(() => {}),
          getCategoryGroupIds: jest.fn(() => {}),
          getGroupsData: jest.fn(() => ({
            accuse:
              [{"priority": 1, "comments": false, "reminders": false, "selections": [{"text": "godlessness ", "occurrence": 1, "occurrences": 1}], "verseEdits": false, "contextId": {"reference": {"bookId": "tit", "chapter": 2, "verse": 12}, "tool": "translationWords", "groupId": "age", "quote": "αἰῶνι", "strong": ["G01650"], "occurrence": 1}, "invalidated": false}]
          })),
        },
        showIgnorableAlert: jest.fn(() => {})
      }
    };
    const api = new Api();
    api.props = props;
    api.validateBook();
    expect(props.tc.showIgnorableAlert).toHaveBeenCalled();
    expect(props.tc.actions.changeSelections).toHaveBeenCalled();
    expect(fs.outputJSONSync).toHaveBeenCalledWith(
      expect.stringContaining(path.join(projectPath, '.apps/translationCore/checkData/invalidated/tit/2/12/')),
      {
        contextId:
        {
          reference: {bookId: 'tit', chapter: 1, verse: 6},
          tool: 'translationWords',
          groupId: 'accuse',
          quote: 'κατηγορίᾳ',
          strong: ['G27240'],
          occurrence: 1
        },
        invalidated: true,
        userName: 'royalsix',
        modifiedTimestamp: expect.any(String),
        gatewayLanguageCode: 'en',
        gatewayLanguageQuote: 'accused'
      }
    );
  });
});