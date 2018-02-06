/* eslint-env jest */
import React from 'react';
import View from '../src/View';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import renderer from 'react-test-renderer';

jest.mock('../src/components/CheckInfoCard.js', () => '[CheckInfoCard]');

describe('View component Tests', () => {
  it('Check View component', () => {
    let props = {
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
      contextIdReducer: {
        contextId: {
          groupId: 'group1',
          quote: 'title'
        }
      },
      toggleHelps: jest.fn(),
      showHelps: jest.fn()
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