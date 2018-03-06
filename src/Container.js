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
    const {settingsReducer} = this.props;
    let {ScripturePane} = settingsReducer.toolsSettings;
    if (!ScripturePane) {
      // initializing the ScripturePane settings if not found.
      this.props.actions.setToolSettings("ScripturePane", "currentPaneSettings", ["ulb"]);
    } else {
      for( let i = 0; i < ScripturePane.currentPaneSettings.length; i++) {
        if (ScripturePane.currentPaneSettings[i] === 'bhp') { // update bhp references to ugnt
          ScripturePane.currentPaneSettings[i] = 'ugnt';
          this.props.actions.setToolSettings("ScripturePane", "currentPaneSettings", ScripturePane.currentPaneSettings);
        }
      }
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
    const {translate} = this.props;
    let {contextId} = this.props.contextIdReducer;

    if (contextId !== null) {
      const { groupId } = this.props.contextIdReducer.contextId;
      const title = this.props.groupsIndexReducer.groupsIndex.filter(item=>item.id===groupId)[0].name;
      return <View
        {...this.props}
        translate={translate}
        title={title}
        showHelps={this.state.showHelps}
        toggleHelps={this.toggleHelps.bind(this)}
      />;
    } else {
      return null;
    }
  }
}

Container.propTypes = {
  translate: PropTypes.func,
  toolsReducer: PropTypes.any.isRequired,
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
  actions: PropTypes.shape({
    setToolSettings: PropTypes.func.isRequired,
    loadResourceArticle: PropTypes.func.isRequired
  })
};

export default Container;
