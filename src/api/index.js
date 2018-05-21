import {ToolApi} from 'tc-tool';

export default class Api extends ToolApi {
  /**
 * Lifecycle method
 * @param state
 * @param props
 * @return {*}
 */
  mapStateToProps(state, props) {
    return {
      random:'hi'
    }
  }

    /**
   * Checks if a verse has been completed.
   * @param {number} chapter
   * @param {number} verse
   * @return {*}
   */
  getIsVerseFinished(chapter, verse) {
    const {store} = this.context;
    return false;
  }
}