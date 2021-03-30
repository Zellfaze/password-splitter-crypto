import Shares from '../Shares.js';
import ShareGroup from '../ShareGroup.js';
import CryptoUtils from '../CryptoUtils.js';

// TODO: Mock Shares instead of CryptoUtils to eliminate dependency
// on Shares being correct

describe("UShareGroup", () => {
  test("creating from data works", () => {
    // Setup some UShare objects
    const shareStarter = new Shares.UShare({id: 1, data: "801649ec44b6e582da82be0c281d8bc9708", bits: 8});
    const shareStarter2 = new Shares.UShare({id: 2, data: "801649ec44b6e582da82be0c281d8bc9708", bits: 8});
    
    // Create our ShareGroup
    const usharegroup = new ShareGroup.UShareGroup([shareStarter, shareStarter2]);
    expect(usharegroup.shares[0]).toMatchObject(shareStarter);
    expect(usharegroup.shares[1]).toMatchObject(shareStarter2);
  });
  
  test("creating from JSON works", () => {
    // Setup some UShare objects
    const shareStarter = new Shares.UShare({id: 1, data: "801649ec44b6e582da82be0c281d8bc9708", bits: 8});
    const shareStarter2 = new Shares.UShare({id: 2, data: "801649ec44b6e582da82be0c281d8bc9708", bits: 8});
    
    // Setup JSON
    const shareJSON = '{"shares":[{"id":1,"data":"801649ec44b6e582da82be0c281d8bc9708","bits":8,"type":"plain"},{"id":2,"data":"801649ec44b6e582da82be0c281d8bc9708","bits":8,"type":"plain"}],"type":"plain"}';
    
    // Create our ShareGroup
    const usharegroup = new ShareGroup.UShareGroup(shareJSON);
    
    expect(usharegroup.shares[0]).toMatchObject(shareStarter);
    expect(usharegroup.shares[1]).toMatchObject(shareStarter2);
  });
  
  test("passing invalid objects throws", () => {
    // Create our ShareGroup
    const usharegroup = (() => new ShareGroup.UShareGroup([{bad: "object"}, {oops: "also bad"}]));
    
    expect(usharegroup).toThrowError("All array members must be a share");
  });
  
  test("adding a new share works", () => {
    const shareStarter = new Shares.UShare({id: 1, data: "801649ec44b6e582da82be0c281d8bc9708", bits: 8});
    const shareStarter2 = new Shares.UShare({id: 2, data: "801649ec44b6e582da82be0c281d8bc9708", bits: 8});
    
    const usharegroup = new ShareGroup.UShareGroup([shareStarter]);
    usharegroup.addShare(shareStarter2);
    expect(usharegroup.shares[1]).toMatchObject(shareStarter2);
  });
  
  test("adding a share with a duplicate ID throws", () => {
    const shareStarter = new Shares.UShare({id: 1, data: "801649ec44b6e582da82be0c281d8bc9708", bits: 8});
    
    const usharegroup = new ShareGroup.UShareGroup([shareStarter]);
    const addShare = (() => usharegroup.addShare(shareStarter));
    expect(addShare).toThrowError("Group already includes a share with ID 1");
  });
  
  
  test("encrypt() produces an EShareGroup", async () => {
    CryptoUtils.aesEncrypt = jest.fn((data, hash) => {return {data: "encrypteddata", iv: "aaaaaaaaa"}});
    CryptoUtils.aesDecrypt = jest.fn((ciphertext, hash, iv) => {return "801649ec44b6e582da82be0c281d8bc9708";});
    
    const shareStarter = new Shares.UShare({id: 1, data: "801649ec44b6e582da82be0c281d8bc9708", bits: 8});
    
    const usharegroup = new ShareGroup.UShareGroup([shareStarter]);
    const esharegroup = await usharegroup.encrypt("user1", "pass1");
    expect(esharegroup).toBeInstanceOf(ShareGroup.EShareGroup);
  });
  
  test("invite() produces an IShareGroup", async () => {
    CryptoUtils.aesEncrypt = jest.fn((data, hash) => {return {data: "encrypteddata", iv: "aaaaaaaaa"}});
    CryptoUtils.aesDecrypt = jest.fn((ciphertext, hash, iv) => {return "801649ec44b6e582da82be0c281d8bc9708";});
    
    const shareStarter = new Shares.UShare({id: 1, data: "801649ec44b6e582da82be0c281d8bc9708", bits: 8});
    
    const usharegroup = new ShareGroup.UShareGroup([shareStarter]);
    const isharegroup = await usharegroup.invite("pass1");
    expect(isharegroup).toBeInstanceOf(ShareGroup.IShareGroup);
  });
});

