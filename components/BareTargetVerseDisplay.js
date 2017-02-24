/**
 * A more organic implementation of the Target Verse Display
 * Author: Luke Wilson
 */
const React = require('react');
const style = require('../css/style');

class TargetVerseDisplay extends React.Component{

  getSelectionText() {
    let verseText = this.props.verse;
    let text = "";
    var selection = window.getSelection();
    var indexOfTextSelection = selection.getRangeAt(0).startOffset;
    if (selection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    if (text === "" || text === " " ) {
      //do nothing since an empty space was selected
    }else{
      let expression = '/' + text + '/g';
      let wordOccurencesArray = verseText.match(eval(expression));
      let occurrences = wordOccurencesArray.length;
      let occurrence;
      let textBeforeSelection = verseText.slice(0, indexOfTextSelection);
      if(textBeforeSelection.match(eval(expression))){
        occurrence = textBeforeSelection.match(eval(expression)).length + 1;
      }else{
        occurrence = 1;
      }

      let selectedText = {
                          text: text,
                          occurrence: occurrence,
                          occurrences: occurrences
                         };
      let newSelectedTextArray = this.props.currentCheck.selectedText;
      let foundRepeatedSelection = newSelectedTextArray.find(item => item.text === text && item.occurrence === occurrence );
      if(foundRepeatedSelection){
        //dont add object to array
      }else {
        newSelectedTextArray.push(selectedText);
      }
      let currentCheck = this.props.currentCheck;
      currentCheck.selectedText = newSelectedTextArray;
      this.props.updateCurrentCheck(currentCheck);
    }
  }

  displayText(){
    let verseText = '';
    let { currentCheck } = this.props;
    if(currentCheck.selectedText.length > 0){
      verseText = [];
      for(let i in currentCheck.selectedText){
        let textSelected = currentCheck.selectedText[i].text;
        verseText = this.props.verse.split(textSelected);
        verseText.splice(1, 0,
          <span key={1} style={{backgroundColor: '#FDD910', fontWeight: 'bold'}}>
              {textSelected}
          </span>
        );
      }
      return(
        <span onMouseUp={() => this.getSelectionText()}>
          {verseText}
        </span>
      );
    }else {
      verseText = this.props.verse;
      return(
        <span onMouseUp={() => this.getSelectionText()}>
          {verseText}
        </span>
      );
    }
  }

    render(){
      console.log(this.props.currentCheck.selectedText);
      let { chapter, verse } = this.props.currentCheck;
      return (
        <div className='highlighted' style={{direction: this.props.direction}}>
          {chapter + ":" + verse + " "}{this.displayText()}
        </div>
      )
    }

}

module.exports = TargetVerseDisplay;
