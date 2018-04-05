/* eslint-env jest */
import React from 'react';
import View from '../src/components/View';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import renderer from 'react-test-renderer';

jest.mock('../src/components/CheckInfoCard.js', () => '[CheckInfoCard]');

describe('View component Tests', () => {
  it('Check View component', () => {
    let props = {
      translate:k => k,
      currentToolViews: {
        ScripturePane: () => '[ScripturePane]',
        VerseCheck: () => '[VerseCheck]',
        TranslationHelps: () => '[TranslationHelps]'
      },
      settingsReducer: {
        toolsSettings: {
          ScripturePane: {}
        },
        online: true
      },
      resourcesReducer: {
        translationHelps: {
          translationWords: {'group1': 'file'}
        }
      },
      projectDetailsReducer: {},
      selectionsReducer: {},
      contextIdReducer: {
        contextId: {
          groupId: 'group1',
          quote: 'title'
        }
      },
      title: 'title',
      toggleHelps: jest.fn(),
      showHelps: jest.fn(),
      actions: {},
      appLanguage: '',
    };
    const component = renderer.create(
      <MuiThemeProvider>
        <View {...props} />
      </MuiThemeProvider>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
