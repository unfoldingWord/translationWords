

const api = window.ModuleApi;
const React = api.React;

/* Contains a word from the target language, defines a lot of listeners for clicks */
class TargetWord extends React.Component {
    constructor(){
      super();
      this.state = {
        highlighted: false,
        wordObj: { // this is required to pass into our callbacks
          word: null,
          key: null,
        }
      }
    }

    componentWillMount(){
      this.setState({
        wordObj: {
          'word': this.props.word,
          'key': this.props.keyId
        }
      });
    }

    removeHighlight() {
      if (this.state.highlighted) {
        this.setState({
          highlighted: false
        });
      }
    }

    setHighlight() {
      if (!this.state.highlighted) {
        this.setState({
          highlighted: true
        });
      }
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        wordObj: {
          'word': nextProps.word,
          'key': this.props.keyId
        }
      });
    }

    toggleHighlight() {
      if (!this.state.highlighted) {
        this.props.addSelectedWord(this.state.wordObj);
      }
      else {
        this.props.removeSelectedWord(this.state.wordObj);
      }
      this.setState({highlighted: !this.state.highlighted}); // this sets React to re-render the component
    }

    render() {
      //this.props.highlighted
      return (
        <span
          className={this.props.highlighted ? 'text-primary-highlighted' : 'text-muted'}
          onClick={this.toggleHighlight.bind(this)}
          style={this.props.style}
        >
          {this.props.word}
        </span>
      );
    }
}

module.exports = TargetWord;
