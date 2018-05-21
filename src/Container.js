/* eslint-env jest */
import React from 'react';
import PropTypes from 'prop-types';
import fs from 'fs-extra';
// helpers
import * as settingsHelper from './helpers/settingsHelper';
import * as checkAreaHelpers from './helpers/checkAreaHelpers';
import {optimizeSelections, normalizeString} from './helpers/selectionHelpers';
import * as tHelpsHelpers from './helpers/tHelpsHelpers';
import isEqual from 'deep-equal';
import usfmjs from 'usfm-js';
//ui-kit components
import {GroupMenu, VerseCheck, ScripturePane, CheckInfoCard, TranslationHelps} from 'tc-ui-toolkit';
class Container extends React.Component {
  constructor(props) {
    super(props);
    let verseText = usfmjs.removeMarker(this.verseText());
    const mode = props.selectionsReducer.selections.length > 0 || verseText.length === 0 ? 'default' : 'select';
    this.state = {
      mode: mode,
      comment: undefined,
      commentChanged: false,
      verseText: undefined,
      verseChanged: false,
      selections: [],
      tags: [],
      dialogModalVisibility: false,
      goToNextOrPrevious: null,
      showHelps: false,
      showHelpsModal: false,
      articleCategory: '',
      modalArticle: ''
    };
    this.saveSelection = this.saveSelection.bind(this);
    this.cancelSelection = this.cancelSelection.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
    this.handleSkip = this.handleSkip.bind(this);
    this.findIfVerseEdited = this.findIfVerseEdited.bind(this);
    this.verseText = this.verseText.bind(this);
    this.toggleHelps = this.toggleHelps.bind(this);
    this.toggleHelpsModal = this.toggleHelpsModal.bind(this);
    this.followTHelpsLink = this.followTHelpsLink.bind(this);

    this.actions = {
      changeSelectionsInLocalState(selections) {
        _this.setState({selections});
      },

      changeMode(mode) {
        _this.setState({
          mode: mode,
          selections: _this.props.selectionsReducer.selections
        });
      },

      checkVerse(e) {
        let {chapter, verse} = _this.props.contextIdReducer.contextId.reference;
        const newverse = e.target.value || "";
        const oldverse = _this.props.resourcesReducer.bibles.targetLanguage.targetBible[chapter][verse] || "";
        if (newverse === oldverse) {
          _this.setState({
            verseChanged: false,
            tags: []
          });
        } else {
          _this.setState({
            verseChanged: true
          });
        }
      },
      cancelEditVerse() {
        _this.setState({
          mode: 'default',
          selections: _this.props.selectionsReducer.selections,
          verseText: undefined,
          verseChanged: false,
          tags: []
        });
      },
      saveEditVerse() {
        let {loginReducer, actions, contextIdReducer, resourcesReducer} = _this.props;
        let {chapter, verse} = contextIdReducer.contextId.reference;
        let before = resourcesReducer.bibles.targetLanguage.targetBible[chapter][verse];
        let username = loginReducer.userdata.username;
        // verseText state is undefined if no changes are made in the text box.
        if (!loginReducer.loggedInUser) {
          _this.props.actions.selectModalTab(1, 1, true);
          _this.props.actions.openAlertDialog("You must be logged in to edit a verse");
          return;
        }

        const save = () => {
          actions.editTargetVerse(chapter, verse, before, _this.state.verseText, _this.state.tags, username);
          _this.setState({
            mode: 'default',
            selections: _this.props.selectionsReducer.selections,
            verseText: undefined,
            verseChanged: false,
            tags: []
          });
        };
        if (_this.state.verseText) {  // if verseText === "" is false
          save();
        } else {
          // alert the user if the text is blank
          let message = 'You are saving a blank verse. Please confirm.';
          _this.props.actions.openOptionDialog(message, (option) => {
            if (option !== "Cancel") save();
            _this.props.actions.closeAlertDialog();
          }, "Save Blank Verse", "Cancel");
        }
      },
      validateSelections(verseText) {
        _this.props.actions.validateSelections(verseText);
      },
      toggleReminder() {
        _this.props.actions.toggleReminder(_this.props.loginReducer.userdata.username);
      },
      openAlertDialog(message) {
        _this.props.actions.openAlertDialog(message);
      },
      selectModalTab(tab, section, vis) {
        _this.props.actions.selectModalTab(tab, section, vis);
      }
    };
  }

