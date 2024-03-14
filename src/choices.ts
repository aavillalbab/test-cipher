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

  if (portal) {
    let union: string;

    const encryptedTransaction = encryptData(data, secretKey, ivKey, true);

    const localPortal = portal!.split('#');

    if (localPortal.length === 2) {
      showData = `http://localhost:${localPortal[1]}/pagos/solicita?q=${encryptedTransaction}`;
    } else {
      if (portal!.split('.').length >= 3) union = '-';
      else union = '.';

      const host =
        portal !== 'pagosalud.bolivarconmigo.com'
          ? `https://${enviroment}-pagos${union}${portal}`
          : `https://${enviroment}${union}${portal}`;

      showData = `${host}/pagos/solicita?q=${encryptedTransaction}`;
    }
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
