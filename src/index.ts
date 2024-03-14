import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { prompt } from 'inquirer';

import { choiceDecrypt, choiceEncrypt } from './choices';

import transaction from './data/transaction';
import dataSent from './data/dataSent';
import cipherText from './data/cipherText';

const env = dotenv.config();

dotenvExpand(env);

const SECRET_KEY = process.env.SECRET_KEY!;

const IV_KEY = process.env.IV_KEY!;

const ENVIRONMENTS = process.env
  .ENVIRONMENTS!.split(',')
  .map((name) => name.trim());

const PORTALS = process.env.PORTALS!.split(',');

const portalsNames = PORTALS.map((portal) => portal.split('|')[0].trim());

const portalsDomainsAndKeys = PORTALS.map((portal) =>
  portal.split('|')[1].trim()
).map((portal) => {
  const keyValue = portal.split(':');

  return { name: keyValue[0], secretKey: keyValue[1].trim() };
});

const TX = 'TX',
  DATA = 'Data',
  ENCRYPT = 'Encrypt',
  DECRYPT = 'Decrypt';

const selectPortal = async () => {
  const selected = await prompt({
    type: 'list',
    name: 'portal',
    message: 'Select portal',
    choices: portalsNames
  });

  const index = portalsNames.indexOf(selected.portal);

  return portalsDomainsAndKeys[index];
};

const selectEnvironment = async () => {
  const selected = await prompt({
    type: 'list',
    name: 'environment',
    message: 'Select environment',
    choices: ENVIRONMENTS
  });

  return selected.environment as string;
};

const selectTXOrData = async (encrypt: boolean) => {
  const response = await prompt({
    type: 'list',
    name: 'choice',
    message: `What do you want to ${encrypt ? 'encrypt' : 'decrypt'}?`,
    choices: [TX, DATA]
  });

  return response.choice as string;
};

const main = async () => {
  const response = await prompt({
    type: 'list',
    name: 'choice',
    message: 'What would you like to do?',
    choices: [ENCRYPT, DECRYPT]
  });

  const choice = await selectTXOrData(response.choice === ENCRYPT);

  if (response.choice === ENCRYPT) {
    if (choice === DATA) {
      await choiceEncrypt(dataSent, IV_KEY, SECRET_KEY);
    }

    if (choice === TX) {
      const portal = await selectPortal();
      const localPortal = portal.name.split('#');

      let environment: string = '';

      if (localPortal.length === 1) environment = await selectEnvironment();

      await choiceEncrypt(
        transaction,
        IV_KEY,
        portal.secretKey,
        portal.name,
        environment
      );
    }
  }

  if (response.choice === DECRYPT) {
    if (choice === DATA) {
      await choiceDecrypt(cipherText, IV_KEY, SECRET_KEY);
    }

    if (choice === TX) {
      const portal = await selectPortal();
      await choiceDecrypt(cipherText, IV_KEY, portal.secretKey);
    }
  }
};

main().catch(console.error)
