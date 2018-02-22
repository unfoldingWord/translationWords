/**
 * @description:
 *  This class defines the entire view for TranslationWords tool
 */
import React from 'react';
import {Glyphicon} from 'react-bootstrap';
import CheckInfoCard from './components/CheckInfoCard.js';
import style from './css/style';
import PropTypes from 'prop-types';

class View extends React.Component {

  render() {
    // Modules not defined within translationWords
    const { ScripturePane, VerseCheck, TranslationHelps } = this.props.currentToolViews;

    // set the scripturePane to empty to handle react/redux when it first renders without required data
    let scripturePane = <div/>;
    // populate scripturePane so that when required data is preset that it renders as intended.
    if (this.props.settingsReducer.toolsSettings.ScripturePane !== undefined) {
      scripturePane = <ScripturePane {...this.props} />;
    }

    let { translationWords } = this.props.resourcesReducer.translationHelps;
    let { contextId } = this.props.contextIdReducer;
    let articleId = contextId.groupId;
    let currentFile;
    if (translationWords && translationWords[articleId]) {
      currentFile = this.props.resourcesReducer.translationHelps.translationWords[articleId];
    }

    return (
      <div style={{display: 'flex', flex: 'auto'}}>
        <div style={{flex: '2 1 900px', display: "flex", flexDirection: "column"}}>
          {scripturePane}
          <CheckInfoCard openHelps={this.props.toggleHelps} showHelps={this.props.showHelps} title={this.props.contextIdReducer.contextId.quote} file={currentFile}/>
          <VerseCheck {...this.props} />
        </div>
        <div style={{flex: this.props.showHelps ? '1 1 375px' : '0 0 30px', display: 'flex', justifyContent: 'flex-end', marginLeft: '-15px'}}>
          <div style={style.handleIconDiv}>
              <Glyphicon glyph={this.props.showHelps ? "chevron-right" : "chevron-left"}
                         style={style.handleIcon}
                         onClick={this.props.toggleHelps} />
          </div>
          <div style={{ display: this.props.showHelps ? "flex" : "none", flex: '1' }}>
            <TranslationHelps
              {...this.props}
              currentFile={currentFile}
              online={this.props.settingsReducer.online}
            />
          </div>
        </div>
      </div>
    );
  }
}

View.propTypes = {
  settingsReducer: PropTypes.object.isRequired,
  showHelps: PropTypes.func.isRequired,
  contextIdReducer: PropTypes.object.isRequired,
  toggleHelps: PropTypes.func.isRequired,
  resourcesReducer: PropTypes.object.isRequired,
  currentToolViews: PropTypes.object.isRequired
};

export default View;
