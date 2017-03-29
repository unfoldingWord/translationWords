import React from 'react';
import View from './View.js';
// Api Consts
const api = window.ModuleApi;
<<<<<<< HEAD
import React from 'react'
import View from './View.js'
import TranslationWordsFetchData from './FetchData';
import ScripturePaneFetchData from '../ScripturePane/FetchData';
import VerseCheckFetchData from '../VerseCheck/FetchData';
import TranslationHelpsFetchData from '../TranslationHelps/FetchData';

//String constants
const NAMESPACE = "ImportantWords",
  UNABLE_TO_FIND_ITEM_IN_STORE = "Unable to find key in namespace",
  UNABLE_TO_FIND_WORD = "Unable to find wordobject";


  //Store Container in store to display
  class Container extends React.Component {
    constructor() {
      super();
      this.state = {
        currentFile: null,
        showHelps: true
      }
      this.saveProjectAndTimestamp = this.saveProjectAndTimestamp.bind(this);
      this.onCurrentCheckChange = this.onCurrentCheckChange.bind(this);
    }

    componentWillMount() {
      const { progress, addNewBible, addNewResource } = this.props;
      ScripturePaneFetchData(addNewBible, addNewResource, this.props, progress);
      TranslationHelpsFetchData(progress);
      VerseCheckFetchData(progress);
      TranslationWordsFetchData(addNewBible, addNewResource, this.props, progress, ()=>this.forceUpdate());
    }

    saveProjectAndTimestamp() {
      let { currentCheck, userdata, currentGroupIndex, currentCheckIndex } = this.props;
      let currentUser;
      if (userdata) {
        currentUser = userdata.username;
      } else {
        currentUser = "unknown";
      }
      let timestamp = new Date();
      currentCheck.user = currentUser;
      currentCheck.timestamp = timestamp;
      var commitMessage = 'user: ' + currentUser + ', namespace: ' + NAMESPACE +
        ', group: ' + currentGroupIndex + ', check: ' + currentCheckIndex;
      this.props.updateCurrentCheck(NAMESPACE, currentCheck);
    }

    /**
     * @description - updates the status of the current check in the
     * checkStoreReducer
     * @param {object} newCheckStatus - the new check status for the check
     */
    updateCheckStatus(newCheckStatus) {
      let { currentCheck, currentGroupIndex, currentCheckIndex } = this.props;
      if (currentCheck.checkStatus) {
        if (currentCheck.checkStatus === newCheckStatus) {
          currentCheck.checkStatus = "UNCHECKED";
          newCheckStatus = "UNCHECKED";
        } else {
          currentCheck.checkStatus = newCheckStatus;
        }
        this.props.updateCurrentCheck(NAMESPACE, currentCheck);
        this.saveProjectAndTimestamp();
      }
      let message = 'Current check was marked as: ' + newCheckStatus;
      this.props.showNotification(message, 4);
      this.handleSelectTab(2);
    }

    updateSelectedWords(wordObj, remove) {
      let currentCheck = this.props.currentCheck;
      if (remove) {
        this.removeFromSelectedWords(wordObj, currentCheck);
      } else {
        this.addSelectedWord(wordObj, currentCheck);
      }
=======
// String constants
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
>>>>>>> feature/update-reducer-props
    }

<<<<<<< HEAD
    addSelectedWord(wordObj, currentCheck) {
      let idFound = false;
      if (currentCheck.selectedWordsRaw.length > 0) {
        for (var i in currentCheck.selectedWordsRaw) {
          if (currentCheck.selectedWordsRaw[i].key == wordObj.key) {
            idFound = true;
          }
=======
  addSelectedWord(wordObj, currentCheck) {
    let {
      actions
    } = this.props;
    let idFound = false;
    if (currentCheck.selectedWordsRaw.length > 0) {
      for (var i in currentCheck.selectedWordsRaw) {
        if (currentCheck.selectedWordsRaw[i].key == wordObj.key) {
          idFound = true;
>>>>>>> feature/update-reducer-props
        }
        if (!idFound) {
          currentCheck.selectedWordsRaw.push(wordObj);
          this.sortSelectedWords(currentCheck.selectedWordsRaw);
        }
      } else {
        currentCheck.selectedWordsRaw.push(wordObj);
      }
<<<<<<< HEAD
      this.props.updateCurrentCheck(NAMESPACE, currentCheck);
      this.saveProjectAndTimestamp();
    }

    removeFromSelectedWords(wordObj, currentCheck) {
      let index = -1;
      if (currentCheck.selectedWordsRaw) {
        for (var i in currentCheck.selectedWordsRaw) {
          if (currentCheck.selectedWordsRaw[i].key == wordObj.key) {
            index = i;
          }
        }
        if (index != -1) {
          currentCheck.selectedWordsRaw.splice(index, 1);
=======
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
>>>>>>> feature/update-reducer-props
        }
      }
      this.props.updateCurrentCheck(NAMESPACE, currentCheck);
      this.saveProjectAndTimestamp();
    }
<<<<<<< HEAD
=======
    actions.updateCurrentCheck(NAMESPACE, currentCheck);
    this.saveProjectAndTimestamp();
  }
>>>>>>> feature/update-reducer-props

    sortSelectedWords(selectedWords) {
      selectedWords.sort(function (first, next) {
        return first.key - next.key;
      });
    }

<<<<<<< HEAD
    getVerse(language) {
      var currentCheck = this.props.currentCheck;
      var currentVerseNumber = currentCheck.verse;
      var verseEnd = currentCheck.verseEnd || currentVerseNumber;
      var currentChapterNumber = currentCheck.chapter;
      var desiredLanguage = this.props.bibles[language];
      try {
        if (desiredLanguage) {
          debugger;
          let verse = "";
          for (let v = currentVerseNumber; v <= verseEnd; v++) {
            verse += (desiredLanguage[currentChapterNumber][v] + " \n ");
          }
          return verse;
=======
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
>>>>>>> feature/update-reducer-props
        }
      }
      catch (e) {
      }
<<<<<<< HEAD
    }

    goToPrevious() {
      this.props.handleGoToPrevious(NAMESPACE);
    }

    goToNext() {
      this.props.handleGoToNext(NAMESPACE);
    }

    handleSelectTab(tabKey) {
      this.setState({ tabKey });
    }

    onCurrentCheckChange(newCurrentCheck, proposedChangesField) {
      let currentCheck = this.props.currentCheck;
      currentCheck.proposedChanges = newCurrentCheck.proposedChanges;
      currentCheck.comment = newCurrentCheck.comment;
      if (proposedChangesField) {
        currentCheck[proposedChangesField] = newCurrentCheck[proposedChangesField];
      }
      this.currentCheck = currentCheck;
      this.props.updateCurrentCheck(NAMESPACE, currentCheck);
      this.saveProjectAndTimestamp();
    }

    toggleHelps() {
      this.setState({ showHelps: !this.state.showHelps });
    }

    render() {
      console.log(this.props);
      if (!this.props.groups) return <div></div>;
      let dragToSelect = false;
      if (this.props.currentSettings.textSelect === 'drag') {
        dragToSelect = true;
      }
      let direction = this.props.params.direction == 'ltr' ? 'ltr' : 'rtl';
      let gatewayVerse = '';
      let targetVerse = '';
      if (this.props.currentCheck) {
        gatewayVerse = this.getVerse('gatewayLanguage');
        targetVerse = this.getVerse('targetLanguage');
      }
      var currentWord = this.props.groups[this.props.currentGroupIndex].group;
      var wordObject;
      let currentFile = '';
      var wordList = this.props.translationWords || null;
      if (wordList && currentWord) {
        wordObject = search(wordList, function (item) {
          return stringCompare(currentWord, item.name);
        });
      }
      try {
        currentFile = wordObject.file;
      } catch (e) {
      }
      return (
        <View
          {...this.props}
          currentCheck={this.props.currentCheck}
          updateCurrentCheck={(newCurrentCheck, proposedChangesField) => {
            this.onCurrentCheckChange(newCurrentCheck, proposedChangesField)
          }}
          bookName={this.props.book}
          currentFile={currentFile}
          gatewayVerse={gatewayVerse}
          targetVerse={targetVerse}
          dragToSelect={dragToSelect}
          direction={direction}
          tabKey={this.state.tabKey}
          updateSelectedWords={this.updateSelectedWords.bind(this)}
          updateCheckStatus={this.updateCheckStatus.bind(this)}
          handleSelectTab={this.handleSelectTab.bind(this)}
          goToPrevious={this.goToPrevious.bind(this)}
          goToNext={this.goToNext.bind(this)}
          showHelps={this.state.showHelps}
          toggleHelps={this.toggleHelps.bind(this)}
        />
      );
    }
=======
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

  handleSelectTab(tabKey) {
    this.setState({tabKey});
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
>>>>>>> feature/update-reducer-props
  }



<<<<<<< HEAD
  /**
  * Compares two string alphabetically
  * @param {string} first - string to be compared against
  * @param {string} second - string to be compared with
  */
  function stringCompare(first, second) {
    if (first < second) {
      return -1;
    }
    else if (first > second) {
      return 1;
    }
    else {
      return 0;
    }
=======
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
>>>>>>> feature/update-reducer-props
  }
}

<<<<<<< HEAD
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
    }
    else if (result > 0) {
      return search(list, boolFunction, mid + 1, last);
    }
    else {
      return list[mid];
    }
=======
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
>>>>>>> feature/update-reducer-props
  }
}


module.exports = {
  name: NAMESPACE,
  container: Container
};
