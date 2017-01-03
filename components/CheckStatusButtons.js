
const api = window.ModuleApi;
const React = api.React;
const RB = api.ReactBootstrap;
const {Glyphicon, Button, ButtonGroup} = RB;

const CORRECT = "Correct in Context",
      FLAGGED = "Flag for Review";

class CheckStatusButtons extends React.Component{

  render(){
    let currentCheck = this.props.currentCheck;
    let checkStatus = currentCheck.checkStatus;
    return (
      <div>
        <ButtonGroup style={{width:'100%', paddingBottom: "2.5px"}}>
          <Button style={{width:'50%'}} bsStyle="success"
                  className={checkStatus == 'CORRECT' ? 'active':''}
                  onClick={this.props.updateCheckStatus.bind(this, 'CORRECT')}>
            <Glyphicon glyph="ok" /> {CORRECT}</Button>
          <Button style={{width:'50%'}} bsStyle="danger"
                  className={checkStatus == 'FLAGGED' ? 'active':''}
                  onClick={this.props.updateCheckStatus.bind(this, 'FLAGGED')}>
            <Glyphicon glyph="flag" /> {FLAGGED}</Button>
        </ButtonGroup>
      </div>
    );
  }
}

module.exports = CheckStatusButtons;
