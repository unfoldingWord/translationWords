//CheckInfoCard.js//
/**
 * @author Ian Hoegen
 * @description This component is a display component for the Check Info Cards.
 */
const React = api.React;
const RB = api.ReactBootstrap;
const {Row, Glyphicon, Col} = RB;
const styles = require('../css/style.js');
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class CheckInfoCard extends React.Component {
    /**
     * @description This function removes any non paragraph text from the text, then shortens it
     *              if the text is too long, also adding ellipses.
     * @param {String} text - The TranslationHelps file
     * @return {String} - The text to display
     */
    cleanText(text) {
      let splitLine = text.split('\n');
      let finalArray = []
      for (let i = 0; i < splitLine.length; i++) {
        if (splitLine[i] !== '' && !~splitLine[i].indexOf("#")) {
          finalArray.push(splitLine[i])
        }
      }
      let maxLength = 115;
      let finalString = "";
      let chosenString = finalArray[0];
      let splitString = chosenString.split(' ');
      for (let word of splitString) {
        if ((finalString + ' ' + word).length >= maxLength) {
          finalString+= '...'
          break;
        }
        finalString += ' ';
        finalString += word;
      }
      return finalString;
    }
    render() {
      return (
        <div style={{margin: '10px'}}>
        <Card zDepth={2} style={{ background: '#03A9F4', padding: "20px"}}>
          <Row>
            <Col md={4} style={{borderRight: '1px solid #FFFFFF'}}>
              <div style={styles.title}>
                {this.props.title}
              </div>
            </Col>
            <Col md ={6}>
              <div style={{color: '#FFFFFF'}}>
                {this.cleanText(this.props.file)}
              </div>
            </Col>
            <Col md={2}>
              <div onClick={this.props.showHelps ? null : this.props.openHelps}
              style={this.props.showHelps ? styles.linkInactive : styles.linkActive}>
                See More
              </div>
            </Col>
          </Row>
        </Card>
        </div>
      );
    }
}

module.exports = CheckInfoCard;
