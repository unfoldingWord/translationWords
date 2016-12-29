//TargetVerseDisplay.js//

const api = window.ModuleApi;
const React = api.React;
const TargetWord = require('./TargetWord');

var natural = require('natural');
var XRegExp = require('xregexp');
var nonUnicodeLetter = XRegExp('\\PL');

//Wordlength tokenizer
const tokenizer = new natural.RegexpTokenizer({pattern: nonUnicodeLetter});

class TargetLanguageSelectBox extends React.Component {
  constructor(){
    super();
    this.selectedWords = [];
  }

  
  generateWordArray() {
    if (this.props.verse) {
      var words = tokenizer.tokenize(this.props.verse);
    } else {
      var words = [];
    }
    var wordArray = [],
      index = 0,
      tokenKey = 1,
      wordKey = 0;
    for (var word of words) {
      var wordIndex = this.props.verse.indexOf(word, index);
      if (wordIndex > index) {
        wordArray.push(
          <span
            key={wordKey++}
            style={{cursor: 'pointer'}}
          >
            {this.props.verse.substring(index, wordIndex)}
          </span>
        );
      }
      let highlighted = false;
      console.log(this.props.currentCheck.selectedWordsRaw);
      if(this.props.currentCheck.selectedWordsRaw){
        let selectedWordsRaw = this.props.currentCheck.selectedWordsRaw;
        for(var foundWord in selectedWordsRaw){
          if(selectedWordsRaw[foundWord].word === word && selectedWordsRaw[foundWord].key === tokenKey){
            highlighted = true;
          }
        }
      }
      console.log(highlighted);
      wordArray.push(
        <TargetWord
          word={word}
          key={wordKey++}
          keyId={tokenKey}
          style={{cursor: 'pointer'}}
          addSelectedWord={this.addSelectedWord.bind(this)}
          removeSelectedWord={this.removeFromSelectedWords.bind(this)}
          highlighted={highlighted}
          ref={tokenKey.toString()}
        />
      );
      tokenKey++;
      index = wordIndex + word.length;
    }
    return wordArray;
  }
/*

  toggleHighlight() {
    if (!this.state.highlighted) {
      this.props.selectCallback(this.state.wordObj);
    }
    else {
      this.props.removeCallback(this.state.wordObj);
    }
    this.setState({highlighted: !this.state.highlighted}); // this sets React to re-render the component
  }*/

  addSelectedWord(wordObj) {
    // check to see if we already have this word
    // an inefficient search, but shouldn't have >20 words to search through
    var idFound = false;
    for (var i = 0; i < this.selectedWords.length; i++) {
      if (this.selectedWords[i].key == wordObj.key) {
        idFound = true;
      }
    }
    if (!idFound) {
      this.selectedWords.push(wordObj);
      this.sortSelectedWords();
    }
    this.props.onWordSelected(this.getWords(), this.getWordsRaw());
  }

  removeFromSelectedWords(wordObj) {
  // get the word's index
    var index = -1;
    for (var i = 0; i < this.selectedWords.length; i++) {
      if (this.selectedWords[i].key == wordObj.key) {
        index = i;
      }
    }
    if (index != -1) {
      this.selectedWords.splice(index, 1);
    }
    this.props.onWordSelected(this.getWords(), this.getWordsRaw());

    //This is used for if you want to disable the buttons if no words are selected
    // if (this.selectedWords.length <= 0) {
    //   this.props.buttonDisableCallback();
    // }
  }

/* Sorts the selected words by their 'key' attribute */
  sortSelectedWords() {
    this.selectedWords.sort(function(first, next) {
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
   * @description - This returns the array object of word objects so that the data can be persistent
   */
  getWordsRaw() {
    return this.selectedWords;
  }

  render() {
    return (
      <div
        bsSize={'small'}
        style={{
          overflowY: "scroll",
          minHeight: '128px',
          marginBottom: '5px',
          padding: '9px'
        }}
      >
        <div style={{
              direction: api.getDataFromCommon('params').direction == 'ltr' ? 'ltr' : 'rtl'
            }}
            onMouseUp={this.textSelected}
            className="TargetVerseSelectionArea"
        >
          {this.generateWordArray()}
        </div>
      </div>
    );
  }
}

module.exports = TargetLanguageSelectBox;
