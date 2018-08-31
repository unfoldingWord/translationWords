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
    // TODO: perform initial selection loading when the tool connects.
    // This must wait until after all selection logic is migrated to tW.
    const selections = this._loadBookSelections(this.props);
    const alignmentMemory = [];

    for(const chapter of Object.keys(selections)) {
      for(const verse of Object.keys(selections[chapter])) {
        for(const selection of selections[chapter][verse]) {
          if(selection.selections.length === 0) continue;
          const sourceText = selection.contextId.quote;
          const targetText = selection.selections.map(s => s.text).join(' ');
          alignmentMemory.push({
            sourceText,
            targetText
          });
        }
      }
    }

    return alignmentMemory;
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
    return selections;
  }

  _loadVerseSelections(chapter, verse, props) {
    const {
      tc: {
        contextId: {reference: {bookId}},
        projectFileExistsSync,
        readProjectDataSync,
        readProjectDirSync
      }
    } = props;

    const verseDir = path.join('checkData/selections/', bookId, chapter, verse);
    const selections = [];
    const foundGroupIds = [];
    if(projectFileExistsSync(verseDir)) {

      let files = readProjectDirSync(verseDir);
      files = files.filter(f => path.extname(f) === '.json');
      files = files.sort().reverse();
      for(let i = 0; i < files.length; i ++) {
        let filePath = path.join(verseDir, files[i]);

        let data;
        try {
          data = JSON.parse(readProjectDataSync(filePath));
        } catch (err) {
          console.error(`failed to read selection data from ${filePath}`, err);
          continue;
        }

        if(data && data.contextId) {
          const groupId = data.contextId.groupId;
          if (foundGroupIds.indexOf(groupId) === -1) {
            foundGroupIds.push(groupId);
            selections.push(data);
          }
        }
      }
    }
    return selections;
  }

}
