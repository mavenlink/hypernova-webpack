const server = require('./index.js');

test('has a sanity check', () => {
  expect(server).toEqual({});
});
