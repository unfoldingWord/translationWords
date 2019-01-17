import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import InvalidatedIcon from "../components/icons/Invalidated";
import CheckIcon from '@material-ui/icons/Check';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BlockIcon from '@material-ui/icons/Block';
import ModeCommentIcon from '@material-ui/icons/ModeComment';
import EditIcon from '@material-ui/icons/Edit';
import GroupMenu, {generateMenuData} from '../components/GroupMenu';
import Api from '../Api';

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

  /**
   * Handles click events from the menu
   * @param {object} contextId - the menu item's context id
   */
  handleClick = contextId => {
    const {tc: {actions: {changeCurrentContextId}}} = this.props;
    changeCurrentContextId(contextId);
  };

  /**
   * Preprocess a menu item
   * @param {object} item - an item in the groups data
   * @returns {object} the updated item
   */
  onProcessItem = item => {
    const {tc: {project}, toolApi} = this.props;
    const bookName = project.getBookName();

    const {
      contextId: {
        reference: {bookId, chapter, verse}
      }
    } = item;

    // build selection preview
    let selectionText = "";
    if(item.selections) {
      selectionText = item.selections.map(s => s.text).join(" ");
    }

    // build passage title
    let passageText = `${bookName} ${chapter}:${verse}`;
    if(selectionText) {
      passageText = `${bookId} ${chapter}:${verse}`;
    }

    return {
      ...item,
      title: `${passageText} ${selectionText}`,
      // completed: false,//toolApi.getIsVerseFinished(chapter, verse), // TODO: I could read from state if I load these into the reducer at startup.
      // invalid: false//toolApi.getIsVerseInvalid(chapter, verse)
    };
  };

  render() {
    const {
      translate,
      tc: {
        contextId,
        groupsDataReducer: {groupsData},
        groupsIndexReducer: {groupsIndex}
      }
    } = this.props;

    const filters = [
      {
        label: translate('menu.invalidated'),
        key: 'invalidated',
        icon: <InvalidatedIcon/>
      },
      {
        label: translate('menu.bookmarks'),
        key: 'reminders',
        icon: <BookmarkIcon/>
      },
      {
        label: translate('menu.selected'),
        key: 'selections',
        disables: ['no-selections'],
        icon: <CheckIcon/>
      },
      {
        label: translate('menu.no_selection'),
        id: 'no-selections',
        key: 'selections',
        value: false,
        disables: ['selections'],
        icon: <BlockIcon/>
      },
      {
        label: translate('menu.verse_edit'),
        key: 'verseEdits',
        icon: <EditIcon/>
      },
      {
        label: translate('menu.comments'),
        key: 'comments',
        icon: <ModeCommentIcon/>
      }
    ];

    const statusIcons = [
      {
        key: 'selections',
        icon: <CheckIcon style={{color: "white"}}/>
      },
      {
        key: 'reminders',
        icon: <BookmarkIcon style={{color: "white"}}/>
      },
      {
        key: 'invalidated',
        icon: <InvalidatedIcon style={{color: "white"}}/>
      },
      {
        key: 'comments',
        icon: <ModeCommentIcon style={{color: "white"}}/>
      },
      {
        key: 'verseEdits',
        icon: <EditIcon style={{color: "white"}}/>
      }
    ];

    const entries = generateMenuData(
      groupsIndex,
      groupsData,
      'selections',
      this.onProcessItem
    );

    return (
      <GroupMenu
        filters={filters}
        entries={entries}
        active={contextId}
        statusIcons={statusIcons}
        emptyNotice={translate('menu.no_results')}
        title={translate('menu.menu')}
        onItemClick={this.handleClick}
        // translate={translate}
        // getSelections={(contextId) => actions.getSelectionsFromContextId(
        //   contextId, projectSaveLocation)}
        // getGroupProgress={this.getGroupProgress}
        // isVerseFinished={isVerseFinished}
        // groupsDataReducer={groupsDataReducer}
        // groupsIndexReducer={groupsIndexReducer}
        // groupMenuReducer={groupMenuReducer}
        // toolsReducer={toolsReducer}
        // contextIdReducer={{contextId}}
        // projectDetailsReducer={{manifest, projectSaveLocation}}
        // actions={actions}
      />
    );
  }
}

GroupMenuContainer.propTypes = {
  tc: PropTypes.object.isRequired,
  toolApi: PropTypes.instanceOf(Api),
  translate: PropTypes.func.isRequired,

  // translate: PropTypes.func,
  // isVerseFinished: PropTypes.any,
  // projectSaveLocation: PropTypes.string,
  // groupMenuReducer: PropTypes.object,
  // manifest: PropTypes.object,
  groupsIndexReducer: PropTypes.object,
  groupsDataReducer: PropTypes.object,
  // contextId: PropTypes.object.isRequired,
  // toolsReducer: PropTypes.object,
  // actions: PropTypes.shape({
  //   getSelectionsFromContextId: PropTypes.func.isRequired
  // }),
  // projectDetailsReducer: PropTypes.object
};

export default connect()(GroupMenuContainer);
