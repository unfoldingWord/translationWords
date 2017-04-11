import React from 'react';
import View from './View.js';
import FetchData from './FetchData/main'
// Api Consts
const api = window.ModuleApi;
const NAMESPACE = "ImportantWords";
const TranslationWordsFetcher = require('./translation_words/TranslationWordsFetcher.js');
const tWFetcher = new TranslationWordsFetcher();
const wordList = tWFetcher.getWordList();

class Container extends React.Component {
  constructor() {
    super()
    this.state = {
      currentFile: null,
      showHelps: true
    }
  }

  componentWillMount() {
    FetchData(this.props).then(this.props.actions.doneLoading);
    this.props.actions.dataFetched(true);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.currentToolReducer.dataFetched) {
      FetchData(nextProps).then(this.props.actions.doneLoading);
      nextProps.actions.dataFetched(true);
    }
  }

  toggleHelps() {
    this.setState({ showHelps: !this.state.showHelps })
  }

  currentFile(groupId, wordList) {
    let currentFile = ""
    if (wordList.constructor == Array) {
      let wordsObjectArray = wordList.filter((wordObject) => {
        return wordObject.name === groupId + '.txt'
      })
      currentFile = wordsObjectArray[0].file
    }
    return currentFile
  }

  view() {
    let view = <div />
    let { contextId } = this.props.contextIdReducer
    let { translationWords } = this.props.resourcesReducer

    if (contextId !== null) {
      view = <View
        {...this.props}
        currentFile={this.currentFile(contextId.groupId, wordList)}
        showHelps={this.state.showHelps}
        toggleHelps={this.toggleHelps.bind(this)}
      />
    }
    return view
  }

  render() {
    return (
      this.view()
    );
  }
}

module.exports = {
  name: NAMESPACE,
  container: Container
};
