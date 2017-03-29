import React from 'react';
import View from './View.js';
// Api Consts
const api = window.ModuleApi;
// String constants
const NAMESPACE = "ImportantWords";

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
    this.addTargetLanguageToChecks();
  }

  componentWillReceiveProps(nextProps) {
    let checkStatus = nextProps.currentCheck.checkStatus;
    nextProps.currentCheck.isCurrentItem = true;
    if (JSON.stringify(this.currentCheck) === JSON.stringify(nextProps.currentCheck)) {
      return;
    } else {
      this.currentCheck = nextProps.currentCheck;
    }
    if (checkStatus === "FLAGGED") {
      this.setState({tabKey: 2});
    } else {
      this.setState({tabKey: 1});
    }
  }

  addTargetLanguageToChecks() {
    let {
      checkStoreReducer
    } = this.props;
    let groups = checkStoreReducer.groups;
    var targetLanguage = api.getDataFromCommon('targetLanguage');
    for (var group in groups) {
      for (var item in groups[group].checks) {
        var co = groups[group].checks[item];
        try {
          var targetAtVerse = targetLanguage[co.chapter][co.verse];
          groups[group].checks[item].targetLanguage = targetAtVerse;
        } catch (err) {
          // Happens with incomplete books.
        }
      }
    }
    api.putDataInCheckStore(NAMESPACE, 'groups', groups);
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

  /**
   * @description - updates the status of the current check in the
   * checkStoreReducer
   * @param {object} newCheckStatus - the new check status for the check
   */
  updateCheckStatus(newCheckStatus) {
    let {
      checkStoreReducer,
      actions
    } = this.props;
    let {currentCheck} = checkStoreReducer;
    if (currentCheck.checkStatus) {
      if (currentCheck.checkStatus === newCheckStatus) {
        currentCheck.checkStatus = "UNCHECKED";
        newCheckStatus = "UNCHECKED";
      } else {
        currentCheck.checkStatus = newCheckStatus;
      }
      actions.updateCurrentCheck(NAMESPACE, currentCheck);
      this.saveProjectAndTimestamp();
    }
    let message = 'Current check was marked as: ' + newCheckStatus;
    actions.showNotification(message, 4);
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
    this.setState({showHelps: !this.state.showHelps});
  }

  render() {
    console.log(this.props);
    let {
      checkStoreReducer,
      settingsReducer
    } = this.props;
    let dragToSelect = false;
    if (settingsReducer.currentSettings.textSelect === 'drag') {
      dragToSelect = true;
    }
    // let direction = api.getDataFromCommon('params').direction ?  === 'ltr' ? 'ltr' : 'rtl';
    let direction = 'ltr';
    let gatewayVerse = '';
    let targetVerse = '';
    if (checkStoreReducer.currentCheck) {
      gatewayVerse = this.getVerse('gatewayLanguage');
      targetVerse = this.getVerse('targetLanguage');
    }
    var currentWord = checkStoreReducer.groups[checkStoreReducer.currentGroupIndex].group;
    var wordObject;
    let currentFile = '';
    var wordList = api.getDataFromCheckStore('TranslationHelps', 'wordList');
    if (wordList && currentWord) {
      wordObject = search(wordList, function(item) {
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
        updateCurrentCheck={(newCurrentCheck, proposedChangesField) => {
          this.onCurrentCheckChange(newCurrentCheck, proposedChangesField);
        }}
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
