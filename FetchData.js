import scripturePaneData from '../ScripturePane/FetchData';
import tWFetchData from './tWFetchData'

export default function fetchAllData(props) {
  const projectDetails = props.projectDetailsReducer;
  const bibles = props.resourcesReducer.bibles;
  const actions = props.actions;
  return new Promise(function(resolve, reject) {
    scripturePaneData(projectDetails, bibles, actions)
    .then(()=>tWFetchData(projectDetails, bibles, actions))
    .then(resolve);
  })
}
