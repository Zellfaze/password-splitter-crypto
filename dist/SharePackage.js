"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _CryptoUtils = _interopRequireDefault(require("./CryptoUtils.js"));

var _Shares = _interopRequireDefault(require("./Shares.js"));

var _ShareGroup = _interopRequireDefault(require("./ShareGroup.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ESharePackage = /*#__PURE__*/function () {
  //construct(json)
  //construct([shares], size, quorum)
  //construct([shares], size, quorum, name, description)
  function ESharePackage(shareGroups) {
    var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var quorum = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var name = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var description = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    _classCallCheck(this, ESharePackage);

    // If we were passed a string, let's try to evaluate it as JSON
    // if it's not valid json, just let it throw
    if (typeof shareGroups === "string") {
      var rawObj = JSON.parse(shareGroups);
      shareGroups = rawObj.shareGroups.map(function (sharegroup) {
        return _ShareGroup["default"].createShareGroupFromRaw(sharegroup);
      });
      size = rawObj.size;
      quorum = rawObj.quorum;
      name = rawObj.name;
      description = rawObj.description;
    } // Make sure that we were given a size and a quorum


    if (size === null || quorum === null) {
      throw new Error("Size and Quorum must be supplied!");
    } // Make sure that shareGroups is an array


    if (!Array.isArray(shareGroups)) {
      throw new Error("First argument must be an array of ShareGroups or JSON");
    } // Get a list of all the IDs in all the groups


    var allIDs = [].concat.apply([], shareGroups.map(function (sharegroup) {
      return sharegroup.shareIDs();
    })); // Make sure that no ID is repeated

    var IDCheck = allIDs.slice();

    while (IDCheck.length > 0) {
      var currentID = IDCheck.pop();

      if (IDCheck.includes(currentID)) {
        throw new Error("All shares must have a unique ID! Duplicate ID: ".concat(currentID));
      }
    } // Make sure the total number of shares is between quorum and size


    if (allIDs.length > size || allIDs.length < quorum) {
      throw new Error("Number of shares must be greater than quorum and less than size");
    } // Everything is in order, save the properties


    this.shareGroups = shareGroups;
    this.size = size;
    this.quorum = quorum;
    this.name = name;
    this.description = description;
  }

  _createClass(ESharePackage, [{
    key: "canDecrypt",
    value: function canDecrypt() {
      // Check that every share group is a UShareGroup
      return this.shareGroups.reduce(function (result, sharegroup) {
        return result && sharegroup instanceof _ShareGroup["default"].UShareGroup;
      }, true);
    }
  }, {
    key: "decrypt",
    value: function decrypt() {
      // Make sure all the share groups are unencrypted
      if (!this.canDecrypt()) {
        throw new Error("All ShareGroups must be a UShareGroup");
      } // Extract UShare objects from each UShareGroup


      var shareArray = [].concat.apply([], this.shareGroups.map(function (sharegroup) {
        return sharegroup.shares;
      })); // Extract data from each UShare object NOTE: This might not be needed!

      var dataArray = shareArray.map(function (share) {
        return share.data;
      }); // Recombine the shares

      var plaintext = _CryptoUtils["default"].recombineShares(shareArray); // Try to parse the result as JSON
      //  if that fails throw, shares corrupted


      var recoveredObj;

      try {
        recoveredObj = JSON.parse(plaintext);
      } catch (err) {
        throw new Error("Could not parse plaintext, shares corrupted?");
      } // Validate that the resulting object has a plaintext


      if (recoveredObj.plaintext === undefined) {
        throw new Error("Recovered object invalid, shares corrupted?");
      } // Create a and return a USharePackage object
      // We are going to use the name and description that are contained in the recovered object


      return new USharePackage(recoveredObj.plaintext, recoveredObj.name, recoveredObj.description);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        shareGroups: this.shareGroups,
        size: this.size,
        quorum: this.quorum,
        name: this.name,
        description: this.description
      };
    }
  }]);

  return ESharePackage;
}();

var USharePackage = /*#__PURE__*/function () {
  function USharePackage(plaintext) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var description = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, USharePackage);

    try {
      var rawObj = JSON.parse(plaintext);

      if (rawObj.plaintext === undefined) {
        throw new Error("Invalid json");
      }

      if (rawObj.name === undefined) {
        throw new Error("Invalid json");
      }

      if (rawObj.description === undefined) {
        throw new Error("Invalid json");
      }

      plaintext = rawObj.plaintext;
      name = rawObj.name;
      description = rawObj.description;
    } catch (err) {} // If there was any errors, assume it wasn't json
    finally {
      this.plaintext = plaintext;
      this.name = name;
      this.description = description;
    }
  }

  _createClass(USharePackage, [{
    key: "encrypt",
    value: function encrypt(size, quorum) {
      var shareGroupSizes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (shareGroupSizes === null) {
        // Generate an array of size where each element is 1
        shareGroupSizes = Array.apply(null, Array(size)).map(function () {
          return 1;
        });
      } // Create the JSON to split


      var json = JSON.stringify({
        plaintext: this.plaintext,
        name: this.name,
        description: this.description
      }); // Generate the shares

      var shares = _CryptoUtils["default"].generateShares(json, size, quorum); // Create the share objects


      shares = shares.map(function (share) {
        return new _Shares["default"].UShare(share);
      }); // Create the share groups

      var shareGroups = shareGroupSizes.map(function (groupSize) {
        // Pop as many shares off shares as groupSize and push them on groupShares
        var groupShares = [];

        for (var i = 0; i < groupSize; i++) {
          var share = shares.pop();
          groupShares.push(share);
        }

        return new _ShareGroup["default"].UShareGroup(groupShares);
      }); // Create and return a ESharePackage

      return new ESharePackage(shareGroups, size, quorum, this.name, this.description);
    }
  }]);

  return USharePackage;
}();

var _default = {
  ESharePackage: ESharePackage,
  USharePackage: USharePackage
};
exports["default"] = _default;