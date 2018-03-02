/* eslint-env jest */

import React from 'react';
import View from './components/View.js';
import PropTypes from 'prop-types';

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      showHelps: true
    };
  }

  componentWillMount() {
    const { currentToolName } = this.props.toolsReducer;
    const { currentProjectToolsSelectedGL } = this.props.projectDetailsReducer;
    const languageId = currentProjectToolsSelectedGL[currentToolName];
    const { ScripturePane } = this.props.settingsReducer.toolsSettings;
    const currentPaneSettings = ScripturePane ? ScripturePane.currentPaneSettings : null;
    // making sure the right ulb language is displayed in the scripture pane
    if (currentPaneSettings && !currentPaneSettings.some(paneSetting => paneSetting.languageId === languageId)) {
      const newCurrentPaneSettings = currentPaneSettings.map((paneSetting) => {
        if (paneSetting.bibleId === 'ulb') paneSetting.languageId = languageId;
        return paneSetting;
      });
      this.props.actions.setToolSettings("ScripturePane", "currentPaneSettings", newCurrentPaneSettings);
    }
    if (!ScripturePane || currentPaneSettings.length === 0) {
      // initializing the ScripturePane settings if not found.
      this.props.actions.setToolSettings("ScripturePane", "currentPaneSettings", [{
        languageId,
        bibleId: 'ulb'
      }]);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.contextIdReducer && this.props.contextIdReducer !== nextProps.contextIdReducer) {
      const articleId = nextProps.contextIdReducer.contextId.groupId;
      const { currentToolName } = nextProps.toolsReducer;
      const languageId = nextProps.projectDetailsReducer.currentProjectToolsSelectedGL[currentToolName];
      nextProps.actions.loadResourceArticle(currentToolName, articleId, languageId);
    }
  }

  toggleHelps() {
    this.setState({ showHelps: !this.state.showHelps });
  }

  render() {
    let view = <div />;
    let { contextId } = this.props.contextIdReducer;
    if (contextId !== null) {
      const { groupId } = this.props.contextIdReducer.contextId;
      const title = this.props.groupsIndexReducer.groupsIndex.filter(item=>item.id===groupId)[0].name;
      view = (
        <View
          {...this.props}
          title={title}
          showHelps={this.state.showHelps}
          toggleHelps={this.toggleHelps.bind(this)}
        />
      );
    }
    return view;
  }
}

Container.propTypes = {
  settingsReducer: PropTypes.shape({
    toolsSettings: PropTypes.shape({
      ScripturePane: PropTypes.object
    })
  }),
  contextIdReducer: PropTypes.shape({
    contextId: PropTypes.shape({
      groupId: PropTypes.any
    })
  }),
  groupsIndexReducer: PropTypes.shape({
    groupsIndex: PropTypes.array
  }),
  projectDetailsReducer: PropTypes.shape({
    currentProjectToolsSelectedGL: PropTypes.object.isRequired
  }),
  toolsReducer: PropTypes.shape({
    currentToolName: PropTypes.string.isRequired
  }),
  actions: PropTypes.shape({
    setToolSettings: PropTypes.func.isRequired,
    loadResourceArticle: PropTypes.func.isRequired
  })
};

export default Container;
