export function handleComment(e) {
  const comment = e.target.value;
  _this.setState({
    comment: comment
  });
}

export function checkComment(e) {
  const newcomment = e.target.value || "";
  const oldcomment = _this.props.commentsReducer.text || "";
  _this.setState({
    commentChanged: newcomment !== oldcomment
  });
}

export function cancelComment() {
  _this.setState({
    mode: 'default',
    selections: _this.props.selectionsReducer.selections,
    comment: undefined,
    commentChanged: false
  });
}


export function saveComment() {
  if (!_this.props.loginReducer.loggedInUser) {
    _this.props.actions.selectModalTab(1, 1, true);
    _this.props.actions.openAlertDialog("You must be logged in to leave a comment", 5);
    return;
  }
  _this.props.actions.addComment(_this.state.comment, _this.props.loginReducer.userdata.username);
  _this.setState({
    mode: 'default',
    selections: _this.props.selectionsReducer.selections,
    comment: undefined,
    commentChanged: false
  });
}