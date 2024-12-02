'use client'

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { providers } from "ethers";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
<<<<<<< HEAD
import { RequestNetwork } from "@requestnetwork/request-client.js"
import { Types, Utils } from "@requestnetwork/request-client.js";
=======
import { RequestNetwork,PaymentReferenceCalculator } from "@requestnetwork/request-client.js"
import { Types, Utils } from "@requestnetwork/request-client.js";
import { hasSufficientFunds } from "@requestnetwork/payment-processor";
import { approveErc20, hasErc20Approval } from "@requestnetwork/payment-processor";
import { payRequest } from "@requestnetwork/payment-processor";



>>>>>>> 24847e4 (createRequest added)
export default function Home() {

  const createRequest = async () => {
    if (window.ethereum) {
      const provider = new providers.Web3Provider(window.ethereum);
      console.log("provider", provider);
      const accounts = await provider.send("eth_accounts", []);
      console.log("Accounts:", accounts); // Should not be empty

      const signer = provider.getSigner();
      console.log('Signer:', signer);
    
<<<<<<< HEAD
      const web3SignatureProvider = new Web3SignatureProvider(provider);
=======
      const web3SignatureProvider = new Web3SignatureProvider(provider.provider);
>>>>>>> 24847e4 (createRequest added)
      console.log("Web3SignatureProvider initialized:", web3SignatureProvider);
      
      
      const requestClient=new RequestNetwork({
        nodeConnectionConfig: { 
          baseURL: "https://sepolia.gateway.request.network/",
        },
        signatureProvider: web3SignatureProvider,
      })
      console.log("request Client:",requestClient);
<<<<<<< HEAD
      const request = await requestClient.createRequest(requestCreateParameters);
      console.log("confirmed Request Data:",confirmedRequestData);
=======
      console.log("request create parameters",requestCreateParameters);
      const request = await requestClient.createRequest(requestCreateParameters);

>>>>>>> 24847e4 (createRequest added)
      const confirmedRequestData = await request.waitForConfirmation();
      console.log("confirmed Request Data:",confirmedRequestData);
      alert('Wallet connected successfully!');
    } else {
      console.error('Ethereum provider (window.ethereum) is not available. Please install MetaMask.');
    }
  };
<<<<<<< HEAD


  const payeeIdentity = '0xB23A92873a2d8d7B5a9B7c53EBB3c55055c3DA3f';
  const payerIdentity = '0x519145B771a6e450461af89980e5C17Ff6Fd8A92';
  const paymentRecipient = payeeIdentity;
  const feeRecipient = '0x0000000000000000000000000000000000000000';
=======
  const payRequest = async () => {
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: { 
        baseURL: "https://sepolia.gateway.request.network/",
      }
    });
    const request = await requestClient.fromRequestId(
      '010a72f3572a970e4b646c4602442b9a65fc3b0676e3cd3d3016bf9ef1386bb945',
    );
    const requestData = request.getData();
    console.log("request data ",requestData);
    let provider = new providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log("provider:",provider);
    const payerAddress='0xB23A92873a2d8d7B5a9B7c53EBB3c55055c3DA3f';
    console.log("payerAddress: ",payerAddress);
    // try{

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
      const request2 = await requestClient.fromRequestId(requestData.requestId);
      let requestData2 = request2.getData();
      console.log("balance: ",requestData2.balance);
      // console.log("expected amount:",requestData2.expectedAmount);
    // }
    // catch(e){
    //   console.error(e);
    // }
    // console.log("_hassufficientFunds ",_hasSufficientFunds);
    
  };

  const payeeIdentity = '0x3E3A32A4777f800953285747134d8c0D482afC71';
  const payerIdentity = '0xB23A92873a2d8d7B5a9B7c53EBB3c55055c3DA3f';
  const paymentRecipient = payeeIdentity;
  const feeRecipient = '0x0000000000000000000000000000000000010021';
>>>>>>> 24847e4 (createRequest added)
  const requestCreateParameters = 
  {
    requestInfo: {
      
      // The currency in which the request is denominated
      currency: {
        type: Types.RequestLogic.CURRENCY.ERC20,
<<<<<<< HEAD
        value: '0x370DE27fdb7D1Ff1e1BaA7D11c5820a324Cf623C',
=======
        value:'0x032748bb404231ec35D1645EEAff0d1Bf961c6c0',
>>>>>>> 24847e4 (createRequest added)
        network: 'sepolia',
      },
      
      // The expected amount as a string, in parsed units, respecting `decimals`
      // Consider using `parseUnits()` from ethers or viem
<<<<<<< HEAD
      expectedAmount: '1000000000000000000',
=======
      expectedAmount: '1000000',
>>>>>>> 24847e4 (createRequest added)
      
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
<<<<<<< HEAD
      reason: '🍕',
=======
      reason: '🍕Jinesh',
>>>>>>> 24847e4 (createRequest added)
      dueDate: '2023.06.16',
    },
    
    // The identity that signs the request, either payee or payer identity.
    signer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
<<<<<<< HEAD
      value: payeeIdentity,
=======
      value: payerIdentity,
>>>>>>> 24847e4 (createRequest added)
    },
  };
  
  
  const handleClick = async () => {
    console.log('button clicked');
    await createRequest();
    alert('You clicked button!');
<<<<<<< HEAD
    
  };
=======
  };

  const handleBorrow = async () => {
    console.log('button clicked on borrow');
    payRequest();
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
>>>>>>> 24847e4 (createRequest added)

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
<<<<<<< HEAD
          <h2 className='text-2xl font-semibold text-[#038962]'>Create Request</h2>
          <p className='text-gray-600'>Earn interest by lending your assets to our secure pool.</p>
        </div>
        <div className='feature bg-white p-6 rounded-lg shadow-md m-4'>
=======
          <h2 className='text-2xl font-semibold text-[#038962]'>lend money</h2>
          <p className='text-gray-600'>Earn interest by lending your assets to our secure pool.</p>
        </div>
        <div className='feature bg-white p-6 rounded-lg shadow-md m-4 cursor-pointer'
          onClick={handleBorrow}
        >
>>>>>>> 24847e4 (createRequest added)
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
