/* eslint-env jest */
import Api from '../Api';

describe('alignment memory', () => {
  it('returns the alignment memory', () => {
    const api = new Api();
    api._loadBookSelections = jest.fn(() => {
      return {
        '1': {
          '1': [
            {
              contextId: {
                quote: 'hello'
              },
              selections: [
                {
                  text: 'world'
                }
              ]
            }
          ]
        }
      };
    });
    const memory = api.getAlignmentMemory();
    expect(memory).toEqual([
      {
        sourceText: 'hello',
        targetText: 'world'
      }
    ]);
  });
});

describe('selection data', () => {

  it('loads selection data from the disk', () => {
    // Replicates the file reader
    function* dataGenerator() {
      const data2 = JSON.stringify({
        contextId: {
          groupId: 'word',
          quote: 'hi'
        },
        selections: [
          {
            text: 'world'
          }
        ]
      });

      const data1 = JSON.stringify({
        contextId: {
          groupId: 'word',
          quote: 'hello'
        },
        selections: [
          {
            text: 'world'
          }
        ]
      });
      // TRICKY: files will be sorted in ascending order
      yield data2;
      yield data1;
      yield data1;
    }

    const api = new Api();
    const generator = dataGenerator();
    const props = {
      tc: {
        contextId: {reference: {bookId: 'book'}},
        projectFileExistsSync: jest.fn(() => true),
        readProjectDataSync: jest.fn(() => generator.next().value),
        readProjectDirSync: jest.fn(() => {
          return ['1.json', '1_dup.json', '2.json'];
        }),
        targetBible: {
          '1': {
            '1': {}
          }
        }
      }
    };
    const selections = api._loadBookSelections(props);
    expect(selections).toEqual({
      '1': {
        '1': [
          {
            contextId: {
              groupId: 'word',
              quote: 'hi'
            },
            selections: [
              {
                text: 'world'
              }
            ]
          },
          {
            contextId: {
              groupId: 'word',
              quote: 'hello'
            },
            selections: [
              {
                text: 'world'
              }
            ]
          }
        ]
      }
    });
  });
});