describe("IShareGroup", () => {
  test("creating from data works", () => {
    // Setup some IShare objects
    const shareStarter = new Shares.IShare({id: 1, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa"});
    const shareStarter2 = new Shares.IShare({id: 2, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa"});
    
    // Create our ShareGroup
    const isharegroup = new ShareGroup.IShareGroup([shareStarter, shareStarter2]);
    expect(isharegroup.shares[0]).toMatchObject(shareStarter);
    expect(isharegroup.shares[1]).toMatchObject(shareStarter2);
  });
  
  test("creating from JSON works", () => {
    // Setup some IShare objects
    const shareStarter = new Shares.IShare({id: 1, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa"});
    const shareStarter2 = new Shares.IShare({id: 2, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa"});
    
    // Setup JSON
    const shareJSON = '{"shares":[{"id":1,"data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","type":"invite"},{"id":2,"data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","type":"invite"}],"type":"invite"}';
    
    // Create our ShareGroup
    const isharegroup = new ShareGroup.IShareGroup(shareJSON);
    
    expect(isharegroup.shares[0]).toMatchObject(shareStarter);
    expect(isharegroup.shares[1]).toMatchObject(shareStarter2);
  });
  
  test("passing invalid objects throws", () => {
    // Create our ShareGroup
    const isharegroup = (() => new ShareGroup.IShareGroup([{bad: "object"}, {oops: "also bad"}]));
    
    expect(isharegroup).toThrowError("All array members must be a share");
  });
  
  test("adding a new share works", () => {
    const shareStarter = new Shares.IShare({id: 1, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa"});
    const shareStarter2 = new Shares.IShare({id: 2, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa"});
    
    const isharegroup = new ShareGroup.IShareGroup([shareStarter]);
    isharegroup.addShare(shareStarter2);
    expect(isharegroup.shares[1]).toMatchObject(shareStarter2);
  });
  
  test("adding a share with a duplicate ID throws", () => {
    const shareStarter = new Shares.IShare({id: 1, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa"});
    
    const isharegroup = new ShareGroup.IShareGroup([shareStarter]);
    const addShare = (() => isharegroup.addShare(shareStarter));
    expect(addShare).toThrowError("Group already includes a share with ID 1");
  });
  
  test("decrypt() produces an UShareGroup", async () => {
    CryptoUtils.aesEncrypt = jest.fn((data, hash) => {return {data: "encrypteddata", iv: "aaaaaaaaa"}});
    CryptoUtils.aesDecrypt = jest.fn((ciphertext, hash, iv) => {return "801649ec44b6e582da82be0c281d8bc9708";});
    
    const shareStarter = new Shares.IShare({id: 1, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa"});
    
    const isharegroup = new ShareGroup.IShareGroup([shareStarter]);
    const usharegroup = await isharegroup.decrypt("pass1");
    expect(usharegroup).toBeInstanceOf(ShareGroup.UShareGroup);
  });
  
  test("encrypt() produces an EShareGroup", async () => {
    CryptoUtils.aesEncrypt = jest.fn((data, hash) => {return {data: "encrypteddata", iv: "aaaaaaaaa"}});
    CryptoUtils.aesDecrypt = jest.fn((ciphertext, hash, iv) => {return "801649ec44b6e582da82be0c281d8bc9708";});
    
    const shareStarter = new Shares.IShare({id: 1, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa"});
    
    const isharegroup = new ShareGroup.IShareGroup([shareStarter]);
    const esharegroup = await isharegroup.encrypt("invitepass", "user1", "pass1");
    expect(esharegroup).toBeInstanceOf(ShareGroup.EShareGroup);
  });
  
  test("changePassword() produces an IShareGroup", async () => {
    CryptoUtils.aesEncrypt = jest.fn((data, hash) => {return {data: "encrypteddata", iv: "aaaaaaaaa"}});
    CryptoUtils.aesDecrypt = jest.fn((ciphertext, hash, iv) => {return "801649ec44b6e582da82be0c281d8bc9708";});
    
    const shareStarter = new Shares.IShare({id: 1, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa"});
    
    const isharegroup = new ShareGroup.IShareGroup([shareStarter]);
    const isharegroup2 = await isharegroup.changePassword("oldpassword", "newpassword");
    expect(isharegroup2).toBeInstanceOf(ShareGroup.IShareGroup);
  });
  
  
});

describe("EShareGroup", () => {
  test("creating from data works", () => {
    // Setup some UShare objects
    const shareStarter = new Shares.EShare({id: 1, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa", username: "user1"});
    const shareStarter2 = new Shares.EShare({id: 2, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa", username: "user1"});
    
    // Create our ShareGroup
    const esharegroup = new ShareGroup.EShareGroup([shareStarter, shareStarter2]);
    expect(esharegroup.shares[0]).toMatchObject(shareStarter);
    expect(esharegroup.shares[1]).toMatchObject(shareStarter2);
  });
  
  test("creating from JSON works", () => {
    // Setup some UShare objects
    const shareStarter = new Shares.EShare({id: 1, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa", username: "user1"});
    const shareStarter2 = new Shares.EShare({id: 2, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa", username: "user1"});
    
    // Setup JSON
    const shareJSON = '{"shares":[{"id":1,"data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","username":"user1","type":"encrypted"},{"id":2,"data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","username":"user1","type":"encrypted"}],"type":"encrypted"}';
    
    // Create our ShareGroup
    const esharegroup = new ShareGroup.EShareGroup(shareJSON);
    
    expect(esharegroup.shares[0]).toMatchObject(shareStarter);
    expect(esharegroup.shares[1]).toMatchObject(shareStarter2);
  });
  
  test("passing invalid objects throws", () => {
    // Create our ShareGroup
    const esharegroup = (() => new ShareGroup.EShareGroup([{bad: "object"}, {oops: "also bad"}]));
    
    expect(esharegroup).toThrowError("All array members must be a share");
  });
  
  test("adding a new share works", () => {
    const shareStarter = new Shares.EShare({id: 1, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa", username: "user1"});
    const shareStarter2 = new Shares.EShare({id: 2, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa", username: "user1"});
    
    const esharegroup = new ShareGroup.EShareGroup([shareStarter]);
    esharegroup.addShare(shareStarter2);
    expect(esharegroup.shares[1]).toMatchObject(shareStarter2);
  });
  
  test("adding a share with a duplicate ID throws", () => {
    const shareStarter = new Shares.EShare({id: 1, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa", username: "user1"});
    
    const esharegroup = new ShareGroup.EShareGroup([shareStarter]);
    const addShare = (() => esharegroup.addShare(shareStarter));
    expect(addShare).toThrowError("Group already includes a share with ID 1");
  });
  
  test("decrypt() produces an UShareGroup", async () => {
    CryptoUtils.aesEncrypt = jest.fn((data, hash) => {return {data: "encrypteddata", iv: "aaaaaaaaa"}});
    CryptoUtils.aesDecrypt = jest.fn((ciphertext, hash, iv) => {return "801649ec44b6e582da82be0c281d8bc9708";});
    
    const shareStarter = new Shares.EShare({id: 1, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa", username: "user1"});
    
    const esharegroup = new ShareGroup.EShareGroup([shareStarter]);
    const usharegroup = await esharegroup.decrypt("pass1");
    expect(usharegroup).toBeInstanceOf(ShareGroup.UShareGroup);
  });
  
  test("changePassword() produces an EShareGroup", async () => {
    CryptoUtils.aesEncrypt = jest.fn((data, hash) => {return {data: "encrypteddata", iv: "aaaaaaaaa"}});
    CryptoUtils.aesDecrypt = jest.fn((ciphertext, hash, iv) => {return "801649ec44b6e582da82be0c281d8bc9708";});
    
    const shareStarter = new Shares.EShare({id: 1, data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa", username: "user1"});
    
    const esharegroup = new ShareGroup.EShareGroup([shareStarter]);
    const esharegroup2 = await esharegroup.changePassword("oldpassword", "newpassword");
    expect(esharegroup2).toBeInstanceOf(ShareGroup.EShareGroup);
  });
});


describe("createShareGroupFromRaw" , () => {
  test("creates UShareGroup", () => {
    const shareJSON = '{"shares":[{"id":1,"data":"801649ec44b6e582da82be0c281d8bc9708","bits":8,"type":"plain"},{"id":2,"data":"801649ec44b6e582da82be0c281d8bc9708","bits":8,"type":"plain"}],"type":"plain"}';
    const shareRaw = JSON.parse(shareJSON);
    
    // Check with JSON
    const sharegroup = ShareGroup.createShareGroupFromRaw(shareJSON);
    expect(sharegroup).toBeInstanceOf(ShareGroup.UShareGroup);
    
    // Check with raw
    const sharegroup2 = ShareGroup.createShareGroupFromRaw(shareRaw);
    expect(sharegroup2).toBeInstanceOf(ShareGroup.UShareGroup);
  });
  
  test("creates IShareGroup", () => {
    const shareJSON = '{"shares":[{"id":1,"data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","type":"invite"},{"id":2,"data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","type":"invite"}],"type":"invite"}';
    const shareRaw = JSON.parse(shareJSON);
    
    // Check with JSON
    const sharegroup = ShareGroup.createShareGroupFromRaw(shareJSON);
    expect(sharegroup).toBeInstanceOf(ShareGroup.IShareGroup);
    
    // Check with raw
    const sharegroup2 = ShareGroup.createShareGroupFromRaw(shareRaw);
    expect(sharegroup2).toBeInstanceOf(ShareGroup.IShareGroup);
  });
  
  test("creates EShareGroup", () => {
    const shareJSON = '{"shares":[{"id":1,"data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","username":"user1","type":"encrypted"},{"id":2,"data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","username":"user1","type":"encrypted"}],"type":"encrypted"}';
    const shareRaw = JSON.parse(shareJSON);
    
    // Check with JSON
    const sharegroup = ShareGroup.createShareGroupFromRaw(shareJSON);
    expect(sharegroup).toBeInstanceOf(ShareGroup.EShareGroup);
    
    // Check with raw
    const sharegroup2 = ShareGroup.createShareGroupFromRaw(shareRaw);
    expect(sharegroup2).toBeInstanceOf(ShareGroup.EShareGroup);
  });
  
  test("throws when given invalid data", () => {
    const shareJSON = '[{"bad": "data"}]';
    
    const shareRaw = JSON.parse(shareJSON);
    
    // Check with JSON
    const sharegroup = (() => ShareGroup.createShareGroupFromRaw(shareJSON));
    expect(sharegroup).toThrowError("Not a valid ShareGroup");
    
    // Check with raw
    const sharegroup2 = (() => ShareGroup.createShareGroupFromRaw(shareRaw));
    expect(sharegroup2).toThrowError("Not a valid ShareGroup");
  });
});
