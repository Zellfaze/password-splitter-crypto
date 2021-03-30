"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _CryptoUtils = _interopRequireDefault(require("./CryptoUtils.js"));

var _Shares = _interopRequireDefault(require("./Shares.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UShareGroup = /*#__PURE__*/function () {
  function UShareGroup(shares) {
    _classCallCheck(this, UShareGroup);

    // If we were passed a string, let's try to evaluate it as JSON
    // if it's not valid json, just let it throw
    if (typeof shares === "string") {
      var rawObj = JSON.parse(shares);
      shares = rawObj.shares.map(function (share) {
        return new _Shares["default"].UShare(share);
      });
    } // Get a list of all of the IDs


    var shareIDs = shares.map(function (share) {
      if (share.id === undefined) {
        throw new Error("All array members must be a share");
      }

      return share.id;
    }); // Ensure that each only appears in the list once

    while (shareIDs.length > 0) {
      var currentID = shareIDs.pop();

      if (shareIDs.includes(currentID)) {
        throw new Error("All shares must have a unique ID");
      }
    }

    this.shares = shares;
  }

  _createClass(UShareGroup, [{
    key: "addShare",
    value: function addShare(share) {
      if (this.shareIDs().includes(share.id)) {
        throw new Error("Group already includes a share with ID ".concat(share.id));
      }

      this.shares.push(share);
    }
  }, {
    key: "shareIDs",
    value: function shareIDs() {
      return this.shares.map(function (share) {
        return share.id;
      });
    }
  }, {
    key: "encrypt",
    value: function () {
      var _encrypt = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(username, password) {
        var sharePromises, resultShares;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                sharePromises = this.shares.map(function (share) {
                  return share.encrypt(username, password);
                });
                _context.next = 3;
                return Promise.all(sharePromises);

              case 3:
                resultShares = _context.sent;
                return _context.abrupt("return", new EShareGroup(resultShares));

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function encrypt(_x, _x2) {
        return _encrypt.apply(this, arguments);
      }

      return encrypt;
    }()
  }, {
    key: "invite",
    value: function () {
      var _invite = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(password) {
        var sharePromises, resultShares;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                sharePromises = this.shares.map(function (share) {
                  return share.invite(password);
                });
                _context2.next = 3;
                return Promise.all(sharePromises);

              case 3:
                resultShares = _context2.sent;
                return _context2.abrupt("return", new IShareGroup(resultShares));

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
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
        shares: this.shares,
        type: "plain"
      };
    }
  }]);

  return UShareGroup;
}();

var IShareGroup = /*#__PURE__*/function () {
  function IShareGroup(shares) {
    _classCallCheck(this, IShareGroup);

    // If we were passed a string, let's try to evaluate it as JSON
    // if it's not valid json, just let it throw
    if (typeof shares === "string") {
      var rawObj = JSON.parse(shares);
      shares = rawObj.shares.map(function (share) {
        return new _Shares["default"].IShare(share);
      });
    } // Get a list of all of the IDs


    var shareIDs = shares.map(function (share) {
      if (share.id === undefined) {
        throw new Error("All array members must be a share");
      }

      return share.id;
    }); // Ensure that each only appears in the list once

    while (shareIDs.length > 0) {
      var currentID = shareIDs.pop();

      if (shareIDs.includes(currentID)) {
        throw new Error("All shares must have a unique ID");
      }
    }

    this.shares = shares;
  }

  _createClass(IShareGroup, [{
    key: "addShare",
    value: function addShare(share) {
      if (this.shareIDs().includes(share.id)) {
        throw new Error("Group already includes a share with ID ".concat(share.id));
      }

      this.shares.push(share);
    }
  }, {
    key: "shareIDs",
    value: function shareIDs() {
      return this.shares.map(function (share) {
        return share.id;
      });
    }
  }, {
    key: "encrypt",
    value: function encrypt(invitepassword, username, password) {
      var sharePromises = this.shares.map(function (share) {
        return share.encrypt(invitepassword, username, password);
      });
      return Promise.all(sharePromises).then(function (resultShares) {
        return new EShareGroup(resultShares);
      });
    }
  }, {
    key: "changePassword",
    value: function () {
      var _changePassword = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(oldpassword, newpassword) {
        var sharePromises, resultShares;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                sharePromises = this.shares.map(function (share) {
                  return share.changePassword(oldpassword, newpassword);
                });
                _context3.next = 3;
                return Promise.all(sharePromises);

              case 3:
                resultShares = _context3.sent;
                return _context3.abrupt("return", new IShareGroup(resultShares));

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function changePassword(_x4, _x5) {
        return _changePassword.apply(this, arguments);
      }

      return changePassword;
    }()
  }, {
    key: "decrypt",
    value: function () {
      var _decrypt = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(password) {
        var sharePromises, resultShares;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                sharePromises = this.shares.map(function (share) {
                  return share.decrypt(password);
                });
                _context4.next = 3;
                return Promise.all(sharePromises);

              case 3:
                resultShares = _context4.sent;
                return _context4.abrupt("return", new UShareGroup(resultShares));

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function decrypt(_x6) {
        return _decrypt.apply(this, arguments);
      }

      return decrypt;
    }()
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        shares: this.shares,
        type: "invite"
      };
    }
  }]);

  return IShareGroup;
}();

var EShareGroup = /*#__PURE__*/function () {
  function EShareGroup(shares) {
    _classCallCheck(this, EShareGroup);

    // If we were passed a string, let's try to evaluate it as JSON
    // if it's not valid json, just let it throw
    if (typeof shares === "string") {
      var rawObj = JSON.parse(shares);
      shares = rawObj.shares.map(function (share) {
        return new _Shares["default"].EShare(share);
      });
    } // Get a list of all of the IDs


    var shareIDs = shares.map(function (share) {
      if (share.id === undefined) {
        throw new Error("All array members must be a share");
      }

      return share.id;
    }); // Ensure that each only appears in the list once

    while (shareIDs.length > 0) {
      var currentID = shareIDs.pop();

      if (shareIDs.includes(currentID)) {
        throw new Error("All shares must have a unique ID");
      }
    }

    this.shares = shares;
  }

  _createClass(EShareGroup, [{
    key: "addShare",
    value: function addShare(share) {
      if (this.shareIDs().includes(share.id)) {
        throw new Error("Group already includes a share with ID ".concat(share.id));
      }

      this.shares.push(share);
    }
  }, {
    key: "shareIDs",
    value: function shareIDs() {
      return this.shares.map(function (share) {
        return share.id;
      });
    }
  }, {
    key: "decrypt",
    value: function () {
      var _decrypt2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(password) {
        var sharePromises, resultShares;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                sharePromises = this.shares.map(function (share) {
                  return share.decrypt(password);
                });
                _context5.next = 3;
                return Promise.all(sharePromises);

              case 3:
                resultShares = _context5.sent;
                return _context5.abrupt("return", new UShareGroup(resultShares));

              case 5:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function decrypt(_x7) {
        return _decrypt2.apply(this, arguments);
      }

      return decrypt;
    }()
  }, {
    key: "changePassword",
    value: function () {
      var _changePassword2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(oldpassword, newpassword) {
        var sharePromises, resultShares;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                sharePromises = this.shares.map(function (share) {
                  return share.changePassword(oldpassword, newpassword);
                });
                _context6.next = 3;
                return Promise.all(sharePromises);

              case 3:
                resultShares = _context6.sent;
                return _context6.abrupt("return", new EShareGroup(resultShares));

              case 5:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function changePassword(_x8, _x9) {
        return _changePassword2.apply(this, arguments);
      }

      return changePassword;
    }()
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        shares: this.shares,
        type: "encrypted"
      };
    }
  }]);

  return EShareGroup;
}();

function createShareGroupFromRaw(rawObj) {
  if (typeof rawObj === "string") {
    rawObj = JSON.parse(rawObj);
  }

  switch (rawObj.type) {
    case "plain":
      return new UShareGroup(rawObj.shares);
      break;

    case "invite":
      return new IShareGroup(rawObj.shares);
      break;

    case "encrypted":
      return new EShareGroup(rawObj.shares);
      break;

    default:
      throw new Error("Not a valid ShareGroup");
  }
}

var ShareGroup = {
  UShareGroup: UShareGroup,
  EShareGroup: EShareGroup,
  IShareGroup: IShareGroup,
  createShareGroupFromRaw: createShareGroupFromRaw
};
var _default = ShareGroup;
exports["default"] = _default;