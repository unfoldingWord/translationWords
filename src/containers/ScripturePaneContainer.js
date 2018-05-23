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
      currentPaneSetting,
      contextId,
      translate
    } = this.props;
    const titleLabel = "Step 1. Read";
    const closeButtonLabel = "Close";
    const expandButtonHoverText = "Click to show expanded resource panes";
    const clickToRemoveResourceLabel = "Click to remove resource";
    const clickAddResource = "Click to add a resource";
    const addResourceLabel = "Add Resources";
    const selectLanguageLabel = "Select language";
    const selectLabel = "Select";

    const expandedScripturePaneTitle = this.makeTitle(manifest);
    return (
      <ScripturePane
        contextId={contextId}
        currentPaneSetting={currentPaneSetting}
        bibles={bibles}
        titleLabel={titleLabel}
        closeButtonLabel={closeButtonLabel}
        expandedScripturePaneTitle={expandedScripturePaneTitle}
        expandButtonHoverText={expandButtonHoverText}
        clickToRemoveResourceLabel={clickToRemoveResourceLabel}
        clickAddResource={clickAddResource}
        addResourceLabel={addResourceLabel}
        selectLanguageLabel={selectLanguageLabel}
        selectLabel={selectLabel}
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