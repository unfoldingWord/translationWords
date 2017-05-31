/**
 * @description:
 *  This class defines the entire view for TranslationWords tool
 */
import React from 'react';
import {Glyphicon} from 'react-bootstrap';
import CheckInfoCard from './components/CheckInfoCard.js';
import style from './css/style';

class View extends React.Component {

  render() {
    // Modules not defined within translationWords
    const {
      ScripturePane,
      VerseCheck,
      TranslationHelps
    } = this.props.modules;

    let {dataList, currentFile} = this.props;

    // set the scripturePane to empty to handle react/redux when it first renders without required data
    let scripturePane = <div></div>;
    // populate scripturePane so that when required data is preset that it renders as intended.
    if (this.props.modulesSettingsReducer.ScripturePane !== undefined) {
      scripturePane = <ScripturePane {...this.props} />
    }

    return (
        <div style={{display: 'flex', flex: 'auto'}}>
          <div style={{flex: '2 1 1000px', display: "flex", flexDirection: "column"}}>
            {scripturePane}
            <CheckInfoCard openHelps={this.props.toggleHelps} showHelps={this.props.showHelps} title={this.props.contextIdReducer.contextId.quote} file={this.props.currentFile}/>
            <VerseCheck
              {...this.props}
              goToNext={this.props.goToNext}
              goToPrevious={this.props.goToPrevious}
            />
          </div>
          <div style={{flex: this.props.showHelps ? '1 0 375px' : '0 0 30px', display: 'flex', justifyContent: 'flex-end', marginLeft: '-15px'}}>
            <div style={style.handleIconDiv}>
                <Glyphicon glyph={this.props.showHelps ? "chevron-right" : "chevron-left"}
                           style={style.handleIcon}
                           onClick={this.props.toggleHelps} />
            </div>
            <div style={{ display: this.props.showHelps ? "flex" : "none", flex: '1 0 360px' }}>
                <TranslationHelps currentFile={currentFile}
                                  dataList={dataList}
                                  online={this.props.statusBarReducer.online} />
            </div>
          </div>
        </div>
    );
  }
}

module.exports = View;
