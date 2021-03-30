import CryptoUtils from './CryptoUtils.js';
import Shares from './Shares.js';

class UShareGroup {
  constructor(shares) {
    // If we were passed a string, let's try to evaluate it as JSON
    // if it's not valid json, just let it throw
    if (typeof shares === "string") {
      const rawObj = JSON.parse(shares);
      shares = rawObj.shares.map( (share) => {
        return new Shares.UShare(share);
      });
    }
    
    // Get a list of all of the IDs
    let shareIDs = shares.map( (share) => {
      if (share.id === undefined) {
        throw new Error("All array members must be a share");
      }
      
      return share.id;
    });
    
    // Ensure that each only appears in the list once
    while (shareIDs.length > 0) {
      const currentID = shareIDs.pop();
      
      if (shareIDs.includes(currentID)) {
        throw new Error("All shares must have a unique ID");
      }
    }
    
    this.shares = shares;
  }
  
  addShare(share) {
    if (this.shareIDs().includes(share.id)) {
      throw new Error(`Group already includes a share with ID ${share.id}`);
    }
    
    this.shares.push(share);
  }
  
  shareIDs() {
    return this.shares.map( (share) => {
      return share.id;
    });
  }
  
  async encrypt(username, password) {
    const sharePromises = this.shares.map( (share) => {
      return share.encrypt(username, password);
    });
    
    const resultShares = await Promise.all(sharePromises);
    return new EShareGroup(resultShares);
  }
  
  async invite(password) {
    const sharePromises = this.shares.map( (share) => {
      return share.invite(password);
    });
    
    const resultShares = await Promise.all(sharePromises);
    return new IShareGroup(resultShares);
  }
  
  toJSON() {
    return {
      shares: this.shares,
      type: "plain"
    }
  }
}

class IShareGroup {
  constructor(shares) {
    // If we were passed a string, let's try to evaluate it as JSON
    // if it's not valid json, just let it throw
    if (typeof shares === "string") {
      const rawObj = JSON.parse(shares);
      shares = rawObj.shares.map( (share) => {
        return new Shares.IShare(share);
      });
    }
    
    // Get a list of all of the IDs
    let shareIDs = shares.map( (share) => {
      if (share.id === undefined) {
        throw new Error("All array members must be a share");
      }
      
      return share.id;
    });
    
    // Ensure that each only appears in the list once
    while (shareIDs.length > 0) {
      const currentID = shareIDs.pop();
      
      if (shareIDs.includes(currentID)) {
        throw new Error("All shares must have a unique ID");
      }
    }
    
    this.shares = shares;
  }
  
  addShare(share) {
    if (this.shareIDs().includes(share.id)) {
      throw new Error(`Group already includes a share with ID ${share.id}`);
    }
    
    this.shares.push(share);
  }
  
  shareIDs() {
    return this.shares.map( (share) => {
      return share.id;
    });
  }
  
  encrypt(invitepassword, username, password) {
    const sharePromises = this.shares.map( (share) => {
      return share.encrypt(invitepassword, username, password);
    });
    
    return Promise.all(sharePromises).then( (resultShares) => {
      return new EShareGroup(resultShares);
    });
  }
  
  async changePassword(oldpassword, newpassword) {
    const sharePromises = this.shares.map( (share) => {
      return share.changePassword(oldpassword, newpassword);
    });
    
    const resultShares = await Promise.all(sharePromises);
    return new IShareGroup(resultShares);
  }
  
  async decrypt(password) {
    const sharePromises = this.shares.map( (share) => {
      return share.decrypt(password);
    });
    
    const resultShares = await Promise.all(sharePromises);
    return new UShareGroup(resultShares);
  }
  
  toJSON() {
    return {
      shares: this.shares,
      type: "invite"
    }
  }
}

class EShareGroup {
  constructor(shares) {
    // If we were passed a string, let's try to evaluate it as JSON
    // if it's not valid json, just let it throw
    if (typeof shares === "string") {
      const rawObj = JSON.parse(shares);
      shares = rawObj.shares.map( (share) => {
        return new Shares.EShare(share);
      });
    }
    
    // Get a list of all of the IDs
    let shareIDs = shares.map( (share) => {
      if (share.id === undefined) {
        throw new Error("All array members must be a share");
      }
      
      return share.id;
    });
    
    // Ensure that each only appears in the list once
    while (shareIDs.length > 0) {
      const currentID = shareIDs.pop();
      
      if (shareIDs.includes(currentID)) {
        throw new Error("All shares must have a unique ID");
      }
    }
    
    this.shares = shares;
  }
  
  addShare(share) {
    if (this.shareIDs().includes(share.id)) {
      throw new Error(`Group already includes a share with ID ${share.id}`);
    }
    
    this.shares.push(share);
  }
  
  shareIDs() {
    return this.shares.map( (share) => {
      return share.id;
    });
  }
  
  async decrypt(password) {
    const sharePromises = this.shares.map( (share) => {
      return share.decrypt(password);
    });
    
    const resultShares = await Promise.all(sharePromises);
    return new UShareGroup(resultShares);
  }
  
  async changePassword(oldpassword, newpassword) {
    const sharePromises = this.shares.map( (share) => {
      return share.changePassword(oldpassword, newpassword);
    });
    
    const resultShares = await Promise.all(sharePromises);
    return new EShareGroup(resultShares);
  }
  
  toJSON() {
    return {
      shares: this.shares,
      type: "encrypted"
    }
  }
}

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
      break
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

export default ShareGroup;
