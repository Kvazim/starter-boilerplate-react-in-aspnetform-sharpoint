import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { Cpass } from 'cpass';
import RestProxy from 'sp-rest-proxy';

const rl = readline.createInterface({ input, output });
const cpass = new Cpass();
const password_regexp = /^[а-яА-ЯёЁa-zA-Z0-9!@#$%^&*()_+={[}\]|:;"'<>,.?/~`\-]*$/;

const getHiddenInput = (question) => {
  return new Promise((resolve) => {
    input.resume();
    output.write(question);
    input.setRawMode(true);
    let password = '';

    input.on('keypress', (str, key) => {
      if (key.name === 'return') {
        resolve(password);
        input.setRawMode(false);
      } else if (key.name === 'backspace') {
        password = password.slice(0, -1);
        output.clearLine();
        output.cursorTo(0);
        output.write(question + password.replace(/./g, '*'));
      } else if (password_regexp.test(key.name)) {
        password += str;
        output.clearLine();
        output.cursorTo(0);
        output.write(question + password.replace(/./g, '*'));
      }
    });
  });
};

const createEnvConfig = async () => {
  const username = await rl.question('Username: ');
  const password = cpass.encode(await getHiddenInput('Password: '));

  process.env['SPAUTH_USERNAME'] = username;
  process.env['SPAUTH_PASSWORD'] = password;
  process.env['SPAUTH_SITEURL'] = ''; // адрес SharPoint server
  process.env['SPAUTH_STRATEGY'] = 'OnpremiseUserCredentials'; // стратегия авторизации на сервере
  process.env['SPAUTH_DOMAIN'] = ''; // домен сервера

  rl.close();
  return true;
};

const createServer = () => {
  const settings = {
    protocol: 'http',
    authConfigSettings: {
      saveConfigOnDisk: false,
      headlessMode: true,
    },
    hostname: 'localhost',
    port: 8080,
  };

  const restProxy = new RestProxy(settings);

  restProxy.serve();
};

createEnvConfig().then((res) => {
  if (res) {
    createServer();
  }
});
