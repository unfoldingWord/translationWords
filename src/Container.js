/* eslint-env jest */
import {connect} from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
//selectors
import {
  getAlignmentData,
  getContextId,
  getManifest,
  getProjectSaveLocation,
  getCurrentToolName,
  getCurrentProjectToolsSelectedGL
} from './selectors';
// helpers
import * as settingsHelper from './helpers/settingsHelper';
//containers
import GroupMenuContainer from './containers/GroupMenuContainer';
import VerseCheckContainer from './containers/VerseCheckContainer';
import TranslationHelpsContainer from './containers/TranslationHelpsContainer';

//ui-kit components
import {CheckInfoCard} from 'tc-ui-toolkit';

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHelps: false
    };
    this.toggleHelps = this.toggleHelps.bind(this);
  }
  componentWillMount() {
    settingsHelper.loadCorrectPaneSettings(this.props, this.props.actions.setToolSettings);
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
        finalString += '...';
        break;
      }
      finalString += ' ';
      finalString += word;
    }
    return finalString;
  }

  toggleHelps() {
    this.setState({showHelps: !this.state.showHelps});
  }

  render() {
    const {
      translate,
      toolsReducer,
      groupMenuReducer,
      groupsDataReducer,
      projectDetailsReducer: {currentProjectToolsSelectedGL, manifest, projectSaveLocation},
      toolsReducer: {currentToolName},
      contextIdReducer: {contextId},
      groupsIndexReducer,
      remindersReducer,
      selectionsReducer: {selections},
      commentsReducer,
      resourcesReducer,
      loginReducer,
      actions,
    } = this.props;

    if (contextId !== null) {
      let {translationWords} = resourcesReducer.translationHelps ? resourcesReducer.translationHelps : {};
      const {groupId} = contextId;
      const title = groupsIndexReducer.groupsIndex.filter(item => item.id === groupId)[0].name;
      const checkInfoCardPhrase = this.getCheckInfoCardText(translationWords, contextId.groupId, resourcesReducer.translationHelps);
      // const glQuote = actions.getGLQuote(languageId, groupId, currentToolName);
      return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <GroupMenuContainer {...this.props.groupMenu} />
          <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <CheckInfoCard
              title={title}
              phrase={checkInfoCardPhrase}
              seeMoreLabel={translate('see_more')}
              showSeeMoreButton={this.state.showHelps}
              onSeeMoreClick={this.toggleHelps.bind(this)} />
            <VerseCheckContainer {...this.props.verseCheck} />
          </div>
          <TranslationHelpsContainer
            toggleHelps={this.toggleHelps.bind(this)}
            showHelps={this.state.showHelps}
            {...this.props.translationHelps} />
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

const mapStateToProps = (state, ownProps) => {
  return {
    groupMenu: {
      toolsReducer: ownProps.tc.toolsReducer,
      groupsDataReducer: ownProps.tc.groupsDataReducer,
      groupsIndexReducer: ownProps.tc.groupsIndexReducer,
      groupMenuReducer: ownProps.tc.groupMenuReducer,
      translate: ownProps.translate,
      actions: ownProps.tc.actions,
      alignmentData: getAlignmentData(ownProps),
      contextId: getContextId(ownProps),
      manifest: getManifest(ownProps),
      projectSaveLocation: getProjectSaveLocation(ownProps)
    },
    verseCheck: {
      translate: ownProps.translate,
      currentToolName: getCurrentToolName(ownProps),
      projectDetailsReducer: ownProps.tc.projectDetailsReducer,
      loginReducer: ownProps.tc.loginReducer,
      resourcesReducer: ownProps.tc.resourcesReducer,
      commentsReducer: ownProps.tc.commentsReducer,
      selectionsReducer: ownProps.tc.selectionsReducer,
      contextIdReducer: ownProps.tc.contextIdReducer,
      toolsReducer: ownProps.tc.toolsReducer,
      groupsDataReducer: ownProps.tc.groupsDataReducer,
      remindersReducer: ownProps.tc.remindersReducer,
      actions: ownProps.tc.actions
    },
    translationHelps: {
      currentProjectToolsSelectedGL: getCurrentProjectToolsSelectedGL(ownProps),
      toolsReducer: ownProps.tc.toolsReducer,
      resourcesReducer: ownProps.tc.resourcesReducer,
      contextIdReducer: ownProps.tc.contextIdReducer,
      actions: ownProps.tc.actions
    }
  };
};


export default connect(mapStateToProps)(Container);
