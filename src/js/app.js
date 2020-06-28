App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  tokenPrice: 1000000000000000,
  tokensSold: 0,
  tokensAvailable: 69000,

// const ethereumButton = document.querySelector('.enableEthereumButton');



// ethereumButton.addEventListener('click', () => {
//   getAccount();
// });

// async function getAccount() {
//   accounts = await ethereum.enable();
// }


  init: function() {
    console.log("App initialized...")
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function() {
    $.getJSON("PeeTokenSale.json", function(peeTokenSale) {
      App.contracts.PeeTokenSale = TruffleContract(peeTokenSale);
      App.contracts.PeeTokenSale.setProvider(App.web3Provider);
      App.contracts.PeeTokenSale.deployed().then(function(peeTokenSale) {
        console.log("Pee Token Sale Address:", peeTokenSale.address);
      });
    }).done(function() {
      $.getJSON("PeeToken.json", function(peeToken) {
        App.contracts.PeeToken = TruffleContract(peeToken);
        App.contracts.PeeToken.setProvider(App.web3Provider);
        App.contracts.PeeToken.deployed().then(function(peeToken) {
          console.log("Pee Token Address:", peeToken.address);
        });

        App.listenForEvents();
        return App.render();
      });
    })
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.PeeTokenSale.deployed().then(function(instance) {
      instance.Sell({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("event triggered", event);
        App.render();
      })
    })
  },

  render: function() {
    if (App.loading) {
      return;
    }
    App.loading = true;

    var loader  = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        console.log("account", account);
        App.account = account;
        $('#accountAddress').html("Your Account: " + account);
      }
    })

    // Load token sale contract
    App.contracts.PeeTokenSale.deployed().then(function(instance) {
      PeeTokenSaleInstance = instance;
      return PeeTokenSaleInstance.tokenPrice();
    }).then(function(tokenPrice) {
      App.tokenPrice = tokenPrice;
      $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
      return PeeTokenSaleInstance.tokensSold();
    }).then(function(tokensSold) {
      App.tokensSold = tokensSold.toNumber();
      $('.tokens-sold').html(App.tokensSold);
      $('.tokens-available').html(App.tokensAvailable);

      var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
      $('#progress').css('width', progressPercent + '%');

      async function enableUser() {
        const accounts = await ethereum.enable();
        const account = accounts[0];
        App.account = account;
        loadContracts();
      }
      const ethereumButton = document.querySelector('.enableEthereumButton');

      ethereumButton.addEventListener('click', () => {
      //Will Start the metamask extension
        ethereum.enable();
      });
      async function loadContracts() {
        App.contracts.peeToken.deployed().then(function(instance) {
          console.log("Instance: ", instance);
          peeTokenInstance = instance;
          console.log("Account: ", App.account);
          return peeTokenInstance.balanceOf(App.account);
        });
      }



      // Load token contract
      App.contracts.PeeToken.deployed().then(function(instance) {
        peeTokenInstance = instance;
        return peeTokenInstance.balanceOf(App.account);
      }).then(function(balance) {
        $('.pee-balance').html(balance.toNumber());
        App.loading = false;
        loader.hide();
        content.show();
      })
    });
  },

  buyTokens: function() {
    $('#content').hide();
    $('#loader').show();
    var numberOfTokens = $('#numberOfTokens').val();
    App.contracts.PeeTokenSale.deployed().then(function(instance) {
      return instance.buyTokens(numberOfTokens, {
        from: App.account,
        value: numberOfTokens * App.tokenPrice,
        gas: 500000 // Gas limit
      });
    }).then(function(result) {
      console.log("Tokens bought...")
      $('form').trigger('reset') // reset number of tokens in form
      // Wait for Sell event
      $('#loader').hide();
    });
  }
}

$(function() {
  $(window).load(function() {
    App.init();
  })
});