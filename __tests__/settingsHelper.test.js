import * as settingsHelper from '../src/helpers/settingsHelper';

describe('settingsHelper.loadCorrectPaneSettings', () => {
  test('Should change the pane settings to render English ULT if Enslish is selected as the GL', () => {
    const props = {
      toolsReducer: {
        currentToolName: 'translationWords'
      },
      projectDetailsReducer: {
        currentProjectToolsSelectedGL: {
          translationWords: 'en'
        }
      },
      settingsReducer: {
        toolsSettings: {
          ScripturePane: {
            currentPaneSettings: [
              {
                languageId: 'hi',
                bibleId: 'ulb'
              },
            ]
          }
        }
      }
    };
    const expectedResult = [
      {
        languageId: 'en',
        bibleId: 'ult'
      }
    ];
    settingsHelper.loadCorrectPaneSettings(props, (toolNamespace, settingsLabel, paneSettings) => {
      expect(paneSettings).toEqual(expectedResult);
    });
  });

  test('Should change the pane settings to render Hindi ULB if Hindi is selected as the GL', () => {
    const props = {
      toolsReducer: {
        currentToolName: 'translationWords'
      },
      projectDetailsReducer: {
        currentProjectToolsSelectedGL: {
          translationWords: 'en'
        }
      },
      settingsReducer: {
        toolsSettings: {
          ScripturePane: {
            currentPaneSettings: [
              {
                languageId: 'en',
                bibleId: 'ult'
              },
            ]
          }
        }
      }
    };
    const expectedResult = [
      {
        languageId: 'hi',
        bibleId: 'ulb'
      }
    ];
    settingsHelper.loadCorrectPaneSettings(props, (toolNamespace, settingsLabel, paneSettings) => {
      expect(paneSettings).toEqual(expectedResult);
    });
  });

  test('Should render both Hindi ULB and English ULT if they are both currently in the pane settings', () => {
    const bothHindiAndEnglish = [
      {
        languageId: 'en',
        bibleId: 'ult'
      },
      {
        languageId: 'hi',
        bibleId: 'ulb'
      },
    ];
    const props = {
      toolsReducer: {
        currentToolName: 'translationWords'
      },
      projectDetailsReducer: {
        currentProjectToolsSelectedGL: {
          translationWords: 'en'
        }
      },
      settingsReducer: {
        toolsSettings: {
          ScripturePane: {
            currentPaneSettings: bothHindiAndEnglish
          }
        }
      }
    };
    const expectedResult = bothHindiAndEnglish;
    settingsHelper.loadCorrectPaneSettings(props, (toolNamespace, settingsLabel, paneSettings) => {
      expect(paneSettings).toEqual(expectedResult);
    });
  });
});
