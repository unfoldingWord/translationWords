import React from 'react';
import View from './View.js';
import {connectTool} from 'tc-tool';
import path from 'path';
import PropTypes from 'prop-types';

const TOOL_ID='translationWords';
const LOCALE_DIR=path.join(__dirname, '../locale');

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
      view = <View
        {...this.props}
        showHelps={this.state.showHelps}
        toggleHelps={this.toggleHelps.bind(this)}
      />;
    }
    return view;
  }
}

Container.propTypes = {
    contextIdReducer: PropTypes.object.isRequired,
    settingsReducer: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};


export default connectTool(TOOL_ID, LOCALE_DIR)(Container);
