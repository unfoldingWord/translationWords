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
  getCurrentProjectToolsSelectedGL,
  getGroupsIndex,
  getResourceByName
} from './selectors';
// helpers
import * as settingsHelper from './helpers/settingsHelper';
//containers
import GroupMenuContainer from './containers/GroupMenuContainer';
import VerseCheckContainer from './containers/VerseCheckContainer';
import TranslationHelpsContainer from './containers/TranslationHelpsContainer';
import CheckInfoCardContainer from './containers/CheckInfoCardContainer';


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

  toggleHelps() {
    this.setState({showHelps: !this.state.showHelps});
  }

  render() {
    const {
      contextIdReducer: {contextId},
    } = this.props;

    if (contextId !== null) {
      // const glQuote = actions.getGLQuote(languageId, groupId, currentToolName);
      return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <GroupMenuContainer {...this.props.groupMenu} />
          <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <CheckInfoCardContainer
              toggleHelps={this.toggleHelps.bind(this)}
              showHelps={this.state.showHelps}
              {...this.props.checkInfoCard} />
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
    },
    checkInfoCard: {
      translate: ownProps.translate,
      translationHelps: getResourceByName(ownProps, 'translationHelps'),
      groupsIndex: getGroupsIndex(ownProps),
      contextId: getContextId(ownProps)
    }
  };
};


export default connect(mapStateToProps)(Container);
