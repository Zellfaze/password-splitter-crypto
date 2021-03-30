import "core-js/stable";
import "regenerator-runtime/runtime";
import secrets from 'secrets.js-grempe';
import scrypt from 'scrypt-js';
import aes from 'js-crypto-aes';

export const CryptoUtils = {
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
  recombineShares: recombineShares,
}

export default CryptoUtils;

// Setup AES params
const N = 1024;
const blockSize = 8;
const parallelCost = 1;
const dkLen = 32;

// Returns encrypted data
// {data, iv} (all hex strings)
async function aesEncrypt(data, hash) {
  const iv = generateIV();
  const dataArray = hexStringtoUint8Array(data);
  const hashArray = hexStringtoUint8Array(hash);
  
  const ciphertext = await aes.encrypt(dataArray, hashArray, {name: 'AES-GCM', iv: iv, tagLength: 16});
  return {
    data: uint8ArraytoHexString(ciphertext),
    iv: uint8ArraytoHexString(iv)
  };
}

// Returns decrypted data as a hex string
async function aesDecrypt(ciphertext, hash, iv) {
  const ivArray = hexStringtoUint8Array(iv);
  const hashArray = hexStringtoUint8Array(hash);
  const ciphertextArray = hexStringtoUint8Array(ciphertext);
  
  const plaintext = await aes.decrypt(ciphertextArray, hashArray, {name: 'AES-GCM', iv: ivArray, tagLength: 16});
  return uint8ArraytoHexString(plaintext);
}


// Returns a Promise to hash a password with a given salt
// {hash, salt}
async function hashPassword(password, salt = null, saltHex = false) {
  let passwordArray = normalStringtoUint8Array(password);
  let saltArray;
  if (salt === null) {
    saltArray = generateSalt();
    salt = uint8ArraytoHexString(saltArray);
  } else {
    if (saltHex) {
      // Test to make sure that the salt really is hex
      if (!/^[0-9a-fA-F]+$/i.test(salt)) {
        return Promise.reject(Error("Salt is not valid hex!"));
      }
      
      saltArray = hexStringtoUint8Array(salt);
    } else {
      // Convert the salt to an Uint8Array
      saltArray = normalStringtoUint8Array(salt);
      
      // Convert that array back to a hex salt
      salt = uint8ArraytoHexString(saltArray);
    }
  }
  
  const hashArray = await scrypt.scrypt(passwordArray, saltArray, N, blockSize, parallelCost, dkLen);
  let hash = uint8ArraytoHexString(hashArray);
  return {
    hash: hash,
    salt: salt
  };
}

// Rudimentary check that share is valid
function validateShare(id, bits, data) {
  const shareComponents = secrets.extractShareComponents(data);
  
  if (!((shareComponents.id === id) &&
      (shareComponents.bits === bits)))
  {
    return false;
  }
  
  return true;
}

// TODO: Write tests for this!
function generateShares(text, size, quorum) {
  if ((size < 2) || (size > 255)) { throw new Error("Group size must be between 2 and 255"); }
  if ((quorum < 2) || (quorum > 255)) { throw new Error("Quorum must be between 2 and 255"); }
  if (text.length === 0) {throw new Error("Plaintext can't be a blank string");}
  
  // Convert the plaintext to a string of hex bytes
  let hexText = secrets.str2hex(text.normalize('NFKC'));
  
  // Generate Shamir's shares
  let shares = secrets.share(hexText, Number(size), Number(quorum), 1024);
  shares = shares.map( (share) => {
    // Extract the share data
    let shareData = secrets.extractShareComponents(share);
    return {
      id: shareData.id,
      bits: shareData.bits,
      data: share
    };
  });
  
  return shares;
}

// Returns the plaintext that was used to create the shares
function recombineShares(shares) {
  const sharesText = shares.map( (current) => {
    return current.data;
  });
  
  return secrets.hex2str(secrets.combine(sharesText));
}

// ===================
// Generators
// ===================

// Returns a random 12 Byte array to use as an IV
function generateIV() {
  return hexStringtoUint8Array(secrets.random(96));
}

// Returns a random 12 Byte array to use as a salt
function generateSalt() {
  return hexStringtoUint8Array(secrets.random(96));
}

// ===================
// String<->Byte Helpers
// ===================

// Normalizes a string then converts it to an array of bytes
function normalStringtoUint8Array(string) {
  return hexStringtoUint8Array(secrets.str2hex(string.normalize('NFKC')));
}

// Converts a hex string into an array of bytes
function hexStringtoUint8Array(string) {
  return new Uint8Array(string.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

// Converts an array of bytes to a hex string
// Last byte is done seperately so that it does not have a leading zero.
// This is required to keep with the format produced by secrets.js-grempe
function uint8ArraytoHexString(array) {
  const lastElement = array.slice(-1);
  const otherElements = array.slice(0, -1);
  const string = otherElements.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
  return string + Number(lastElement).toString(16);
}
