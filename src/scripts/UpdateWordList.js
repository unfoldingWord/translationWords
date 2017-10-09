//Usage: Just put the words.md files into a directory ./scripts/words

var fs = require('fs');
var path = require('path');
var wordList = require('../static/WordList.json').wordList;
for (var i in wordList) {
  wordList[i].link = undefined;
  var originalFile = wordList[i].name;
  var newFile = wordList[i].name.split('.')[0] + '.md';
  var readFile = null;
  try {
    readFile = fs.readFileSync(path.join('./words', newFile));
  } catch(err) {
    console.log(err);
  }
  if (readFile) {
    wordList[i].file = readFile.toString();
  }
}
fs.writeFileSync('../static/WordList.json', JSON.stringify({wordList: wordList}, null, 2));
console.log('done');
