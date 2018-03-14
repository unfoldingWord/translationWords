/* eslint-env jest */

import React from 'react';

import View from './components/View.js';
import PropTypes from 'prop-types';

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      showHelps: true,
    };
  }

  componentWillMount() {
    const { currentToolName } = this.props.toolsReducer;
    const { currentProjectToolsSelectedGL } = this.props.projectDetailsReducer;
    const languageId = currentProjectToolsSelectedGL[currentToolName];
    const { ScripturePane } = this.props.settingsReducer.toolsSettings;
    const currentPaneSettings = ScripturePane ? ScripturePane.currentPaneSettings : null;
    // making sure the right ult language is displayed in the scripture pane
    if (currentPaneSettings && !currentPaneSettings.some(paneSetting => paneSetting.languageId === languageId)) {
      const newCurrentPaneSettings = currentPaneSettings.map((paneSetting) => {
        if (paneSetting.bibleId === 'ult') paneSetting.languageId = languageId;
        return paneSetting;
      });
      this.props.actions.setToolSettings("ScripturePane", "currentPaneSettings", newCurrentPaneSettings);
    }
    if (!ScripturePane || currentPaneSettings.length === 0) {
      // initializing the ScripturePane settings if not found.
      const initialCurrentPaneSettings = [
        {
          languageId,
          bibleId: 'ult'
        },
        {
          languageId: 'targetLanguage',
          bibleId: 'targetBible'
        }
      ];
      this.props.actions.setToolSettings("ScripturePane", "currentPaneSettings", initialCurrentPaneSettings);
    }
    this._reloadArticle(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.contextIdReducer && this.props.contextIdReducer !== nextProps.contextIdReducer) {
      this._reloadArticle(nextProps);
    }
  }

  /**
   * Loads the resource article
   * @param props
   * @private
   */
  _reloadArticle(props) {
    const {contextIdReducer, toolsReducer, projectDetailsReducer, actions} = props;
    const {contextId} = contextIdReducer;
    if(contextId) {
      const articleId = contextId.groupId;
      const {currentToolName} = toolsReducer;
      const languageId = projectDetailsReducer.currentProjectToolsSelectedGL[currentToolName];
      actions.loadResourceArticle(currentToolName, articleId, languageId);
    }
  }

  toggleHelps() {
    this.setState({showHelps: !this.state.showHelps});
  }

  render() {
    const { translate, projectDetailsReducer: { currentProjectToolsSelectedGL }, toolsReducer: { currentToolName } } = this.props;
    const { contextId } = this.props.contextIdReducer;

    if (contextId !== null) {
      const languageId = currentProjectToolsSelectedGL[currentToolName];
      const { groupId } = this.props.contextIdReducer.contextId;
      const title = this.props.groupsIndexReducer.groupsIndex.filter(item=>item.id===groupId)[0].name;
      const glQuote = this.props.actions.getGLQuote(languageId, groupId, currentToolName);
      return (
        <View
          {...this.props}
          glQuote={glQuote}
          translate={translate}
          title={title}
          showHelps={this.state.showHelps}
          toggleHelps={this.toggleHelps.bind(this)}
        />
      );
    } else {
      return null;
    }
  }
}

Container.propTypes = {
  translate: PropTypes.func,
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
    loadResourceArticle: PropTypes.func.isRequired,
    getGLQuote: PropTypes.func.isRequired
  })
};

export default Container;
