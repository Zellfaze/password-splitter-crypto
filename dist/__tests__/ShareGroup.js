"use strict";

var _Shares = _interopRequireDefault(require("../Shares.js"));

var _ShareGroup = _interopRequireDefault(require("../ShareGroup.js"));

var _CryptoUtils = _interopRequireDefault(require("../CryptoUtils.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// TODO: Mock Shares instead of CryptoUtils to eliminate dependency
// on Shares being correct
describe("UShareGroup", function () {
  // Setup some UShare objects
  var shareStarter = new _Shares["default"].UShare({
    id: 1,
    dbid: "9c9b8361-10e9-4ffc-ab85-93c88a696e5e",
    data: "801649ec44b6e582da82be0c281d8bc9708",
    bits: 8
  });
  var shareStarter2 = new _Shares["default"].UShare({
    id: 2,
    dbid: "b38dfa1f-6229-4fd7-b258-91dc74e74259",
    data: "802c8219596dcb05a4e5641998aadca338c",
    bits: 8
  }); // Mock some functions

  _CryptoUtils["default"].aesEncrypt = jest.fn(function (data, hash) {
    return {
      data: "encrypteddata",
      iv: "aaaaaaaaa"
    };
  });
  _CryptoUtils["default"].aesDecrypt = jest.fn(function (ciphertext, hash, iv) {
    return "801649ec44b6e582da82be0c281d8bc9708";
  }); // Setup JSON

  var shareJSON = '{"dbid":"450e6f1f-64d7-4956-86b8-493a533296d7","shares":[{"id":1,"dbid":"9c9b8361-10e9-4ffc-ab85-93c88a696e5e","data":"801649ec44b6e582da82be0c281d8bc9708","bits":8},{"id":2,"dbid":"b38dfa1f-6229-4fd7-b258-91dc74e74259","data":"802c8219596dcb05a4e5641998aadca338c","bits":8}],"type":"plain"}';
  test("creating from data works", function () {
    // Create our ShareGroup
    var usharegroup = new _ShareGroup["default"].UShareGroup([shareStarter, shareStarter2]);
    expect(usharegroup.shares[0]).toMatchObject(shareStarter);
    expect(usharegroup.shares[1]).toMatchObject(shareStarter2);
  });
  test("creating from JSON works", function () {
    // Create our ShareGroup
    var usharegroup = new _ShareGroup["default"].UShareGroup(shareJSON);
    expect(usharegroup.shares[0]).toMatchObject(shareStarter);
    expect(usharegroup.shares[1]).toMatchObject(shareStarter2);
    expect(usharegroup.dbid).toBe("450e6f1f-64d7-4956-86b8-493a533296d7");
  });
  test("passing invalid objects throws", function () {
    // Create our ShareGroup
    var usharegroup = function usharegroup() {
      return new _ShareGroup["default"].UShareGroup([{
        bad: "object"
      }, {
        oops: "also bad"
      }]);
    };

    expect(usharegroup).toThrowError("All array members must be a share");
  });
  test("adding a new share works", function () {
    var usharegroup = new _ShareGroup["default"].UShareGroup([shareStarter]);
    usharegroup.addShare(shareStarter2);
    expect(usharegroup.shares[1]).toMatchObject(shareStarter2);
  });
  test("adding a share with a duplicate ID throws", function () {
    var usharegroup = new _ShareGroup["default"].UShareGroup([shareStarter]);

    var addShare = function addShare() {
      return usharegroup.addShare(shareStarter);
    };

    expect(addShare).toThrowError("Group already includes a share with ID 1");
  });
  test("encrypt() produces an EShareGroup", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var usharegroup, esharegroup;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            usharegroup = new _ShareGroup["default"].UShareGroup([shareStarter]);
            _context.next = 3;
            return usharegroup.encrypt("user1", "pass1");

          case 3:
            esharegroup = _context.sent;
            expect(esharegroup).toBeInstanceOf(_ShareGroup["default"].EShareGroup);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  test("invite() produces an IShareGroup", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var usharegroup, isharegroup;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            usharegroup = new _ShareGroup["default"].UShareGroup([shareStarter]);
            _context2.next = 3;
            return usharegroup.invite("pass1");

          case 3:
            isharegroup = _context2.sent;
            expect(isharegroup).toBeInstanceOf(_ShareGroup["default"].IShareGroup);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
});
describe("IShareGroup", function () {
  // Setup some IShare objects
  var shareStarter = new _Shares["default"].IShare({
    id: 1,
    dbid: "9c9b8361-10e9-4ffc-ab85-93c88a696e5e",
    data: "encrypteddata",
    bits: 8,
    salt: "abcdef",
    iv: "aaaaaaaaa"
  });
  var shareStarter2 = new _Shares["default"].IShare({
    id: 2,
    dbid: "b38dfa1f-6229-4fd7-b258-91dc74e74259",
    data: "encrypteddata",
    bits: 8,
    salt: "abcdef",
    iv: "aaaaaaaaa"
  }); // Setup JSON

  var shareJSON = '{"shares":[{"id":1,"dbid":"9c9b8361-10e9-4ffc-ab85-93c88a696e5e","data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","type":"invite"},{"id":2,"dbid":"b38dfa1f-6229-4fd7-b258-91dc74e74259","data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","type":"invite"}],"type":"invite"}'; // Mock some functions

  _CryptoUtils["default"].aesEncrypt = jest.fn(function (data, hash) {
    return {
      data: "encrypteddata",
      iv: "aaaaaaaaa"
    };
  });
  _CryptoUtils["default"].aesDecrypt = jest.fn(function (ciphertext, hash, iv) {
    return "801649ec44b6e582da82be0c281d8bc9708";
  });
  test("creating from data works", function () {
    // Create our ShareGroup
    var isharegroup = new _ShareGroup["default"].IShareGroup([shareStarter, shareStarter2]);
    expect(isharegroup.shares[0]).toMatchObject(shareStarter);
    expect(isharegroup.shares[1]).toMatchObject(shareStarter2);
  });
  test("creating from JSON works", function () {
    // Create our ShareGroup
    var isharegroup = new _ShareGroup["default"].IShareGroup(shareJSON);
    expect(isharegroup.shares[0]).toMatchObject(shareStarter);
    expect(isharegroup.shares[1]).toMatchObject(shareStarter2);
  });
  test("passing invalid objects throws", function () {
    // Create our ShareGroup
    var isharegroup = function isharegroup() {
      return new _ShareGroup["default"].IShareGroup([{
        bad: "object"
      }, {
        oops: "also bad"
      }]);
    };

    expect(isharegroup).toThrowError("All array members must be a share");
  });
  test("adding a new share works", function () {
    var isharegroup = new _ShareGroup["default"].IShareGroup([shareStarter]);
    isharegroup.addShare(shareStarter2);
    expect(isharegroup.shares[1]).toMatchObject(shareStarter2);
  });
  test("adding a share with a duplicate ID throws", function () {
    var isharegroup = new _ShareGroup["default"].IShareGroup([shareStarter]);

    var addShare = function addShare() {
      return isharegroup.addShare(shareStarter);
    };

    expect(addShare).toThrowError("Group already includes a share with ID 1");
  });
  test("decrypt() produces an UShareGroup", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var isharegroup, usharegroup;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            isharegroup = new _ShareGroup["default"].IShareGroup([shareStarter]);
            _context3.next = 3;
            return isharegroup.decrypt("pass1");

          case 3:
            usharegroup = _context3.sent;
            expect(usharegroup).toBeInstanceOf(_ShareGroup["default"].UShareGroup);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  test("encrypt() produces an EShareGroup", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var isharegroup, esharegroup;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            isharegroup = new _ShareGroup["default"].IShareGroup([shareStarter]);
            _context4.next = 3;
            return isharegroup.encrypt("invitepass", "user1", "pass1");

          case 3:
            esharegroup = _context4.sent;
            expect(esharegroup).toBeInstanceOf(_ShareGroup["default"].EShareGroup);

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
  test("changePassword() produces an IShareGroup", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var isharegroup, isharegroup2;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            isharegroup = new _ShareGroup["default"].IShareGroup([shareStarter]);
            _context5.next = 3;
            return isharegroup.changePassword("oldpassword", "newpassword");

          case 3:
            isharegroup2 = _context5.sent;
            expect(isharegroup2).toBeInstanceOf(_ShareGroup["default"].IShareGroup);

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  })));
});
describe("EShareGroup", function () {
  // Setup some EShare objects
  var shareStarter = new _Shares["default"].EShare({
    id: 1,
    dbid: "9c9b8361-10e9-4ffc-ab85-93c88a696e5e",
    data: "encrypteddata",
    bits: 8,
    salt: "abcdef",
    iv: "aaaaaaaaa",
    username: "user1"
  });
  var shareStarter2 = new _Shares["default"].EShare({
    id: 2,
    dbid: "b38dfa1f-6229-4fd7-b258-91dc74e74259",
    data: "encrypteddata",
    bits: 8,
    salt: "abcdef",
    iv: "aaaaaaaaa",
    username: "user1"
  }); // Setup JSON

  var shareJSON = '{"shares":[{"id":1,"dbid":"9c9b8361-10e9-4ffc-ab85-93c88a696e5e","data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","username":"user1","type":"encrypted"},{"id":2,"dbid":"b38dfa1f-6229-4fd7-b258-91dc74e74259","data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","username":"user1","type":"encrypted"}],"type":"encrypted"}'; // Mock some functions

  _CryptoUtils["default"].aesEncrypt = jest.fn(function (data, hash) {
    return {
      data: "encrypteddata",
      iv: "aaaaaaaaa"
    };
  });
  _CryptoUtils["default"].aesDecrypt = jest.fn(function (ciphertext, hash, iv) {
    return "801649ec44b6e582da82be0c281d8bc9708";
  });
  test("creating from data works", function () {
    // Create our ShareGroup
    var esharegroup = new _ShareGroup["default"].EShareGroup([shareStarter, shareStarter2]);
    expect(esharegroup.shares[0]).toMatchObject(shareStarter);
    expect(esharegroup.shares[1]).toMatchObject(shareStarter2);
  });
  test("creating from JSON works", function () {
    // Create our ShareGroup
    var esharegroup = new _ShareGroup["default"].EShareGroup(shareJSON);
    expect(esharegroup.shares[0]).toMatchObject(shareStarter);
    expect(esharegroup.shares[1]).toMatchObject(shareStarter2);
  });
  test("passing invalid objects throws", function () {
    // Create our ShareGroup
    var esharegroup = function esharegroup() {
      return new _ShareGroup["default"].EShareGroup([{
        bad: "object"
      }, {
        oops: "also bad"
      }]);
    };

    expect(esharegroup).toThrowError("All array members must be a share");
  });
  test("adding a new share works", function () {
    var esharegroup = new _ShareGroup["default"].EShareGroup([shareStarter]);
    esharegroup.addShare(shareStarter2);
    expect(esharegroup.shares[1]).toMatchObject(shareStarter2);
  });
  test("adding a share with a duplicate ID throws", function () {
    var esharegroup = new _ShareGroup["default"].EShareGroup([shareStarter]);

    var addShare = function addShare() {
      return esharegroup.addShare(shareStarter);
    };

    expect(addShare).toThrowError("Group already includes a share with ID 1");
  });
  test("decrypt() produces an UShareGroup", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var esharegroup, usharegroup;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            esharegroup = new _ShareGroup["default"].EShareGroup([shareStarter]);
            _context6.next = 3;
            return esharegroup.decrypt("pass1");

          case 3:
            usharegroup = _context6.sent;
            expect(usharegroup).toBeInstanceOf(_ShareGroup["default"].UShareGroup);

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  })));
  test("changePassword() produces an EShareGroup", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var esharegroup, esharegroup2;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            esharegroup = new _ShareGroup["default"].EShareGroup([shareStarter]);
            _context7.next = 3;
            return esharegroup.changePassword("oldpassword", "newpassword");

          case 3:
            esharegroup2 = _context7.sent;
            expect(esharegroup2).toBeInstanceOf(_ShareGroup["default"].EShareGroup);

          case 5:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  })));
});
describe("createShareGroupFromRaw", function () {
  test("creates UShareGroup", function () {
    var shareJSON = '{"dbid":"450e6f1f-64d7-4956-86b8-493a533296d7","shares":[{"id":1,"dbid":"9c9b8361-10e9-4ffc-ab85-93c88a696e5e","data":"801649ec44b6e582da82be0c281d8bc9708","bits":8},{"id":2,"dbid":"b38dfa1f-6229-4fd7-b258-91dc74e74259","data":"802c8219596dcb05a4e5641998aadca338c","bits":8}],"type":"plain"}';
    var shareRaw = JSON.parse(shareJSON); // Check with JSON

    var sharegroup = _ShareGroup["default"].createShareGroupFromRaw(shareJSON);

    expect(sharegroup).toBeInstanceOf(_ShareGroup["default"].UShareGroup); // Check with raw

    var sharegroup2 = _ShareGroup["default"].createShareGroupFromRaw(shareRaw);

    expect(sharegroup2).toBeInstanceOf(_ShareGroup["default"].UShareGroup);
  });
  test("creates IShareGroup", function () {
    var shareJSON = '{"shares":[{"id":1,"dbid":"9c9b8361-10e9-4ffc-ab85-93c88a696e5e","data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","type":"invite"},{"id":2,"dbid":"b38dfa1f-6229-4fd7-b258-91dc74e74259","data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","type":"invite"}],"type":"invite"}';
    var shareRaw = JSON.parse(shareJSON); // Check with JSON

    var sharegroup = _ShareGroup["default"].createShareGroupFromRaw(shareJSON);

    expect(sharegroup).toBeInstanceOf(_ShareGroup["default"].IShareGroup); // Check with raw

    var sharegroup2 = _ShareGroup["default"].createShareGroupFromRaw(shareRaw);

    expect(sharegroup2).toBeInstanceOf(_ShareGroup["default"].IShareGroup);
  });
  test("creates EShareGroup", function () {
    var shareJSON = '{"shares":[{"id":1,"dbid":"9c9b8361-10e9-4ffc-ab85-93c88a696e5e","data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","username":"user1","type":"encrypted"},{"id":2,"dbid":"b38dfa1f-6229-4fd7-b258-91dc74e74259","data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","username":"user1","type":"encrypted"}],"type":"encrypted"}';
    var shareRaw = JSON.parse(shareJSON); // Check with JSON

    var sharegroup = _ShareGroup["default"].createShareGroupFromRaw(shareJSON);

    expect(sharegroup).toBeInstanceOf(_ShareGroup["default"].EShareGroup); // Check with raw

    var sharegroup2 = _ShareGroup["default"].createShareGroupFromRaw(shareRaw);

    expect(sharegroup2).toBeInstanceOf(_ShareGroup["default"].EShareGroup);
  });
  test("throws when given invalid data", function () {
    var shareJSON = '[{"bad": "data"}]';
    var shareRaw = JSON.parse(shareJSON); // Check with JSON

    var sharegroup = function sharegroup() {
      return _ShareGroup["default"].createShareGroupFromRaw(shareJSON);
    };

    expect(sharegroup).toThrowError("Not a valid ShareGroup"); // Check with raw

    var sharegroup2 = function sharegroup2() {
      return _ShareGroup["default"].createShareGroupFromRaw(shareRaw);
    };

    expect(sharegroup2).toThrowError("Not a valid ShareGroup");
  });
});