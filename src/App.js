// author : James
// date : 2022:9:23

import { useEffect, useState } from 'react';
import './App.css';
import { ethers } from 'ethers';
// Rinkeby testnet address
const contractAddress = "0xaee797ece8218ca90dc1312ec1c760ec7d169c75";

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [amount, setAmount] = useState(0.001);
  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }
  
  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const sendHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);

        const signer = provider.getSigner();
        const tx = {
            to: contractAddress,
            value: ethers.utils.parseEther(amount.toString(), 'ether')
        };
        const transaction = await signer.sendTransaction(tx);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const sendButton = () => {
    return (
      <button onClick={sendHandler} className='cta-button mint-nft-button'>
        Send ETH
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='main-app'>
      <h1>King Of Fools</h1>
      <div>
        {currentAccount ? sendButton() : connectWalletButton()}
      </div>
      <br />
      <div>
        {currentAccount ? <input value={amount} onChange={e => setAmount(e.target.value)}/> : ''}
      </div>
    </div>
  )
}

export default App;
