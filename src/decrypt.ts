import { AES, enc, mode, pad } from 'crypto-js';

const decryptData = (cipherText: string, secretKey: string, ivKey: string) => {
  const key = enc.Hex.parse(secretKey);

  const iv = enc.Hex.parse(ivKey);

  const decrypted = AES.decrypt(replaceCharacter(cipherText), key, {
    mode: mode.CTR,
    iv,
    padding: pad.NoPadding
  });

  return JSON.parse(decrypted.toString(enc.Utf8));
};

const replaceCharacter = (cipherText: string) =>
  cipherText.replace(/(\-[0-9][0-9]\-)/g, (match: string) =>
    String.fromCharCode(parseInt(match.replace(/\-/g, ''), 10))
  );

export { decryptData };
