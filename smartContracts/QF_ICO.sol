// QuantumCoin($QF) ICO Demo

//compiler version
pragma solidity ^0.4.26;


// ICO Contract
contract quantumcoin_ico {
    // Sets the maximum quantity of $QF available for sale.
    uint public maximum_QF = 1000000;

    // Returns the exchange rate $USD:$QF
    uint public USD_QF = 1000;

    // Sets the total number of QF that have been bought in the ICO contract
    uint public total_QF_bought = 0;

    // Mapping from the wallet address to $QF:$USD balance
    mapping(address => uint) balance_QF;
    mapping(address => uint) balance_USD;


    // Checks to see if a wallet has the funds available to buy QF
    modifier can_buy_QF(uint amount_USD) {
        require (amount_USD * USD_QF + total_QF_bought <= maximum_QF);
        _;
    }


    // Gets the balance in QF of a wallet
    function balance_in_QF(address wallet) external constant returns(uint) {
        return balance_QF[wallet];
    }


    // Gets the balance in USD of a wallet
    function balance_in_USD(address wallet) external constant returns(uint) {
        return balance_USD[wallet];
    }


    // Buying QF
    function buy_QF(address wallet, uint amount_USD) external 
    can_buy_QF(amount_USD) {
        uint QF_bought = amount_USD * USD_QF;
        balance_QF[wallet] += QF_bought;
        balance_USD[wallet] = balance_QF[wallet] / 1000;
        total_QF_bought += QF_bought;
    }


    // Selling QF
    function sell_QF(address wallet, uint amount_QF) external {
        balance_QF[wallet] -= amount_QF;
        balance_USD[wallet] = balance_QF[wallet] / 1000;
        total_QF_bought -= amount_QF;
    }
}