  cancelSelection() {
    this.actions.changeSelectionsInLocalState(this.props.selectionsReducer.selections);
    this.actions.changeMode('default');
  }

  clearSelection() {
    this.setState({
      selections: []
    });
  }

  saveSelection() {
    let verseText = this.verseText();
    // optimize the selections to address potential issues and save
    let selections = optimizeSelections(verseText, this.state.selections);
    this.props.actions.changeSelections(selections, this.props.loginReducer.userdata.username);
    this.actions.changeMode('default');
  }

  verseText() {
    let verseText = "";
    if (this.props.contextIdReducer && this.props.contextIdReducer.contextId) {
      const {chapter, verse, bookId} = this.props.contextIdReducer.contextId.reference;
      const bookAbbr = this.props.projectDetailsReducer.manifest.project.id;
      const {targetBible} = this.props.resourcesReducer.bibles.targetLanguage;
      if (targetBible && targetBible[chapter] && bookId == bookAbbr) {
        verseText = targetBible && targetBible[chapter] ? targetBible[chapter][verse] : "";
        if (Array.isArray(verseText)) verseText = verseText[0];
        // normalize whitespace in case selection has contiguous whitespace _this isn't captured
        verseText = normalizeString(verseText);
      }
    }
    return verseText;
  }


  findIfVerseEdited() {
    const {contextIdReducer: {contextId}, groupsDataReducer: {groupsData}} = this.props;
    let result = false;

    if (groupsData[contextId.groupId]) {
      let groupData = groupsData[contextId.groupId].filter(groupData => {
        return isEqual(groupData.contextId, contextId);
      });
      result = groupData[0].verseEdits;
    }
    return result;
  }

  handleSkip(e) {
    e.preventDefault();
    if (this.state.goToNextOrPrevious == "next") {
      this.actions.skipToNext();
    } else if (this.state.goToNextOrPrevious == "previous") {
      this.actions.skipToPrevious();
    }
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
      let selections = Array.from(nextProps.selectionsReducer.selections);
      const {chapter, verse} = nextContextIDReducer.contextId.reference || {};
      const {targetBible} = nextProps.resourcesReducer.bibles.targetLanguage || {};
      let verseText = targetBible && targetBible[chapter] ? targetBible[chapter][verse] : "";
      if (Array.isArray(verseText)) verseText = verseText[0];
      // normalize whitespace in case selection has contiguous whitespace _this isn't captured
      verseText = normalizeString(verseText);
      const mode = nextProps.selectionsReducer.selections.length > 0 || verseText.length === 0 ? 'default' : 'select';
      this.setState({
        mode: mode,
        comments: undefined,
        verseText: undefined,
        selections,
        tags: []
      });
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

  getGroupProgress(groupIndex, groupsData) {
    let groupId = groupIndex.id;
    let totalChecks = groupsData[groupId].length;
    const doneChecks = groupsData[groupId].filter(groupData =>
      groupData.selections && !groupData.reminders
    ).length;

    let progress = doneChecks / totalChecks;

    return progress;
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
      const glQuote = actions.getGLQuote(languageId, groupId, currentToolName);
      const alignedGLText = this.getAlignedGLText(
        currentProjectToolsSelectedGL, contextId, resourcesReducer.bibles, currentToolName);
      const checkInfoCardPhrase = this.getCheckInfoCardText(translationWords, contextId.groupId, resourcesReducer.translationHelps);
      const verseText = usfmjs.removeMarker(this.verseText());
      //get tHelps article
      const currentFile = tHelpsHelpers.getArticleFromState(resourcesReducer, contextId);
      const currentFileMarkdown = tHelpsHelpers.convertMarkdownLinks(currentFile, languageId);
      const tHelpsModalMarkdown = tHelpsHelpers.convertMarkdownLinks(this.state.modalArticle, languageId, this.state.articleCategory);
      return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
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
          <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
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
              actions={this.actions}
              verseText={verseText}
              mode={this.state.mode}
              dialogModalVisibility={this.state.dialogModalVisibility}
              commentChanged={this.state.commentChanged}
              findIfVerseEdited={this.findIfVerseEdited}
              tags={this.state.tags}
              verseChanged={this.state.verseChanged}
              selections={this.state.selections}
              saveSelection={this.saveSelection}
              cancelSelection={this.cancelSelection}
              clearSelection={this.clearSelection}
              handleSkip={this.handleSkip}
            />
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

export default Container;
