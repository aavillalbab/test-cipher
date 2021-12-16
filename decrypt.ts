import dotenv from 'dotenv';
import dotenvExpand from "dotenv-expand";

const env = dotenv.config();

dotenvExpand(env);

import { AES, enc, mode, pad } from "crypto-js";

import cipherText from './cipherText';

const secretKey = process.env.SECRET_KEY!;

const ivKey = process.env.IV_KEY!;

function decryptData(cipherText: string, secretKey: string, ivKey: string) {
    const key = enc.Hex.parse(secretKey);

    const iv = enc.Hex.parse(ivKey);

    const decrypted = AES.decrypt(
        replaceCharacter(cipherText),
        key,
        {
            mode: mode.CTR,
            iv,
            padding: pad.NoPadding
        }
    );

    return JSON.parse(decrypted.toString(enc.Utf8));
}

const replaceCharacter = (cipherText: string) => cipherText.replace(
    /(\-[0-9][0-9]\-)/g,
    (match: string) => String.fromCharCode(parseInt(match.replace(/\-/g, ''), 10))
);


const _decryptData = decryptData(cipherText, secretKey, ivKey);

console.log(_decryptData);