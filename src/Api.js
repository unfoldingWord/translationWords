import {ToolApi} from 'tc-tool';
import path from 'path-extra';

export default class Api extends ToolApi {

  constructor() {
    super();
    this.getAlignmentMemory = this.getAlignmentMemory.bind(this);
    this.getInvalidChecks = this.getInvalidChecks.bind(this);
    this.getProgress = this.getProgress.bind(this);
    this._loadBookSelections = this._loadBookSelections.bind(this);
    this._loadVerseSelections = this._loadVerseSelections.bind(this);
  }

  /**
   * Lifecycle method
   */
  toolWillConnect() {
    // TODO: implement
  }

  /**
   * Lifecycle method
   * @param nextState
   * @param prevState
   */
  stateChangeThrottled(nextState, prevState) {
    // TODO: implement
  }

  /**
   * Lifecycle method
   * @param state
   * @param props
   */
  mapStateToProps(state, props) {
    // TODO: implement
  }

  /**
   * Lifecycle method
   * @param dispatch
   */
  mapDispatchToProps(dispatch) {
    // TODO: implement
    return {};
  }

  /**
   * Lifecycle method
   */
  toolWillDisconnect() {
    // TODO: implement
  }

  toolWillReceiveProps(nextProps) {
    // TODO: implement
  }

  /**
   * Returns the total number of invalided checks
   * @returns {number}
   */
  getInvalidChecks() {
    return 0;
  }

  /**
   * Returns the % progress of completion for the project.
   * @returns {number} - a value between 0 and 1
   */
  getProgress() {
    // const {
    //   tc: {
    //     projectDataPathExistsSync,
    //     readProjectData,
    //     readProjectDirSync,
    //     contextId: {
    //       reference: {bookId}
    //     }
    //   }
    // } = this.props;
    //
    // const checksDataPath = path.join('index', 'translationWords', bookId);
    // const categories = []; // TODO: where can we get this?
    //
    // if(projectDataPathExistsSync(checksDataPath)) {
    //   const groupsData = readProjectDirSync(checksDataPath).filter(file => {
    //     return file !== '.DS_Store' && path.extname(file) === '.json';
    //   });
    //   const availableCheckCategories = [];
    //   // TRICKY: translationWords only uses checks that are also available in the greek (OL)
    //   const languageId = 'grc';
    //   // TODO: this is a horrible hack. There needs to be a way for tools to read resources without know where they actually are.
    //   // can't the checks be passed down into the tool?
    //   const USER_RESOURCES_PATH = path.join(ospath.home(), 'translationCore', 'resources');
    //   const toolResourcePath = path.join(USER_RESOURCES_PATH, languageId, 'translationHelps', toolName);
    //   // TODO: tc should provide the appropriate resource path to the tool.
    //   // const versionPath = ResourceHelpers.getLatestVersionInPath(toolResourcePath) || toolResourcePath;
    //
    //   // we don't actually need the path to the full resources. These can be updated to be copied over
    //   // when the project is selected. Then the tool will just have to look in it's own data directory.
    // }

    return 0;
  }

  /**
   * Returns the alignment memory generated from selections made in tW.
   * @return {{sourceText : string, targetText : string}[]}
   */
  getAlignmentMemory() {
    // TODO: perform initial selection loading when the tool connects.
    // This must wait until after all selection logic is migrated to tW.
    const selections = this._loadBookSelections(this.props);
    const alignmentMemory = [];

    // format selections as alignment memory
    for (const chapter of Object.keys(selections)) {
      for (const verse of Object.keys(selections[chapter])) {
        for (const selection of selections[chapter][verse]) {
          if (selection.selections.length === 0) continue;
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

  /**
   * Loads the selection data for the entire book
   * @param props
   * @private
   */
  _loadBookSelections(props) {
    const {
      tc: {
        targetBible
      }
    } = props;

    const selections = {};
    for (const chapter of Object.keys(targetBible)) {
      for (const verse of Object.keys(targetBible[chapter])) {
        const verseSelections = this._loadVerseSelections(chapter, verse,
          props);
        if (verseSelections.length > 0) {
          if (!selections[chapter]) {
            selections[chapter] = {};
          }
          selections[chapter][verse] = verseSelections;
        }
      }
    }
    // TODO: store selection data in tool reducer.
    return selections;
  }

  /**
   * Loads the selection data for a verse
   * @param {string} chapter
   * @param {string} verse
   * @param props
   * @return {Array}
   * @private
   */
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
    const foundSelections = [];
    if (projectFileExistsSync(verseDir)) {

      let files = readProjectDirSync(verseDir);
      files = files.filter(f => path.extname(f) === '.json');
      files = files.sort().reverse();
      for (let i = 0; i < files.length; i++) {
        let filePath = path.join(verseDir, files[i]);

        let data;
        try {
          data = JSON.parse(readProjectDataSync(filePath));
        } catch (err) {
          console.error(`failed to read selection data from ${filePath}`, err);
          continue;
        }

        if (data && data.contextId) {
          const id = `${data.contextId.groupId}:${data.contextId.quote}`;
          if (foundSelections.indexOf(id) === -1) {
            foundSelections.push(id);
            selections.push(data);
          }
        }
      }
    }
    return selections;
  }

}
