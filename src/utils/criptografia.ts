import CryptoJS from 'crypto-js';
import config from './config';

const secretKey = config.SECRET_KEY_CRIPT;

const encrypt = (token:string) => {
  return CryptoJS.AES.encrypt(token, secretKey).toString();
};

const decrypt = (encryptedToken:string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export { encrypt, decrypt };
