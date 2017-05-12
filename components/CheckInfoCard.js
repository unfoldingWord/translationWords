/**
 * @file CheckInfoCard.js
 * @description This component is a display component for the Check Info Cards.
 */
import React from 'react'
import {Row, Glyphicon, Col} from 'react-bootstrap'
import styles from '../css/style.js'
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
      if (splitLine.length == 1 && splitLine[0] == "") return ""
      let finalArray = []
      for (let i = 0; i < splitLine.length; i++) {
        if (splitLine[i] !== '' && !~splitLine[i].indexOf("#")) {
          finalArray.push(splitLine[i])
        }
      }
      let maxLength = 135;
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
        <div style={styles.checkInfo}>
          <div style={styles.leftSide}>
            {this.props.title}
          </div>
          <div style={styles.rightSide}>
            <div>
              {this.cleanText(this.props.file)}
            </div>
            <div onClick={this.props.showHelps ? null : this.props.openHelps}
                 style={this.props.showHelps ? styles.linkInactive : styles.linkActive}>
              See More
            </div>
          </div>
        </div>
      );
    }
}

module.exports = CheckInfoCard;
