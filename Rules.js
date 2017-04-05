const fs = require('fs');
const path = require('path');
/**
 *
 * @param {string} bookName - The name of the book whose rule is being used
 * @param {Object} wordList - The wordList to reference
 * @returns The rule being used
 *
 */
function getRules(bookName, wordList) {
  var previousWord = '';
  var occurenceNumber = 1;
  var sortOrder = 0;
  var rules = fs.readFileSync(path.join(__dirname, 'rules', bookName + '.csv')).toString();
  var lines = rules.split(/\n/g);
  var matrix = [];
  var groups = {};
  for (let i = 0; i < lines.length; i++) {
    matrix[i] = CSVtoArray(lines[i]);
  }
  for (var i = 0; i < matrix.length; i++) {
    var currentItem = matrix[i];
    if (!groups[matrix[i][5]]) {
      groups[currentItem[5]] = [];
    }
    if (previousWord === currentItem[3]) {
      occurenceNumber++;
    } else {
      occurenceNumber = 1;
      sortOrder = 0;
    }
    previousWord = currentItem[3];
    let reg;
    for (var word in wordList) {
      if (wordList[word].name === currentItem[4].toLowerCase()) {
        reg = wordList[word].regex[0];
        break;
      }
    }
    var match = currentItem[6].match(reg);
    if (!match) {
      match = currentItem[6].match(currentItem[3]);
    }
    groups[currentItem[5]].push({
      "chapter": currentItem[1],
      "verse": currentItem[2],
      "checkStatus": "UNCHECKED",
      "spelling": false,
      "wordChoice": false,
      "punctuation": false,
      "meaning": false,
      "grammar": false,
      "other": false,
      "proposedChanges": "",
      "comment": "",
      "phrase": currentItem[3],
      "wordOccurrence": occurenceNumber,
      "wordIndex": match.index,
      "selectedText": [],
      "selectedWordsRaw": [],
      "sortOrder": sortOrder++,
      "file": currentItem[4]
    });
  }
  var groupArray = [];
  for (var groupName in groups) {
    groupArray.push({
      checks: groups[groupName],
      group: groups[groupName][0].file,
      groupName: groupName
    });
  }
  return groupArray;
}

/**
 * This function converts a string to a CSV array.
 * @param {String} text - A single line out of a CSV file
 * @return {Array} Null if not valid CSV, otherwise an array of columns
 */
function CSVtoArray(text) {
  var reValid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
  var reValue = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
  if (!reValid.test(text)) return null;
  var a = [];                     // Initialize array to receive values.
  text.replace(reValue, // "Walk" the string using replace with callback.
    function(m0, m1, m2, m3) {
      // Remove backslash from \' in single quoted values.
      if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
      // Remove backslash from \" in double quoted values.
      else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
      else if (m3 !== undefined) a.push(m3);
      return ''; // Return empty string.
    });
    // Handle special case of empty last value.
  if (/,\s*$/.test(text)) a.push('');
  return a;
}

module.exports = getRules;
