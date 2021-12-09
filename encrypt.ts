import dotenv from 'dotenv';

dotenv.config();

import { AES, enc, mode, pad } from "crypto-js";

import transaction from './transaction';

const domain = process.env.DOMAIN || '';

const secretKey = process.env.SECRET_KEY || '';

const ivKey = process.env.IV_KEY || '';

function encryptData(data: Object, secretKey: string, ivKey: string) {
    const key = enc.Hex.parse(secretKey);

    const iv = enc.Hex.parse(ivKey);

    const encrypted = AES.encrypt(
        JSON.stringify(data),
        key,
        {
            mode: mode.CTR,
            iv,
            padding: pad.NoPadding
        }
    );

    const finalString = encrypted.ciphertext.toString(enc.Base64);

    const chars = Array.from(finalString);

    return replaceString(chars);
}

function replaceString(chars: string[]) {
    const arrayC = ["!", "*", "'", "(", ")", ";", ":", "@", "&", "=", "+", "$", ",", "/", "?", "#", "[", "]", ">", "<"];

    const arrayR: number[] = [];

    arrayC.forEach(element => {
        arrayR.push(element.charCodeAt(0));
    });

    for (let i = 0; i < chars.length; i++) {
        for (let j = 0; j < arrayC.length; j++) {
            const caracter = arrayC[j];
            if (caracter === chars[i]) {
                chars[i] = `-${arrayR[j]}-`;
            }
        }
    }

    return chars.join('');
}

const host = `${domain}/pagos/solicita`;

const _encryptData = encryptData(transaction, secretKey, ivKey);

console.info(`${host}?q=${_encryptData}`);
