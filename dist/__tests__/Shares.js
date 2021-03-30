"use strict";

var _Shares = _interopRequireDefault(require("../Shares.js"));

var _CryptoUtils = _interopRequireDefault(require("../CryptoUtils.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

describe("UShare", function () {
  var shareStarter = {
    id: 1,
    data: "801649ec44b6e582da82be0c281d8bc9708",
    bits: 8
  };
  var shareStarter2 = {
    id: 2,
    data: "802c8219596dcb05a4e5641998aadca338c",
    bits: 8
  };
  var shareJSON1 = '{"id":1,"data":"801649ec44b6e582da82be0c281d8bc9708","bits":8,"type":"plain"}';
  var shareJSON2 = '{"id":1,"data":"802c8219596dcb05a4e5641998aadca338c","bits":8,"type":"plain"}';
  test('creating from data works', function () {
    var ushare = new _Shares["default"].UShare(shareStarter);
    expect(ushare.id).toBe(1);
    expect(ushare.data).toBe("801649ec44b6e582da82be0c281d8bc9708");
    expect(ushare.bits).toBe(8);
  });
  test('creating from JSON works', function () {
    var ushare = new _Shares["default"].UShare(shareJSON1);
    expect(ushare.id).toBe(1);
    expect(ushare.data).toBe("801649ec44b6e582da82be0c281d8bc9708");
    expect(ushare.bits).toBe(8);
  });
  test('toJSON() produces correct output', function () {
    var ushare = new _Shares["default"].UShare(shareJSON1);
    var rawObj = JSON.parse(JSON.stringify(ushare));
    expect(rawObj).toMatchObject(JSON.parse(shareJSON1));
  });
  test('encrypt() produces an EShare', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var ushare, eshare;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _CryptoUtils["default"].aesEncrypt = jest.fn(function (data, hash) {
              return {
                data: "encrypteddata",
                iv: "aaaaaaaaa"
              };
            });
            ushare = new _Shares["default"].UShare(shareStarter);
            _context.next = 4;
            return ushare.encrypt("user1", "pass1");

          case 4:
            eshare = _context.sent;
            expect(eshare).toMatchObject({
              id: expect.anything(),
              username: expect.anything(),
              bits: expect.anything(),
              data: expect.anything(),
              salt: expect.anything(),
              iv: expect.anything()
            });
            expect(eshare.id).toBe(1);
            expect(eshare.username).toBe("user1");
            expect(eshare.bits).toBe(8);
            expect(eshare.data).toBe("encrypteddata");
            expect(eshare.iv).toBe("aaaaaaaaa");

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  test('invite() produces an IShare', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var ushare, ishare;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _CryptoUtils["default"].aesEncrypt = jest.fn(function (data, hash) {
              return {
                data: "encrypteddata",
                iv: "aaaaaaaaa"
              };
            });
            ushare = new _Shares["default"].UShare(shareStarter);
            _context2.next = 4;
            return ushare.invite("invitepassword");

          case 4:
            ishare = _context2.sent;
            expect(ishare).toMatchObject({
              id: expect.anything(),
              bits: expect.anything(),
              data: expect.anything(),
              salt: expect.anything(),
              iv: expect.anything()
            });
            expect(ishare.id).toBe(1);
            expect(ishare.bits).toBe(8);
            expect(ishare.data).toBe("encrypteddata");
            expect(ishare.iv).toBe("aaaaaaaaa");

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
});
describe("IShare", function () {
  var shareStarter = {
    id: 1,
    data: "encrypteddata",
    bits: 8,
    salt: "abcdef",
    iv: "aaaaaaaaa"
  };
  var shareJSON = '{"id":1,"data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","type":"invite"}';
  test('creating from data works', function () {
    var ishare = new _Shares["default"].IShare(shareStarter);
    expect(ishare.id).toBe(1);
    expect(ishare.data).toBe("encrypteddata");
    expect(ishare.bits).toBe(8);
    expect(ishare.salt).toBe("abcdef");
    expect(ishare.iv).toBe("aaaaaaaaa");
  });
  test('creating from JSON works', function () {
    var ishare = new _Shares["default"].IShare(shareJSON);
    expect(ishare.id).toBe(1);
    expect(ishare.data).toBe("encrypteddata");
    expect(ishare.bits).toBe(8);
    expect(ishare.salt).toBe("abcdef");
    expect(ishare.iv).toBe("aaaaaaaaa");
  });
  test('toJSON() produces correct output', function () {
    var ishare = new _Shares["default"].IShare(shareJSON);
    var rawObj = JSON.parse(JSON.stringify(ishare));
    expect(rawObj).toMatchObject(JSON.parse(shareJSON));
  });
  test('encrypt() produces an EShare', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var ishare, eshare;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _CryptoUtils["default"].aesEncrypt = jest.fn(function (data, hash) {
              return {
                data: "encrypteddata",
                iv: "aaaaaaaaa"
              };
            });
            _CryptoUtils["default"].aesDecrypt = jest.fn(function (ciphertext, hash, iv) {
              return "801649ec44b6e582da82be0c281d8bc9708";
            });
            ishare = new _Shares["default"].IShare(shareStarter);
            _context3.next = 5;
            return ishare.encrypt("invitepassword", "user1", "pass1");

          case 5:
            eshare = _context3.sent;
            expect(eshare).toMatchObject({
              id: expect.anything(),
              username: expect.anything(),
              bits: expect.anything(),
              data: expect.anything(),
              salt: expect.anything(),
              iv: expect.anything()
            });
            expect(eshare.id).toBe(1);
            expect(eshare.username).toBe("user1");
            expect(eshare.bits).toBe(8);
            expect(eshare.data).toBe("encrypteddata");
            expect(eshare.iv).toBe("aaaaaaaaa");

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  test('changePassword() produces an IShare', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var ishare, ishare2;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _CryptoUtils["default"].aesEncrypt = jest.fn(function (data, hash) {
              return {
                data: "encrypteddata",
                iv: "aaaaaaaaa"
              };
            });
            _CryptoUtils["default"].aesDecrypt = jest.fn(function (ciphertext, hash, iv) {
              return "801649ec44b6e582da82be0c281d8bc9708";
            });
            ishare = new _Shares["default"].IShare(shareStarter);
            _context4.next = 5;
            return ishare.changePassword("invitepassword", "newpassword");

          case 5:
            ishare2 = _context4.sent;
            expect(ishare2).toMatchObject({
              id: expect.anything(),
              bits: expect.anything(),
              data: expect.anything(),
              salt: expect.anything(),
              iv: expect.anything()
            });
            expect(ishare2.id).toBe(1);
            expect(ishare2.bits).toBe(8);
            expect(ishare2.data).toBe("encrypteddata");
            expect(ishare2.iv).toBe("aaaaaaaaa");

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
  test('decrypt() produces an UShare', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var ishare, ushare;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _CryptoUtils["default"].aesDecrypt = jest.fn(function (ciphertext, hash, iv) {
              return "801649ec44b6e582da82be0c281d8bc9708";
            });
            ishare = new _Shares["default"].IShare(shareStarter);
            _context5.next = 4;
            return ishare.decrypt("invitepassword");

          case 4:
            ushare = _context5.sent;
            expect(ushare).toMatchObject({
              id: expect.anything(),
              bits: expect.anything(),
              data: expect.anything()
            });
            expect(ushare.id).toBe(1);
            expect(ushare.bits).toBe(8);
            expect(ushare.data).toBe("801649ec44b6e582da82be0c281d8bc9708");

          case 9:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  })));
});
describe("EShare", function () {
  var shareStarter = {
    id: 1,
    data: "encrypteddata",
    bits: 8,
    salt: "abcdef",
    iv: "aaaaaaaaa",
    username: "user1"
  };
  var shareJSON = '{"id":1,"data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","username":"user1","type":"encrypted"}';
  test('creating from data works', function () {
    var eshare = new _Shares["default"].EShare(shareStarter);
    expect(eshare.id).toBe(1);
    expect(eshare.data).toBe("encrypteddata");
    expect(eshare.bits).toBe(8);
    expect(eshare.salt).toBe("abcdef");
    expect(eshare.iv).toBe("aaaaaaaaa");
    expect(eshare.username).toBe("user1");
  });
  test('creating from JSON works', function () {
    var eshare = new _Shares["default"].EShare(shareJSON);
    expect(eshare.id).toBe(1);
    expect(eshare.data).toBe("encrypteddata");
    expect(eshare.bits).toBe(8);
    expect(eshare.salt).toBe("abcdef");
    expect(eshare.iv).toBe("aaaaaaaaa");
    expect(eshare.username).toBe("user1");
  });
  test('toJSON() produces correct output', function () {
    var eshare = new _Shares["default"].EShare(shareJSON);
    var rawObj = JSON.parse(JSON.stringify(eshare));
    expect(rawObj).toMatchObject(JSON.parse(shareJSON));
  });
  test('changePassword() produces an EShare', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var eshare, eshare2;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _CryptoUtils["default"].aesEncrypt = jest.fn(function (data, hash) {
              return {
                data: "encrypteddata",
                iv: "aaaaaaaaa"
              };
            });
            _CryptoUtils["default"].aesDecrypt = jest.fn(function (ciphertext, hash, iv) {
              return "801649ec44b6e582da82be0c281d8bc9708";
            });
            eshare = new _Shares["default"].EShare(shareStarter);
            _context6.next = 5;
            return eshare.changePassword("oldpassword", "newpassword");

          case 5:
            eshare2 = _context6.sent;
            expect(eshare2).toMatchObject({
              id: expect.anything(),
              username: expect.anything(),
              bits: expect.anything(),
              data: expect.anything(),
              salt: expect.anything(),
              iv: expect.anything()
            });
            expect(eshare.id).toBe(1);
            expect(eshare.data).toBe("encrypteddata");
            expect(eshare.bits).toBe(8);
            expect(eshare.salt).toBe("abcdef");
            expect(eshare.iv).toBe("aaaaaaaaa");
            expect(eshare.username).toBe("user1");

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  })));
  test('decrypt() produces an UShare', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var eshare, ushare;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _CryptoUtils["default"].aesDecrypt = jest.fn(function (ciphertext, hash, iv) {
              return "801649ec44b6e582da82be0c281d8bc9708";
            });
            eshare = new _Shares["default"].EShare(shareStarter);
            _context7.next = 4;
            return eshare.decrypt("password");

          case 4:
            ushare = _context7.sent;
            expect(ushare).toMatchObject({
              id: expect.anything(),
              bits: expect.anything(),
              data: expect.anything()
            });
            expect(ushare.id).toBe(1);
            expect(ushare.bits).toBe(8);
            expect(ushare.data).toBe("801649ec44b6e582da82be0c281d8bc9708");

          case 9:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  })));
});