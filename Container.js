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
    //This will make sure that the anything triggered by the 
    //DONE_LOADING action will be called at the right time.
    this.props.actions.isDataFetched(true);
    //This will make sure that the data will not be fetched twice when 
    //the component receives new props.
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.currentToolReducer.isDataFetched) {
      //This will make sure that the data will not be fetched twice
      FetchData(nextProps).then(this.props.actions.doneLoading);
      //This will make sure that the anything triggered by the 
      //DONE_LOADING action will be called at the right time.
      nextProps.actions.isDataFetched(true);
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
