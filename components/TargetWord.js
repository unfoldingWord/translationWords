

const api = window.ModuleApi;
const React = api.React;

/* Contains a word from the target language, defines a lot of listeners for clicks */
class TargetWord extends React.Component {
    render() {
      return (
        <span
          className={this.props.highlighted ? 'text-primary-highlighted' : 'text-muted'}
          onClick={this.props.updateSelectedWords.bind(this, this.props.wordObj, this.props.highlighted)}
          style={this.props.style}
        >
          {this.props.word}
        </span>
      );
    }
}

module.exports = TargetWord;
