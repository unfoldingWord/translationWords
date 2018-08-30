import {ToolApi} from 'tc-tool';
import path from 'path-extra';

export default class Api extends ToolApi {

  constructor() {
    super();
    this.getAlignmentMemory = this.getAlignmentMemory.bind(this);
    this._loadBookSelections = this._loadBookSelections.bind(this);
    this._loadVerseSelections = this._loadVerseSelections.bind(this);
  }

  /**
   * Lifecycle method
   */
  toolWillConnect() {
    this._loadBookSelections(this.props);
  }

  /**
   * Lifecycle method
   * @param nextState
   * @param prevState
   */
  stateChangeThrottled(nextState, prevState) {
    // TODO: save the tool data
  }

  /**
   * Lifecycle method
   * @param state
   * @param props
   */
  mapStateToProps(state, props) {
    // TODO: map custom props
  }

  /**
   * Lifecycle method
   * @param dispatch
   */
  mapDispatchToProps(dispatch) {
    // TODO: map custom props
    return {};
  }

  /**
   * Lifecycle method
   */
  toolWillDisconnect() {
    // TODO: cleanup
  }

  toolWillReceiveProps(nextProps) {
    // TODO:
  }

  /**
   * Returns the alignment memory generated from selections made in tW.
   */
  getAlignmentMemory() {
    return [];
  }

  _loadBookSelections(props) {
    const {
      tc: {
        targetBible
      }
    } = props;

    const selections = {};
    for(const chapter of Object.keys(targetBible)) {
      for(const verse of Object.keys(targetBible[chapter])) {
        const verseSelections = this._loadVerseSelections(chapter, verse, props);
        if(verseSelections.length > 0) {
          if(!selections[chapter]) {
            selections[chapter] = {};
          }
          selections[chapter][verse] = verseSelections;
        }
      }
    }
    // TODO: store selection data in tool reducer.
  }

  _loadVerseSelections(chapter, verse, props) {
    const {
      tc: {
        contextId: {reference: {bookId}},
        projectFileExistsSync,
        readProjectDataSync,
        targetBible
      }
    } = props;

    const verseDir = path.join('checkData/selections/', bookId, chapter, verse);
    const selections = [];
    if(projectFileExistsSync(verseDir)) {
      // TODO: need to list files in directory.
      // I'll need to add a method to do so.
      console.warn('searching for selections in ', verseDir);

    }
    return selections;
  }

}
