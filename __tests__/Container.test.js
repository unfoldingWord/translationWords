/* eslint-env jest */
import React from 'react';
import Container from '../src/Container';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';

const props = {
  ...require('./__fixtures__/basicProps.json'),
  actions: {
    setToolSettings: jest.fn(),
    loadResourceArticle: jest.fn(),
    getGLQuote: jest.fn(),
    getSelectionsFromContextId: jest.fn(),
    setFilter: jest.fn(),
    groupMenuChangeGroup: jest.fn(),
    groupMenuExpandSubMenu: jest.fn(),
    getSelectionsFromContextId: () => ''
  },
  translate: k => k
};

describe('Container Tests', () => {
  it('Test Container', () => {
    const component = renderer.create(
      <MuiThemeProvider>
        <Container {...props} />
      </MuiThemeProvider>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Test empty Container', () => {
    const myProps = {
      ...props,
      contextIdReducer: {
        contextId: null
      }
    };
    const component = renderer.create(
      <MuiThemeProvider>
        <Container {...myProps} />
      </MuiThemeProvider>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Test Container.toggleHelps', () => {
    const container = shallow(<Container {...props} />).instance();
    expect(container.state.showHelps).toBeFalsy();
    container.toggleHelps();
    expect(container.state.showHelps).toBeTruthy();
    container.toggleHelps();
    expect(container.state.showHelps).toBeFalsy();
  });

  it('Test has ScripturePane', () => {
    const container = shallow(<Container {...props} />).instance();
    expect(container.props.actions.setToolSettings).toBeCalled();
    expect(container.props.actions.setToolSettings).toBeCalledWith("ScripturePane", "currentPaneSettings", props.settingsReducer.toolsSettings.ScripturePane.currentPaneSettings);
  });

  it('Test does not have ScripturePane', () => {
    props.settingsReducer.toolsSettings = {};
    const container = shallow(<Container {...props} />).instance();
    const initialScripturePaneSettings = [{"bibleId": "ult", "languageId": "en"}, {"bibleId": "targetBible", "languageId": "targetLanguage"}];
    expect(container.props.actions.setToolSettings).toBeCalledWith("ScripturePane", "currentPaneSettings", initialScripturePaneSettings);
  });

  it('Test Container.componentWillReceiveProps', () => {
    const root = shallow(<Container {...props} />);
    const wrapper = root.childAt(0);
    expect(wrapper.props().contextIdReducer.contextId.groupId).toEqual(props.contextIdReducer.contextId.groupId);
    const newGroupId = 'groupId2';
    const nextProps = {
      ...props,
      contextIdReducer: {
        contextId: {
          "reference": {
            "bookId": "tit",
            "chapter": 1,
            "verse": 1
          },
          "tool": "translationWords",
          groupId: newGroupId,
          "quote": "Χριστοῦ",
          "strong": [
            "G55470"
          ],
          "occurrence": 1,
        }
      },
      toolsReducer: {
        currentToolName: 'translationWords'
      },
      projectDetailsReducer: {
        projectSaveLocation: '',
        currentProjectToolsSelectedGL: {'translationWords': 'en'},
        manifest: {
          "project": {
            "id": "tit",
            "name": "Titus"
          }
        }
      },
      groupsIndexReducer: {
        groupsIndex: [
          {
            id: 'groupId2',
            name: 'groupId2, name'
          }
        ],
        loadedFromFileSystem: true
      },
    };
    root.setProps(nextProps, () => {
      expect(wrapper.props().contextIdReducer.contextId.groupId).toEqual(newGroupId);
      expect(container.props.actions.loadResourceArticle).toBeCalledWith(
        nextProps.toolsReducer.currentToolName,
        nextProps.contextIdReducer.contextId.groupId,
        nextProps.projectDetailsReducer.currentProjectToolsSelectedGL[nextProps.toolsReducer.currentToolName]
      );
    });
  });
});
