
const api = window.ModuleApi;
const NAMESPACE = "TranslationWordsChecker";

module.exports = {
  /*
   * This event will  increment the checkIndex by one,
   * and might increment the group index if needed. Because no parameters are given
   * from the event, we have to get the current indexes from the store and increment it
   * manually before updating the store
   */
    goToNext: function(params) {
        var currentCheckIndex = api.getDataFromCheckStore(NAMESPACE, 'currentCheckIndex');
        var currentGroupIndex = api.getDataFromCheckStore(NAMESPACE, 'currentGroupIndex');
        this.changeCurrentCheckInCheckStore(currentGroupIndex, currentCheckIndex + 1);
    },

    goToPrevious: function(params) {
        var currentCheckIndex = api.getDataFromCheckStore(NAMESPACE, 'currentCheckIndex');
        var currentGroupIndex = api.getDataFromCheckStore(NAMESPACE, 'currentGroupIndex');
        this.changeCurrentCheckInCheckStore(currentGroupIndex, currentCheckIndex - 1);
    },
    /*
     * This event listens for an event that will tell us another check to go to.
     * This and the above listener need to be two
     * seperate listeners because the 'gotoNext' event won't have parameters attached to it
     */
    goToCheck: function(params) {
      this.changeCurrentCheckInCheckStore(params.groupIndex, params.checkIndex);
    },
    /**
     * This event listens for an event to change the check type, checks if we're switching to
     * TranslationWordsCheck, then updates our state if we are
     */
    changeCheckType: function(params) {
      if(params.currentCheckNamespace === NAMESPACE) {
        this.updateState();
      }
    }
}
