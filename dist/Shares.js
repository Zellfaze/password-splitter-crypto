"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("core-js/stable");

require("regenerator-runtime/runtime");

var _CryptoUtils = _interopRequireDefault(require("./CryptoUtils.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UShare = /*#__PURE__*/function () {
  function UShare(input) {
    _classCallCheck(this, UShare);

    // If we were passed a string, let's try to evaluate it as JSON
    // if it's not valid json, just let it throw
    if (typeof input === "string") {
      input = JSON.parse(input);
    }

    if (input.id === undefined) {
      throw new Error("Share must have an ID");
    }

    if (input.dbid === undefined) {
      throw new Error("Share must have a DB ID");
    }

    if (input.data === undefined) {
      throw new Error("Share must have data");
    }

    if (input.bits === undefined) {
      throw new Error("Share must have bits");
    }

    this.id = input.id;
    this.dbid = input.dbid;
    this.data = input.data;
    this.bits = input.bits;
  } // Returns a promise for an EShare object


  _createClass(UShare, [{
    key: "encrypt",
    value: function () {
      var _encrypt = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(username, password) {
        var hashObj, cryptObj;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _CryptoUtils["default"].hashPassword(password);

              case 3:
                hashObj = _context.sent;
                _context.next = 6;
                return _CryptoUtils["default"].aesEncrypt(this.data, hashObj.hash);

              case 6:
                cryptObj = _context.sent;
                return _context.abrupt("return", new EShare({
                  id: this.id,
                  dbid: this.dbid,
                  username: username,
                  bits: this.bits,
                  data: cryptObj.data,
                  salt: hashObj.salt,
                  iv: cryptObj.iv
                }));

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", Promise.reject("Failed to encrypt share!"));

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 10]]);
      }));

      function encrypt(_x, _x2) {
        return _encrypt.apply(this, arguments);
      }

      return encrypt;
    }() // Returns a promise for an IShare object

  }, {
    key: "invite",
    value: function () {
      var _invite = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(password) {
        var hashObj, cryptObj;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return _CryptoUtils["default"].hashPassword(password);

              case 3:
                hashObj = _context2.sent;
                _context2.next = 6;
                return _CryptoUtils["default"].aesEncrypt(this.data, hashObj.hash);

              case 6:
                cryptObj = _context2.sent;
                return _context2.abrupt("return", new IShare({
                  id: this.id,
                  dbid: this.dbid,
                  bits: this.bits,
                  data: cryptObj.data,
                  salt: hashObj.salt,
                  iv: cryptObj.iv
                }));

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](0);
                return _context2.abrupt("return", Promise.reject("Failed to encrypt share!"));

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 10]]);
      }));

      function invite(_x3) {
        return _invite.apply(this, arguments);
      }

      return invite;
    }()
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        id: this.id,
        dbid: this.dbid,
        data: this.data,
        bits: this.bits,
        type: "plain"
      };
    }
  }]);

  return UShare;
}();

var IShare = /*#__PURE__*/function () {
  function IShare(input) {
    _classCallCheck(this, IShare);

    // If we were passed a string, let's try to evaluate it as JSON
    // if it's not valid json, just let it throw
    if (typeof input === "string") {
      input = JSON.parse(input);
    }

    if (input.id === undefined) {
      throw new Error("Share must have an ID");
    }

    if (input.dbid === undefined) {
      throw new Error("Share must have a DB ID");
    }

    if (input.data === undefined) {
      throw new Error("Share must have data");
    }

    if (input.bits === undefined) {
      throw new Error("Share must have bits");
    }

    if (input.salt === undefined) {
      throw new Error("Share must have salt");
    }

    if (input.iv === undefined) {
      throw new Error("Share must have iv");
    }

    this.id = input.id;
    this.dbid = input.dbid;
    this.data = input.data;
    this.bits = input.bits;
    this.salt = input.salt;
    this.iv = input.iv;
  } // Returns a promise for an EShare object


  _createClass(IShare, [{
    key: "encrypt",
    value: function () {
      var _encrypt2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(invitepassword, username, password) {
        var unencryptedShare;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.decrypt(invitepassword);

              case 2:
                unencryptedShare = _context3.sent;
                _context3.next = 5;
                return unencryptedShare.encrypt(username, password);

              case 5:
                return _context3.abrupt("return", _context3.sent);

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function encrypt(_x4, _x5, _x6) {
        return _encrypt2.apply(this, arguments);
      }

      return encrypt;
    }() // Returns a promise that resolves with a new IShare when password is changed

  }, {
    key: "changePassword",
    value: function () {
      var _changePassword = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(oldpassword, newpassword) {
        var unencryptedShare;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.decrypt(oldpassword);

              case 2:
                unencryptedShare = _context4.sent;
                return _context4.abrupt("return", unencryptedShare.invite(newpassword));

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function changePassword(_x7, _x8) {
        return _changePassword.apply(this, arguments);
      }

      return changePassword;
    }() // Returns a promise for a UShare object

  }, {
    key: "decrypt",
    value: function () {
      var _decrypt = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(password) {
        var hashObj, plaintext;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return _CryptoUtils["default"].hashPassword(password, this.salt, true);

              case 3:
                hashObj = _context5.sent;
                _context5.next = 6;
                return _CryptoUtils["default"].aesDecrypt(this.data, hashObj.hash, this.iv);

              case 6:
                plaintext = _context5.sent;

                if (_CryptoUtils["default"].validateShare(this.id, this.bits, plaintext)) {
                  _context5.next = 9;
                  break;
                }

                return _context5.abrupt("return", Promise.reject("Share verification failed! Corrupted share?"));

              case 9:
                return _context5.abrupt("return", new UShare({
                  id: this.id,
                  dbid: this.dbid,
                  bits: this.bits,
                  data: plaintext
                }));

              case 12:
                _context5.prev = 12;
                _context5.t0 = _context5["catch"](0);
                return _context5.abrupt("return", Promise.reject("Failed to decrypt share! Bad password?"));

              case 15:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 12]]);
      }));

      function decrypt(_x9) {
        return _decrypt.apply(this, arguments);
      }

      return decrypt;
    }()
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        id: this.id,
        dbid: this.dbid,
        data: this.data,
        bits: this.bits,
        salt: this.salt,
        iv: this.iv,
        type: "invite"
      };
    }
  }]);

  return IShare;
}();

