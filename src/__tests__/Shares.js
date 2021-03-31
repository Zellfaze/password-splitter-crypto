import Shares from '../Shares.js';
import CryptoUtils from '../CryptoUtils.js';

describe("UShare", () => {
  const shareStarter = {id: 1, dbid: "9c9b8361-10e9-4ffc-ab85-93c88a696e5e", data: "801649ec44b6e582da82be0c281d8bc9708", bits: 8};
  const shareStarter2 = {id: 2, dbid: "b38dfa1f-6229-4fd7-b258-91dc74e74259", data: "802c8219596dcb05a4e5641998aadca338c", bits: 8};
  const shareJSON1 = '{"id":1,"dbid":"9c9b8361-10e9-4ffc-ab85-93c88a696e5e","data":"801649ec44b6e582da82be0c281d8bc9708","bits":8,"type":"plain"}';
  const shareJSON2 = '{"id":1,"dbid":"b38dfa1f-6229-4fd7-b258-91dc74e74259","data":"802c8219596dcb05a4e5641998aadca338c","bits":8,"type":"plain"}';
  
  test('creating from data works', () => {
    const ushare = new Shares.UShare(shareStarter);
    expect(ushare.id).toBe(1);
    expect(ushare.dbid).toBe("9c9b8361-10e9-4ffc-ab85-93c88a696e5e");
    expect(ushare.data).toBe("801649ec44b6e582da82be0c281d8bc9708");
    expect(ushare.bits).toBe(8);
  });

  test('creating from JSON works', () => {
    const ushare = new Shares.UShare(shareJSON1);
    expect(ushare.id).toBe(1);
    expect(ushare.dbid).toBe("9c9b8361-10e9-4ffc-ab85-93c88a696e5e");
    expect(ushare.data).toBe("801649ec44b6e582da82be0c281d8bc9708");
    expect(ushare.bits).toBe(8);
  });
  
  test('toJSON() produces correct output', () => {
    const ushare = new Shares.UShare(shareJSON1);
    const rawObj = JSON.parse(JSON.stringify(ushare));
    
    expect(rawObj).toMatchObject(JSON.parse(shareJSON1));
  });
  
  test('encrypt() produces an EShare', async () => {
    CryptoUtils.aesEncrypt = jest.fn((data, hash) => {return {data: "encrypteddata", iv: "aaaaaaaaa"}});
    
    const ushare = new Shares.UShare(shareStarter);
    const eshare = await ushare.encrypt("user1", "pass1");
    expect(eshare).toMatchObject({
      id: expect.anything(),
      dbid: expect.anything(),
      username: expect.anything(),
      bits: expect.anything(),
      data: expect.anything(),
      salt: expect.anything(),
      iv: expect.anything(),
    });
    expect(eshare.id).toBe(1);
    expect(eshare.dbid).toBe("9c9b8361-10e9-4ffc-ab85-93c88a696e5e");
    expect(eshare.username).toBe("user1");
    expect(eshare.bits).toBe(8);
    expect(eshare.data).toBe("encrypteddata");
    expect(eshare.iv).toBe("aaaaaaaaa");
  });
  
  test('invite() produces an IShare', async () => {
    CryptoUtils.aesEncrypt = jest.fn((data, hash) => {return {data: "encrypteddata", iv: "aaaaaaaaa"}});
    
    const ushare = new Shares.UShare(shareStarter);
    const ishare = await ushare.invite("invitepassword");
    expect(ishare).toMatchObject({
      id: expect.anything(),
      dbid: expect.anything(),
      bits: expect.anything(),
      data: expect.anything(),
      salt: expect.anything(),
      iv: expect.anything(),
    });
    expect(ishare.id).toBe(1);
    expect(ishare.dbid).toBe("9c9b8361-10e9-4ffc-ab85-93c88a696e5e");
    expect(ishare.bits).toBe(8);
    expect(ishare.data).toBe("encrypteddata");
    expect(ishare.iv).toBe("aaaaaaaaa");
  });
});

