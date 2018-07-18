import React from 'react';
import {ScripturePane} from 'tc-ui-toolkit';

class ScripturePaneContainer extends React.Component {
  makeTitle(manifest) {
    const {target_language, project} = manifest;
    if (target_language && target_language.book && target_language.book.name) {
      return target_language.book.name;
    } else {
      return project.name;
    }
  }

  render() {
    const {
      manifest,
      showPopover,
      editTargetVerse,
      projectDetailsReducer,
      getLexiconData,
      selections,
      setToolSettings,
      bibles,
      contextId,
      translate,
      currentPaneSettings
    } = this.props;

    const expandedScripturePaneTitle = this.makeTitle(manifest);
    return (
      <ScripturePane
        currentPaneSettings={currentPaneSettings}
        contextId={contextId}
        bibles={bibles}
        expandedScripturePaneTitle={expandedScripturePaneTitle}
        showPopover={showPopover}
        editTargetVerse={editTargetVerse}
        projectDetailsReducer={projectDetailsReducer}
        translate={translate}
        getLexiconData={getLexiconData}
        selections={selections}
        setToolSettings={setToolSettings} />
    );
  }
}

export default ScripturePaneContainer;