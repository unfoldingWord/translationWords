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
    let { ScripturePane } = this.props.settingsReducer.toolsSettings;
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
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.contextIdReducer && this.props.contextIdReducer !== nextProps.contextIdReducer) {
      let articleId = nextProps.contextIdReducer.contextId.groupId;
      nextProps.actions.loadResourceArticle('translationWords', articleId);
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
      view = <View
        {...this.props}
        title={title}
        showHelps={this.state.showHelps}
        toggleHelps={this.toggleHelps.bind(this)}
      />;
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
  actions: PropTypes.shape({
    setToolSettings: PropTypes.func.isRequired,
    loadResourceArticle: PropTypes.func.isRequired
  })
};

export default Container;
