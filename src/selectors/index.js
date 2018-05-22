export function getManifest(state) {
  return state.projectDetailsReducer.manifest;
}

export function getProjectSaveLocation(state) {
  return state.projectDetailsReducer.projectSaveLocation;
}

export function getContextId(state) {
  return state.contextIdReducer.contextId;
}

export function getAlignmentData(state) {
  const {toolsReducer: {apis}} = state;
  //todo
  return {};
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