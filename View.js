/**
 * @description:
 *  This class defines the entire view for TranslationWords tool
 */
import React from 'react'
import {Row, Col, Tabs, Tab, Glyphicon} from 'react-bootstrap'
import DragTargetVerseDisplay from './components/BareTargetVerseDisplay.js'
import ClickTargetVerseDisplay from './components/TargetVerseDisplay'
import GatewayVerseDisplay from './components/GatewayVerseDisplay.js'
import CheckInfoCard from './components/CheckInfoCard.js'
import CheckStatusButtons from './components/CheckStatusButtons'
import HelpInfo from './components/HelpInfo'
import style from './css/style'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

class View extends React.Component {
  render(){
    //Modules not defined within translationWords
    const { ScripturePane, ProposedChanges, CommentBox, TranslationHelps } = this.props.modules;
    let TargetVerseDisplay = null;
    if(this.props.dragToSelect){
      TargetVerseDisplay = <DragTargetVerseDisplay
                              verse={this.props.targetVerse}
                              updateCurrentCheck={this.props.updateCurrentCheck.bind(this)}
                              style={style.targetVerse}
                              currentCheck={this.props.currentCheck}
                              direction={this.props.direction}
                              bookName={this.props.bookName}
                            />
    }else {
      TargetVerseDisplay = <ClickTargetVerseDisplay
                              verse={this.props.targetVerse}
                              updateSelectedWords={this.props.updateSelectedWords.bind(this)}
                              style={style.targetVerse}
                              currentCheck={this.props.currentCheck}
                              direction={this.props.direction}
                              bookName={this.props.bookName}
                            />
    }
    let toolGlyph = <img src="images/tWIcon.png" style={{height: "25px", marginLeft: "10px"}}/>;
    let proposedChangesGlyph = <Glyphicon glyph="pencil" style={{color: "#FFFFFF", fontSize: "20px", marginLeft: "12px"}} />;
    let commentGlyph = <Glyphicon glyph="comment" style={{color: "#FFFFFF", fontSize: "20px", marginLeft: "12px"}} />;
    let questionGlyph = <Glyphicon glyph="question-sign" style={{color: "#FFFFFF", fontSize: "20px", marginLeft: "12px"}} />;
    return (
      <MuiThemeProvider>
        <Row className="show-grid" style={{margin: '0px', bottom: "0px",  height: "100%"}}>
          <Col sm={12} md={6} lg={9} style={{height: "100%", padding: '0px'}}>
            <ScripturePane {...this.props} currentCheck={this.props.currentCheck} />
            <CheckInfoCard openHelps={this.props.toggleHelps} showHelps={this.props.showHelps} title={this.props.currentCheck.phrase} file={this.props.currentFile}/>
            <Col sm={12} md={12} lg={12} style={{height: "100%", padding: '0px', border: "20px solid #0277BD"}}>
              <div style={{padding: '10px', display: "flex", backgroundColor: "#FFFFFF"}}>
                <div style={{padding: '0px', display: "box", width: "500px"}}>
                  <h4>Target Language</h4>
                  {TargetVerseDisplay}
                </div>
                <CheckStatusButtons updateCheckStatus={this.props.updateCheckStatus.bind(this)}
                                    currentCheck={this.props.currentCheck}
                                    goToNext={this.props.goToNext}
                                    goToPrevious={this.props.goToPrevious}
                />
              </div>
              <Tabs
                activeKey={this.props.tabKey}
                onSelect={(e) => this.props.handleSelectTab(e)}
                id="tabs"
                style={{backgroundColor: "#FFFFFF", width: "100%"}}>
                <Tab
                  eventKey={1}
                  title={toolGlyph}
                  style={style.tabStyling}>
                  <div style={{height: "calc(100vh - 531px)", backgroundColor: "#333333", boxSizing: "border-box"}}>
                    <div style={style.currentWord}>
                      <h4 style={{color: "#FFFFFF"}}>Important Words</h4><br />
                      {'"' + this.props.currentCheck.phrase + '"'}
                    </div>
                  </div>
                </Tab>
                <Tab eventKey={2} title={proposedChangesGlyph}
                                  style={style.tabStyling}>
                  <div style={{height: "calc(100vh - 531px)", backgroundColor: "#333333", boxSizing: "border-box"}}>
                    <ProposedChanges currentCheck={this.props.currentCheck}
                                     updateCurrentCheck={this.props.updateCurrentCheck.bind(this)}
                                     proposedChangesStore={this.props.proposedChangesStore} />
                  </div>
                </Tab>
                <Tab eventKey={3} title={commentGlyph}
                                  style={style.tabStyling}>
                  <div style={{height: "calc(100vh - 531px)", backgroundColor: "#333333", boxSizing: "border-box"}}>
                    <CommentBox currentCheck={this.props.currentCheck}
                                updateCurrentCheck={this.props.updateCurrentCheck.bind(this)}
                                commentBoxStore={this.props.commentBoxStore} />
                  </div>
                </Tab>
                <Tab eventKey={4} title={questionGlyph}
                                      style={style.tabStyling}>
                  <div style={{padding: '10px', height: "calc(100vh - 531px)", backgroundColor: "#333333", boxSizing: "border-box"}}>
                    <HelpInfo />
                  </div>
                </Tab>
              </Tabs>
            </Col>
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
        </MuiThemeProvider>
    );
  }
}

module.exports = View;
