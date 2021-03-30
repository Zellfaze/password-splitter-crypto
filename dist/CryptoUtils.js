"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.CryptoUtils = void 0;

require("core-js/stable");

require("regenerator-runtime/runtime");

var _secrets = _interopRequireDefault(require("secrets.js-grempe"));

var _scryptJs = _interopRequireDefault(require("scrypt-js"));

var _jsCryptoAes = _interopRequireDefault(require("js-crypto-aes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var CryptoUtils = {
  aesEncrypt: aesEncrypt,
  aesDecrypt: aesDecrypt,
  hashPassword: hashPassword,
  generateIV: generateIV,
  generateSalt: generateSalt,
  normalStringtoUint8Array: normalStringtoUint8Array,
  hexStringtoUint8Array: hexStringtoUint8Array,
  uint8ArraytoHexString: uint8ArraytoHexString,
  validateShare: validateShare,
  generateShares: generateShares,
  recombineShares: recombineShares
};
exports.CryptoUtils = CryptoUtils;
var _default = CryptoUtils; // Setup AES params

exports["default"] = _default;
var N = 1024;
var blockSize = 8;
var parallelCost = 1;
var dkLen = 32; // Returns encrypted data
// {data, iv} (all hex strings)

function aesEncrypt(_x, _x2) {
  return _aesEncrypt.apply(this, arguments);
} // Returns decrypted data as a hex string


function _aesEncrypt() {
  _aesEncrypt = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data, hash) {
    var iv, dataArray, hashArray, ciphertext;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            iv = generateIV();
            dataArray = hexStringtoUint8Array(data);
            hashArray = hexStringtoUint8Array(hash);
            _context.next = 5;
            return _jsCryptoAes["default"].encrypt(dataArray, hashArray, {
              name: 'AES-GCM',
              iv: iv,
              tagLength: 16
            });

          case 5:
            ciphertext = _context.sent;
            return _context.abrupt("return", {
              data: uint8ArraytoHexString(ciphertext),
              iv: uint8ArraytoHexString(iv)
            });

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _aesEncrypt.apply(this, arguments);
}

function aesDecrypt(_x3, _x4, _x5) {
  return _aesDecrypt.apply(this, arguments);
} // Returns a Promise to hash a password with a given salt
// {hash, salt}


function _aesDecrypt() {
  _aesDecrypt = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ciphertext, hash, iv) {
    var ivArray, hashArray, ciphertextArray, plaintext;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            ivArray = hexStringtoUint8Array(iv);
            hashArray = hexStringtoUint8Array(hash);
            ciphertextArray = hexStringtoUint8Array(ciphertext);
            _context2.next = 5;
            return _jsCryptoAes["default"].decrypt(ciphertextArray, hashArray, {
              name: 'AES-GCM',
              iv: ivArray,
              tagLength: 16
            });

          case 5:
            plaintext = _context2.sent;
            return _context2.abrupt("return", uint8ArraytoHexString(plaintext));

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _aesDecrypt.apply(this, arguments);
}

function hashPassword(_x6) {
  return _hashPassword.apply(this, arguments);
} // Rudimentary check that share is valid


function _hashPassword() {
  _hashPassword = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(password) {
    var salt,
        saltHex,
        passwordArray,
        saltArray,
        hashArray,
        hash,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            salt = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : null;
            saltHex = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : false;
            passwordArray = normalStringtoUint8Array(password);

            if (!(salt === null)) {
              _context3.next = 8;
              break;
            }

            saltArray = generateSalt();
            salt = uint8ArraytoHexString(saltArray);
            _context3.next = 16;
            break;

          case 8:
            if (!saltHex) {
              _context3.next = 14;
              break;
            }

            if (/^[0-9a-fA-F]+$/i.test(salt)) {
              _context3.next = 11;
              break;
            }

            return _context3.abrupt("return", Promise.reject(Error("Salt is not valid hex!")));

          case 11:
            saltArray = hexStringtoUint8Array(salt);
            _context3.next = 16;
            break;

          case 14:
            // Convert the salt to an Uint8Array
            saltArray = normalStringtoUint8Array(salt); // Convert that array back to a hex salt

            salt = uint8ArraytoHexString(saltArray);

          case 16:
            _context3.next = 18;
            return _scryptJs["default"].scrypt(passwordArray, saltArray, N, blockSize, parallelCost, dkLen);

          case 18:
            hashArray = _context3.sent;
            hash = uint8ArraytoHexString(hashArray);
            return _context3.abrupt("return", {
              hash: hash,
              salt: salt
            });

          case 21:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _hashPassword.apply(this, arguments);
}

function validateShare(id, bits, data) {
  var shareComponents = _secrets["default"].extractShareComponents(data);

  if (!(shareComponents.id === id && shareComponents.bits === bits)) {
    return false;
  }

  return true;
} // TODO: Write tests for this!


function generateShares(text, size, quorum) {
  if (size < 2 || size > 255) {
    throw new Error("Group size must be between 2 and 255");
  }

  if (quorum < 2 || quorum > 255) {
    throw new Error("Quorum must be between 2 and 255");
  }

  if (text.length === 0) {
    throw new Error("Plaintext can't be a blank string");
  } // Convert the plaintext to a string of hex bytes


  var hexText = _secrets["default"].str2hex(text.normalize('NFKC')); // Generate Shamir's shares


  var shares = _secrets["default"].share(hexText, Number(size), Number(quorum), 1024);

  shares = shares.map(function (share) {
    // Extract the share data
    var shareData = _secrets["default"].extractShareComponents(share);

    return {
      id: shareData.id,
      bits: shareData.bits,
      data: share
    };
  });
  return shares;
} // Returns the plaintext that was used to create the shares


function recombineShares(shares) {
  var sharesText = shares.map(function (current) {
    return current.data;
  });
  return _secrets["default"].hex2str(_secrets["default"].combine(sharesText));
} // ===================
// Generators
// ===================
// Returns a random 12 Byte array to use as an IV


function generateIV() {
  return hexStringtoUint8Array(_secrets["default"].random(96));
} // Returns a random 12 Byte array to use as a salt


function generateSalt() {
  return hexStringtoUint8Array(_secrets["default"].random(96));
} // ===================
// String<->Byte Helpers
// ===================
// Normalizes a string then converts it to an array of bytes


function normalStringtoUint8Array(string) {
  return hexStringtoUint8Array(_secrets["default"].str2hex(string.normalize('NFKC')));
} // Converts a hex string into an array of bytes


function hexStringtoUint8Array(string) {
  return new Uint8Array(string.match(/.{1,2}/g).map(function (_byte) {
    return parseInt(_byte, 16);
  }));
} // Converts an array of bytes to a hex string
// Last byte is done seperately so that it does not have a leading zero.
// This is required to keep with the format produced by secrets.js-grempe


function uint8ArraytoHexString(array) {
  var lastElement = array.slice(-1);
  var otherElements = array.slice(0, -1);
  var string = otherElements.reduce(function (str, _byte2) {
    return str + _byte2.toString(16).padStart(2, '0');
  }, '');
  return string + Number(lastElement).toString(16);
}