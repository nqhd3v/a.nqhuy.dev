import CryptoJS from 'crypto-js';

export type tDataNeedEncrypt = string | string[] | number | number[] | Record<string, any>;

export const encryptAES = (data: tDataNeedEncrypt, cipherText: string[]) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), cipherText.join('+')).toString();
};
export const decryptAES = (encryptedStr: string, cipherText: string[]): { isError?: boolean; error?: string; data?: tDataNeedEncrypt } => {
  try {
    console.log(encryptedStr, cipherText);
    const bytes = CryptoJS.AES.decrypt(encryptedStr, cipherText.join('+'));
    // Check bytes is a Word Array valid
    const utf8WordArrayString = CryptoJS.enc.Utf8.parse(bytes.toString()).toString(CryptoJS.enc.Utf8);
    console.log(bytes.toString(), utf8WordArrayString);
    if (utf8WordArrayString !== bytes.toString()) {
      return {
        isError: true,
        error: 'cipher.invalid-world-array',
      };
    }

    const jsonStr = bytes.toString(CryptoJS.enc.Utf8)
    if (!jsonStr) {
      return { isError: true, error: 'cipher.input-invalid' }
    }
    console.log(jsonStr);
    return { data: JSON.parse(jsonStr) };
  } catch (err) {
    console.error('Unknown error when decrypt encrypted-string:', CryptoJS.AES.decrypt(encryptedStr, cipherText.join('+')), err);
    return { isError: true, error: 'cipher.unknown' };
  }
};
