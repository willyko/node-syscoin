var path = require('path');
require.paths.unshift(path.join(__dirname, '..'));

// test variables

var test = {
    account: "test"
}

// end test variables

var vows = require('vows'),
    assert = require('assert');

var bitcoin = require('lib/bitcoin');

function makeClient() {
  return new bitcoin.Client('localhost', 8332, 'jb55', 'thisisthepassword');
}

function notEmpty(data) {
  if (data === 0)
    return;
  assert.ok(data);
}

vows.describe('api').addBatch({
  '': {
    topic: makeClient,
    'an account address': {
      topic: function(client){
        client.getAccountAddress(test.account, this.callback);
      },
      'is valid': function(address){
        assert.ok(address);
      },
      'after getting the account name again': {
        topic: function(address, client) {
          client.getAccount(address, this.callback);
        },
        'should be the same as the original': function(account) {
          assert.equal(account, test.account);
        }
      },
    },
    'listTransactions with specific amount': {
      topic: function(client){
        client.listTransactions(test.account, 15, this.callback);
      },
      'should not be empty': function(txs){ assert.ok(txs); },
      'is an array': function(txs) { assert.isTrue(txs instanceof Array); }
    },
    'listTransactions without specific amount': {
      topic: function(client){
        client.listTransactions(test.account, this.callback);
      },
      'should not be empty': function(txs){ assert.ok(txs); },
      'is an array': function(txs) { assert.isTrue(txs instanceof Array); }
    },
    'account addresses': {
      topic: function(client){
        client.getAddressesByAccount(test.account, this.callback);
      },
      'is not empty': function(addresses) {
        assert.isTrue(addresses && addresses.length > 0);
      }
    },
    'getDifficulty': {
      topic: function(client) { client.getDifficulty(this.callback); },
      'should not be empty': notEmpty,
      'is a number': function (data) {
        assert.isNumber(data);
      },
      'is greater than 0': function (data) { assert.isTrue(data > 0); }
    },
    'getInfo': {
      topic: function(client) { client.getInfo(this.callback); },
      'should not be empty': notEmpty,
      'info.errors should be empty': function (info) {
        assert.isEmpty(info.errors);
      },
    },
    'getHashesPerSec': {
      topic: function(client) { client.getHashesPerSec(this.callback); },
      'should not be empty': notEmpty,
      'is a number': function (data) { assert.isNumber(data) },
    },
    'help': {
      topic: function(client) { client.help(this.callback); },
      'should not be empty': notEmpty,
    },
    'getWork': {
      topic: function(client) { client.getWork(this.callback); },
      'should not be empty': notEmpty,
    },
    'getTransaction': {
      topic: "TODO: get valid transaction",
      'should not be empty': notEmpty,
    },
  },

}).export(module);

