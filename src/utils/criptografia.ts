// utils/cryptoUtils.js
import CryptoJS from 'crypto-js';

const secretKey = 'ajdpe8fj@k5l@$%çad2983743%$¨$$çl7kfja#DFVZCvm4sdçfakmc,açjdkfaupeoijm,mzç65ldkfj6';

const encrypt = (token:string) => {
  return CryptoJS.AES.encrypt(token, secretKey).toString();
};

const decrypt = (encryptedToken:string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export { encrypt, decrypt };
