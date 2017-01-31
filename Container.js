
const api = window.ModuleApi;
const React = api.React;
const EventListeners = require('./js/ViewEventListeners.js');
const View = require('./View.js');

//String constants
const NAMESPACE = "ImportantWords",
  UNABLE_TO_FIND_LANGUAGE = "Unable to find language from the store",
  UNABLE_TO_FIND_ITEM_IN_STORE = "Unable to find key in namespace",
  UNABLE_TO_FIND_WORD = "Unable to find wordobject";

//Other constants
const extensionRegex = new RegExp('\\.\\w+\\s*$');

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
        currentCheck: null,
        currentTranslationWordFile: null,
        book: null,
        currentWord: null,
        currentFile: null,
        tabKey: 1
    }
    this.updateState = this.updateState.bind(this);
    this.changeCurrentCheckInCheckStore = this.changeCurrentCheckInCheckStore.bind(this);
    this.updateCheckStatus = this.updateCheckStatus.bind(this);
    this.goToNextListener = EventListeners.goToNext.bind(this);
    this.goToPreviousListener = EventListeners.goToPrevious.bind(this);
    this.goToCheckListener = EventListeners.goToCheck.bind(this);
    this.changeCheckTypeListener = EventListeners.changeCheckType.bind(this);
	}

  componentWillMount() {
    api.registerEventListener('goToNext', this.goToNextListener);
    api.registerEventListener('goToPrevious', this.goToPreviousListener);
    api.registerEventListener('goToCheck', this.goToCheckListener);
    api.registerEventListener('changeCheckType', this.changeCheckTypeListener);
    this.updateState();
  }

  /**
   * This method is necessary because on the first mount of the ImportantWords all of it's listeners
   * won't be mounted yet, so necessary to emit its events
   */
  componentDidMount() {
    //this should already be set in the state from componentWillMount
    var currentCheck = this.state.currentCheck;
    if (currentCheck) {
      //Let Scripture Pane know to scroll to are current verse
      api.emitEvent('goToVerse', {chapterNumber: currentCheck.chapter, verseNumber: currentCheck.verse});
    }
  }

  componentWillUnmount() {
    api.removeEventListener('goToNext', this.goToNextListener);
    api.removeEventListener('goToPrevious', this.goToPreviousListener);
    api.removeEventListener('goToCheck', this.goToCheckListener);
    api.removeEventListener('changeCheckType', this.changeCheckTypeListener);
  }

  getCurrentCheck() {
    var groups = api.getDataFromCheckStore(NAMESPACE, 'groups');
    var currentGroupIndex = api.getDataFromCheckStore(NAMESPACE, 'currentGroupIndex');
    var currentCheckIndex = api.getDataFromCheckStore(NAMESPACE, 'currentCheckIndex');
    var currentCheck = groups[currentGroupIndex]['checks'][currentCheckIndex];
    this.setState(currentCheck);
    return currentCheck;
  }

  updateUserAndTimestamp() {
    let currentCheck = this.getCurrentCheck();
    let currentUser = api.getLoggedInUser();
    let timestamp = new Date();
    currentCheck.user = currentUser;
    currentCheck.timestamp = timestamp;
  }

  /**
   * @description - updates the status of the check that is the current check in the check store
   * @param {object} newCheckStatus - the new status chosen by the user
   */
  updateCheckStatus(newCheckStatus, selectedWords) {
    var groups = api.getDataFromCheckStore(NAMESPACE, 'groups');
    var currentGroupIndex = api.getDataFromCheckStore(NAMESPACE, 'currentGroupIndex');
    var currentCheckIndex = api.getDataFromCheckStore(NAMESPACE, 'currentCheckIndex');
    var currentCheck = groups[currentGroupIndex]['checks'][currentCheckIndex];
    if (currentCheck.checkStatus) {
      currentCheck.checkStatus = newCheckStatus;
      api.emitEvent('changedCheckStatus', {
        groupIndex: currentGroupIndex,
        checkIndex: currentCheckIndex,
        checkStatus: newCheckStatus
      });
      this.updateUserAndTimestamp();
    }
    this.updateState();
    api.Toast.info('Current check was marked as:', newCheckStatus, 2);
  }

  updateSelectedWords(wordObj, remove) {
    let currentCheck = this.getCurrentCheck();
    if(remove){
      this.removeFromSelectedWords(wordObj, currentCheck);
    }else{
      this.addSelectedWord(wordObj, currentCheck);
    }
     this.updateState();
    //the code below dont seen be needed
    //currentCheck.selectedWords = selectedWords;
    //currentCheck.selectionRange = selectionRange;
  }

  addSelectedWord(wordObj, currentCheck){
    let selectedWords = [];
    let idFound = false;
    if(currentCheck.selectedWordsRaw){
      for (var i in currentCheck.selectedWordsRaw) {
        if (currentCheck.selectedWordsRaw[i].key == wordObj.key) {
          idFound = true;
        }
      }
      if (!idFound) {
        currentCheck.selectedWordsRaw.push(wordObj);
        this.sortSelectedWords(currentCheck.selectedWordsRaw);
      }
    }else{
      selectedWords.push(wordObj);
      currentCheck.selectedWordsRaw = selectedWords;
    }
  }

  removeFromSelectedWords(wordObj, currentCheck) {
    let index = -1;
    if(currentCheck.selectedWordsRaw){
      for (var i in currentCheck.selectedWordsRaw) {
        if (currentCheck.selectedWordsRaw[i].key == wordObj.key) {
          index = i;
        }
      }
      if (index != -1) {
        currentCheck.selectedWordsRaw.splice(index, 1);
      }
    }
  }

  sortSelectedWords(selectedWords) {
    selectedWords.sort(function(first, next) {
      return first.key - next.key;
    });
  }

  /**
   * @description - This returns the currently selected words, but formats in
   * an array with adjacent words concatenated into one string
   */
  getWords() {
    var lastKey = -100;
    var returnArray = [];
    for (var wordObj of this.selectedWords){
      if (lastKey < wordObj.key - 1) {
        returnArray.push(wordObj.word);
        lastKey = wordObj.key
      }
      else if (lastKey == wordObj.key - 1) {
        var lastWord = returnArray.pop();
        lastWord += ' ' + wordObj.word;
        returnArray.push(lastWord);
        lastKey = wordObj.key
      }
    }
    return returnArray;
  }

  /**
   * @description - This is used to change our current check index and group index within the store
   * @param {object} newGroupIndex - the group index of the check selected in the navigation menu
   * @param {object} newCheckIndex - the group index of the check selected in the navigation menu
   */
  changeCurrentCheckInCheckStore(newGroupIndex, newCheckIndex) {
    let currentCheck = this.getCurrentCheck();
    let loggedInUser = api.getLoggedInUser();
    let userName = loggedInUser ? loggedInUser.userName : 'GUEST_USER';
    let groups = api.getDataFromCheckStore(NAMESPACE, 'groups');
    let currentGroupIndex = api.getDataFromCheckStore(NAMESPACE, 'currentGroupIndex');
    let currentCheckIndex = api.getDataFromCheckStore(NAMESPACE, 'currentCheckIndex');
    //error check to make sure we're going to a legal group/check index
    if (newGroupIndex !== undefined && newCheckIndex !== undefined) {
      if (newGroupIndex < groups.length && newGroupIndex >= 0) {
        api.putDataInCheckStore(NAMESPACE, 'currentGroupIndex', newGroupIndex);
        if (newCheckIndex < groups[currentGroupIndex].checks.length && newCheckIndex >= 0) {
          api.putDataInCheckStore(NAMESPACE, 'currentCheckIndex', newCheckIndex);
        }
        /* In the case that we're incrementing the check and now we're out of bounds
          * of the group, we increment the group.
          */
        else if (newCheckIndex == groups[currentGroupIndex].checks.length &&
            currentGroupIndex < groups.length - 1) {
          api.putDataInCheckStore(NAMESPACE, 'currentGroupIndex', currentGroupIndex + 1);
          api.putDataInCheckStore(NAMESPACE, 'currentCheckIndex', 0);
        }
        /* In the case that we're decrementing the check and now we're out of bounds
          * of the group, we decrement the group.
          */
        else if (newCheckIndex == -1 && currentGroupIndex > 0) {
          let newGroupLength = groups[currentGroupIndex - 1].checks.length;
          api.putDataInCheckStore(NAMESPACE, 'currentGroupIndex', currentGroupIndex - 1);
          api.putDataInCheckStore(NAMESPACE, 'currentCheckIndex', newGroupLength - 1);
        }
        //invalid indices: don't do anything else
        else {
          return;
        }
      }
    }
    //Save Project
    var commitMessage = 'user: ' + userName + ', namespace: ' + NAMESPACE +
        ', group: ' + currentGroupIndex + ', check: ' + currentCheckIndex;
    api.saveProject(commitMessage);
    //Display toast notification
    if(currentCheck.checkStatus){
      if(currentCheck.checkStatus !== 'UNCHECKED'){
        api.Toast.success('Check data was successfully saved', '', 2);
      }
    }
    // Update state to render the next check
    this.updateState();
  }

  /**
   * @description - This method grabs the information that is currently in the
   * store and uses it to update our state which in turn updates our view. This method is
   * typically called after the store is updated so that our view updates to the latest
   * data found in the store
   */
  updateState() {
    var currentGroupIndex = api.getDataFromCheckStore(NAMESPACE, 'currentGroupIndex');
    var currentCheckIndex = api.getDataFromCheckStore(NAMESPACE, 'currentCheckIndex');
    if (currentGroupIndex === null || currentCheckIndex === null) {
      console.warn("ImportantWords Check wasn't able to retrieve its indices");
      return;
    }
    var currentCheck = api.getDataFromCheckStore(NAMESPACE, 'groups')[currentGroupIndex]['checks'][currentCheckIndex];
    var currentWord = api.getDataFromCheckStore(NAMESPACE, 'groups')[currentGroupIndex].group;
    this.setState({
      book: api.getDataFromCheckStore(NAMESPACE, 'book'),
      currentCheck: currentCheck,
      currentWord: currentWord,
      currentFile: this.getWordFile(currentWord)
    });
    api.emitEvent('goToVerse', {chapterNumber: currentCheck.chapter, verseNumber: currentCheck.verse});
  }

  /**
   * @description - This retrieves the translationWord file from the store so that we
   * can pass it as a prop to the ImportantWords display
   */
  getWordFile(word) {
    var wordObject = this.getWordObject(word);
    if (wordObject && wordObject.file) {
      return wordObject.file;
    }
    else {
      console.error(UNABLE_TO_FIND_WORD + ": " + word);
    }
  }

  /**
   * @description - This is a helper method to get a prepoccessed word's data
   * @param {string} word - the word's object to be retrieved from the CheckStore
   */
  getWordObject(word) {
    var wordList = api.getDataFromCheckStore('TranslationHelps', 'wordList');
    if (wordList) {
      var wordObject = search(wordList, function(item) {
          return stringCompare(word ,item.name);
      });
      return wordObject;
    }
    else {
      console.error(UNABLE_TO_FIND_ITEM_IN_STORE + ": wordList");
    }
  }

  /**
   * @description - Helper method for retrieving the verse from different languages
   * @param {string} language - string denoting either 'gatewayLanguage' or 'targetLanguage'
   * that will be used to index into the 'common' namespace within CheckStore
   */
  getVerse(language) {
    var currentCheck = this.state.currentCheck;
    var currentVerseNumber = currentCheck.verse;
    var currentChapterNumber = currentCheck.chapter;
    var actualLanguage = api.getDataFromCommon(language);
    try {
      if (actualLanguage) {
        return actualLanguage[currentChapterNumber][currentVerseNumber];
      }
    }catch(e){
    }
  }

  goToPrevious() {
    api.emitEvent('goToPrevious');
  }

  goToNext() {
    api.emitEvent('goToNext');
  }

  handleSelectTab(tabKey){
     this.setState({tabKey});
  }

  updateCurrentCheck(newCurrentCheck, proposedChangesField){
    let currentCheck = this.getCurrentCheck();
    currentCheck.proposedChanges = newCurrentCheck.proposedChanges;
    currentCheck.comment = newCurrentCheck.comment;
    currentCheck[proposedChangesField] = newCurrentCheck[proposedChangesField];
    api.saveProject();
  }

   render() {
    if (!this.state.currentCheck) {
      return (<div></div>);
    }
    else {
      let dragToSelect = false;
      if(api.getSettings('textSelect') === 'drag'){
        dragToSelect = true;
      }
      let bookName = api.getDataFromCommon("tcManifest").ts_project.name;
      let proposedChangesStore = api.getDataFromCheckStore('ProposedChanges');
      let commentBoxStore = api.getDataFromCheckStore('CommentBox');
      let direction = api.getDataFromCommon('params').direction == 'ltr' ? 'ltr' : 'rtl';
      let gatewayVerse = this.getVerse('gatewayLanguage');
      let targetVerse = this.getVerse('targetLanguage');
      return (
        <View
          currentCheck={this.state.currentCheck}
          updateCurrentCheck={this.updateCurrentCheck.bind(this)}
          bookName={bookName}
          currentFile={this.state.currentFile}
          gatewayVerse={gatewayVerse}
          targetVerse={targetVerse}
          dragToSelect={dragToSelect}
          direction={direction}
          tabKey={this.state.tabKey}
          commentBoxStore={commentBoxStore}
          proposedChangesStore={proposedChangesStore}
          updateSelectedWords={this.updateSelectedWords.bind(this)}
          updateCheckStatus={this.updateCheckStatus.bind(this)}
          handleSelectTab={this.handleSelectTab.bind(this)}
          goToPrevious={this.goToPrevious.bind(this)}
          goToNext={this.goToNext.bind(this)}
        />
      );
    }
  }
}


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
    }
    else if (result > 0) {
      return search(list, boolFunction, mid + 1, last);
    }
  else {
      return list[mid];
    }
  }


module.exports = {
  name: NAMESPACE,
  container: Container
}
