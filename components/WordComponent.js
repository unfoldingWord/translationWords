import React from 'react'
//constant declaration
const CURRENT_WORD= "CurrentWord: ";

class WordComponent extends React.Component {
  render() {
    return (
      <div bsSize={'small'} style={{height: "60px", padding: '9px', textAlign: "center"}}>
        <span>{CURRENT_WORD}</span>
        <div className={"text-primary"}>
          {this.props.word}
        </div>
      </div>
    );
  }
}

module.exports = WordComponent;
