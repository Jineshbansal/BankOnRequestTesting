'use client'


import Navbar from '../components/Navbar';
import { providers,utils } from "ethers";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { Types, Utils } from "@requestnetwork/request-client.js";
import { RequestNetwork,PaymentReferenceCalculator } from "@requestnetwork/request-client.js"

import { hasSufficientFunds } from "@requestnetwork/payment-processor";
import { approveErc20, hasErc20Approval } from "@requestnetwork/payment-processor";
import { payRequest } from "@requestnetwork/payment-processor";



export default function Home() {

  const createRequest = async () => {
    if (window.ethereum) {
      const provider = new providers.Web3Provider(window.ethereum);
      console.log("provider", provider);
      const accounts = await provider.send("eth_accounts", []);
      console.log("Accounts:", accounts);

      const signer = provider.getSigner();
      console.log('Signer:', signer);
    

      const web3SignatureProvider = new Web3SignatureProvider(provider.provider);
      console.log("Web3SignatureProvider initialized:", web3SignatureProvider);
      
      
      const requestClient=new RequestNetwork({
        nodeConnectionConfig: { 
          baseURL: "https://gnosis.gateway.request.network/",
        },
        signatureProvider: web3SignatureProvider,
      })
      console.log("request Client:",requestClient);
      console.log("request create parameters",requestCreateParameters);
      const request = await requestClient.createRequest(requestCreateParameters);

      const confirmedRequestData = await request.waitForConfirmation();
      console.log("confirmed Request Data:",confirmedRequestData);
      alert('Wallet connected successfully!');
    } else {
      console.error('Ethereum provider (window.ethereum) is not available. Please install MetaMask.');
    }
  };
  const payRequestment = async () => {
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: { 
        baseURL: "https://gnosis.gateway.request.network/",
      }
    });
    const request = await requestClient.fromRequestId(
      '01cdd1ca3415421fdd3c42630f1ed94e7fb358b78acbad5cb18a14be6de488f2f3'
    );
    const requestData = request.getData();
    console.log("request data ",requestData);
    let provider = new providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log("provider:",provider);
    const payerAddress='0x08aDb9CC0658Bb91F57707B7B4D016312EF8c70a';
    console.log("payerAddress: ",payerAddress);
    try{
      // const _hasSufficientFunds = await hasSufficientFunds(
      //   requestData,
      //   payerAddress,
      //   {
      //     provider: provider,
      //   },
      // );
      // console.log("_hassufficientFunds ",_hasSufficientFunds);
      const _hasErc20Approval = await hasErc20Approval(
        requestData,
        payerAddress,
        provider,
      );
      console.log("ERc20 Approval: ",_hasErc20Approval);
      if (!_hasErc20Approval) {
        const approvalTx = await approveErc20(requestData, signer);
        await approvalTx.wait(2);
      }
      // const paymentTx = await payRequest(requestData, signer);
      // await paymentTx.wait(2);
      // console.log("paymentTx: ",paymentTx);
      // const request2 = await requestClient.fromRequestId(requestData.requestId);
      // let requestData2 = request2.getData();
      // console.log("balance: ",requestData2.balance);
      // console.log("expected amount:",requestData2.expectedAmount);
    }
    catch(e){
      console.error(e);
    }
    // console.log("_hassufficientFunds ",_hasSufficientFunds);
    
  };

  const payeeIdentity = '0x213064b9f671Bbe8b94C98283AE4D12CAB8E4f4C';
  const payerIdentity = '0x39F21A5DF174283Ba7554D61c7702dB32d9A4E67';
  const paymentRecipient = payeeIdentity;
  const feeRecipient = '0x0000000000000000000000000000000000010021';
  const requestCreateParameters = 
  {
    requestInfo: {
      
      // The currency in which the request is denominated
      currency: {
        type: Types.RequestLogic.CURRENCY.ERC20,
        value:'0x1d87Fc9829d03a56bdb5ba816C2603757f592D82',
        network: 'sepolia',
      },
      
      // The expected amount as a string, in parsed units, respecting `decimals`
      // Consider using `parseUnits()` from ethers or viem
      expectedAmount: '1011',
      
      // The payee identity. Not necessarily the same as the payment recipient.
      payee: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payeeIdentity,
      },
      
      // The payer identity. If omitted, any identity can pay the request.
      payer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payerIdentity,
      },
      
      // The request creation timestamp.
      timestamp: Utils.getCurrentTimestampInSecond(),
    },
    
    // The paymentNetwork is the method of payment and related details.
    paymentNetwork: {
      id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
      parameters: {
        paymentNetworkName: 'sepolia',
        paymentAddress: payeeIdentity,
        feeAddress: feeRecipient,  
        feeAmount: '0',
      },
    },
    
    // The contentData can contain anything.
    // Consider using rnf_invoice format from @requestnetwork/data-format
    contentData: {
      reason: '🍕JineshJainBansal',
      dueDate: '2023.06.16',
    },
    
    // The identity that signs the request, either payee or payer identity.
    signer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: payeeIdentity,
    },
  };
  
  
  const handleClick = async () => {
    console.log('button clicked');
    // const bytes = utils.arrayify("0xd9c50c8b276e78ba");
    // console.log(bytes);

    await createRequest();
    alert('You clicked button!');
  };
  const ERC20_ABI=[
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "allowance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientAllowance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSpender",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "transferTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  const tokenAddress='0x1d87Fc9829d03a56bdb5ba816C2603757f592D82';
  const handleBorrow = async () => {
    console.log('button clicked on borrow');
    // payRequestment();
    const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
    const tx = await tokenContract.methods
        .approve("0x0B3EDeBeAE395dc721943EC61cA670CEF351b819", web3.utils.toWei("100000000", "ether")) // Approve 1000000 tokens
        .send({ from: userAddress });
    console.log("Approval Transaction: ", tx);
    const allowance = await tokenContract.methods
    .allowance(userAddress, "0x0B3EDeBeAE395dc721943EC61cA670CEF351b819")
    .call();
    console.log("Allowance: ", allowance);
    alert('You clicked button!');
    
  };
  // const createAndPayBycontract=async()=>{
  //   const createdRequest = await requestNetwork.createRequest(params)
  //   const requestData = createdRequest.getData()

   

  //   PaymentReferenceCalculator.calculate("request id " , "salt" , "payee address")
  // };
  // const handleBorrow = async () => {
  //   console.log('button clicked');
    
  //   alert('You clicked button!');
    
  // };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center'>
      <Navbar />
      <header className='text-center mb-8 mt-8'>
        <h1 className='text-4xl font-bold text-[#038962]'>Welcome to BankOnChain</h1>
        <p className='text-lg text-gray-700'>Your decentralized solution for lending and borrowing</p>
      </header>
      <section className='w-full max-w-4xl flex flex-col md:flex-row justify-around items-center'>
        <div 
          className='feature bg-white p-6 rounded-lg shadow-md m-4 cursor-pointer' 
          onClick={handleClick} // Add onClick handler here
        >
          <h2 className='text-2xl font-semibold text-[#038962]'>lend money</h2>
          <p className='text-gray-600'>Earn interest by lending your assets to our secure pool.</p>
        </div>
        <div className='feature bg-white p-6 rounded-lg shadow-md m-4 cursor-pointer'
          onClick={handleBorrow}
        >
          <h2 className='text-2xl font-semibold text-[#038962]'>Borrow Money</h2>
          <p className='text-gray-600'>Access funds quickly and easily from our decentralized pool.</p>
        </div>
      </section>
      <footer className='mt-8 text-gray-600'>
        <p>Powered by Request Network</p>
      </footer>
    </div>
  )
}
