/* eslint-env jest */
import React from 'react';
import Container from '../src/Container';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import renderer from 'react-test-renderer';

jest.mock('../src/View.js', () => '[View]');

describe('Container Tests', () => {
  it('Check Container', () => {
    let props = {
      settingsReducer: {
        toolsSettings: {}
      },
      contextIdReducer: {
        contextId: {
          groupId: 'groupId'
        }
      },
      actions: {
        setToolSettings: jest.fn(),
        loadResourceArticle: jest.fn()
      }
    };
    const component = renderer.create(
      <MuiThemeProvider>
        <Container {...props} />
      </MuiThemeProvider>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});