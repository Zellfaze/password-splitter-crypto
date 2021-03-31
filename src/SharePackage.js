import CryptoUtils from './CryptoUtils.js';
import Shares from './Shares.js';
import ShareGroup from './ShareGroup.js';
import { v4 as uuidv4 } from 'uuid';

class ESharePackage {
  //construct(json)
  //construct([shares], {dbid!, size!, quorum!, name?, description?})
  constructor(shareGroups, options = {}) {
    let {dbid = null, size = null, quorum = null, name = null, description = null} = options;
    // If we were passed a string, let's try to evaluate it as JSON
    // if it's not valid json, just let it throw
    if (typeof shareGroups === "string") {
      const rawObj = JSON.parse(shareGroups);
      shareGroups = rawObj.shareGroups.map( (sharegroup) => {
        return ShareGroup.createShareGroupFromRaw(sharegroup);
      });
      
      dbid = rawObj.dbid;
      size = rawObj.size;
      quorum = rawObj.quorum;
      name = rawObj.name;
      description = rawObj.description;
    }
    
    //Make sure that we were given a dbid
    if (dbid === null) {
      throw new Error("A dbid must be supplied!");
    }
    
    // Make sure that we were given a size and a quorum
    if ((size === null) || (quorum === null)) {
      throw new Error("Size and Quorum must be supplied!");
    }
    
    // Make sure that shareGroups is an array
    if (!Array.isArray(shareGroups)) {
      throw new Error("First argument must be an array of ShareGroups or JSON");
    }
    
    // Get a list of all the IDs in all the groups
    const allIDs = [].concat.apply([], shareGroups.map( (sharegroup) => {
      return sharegroup.shareIDs();
    }));
    
    // Make sure that no ID is repeated
    let IDCheck = allIDs.slice();
    while (IDCheck.length > 0) {
      const currentID = IDCheck.pop();
      
      if (IDCheck.includes(currentID)) {
        throw new Error(`All shares must have a unique ID! Duplicate ID: ${currentID}`);
      }
    }
    
    // Make sure the total number of shares is between quorum and size
    if ((allIDs.length > size) || (allIDs.length < quorum)) {
      throw new Error("Number of shares must be greater than quorum and less than size");
    }
    
    // Everything is in order, save the properties
    this.dbid = dbid;
    this.shareGroups = shareGroups;
    this.size = size;
    this.quorum = quorum;
    this.name = name;
    this.description = description;
  }
  
  canDecrypt() {
    // Check that every share group is a UShareGroup
    return this.shareGroups.reduce( (result, sharegroup) => {
      return result && (sharegroup instanceof ShareGroup.UShareGroup);
    }, true);
  }
  
  decrypt() {
    // Make sure all the share groups are unencrypted
    if (!this.canDecrypt()) {
      throw new Error("All ShareGroups must be a UShareGroup");
    }
    
    // Extract UShare objects from each UShareGroup
    const shareArray = [].concat.apply([], this.shareGroups.map( (sharegroup) => {
      return sharegroup.shares;
    }));
    
    // Recombine the shares
    const plaintext = CryptoUtils.recombineShares(shareArray);
    
    // Try to parse the result as JSON
    //  if that fails throw, shares corrupted
    let recoveredObj;
    try {
      recoveredObj = JSON.parse(plaintext);
    } catch (err) {
      throw new Error("Could not parse plaintext, shares corrupted?");
    }
    
    // Validate that the resulting object has a plaintext
    if (recoveredObj.plaintext === undefined) {
      throw new Error("Recovered object invalid, shares corrupted?");
    }
    
    // Create a and return a USharePackage object
    // We are going to use the name and description that are contained in the recovered object
    return new USharePackage(recoveredObj.plaintext, {dbid: this.dbid, name: recoveredObj.name, description: recoveredObj.description});
  }
  
  toJSON() {
    return {
      shareGroups: this.shareGroups,
      dbid: this.dbid,
      size: this.size,
      quorum: this.quorum,
      name: this.name,
      description: this.description,
    };
  }
}

class USharePackage {
  //construct(json)
  //construct(plaintext, {dbid?, name?, description?})
  constructor(plaintext, options = {}) {
    let {dbid = null, name = null, description = null} = options;
    try {
      let rawObj = JSON.parse(plaintext);
      
      if (rawObj.plaintext === undefined) { throw new Error("Invalid json"); }
      if (rawObj.name === undefined) { throw new Error("Invalid json"); }
      if (rawObj.description === undefined) { throw new Error("Invalid json"); }
      if (rawObj.dbid === undefined) { throw new Error("Invalid json"); }
      
      dbid = rawObj.dbid;
      plaintext = rawObj.plaintext;
      name = rawObj.name;
      description = rawObj.description;
    } catch(err) {} // If there was any errors, assume it wasn't json
    finally {
      if (dbid === null) {
        dbid = uuidv4();
      }
      
      this.dbid = dbid;
      this.plaintext = plaintext;
      this.name = name;
      this.description = description;
    }
  }
  
  encrypt(size, quorum, shareGroupSizes = null) {
    if (size === undefined) { throw new Error("Size must be supplied!"); }
    if (quorum === undefined) { throw new Error("Quorum must be supplied!"); }
    if (size < 2) { throw new Error("Size must be at least 2!"); }
    if (quorum < 2) { throw new Error("Quorum must be at least 2!"); }
    if (size > 255) { throw new Error("Size must be at less than 255!"); }
    if (quorum > 255) { throw new Error("Quorum must be at less than 255!"); }
    if (quorum > size) { throw new Error("Size must be greater than quorum!"); }
    
    if (shareGroupSizes === null) {
      // Generate an array of size where each element is 1
      shareGroupSizes = Array.apply(null, Array(size)).map(() => 1)
    }
    
    const shareGroupSizesTotal = shareGroupSizes.reduce(function(sum, next) { return sum + next });
    if (shareGroupSizesTotal !== size) { throw new Error("Share groups must total to size!"); }
    
    // Create the JSON to split
    const json = JSON.stringify({
      plaintext: this.plaintext,
      name: this.name,
      description: this.description,
    });
    
    // Generate the shares
    let shares = CryptoUtils.generateShares(json, size, quorum);
    
    // Create the share objects
    shares = shares.map( (share) => {
      // Add a dbid
      share.dbid = uuidv4();
      return new Shares.UShare(share);
    });
    
    // Create the share groups
    const shareGroups = shareGroupSizes.map( (groupSize) => {
      // Pop as many shares off shares as groupSize and push them on groupShares
      let groupShares = [];
      for (let i = 0; i < groupSize; i++) {
        const share = shares.pop();
        groupShares.push(share);
      }
      return new ShareGroup.UShareGroup(groupShares);
    });
    
    // Create and return a ESharePackage
    return new ESharePackage(shareGroups, {dbid: this.dbid, size: size, quorum: quorum, name: this.name, description: this.description});
  }
}

export default {
  ESharePackage: ESharePackage,
  USharePackage: USharePackage,
};
