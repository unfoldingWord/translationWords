/* eslint-env jest */

/**
 * @file CheckInfoCard.js
 * @description This component is a display component for the Check Info Cards.
 */
import React from 'react';
import styles from '../css/style.js';
import PropTypes from 'prop-types';

class CheckInfoCard extends React.Component {
    /**
     * @description This function removes any non paragraph text from the text, then shortens it
     *              if the text is too long, also adding ellipses.
     * @param {String} text - The TranslationHelps file
     * @return {String} - The text to display
     */
    cleanText(text) {
      let splitLine = text.split('\n');
      if (splitLine.length == 1 && splitLine[0] == "") return "";
      let finalArray = [];
      for (let i = 0; i < splitLine.length; i++) {
        if (splitLine[i] !== '' && !~splitLine[i].indexOf("#")) {
          finalArray.push(splitLine[i]);
        }
      }
      let maxLength = 225;
      let finalString = "";
      let chosenString = finalArray[0];
      let splitString = chosenString.split(' ');
      for (let word of splitString) {
        if ((finalString + ' ' + word).length >= maxLength) {
          finalString+= '...';
          break;
        }
        finalString += ' ';
        finalString += word;
      }
      return finalString;
    }

    render() {
      let cleanText;
      if (this.props.file) cleanText = this.cleanText(this.props.file);

      return (
        <div style={styles.checkInfo}>
            <div style={styles.leftSide}>
                <div style={styles.title}>
                    {this.props.title}
                </div>
            </div>
          <div style={styles.rightSide}>
              <div style={styles.phrase}>
              {cleanText}
            </div>
            <div onClick={this.props.showHelps ? null : this.props.openHelps} style={this.props.showHelps ? styles.linkInactive : styles.linkActive}>
              See More
            </div>
          </div>
        </div>
      );
    }
}

CheckInfoCard.propTypes = {
  file: PropTypes.string,
  title: PropTypes.string.isRequired,
  showHelps: PropTypes.bool,
  openHelps: PropTypes.func
};

module.exports = CheckInfoCard;
