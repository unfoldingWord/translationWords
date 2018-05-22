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
  getCurrentToolName
} from './selectors';
// helpers
import * as settingsHelper from './helpers/settingsHelper';
import * as tHelpsHelpers from './helpers/tHelpsHelpers';
//containers
import GroupMenuContainer from './containers/GroupMenuContainer';
import VerseCheckContainer from './containers/VerseCheckContainer';

//ui-kit components
import {CheckInfoCard, TranslationHelps} from 'tc-ui-toolkit';

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.toggleHelps = this.toggleHelps.bind(this);
    this.toggleHelpsModal = this.toggleHelpsModal.bind(this);
    this.followTHelpsLink = this.followTHelpsLink.bind(this);
  }

  componentWillMount() {
    let selections = Array.from(this.props.selectionsReducer.selections);
    this.setState({selections});
    settingsHelper.loadCorrectPaneSettings(this.props, this.props.actions.setToolSettings);
    this._reloadArticle(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const {contextIdReducer, resourcesReducer} = this.props || {};
    const nextContextIDReducer = nextProps.contextIdReducer;
    if (contextIdReducer !== nextContextIDReducer) {
      this._reloadArticle(nextProps);
    }

    const {contextId} = contextIdReducer;
    const nextContextId = nextContextIDReducer.contextId;

    const currentArticle = tHelpsHelpers.getArticleFromState(resourcesReducer, contextId);
    const nextArticle = tHelpsHelpers.getArticleFromState(nextProps.resourcesReducer, nextContextId);
    if (currentArticle !== nextArticle) {
      var page = document.getElementById("helpsbody");
      if (page) page.scrollTop = 0;
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

  toggleHelpsModal() {
    this.setState({showHelpsModal: !this.state.showHelpsModal});
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

  followTHelpsLink(link) {
    let linkParts = link.split('/'); // link format: <lang>/<resource>/<category>/<article>

    const [lang, type, category, article] = linkParts;
    const resourceDir = tHelpsHelpers.getResourceDirByType(type);

    this.props.actions.loadResourceArticle(resourceDir, article, lang, category);
    const articleData = this.props.resourcesReducer.translationHelps[resourceDir][article];

    let newState;
    const tHelpsModalVisibility = true;
    const articleCategory = category;
    if (articleData) {
      newState = {
        tHelpsModalVisibility,
        articleCategory,
        modalArticle: articleData
      };
    } else {
      newState = {
        tHelpsModalVisibility,
        articleCategory,
        modalArticle: 'Cannot find an article for ' + link
      };
    }
    //todo: Shouldn't need to to set state and return state in the same function
    // Seems like an anti pattern
    this.setState(newState);
    return newState;
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
    window.followLink = this.followTHelpsLink;

    if (contextId !== null) {
      let {translationWords} = resourcesReducer.translationHelps ? resourcesReducer.translationHelps : {};
      const languageId = currentProjectToolsSelectedGL[currentToolName];
      const {groupId} = contextId;
      const title = groupsIndexReducer.groupsIndex.filter(item => item.id === groupId)[0].name;
      // const glQuote = actions.getGLQuote(languageId, groupId, currentToolName);
      const checkInfoCardPhrase = this.getCheckInfoCardText(translationWords, contextId.groupId, resourcesReducer.translationHelps);
      //get tHelps article
      const currentFile = tHelpsHelpers.getArticleFromState(resourcesReducer, contextId);
      const currentFileMarkdown = tHelpsHelpers.convertMarkdownLinks(currentFile, languageId);
      const tHelpsModalMarkdown = tHelpsHelpers.convertMarkdownLinks(this.state.modalArticle, languageId, this.state.articleCategory);
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
          <TranslationHelps
            article={currentFileMarkdown}
            modalArticle={tHelpsModalMarkdown}
            openExpandedHelpsModal={() => this.toggleHelpsModal()}
            isShowHelpsSidebar={this.state.showHelps}
            sidebarToggle={() => this.toggleHelps()}
            isShowHelpsExpanded={this.state.showHelpsModal} />
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
    }
  };
};


export default connect(mapStateToProps)(Container);
