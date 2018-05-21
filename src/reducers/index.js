import { combineReducers } from 'redux';
// List of reducers
import selectionReducer from './selectionReducer'
// combining reducers
const rootReducers = combineReducers({
  selectionReducer
});

export default rootReducers;