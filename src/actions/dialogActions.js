export function handleOpenDialog(goToNextOrPrevious) {
  _this.setState({goToNextOrPrevious});
  _this.setState({dialogModalVisibility: true});
}
export function handleCloseDialog() {
  _this.setState({dialogModalVisibility: false});
}