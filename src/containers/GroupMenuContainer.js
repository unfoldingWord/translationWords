import React from 'react';
import {connect} from 'react-redux';
import {GroupMenu} from 'tc-ui-toolkit';

class GroupMenuContainer extends React.Component {
  render() {
    debugger;
    const {
      translate,
      actions,
      alignmentData,
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
        alignmentData={alignmentData}
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

const mapStateToProps = state => {
  debugger;
  return {

  }
}
const mapDispatchToProps = (dispatch) => {
  return {
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(GroupMenuContainer);