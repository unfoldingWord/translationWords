import React from 'react';
import View from './View.js';
import fetchData from './FetchData/main';
// Constant declarations
const NAMESPACE = "translationWords";

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      showHelps: true
    };
  }

  toggleHelps() {
    this.setState({ showHelps: !this.state.showHelps });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.contextIdReducer && this.props.contextIdReducer !== nextProps.contextIdReducer) {
      let articleId = nextProps.contextIdReducer.contextId.groupId;
      nextProps.actions.loadResourceArticle('translationWords', articleId);
    }
  }

  render() {
    let view = <div />;
    let { contextId } = this.props.contextIdReducer;
    if (contextId !== null) {
      view = <View
        {...this.props}
        showHelps={this.state.showHelps}
        toggleHelps={this.toggleHelps.bind(this)}
      />
    }
    return view;
  }
}

module.exports = {
  name: NAMESPACE,
  container: Container,
  fetchData: fetchData
};
