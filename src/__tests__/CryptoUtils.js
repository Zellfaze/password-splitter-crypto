import CryptoUtils from '../CryptoUtils.js'; 

test('hexStringtoUint8Array works', () => {
  expect(CryptoUtils.hexStringtoUint8Array("abcdef")).toEqual(new Uint8Array([171, 205, 239]));
});

test('normalStringtoUint8Array works', () => {
  expect(CryptoUtils.normalStringtoUint8Array("Test")).toEqual(new Uint8Array([0, 116, 0, 115, 0, 101, 0, 84]));
});

test('uint8ArraytoHexString works with even length output', () => {
  expect(CryptoUtils.uint8ArraytoHexString(new Uint8Array([171, 205, 239]))).toEqual("abcdef");
});

test('uint8ArraytoHexString works with odd length output (leading zero on last byte should be dropped)', () => {
  expect(CryptoUtils.uint8ArraytoHexString(new Uint8Array([171, 205, 239, 10]))).toEqual("abcdefa");
});

test('password hashing with hex salt works', async () => {
  const result = await CryptoUtils.hashPassword("Password", "a9e5ca73a9bcba69a5487236", true);
  expect(result.hash).toBe("0143652e0e0fcd87267fcaef4d9056517f13ff0ab12c54eaa3dee824433d9d28");
  expect(result.salt).toBe("a9e5ca73a9bcba69a5487236");
});

test('password hashing with an invalid hex salt throws', () => {
  let promise = CryptoUtils.hashPassword("Password", "Definitely not hex", true);
  
  return expect(promise).rejects.toThrow("Salt is not valid hex!");
});

test('password hashing with plaintext salt works', async () => {
  const result = await CryptoUtils.hashPassword("Password", "Some salt", false);
  expect(result.hash).toBe("2fc4af400d9e492e7fd7757aceecd49e6907548918a735709064f214bdf7ec47");
  expect(result.salt).toBe("0074006c0061007300200065006d006f0053");
});

// TODO: Test AES encrypt and decrypt
// TODO: Test validateShare
