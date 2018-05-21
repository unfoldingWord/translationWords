export function handleTagsCheckbox(tag) {
  let newState = _this.state;
  if (newState.tags === undefined) newState.tags = [];
  if (!newState.tags.includes(tag)) {
    newState.tags.push(tag);
  } else {
    newState.tags = newState.tags.filter(_tag => _tag !== tag);
  }
  _this.setState(newState);
}

export function handleEditVerse(e) {
  const verseText = e.target.value;
  _this.setState({
    verseText: verseText
  });
}