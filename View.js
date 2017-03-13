/**
 * @description:
 *  This class defines the entire view for TranslationWords tool
 */
//Api Consts
const api = window.ModuleApi;
const React = api.React;
const RB = api.ReactBootstrap;
//Bootstrap consts
const {Row, Col, Tabs, Tab, Glyphicon} = RB;
//Modules not defined within TranslationWords
let ScripturePane = null;
let VerseCheck = null;
let ProposedChanges = null;
let CommentBox = null;
let TranslationHelps = null;
//Components
const GatewayVerseDisplay = require('./components/GatewayVerseDisplay.js');
const style = require('./css/style');


class View extends React.Component {
  constructor(){
    super();
    ScripturePane = api.getModule('ScripturePane');
    VerseCheck = api.getModule('VerseCheck');
    TranslationHelps = api.getModule('TranslationHelps');
  }
  render(){
    let toolGlyph = <img src="images/tWIcon.png" style={{height: "25px", marginLeft: "10px"}}/>;
    let questionGlyph = <Glyphicon glyph="question-sign" style={{color: "#FFFFFF", fontSize: "20px", marginLeft: "12px"}} />;
    return (
        <Row className="show-grid" style={{margin: '0px', bottom: "0px",  height: "100%"}}>
          <Col sm={12} md={6} lg={9} style={{height: "100%", padding: '0px'}}>
            <ScripturePane currentCheck={this.props.currentCheck} />
            <VerseCheck
              updateCheckStatus={this.props.updateCheckStatus.bind(this)}
              updateCurrentCheck={this.props.updateCurrentCheck.bind(this)}
              currentCheck={this.props.currentCheck}
              goToNext={this.props.goToNext}
              goToPrevious={this.props.goToPrevious}
              verse={this.props.targetVerse}
              direction={this.props.direction}
              bookName={this.props.bookName}
            />
          </Col>
          <Col sm={12} md={6} lg={3} style={{height: "100%", padding: "0px"}}>
            <div style={{height: "100vh"}}>
              <Glyphicon glyph={this.props.showHelps ? "chevron-right" : "chevron-left"}
                         style={this.props.showHelps ? style.tHelpsOpen : style.tHelpsClosed}
                         onClick={this.props.toggleHelps} />
                <div style={{display: this.props.showHelps ? "block" : "none", height: "100vh"}}>
                  <TranslationHelps currentFile={this.props.currentFile}
                                  online={this.props.online}/>
                </div>
            </div>
          </Col>
        </Row>
    );
  }
}

module.exports = View;
