/**
 * @description:
 *  This class defines the entire view for TranslationWords tool
 */
import React from 'react';
import {Row, Col, Tabs, Tab, Glyphicon} from 'react-bootstrap';
import CheckInfoCard from './components/CheckInfoCard.js';
import style from './css/style';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class View extends React.Component {

  render() {
    // Modules not defined within translationWords
    const {
      ScripturePane,
      VerseCheck,
      TranslationHelps
    } = this.props.modules;

    let scripturePane = <div></div>
    if (this.props.modulesSettingsReducer.ScripturePane !== undefined) {
      scripturePane = <ScripturePane {...this.props} currentCheck={this.props.checkStoreReducer.currentCheck} />
    }
    let verseCheck = <div></div>

    return (
      <MuiThemeProvider>
        <Row className="show-grid" style={{margin: '0px', bottom: "0px", height: "100%"}}>
          <Col sm={12} md={6} lg={9} style={{height: "100%", padding: '0px'}}>
            {scripturePane}
            <CheckInfoCard openHelps={this.props.toggleHelps} showHelps={this.props.showHelps} title={this.props.contextIdReducer.contextId.quote} file={this.props.currentFile}/>
            <VerseCheck
              {...this.props}
              goToNext={this.props.goToNext}
              goToPrevious={this.props.goToPrevious}
            />
          </Col>
          <Col sm={12} md={6} lg={3} style={{height: "100%", padding: "0px"}}>
            <div style={{height: "100vh"}}>
              <Glyphicon glyph={this.props.showHelps ? "chevron-right" : "chevron-left"}
                         style={this.props.showHelps ? style.tHelpsOpen : style.tHelpsClosed}
                         onClick={this.props.toggleHelps} />
                <div style={{display: this.props.showHelps ? "block" : "none", height: "100vh"}}>
                  <TranslationHelps {...this.props} currentFile={this.props.currentFile}
                                  online={this.props.statusBarReducer.online}/>
                </div>
            </div>
          </Col>
        </Row>
      </MuiThemeProvider>
    );
  }
}

module.exports = View;
