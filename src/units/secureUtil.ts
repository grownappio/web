import CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Utf8.parse('1234567812345678'); // 十六位十六进制数作为密钥
// const iv = CryptoJS.enc.Utf8.parse('1234567812345678'); //十六位十六进制数作为密钥偏移量

/**
 * 请求数据加密
 *
 * @param {any} word 数据明文
 * @returns {string} ciphertext 数据密文
 */
export const encryptData = (word: any) => {
  let encrypted = CryptoJS.AES.encrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

/**
 * 返回数据解密
 *
 * @param {any} word 数据密文
 * @returns {string} plaintext 数据明文
 */
export const decodeData = (word: any) => {
  let decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
};
