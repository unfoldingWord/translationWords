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
const path = require('path-extra');
import isEqual from 'lodash/isEqual'
// User imports
const Door43DataFetcher = require('../js/Door43DataFetcher.js');
const TranslationWordsFetcher = require('../translation_words/TranslationWordsFetcher.js');
const BookWordTest = require('../translation_words/WordTesterScript.js');
const BooksOfBible = require('../utils/BooksOfBible');

export default function fetchData(projectDetails, bibles, actions, progress, groupsIndexLoaded, groupsDataLoaded) {
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
          findWords(bookData, mappedBook, actualWordList, addGroupData, setGroupsIndex, params, groupsIndexLoaded, groupsDataLoaded);
          setProjectDetail('bookName', convertToFullBookName(params.bookAbbr));
          progress(100);
          resolve();
        }
      });
    }
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
  function findWordInVerse(chapterNumber, verseObject, mappedVerseObject, wordObject, addGroupData, params, checkObj, filter) {
    var checkArray = [];
    var sortOrder = 0;
    let previousWord = '';
    let occurrenceNumber = 1;
    for (var regex of wordObject.regex) {
      var groupName = verseObject.text.match(regex);
      while (groupName) {
        var error = false;
        switch (groupName[0]) {
          case "Father":
            if (wordObject.name !== "godthefather.txt") error = true;
            break;
          case "father":
            if (wordObject.name !== "father.txt") error = true;
            break;
          case "God":
            if (wordObject.name !== "god.txt") error = true;
            break;
          case "god":
            if (wordObject.name !== "falsegod.txt") error = true;
            break;
          case "Spirit":
            if (wordObject.name !== "holyspirit.txt") error = true;
            break;
          case "spirit":
            if (wordObject.name !== "spirit.txt") error = true;
            break;
          case "Son":
            if (wordObject.name !== "sonofgod.txt") error = true;
            break;
          case "son":
            if (wordObject.name !== "son.txt") error = true;
            break;
          default:
            error = false;
        }
        if (error) {
          groupName = stringMatch(verseObject.text, regex, groupName.index + incrementIndexByWord(groupName));
          continue;
        }
        if (!checkIfWordsAreMarked(groupName, mappedVerseObject)) {
          // Checks if a filter object is passed
          if (filter) {
            // Current word
            var filterIndex = wordObject.name.replace(/\.txt$/, '');
            var currentFilter = filter[filterIndex];
            var cv = chapterNumber + ':' + verseObject.num;
            // If the word has a filter, and the filter includes the current verse
            if (currentFilter && currentFilter.includes(cv)) {
              var indexOfVerse = filter[filterIndex].indexOf(cv);
              // Remove verse from list, continue onto next instance of word
              filter[filterIndex].splice(indexOfVerse, 1);
              groupName = stringMatch(verseObject.text, regex, groupName.index + incrementIndexByWord(groupName));
              continue;
            }
          }
          if (groupName[0] === previousWord) {
            occurrenceNumber++;
          }
          previousWord = groupName[0];
          let groupId = wordObject.name.replace(/\.txt$/, '');
          if (!checkObj[groupId]) checkObj[groupId] = [];
          checkObj[groupId].push({
            priority: 1,
            information: wordObject.file,
            comments: false,
            reminders: false,
            selections: false,
            verseEdits: false,
            contextId: {
              reference: {
                bookId: params.bookAbbr,
                chapter: chapterNumber,
                verse: verseObject.num
              },
              tool: "translationWords",
              groupId: groupId,
              quote: groupName[0],
              occurrence: occurrenceNumber
            }
          });
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
   * the list of checks for the translationWords
   * @param {object} bookData - This is the data returned by Door43DataFetcher after downloading
   * an entire book of the Bible
   * @param {array} mapBook - This is the array containing arrays of mappedVerses. See {@link mapVerses}
   * @param {array} wordList - list of objects containing all the necessary data to look for words
   * in the book data. This list should be a filtered list from the entire translationWords list as
   * this method has many inner loops
   */
  function findWords(bookData, mapBook, wordList, addGroupData, setGroupsIndex, params) {
    if (!groupsIndexLoaded || !groupsDataLoaded) {
      var indexList = [];
      var checkObj = {};
      var filters = getFilters(convertToFullBookName(params.bookAbbr)) || {};
      for (var word of wordList) {
        if (!groupsIndexLoaded) {
          var groupName = word['file'].match(/# .*/)[0].replace(/#/g, '');
          var wordReturnObject = {
            groupId: word.name.replace(/\.txt$/, ''),
            groupName: groupName.trim()
          };
          indexList.push({
            id: wordReturnObject.groupId,
            name: wordReturnObject.groupName
          });
        }
        if (!groupsDataLoaded) {
          for (var chapter of bookData.chapters) {
            for (var verse of chapter.verses) {
              findWordInVerse(chapter.num, verse, mapBook[chapter.num][verse.num], word, addGroupData, params, checkObj, filters.removeChecks);
            }
          }
        }
      }
      addChecks(checkObj, filters.addChecks, wordList, params);
      Object.keys(checkObj).map(function (key, index) {
        addGroupData(key, checkObj[key]);
      });
      setGroupsIndex(indexList);
    }
  }

  function getGroupsIndex(word, indexList) {
    var groupName = word['file'].match(/# .*/)[0].replace(/#/g, '');
    var wordReturnObject = {
      groupId: word.name.replace(/\.txt$/, ''),
      groupName: groupName.trim()
    };
    indexList.push({
      id: wordReturnObject.groupId,
      name: wordReturnObject.groupName
    });
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

/**
 * @description - Opens a CSV file with True/False check data, uses it to determine whether or not to keep the checks.
 * @param {String} bookName - The name of the book that checks are being fetched
 * @return {Object} null if book does not have a filter, otherwise a key based object
 */
function getFilters(bookName) {
  var filters;
  try {
    // See if a filter exists for a book
    var filterPath = path.join(__dirname, '../filters/', bookName + '.csv');
    filters = fs.readFileSync(filterPath).toString();
  } catch (err) {
    return null;
  }
  var lines = filters.split(/,\n/g);
  var i = 0;
  var removeChecks = [];
  var addChecks = [];
  // Converts into two matrices, one has checks to remove, one has checks to add.
  // Index of matrices is based on the word, either the quote or the group.
  while (i < lines.length) {
    var lineSplit;
    var word;
    if (lines[i][0] === 'F') {
      lineSplit = lines[i].split(',');
      var removeChecksIndex = lineSplit[2] + ':' + lineSplit[3];
      word = lineSplit[5].replace(/\.txt$/, '').trim();
      if (!removeChecks[word]) removeChecks[word] = [];
      removeChecks[word].push(removeChecksIndex.trim());
    } else if (lines[i].split(',')[0] === 'New') {
      lineSplit = lines[i].split(',');
      word = lineSplit[5].replace(/\.txt$/, '').trim();
      if (!addChecks[word]) addChecks[word] = [];
      addChecks[word].push(lineSplit);
    }
    i++;
  }
  return { removeChecks, addChecks };
}

/**
 * @description - Adds checks based on filters
 * @param {Object} checkObj - The check object to update
 * @param {Object} filters - The filter to reference
 * @param {Object} wordList - The wordList to reference
 * @param {Object} params - Parameters to fetch for
 * @return No return
 */
function addChecks(checkObj, filters, wordList, params) {
  if (!filters) return null;
  for (var word in filters) {
    var prevVerses = [];
    while (filters[word].length > 0) {
      var currentInstance = filters[word].pop();
      if (!checkObj[word]) checkObj[word] = [];
      var cv = currentInstance[2] + ':' + currentInstance[3];
      if (prevVerses[cv]) {
        prevVerses[cv]++;
      } else {
        prevVerses[cv] = 1;
      }
      let check = {
        contextId: {
          groupId: word,
          occurrence: prevVerses[cv],
          quote: currentInstance[4],
          reference: {
            bookId: params.bookAbbr,
            chapter: parseInt(currentInstance[2], 10),
            verse: parseInt(currentInstance[3], 10)
          },
          tool: 'translationWords'
        },
        information: undefined,
        priority: 1,
        comments: false,
        reminders: false,
        selections: false,
        verseEdits: false
      };
      let checkAlreadyInThere = false;
      checkObj[word].forEach(_check => {
        if (isEqual(_check.contextId, check.contextId)) checkAlreadyInThere = true;
      });
      if (!checkAlreadyInThere) {
        checkObj[word].push(check);
      }
    }
  }
}
