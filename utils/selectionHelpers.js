
module.exports.selectionArray = function(string, selections) {
  var selectionArray = []
  var ranges = module.exports.selectionsToRanges(string, selections)
  selectionArray = module.exports.spliceStringOnRanges(string, ranges)
  return selectionArray
}

module.exports.spliceStringOnRanges = function(string, ranges) {
  var selectionArray = [] // response
  // sort ranges - this ensures we build the string correctly and don't miss selections
  // concat overlaps - should not be a concern here but might help rendering bugs
  var remainingString = string
  var rangeShift = 0
  ranges.forEach(function(rangeObject) {
    var range = rangeObject.range
    var subString = remainingString.slice(range[0]-rangeShift,range[1]+1-rangeShift)
    var splitArray = remainingString.split(subString)
    var beforeSelection = splitArray[0]
    // console.log('beforeSelection: ', beforeSelection)
    // console.log('subString: ', subString)
    var afterSelection = splitArray.slice(1).join(subString)
    // console.log('afterSelection: ', afterSelection)
    selectionArray.push({text: beforeSelection, selected: false})
    selectionArray.push({
                          text: subString,
                          selected: true,
                          occurrence: rangeObject.occurrence,
                          occurrences: rangeObject.occurrences
                        })
    rangeShift += beforeSelection.length
    rangeShift += subString.length
    remainingString = afterSelection
  })
  selectionArray.push({text: remainingString, selected: false})
  // remove empty text from selectionArray
  return selectionArray
}

module.exports.selectionsToRanges = function(string, selections) {
  var ranges = []
    selections.forEach(function(selection) {
      if (string.includes(selection.text)) {
        var splitArray = string.split(selection.text)
        var beforeSelection = splitArray.slice(0,selection.occurrence).join(selection.text)
        var start = beforeSelection.length
        var end = start + selection.text.length - 1
        var rangesObject = {
                            range: [start,end],
                            occurrence: selection.occurrence,
                            occurrences: selection.occurrences
                           }
        ranges.push(rangesObject)
      }
    })
  return ranges
}

// Use for testing/debugging...

// var string = 'abcdefghijklmnopqrstuvwxyz'
// var selectedText = [
//   {
//     "text": "cdef",
//     "occurrence": 1,
//     "occurrences": 1
//   },
//   {
//     "text": "klmno",
//     "occurrence": 1,
//     "occurrences": 1
//   },
//   {
//     "text": "wxyz",
//     "occurrence": 1,
//     "occurrences": 1
//   }
// ]

// var string = '012345678901234567890123456789'
// var selectedText = [
//   {
//     "text": "1234",
//     "occurrence": 1,
//     "occurrences": 3
//   },
//   {
//     "text": "01234",
//     "occurrence": 2,
//     "occurrences": 3
//   },
//   {
//     "text": "01234",
//     "occurrence": 3,
//     "occurrences": 3
//   }
// ]
// loop through occurrences to get character ranges
// var selectionCharacterRanges = [
//   [1,4],
//   [10,14],
//   [20,24]
// ]
// var ranges = module.exports.selectionsToRanges(string, selectedText)
// console.log(ranges)
//
// var selectionArray = module.exports.spliceStringOnRanges(string, ranges)
// console.log(selectionArray)

// var selectionArray = module.exports.selectionArray(string, selectedText)
// console.log(selectionArray)
