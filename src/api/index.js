import {ToolApi} from 'tc-tool';

export default class Api extends ToolApi {
  /**
   * Checks if a verse has been completed.
   * @param {number} chapter
   * @param {number} verse
   * @return {*}
   */
  getIsVerseFinished(chapter, verse) {
    return false;
  }
}