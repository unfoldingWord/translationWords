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