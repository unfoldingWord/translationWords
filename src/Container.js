/* eslint-env jest */

import React from 'react';

import View from './components/View.js';
import PropTypes from 'prop-types';
import path from 'path';
import {connectTool} from 'tc-tool';

const TOOL_ID = 'translationWords';
const LOCALE_DIR = path.join(__dirname, '../locale');

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
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.contextIdReducer &&
      this.props.contextIdReducer !== nextProps.contextIdReducer) {
      let articleId = nextProps.contextIdReducer.contextId.groupId;
      nextProps.actions.loadResourceArticle('translationWords', articleId);
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
  actions: PropTypes.shape({
    setToolSettings: PropTypes.func.isRequired,
    loadResourceArticle: PropTypes.func.isRequired
  })
};

// for testing without tool connection
exports.Container = Container;

export default connectTool(TOOL_ID, LOCALE_DIR)(Container);
