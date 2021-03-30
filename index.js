require("core-js/stable");
require("regenerator-runtime/runtime");

var CryptoUtils = require('./dist/CryptoUtils.js');
var ShareGroup = require('./dist/ShareGroup.js');
var SharePackage = require('./dist/SharePackage.js');
var Shares = require('./dist/Shares.js');

var Crypto = {
  CryptoUtils: CryptoUtils,
  ShareGroup: ShareGroup,
  SharePackage: SharePackage,
  Shares: Shares,
  
  UShare: Shares.default.UShare,
  IShare: Shares.default.IShare,
  EShare: Shares.default.EShare,
  
  UShareGroup: ShareGroup.default.UShareGroup,
  IShareGroup: ShareGroup.default.IShareGroup,
  EShareGroup: ShareGroup.default.EShareGroup,
  
  USharePackage: SharePackage.default.USharePackage,
  ESharePackage: SharePackage.default.ESharePackage,
};

module.exports = Crypto;
