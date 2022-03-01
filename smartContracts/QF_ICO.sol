// QuantumCoin($QF) ICO Demo

//version of compiler
pragma solidity ^0.4.26;


// ICO Contract
contract quantumcoin_ico {
    // Set the maximum quantity of $QF available for sale.
    uint public maximum_QF = 1000000;

    // Exchange rate $USD:$QF
    uint public USD_QF = 1000;

    // Set the total number of QF that have been bought in the ICO contract
    uint public total_QF_bought = 0;

    // Map from the wallet address to $QF:$USD balance
    mapping(address => uint) balance_QF;
    mapping(address => uint) balance_USD;


    // Check to see if a wallet able to buy QF
    modifier can_buy_QF(uint amount_USD) {
        require (amount_USD * USD_QF + total_QF_bought <= maximum_QF);
        _;
    }


    // Get the balance in QF of a wallet
    function balance_in_QF(address wallet) external constant returns(uint) {
        return balance_QF[wallet];
    }


    // Get the balance in USD of a wallet
    function balance_in_USD(address wallet) external constant returns(uint) {
        return balance_USD[wallet];
    }


    // Buy QF
    function buy_QF(address wallet, uint amount_USD) external 
    can_buy_QF(amount_USD) {
        uint QF_bought = amount_USD * USD_QF;
        balance_QF[wallet] += QF_bought;
        balance_USD[wallet] = balance_QF[wallet] / 1000;
        total_QF_bought += QF_bought;
    }


    // Sell QF
    function sell_QF(address wallet, uint amount_QF) external {
        balance_QF[wallet] -= amount_QF;
        balance_USD[wallet] = balance_QF[wallet] / 1000;
        total_QF_bought -= amount_QF;
    }
}
