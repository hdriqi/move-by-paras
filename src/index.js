import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import getConfig from './config.js';
import * as nearlib from 'near-api-js';

// Initializing contract
async function initContract() {
  window.nearConfig = getConfig(process.env.NODE_ENV || 'development')
  console.log("nearConfig", window.nearConfig);

  // Initializing connection to the NEAR DevNet.
  window.near = await nearlib.connect(Object.assign({ deps: { keyStore: new nearlib.keyStores.BrowserLocalStorageKeyStore() } }, window.nearConfig));

  // Needed to access wallet login
  window.walletAccount = new nearlib.WalletAccount(window.near);

  // Getting the Account ID. If unauthorized yet, it's just empty string.
  window.accountId = window.walletAccount.getAccountId();

  // Initializing our contract APIs by contract name and configuration.
  window.account = await new nearlib.Account(window.near.connection, window.accountId);
  window.contractParas = await new nearlib.Contract(window.account, 'contract-alpha.paras.testnet', {
    viewMethods: [
      'getUserById',
      'getMementoById'
    ],
    changeMethods: [
      'createMemento',
      'updateMemento',
      'deleteMemento',
      'createPost',
      'editPost',
      'deletePost',
      'redactPost',
      'createUser',
      'updateUser',
    ],
    sender: window.accountId
  });
}

window.nearInitPromise = initContract().then(() => {
  ReactDOM.render(<App contractParas={window.contractParas} wallet={window.walletAccount} account={window.account} />,
    document.getElementById('root')
  );
}).catch(console.error)