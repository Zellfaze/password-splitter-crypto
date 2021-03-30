import "core-js/stable";
import "regenerator-runtime/runtime";
import CryptoUtils from './CryptoUtils.js';

class UShare {
  constructor(input) {
    // If we were passed a string, let's try to evaluate it as JSON
    // if it's not valid json, just let it throw
    if (typeof input === "string") {
      input = JSON.parse(input);
    }
    
    this.id = input.id;
    this.data = input.data;
    this.bits = input.bits;
  }
  
  // Returns a promise for an EShare object
  async encrypt(username, password) {
    try {
      // Hash the password
      const hashObj = await CryptoUtils.hashPassword(password);
      
      // Then encrypt the data
      const cryptObj = await CryptoUtils.aesEncrypt(this.data, hashObj.hash);
      
      // Then return an EShare object
      return new EShare({
        id: this.id,
        username: username,
        bits: this.bits,
        data: cryptObj.data,
        salt: hashObj.salt,
        iv: cryptObj.iv
      });
    } catch (err) {
      return Promise.reject("Failed to encrypt share!");
    }
  }
  
  // Returns a promise for an IShare object
  async invite(password) {
    try {
      // Hash the password
      const hashObj = await CryptoUtils.hashPassword(password);
      
      // Then encrypt the data
      const cryptObj = await CryptoUtils.aesEncrypt(this.data, hashObj.hash);
      
      // Then return an IShare object
      return new IShare({
        id: this.id,
        bits: this.bits,
        data: cryptObj.data,
        salt: hashObj.salt,
        iv: cryptObj.iv
      });
    } catch (err) {
      return Promise.reject("Failed to encrypt share!");
    }
  }
  
  toJSON() {
    return {
      id: this.id,
      data: this.data,
      bits: this.bits,
      type: "plain"
    };
  }
}

class IShare {
  constructor(input) {
    // If we were passed a string, let's try to evaluate it as JSON
    // if it's not valid json, just let it throw
    if (typeof input === "string") {
      input = JSON.parse(input);
    }
    
    this.id = input.id;
    this.data = input.data;
    this.bits = input.bits;
    this.salt = input.salt;
    this.iv = input.iv;
  }
  
  // Returns a promise for an EShare object
  async encrypt(invitepassword, username, password) {
    const unencryptedShare = await this.decrypt(invitepassword);
    return await unencryptedShare.encrypt(username, password);
  }
  
  // Returns a promise that resolves with a new IShare when password is changed
  async changePassword(oldpassword, newpassword) {
    const unencryptedShare = await this.decrypt(oldpassword)
    return unencryptedShare.invite(newpassword);
  }
  
  // Returns a promise for a UShare object
  async decrypt(password) {
    try {
      const hashObj = await CryptoUtils.hashPassword(password, this.salt, true);
      const plaintext = await CryptoUtils.aesDecrypt(this.data, hashObj.hash, this.iv);
      
      if (!CryptoUtils.validateShare(this.id, this.bits, plaintext)) {
        return Promise.reject("Share verification failed! Corrupted share?");
      }
      
      return new UShare({
        id: this.id,
        bits: this.bits,
        data: plaintext
      });
    } catch (err) {
      return Promise.reject("Failed to decrypt share! Bad password?");
    }
  }
  
  toJSON() {
    return {
      id: this.id,
      data: this.data,
      bits: this.bits,
      salt: this.salt,
      iv: this.iv,
      type: "invite"
    };
  }
}

class EShare {
  constructor(input) {
    // If we were passed a string, let's try to evaluate it as JSON
    // if it's not valid json, just let it throw
    if (typeof input === "string") {
      input = JSON.parse(input);
    }
    
    this.id = input.id;
    this.data = input.data;
    this.bits = input.bits;
    this.salt = input.salt;
    this.iv = input.iv;
    this.username = input.username;
  }
  
  // Returns a promise for a UShare object
  async decrypt(password) {
    try {
      const hashObj = await CryptoUtils.hashPassword(password, this.salt, true);
      const plaintext = await CryptoUtils.aesDecrypt(this.data, hashObj.hash, this.iv);
      
      if (!CryptoUtils.validateShare(this.id, this.bits, plaintext)) {
        return Promise.reject("Share verification failed! Corrupted share?");
      }
      
      return new UShare({
        id: this.id,
        bits: this.bits,
        data: plaintext
      });
    } catch (err) {
      return Promise.reject("Failed to decrypt share! Bad password?");
    }
  }
  
  // Returns a promise that resolves with a new EShare when password is changed
  async changePassword(oldpassword, newpassword) {
    const unencryptedShare = await this.decrypt(oldpassword)
    return unencryptedShare.encrypt(this.username, newpassword);
  }
  
  toJSON(key) {
    return {
      id: this.id,
      data: this.data,
      bits: this.bits,
      salt: this.salt,
      iv: this.iv,
      username: this.username,
      type: "encrypted"
    };
  }
}

var Shares = {
  UShare: UShare,
  EShare: EShare,
  IShare: IShare
};

export default Shares;
