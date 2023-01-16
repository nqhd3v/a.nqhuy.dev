import CryptoJS from 'crypto-js';

export type tDataNeedEncrypt = Record<string, any>;

export const encryptAES = (data: tDataNeedEncrypt, cipherText: string[]) => {
  return CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(JSON.stringify(data)),
    cipherText.join('+'),
    {
      format: CryptoJS.format.OpenSSL,
      
    }
  ).toString();
};
export const decryptAES = (encryptedStr: string, cipherText: string[]): { isError?: boolean; error?: string; data?: tDataNeedEncrypt } => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedStr, cipherText.join('+'), {
      format: CryptoJS.format.OpenSSL,
    });
    // Check bytes is a Word Array valid
    const utf8WordArrayString = CryptoJS.enc.Utf8.parse(bytes.toString()).toString(CryptoJS.enc.Utf8);
    if (utf8WordArrayString.toString() !== bytes.toString()) {
      return {
        isError: true,
        error: 'cipher.invalid-word-array',
      };
    }

    const jsonStr = bytes.toString(CryptoJS.enc.Utf8)
    if (!jsonStr) {
      return { isError: true, error: 'cipher.input-invalid' }
    }
    return { data: JSON.parse(jsonStr) };
  } catch (err) {
    console.error('Invalid input cause invalid JSON:', CryptoJS.AES.decrypt(encryptedStr, cipherText.join('+')), err);
    return { isError: true, error: 'cipher.invalid-word-array' };
  }
};
