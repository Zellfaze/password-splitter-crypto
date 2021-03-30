import Shares from '../Shares.js';
import ShareGroup from '../ShareGroup.js'; 
import SharePackage from '../SharePackage.js';
import CryptoUtils from '../CryptoUtils.js';

describe("ESharePackage", () => {
  const ushareGroup1 = new ShareGroup.UShareGroup('{"shares":[{"id":4,"data":"804ccbd9e8175025955b7d2571fbfff3daac008cfe7120627d95822e23ef32ba120f7dc00b984eec47144301a340beac40189d6b503cfedf853297b13c91c84d8c8130d8fb5c5d9ca2ed5141698d54959c3b96206a92ed18b4df27b4f69a27b6b9ec4c3adb05b5aff7ddbf7e76d4c52131298e9696b4349df260ce45d110d2e639e1743159565a4ed39d4cd0e4c2cc14195f9f41466bff48dacf91c627957b4003909b3f40db74ce29c2a15a6d4e68039f95bc05b073b08f2266e869b89c451f2a9940c8f9ec8fdb9f73244d0d6994390be7fd2167785895b08e2aefd0a1262008eb11210b6ee84e56de44b4abddc17b01b44bbe8a21df6e40c0b3061b9a40a54ba","bits":8,"type":"plain"},{"id":3,"data":"803544c1dd74e71a71c1d7a9a2581b2bcec60d4ab1ecad728c1a7ce0ca29ea2bb869d79fa8375b3da8d3a09dc3c425fe6ae83b18bd5d36b7c157d6faecbd35d956708867c3137f7510e0b68db60b36afb1b868a077c450697d1d5cecea4fb0cb13a14064798230dc4a0804a99da5f548a974b2f0099db349775312804298526f786288555395136698894fe3b862a237954a1ad2dfe623158af88025ba8ee5c7f11bbcd5bc72e5c73377aa4d0b9f80866843ff0047c38acf6346748f083b523820b0a3e4e19c3215c29d6333ed01d27b040652e2839e9c25cf2a10bc3d02941cac1f2c07af2618793b7e7398fabefaa86f33c10120c359242b9d3782ae0d4425db0","bits":8,"type":"plain"}],"type":"plain"}');
  const ushareGroup2 = new ShareGroup.UShareGroup('{"shares":[{"id":2,"data":"802b49edb868a28d2433b5b4e0798d31e979ec3a837bba960448f021b5086ddb9d8843146f235e50f572eda1ef032bd406b2458972436a28a9cc306689a17b4694880510c6fb16cda6647efa12b06d77c8c4f0dd7b06dc35024d0fb55f1e0a6c92cd86792c666c0457792ee52e7a00a58d7c1b73ee0f2695e5097e5eea63ad07317b65f2fe448b71b5c00894a6deca1cfe0caafec5a73fa86809907a1da610e9a9da59b6a81ae73814920e663803c466e9776e23dd8c34ce43055030c9834b6cb4a167a4ba519d45665c41530de55dc87fa083beb4e19f6fc5a46c1fba950d9b897b2e69e9222bc8fd1fd080d202752c07af8d9daf21cb97e96207ed440b67e7233","bits":8,"type":"plain"},{"id":1,"data":"801e0d2c651c459755f2621d4221961a27bfe170329717e488528cc17f2187f025e1948bc714056d5da14d3c2cc70e2a6c5a7e91cf1e5c9f689be69c651c4e9fc2f88d7705e869b8b684c877a4bb5bd8797c987d0cc28c4c78805179b741bfe7853cc33d51d458881841284cb72ff0dd2608adf3e342912c907a6f7eaadbf9884fe9eb37aa919f172bd94057188c6f1b6d16b66c18611e7de0d1160fa158f33e5ff1e2531238042f25e5a36b35cc43c0870497739f7fbc2123e3269fc7e81f849201c2a059edad90a6e12480e79489a37de6d35c303f055a088e7a1381a79f972224052e42143191c5c1a1382ffc88046ecc4bdc89029423c4ef36afed0621e2ff8","bits":8,"type":"plain"}],"type":"plain"}');
  const eshareGroupJson = '{"shareGroups":[{"shares":[{"id":4,"data":"804ccbd9e8175025955b7d2571fbfff3daac008cfe7120627d95822e23ef32ba120f7dc00b984eec47144301a340beac40189d6b503cfedf853297b13c91c84d8c8130d8fb5c5d9ca2ed5141698d54959c3b96206a92ed18b4df27b4f69a27b6b9ec4c3adb05b5aff7ddbf7e76d4c52131298e9696b4349df260ce45d110d2e639e1743159565a4ed39d4cd0e4c2cc14195f9f41466bff48dacf91c627957b4003909b3f40db74ce29c2a15a6d4e68039f95bc05b073b08f2266e869b89c451f2a9940c8f9ec8fdb9f73244d0d6994390be7fd2167785895b08e2aefd0a1262008eb11210b6ee84e56de44b4abddc17b01b44bbe8a21df6e40c0b3061b9a40a54ba","bits":8,"type":"plain"},{"id":3,"data":"803544c1dd74e71a71c1d7a9a2581b2bcec60d4ab1ecad728c1a7ce0ca29ea2bb869d79fa8375b3da8d3a09dc3c425fe6ae83b18bd5d36b7c157d6faecbd35d956708867c3137f7510e0b68db60b36afb1b868a077c450697d1d5cecea4fb0cb13a14064798230dc4a0804a99da5f548a974b2f0099db349775312804298526f786288555395136698894fe3b862a237954a1ad2dfe623158af88025ba8ee5c7f11bbcd5bc72e5c73377aa4d0b9f80866843ff0047c38acf6346748f083b523820b0a3e4e19c3215c29d6333ed01d27b040652e2839e9c25cf2a10bc3d02941cac1f2c07af2618793b7e7398fabefaa86f33c10120c359242b9d3782ae0d4425db0","bits":8,"type":"plain"}],"type":"plain"},{"shares":[{"id":2,"data":"802b49edb868a28d2433b5b4e0798d31e979ec3a837bba960448f021b5086ddb9d8843146f235e50f572eda1ef032bd406b2458972436a28a9cc306689a17b4694880510c6fb16cda6647efa12b06d77c8c4f0dd7b06dc35024d0fb55f1e0a6c92cd86792c666c0457792ee52e7a00a58d7c1b73ee0f2695e5097e5eea63ad07317b65f2fe448b71b5c00894a6deca1cfe0caafec5a73fa86809907a1da610e9a9da59b6a81ae73814920e663803c466e9776e23dd8c34ce43055030c9834b6cb4a167a4ba519d45665c41530de55dc87fa083beb4e19f6fc5a46c1fba950d9b897b2e69e9222bc8fd1fd080d202752c07af8d9daf21cb97e96207ed440b67e7233","bits":8,"type":"plain"},{"id":1,"data":"801e0d2c651c459755f2621d4221961a27bfe170329717e488528cc17f2187f025e1948bc714056d5da14d3c2cc70e2a6c5a7e91cf1e5c9f689be69c651c4e9fc2f88d7705e869b8b684c877a4bb5bd8797c987d0cc28c4c78805179b741bfe7853cc33d51d458881841284cb72ff0dd2608adf3e342912c907a6f7eaadbf9884fe9eb37aa919f172bd94057188c6f1b6d16b66c18611e7de0d1160fa158f33e5ff1e2531238042f25e5a36b35cc43c0870497739f7fbc2123e3269fc7e81f849201c2a059edad90a6e12480e79489a37de6d35c303f055a088e7a1381a79f972224052e42143191c5c1a1382ffc88046ecc4bdc89029423c4ef36afed0621e2ff8","bits":8,"type":"plain"}],"type":"plain"}],"size":4,"quorum":3,"name":"Secret message","description":"OMG SO SECRET!"}';
  
  test("create from array works", () => {
    const sharepackage = new SharePackage.ESharePackage([ushareGroup1, ushareGroup2], 4, 3, "Test", "Test desc");
    expect(sharepackage.shareGroups[0]).toMatchObject(ushareGroup1);
    expect(sharepackage.shareGroups[1]).toMatchObject(ushareGroup2);
    expect(sharepackage.size).toBe(4);
    expect(sharepackage.quorum).toBe(3);
    expect(sharepackage.name).toBe("Test");
    expect(sharepackage.description).toBe("Test desc");
  });

  test("create from JSON works", () => {
    const sharepackage = new SharePackage.ESharePackage(eshareGroupJson);
    
    expect(sharepackage.shareGroups[0]).toMatchObject(ushareGroup1);
    expect(sharepackage.shareGroups[1]).toMatchObject(ushareGroup2);
    expect(sharepackage.size).toBe(4);
    expect(sharepackage.quorum).toBe(3);
    expect(sharepackage.name).toBe("Secret message");
    expect(sharepackage.description).toBe("OMG SO SECRET!");
  });
  
  test("canDecrypt() works", async () => {
    CryptoUtils.aesEncrypt = jest.fn((data, hash) => {return {data: "encrypteddata", iv: "aaaaaaaaa"}});
    CryptoUtils.aesDecrypt = jest.fn((ciphertext, hash, iv) => {return "801649ec44b6e582da82be0c281d8bc9708";});
    
    const sharepackage1 = new SharePackage.ESharePackage([ushareGroup1, ushareGroup2], 4, 3);
    expect(sharepackage1.canDecrypt()).toBe(true);
    
    const isharegroup = await ushareGroup1.invite("invitepass");
    const sharepackage2 = new SharePackage.ESharePackage([isharegroup, ushareGroup2], 4, 3);
    expect(sharepackage2.canDecrypt()).toBe(false);
  });
  
  test("decrypt() works", () => {
    const sharepackage1 = new SharePackage.ESharePackage(eshareGroupJson);
    const sharepackage2 = sharepackage1.decrypt();
    
    expect(sharepackage2).toBeInstanceOf(SharePackage.USharePackage);
    expect(sharepackage2.plaintext).toBe("Attack at dawn");
    expect(sharepackage2.name).toBe("Secret message");
    expect(sharepackage2.description).toBe("OMG SO SECRET!");
  });
});

