/**
 * @description:
 *  This class defines the entire view for TranslationWords tool
 */
//Api Consts
const api = window.ModuleApi;
const React = api.React;
const RB = api.ReactBootstrap;

//Bootstrap consts
const {Row, Col} = RB;

//Components
const DragTargetVerseDisplay = require('./components/BareTargetVerseDisplay.js');
const ClickTargetVerseDisplay = require('./components/TargetVerseDisplay');
const TranslationWordsDisplay = require('./translation_words/TranslationWordsDisplay');
const GatewayVerseDisplay = require('./components/GatewayVerseDisplay.js');
const CheckStatusButtons = require('./components/CheckStatusButtons');

const ScripturePane = api.getModule('ScripturePane');
const ProposedChanges = api.getModule('ProposedChanges');
const CommentBox = api.getModule('CommentBox');

class View extends React.Component {
  render(){
    let TargetVerseDisplay = null;
    if(this.props.dragToSelect){
      TargetVerseDisplay = <DragTargetVerseDisplay
                              verse={this.props.targetVerse}
                              onWordSelected={this.props.updateSelectedWords.bind(this)}
                              style={{minHeight: '120px', margin: '0 2.5px 5px 0'}}
                              currentCheck={this.props.currentCheck}
                            />
    }else {
      TargetVerseDisplay = <ClickTargetVerseDisplay
                              verse={this.props.targetVerse}
                              onWordSelected={this.props.updateSelectedWords.bind(this)}
                              style={{minHeight: '120px', margin: '0 2.5px 5px 0'}}
                              currentCheck={this.props.currentCheck}
                            />
    }
    return (
      <div>
        <ScripturePane />
        <Row className="show-grid" style={{marginTop: '25px'}}>
          <h3 style={{margin: '5px 0 5px 20px', width: '100%', fontWeight: 'bold', fontSize: '28px'}}>
            <span style={{color: '#44c6ff'}}>translationWords</span> Check
          </h3>
          <Col sm={6} md={6} lg={6} style={{paddingRight: '2.5px'}}>
            <GatewayVerseDisplay  currentCheck={this.props.currentCheck}
                                  gatewayVerse={this.props.gatewayVerse}
            />
            {TargetVerseDisplay}
            <CheckStatusButtons updateCheckStatus={this.props.updateCheckStatus.bind(this)}
                                currentCheck={this.props.currentCheck}
            />
            <ProposedChanges currentCheck={this.props.currentCheck}/>
          </Col>
          <Col sm={6} md={6} lg={6} style={{paddingLeft: '2.5px'}}>
            <TranslationWordsDisplay currentFile={this.props.currentFile}/>
          </Col>
        </Row>
          <CommentBox val={this.props.currentCheck.comment || ""} ref={"CommentBox"} />
      </div>
    );
  }
}

module.exports = View;
