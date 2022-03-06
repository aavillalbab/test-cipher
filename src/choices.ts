import { decryptData } from './decrypt';
import { encryptData } from './encrypt';

const choiceEncrypt = async (
  data: Object,
  ivKey: string,
  secretKey: string,
  portal?: string,
  enviroment?: string
) => {
  let showData: string;

  if (portal && enviroment) {
    let union: string;

    if (portal!.split('.').length >= 2) union = '-';
    else union = '.';

    const encryptedTransaction = encryptData(data, secretKey, ivKey, true);

    const host = `https://${enviroment}-pagos${union}${portal}.com`;

    showData = `${host}/pagos/solicita?q=${encryptedTransaction}`;
  } else {
    showData = encryptData(data, secretKey, ivKey, false);
  }

  console.log(showData);
};

const choiceDecrypt = async (
  cipherText: string,
  ivKey: string,
  secretKey: string
) => {
  let decryptedData: string;

  decryptedData = decryptData(cipherText, secretKey, ivKey);

  console.log(decryptedData);
};

export { choiceDecrypt, choiceEncrypt };
