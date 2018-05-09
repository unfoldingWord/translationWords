/* eslint-env jest */
import React from 'react';
import PropTypes from 'prop-types';
// helpers
import * as settingsHelper from './helpers/settingsHelper';
import * as checkAreaHelpers from './helpers/checkAreaHelpers';
//ui-kit components
import {GroupMenu, VerseCheck, ScripturePane, CheckInfoCard} from 'tc-ui-toolkit';

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      showHelps: true,
    };
  }

  componentWillMount() {
    settingsHelper.loadCorrectPaneSettings(this.props, this.props.actions.setToolSettings);
    this._reloadArticle(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.contextIdReducer && this.props.contextIdReducer !== nextProps.contextIdReducer) {
      this._reloadArticle(nextProps);
    }
  }

  /**
   * Loads the resource article
   * @param props
   * @private
   */
  _reloadArticle(props) {
    const {contextIdReducer, toolsReducer, projectDetailsReducer, actions} = props;
    const {contextId} = contextIdReducer;
    if (contextId) {
      const articleId = contextId.groupId;
      const {currentToolName} = toolsReducer;
      const languageId = projectDetailsReducer.currentProjectToolsSelectedGL[currentToolName];
      actions.loadResourceArticle(currentToolName, articleId, languageId);
    }
  }

  toggleHelps() {
    this.setState({showHelps: !this.state.showHelps});
  }

  getGroupProgress(groupIndex, groupsData) {
    let groupId = groupIndex.id;
    let totalChecks = groupsData[groupId].length;
    const doneChecks = groupsData[groupId].filter(groupData =>
      groupData.selections && !groupData.reminders
    ).length;

    let progress = doneChecks / totalChecks;

    return progress;
  }


  getSelections() {
    contextIdReducer.contextId = groupItemData.contextId;
    let loadPath = CheckDataLoadActions.generateLoadPath(projectDetailsReducer, contextIdReducer, 'selections');
    let selectionsObject = CheckDataLoadActions.loadCheckData(loadPath, groupItemData.contextId);
    let selectionsArray = [];

    if (selectionsObject) {
      selectionsObject.selections.forEach((selection) => {
        selectionsArray.push(selection.text);
      });
    }
    let selections = selectionsArray.join(" ");
  }

  getAlignedGLText(currentProjectToolsSelectedGL, contextId, bibles, currentToolName) {
    let alignedGLText = contextId.quote;
    const selectedGL = currentProjectToolsSelectedGL[currentToolName];
    if (bibles[selectedGL] && bibles[selectedGL]['ult']) {
      const verseObjects = bibles[selectedGL]['ult'][contextId.reference.chapter][contextId.reference.verse].verseObjects;
      const wordsToMatch = contextId.quote.split(' ');
      const alignedText = checkAreaHelpers.getAlignedText(verseObjects, wordsToMatch, contextId.occurrence);
      if (alignedText) {
        alignedGLText = alignedText;
      }
    }
    return alignedGLText;
  }

  getCheckInfoCardText(translationWords, articleId, translationHelps) {
    let currentFile = '';
    if (translationWords && translationWords[articleId]) {
      currentFile = translationHelps.translationWords[articleId];
    }
    
    let splitLine = currentFile.split('\n');
    if (splitLine.length === 1 && splitLine[0] === "") return "";
    let finalArray = [];
    for (let i = 0; i < splitLine.length; i++) {
      if (splitLine[i] !== '' && !~splitLine[i].indexOf("#")) {
        finalArray.push(splitLine[i]);
      }
    }
    let maxLength = 225;
    let finalString = "";
    let chosenString = finalArray[0];
    let splitString = chosenString.split(' ');
    for (let word of splitString) {
      if ((finalString + ' ' + word).length >= maxLength) {
        finalString+= '...';
        break;
      }
      finalString += ' ';
      finalString += word;
    }
    return finalString;
  }

  render() {
    const {
      wordAlignmentReducer: {alignmentData},
      translate,
      toolsReducer,
      groupMenuReducer,
      groupsDataReducer,
      projectDetailsReducer: {currentProjectToolsSelectedGL, manifest, projectSaveLocation},
      toolsReducer: {currentToolName},
      contextIdReducer: {contextId},
      groupsIndexReducer,
      remindersReducer,
      selectionsReducer:{selections},
      commentsReducer,
      resourcesReducer,
      loginReducer,
      actions,
    } = this.props;    

    if (contextId !== null) {
      let { translationWords } = resourcesReducer.translationHelps;
      const languageId = currentProjectToolsSelectedGL[currentToolName];
      const {groupId} = contextId;
      const title = groupsIndexReducer.groupsIndex.filter(item => item.id === groupId)[0].name;
      const glQuote = actions.getGLQuote(languageId, groupId, currentToolName);
      const alignedGLText = this.getAlignedGLText(
        currentProjectToolsSelectedGL, contextId, resourcesReducer.bibles, currentToolName);
      const checkInfoCardPhrase = this.getCheckInfoCardText(translationWords, contextId.groupId, resourcesReducer.translationHelps)

      return (
        <div style={{display:'flex', flexDirection:'row'}}>
          <GroupMenu
            translate={translate}
            getSelections={(contextId) => actions.getSelectionsFromContextId(contextId, projectSaveLocation)}
            getGroupProgress={this.getGroupProgress}
            alignmentData={alignmentData}
            groupsDataReducer={groupsDataReducer}
            groupsIndexReducer={groupsIndexReducer}
            groupMenuReducer={groupMenuReducer}
            toolsReducer={toolsReducer}
            contextIdReducer={{contextId}}
            projectDetailsReducer={{manifest, projectSaveLocation}}
            actions={actions} />
          <div style={{display:'flex', flexDirection:'column', width:'100%'}}>
            <CheckInfoCard
              title={title}
              phrase={checkInfoCardPhrase}
              seeMoreLabel={translate('see_more')}
              showSeeMoreButton={this.state.showHelps}
              onSeeMoreClick={this.toggleHelps.bind(this)} />
            <VerseCheck 
              alignedGLText={alignedGLText}
              projectDetailsReducer={{currentProjectToolsSelectedGL, manifest, projectSaveLocation}}
              loginReducer={loginReducer}
              resourcesReducer={resourcesReducer}
              commentsReducer={commentsReducer}
              selectionsReducer={{selections}}
              contextIdReducer={{contextId}}
              translate={translate}
              toolsReducer={toolsReducer}
              groupsDataReducer={groupsDataReducer}
              remindersReducer={remindersReducer}
              actions={actions} />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

Container.propTypes = {
  translate: PropTypes.func,
  settingsReducer: PropTypes.shape({
    toolsSettings: PropTypes.shape({
      ScripturePane: PropTypes.object
    })
  }),
  contextIdReducer: PropTypes.shape({
    contextId: PropTypes.shape({
      groupId: PropTypes.any
    })
  }),
  groupsIndexReducer: PropTypes.shape({
    groupsIndex: PropTypes.array
  }),
  projectDetailsReducer: PropTypes.shape({
    currentProjectToolsSelectedGL: PropTypes.object.isRequired
  }),
  toolsReducer: PropTypes.shape({
    currentToolName: PropTypes.string.isRequired
  }),
  actions: PropTypes.shape({
    setToolSettings: PropTypes.func.isRequired,
    loadResourceArticle: PropTypes.func.isRequired,
    getGLQuote: PropTypes.func.isRequired,
    getSelectionsFromContextId: PropTypes.func.isRequired
  })
};

export default Container;