describe("USharePackage", () => {
  test("create from data works", () => {
    const sharepackage = new SharePackage.USharePackage("Attack at dawn", "Secret message", "OMG SO SECRET!");
    
    expect(sharepackage.plaintext).toBe("Attack at dawn");
    expect(sharepackage.name).toBe("Secret message");
    expect(sharepackage.description).toBe("OMG SO SECRET!");
  });
  
  test("create from JSON works", () => {
    const ushareJSON = '{"plaintext":"Attack at dawn","name":"Secret message","description":"OMG SO SECRET!"}';
    const sharepackage = new SharePackage.USharePackage(ushareJSON);
    
    expect(sharepackage.plaintext).toBe("Attack at dawn");
    expect(sharepackage.name).toBe("Secret message");
    expect(sharepackage.description).toBe("OMG SO SECRET!");
  });
  
  test("encrypt() works", () => {
    const sharepackage = new SharePackage.USharePackage("Attack at dawn", "Secret message", "OMG SO SECRET!");
    const esharepackage = sharepackage.encrypt(2, 2);
    expect(esharepackage).toBeInstanceOf(SharePackage.ESharePackage);
  });
});

test("round trip works", () => {
  const sharepackage = new SharePackage.USharePackage("Attack at dawn", "Secret message", "OMG SO SECRET!");
  const esharepackage = sharepackage.encrypt(2, 2);
  
  const decrypted = esharepackage.decrypt();
  expect(decrypted.plaintext).toBe("Attack at dawn");
  expect(decrypted.name).toBe("Secret message");
  expect(decrypted.description).toBe("OMG SO SECRET!");
});
