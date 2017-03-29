import React from 'react';
import View from './View.js';
import TranslationWordsFetchData from './FetchData';
import ScripturePaneFetchData from '../ScripturePane/FetchData';
import VerseCheckFetchData from '../VerseCheck/FetchData';
import TranslationHelpsFetchData from '../TranslationHelps/FetchData';
// Api Consts
const api = window.ModuleApi;
const NAMESPACE = "ImportantWords";
const TranslationWordsFetcher = require('./translation_words/TranslationWordsFetcher.js');
const tWFetcher = new TranslationWordsFetcher();
const wordList = tWFetcher.getWordList();

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      currentFile: null,
      showHelps: true
    };
    this.saveProjectAndTimestamp = this.saveProjectAndTimestamp.bind(this);
    this.onCurrentCheckChange = this.onCurrentCheckChange.bind(this);
  }

  componentWillMount() {
    let { resourcesReducer, projectDetailsReducer, actions } = this.props;
    let { progress, addNewBible, addNewResource } = actions;
    let props = {
      params: projectDetailsReducer.params,
      manifest: projectDetailsReducer.manifest,
      bibles: resourcesReducer.bibles
    };
    ScripturePaneFetchData(addNewBible, addNewResource, props, progress);
    TranslationHelpsFetchData(progress);
    VerseCheckFetchData(progress);
    TranslationWordsFetchData(addNewBible, addNewResource, props, progress, () => this.forceUpdate());
  }

  saveProjectAndTimestamp() {
    let {
      checkStoreReducer,
      loginReducer,
      actions
    } = this.props;
    let {currentCheck} = checkStoreReducer;
    let currentUser;
    if (loginReducer.userdata) {
      currentUser = loginReducer.userdata.username;
    } else {
      currentUser = "unknown";
    }
    let timestamp = new Date();
    currentCheck.user = currentUser;
    currentCheck.timestamp = timestamp;
    actions.updateCurrentCheck(NAMESPACE, currentCheck);
  }

  updateSelectedWords(wordObj, remove) {
    let {
      checkStoreReducer
    } = this.props;
    let {currentCheck} = checkStoreReducer;
    if (remove) {
      this.removeFromSelectedWords(wordObj, currentCheck);
    } else {
      this.addSelectedWord(wordObj, currentCheck);
    }
  }

  addSelectedWord(wordObj, currentCheck) {
    let {
      actions
    } = this.props;
    let idFound = false;
    if (currentCheck.selectedWordsRaw.length > 0) {
      for (var i in currentCheck.selectedWordsRaw) {
        if (currentCheck.selectedWordsRaw[i].key == wordObj.key) {
          idFound = true;
        }
      }
      if (!idFound) {
        currentCheck.selectedWordsRaw.push(wordObj);
        this.sortSelectedWords(currentCheck.selectedWordsRaw);
      }
    } else {
      currentCheck.selectedWordsRaw.push(wordObj);
    }
    actions.updateCurrentCheck(NAMESPACE, currentCheck);
    this.saveProjectAndTimestamp();
  }

  removeFromSelectedWords(wordObj, currentCheck) {
    let {
      actions
    } = this.props;
    let index = -1;
    if (currentCheck.selectedWordsRaw) {
      for (var i in currentCheck.selectedWordsRaw) {
        if (currentCheck.selectedWordsRaw[i].key == wordObj.key) {
          index = i;
        }
      }
      if (index != -1) {
        currentCheck.selectedWordsRaw.splice(index, 1);
      }
    }
    actions.updateCurrentCheck(NAMESPACE, currentCheck);
    this.saveProjectAndTimestamp();
  }

  sortSelectedWords(selectedWords) {
    selectedWords.sort(function(first, next) {
      return first.key - next.key;
    });
  }

  getVerse(language) {
    let {
      checkStoreReducer
    } = this.props;
    var currentCheck = checkStoreReducer.currentCheck;
    var currentVerseNumber = currentCheck.verse;
    var verseEnd = currentCheck.verseEnd || currentVerseNumber;
    var currentChapterNumber = currentCheck.chapter;
    var desiredLanguage = api.getDataFromCommon(language);
    try {
      if (desiredLanguage) {
        let verse = "";
        for (let v = currentVerseNumber; v <= verseEnd; v++) {
          verse += (desiredLanguage[currentChapterNumber][v] + " \n ");
        }
        return verse;
      }
    } catch (e) {
    }
  }

  goToPrevious() {
    let {actions} = this.props;
    actions.handleGoToPrevious(NAMESPACE);
  }

  goToNext() {
    let {actions} = this.props;
    actions.handleGoToNext(NAMESPACE);
  }

  onCurrentCheckChange(newCurrentCheck, proposedChangesField) {
    let {
      checkStoreReducer,
      actions
    } = this.props;
    let currentCheck = checkStoreReducer.currentCheck;
    currentCheck.proposedChanges = newCurrentCheck.proposedChanges;
    currentCheck.comment = newCurrentCheck.comment;
    if (proposedChangesField) {
      currentCheck[proposedChangesField] = newCurrentCheck[proposedChangesField];
    }
    this.currentCheck = currentCheck;
    actions.updateCurrentCheck(NAMESPACE, currentCheck);
    this.saveProjectAndTimestamp();
  }

  toggleHelps() {
    this.setState({showHelps: !this.state.showHelps})
  }

  render() {
    console.log(this.props)
    let {
      checkStoreReducer,
      settingsReducer,
      resourcesReducer,
      contextIdReducer
    } = this.props
    let reference = contextIdReducer.contextId.reference
    let bibles = resourcesReducer.bibles
    let gatewayVerse = ''
    let targetVerse = bibles.targetLanguage[reference.chapter][reference.verse]
    let currentWord = this.props.contextIdReducer.contextId.quote
    var wordObject
    let currentFile = ''
    console.log(currentWord, wordList)
    // if (wordList && currentWord) {
    //   wordObject = search(wordList, function(item) {
    //     return stringCompare(currentWord, item.name);
    //   })
    // }
    try {
      currentFile = wordObject.file;
    } catch (e) {
    }
    return (
      <View
        {...this.props}
        currentFile={currentFile}
        gatewayVerse={gatewayVerse}
        targetVerse={targetVerse}
        goToPrevious={this.goToPrevious.bind(this)}
        goToNext={this.goToNext.bind(this)}
        showHelps={this.state.showHelps}
        toggleHelps={this.toggleHelps.bind(this)}
      />
    );
  }
}



/**
* @description Compares two string alphabetically.
* @param {string} first - string to be compared against.
* @param {string} second - string to be compared with.
*/
function stringCompare(first, second) {
  if (first < second) {
    return -1;
  } else if (first > second) {
    return 1;
  } else {
    return 0;
  }
}

/**
* @description - Binary search of the list. I couldn't find this in the native methods of an array so
* I wrote it
* @param {array} list - array of items to be searched
* @param {function} boolFunction - returns # < 0, # > 0. or 0 depending on which path the
* search should take
* @param {int} first - beginnging of the current partition of the list
* @param {int} second - end of the current partition of the list
*/
function search(list, boolFunction, first = 0, last = -1) {
  if (last == -1) {
    last = list.length;
  }
  if (first > last) {
    return;
  }
  var mid = Math.floor(((first - last) * 0.5)) + last;
  var result = boolFunction(list[mid]);
  if (result < 0) {
    return search(list, boolFunction, first, mid - 1);
  } else if (result > 0) {
    return search(list, boolFunction, mid + 1, last);
  } else {
    return list[mid];
  }
}


module.exports = {
  name: NAMESPACE,
  container: Container
};