import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {GroupMenu} from 'tc-ui-toolkit';

class GroupMenuContainer extends React.Component {
  getGroupProgress(groupIndex, groupsData) {
    let groupId = groupIndex.id;
    let totalChecks = groupsData[groupId].length;
    const doneChecks = groupsData[groupId].filter(groupData =>
      groupData.selections && !groupData.reminders
    ).length;

    let progress = doneChecks / totalChecks;

    return progress;
  }
  render() {
    const {
      translate,
      actions,
      isVerseFinished,
      groupsDataReducer,
      groupsIndexReducer,
      groupMenuReducer,
      toolsReducer,
      contextId,
      manifest,
      projectSaveLocation
    } = this.props;
    return (
      <GroupMenu
        translate={translate}
        getSelections={(contextId) => actions.getSelectionsFromContextId(contextId, projectSaveLocation)}
        getGroupProgress={this.getGroupProgress}
        isVerseFinished={isVerseFinished}
        groupsDataReducer={groupsDataReducer}
        groupsIndexReducer={groupsIndexReducer}
        groupMenuReducer={groupMenuReducer}
        toolsReducer={toolsReducer}
        contextIdReducer={{contextId}}
        projectDetailsReducer={{manifest, projectSaveLocation}}
        actions={actions} />
    );
  }
}

GroupMenuContainer.propTypes = {
  translate: PropTypes.func,
  isVerseFinished: PropTypes.any,
  projectSaveLocation: PropTypes.string,
  groupMenuReducer: PropTypes.object,
  manifest: PropTypes.object,
  groupsIndexReducer: PropTypes.object,
  groupsDataReducer: PropTypes.object,
  contextId: PropTypes.object.isRequired,
  toolsReducer: PropTypes.object,
  actions: PropTypes.shape({
    getSelectionsFromContextId: PropTypes.func.isRequired,
  }),
  projectDetailsReducer: PropTypes.object
};

export default connect()(GroupMenuContainer);
