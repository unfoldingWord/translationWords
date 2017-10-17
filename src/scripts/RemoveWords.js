//Usage: Just put the words.md files into a directory ./scripts/words

var fs = require('fs');
var path = require('path');
var wordList = require('../static/WordList.json').wordList;
for (var i in wordList) {
  var originalFile = wordList[i].name;
  var newFile = wordList[i].name.split('.')[0] + '.md';
  var readFile = null;
  try {
    readFile = fs.readFileSync(path.join('./words', newFile));
  } catch(err) {
    wordList.splice(i, 1);
  }
}
fs.writeFileSync('../static/WordList.json', JSON.stringify({wordList: wordList}, null, 2));
console.log('done');
