const validators = require('./validators');

test('Validates if a string that is valid UUID is actually valid UUID', () => {
  expect(validators.isUuid('5b11f4ce-a62d-471e-81fc-a69a8278c7da')).toBe(true);
});

test('Validates if String that is NOT valid UUID is valid UUID', () => {
  expect(validators.isUuid('foobar')).not.toBe(true);
});
