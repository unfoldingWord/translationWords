import React from 'react';
import View from './View.js';
import {connectTool} from 'tc-tool';
import path from 'path';
import PropTypes from 'prop-types';

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
    const {actions, settingsReducer} = this.props;
    let {ScripturePane} = settingsReducer.toolsSettings;
    if (!ScripturePane) {
      // initializing the ScripturePane settings if not found.
      actions.setToolSettings('ScripturePane', 'currentPaneSettings', ['ulb']);
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
      return (
        <View
          {...this.props}
          translate={translate}
          showHelps={this.state.showHelps}
          toggleHelps={this.toggleHelps.bind(this)}
        />
      );
    } else {
      return <div/>;
    }
  }
}

Container.propTypes = {
  contextIdReducer: PropTypes.object.isRequired,
  settingsReducer: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  translate: PropTypes.func,
};

export default connectTool(TOOL_ID, LOCALE_DIR)(Container);
