import { AES, enc, mode, pad } from 'crypto-js';

const encryptData = (
  data: Object,
  secretKey: string,
  ivKey: string,
  isPaymentLink = false
) => {
  const key = enc.Hex.parse(secretKey);

  const iv = enc.Hex.parse(ivKey);

  const encrypted = AES.encrypt(JSON.stringify(data), key, {
    mode: mode.CTR,
    iv,
    padding: pad.NoPadding
  });

  const ciphertext = encrypted.ciphertext.toString(enc.Base64);

  if (isPaymentLink) return replaceSpecialCharacters(ciphertext);

  return ciphertext;
};

const replaceSpecialCharacters = (ciphertext: string) =>
  ciphertext.replace(
    /[!*'();:@&=+$,\/?#\[\]<>]/g,
    (match: string) => `-${match.charCodeAt(0)}-`
  );

export { encryptData };