var EShare = /*#__PURE__*/function () {
  function EShare(input) {
    _classCallCheck(this, EShare);

    // If we were passed a string, let's try to evaluate it as JSON
    // if it's not valid json, just let it throw
    if (typeof input === "string") {
      input = JSON.parse(input);
    }

    if (input.id === undefined) {
      throw new Error("Share must have an ID");
    }

    if (input.dbid === undefined) {
      throw new Error("Share must have a DB ID");
    }

    if (input.data === undefined) {
      throw new Error("Share must have data");
    }

    if (input.bits === undefined) {
      throw new Error("Share must have bits");
    }

    if (input.salt === undefined) {
      throw new Error("Share must have salt");
    }

    if (input.iv === undefined) {
      throw new Error("Share must have iv");
    }

    if (input.username === undefined) {
      throw new Error("Share must have username");
    }

    this.id = input.id;
    this.dbid = input.dbid;
    this.data = input.data;
    this.bits = input.bits;
    this.salt = input.salt;
    this.iv = input.iv;
    this.username = input.username;
  } // Returns a promise for a UShare object


  _createClass(EShare, [{
    key: "decrypt",
    value: function () {
      var _decrypt2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(password) {
        var hashObj, plaintext;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return _CryptoUtils["default"].hashPassword(password, this.salt, true);

              case 3:
                hashObj = _context6.sent;
                _context6.next = 6;
                return _CryptoUtils["default"].aesDecrypt(this.data, hashObj.hash, this.iv);

              case 6:
                plaintext = _context6.sent;

                if (_CryptoUtils["default"].validateShare(this.id, this.bits, plaintext)) {
                  _context6.next = 9;
                  break;
                }

                return _context6.abrupt("return", Promise.reject("Share verification failed! Corrupted share?"));

              case 9:
                return _context6.abrupt("return", new UShare({
                  id: this.id,
                  dbid: this.dbid,
                  bits: this.bits,
                  data: plaintext
                }));

              case 12:
                _context6.prev = 12;
                _context6.t0 = _context6["catch"](0);
                return _context6.abrupt("return", Promise.reject("Failed to decrypt share! Bad password?"));

              case 15:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 12]]);
      }));

      function decrypt(_x10) {
        return _decrypt2.apply(this, arguments);
      }

      return decrypt;
    }() // Returns a promise that resolves with a new EShare when password is changed

  }, {
    key: "changePassword",
    value: function () {
      var _changePassword2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(oldpassword, newpassword) {
        var unencryptedShare;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.decrypt(oldpassword);

              case 2:
                unencryptedShare = _context7.sent;
                return _context7.abrupt("return", unencryptedShare.encrypt(this.username, newpassword));

              case 4:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function changePassword(_x11, _x12) {
        return _changePassword2.apply(this, arguments);
      }

      return changePassword;
    }()
  }, {
    key: "toJSON",
    value: function toJSON(key) {
      return {
        id: this.id,
        dbid: this.dbid,
        data: this.data,
        bits: this.bits,
        salt: this.salt,
        iv: this.iv,
        username: this.username,
        type: "encrypted"
      };
    }
  }]);

  return EShare;
}();

var Shares = {
  UShare: UShare,
  EShare: EShare,
  IShare: IShare
};
var _default = Shares;
exports["default"] = _default;