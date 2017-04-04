// FetchData.js//

/**
* @description: This file defines the function that
* fetches the data and populates a list of checks
*/

//node modules
const XRegExp = require('xregexp');
const natural = require('natural');
const tokenizer = new natural.RegexpTokenizer({ pattern: new XRegExp('\\PL') });
const fs = require('fs');

// User imports
const Door43DataFetcher = require('../js/Door43DataFetcher.js');
const TranslationWordsFetcher = require('../translation_words/TranslationWordsFetcher.js');
const BookWordTest = require('../translation_words/WordTesterScript.js');
const BooksOfBible = require('../utils/BooksOfBible');

export default function fetchData(projectDetails, bibles, actions, progress) {
  return new Promise(function (resolve, reject) {
    const params = projectDetails.params;
    const tcManifest = params.manifest;
    const { addNewBible, setModuleSettings, addGroupData, setGroupsIndex, setProjectDetail } = actions;
    var bookData;
    var Door43Fetcher = new Door43DataFetcher();
    /**
     * @description parses data from book.
     * @param {*} bookData
     * @param {*} gatewayLanguage
     * @param {function} addGroupData
     * @param {function} setGroupsIndex
     */
    function parseDataFromBook(bookData, gatewayLanguage, addGroupData, setGroupsIndex) {
      var tWFetcher = new TranslationWordsFetcher();
      var wordList = tWFetcher.getWordList();
      tWFetcher.getAliases(function (done, total) {
          progress(done / total * 50 + 50);
      }, function (error) {
        if (error) {
          console.log(error)
        } else {
          var actualWordList = BookWordTest(tWFetcher.wordList, bookData, tWFetcher.caseSensitiveAliases);
          var mappedBook = mapVerses(bookData);
          findWords(bookData, mappedBook, actualWordList, addGroupData, setGroupsIndex, params);
          setProjectDetail('bookName', convertToFullBookName(params.bookAbbr));
          progress(100);
          resolve();
        }
      });
    }
    var gatewayLanguage = bibles.gatewayLanguage;
    /*
      * we found the gatewayLanguage already loaded, now we must convert it
      * to the format needed by the parsers
      */
    if (gatewayLanguage) {
      var reformattedBookData = { chapters: [] };
      for (var chapter in gatewayLanguage) {
        var chapterObject = {
          verses: [],
          num: parseInt(chapter)
        };
        for (var verse in gatewayLanguage[chapter]) {
          var verseObject = {
            num: parseInt(verse),
            text: gatewayLanguage[chapter][verse]
          };
          chapterObject.verses.push(verseObject);
        }
        chapterObject.verses.sort(function (first, second) {
          return first.num - second.num;
        });
        reformattedBookData.chapters.push(chapterObject);
      }
      reformattedBookData.chapters.sort(function (first, second) {
        return first.num - second.num;
      });
      parseDataFromBook(reformattedBookData, gatewayLanguage, addGroupData, setGroupsIndex);
    } else { // We need to load the data, and then reformat it for the store and store it
      var data = getULBFromDoor43Static(params.bookAbbr);
      // hijack load
      bookData = Door43Fetcher.getULBFromBook(data);
      // reformat
      var newBookData = {};
      for (var chapter of bookData.chapters) {
          newBookData[chapter.num] = {};
          for (var verse of chapter.verses) {
              newBookData[chapter.num][verse.num] = verse.text.replace(/\n.*/, '');
          }
      }
      newBookData.title = convertToFullBookName(params.bookAbbr);
      addNewBible('ULB', newBookData);
      addNewBible('gatewayLanguage', newBookData);
      parseDataFromBook(bookData, newBookData, addGroupData, setGroupsIndex);
    }
  });

  function getULBFromDoor43Static(bookAbr) {
    var ULB = {};
    ULB['chapters'] = [];
    const pathBase = __dirname + '/../static/Door43/notes/';
    var bookFolder = fs.readdirSync(pathBase + bookAbr);
    for (var chapter in bookFolder) {
      var currentChapter = [];
      if (isNaN(bookFolder[chapter])) continue;
      var chapterFolder = fs.readdirSync(pathBase + bookAbr + '/' + bookFolder[chapter]);
      var currentChapterPath = pathBase + bookAbr + '/' + bookFolder[chapter];
      currentChapter['num'] = bookFolder[chapter];
      currentChapter['verses'] = [];
      for (var verse in chapterFolder) {
        if (isNaN(chapterFolder[verse][0])) continue;
        var currentVerse = {};
        try {
          var data = fs.readFileSync(currentChapterPath + "/" + chapterFolder[verse]);
          currentVerse['file'] = data.toString();
          currentVerse['num'] = chapterFolder[verse].split('.')[0];
          currentChapter['verses'].push(currentVerse);
        } catch (e) {
          console.error(e);
        }
      }
      if (currentChapter['verses'].length > 0) ULB['chapters'].push(currentChapter);
    }
    return ULB;
  }
  // End fetch

    /**
     * @description - This creates an object from a string, in this case it'll always be a verse.
     * The object's keys are the indices of each word found in the string. The keys' values are objects
     * that contain the word, and a 'marked' boolean
     * @param {string} verse - a verse that can be tokenized to create the object
     * @return {object} returnObject
     */
  function mapVerseToObject(verse) {
    var words = tokenizer.tokenize(verse),
      returnObject = {},
      currentText = verse,
      currentIndex = 0;
    for (var word of words) {
      var index = currentText.indexOf(word);
      /* currentIndex is used to keep track of where we are in the whole verse, because the slicing
        * returns an invalid index within the context of the entire verse
        */
      currentIndex += index;
      returnObject[currentIndex] = { 'word': word, 'marked': false };
      currentIndex += word.length;
      currentText = verse.slice(currentIndex);
    }
    return returnObject;
  }

    /**
     * @description = This finds a specific word from wordObject within the given verse.
     * It then will create a new check object when a valid word is found and push it onto
     * an array which is returned
     * @param {int} chapterNumber - an integer indicating the current chapter so that it can be
     * added to the check object once a check object is created
     * @param {object} verseObject - an object with two fields: 'num' which is an int indicating
     * the verse number within the current chapter, and 'text' which is a string holding the actual text
     * of the verse
     * @param {object} mappedVerseObject - This is an object containing index keys to the individual words
     * of the verse. See {@link mapVerseToObject}
     * @param {object} wordObject - This is an object containing various fields about the word we're
     * currently searching for, primary key for this methods are the wordObject's regexes
     */
  function findWordInVerse(chapterNumber, verseObject, mappedVerseObject, wordObject, addGroupData, params) {
    var checkArray = [];
    var sortOrder = 0;
    let previousWord = '';
    let occurenceNumber = 1;
    for (var regex of wordObject.regex) {
      var groupName = verseObject.text.match(regex);
      while (groupName) {
        if (!checkIfWordsAreMarked(groupName, mappedVerseObject)) {
          if (groupName[0] === previousWord) {
            occurenceNumber++
          }
          previousWord = groupName[0];
          let groupId = wordObject.name.replace(/\.txt$/,'')
          addGroupData(groupId, [{
            priority: 1,
            information: wordObject.file,
            contextId: {
              reference: {
                bookId: params.bookAbbr,
                chapter: chapterNumber,
                verse: verseObject.num
              },
              tool: "ImportantWords",
              groupId: groupId,
              quote: groupName[0],
              occurrence: occurenceNumber
            }
          }]);
        }
        groupName = stringMatch(verseObject.text, regex, groupName.index + incrementIndexByWord(groupName));
      }
    }
  }

  /**
   * @description - This function will tokenize the matched string from the given match and return the length of
   * the length of first word in the match
   * @param {object} match - the object returned from a string.match(regexp) method call
   */
  function incrementIndexByWord(match) {
    if (!match) {
      console.error("Can't increment an index with an invalid match!");
      return 0;
    }
    var string = match[0];
    var words = tokenizer.tokenize(string);
    return words[0].length;
  }

  /**
   * @description - Does a string.match method for the given regex but only returns the first match
   * who's index is > the given index. Also supports regexes with alternating groups that might have
   * sub matches within the string, which is an edge case but definitely occurs in TranslationWords Check
   * @param {string} string - the string to match against
   * @param {XRegExp or RegExp} - the regex that the string will be matched with
   * @param {int} index - an integer indicator to only return a match if the match's index if > this
   * indicator
   */
  function stringMatch(string, regex, index) {
    var match = string.match(regex);
    var lastIndex = 0;
    while (match && match.index < index) {
      lastIndex = match.index + incrementIndexByWord(match);
      match = string.slice(lastIndex).match(regex);
      if (match) {
        match.index += lastIndex;
      }
    }
    return match;
  }

  /**
   * @description - This method checks to see if any of the words contained in the match
   * have already been 'marked' within the given verse object
   * @param {object} match - match that is returned from string.match(XRegExp) or string.match(RegExp)
   * @param {object} verseObject - a mapped verse object that contains index keys to individual words
   * of a verse. See {@link mapVerseToObject}
   */
  function checkIfWordsAreMarked(match, verseObject) {
    var matchedWords = tokenizer.tokenize(match[0]);
    var indexes = [];
    for (var word of matchedWords) {
        indexes.push(match.index + match[0].indexOf(word));
    }
    var matchedWordObjects = [];
    for (var index of indexes) {
      if (verseObject[index]) {
        if (verseObject[index].marked) {
          return true;
        } else {
          matchedWordObjects.push(verseObject[index]);
        }
      } else {
        console.log("Can't find index: " + index + " in verseObject");
        console.dir(verseObject);
      }
    }
    for (var matchedObject of matchedWordObjects) {
      matchedObject.marked = true;
    }
    return false;
  }

  /**
   * @description - This takes the data from a book of the Bible returned by
   * Door43DataFetcher and returns an array of arrays containing mappedVerseObjects for
   * each verse for each chapter. See {@link mapVerseToObject}
   * @param {object} - the data from downloading a book returned by Door43DataFetcher
   */
  function mapVerses(bookData) {
    var mapVerse = [];
    for (var chapter of bookData.chapters) {
      var chapterMap = [];
      for (var verse of chapter.verses) {
        chapterMap[verse.num] = mapVerseToObject(verse.text);
      }
      mapVerse[chapter.num] = chapterMap;
    }
    return mapVerse;
  }

  /**
   * @description - This does a {@link findWordInVerse} for every word given in wordList and returns
   * the list of checks for the ImportantWords
   * @param {object} bookData - This is the data returned by Door43DataFetcher after downloading
   * an entire book of the Bible
   * @param {array} mapBook - This is the array containing arrays of mappedVerses. See {@link mapVerses}
   * @param {array} wordList - list of objects containing all the necessary data to look for words
   * in the book data. This list should be a filtered list from the entire translationWords list as
   * this method has many inner loops
   */
  function findWords(bookData, mapBook, wordList, addGroupData, setGroupsIndex, params) {
    var indexList = [];
    for (var word of wordList) {
      var groupName = word['file'].match(/# .*/)[0].replace(/#/g, '');
      var wordReturnObject = {
        groupId: word.name.replace(/\.txt$/,''),
        groupName: groupName.trim()
      };
      indexList.push({
        id: wordReturnObject.groupId,
        name: wordReturnObject.groupName
      });
      for (var chapter of bookData.chapters) {
        for (var verse of chapter.verses) {
          findWordInVerse(chapter.num, verse, mapBook[chapter.num][verse.num], word, addGroupData, params);
        }
      }
    }
    setGroupsIndex(indexList);
  }

    /**
 * @description - Method to convert a book abbreviation to the full name
 *
 * @param {string} bookAbbr
 */
  function convertToFullBookName(bookAbbr) {
    if (!bookAbbr) return;
    return BooksOfBible[bookAbbr.toString().toLowerCase()];
  }
}