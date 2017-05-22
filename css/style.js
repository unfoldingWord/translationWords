var style = {
  translationHelpsContent: {
    overflowY: "scroll",
    minWidth: "100%",
    padding: '9px',
    minHeight: "390px",
    maxHeight: "390px",
    backgroundColor: "#c4c4c4"
  },
  buttonGlyphicons:{
    color: "#FFFFFF",
    fontSize: "20px"
  },
  tHelpsOpen:{
    float: "left",
    marginTop: "50vh",
    zIndex: "999",
    color: "#fff",
    backgroundColor: "#000",
    padding: "10px 0px",
    marginLeft: "-15px",
    borderRadius: "5px 0px 0px 5px"
  },
  tHelpsClosed:{
    float: "right",
    marginTop: "50vh",
    zIndex: "999",
    color: "#fff",
    backgroundColor: "#000",
    padding: "10px 0px",
    marginLeft: "-15px",
    borderRadius: "5px 0px 0px 5px"
  },
  linkActive: {
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '5px 20px',
    cursor: 'pointer'
  },
  linkInactive: {
    fontWeight: 'bold',
    color: 'var(--accent-color-dark)',
    margin: '5px 20px',
    textAlign: 'right',
    cursor: 'default'
  },
  checkInfo: {
    flex: '0 0 120px',
    display: 'flex',
    margin: '0 10px',
    color: 'var(--reverse-color)',
    backgroundColor: 'var(--accent-color-dark)',
    boxShadow: '0 3px 10px var(--background-color)',
    borderRadius: '2px',
  },
  leftSide: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSide: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: '10px',
    borderLeft: '1px solid var(--reverse-color)',
  },
  title: {
    maxHeight: '100px',
    overflowY: 'auto',
    padding: '0 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  phrase: {
    maxHeight: '80px',
    overflowY: 'auto',
    padding: '0 20px',
    textAlign: 'center',
  }
};

module.exports = style;
