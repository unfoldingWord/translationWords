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

//Components
const DragTargetVerseDisplay = require('./components/BareTargetVerseDisplay.js');
const ClickTargetVerseDisplay = require('./components/TargetVerseDisplay');
const TranslationWordsDisplay = require('./translation_words/TranslationWordsDisplay');
const GatewayVerseDisplay = require('./components/GatewayVerseDisplay.js');
const CheckStatusButtons = require('./components/CheckStatusButtons');

let ScripturePane = null;
let ProposedChanges = null;
let CommentBox = null;

class View extends React.Component {
  constructor(){
    super();
    this.state = {
      tabKey: 1
    }
    ScripturePane = api.getModule('ScripturePane');
    ProposedChanges = api.getModule('ProposedChanges');
    CommentBox = api.getModule('CommentBox');
  }
  handleSelect(tabKey){
     this.setState({tabKey});
  }
  render(){
    let TargetVerseDisplay = null;
    if(this.props.dragToSelect){
      TargetVerseDisplay = <DragTargetVerseDisplay
                              verse={this.props.targetVerse}
                              onWordSelected={this.props.updateSelectedWords.bind(this)}
                              style={{minHeight: '120px', margin: '0 2.5px 5px 0'}}
                              currentCheck={this.props.currentCheck}
                              direction={this.props.direction}
                            />
    }else {
      TargetVerseDisplay = <ClickTargetVerseDisplay
                              verse={this.props.targetVerse}
                              updateSelectedWords={this.props.updateSelectedWords.bind(this)}
                              style={{minHeight: '120px', margin: '0 2.5px 5px 0'}}
                              currentCheck={this.props.currentCheck}
                              direction={this.props.direction}
                            />
    }
    let proposedChangesGlyph = <Glyphicon glyph="pencil" style={{color: "#FFFFFF"}} />;
    let commentGlyph = <Glyphicon glyph="comment" style={{color: "#FFFFFF"}} />;
    return (
      <div>
        <ScripturePane currentCheck={this.props.currentCheck} />
        <Row className="show-grid" style={{marginTop: '0px'}}>
        <Col sm={8} md={8} lg={8} style={{padding: '0px'}}>
            <div style={{width: "100%", height: "40px",
                backgroundColor: "#333333", color: "#FFFFFF", padding: "7px",
                boxSizing: "border-box", fontSize: "20px"}}>
              {this.props.currentCheck.word}
            </div>
          <Col sm={6} md={6} lg={6} style={{padding: '0px'}}>
            <Col sm={12} md={12} lg={12} style={{padding: '0px', height: "348px"}}>
              {TargetVerseDisplay}
            </Col>
            <Col sm={12} md={12} lg={12} style={{padding: '0px'}}>
              <div>
                <CheckStatusButtons updateCheckStatus={this.props.updateCheckStatus.bind(this)}
                                    currentCheck={this.props.currentCheck}
                />
              </div>
            </Col>
          </Col>
          <Col sm={6} md={6} lg={6} style={{padding: '0px', display: "flex"}}>
              <Tabs activeKey={this.state.tabKey}
                    onSelect={this.handleSelect.bind(this)}
                    id="controlled-tab-example"
                    bsStyle='pills'
                    style={{backgroundColor: "#747474"}}>
                <Tab eventKey={1} title={proposedChangesGlyph}
                                  style={{borderRadius: "0px", backgroundColor: "#333333"}}>
                    <ProposedChanges currentCheck={this.props.currentCheck}
                                     proposedChangesStore={this.props.proposedChangesStore} />
                </Tab>
                <Tab eventKey={2} title={commentGlyph}
                                  style={{borderRadius: "0px", backgroundColor: "#333333"}}>
                    <CommentBox currentCheck={this.props.currentCheck}
                                commentBoxStore={this.props.commentBoxStore} />
                </Tab>
              </Tabs>
              <div style={{width: "40px", height: "390px", backgroundColor: "#747474", boxSizing: "border-box"}}>
                  <button onClick={this.props.goToPrevious}
                          title="Click to go to the previous check"
                          style={{backgroundColor: "#333", border: "none", width: "100%", height: "40px", }}>
                    <Glyphicon glyph="chevron-up" style={{color: "#FFFFFF", fontSize: "28px"}} />
                  </button>
                  <button onClick={this.props.goToNext}
                          title="Click to go to the next check"
                          style={{backgroundColor: "#000", border: "none", width: "100%", height: "40px", transform: "translate(0, 310px)"}}>
                    <Glyphicon glyph="chevron-down" style={{color: "#FFFFFF", fontSize: "28px"}} />
                  </button>
              </div>
            </Col>
        </Col>
        <Col sm={4} md={4} lg={4} style={{padding: "0px"}}>
          <TranslationWordsDisplay currentFile={this.props.currentFile}/>
        </Col>
        </Row>
      </div>
    );
  }
}

module.exports = View;
