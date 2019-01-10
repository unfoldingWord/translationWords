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
    this._loadCheckData = this._loadCheckData.bind(this);
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

  _loadCheckData(check, contextId) {
    const {tc: {project}} = this.props;
    const {reference: {bookId, chapter, verse}} = contextId;

    const loadPath = path.join('checkData', check, bookId, `${chapter}`,
      `${verse}`);
    let checkDataObject;

    if (project.dataPathExistsSync(loadPath)) {
      let files = project.readDataDirSync(loadPath);

      files = files.filter(file => { // filter the filenames to only use .json
        return path.extname(file) === '.json';
      });
      let sorted = files.sort().reverse(); // sort the files to use latest
      let checkDataObjects = [];

      for (let i = 0, len = sorted.length; i < len; i++) {
        const file = sorted[i];
        // get the json of all files to later filter by contextId
        try {
          let readPath = path.join(loadPath, file);
          let _checkDataObject = JSON.parse(project.readDataFileSync(readPath));
          checkDataObjects.push(_checkDataObject);
        } catch (err) {
          console.warn('File exists but could not be loaded \n', err);
          checkDataObjects.push(undefined);
        }
      }

      checkDataObjects = checkDataObjects.filter(_checkDataObject => {
        // filter the checkDataObjects to only use the ones that match the current contextId
        return _checkDataObject &&
          _checkDataObject.contextId.groupId === contextId.groupId &&
          _checkDataObject.contextId.quote === contextId.quote &&
          _checkDataObject.contextId.occurrence === contextId.occurrence;
      });
      // return the first one since it is the latest modified one
      checkDataObject = checkDataObjects[0];
    }
    /**
     * @description Will return undefined if checkDataObject was not populated
     * so that the load method returns and then dispatches an empty action object
     * to initialized the reducer.
     */
    return checkDataObject;
  }

  /**
   * Returns the total number of invalided checks
   * TODO: move category selection management into the tool so we don't need this param
   * @param {string[]} selectedCategories - an array of categories to include in the calculation.
   * @returns {number} - the number of invalid checks
   */
  getInvalidChecks(selectedCategories) {
    const {tc: {project}, tool: {name}} = this.props;
    let invalidChecks = 0;

    for (const category of selectedCategories) {
      const groups = project.getCategoryGroupIds(name, category);
      for (const group of groups) {
        const data = project.getGroupData(name, group);
        if (data && data.constructor === Array) {
          for (const check of data) {
            const checkData = this._loadCheckData('invalidated',
              check.contextId);
            if (checkData && checkData.invalidated === true) {
              invalidChecks++;
            }
          }
        } else {
          console.warn(`Invalid group data found for "${group}"`);
        }
      }
    }

    return invalidChecks;
  }

  /**
   * Returns the percent progress of completion for the project.
   * TODO: move category selection management into the tool so we don't need this param
   * @param {string[]} selectedCategories -  an array of categories to include in the calculation.
   * @returns {number} - a value between 0 and 1
   */
  getProgress(selectedCategories) {
    const {tc: {project}, tool: {name}} = this.props;
    let totalChecks = 0;
    let completedChecks = 0;

    for (const category of selectedCategories) {
      const groups = project.getCategoryGroupIds(name, category);
      for (const group of groups) {
        const data = project.getGroupData(name, group);
        if (data && data.constructor === Array) {
          for (const check of data) {
            totalChecks++;
            completedChecks += check.selections ? 1 : 0;
          }
        } else {
          console.warn(`Invalid group data found for "${group}"`);
        }
      }
    }

    if (totalChecks === 0) {
      return 0;
    } else {
      return completedChecks / totalChecks;
    }
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
        targetBook
      }
    } = props;

    const selections = {};
    for (const chapter of Object.keys(targetBook)) {
      for (const verse of Object.keys(targetBook[chapter])) {
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
        projectDataPathExistsSync,
        readProjectDataSync,
        readProjectDataDirSync
      }
    } = props;

    const verseDir = path.join('checkData/selections/', bookId, chapter, verse);
    const selections = [];
    const foundSelections = [];
    if (projectDataPathExistsSync(verseDir)) {

      let files = readProjectDataDirSync(verseDir);
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
