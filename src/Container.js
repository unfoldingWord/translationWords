/* eslint-env jest */
import React from 'react';
import PropTypes from 'prop-types';
// helpers
import * as settingsHelper from './helpers/settingsHelper';
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
      actions,
    } = this.props;

    if (contextId !== null) {
      const languageId = currentProjectToolsSelectedGL[currentToolName];
      const {groupId} = contextId;
      const title = groupsIndexReducer.groupsIndex.filter(item => item.id === groupId)[0].name;
      const glQuote = actions.getGLQuote(languageId, groupId, currentToolName);

      return (
        <div style={{display:'flex', flexDirection:'row'}}>
          <GroupMenu
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
            <VerseCheck />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

// <VerseEditor
// onSubmit={() => this.setState({showVersEditor: false})}
// onCancel={() => this.setState({showVersEditor: false})}
// open={this.state.showVersEditor}
// translate={key => key}
// verseTitle={'Title'}
// verseText={'Verse Text'} />
// glQuote={glQuote}
// translate={translate}
// title={title}
// showHelps={this.state.showHelps}
// toggleHelps={this.toggleHelps.bind(this)}

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
