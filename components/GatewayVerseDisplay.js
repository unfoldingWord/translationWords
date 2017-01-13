//GatewayVerseDisplay.js//

const api = window.ModuleApi;
const React = api.React;
const ReactBootstrap = api.ReactBootstrap;
const XRegExp = require('xregexp');


class GatewayVerseDisplay extends React.Component {

  generateWordArray() {
    /*
     * Split the verse on either side of the actual word. This assumes that the | character
     * will never be found in the Bible
     */
    var first, last;
    var newStr = replaceFrom(this.props.gatewayVerse, this.props.currentCheck.index,
      this.props.currentCheck.index + this.props.currentCheck.word.length, '|');
    [first, last] = newStr.split('|');
    /* this return every up to the word, then the word itself with highlighting,
     * the rest of the verse until the end
     */
    return [<span key={0}>{first}</span>,
      <span key={1} className={"text-primary"}>{this.props.currentCheck.word}</span>,
      <span key={2}>{last}</span>];
  }

  render() {
    return(
      <div bsSize={'small'} style={{minHeight: '128px', marginBottom: '5px', padding: '9px'}}>
        <div
          style={{
            textAlign: "center",
            overflowY: "scroll",
            minHeight: "50px",
            maxHeight: "100px"
          }}
        >
          {this.generateWordArray()}
        </div>
      </div>
    )
  }
}

function replaceAt(str, index, character) {
  return str.substr(0, index) + character + str.substr(index+character.length);
}

function replaceFrom(str, indexStart, indexEnd, character) {

  return str.substr(0, indexStart) + character + str.substr(indexEnd);
}

module.exports = GatewayVerseDisplay;
