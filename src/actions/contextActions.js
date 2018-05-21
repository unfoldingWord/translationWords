export function handleGoToNext() {
  if (!_this.props.loginReducer.loggedInUser) {
    _this.props.actions.selectModalTab(1, 1, true);
    _this.props.actions.openAlertDialog("You must be logged in to save progress");
    return;
  }
  props.actions.goToNext();
}

export function handleGoToPrevious() {
  if (!_this.props.loginReducer.loggedInUser) {
    _this.props.actions.selectModalTab(1, 1, true);
    _this.props.actions.openAlertDialog("You must be logged in to save progress");
    return;
  }
  props.actions.goToPrevious();
}

export function skipToNext() {
  _this.setState({dialogModalVisibility: false});
  props.actions.goToNext();
}

export function skipToPrevious() {
  _this.setState({dialogModalVisibility: false});
  props.actions.goToPrevious();
}