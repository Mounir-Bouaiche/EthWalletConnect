import './App.css';
import { useEffect, useState } from 'react';
import Web3 from 'web3';

const ethereum = window.ethereum;

function App() {
  const [wallets, setWallets] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectMetamask = async () => {
    const p = ethereum.providers.find(e => e.isMetaMask);
    setProvider(p);
    localStorage.setItem('mounir&sohaib_provider', 'metamask')
  }


  const connectTrust = async () => {
    const p = ethereum.providers.find(e => e.isTrustWallet);
    setProvider(p);
    localStorage.setItem('mounir&sohaib_provider', 'trust')
  }

  const connectCoinbase = async () => {
    const p = ethereum.providers.find(e => e.isCoinbaseWallet);
    setProvider(p);
    localStorage.setItem('mounir&sohaib_provider', 'coinbase')
  }

  const disconnect = () => {
    setProvider(null);
    localStorage.removeItem('mounir&sohaib_provider')
  }

  // const init = async () => {
  //   const providerStr = localStorage.getItem('mounir&sohaib_provider');
  //   if (providerStr) {
  //     let provider;
  //     const providers = ethereum.providers;

  //     switch (providerStr) {
  //       case 'metamask': provider = providers.find(e => e.isMetaMask); break;
  //       case 'coinbase': provider = providers.find(e => e.isCoinbaseWallet); break;
  //       case 'trust': provider = providers.find(e => e.isTrustWallet); break;
  //       default: provider = null;
  //     }
  //     setProvider(provider);
  //   }

  // }

  useEffect(() => {
    (async function () {
      const w = await provider?.request({ method: 'eth_requestAccounts' })
      setWallets(w)
      console.log(w);
      const wei = await provider?.request({ method: 'eth_getBalance', params: [w[0], "latest"] })
      // const wei = 0x18000000000000000
      const b = parseFloat(wei, 16) * Math.pow(10, -18);
      console.log("Balance", b);
    })()

  }, [provider])

  useEffect(() => {
    const providerStr = localStorage.getItem('mounir&sohaib_provider');
    if (providerStr) {
      let provider;
      const providers = ethereum.providers;

      switch (providerStr) {
        case 'metamask': provider = providers.find(e => e.isMetaMask); break;
        case 'coinbase': provider = providers.find(e => e.isCoinbaseWallet); break;
        case 'trust': provider = providers.find(e => e.isTrustWallet); break;
        default: provider = null;
      }
      setProvider(provider);
    }
  }, [])

  return (
    <div className="App">
      <div className='wrapper'>
        <button onClick={connectMetamask}>Connect Metamask</button>
        <button onClick={connectTrust}>Connect Trust Wallet</button>
        <button onClick={connectCoinbase}>Connect Coinbase</button>
        <button onClick={disconnect}>Disconnect</button>
        {wallets ? <p>{wallets[0]}</p> : <p>Connect Wallet first !</p>}
      </div>
    </div>
  );
}

export default App;

const useProvider = () => {

}
