import dotenv from 'dotenv';
import dotenvExpand from "dotenv-expand";

const env = dotenv.config();

dotenvExpand(env);

import { AES, enc, mode, pad } from "crypto-js";

import transaction from './transaction';
import dataSended from './dataSended';

const domain = process.env.DOMAIN!;

const secretKey = process.env.SECRET_KEY!;

const ivKey = process.env.IV_KEY!;

const isPaymentLink = process.env.PAYMENT_LINK! === 'true';

const dataToEncrypt = isPaymentLink ? transaction : dataSended;

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

    const ciphertext = encrypted.ciphertext.toString(enc.Base64);

    // const chars = Array.from(finalString);
    // return replaceString(chars);

    if (isPaymentLink) return replaceSpecialCharacters(ciphertext);

    return ciphertext;
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

const replaceSpecialCharacters = (ciphertext: string) => ciphertext.replace(
    /[!*'();:@&=+$,\/?#\[\]<>]/g,
    (match: string) => `-${match.charCodeAt(0)}-`
);

const host = `${domain}/pagos/solicita`;

const _encryptData = encryptData(dataToEncrypt, secretKey, ivKey);

if (isPaymentLink) console.info(`${host}?q=${_encryptData}`);
else console.info(_encryptData);