describe("IShare", () => {
  const shareStarter = {id: 1, dbid: "9c9b8361-10e9-4ffc-ab85-93c88a696e5e", data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa"};
  const shareJSON = '{"id":1,"dbid":"9c9b8361-10e9-4ffc-ab85-93c88a696e5e","data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","type":"invite"}';
  
  test('creating from data works', () => {
    const ishare = new Shares.IShare(shareStarter);
    expect(ishare.id).toBe(1);
    expect(ishare.dbid).toBe("9c9b8361-10e9-4ffc-ab85-93c88a696e5e");
    expect(ishare.data).toBe("encrypteddata");
    expect(ishare.bits).toBe(8);
    expect(ishare.salt).toBe("abcdef");
    expect(ishare.iv).toBe("aaaaaaaaa");
  });
  
  test('creating from JSON works', () => {
    const ishare = new Shares.IShare(shareJSON);
    expect(ishare.id).toBe(1);
    expect(ishare.dbid).toBe("9c9b8361-10e9-4ffc-ab85-93c88a696e5e");
    expect(ishare.data).toBe("encrypteddata");
    expect(ishare.bits).toBe(8);
    expect(ishare.salt).toBe("abcdef");
    expect(ishare.iv).toBe("aaaaaaaaa");
  });
  
  test('toJSON() produces correct output', () => {
    const ishare = new Shares.IShare(shareJSON);
    const rawObj = JSON.parse(JSON.stringify(ishare));
    
    expect(rawObj).toMatchObject(JSON.parse(shareJSON));
  });
  
  test('encrypt() produces an EShare', async () => {
    CryptoUtils.aesEncrypt = jest.fn((data, hash) => {return {data: "encrypteddata", iv: "aaaaaaaaa"}});
    CryptoUtils.aesDecrypt = jest.fn((ciphertext, hash, iv) => {return "801649ec44b6e582da82be0c281d8bc9708";});
    
    const ishare = new Shares.IShare(shareStarter);
    const eshare = await ishare.encrypt("invitepassword", "user1", "pass1");
    expect(eshare).toMatchObject({
      id: expect.anything(),
      dbid: expect.anything(),
      username: expect.anything(),
      bits: expect.anything(),
      data: expect.anything(),
      salt: expect.anything(),
      iv: expect.anything(),
    });
    expect(eshare.id).toBe(1);
    expect(eshare.dbid).toBe("9c9b8361-10e9-4ffc-ab85-93c88a696e5e");
    expect(eshare.username).toBe("user1");
    expect(eshare.bits).toBe(8);
    expect(eshare.data).toBe("encrypteddata");
    expect(eshare.iv).toBe("aaaaaaaaa");
  });
  
  test('changePassword() produces an IShare', async () => {
    CryptoUtils.aesEncrypt = jest.fn((data, hash) => {return {data: "encrypteddata", iv: "aaaaaaaaa"}});
    CryptoUtils.aesDecrypt = jest.fn((ciphertext, hash, iv) => {return "801649ec44b6e582da82be0c281d8bc9708";});
    
    const ishare = new Shares.IShare(shareStarter);
    const ishare2 = await ishare.changePassword("invitepassword", "newpassword");
    expect(ishare2).toMatchObject({
      id: expect.anything(),
      dbid: expect.anything(),
      bits: expect.anything(),
      data: expect.anything(),
      salt: expect.anything(),
      iv: expect.anything(),
    });
    expect(ishare2.id).toBe(1);
    expect(ishare.dbid).toBe("9c9b8361-10e9-4ffc-ab85-93c88a696e5e");
    expect(ishare2.bits).toBe(8);
    expect(ishare2.data).toBe("encrypteddata");
    expect(ishare2.iv).toBe("aaaaaaaaa");
  });
  
  test('decrypt() produces an UShare', async () => {
    CryptoUtils.aesDecrypt = jest.fn((ciphertext, hash, iv) => {return "801649ec44b6e582da82be0c281d8bc9708";});
    
    const ishare = new Shares.IShare(shareStarter);
    const ushare = await ishare.decrypt("invitepassword");
    expect(ushare).toMatchObject({
      id: expect.anything(),
      dbid: expect.anything(),
      bits: expect.anything(),
      data: expect.anything(),
    });
    expect(ushare.id).toBe(1);
    expect(ushare.dbid).toBe("9c9b8361-10e9-4ffc-ab85-93c88a696e5e");
    expect(ushare.bits).toBe(8);
    expect(ushare.data).toBe("801649ec44b6e582da82be0c281d8bc9708");
  });
});

describe("EShare", () => {
  const shareStarter = {id: 1, dbid: "9c9b8361-10e9-4ffc-ab85-93c88a696e5e", data: "encrypteddata", bits: 8, salt: "abcdef", iv:"aaaaaaaaa", username: "user1"};
  const shareJSON = '{"id":1,"dbid":"9c9b8361-10e9-4ffc-ab85-93c88a696e5e","data":"encrypteddata","bits":8,"salt":"abcdef","iv":"aaaaaaaaa","username":"user1","type":"encrypted"}';
  
  test('creating from data works', () => {
    const eshare = new Shares.EShare(shareStarter);
    expect(eshare.id).toBe(1);
    expect(eshare.dbid).toBe("9c9b8361-10e9-4ffc-ab85-93c88a696e5e");
    expect(eshare.data).toBe("encrypteddata");
    expect(eshare.bits).toBe(8);
    expect(eshare.salt).toBe("abcdef");
    expect(eshare.iv).toBe("aaaaaaaaa");
    expect(eshare.username).toBe("user1");
  });
  
  test('creating from JSON works', () => {
    const eshare = new Shares.EShare(shareJSON);
    expect(eshare.id).toBe(1);
    expect(eshare.dbid).toBe("9c9b8361-10e9-4ffc-ab85-93c88a696e5e");
    expect(eshare.data).toBe("encrypteddata");
    expect(eshare.bits).toBe(8);
    expect(eshare.salt).toBe("abcdef");
    expect(eshare.iv).toBe("aaaaaaaaa");
    expect(eshare.username).toBe("user1");
  });
  
  test('toJSON() produces correct output', () => {
    const eshare = new Shares.EShare(shareJSON);
    const rawObj = JSON.parse(JSON.stringify(eshare));
    
    expect(rawObj).toMatchObject(JSON.parse(shareJSON));
  });
  
  test('changePassword() produces an EShare', async () => {
    CryptoUtils.aesEncrypt = jest.fn((data, hash) => {return {data: "encrypteddata", iv: "aaaaaaaaa"}});
    CryptoUtils.aesDecrypt = jest.fn((ciphertext, hash, iv) => {return "801649ec44b6e582da82be0c281d8bc9708";});
    
    const eshare = new Shares.EShare(shareStarter);
    const eshare2 = await eshare.changePassword("oldpassword", "newpassword");
    expect(eshare2).toMatchObject({
      id: expect.anything(),
      dbid: expect.anything(),
      username: expect.anything(),
      bits: expect.anything(),
      data: expect.anything(),
      salt: expect.anything(),
      iv: expect.anything(),
    });
    expect(eshare.id).toBe(1);
    expect(eshare.dbid).toBe("9c9b8361-10e9-4ffc-ab85-93c88a696e5e");
    expect(eshare.data).toBe("encrypteddata");
    expect(eshare.bits).toBe(8);
    expect(eshare.salt).toBe("abcdef");
    expect(eshare.iv).toBe("aaaaaaaaa");
    expect(eshare.username).toBe("user1");
  });
  
  test('decrypt() produces an UShare', async () => {
    CryptoUtils.aesDecrypt = jest.fn((ciphertext, hash, iv) => {return "801649ec44b6e582da82be0c281d8bc9708";});
    
    const eshare = new Shares.EShare(shareStarter);
    const ushare = await eshare.decrypt("password");
    expect(ushare).toMatchObject({
      id: expect.anything(),
      dbid: expect.anything(),
      bits: expect.anything(),
      data: expect.anything(),
    });
    expect(ushare.id).toBe(1);
    expect(ushare.dbid).toBe("9c9b8361-10e9-4ffc-ab85-93c88a696e5e");
    expect(ushare.bits).toBe(8);
    expect(ushare.data).toBe("801649ec44b6e582da82be0c281d8bc9708");
  });
});
