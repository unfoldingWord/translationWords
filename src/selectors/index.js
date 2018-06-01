export function getManifest(state) {
  return state.projectDetailsReducer.manifest;
}

export function getProjectSaveLocation(state) {
  return state.projectDetailsReducer.projectSaveLocation;
}

export function getContextId(state) {
  return state.contextIdReducer.contextId;
}

export function getIsVerseFinished(toolName, state) {
  const {toolsReducer: {apis}, contextIdReducer: {contextId}} = state;
  const toolApi = apis[toolName];
  if (toolApi && toolApi.triggerForced && contextId) {
    const {reference} = contextId;
    const verseFinished = toolApi.triggerForced('getIsVerseFinished', reference.chapter,
      reference.verse);
    return verseFinished;
  } else {
    return false;
  }
}

export function getCurrentToolName(state) {
  return state.toolsReducer.currentToolName;
}

export function getCurrentProjectToolsSelectedGL(state) {
  return state.projectDetailsReducer.currentProjectToolsSelectedGL;
}

export function getGroupsIndex(state) {
  return state.groupsIndexReducer.groupsIndex;
}

export function getResourceByName(state, resourceName) {
  return state.resourcesReducer[resourceName] ? state.resourcesReducer[resourceName] : {};
}

export function getSelections(state) {
  return state.selectionsReducer.selections;
}

export function getCurrentPaneSettings(state) {
  return state.settingsReducer.toolsSettings.ScripturePane.currentPaneSettings;
}

export function getBibles(state) {
  return state.resourcesReducer.bibles;
}