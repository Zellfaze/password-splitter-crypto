import Shares from '../Shares.js';
import ShareGroup from '../ShareGroup.js'; 
import SharePackage from '../SharePackage.js';
import CryptoUtils from '../CryptoUtils.js';

describe("ESharePackage", () => {
  const eoptions = {dbid: "8f5d59f9-e399-4b8c-8ade-c99a83b8ae90", size: 4, quorum: 3, name: "Secret message", description: "OMG SO SECRET!"};
  const ushareGroup1 = new ShareGroup.UShareGroup('{"dbid":"aa97725f-d702-49a3-859c-bbd8bf3f2d51","shares":[{"id":4,"dbid":"b13ee771-f405-4233-96a4-1374d6222739","data":"804976464391565ec2ef1b29130ba2bb4e8ff96b6e11e7f753689a48b7c77aa7ae56848aa974dc628afb65819383db962a37a83a1f938a389730802a85147604accfa62fda5a6e2180bc30c3d26075cc95ee5fbfd70747e2456ddceec19f08fb33c912a1650b85a3a17a15a1ee354c230609b31331ce586c0515c656594caed7396d74c8a199027363fd53e0b45ca454f1252a0e5d5c1e0fe75813beb602bf860d29d4a09ddf366449954deef29addcafd01119a0fe495e1fdd94ee8c12bb262ca48354dc645ce0f0150ccf53a576fbec53acbc94336e2ece5d317bc9648710e5d7e22fa580aeff4652050235108c82842cb1c52eb329074e8f76204f50a82c3ed7","bits":8,"type":"plain"},{"id":3,"dbid":"ab6eb745-c861-4d16-9180-a733c31b3794","data":"8031cf659bfadcf661ac7368476d42102c13a06da0d55444765e830c13c273ac05c8b260c7882a8e3ec8f276ecff2a1e815e2766c2a3772400123c4e49d42aca44539b2c75350afc995cdcc11e3bb43929b96fb456bbc12e25b4dace331dec94339d69a541ed9fa057398793218c1ba32034046d2c817b6ee24a83c675545085308264da4588663b770946a54996624486da8556d32e43c5d47488b39e33194c034bcfa7af110eea77cb6b45b7706d9733a68b67fc6fdc14779782b4fc016295c3fb7ee13985e7f97183cae5fe7f19fbae443377b3a1a4e51dc5e111fe0fe1cc947f7568e892b1e418b914b95e2e48d4e7bf58f1d5bd55b4a3d25dcebbe7110d3e5","bits":8,"type":"plain"}],"type":"plain"}');
  const ushareGroup2 = new ShareGroup.UShareGroup('{"dbid":"90dae144-6393-4be7-90ee-bd032f3f4377","shares":[{"id":2,"dbid":"c344d7c0-d7fb-43fa-ad2e-2b896b58aec9","data":"802862fcb1cd0809ca82fe54b400ed7a7cf6c1dbd2e1a858659705999fcdd3fbf8ab7851708e04c56a31feedf01a814553559d0c31efed0903de60af399573ee7c7332d948e024eb84824d54357a409891332084c5c4f9f3faefde04084df044533ed891a61d7e503bb8d53ff21039a91ca934ef6ab8192f71b3cd760c2141f9bacc10298cdaf539e705d684599206de23d3d5ea6a4cd49d4979c8bd7e7766a6e5ad047a86fef528d76470de618fe36b9e0dbc35406137a5f71efea7e6035577a3dddb1b7d7cb9c6de3f42245cb2838535da02684927666b35e9cf58be70617f7c88fc09362254d611426a09fbaf5257e9db6caac0d239e06de3996b7c88e64c2c6","bits":8,"type":"plain"},{"id":1,"dbid":"3f36027f-6f8d-494f-abae-7d2497a83a22","data":"8019ad992a37d4ffab2e8d3cf36daf6a50e561b67234fc1c13c986958c0fa057fd63ca31b7062e4b54f90c9b1ce5ab5bd20bba6af34c9a2d03cc5ce1704159243820a9f53dd52e171dde91952b41f4a1b88a4f30937f38cdd88b06ea3940199064f3b414e3c0e5a069b150acd76c273a3e9d34f242e966b191d94d107b55179c8cbe7263ce129402969c9701163463aaa35956fcbb4295989f2d465ee63479fae1d6cced2fbffd12a2af1cdbd0af89dcab9b3102b93ee99183297e331c5231326636a31a46d95cffad9c8e21a5bd9c6e9dde331ffdc6c49e2a2c28f9464f86a3efb78e21daa0e7120a5b7c90a2c11d030834331b138f6ac4c821c265c06ff561158","bits":8,"type":"plain"}],"type":"plain"}');
  const eshareGroupJson = '{"shareGroups":[{"dbid":"aa97725f-d702-49a3-859c-bbd8bf3f2d51","shares":[{"id":4,"dbid":"b13ee771-f405-4233-96a4-1374d6222739","data":"804976464391565ec2ef1b29130ba2bb4e8ff96b6e11e7f753689a48b7c77aa7ae56848aa974dc628afb65819383db962a37a83a1f938a389730802a85147604accfa62fda5a6e2180bc30c3d26075cc95ee5fbfd70747e2456ddceec19f08fb33c912a1650b85a3a17a15a1ee354c230609b31331ce586c0515c656594caed7396d74c8a199027363fd53e0b45ca454f1252a0e5d5c1e0fe75813beb602bf860d29d4a09ddf366449954deef29addcafd01119a0fe495e1fdd94ee8c12bb262ca48354dc645ce0f0150ccf53a576fbec53acbc94336e2ece5d317bc9648710e5d7e22fa580aeff4652050235108c82842cb1c52eb329074e8f76204f50a82c3ed7","bits":8,"type":"plain"},{"id":3,"dbid":"ab6eb745-c861-4d16-9180-a733c31b3794","data":"8031cf659bfadcf661ac7368476d42102c13a06da0d55444765e830c13c273ac05c8b260c7882a8e3ec8f276ecff2a1e815e2766c2a3772400123c4e49d42aca44539b2c75350afc995cdcc11e3bb43929b96fb456bbc12e25b4dace331dec94339d69a541ed9fa057398793218c1ba32034046d2c817b6ee24a83c675545085308264da4588663b770946a54996624486da8556d32e43c5d47488b39e33194c034bcfa7af110eea77cb6b45b7706d9733a68b67fc6fdc14779782b4fc016295c3fb7ee13985e7f97183cae5fe7f19fbae443377b3a1a4e51dc5e111fe0fe1cc947f7568e892b1e418b914b95e2e48d4e7bf58f1d5bd55b4a3d25dcebbe7110d3e5","bits":8,"type":"plain"}],"type":"plain"},{"dbid":"90dae144-6393-4be7-90ee-bd032f3f4377","shares":[{"id":2,"dbid":"c344d7c0-d7fb-43fa-ad2e-2b896b58aec9","data":"802862fcb1cd0809ca82fe54b400ed7a7cf6c1dbd2e1a858659705999fcdd3fbf8ab7851708e04c56a31feedf01a814553559d0c31efed0903de60af399573ee7c7332d948e024eb84824d54357a409891332084c5c4f9f3faefde04084df044533ed891a61d7e503bb8d53ff21039a91ca934ef6ab8192f71b3cd760c2141f9bacc10298cdaf539e705d684599206de23d3d5ea6a4cd49d4979c8bd7e7766a6e5ad047a86fef528d76470de618fe36b9e0dbc35406137a5f71efea7e6035577a3dddb1b7d7cb9c6de3f42245cb2838535da02684927666b35e9cf58be70617f7c88fc09362254d611426a09fbaf5257e9db6caac0d239e06de3996b7c88e64c2c6","bits":8,"type":"plain"},{"id":1,"dbid":"3f36027f-6f8d-494f-abae-7d2497a83a22","data":"8019ad992a37d4ffab2e8d3cf36daf6a50e561b67234fc1c13c986958c0fa057fd63ca31b7062e4b54f90c9b1ce5ab5bd20bba6af34c9a2d03cc5ce1704159243820a9f53dd52e171dde91952b41f4a1b88a4f30937f38cdd88b06ea3940199064f3b414e3c0e5a069b150acd76c273a3e9d34f242e966b191d94d107b55179c8cbe7263ce129402969c9701163463aaa35956fcbb4295989f2d465ee63479fae1d6cced2fbffd12a2af1cdbd0af89dcab9b3102b93ee99183297e331c5231326636a31a46d95cffad9c8e21a5bd9c6e9dde331ffdc6c49e2a2c28f9464f86a3efb78e21daa0e7120a5b7c90a2c11d030834331b138f6ac4c821c265c06ff561158","bits":8,"type":"plain"}],"type":"plain"}],"dbid":"8f5d59f9-e399-4b8c-8ade-c99a83b8ae90","size":4,"quorum":3,"name":"Secret message","description":"OMG SO SECRET!"}';
  
  test("create from array works", () => {
    const sharepackage = new SharePackage.ESharePackage([ushareGroup1, ushareGroup2], eoptions);
    expect(sharepackage.shareGroups[0]).toMatchObject(ushareGroup1);
    expect(sharepackage.shareGroups[1]).toMatchObject(ushareGroup2);
    expect(sharepackage.size).toBe(4);
    expect(sharepackage.quorum).toBe(3);
    expect(sharepackage.name).toBe("Secret message");
    expect(sharepackage.description).toBe("OMG SO SECRET!");
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
    
    const sharepackage1 = new SharePackage.ESharePackage([ushareGroup1, ushareGroup2], eoptions);
    expect(sharepackage1.canDecrypt()).toBe(true);
    
    const isharegroup = await ushareGroup1.invite("invitepass");
    const sharepackage2 = new SharePackage.ESharePackage([isharegroup, ushareGroup2], eoptions);
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
  const uoptions = {name: "Secret message", description: "OMG SO SECRET!"};
  test("create from data works", () => {
    const sharepackage = new SharePackage.USharePackage("Attack at dawn", uoptions);
    
    expect(sharepackage.plaintext).toBe("Attack at dawn");
    expect(sharepackage.name).toBe("Secret message");
    expect(sharepackage.description).toBe("OMG SO SECRET!");
  });
  
  test("create from JSON works", () => {
    const ushareJSON = '{"plaintext":"Attack at dawn","dbid":"8f5d59f9-e399-4b8c-8ade-c99a83b8ae90","name":"Secret message","description":"OMG SO SECRET!"}';
    const sharepackage = new SharePackage.USharePackage(ushareJSON);
    
    expect(sharepackage.plaintext).toBe("Attack at dawn");
    expect(sharepackage.name).toBe("Secret message");
    expect(sharepackage.description).toBe("OMG SO SECRET!");
  });
  
  test("encrypt() works", () => {
    const sharepackage = new SharePackage.USharePackage("Attack at dawn", uoptions);
    const esharepackage = sharepackage.encrypt(2, 2);
    expect(esharepackage).toBeInstanceOf(SharePackage.ESharePackage);
  });
});

test("round trip works", () => {
  const uoptions = {name: "Secret message", description: "OMG SO SECRET!"};
  const sharepackage = new SharePackage.USharePackage("Attack at dawn", uoptions);
  const esharepackage = sharepackage.encrypt(2, 2);
  
  const decrypted = esharepackage.decrypt();
  expect(decrypted.plaintext).toBe("Attack at dawn");
  expect(decrypted.name).toBe("Secret message");
  expect(decrypted.description).toBe("OMG SO SECRET!");
});
