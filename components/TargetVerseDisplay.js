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
      if(this.props.currentCheck.selectedWordsRaw){
        let selectedWordsRaw = this.props.currentCheck.selectedWordsRaw;
        for(var foundWord in selectedWordsRaw){
          if(selectedWordsRaw[foundWord].word === word && selectedWordsRaw[foundWord].key === tokenKey){
            highlighted = true;
          }
        }
      }
      let wordObj = {
        word: word,
        key: tokenKey
      }
      wordArray.push(
        <TargetWord
          word={word}
          key={wordKey++}
          keyId={tokenKey}
          wordObj={wordObj}
          style={{cursor: 'pointer'}}
          updateSelectedWords={this.props.updateSelectedWords.bind(this)}
          highlighted={highlighted}
        />
      );
      tokenKey++;
      index = wordIndex + word.length;
    }
    return wordArray;
  }

  render() {
    return (
      <div bsSize={'small'}
           style={{overflowY: "scroll", minHeight: '128px', marginBottom: '5px', padding: '9px'}}>
        <div style={{direction: this.props.direction}}
             onMouseUp={this.textSelected}
             className="TargetVerseSelectionArea">
             {this.generateWordArray()}
        </div>
      </div>
    );
  }
}

module.exports = TargetLanguageSelectBox;
