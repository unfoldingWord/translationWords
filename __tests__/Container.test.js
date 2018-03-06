/* eslint-env jest */
import React from 'react';
import Container from '../src/Container';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

jest.mock('../src/components/View.js', () => '[View]');

const props = {
  translate: k=>k,
  settingsReducer: {
    toolsSettings: {
      ScripturePane: {
        currentPaneSettings: ['bhp']
      }
    }
  },
  contextIdReducer: {
    contextId: {
      groupId: 'groupId1'
    }
  },
  groupsIndexReducer: {
    groupsIndex: [{'id': 'groupId1', 'name': 'group title'}, {'id': 'groupId2', 'name': 'group title2'}]
  },
  toolsReducer: {
    currentToolName: 'translationWords'
  },
  actions: {
    setToolSettings: jest.fn(),
    loadResourceArticle: jest.fn()
  },
  projectDetailsReducer: {
    currentProjectToolsSelectedGL: []
  }
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

  it('Test Container.toggleHelps', () => {
    const container = shallow(<Container {...props} />).instance();
    expect(container.state.showHelps).toBeTruthy();
    container.toggleHelps();
    expect(container.state.showHelps).not.toBeTruthy();
    container.toggleHelps();
    expect(container.state.showHelps).toBeTruthy();
  });

  it('Test has ScripturePane', () => {
    const container = shallow(<Container {...props} />).instance();
    expect(container.props.actions.setToolSettings).toBeCalled();
    expect(container.props.actions.setToolSettings).toBeCalledWith("ScripturePane", "currentPaneSettings", props.settingsReducer.toolsSettings.ScripturePane.currentPaneSettings);
  });

  it('Test does not have ScripturePane', () => {
    let myProps = JSON.parse(JSON.stringify(props));
    myProps.settingsReducer.toolsSettings = {};
    myProps.actions = {
      setToolSettings: jest.fn(),
      loadResourceArticle: jest.fn()
    };
    const container = shallow(<Container {...myProps} />).instance();
    expect(container.props.actions.setToolSettings).toBeCalledWith("ScripturePane", "currentPaneSettings", ['ulb']);
  });

  it('Test Container.componentWillReceiveProps', () => {
    const wrapper = shallow(<Container {...props} />);
    const container = wrapper.instance();
    expect(wrapper.props().contextIdReducer.contextId.groupId).toEqual(props.contextIdReducer.contextId.groupId);
    const newGroupId = 'groupId2';
    const nextProps = {
      contextIdReducer: {
        contextId: {
          groupId: newGroupId
        }
      },
      toolsReducer: {
        currentToolName: 'translationWords'
      },
      projectDetailsReducer: {
        currentProjectToolsSelectedGL: {'translationWords': 'en'}
      }
    };
    wrapper.setProps(nextProps);
    expect(wrapper.props().contextIdReducer.contextId.groupId).toEqual(newGroupId);
    expect(container.props.actions.loadResourceArticle).toBeCalledWith(
      nextProps.toolsReducer.currentToolName,
      nextProps.contextIdReducer.contextId.groupId,
      nextProps.projectDetailsReducer.currentProjectToolsSelectedGL[nextProps.toolsReducer.currentToolName]
    );
  });
});

