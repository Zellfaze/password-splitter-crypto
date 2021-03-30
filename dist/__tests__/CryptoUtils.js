"use strict";

var _CryptoUtils = _interopRequireDefault(require("../CryptoUtils.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

test('hexStringtoUint8Array works', function () {
  expect(_CryptoUtils["default"].hexStringtoUint8Array("abcdef")).toEqual(new Uint8Array([171, 205, 239]));
});
test('normalStringtoUint8Array works', function () {
  expect(_CryptoUtils["default"].normalStringtoUint8Array("Test")).toEqual(new Uint8Array([0, 116, 0, 115, 0, 101, 0, 84]));
});
test('uint8ArraytoHexString works with even length output', function () {
  expect(_CryptoUtils["default"].uint8ArraytoHexString(new Uint8Array([171, 205, 239]))).toEqual("abcdef");
});
test('uint8ArraytoHexString works with odd length output (leading zero on last byte should be dropped)', function () {
  expect(_CryptoUtils["default"].uint8ArraytoHexString(new Uint8Array([171, 205, 239, 10]))).toEqual("abcdefa");
});
test('password hashing with hex salt works', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var result;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _CryptoUtils["default"].hashPassword("Password", "a9e5ca73a9bcba69a5487236", true);

        case 2:
          result = _context.sent;
          expect(result.hash).toBe("0143652e0e0fcd87267fcaef4d9056517f13ff0ab12c54eaa3dee824433d9d28");
          expect(result.salt).toBe("a9e5ca73a9bcba69a5487236");

        case 5:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));
test('password hashing with an invalid hex salt throws', function () {
  var promise = _CryptoUtils["default"].hashPassword("Password", "Definitely not hex", true);

  return expect(promise).rejects.toThrow("Salt is not valid hex!");
});
test('password hashing with plaintext salt works', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
  var result;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _CryptoUtils["default"].hashPassword("Password", "Some salt", false);

        case 2:
          result = _context2.sent;
          expect(result.hash).toBe("2fc4af400d9e492e7fd7757aceecd49e6907548918a735709064f214bdf7ec47");
          expect(result.salt).toBe("0074006c0061007300200065006d006f0053");

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
}))); // TODO: Test AES encrypt and decrypt
// TODO: Test validateShare