import React from 'react';
import View from './View.js';
// import TranslationWordsFetchData from './FetchData';
// import ScripturePaneFetchData from '../ScripturePane/FetchData';
// import VerseCheckFetchData from '../VerseCheck/FetchData';
// import TranslationHelpsFetchData from '../TranslationHelps/FetchData';
import FetchData from './FetchData'
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
    let { progress, addNewBible, addNewResource, setModuleSettings, addGroupData, addGroupIndex } = actions;
    let props = {
      params: projectDetailsReducer.params,
      manifest: projectDetailsReducer.manifest,
      bibles: resourcesReducer.bibles
    };
    FetchData(this.props);
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
    console.log("tW Container.js", this.props)
    let currentFile = ""
    if (this.props.resourcesReducer.translationWords !== undefined) {
      let wordsObjectArray = this.props.resourcesReducer.translationWords.filter( (wordObject) => {
        let word = this.props.contextIdReducer.contextId.quote
        return wordObject.aliases.includes(word)
      })
      currentFile = wordsObjectArray[0].file
    }

    return (
      <View
        {...this.props}
        updateCurrentCheck={(newCurrentCheck, proposedChangesField) => {
          this.onCurrentCheckChange(newCurrentCheck, proposedChangesField);
        }}
        currentFile={currentFile}
        goToPrevious={this.goToPrevious.bind(this)}
        goToNext={this.goToNext.bind(this)}
        showHelps={this.state.showHelps}
        toggleHelps={this.toggleHelps.bind(this)}
      />
    );
  }
}

module.exports = {
  name: NAMESPACE,
  container: Container
};
