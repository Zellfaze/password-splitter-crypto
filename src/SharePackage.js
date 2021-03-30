import CryptoUtils from './CryptoUtils.js';
import Shares from './Shares.js';
import ShareGroup from './ShareGroup.js';

class ESharePackage {
  //construct(json)
  //construct([shares], size, quorum)
  //construct([shares], size, quorum, name, description)
  constructor(shareGroups, size = null, quorum = null, name = null, description = null) {
    // If we were passed a string, let's try to evaluate it as JSON
    // if it's not valid json, just let it throw
    if (typeof shareGroups === "string") {
      const rawObj = JSON.parse(shareGroups);
      shareGroups = rawObj.shareGroups.map( (sharegroup) => {
        return ShareGroup.createShareGroupFromRaw(sharegroup);
      });
      
      size = rawObj.size;
      quorum = rawObj.quorum;
      name = rawObj.name;
      description = rawObj.description;
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
    
    // Extract data from each UShare object NOTE: This might not be needed!
    const dataArray = shareArray.map( (share) => {
      return share.data;
    });
    
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
    return new USharePackage(recoveredObj.plaintext, recoveredObj.name, recoveredObj.description);
  }
  
  toJSON() {
    return {
      shareGroups: this.shareGroups,
      size: this.size,
      quorum: this.quorum,
      name: this.name,
      description: this.description,
    };
  }
}

class USharePackage {
  constructor(plaintext, name = null, description = null) {
    try {
      let rawObj = JSON.parse(plaintext);
      
      if (rawObj.plaintext === undefined) { throw new Error("Invalid json"); }
      if (rawObj.name === undefined) { throw new Error("Invalid json"); }
      if (rawObj.description === undefined) { throw new Error("Invalid json"); }
      
      plaintext = rawObj.plaintext;
      name = rawObj.name;
      description = rawObj.description;
    } catch(err) {} // If there was any errors, assume it wasn't json
    finally {
      this.plaintext = plaintext;
      this.name = name;
      this.description = description;
    }
  }
  
  encrypt(size, quorum, shareGroupSizes = null) {
    if (shareGroupSizes === null) {
      // Generate an array of size where each element is 1
      shareGroupSizes = Array.apply(null, Array(size)).map(() => 1)
    }
    
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
    return new ESharePackage(shareGroups, size, quorum, this.name, this.description);
  }
}

export default {
  ESharePackage: ESharePackage,
  USharePackage: USharePackage,
};
